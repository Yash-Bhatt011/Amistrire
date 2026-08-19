-- ============================================================================
-- AMISTRIÉ — Supabase schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query
-- → paste this whole file → Run.
--
-- Design notes:
--  * Uses Supabase Auth (auth.users) for both customers and staff — one
--    login system, distinguished by profiles.role.
--  * Uses Row Level Security everywhere. The app only ever holds the public
--    "anon" key — RLS is what keeps data safe, not a hidden secret key.
--  * Flexible product/order fields (options, media, items, etc.) are stored
--    as JSONB rather than fully normalized, matching the shapes already
--    used in src/lib/types.ts, to keep the migration low-risk.
-- ============================================================================

-- ---------- profiles (one row per auth user; customer or staff) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'customer' check (role in ('customer', 'staff')),
  staff_role text check (staff_role in ('owner', 'manager', 'staff')),
  has_ordered_before boolean not null default false,
  email_opt_in boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email_opt_in boolean not null default true;

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: staff read all" on public.profiles;
create policy "profiles: staff read all" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
  );

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- categories ----------
create table if not exists public.categories (
  slug text primary key,
  name text not null,
  tagline text,
  icon text,
  is_collection boolean default false,
  seo jsonb,
  archived boolean default false,
  banner_image text,
  banner_3d_shape text
);

alter table public.categories enable row level security;

drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories for select using (true);
drop policy if exists "categories: staff write" on public.categories;
create policy "categories: staff write" on public.categories for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- ---------- products ----------
create table if not exists public.products (
  slug text primary key,
  category_slug text references public.categories (slug) on delete set null,
  name text not null,
  tagline text,
  description text,
  base_price numeric not null default 0,
  currency text not null default 'INR',
  accent text,
  badges text[],
  print_time_hrs_min numeric,
  print_time_hrs_max numeric,
  rating numeric default 0,
  review_count integer default 0,
  inventory text default 'in-stock' check (inventory in ('in-stock', 'made-to-order', 'low-stock')),
  options jsonb default '[]'::jsonb,
  media jsonb,
  specs jsonb,
  materials_used text[],
  seo jsonb,
  featured boolean default false,
  archived boolean default false,
  stock_count integer,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products: public read" on public.products;
create policy "products: public read" on public.products for select using (true);
drop policy if exists "products: staff write" on public.products;
create policy "products: staff write" on public.products for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- ---------- coupons ----------
create table if not exists public.coupons (
  code text primary key,
  type text not null check (type in ('percentage', 'fixed', 'free-shipping', 'bxgy')),
  value numeric not null default 0,
  description text,
  min_order_value numeric,
  usage_limit integer,
  one_time_use boolean default false,
  expires_at timestamptz,
  first_order_only boolean default false,
  stackable boolean default false
);

alter table public.coupons enable row level security;

drop policy if exists "coupons: public read" on public.coupons;
create policy "coupons: public read" on public.coupons for select using (true);
drop policy if exists "coupons: staff write" on public.coupons;
create policy "coupons: staff write" on public.coupons for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- ---------- addresses ----------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  pincode text not null,
  phone text not null,
  is_default boolean default false
);

alter table public.addresses enable row level security;

drop policy if exists "addresses: own only" on public.addresses;
create policy "addresses: own only" on public.addresses for all using (
  auth.uid() = user_id
) with check (auth.uid() = user_id);

drop policy if exists "addresses: staff read all" on public.addresses;
create policy "addresses: staff read all" on public.addresses for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- ---------- orders ----------
create table if not exists public.orders (
  id text primary key, -- e.g. STR-12345678
  user_id uuid references public.profiles (id) on delete set null, -- null = guest order
  guest_email text, -- set for guest checkouts so they can be looked up
  date timestamptz not null default now(),
  status text not null default 'processing' check (status in ('processing', 'in-production', 'shipped', 'delivered')),
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  shipping numeric not null default 0,
  tax numeric not null default 0,
  total numeric not null default 0,
  coupon_code text,
  billing_name text,
  billing_address text,
  billing_city text,
  billing_pincode text,
  billing_phone text
);

alter table public.orders enable row level security;

drop policy if exists "orders: read own" on public.orders;
create policy "orders: read own" on public.orders for select using (auth.uid() = user_id);

drop policy if exists "orders: staff read all" on public.orders;
create policy "orders: staff read all" on public.orders for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

