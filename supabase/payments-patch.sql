-- ============================================================================
-- AMISTRIÉ — payments + shipping patch
-- Run this once in Supabase SQL Editor, AFTER schema.sql and
-- security-patch.sql have already been applied.
-- ============================================================================

-- ---------- payment tracking ----------
alter table public.orders add column if not exists payment_status text not null default 'pending'
  check (payment_status in ('pending', 'paid', 'failed', 'refunded'));
alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists razorpay_payment_id text;

create index if not exists orders_razorpay_order_id_idx on public.orders (razorpay_order_id);

-- ---------- manual shipping tracking ----------
alter table public.orders add column if not exists courier text;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists tracking_url text;

-- ----------------------------------------------------------------------------
-- Order creation now happens exclusively server-side (see
-- src/app/api/checkout/create-order/route.ts), using the service_role key
-- so the price can be computed authoritatively from the real product data
-- instead of trusting whatever total the browser sends. Client-side INSERT
-- is no longer used, so remove that policy — nothing should be able to
-- create an order except the trusted server route.
-- ----------------------------------------------------------------------------
drop policy if exists "orders: insert own or guest" on public.orders;

-- SELECT/UPDATE policies (own orders, staff all, guest RPC lookup) are
-- unchanged from schema.sql / security-patch.sql.
-- ============================================================================
