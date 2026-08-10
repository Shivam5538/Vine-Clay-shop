-- Row Level Security (RLS) Policies for Vine & Clay Admin System
-- Enforces role-based permissions (owner, manager, staff) at the Postgres database layer.

-- 1. Enable RLS on all operational tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. Helper functions to check current user role & location scope
CREATE OR REPLACE FUNCTION current_staff_role()
RETURNS text AS $$
  SELECT role::text FROM staff_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_has_location_access(loc_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Owners have global access
  IF current_staff_role() = 'owner' THEN
    RETURN true;
  END IF;

  -- Managers and Staff must be assigned to the location
  RETURN EXISTS (
    SELECT 1 FROM staff_locations sl
    JOIN staff_users su ON su.id = sl.staff_user_id
    WHERE su.auth_user_id = auth.uid() AND sl.location_id = loc_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. RLS Policies by Table

-- LOCATIONS
-- Public can read active locations.
CREATE POLICY "Public read active locations" ON locations
  FOR SELECT USING (active = true);

-- Staff/Managers/Owners read assigned locations.
CREATE POLICY "Staff read assigned locations" ON locations
  FOR SELECT USING (user_has_location_access(id));

-- Only Owners can create/update/delete locations.
CREATE POLICY "Owner full control locations" ON locations
  FOR ALL USING (current_staff_role() = 'owner');

-- ORDERS & ORDER ITEMS
-- Staff can view orders for their assigned locations.
CREATE POLICY "Staff view location orders" ON orders
  FOR SELECT USING (user_has_location_access(location_id));

-- Staff can create & update order statuses for assigned locations.
CREATE POLICY "Staff insert/update orders" ON orders
  FOR INSERT WITH CHECK (user_has_location_access(location_id));

CREATE POLICY "Staff update order status" ON orders
  FOR UPDATE USING (user_has_location_access(location_id));

-- BOOKINGS
-- Staff can view/create/update bookings for assigned locations.
CREATE POLICY "Staff manage bookings" ON bookings
  FOR ALL USING (user_has_location_access(location_id));

-- MENU CATEGORIES & ITEMS
-- Public read access for menu catalog.
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read menu categories" ON menu_categories FOR SELECT USING (true);

-- Managers and Owners can edit menu items & categories.
CREATE POLICY "Manager/Owner edit menu items" ON menu_items
  FOR ALL USING (current_staff_role() IN ('owner', 'manager'));

CREATE POLICY "Manager/Owner edit categories" ON menu_categories
  FOR ALL USING (current_staff_role() IN ('owner', 'manager'));

-- STAFF USERS
-- Only Owners can view/manage staff users.
CREATE POLICY "Owner manage staff users" ON staff_users
  FOR ALL USING (current_staff_role() = 'owner');

-- ACTIVITY LOGS
-- Read-only for managers and owners.
CREATE POLICY "Manager/Owner view activity logs" ON activity_logs
  FOR SELECT USING (current_staff_role() IN ('owner', 'manager'));

-- All authenticated staff can append activity logs.
CREATE POLICY "Staff append activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