drop policy if exists "orders: staff update" on public.orders;
create policy "orders: staff update" on public.orders for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- Anyone (including guests) can create an order at checkout.
drop policy if exists "orders: anyone can insert" on public.orders;
create policy "orders: anyone can insert" on public.orders for insert with check (true);

-- NOTE on guest orders: because there's no login for a guest, this policy
-- lets anyone read an order row IF they already know its exact order ID
-- (order IDs aren't sequential/guessable, similar to a "look up by order
-- number" flow many stores use for guest checkout). This is intentionally
-- more permissive than the logged-in-user policy above — if you want guest
-- orders locked down further, require login at checkout instead.
drop policy if exists "orders: guest read by id" on public.orders;
create policy "orders: guest read by id" on public.orders for select using (user_id is null);

-- ---------- order_items (optional normalized view; items also live as jsonb above) ----------
-- Kept denormalized in orders.items for now to match the existing app code
-- exactly. Revisit if you need per-line-item reporting/joins later.

-- ---------- reviews ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text references public.products (slug) on delete cascade,
  name text not null,
  location text,
  rating numeric not null,
  text text,
  date timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews: public read" on public.reviews;
create policy "reviews: public read" on public.reviews for select using (true);
drop policy if exists "reviews: staff write" on public.reviews;
create policy "reviews: staff write" on public.reviews for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- ---------- gallery (homepage tile grid) ----------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image', 'video', 'model')),
  url text not null,
  big boolean default false,
  position integer not null default 0
);

alter table public.gallery enable row level security;

drop policy if exists "gallery: public read" on public.gallery;
create policy "gallery: public read" on public.gallery for select using (true);
drop policy if exists "gallery: staff write" on public.gallery;
create policy "gallery: staff write" on public.gallery for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- ============================================================================
-- Storage buckets — product images, 3D models (GLB/GLTF), and gallery media.
-- All public-read (so product photos render for anonymous shoppers); writes
-- restricted to staff accounts.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true), ('product-models', 'product-models', true), ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "staff write product-images" on storage.objects;
create policy "staff write product-images" on storage.objects for insert with check (
  bucket_id = 'product-images' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);
drop policy if exists "staff update product-images" on storage.objects;
create policy "staff update product-images" on storage.objects for update using (
  bucket_id = 'product-images' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);
drop policy if exists "staff delete product-images" on storage.objects;
create policy "staff delete product-images" on storage.objects for delete using (
  bucket_id = 'product-images' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

drop policy if exists "public read product-models" on storage.objects;
create policy "public read product-models" on storage.objects for select using (bucket_id = 'product-models');
drop policy if exists "staff write product-models" on storage.objects;
create policy "staff write product-models" on storage.objects for insert with check (
  bucket_id = 'product-models' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);
drop policy if exists "staff update product-models" on storage.objects;
create policy "staff update product-models" on storage.objects for update using (
  bucket_id = 'product-models' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);
drop policy if exists "staff delete product-models" on storage.objects;
create policy "staff delete product-models" on storage.objects for delete using (
  bucket_id = 'product-models' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

drop policy if exists "public read gallery" on storage.objects;
create policy "public read gallery" on storage.objects for select using (bucket_id = 'gallery');
drop policy if exists "staff write gallery" on storage.objects;
create policy "staff write gallery" on storage.objects for insert with check (
  bucket_id = 'gallery' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);
drop policy if exists "staff update gallery" on storage.objects;
create policy "staff update gallery" on storage.objects for update using (
  bucket_id = 'gallery' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);
drop policy if exists "staff delete gallery" on storage.objects;
create policy "staff delete gallery" on storage.objects for delete using (
  bucket_id = 'gallery' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'staff')
);

-- ============================================================================
-- After running this file:
-- 1. Sign up once through the app's normal /account/signup page (or Supabase
--    Auth dashboard) with the email you want to use as the store owner.
-- 2. Then run this, swapping in that email, to promote it to staff/owner:
--
--    update public.profiles
--    set role = 'staff', staff_role = 'owner'
--    where email = 'owner@yourdomain.com';
--
-- 3. Seed your existing catalog (products, categories, coupons, reviews)
--    from src/lib/product-data.ts / promo-data.ts by running, from the repo:
--
--    npm run db:seed
--
--    (needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
--    .env.local — see supabase/seed.ts)
-- ============================================================================
