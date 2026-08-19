-- ============================================================================
-- AMISTRIÉ — security patch
-- Run this once in Supabase SQL Editor, AFTER schema.sql has already been
-- applied. Safe to run multiple times (idempotent). Fixes two real
-- vulnerabilities found in a security audit — see the comments below.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FIX 1 — Privilege escalation via profiles.role
--
-- The original "profiles: update own" policy only checked ROW ownership
-- (auth.uid() = id), not WHICH COLUMNS were being changed. Row Level
-- Security has no built-in concept of "you can edit this row but only
-- these columns" — so as written, any logged-in customer could call:
--
--   supabase.from('profiles').update({ role: 'staff' }).eq('id', myOwnId)
--
-- ...directly from the browser console and grant themselves admin access.
-- The fix is a trigger that blocks any change to role/staff_role unless
-- it's coming from a context with no end-user session attached (the SQL
-- Editor, or a service_role key) — i.e. never from a normal logged-in
-- customer request.
-- ----------------------------------------------------------------------------
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.staff_role is distinct from old.staff_role)
     and auth.uid() is not null
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Changing role or staff_role is not permitted from a client request.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_role_escalation_trigger on public.profiles;
create trigger prevent_role_escalation_trigger
  before update on public.profiles
  for each row execute procedure public.prevent_role_escalation();

-- (The promote-to-staff snippet in schema.sql still works fine — it runs
-- via the SQL Editor, where auth.uid() is null, so it's exempt.)

-- ----------------------------------------------------------------------------
-- FIX 2 — IDOR: any guest order was readable by anyone
--
-- The original "orders: guest read by id" policy was:
--   for select using (user_id is null)
--
-- RLS filters ROWS, not query shapes — the app always queried by a
-- specific order ID, but the policy itself placed no such restriction. A
-- direct call to the Supabase REST API (trivial to make — the anon key is
-- public by design) could run `select * from orders where user_id is
-- null` and get back every guest order ever placed: names, addresses,
-- phone numbers, order contents.
--
-- The fix: remove that policy entirely, add a random per-order
-- guest_token that only the browser that placed the order knows, and
-- expose guest order lookup only through a SECURITY DEFINER function that
-- requires BOTH the order id AND its token to match. This is the same
-- pattern most stores use for "look up your order" — a single opaque
-- link/code, not an open table scan.
-- ----------------------------------------------------------------------------
alter table public.orders add column if not exists guest_token uuid not null default gen_random_uuid();

drop policy if exists "orders: guest read by id" on public.orders;

create or replace function public.get_guest_order(p_order_id text, p_token uuid)
returns setof public.orders
language sql
security definer set search_path = public
stable
as $$
  select * from public.orders
  where id = p_order_id
    and user_id is null
    and guest_token = p_token;
$$;

revoke all on function public.get_guest_order(text, uuid) from public;
grant execute on function public.get_guest_order(text, uuid) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- FIX 3 — Order insert didn't stop user_id from being spoofed
--
-- The original "orders: anyone can insert" policy was `with check (true)`,
-- meaning a logged-in customer could insert an order row with `user_id`
-- set to a DIFFERENT real user's id — planting a bogus order in someone
-- else's order history. Now insert is only allowed for a guest order
-- (user_id null) or an order tagged with the caller's own id.
-- ----------------------------------------------------------------------------
drop policy if exists "orders: anyone can insert" on public.orders;
drop policy if exists "orders: insert own or guest" on public.orders;

create policy "orders: insert own or guest" on public.orders for insert with check (
  user_id is null or user_id = auth.uid()
);

-- ----------------------------------------------------------------------------
-- FIX 4 — Storage buckets had no file-size or MIME-type limits
--
-- Previously any authenticated staff upload accepted any file of any size
-- into product-images/product-models/gallery. This constrains uploads to
-- sane types/sizes (adjust limits if you need larger 3D model files).
-- ----------------------------------------------------------------------------
update storage.buckets
set file_size_limit = 8 * 1024 * 1024, -- 8MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id in ('product-images', 'gallery');

update storage.buckets
set file_size_limit = 50 * 1024 * 1024, -- 50MB (GLB files can be large)
    allowed_mime_types = array['model/gltf-binary', 'model/gltf+json', 'application/octet-stream']
where id = 'product-models';

-- ============================================================================
-- After running this file, existing guest orders placed before the patch
-- will have a freshly generated (unknown to the customer) guest_token, so
-- old guest invoice links will stop working — new orders are unaffected.
-- ============================================================================
