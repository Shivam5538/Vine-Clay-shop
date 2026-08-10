-- ============================================================
-- Vine & Clay — RLS Policies (corrected column names)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Enable RLS on all core tables
alter table locations      enable row level security;
alter table tables         enable row level security;
alter table bookings       enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;
alter table menu_items     enable row level security;
alter table menu_categories enable row level security;

-- ============================================================
-- 2. DROP any old mis-named policies first (idempotent re-run)
-- ============================================================
drop policy if exists "public can read active locations"       on locations;
drop policy if exists "public can read available menu items"   on menu_items;
drop policy if exists "public can read active menu categories" on menu_categories;
drop policy if exists "public can insert bookings"             on bookings;
drop policy if exists "public can insert orders"               on orders;
drop policy if exists "public can insert order items"          on order_items;
drop policy if exists "staff can read bookings"                on bookings;
drop policy if exists "staff can update bookings"              on bookings;
drop policy if exists "staff can read orders"                  on orders;
drop policy if exists "staff can update orders"                on orders;
drop policy if exists "staff can read order items"             on order_items;
drop policy if exists "anon can read locations"                on locations;
drop policy if exists "anon can read tables"                   on tables;
drop policy if exists "anon can read bookings"                 on bookings;
drop policy if exists "anon can read orders"                   on orders;
drop policy if exists "anon can read order items"              on order_items;

-- ============================================================
-- 3. Public (anon) — READ policies for admin sync
-- The admin dashboard uses the anon key (no auth yet),
-- so anon needs SELECT on all operational tables.
-- ============================================================

create policy "anon can read locations"
  on locations for select
  to anon
  using (active = true);   -- Prisma column is "active" (not "is_active")

create policy "anon can read tables"
  on tables for select
  to anon
  using (true);

create policy "anon can read bookings"
  on bookings for select
  to anon
  using (true);

create policy "anon can read orders"
  on orders for select
  to anon
  using (true);

create policy "anon can read order items"
  on order_items for select
  to anon
  using (true);

-- ============================================================
-- 4. Public (anon) — INSERT policies (guest checkout & reservations)
-- ============================================================

create policy "anon can insert bookings"
  on bookings for insert
  to anon
  with check (true);

create policy "anon can insert orders"
  on orders for insert
  to anon
  with check (true);

create policy "anon can insert order items"
  on order_items for insert
  to anon
  with check (true);

-- ============================================================
-- 5. Public menu & location discovery
-- ============================================================

create policy "anon can read menu items"
  on menu_items for select
  to anon
  using (is_available = true);

create policy "anon can read menu categories"
  on menu_categories for select
  to anon
  using (true);

-- ============================================================
-- 6. Authenticated staff — full read + update access
-- ============================================================

create policy "staff can read bookings"
  on bookings for select
  to authenticated
  using (true);

create policy "staff can update bookings"
  on bookings for update
  to authenticated
  using (true);

create policy "staff can read orders"
  on orders for select
  to authenticated
  using (true);

create policy "staff can update orders"
  on orders for update
  to authenticated
  using (true);

create policy "staff can read order items"
  on order_items for select
  to authenticated
  using (true);

create policy "staff can read locations"
  on locations for select
  to authenticated
  using (true);

create policy "staff can read tables"
  on tables for select
  to authenticated
  using (true);
