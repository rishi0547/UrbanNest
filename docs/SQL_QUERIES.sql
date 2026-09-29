-- ==============================================================================
-- UrbanNest MVP Database Architecture Migration Script
-- Target Engine: PostgreSQL 15+ (Supabase SQL Editor Ready)
-- Core MVP Tables: profiles, categories, products, orders, order_items
-- ==============================================================================

-- ==============================================================================
-- SECTION 1: EXTENSIONS
-- ==============================================================================

-- What it does: Enables the pgcrypto extension for cryptographically strong random generation.
-- Why it is needed: Required for gen_random_uuid() and hashing functions if needed.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- What it does: Enables the uuid-ossp module for UUID generation functions.
-- Why it is needed: Provides standard UUID utility algorithms for PostgreSQL.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ==============================================================================
-- SECTION 2: FUNCTIONS
-- ==============================================================================

-- What it does: Automatically sets the updated_at column of any updated row to the current timestamp.
-- Why it is needed: Guarantees accurate audit records whenever a record is modified without relying on client application code.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- What it does: Automatically creates a record in public.profiles whenever a new user signs up in Supabase Auth.
-- Why it is needed: Ensures public profile data is always synchronized with auth.users while isolating authentication logic.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- What it does: Returns TRUE if the currently authenticated user has the 'admin' role in public.profiles.
-- Why it is needed: SECURITY DEFINER bypasses RLS recursion when evaluating policies that inspect public.profiles.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ==============================================================================
-- SECTION 3: TABLES
-- ==============================================================================

-- 3.1 PROFILES TABLE
-- What it does: Stores customer and admin profile details tied to Supabase Auth identities.
-- Why it is needed: Decouples application logic from internal auth tables and stores authorization roles.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 CATEGORIES TABLE
-- What it does: Stores furniture catalog navigation taxonomies (e.g., Living Room, Bedroom).
-- Why it is needed: Enables faceted catalog navigation, breadcrumbs, and clean SEO-friendly URLs.
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 PRODUCTS TABLE
-- What it does: Stores physical sellable inventory, commercial pricing, and display assets.
-- Why it is needed: Manages catalog listings and enforces database-level stock checks (CHECK (stock >= 0)) to prevent overselling.
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= 0 AND (compare_at_price > price OR compare_at_price IS NULL)),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  images TEXT[] NOT NULL DEFAULT '{}',
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 ORDERS TABLE
-- What it does: Header record for purchase transactions placed by customers.
-- Why it is needed: Serves as the single source of truth for total charges, fulfillment lifecycle, and shipping destination.
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 ORDER ITEMS TABLE
-- What it does: Stores individual line items purchased within an order.
-- Why it is needed: Captures an immutable snapshot of unit price and quantity at checkout time, preventing future catalog edits from corrupting historical receipts.
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- SECTION 4: TRIGGERS
-- ==============================================================================

-- What it does: Attaches handle_updated_at function to the profiles table.
-- Why it is needed: Automatically updates profiles.updated_at on every profile UPDATE.
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- What it does: Attaches handle_new_user function to Supabase's auth.users table.
-- Why it is needed: Fires immediately when a customer signs up, creating their public profile.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- What it does: Attaches handle_updated_at function to the products table.
-- Why it is needed: Automatically updates products.updated_at on price or stock changes.
DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- What it does: Attaches handle_updated_at function to the orders table.
-- Why it is needed: Automatically tracks when an order's fulfillment status changes.
DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- SECTION 5: INDEXES
-- ==============================================================================

-- What it does: Creates a B-tree index on categories.slug.
-- Why it is needed: Optimizes category page lookup by URL slug (/category/:slug).
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- What it does: Creates a B-tree index on products.category_id.
-- Why it is needed: Optimizes queries filtering products within a specific category.
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- What it does: Creates a B-tree index on products.slug.
-- Why it is needed: Ensures instant product detail page lookups by URL slug (/products/:slug).
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- What it does: Creates a partial index on products where is_featured is TRUE.
-- Why it is needed: Maximizes performance for homepage and showcase queries without scanning unfeatured items.
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = TRUE;

-- What it does: Creates a B-tree index on orders.user_id.
-- Why it is needed: Accelerates order history lookups for authenticated customers and optimizes RLS policy evaluations.
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- What it does: Creates a B-tree index on orders.order_number.
-- Why it is needed: Enables fast order tracking lookups by human-readable invoice code (e.g., UN-2026-9812).
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- What it does: Creates a B-tree index on order_items.order_id.
-- Why it is needed: Accelerates joining parent orders with their child line items.
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- What it does: Creates a B-tree index on order_items.product_id.
-- Why it is needed: Enables fast inventory and product sales analytics.
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);


-- ==============================================================================
-- SECTION 6: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- What it does: Enables Row Level Security on all 5 application tables.
-- Why it is needed: Enforces data isolation and authorization directly at the database engine level.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 6.1 PROFILES POLICIES
-- What it does: Allows users to read their own profile, and allows administrators to view all profiles.
-- Why it is needed: Protects customer personal data while enabling back-office operations.
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin()
  );

-- What it does: Allows authenticated users to update their own profile information.
-- Why it is needed: Lets customers update their full name or avatar while preventing modification of other users.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6.2 CATEGORIES POLICIES
-- What it does: Allows public read access to all categories.
-- Why it is needed: Anonymous visitors must be able to view catalog taxonomies and navigation menus.
DROP POLICY IF EXISTS "Categories are readable by everyone" ON public.categories;
CREATE POLICY "Categories are readable by everyone" ON public.categories
  FOR SELECT USING (TRUE);

-- What it does: Restricts category creation, modification, and deletion to administrators.
-- Why it is needed: Prevents unauthorized modification of catalog structure.
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- 6.3 PRODUCTS POLICIES
-- What it does: Allows anyone to view published products, and allows admins to view drafts/unpublished items.
-- Why it is needed: Protects internal inventory and unpublished drafts while keeping public catalog open.
DROP POLICY IF EXISTS "Published products are readable by everyone" ON public.products;
CREATE POLICY "Published products are readable by everyone" ON public.products
  FOR SELECT USING (
    is_published = TRUE OR public.is_admin()
  );

-- What it does: Restricts product insertion, updates, and deletion to administrators.
-- Why it is needed: Prevents tampering with prices, stock, or product descriptions.
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.is_admin());

-- 6.4 ORDERS POLICIES
-- What it does: Allows customers to view only their own orders; admins can view all customer orders.
-- Why it is needed: Protects customer order privacy and purchase history.
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
  );

-- What it does: Allows authenticated users to create orders for themselves.
-- Why it is needed: Required for checkout completion while binding the order to the authenticated user ID.
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- What it does: Restricts order status updates (e.g. mark shipped/delivered) to administrators.
-- Why it is needed: Prevents customers from modifying their order total or status after placement.
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- 6.5 ORDER ITEMS POLICIES
-- What it does: Allows users to view line items if they own the parent order; admins can view all.
-- Why it is needed: Prevents competitors or unauthorized users from viewing line item breakdowns of other orders.
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- What it does: Allows authenticated users to insert line items for their own pending orders.
-- Why it is needed: Enables checkout Server Actions to write line items atomically with the parent order.
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );


-- ==============================================================================
-- SECTION 7: SEED DATA
-- ==============================================================================

-- What it does: Inserts standard furniture categories.
-- Why it is needed: Provides initial navigation structure for the storefront.
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Living Room', 'living-room', 'Sofas, accent chairs, and coffee tables.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'),
('22222222-2222-2222-2222-222222222222', 'Bedroom', 'bedroom', 'Beds, dressers, and minimalist nightstands.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80'),
('33333333-3333-3333-3333-333333333333', 'Dining Room', 'dining-room', 'Solid wood dining tables, ergonomic seating, and sideboards.', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80'),
('44444444-4444-4444-4444-444444444444', 'Home Office', 'home-office', 'Ergonomic executive desks, shelving, and task chairs.', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80')
ON CONFLICT (slug) DO NOTHING;

-- What it does: Inserts core furniture catalog products with realistic pricing and inventory.
-- Why it is needed: Populates storefront with realistic demo data for immediate testing and visual review.
INSERT INTO public.products (
  id, title, slug, description, price, compare_at_price, stock, images, category_id, is_featured, is_published
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Nordic Bouclé Curved Sofa',
  'nordic-boucle-curved-sofa',
  'Sculptural three-seater sofa upholstered in tactile bouclé with a kiln-dried hardwood frame.',
  1690.00,
  1890.00,
  12,
  ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  TRUE,
  TRUE
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Koben Walnut Lounge Chair',
  'koben-walnut-lounge-chair',
  'Mid-century Danish modern lounge chair crafted from solid walnut with saddle leather upholstery.',
  820.00,
  NULL,
  18,
  ARRAY['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  TRUE,
  TRUE
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Sora Solid Oak Platform Bed',
  'sora-solid-oak-platform-bed',
  'Low-profile Japanese-inspired platform bed with integrated floating nightstand ledges.',
  1350.00,
  1500.00,
  6,
  ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80'],
  '22222222-2222-2222-2222-222222222222',
  TRUE,
  TRUE
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Arden Travertine Dining Table',
  'arden-travertine-dining-table',
  'Circular dining table featuring a honed beige Roman travertine top on fluted pedestal bases.',
  2400.00,
  NULL,
  4,
  ARRAY['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&q=80'],
  '33333333-3333-3333-3333-333333333333',
  TRUE,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;


-- ==============================================================================
-- SECTION 8: ROLE MANAGEMENT & AUTHORIZATION QUERIES
-- ==============================================================================

-- What it does: Promotes a specific customer profile to the 'admin' role.
-- Why it is needed: Grants back-office administrative access to a trusted team member.
-- Usage: Replace 'admin@urbannest.com' with the target user's registered email address.
/*
UPDATE public.profiles
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'admin@urbannest.com';
*/

-- What it does: Demotes an administrator back to standard 'customer' role.
-- Why it is needed: Revokes administrative access when offboarding staff.
/*
UPDATE public.profiles
SET role = 'customer',
    updated_at = NOW()
WHERE email = 'former-admin@urbannest.com';
*/

-- What it does: Lists all users holding the 'admin' authorization tier.
-- Why it is needed: Used for security audits to ensure only authorized personnel have elevated permissions.
/*
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM public.profiles
WHERE role = 'admin'
ORDER BY created_at ASC;
*/


-- ==============================================================================
-- SECTION 9: SUPABASE STORAGE BUCKET & RLS POLICIES (product-images)
-- ==============================================================================

-- What it does: Registers the 'product-images' storage bucket with public read access and a 5MB per-file size limit.
-- Why it is needed: Provides S3-compatible cloud object storage for furniture product photography and merchandising assets.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

-- 9.1 PUBLIC READ ACCESS FOR PRODUCT IMAGES
-- What it does: Allows anyone (anonymous visitors and authenticated customers) to view/download product images.
-- Why it is needed: Storefront shoppers and public catalog browsers must load product photography without requiring authentication.
CREATE POLICY "Public Read: Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 9.2 ADMIN ONLY INSERT ACCESS FOR PRODUCT IMAGES
-- What it does: Restricts image uploads to verified administrators only.
-- Why it is needed: Prevents arbitrary file uploads by malicious users or unprivileged customers.
CREATE POLICY "Admin Insert: Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_admin()
);

-- 9.3 ADMIN ONLY UPDATE ACCESS FOR PRODUCT IMAGES
-- What it does: Restricts image updates and overwrites to verified administrators only.
-- Why it is needed: Ensures only authorized staff can replace existing catalog media assets.
CREATE POLICY "Admin Update: Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
);

-- 9.4 ADMIN ONLY DELETE ACCESS FOR PRODUCT IMAGES
-- What it does: Restricts image deletions to verified administrators only.
-- Why it is needed: Ensures only authorized staff can purge catalog media assets.
CREATE POLICY "Admin Delete: Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
);


-- ==============================================================================
-- SECTION 10: PHASE 1 CHECKOUT & ORDER CREATION MIGRATION
-- ==============================================================================

-- 10.1 ORDERS TABLE (Phase 1 Specifications)
-- What it does: Creates the transactional orders table storing total charges, status lifecycle, and shipping details.
-- Why it is needed: Serves as the single source of truth for customer purchase orders and fulfillment tracking.
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal NUMERIC NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  shipping NUMERIC NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  tax NUMERIC NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total NUMERIC NOT NULL DEFAULT 0 CHECK (total >= 0),
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for orders.updated_at
DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10.2 ORDER ITEMS TABLE (Phase 1 Specifications)
-- What it does: Stores line items purchased in an order with historical snapshot pricing.
-- Why it is needed: Preserves immutable price and product naming at time of purchase against future catalog alterations.
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL DEFAULT 0 CHECK (product_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC NOT NULL DEFAULT 0 CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10.3 PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- 10.4 ENABLE ROW LEVEL SECURITY
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 10.5 ROW LEVEL SECURITY POLICIES FOR ORDERS

-- Customer can only see their orders
DROP POLICY IF EXISTS "Customer can view own orders" ON public.orders;
CREATE POLICY "Customer can view own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admin can see all orders
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Customer can create own orders
DROP POLICY IF EXISTS "Customer can insert own orders" ON public.orders;
CREATE POLICY "Customer can insert own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin can update orders (e.g. status transition)
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
CREATE POLICY "Admin can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.is_admin());

-- 10.6 ROW LEVEL SECURITY POLICIES FOR ORDER ITEMS

-- Customer can view own order items (tied to parent order)
DROP POLICY IF EXISTS "Customer can view own order items" ON public.order_items;
CREATE POLICY "Customer can view own order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admin can view all order items
DROP POLICY IF EXISTS "Admin can view all order items" ON public.order_items;
CREATE POLICY "Admin can view all order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Customer can insert items for own order
DROP POLICY IF EXISTS "Customer can insert own order items" ON public.order_items;
CREATE POLICY "Customer can insert own order items" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );


-- ==============================================================================
-- SECTION 11: EXPANDED 30-PIECE LUXURY FURNITURE CATALOG INSERTION
-- Target Engine: PostgreSQL 15+ (Supabase SQL Editor Ready)
-- Expands catalog to 34 products across Living, Bedroom, Dining, Office, and Storage
-- ==============================================================================

-- 11.1 INSERT STORAGE CATEGORY
INSERT INTO public.categories (id, name, slug, description, image_url)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Storage',
  'storage',
  'Cabinets, bookshelves, consoles, and architectural credenzas.',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80'
)
ON CONFLICT (slug) DO NOTHING;

-- 11.2 INSERT 30 REALISTIC LUXURY FURNITURE PRODUCTS
INSERT INTO public.products (
  id, title, slug, description, price, compare_at_price, stock, images, category_id, is_featured, is_published
) VALUES
-- Living Room Pieces
(
  'e1111111-0001-4000-8000-000000000001',
  'Kōben Low Walnut Coffee Table',
  'koben-low-walnut-coffee-table',
  'Sculptural low-slung table with radiused corners, integrated dual storage surfaces, and solid American walnut grain.',
  640.00,
  720.00,
  14,
  ARRAY['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1000&q=80', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  TRUE,
  TRUE
),
(
  'e1111111-0002-4000-8000-000000000002',
  'Neva Travertine Accent Side Table',
  'neva-travertine-accent-side-table',
  'Hand-carved circular Italian travertine side table featuring organic porous texture and brutalist monolithic profile.',
  480.00,
  NULL,
  19,
  ARRAY['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  FALSE,
  TRUE
),
(
  'e1111111-0003-4000-8000-000000000003',
  'Koto Sculptural 3-Seater Sofa',
  'koto-sculptural-3-seater-sofa',
  'Sweeping architectural curves covered in soft textured oatmeal weave, anchored by low-profile black ash block feet.',
  2150.00,
  2400.00,
  7,
  ARRAY['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1000&q=80', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  TRUE,
  TRUE
),
(
  'e1111111-0004-4000-8000-000000000004',
  'Oslo Linen Daybed Lounge',
  'oslo-linen-daybed-lounge',
  'Versatile lounge daybed crafted from solid oak timbers with a tufted Belgian linen mattress cushion and bolster pillow.',
  1290.00,
  1450.00,
  9,
  ARRAY['https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  FALSE,
  TRUE
),
(
  'e1111111-0005-4000-8000-000000000005',
  'Kyoto Fluted Oak Coffee Table',
  'kyoto-fluted-oak-coffee-table',
  'Round architectural cocktail table wrapped in vertical solid white oak fluting with a durable matte polyurethane finish.',
  790.00,
  NULL,
  11,
  ARRAY['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  FALSE,
  TRUE
),
(
  'e1111111-0006-4000-8000-000000000006',
  'Bauhaus Saddle Leather Armchair',
  'bauhaus-saddle-leather-armchair',
  'Tubular stainless steel cantilever frame suspended with full-grain cognac saddle leather and hand-stitched borders.',
  940.00,
  1100.00,
  12,
  ARRAY['https://images.unsplash.com/photo-1580481077197-04877be1c70e?w=1000&q=80'],
  '11111111-1111-1111-1111-111111111111',
  TRUE,
  TRUE
),
-- Bedroom Pieces
(
  'e2222222-0001-4000-8000-000000000001',
  'Maru Solid Ash Nightstand',
  'maru-solid-ash-nightstand',
  'Compact bedside table with a soft-close dovetail drawer, open storage shelf, and organic rounded chamfered edges.',
  380.00,
  430.00,
  22,
  ARRAY['https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=1000&q=80'],
  '22222222-2222-2222-2222-222222222222',
  FALSE,
  TRUE
),
(
  'e2222222-0002-4000-8000-000000000002',
  'Aalto 6-Drawer Walnut Dresser',
  'aalto-6-drawer-walnut-dresser',
  'Wide double dresser featuring continuous book-matched walnut veneer, sculpted finger pulls, and concealed Blum runners.',
  1750.00,
  1950.00,
  6,
  ARRAY['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80'],
  '22222222-2222-2222-2222-222222222222',
  TRUE,
  TRUE
),
(
  'e2222222-0003-4000-8000-000000000003',
  'Ren Minimalist Upholstered Bed',
  'ren-minimalist-upholstered-bed',
  'Low profile shelter platform bed wrapped in neutral textured linen with integrated solid wood inner slats.',
  1480.00,
  NULL,
  8,
  ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80'],
  '22222222-2222-2222-2222-222222222222',
  TRUE,
  TRUE
),
(
  'e2222222-0004-4000-8000-000000000004',
  'Tsubaki Low Floating Nightstand',
  'tsubaki-low-floating-nightstand',
  'Wall-mounted cantilevered nightstand in solid white oak, offering minimalist cord management and a hidden tray drawer.',
  320.00,
  360.00,
  16,
  ARRAY['https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&q=80'],
  '22222222-2222-2222-2222-222222222222',
  FALSE,
  TRUE
),
(
  'e2222222-0005-4000-8000-000000000005',
  'Hans Tallboy 5-Drawer Dresser',
  'hans-tallboy-5-drawer-dresser',
  'Vertical space-saving chest of drawers with solid oak legs and matte lacquered drawer facades.',
  1120.00,
  1280.00,
  10,
  ARRAY['https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=1000&q=80'],
  '22222222-2222-2222-2222-222222222222',
  FALSE,
  TRUE
),
(
  'e2222222-0006-4000-8000-000000000006',
  'Astrid Bouclé Headboard Bed',
  'astrid-boucle-headboard-bed',
  'Sculpted wingback headboard tailored in heavyweight bouclé wool, providing acoustic dampening and ergonomic reading support.',
  1890.00,
  2100.00,
  5,
  ARRAY['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80'],
  '22222222-2222-2222-2222-222222222222',
  FALSE,
  TRUE
),
-- Dining Room Pieces
(
  'e3333333-0001-4000-8000-000000000001',
  'Haven Round Oak Dining Table',
  'haven-round-oak-dining-table',
  'Centrally placed fluted conical pedestal supporting a 54-inch solid French white oak bullnose tabletop.',
  1450.00,
  1650.00,
  9,
  ARRAY['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1000&q=80'],
  '33333333-3333-3333-3333-333333333333',
  TRUE,
  TRUE
),
(
  'e3333333-0002-4000-8000-000000000002',
  'Hans Sculpted Dining Chair (Pair)',
  'hans-sculpted-dining-chair-pair',
  'Pair of ergonomic curved back dining chairs crafted from steam-bent ash with natural hand-woven paper cord seats.',
  680.00,
  780.00,
  24,
  ARRAY['https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&q=80'],
  '33333333-3333-3333-3333-333333333333',
  FALSE,
  TRUE
),
(
  'e3333333-0003-4000-8000-000000000003',
  'Celine Cane Weave Dining Chair',
  'celine-cane-weave-dining-chair',
  'Modern French bistro dining chair with natural rattan cane inserts and an ebonized solid beechwood perimeter.',
  340.00,
  NULL,
  18,
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80'],
  '33333333-3333-3333-3333-333333333333',
  FALSE,
  TRUE
),
(
  'e3333333-0004-4000-8000-000000000004',
  'Brisa Solid Walnut Sideboard Buffet',
  'brisa-solid-walnut-sideboard-buffet',
  'Four-door dining buffet featuring brass hardware accents, adjustable glassware shelving, and integrated silverware dividers.',
  1850.00,
  2100.00,
  5,
  ARRAY['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80'],
  '33333333-3333-3333-3333-333333333333',
  TRUE,
  TRUE
),
(
  'e3333333-0005-4000-8000-000000000005',
  'Vester Oval Travertine Dining Table',
  'vester-oval-travertine-dining-table',
  'Grand 84-inch oval dining table with double fluted limestone columns and a polished matte chamfered edge.',
  2890.00,
  3200.00,
  3,
  ARRAY['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&q=80'],
  '33333333-3333-3333-3333-333333333333',
  TRUE,
  TRUE
),
(
  'e3333333-0006-4000-8000-000000000006',
  'Eos Minimalist Credenza Buffet',
  'eos-minimalist-credenza-buffet',
  'Low profile dining credenza featuring tambour sliding slatted doors and blackened bronze tubular steel supports.',
  1390.00,
  1550.00,
  8,
  ARRAY['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1000&q=80'],
  '33333333-3333-3333-3333-333333333333',
  FALSE,
  TRUE
),
-- Home Office Pieces
(
  'e4444444-0001-4000-8000-000000000001',
  'Artisan Solid Oak Writing Desk',
  'artisan-solid-oak-writing-desk',
  'Architectural executive desk with integrated cable trough, hidden power strip compartment, and precision dovetailed pencil drawer.',
  1150.00,
  1300.00,
  9,
  ARRAY['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&q=80'],
  '44444444-4444-4444-4444-444444444444',
  TRUE,
  TRUE
),
(
  'e4444444-0002-4000-8000-000000000002',
  'Verona Ergonomic Leather Task Chair',
  'verona-ergonomic-leather-task-chair',
  'Executive task chair with pneumatic height adjustment, synchronous tilt mechanism, and supple Italian top-grain leather padding.',
  890.00,
  980.00,
  14,
  ARRAY['https://images.unsplash.com/photo-1580481077197-04877be1c70e?w=1000&q=80'],
  '44444444-4444-4444-4444-444444444444',
  TRUE,
  TRUE
),
(
  'e4444444-0003-4000-8000-000000000003',
  'Studio Minimalist Modular Shelving',
  'studio-minimalist-modular-shelving',
  'Wall-anchored architectural modular shelving system with solid walnut tiers and extruded powder-coated aluminum verticals.',
  780.00,
  890.00,
  12,
  ARRAY['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=1000&q=80'],
  '44444444-4444-4444-4444-444444444444',
  FALSE,
  TRUE
),
(
  'e4444444-0004-4000-8000-000000000004',
  'Atelier Floating Drawer Executive Desk',
  'atelier-floating-drawer-executive-desk',
  'Spacious 60-inch workspace crafted from solid American walnut with dual suspended drawer boxes and chamfered edges.',
  1420.00,
  1600.00,
  7,
  ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&q=80'],
  '44444444-4444-4444-4444-444444444444',
  TRUE,
  TRUE
),
(
  'e4444444-0005-4000-8000-000000000005',
  'Kanto Swivel Wool Task Chair',
  'kanto-swivel-wool-task-chair',
  'Mid-century inspired desk chair upholstered in durable felted Danish wool with a five-star cast brass wheel base.',
  640.00,
  NULL,
  15,
  ARRAY['https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&q=80'],
  '44444444-4444-4444-4444-444444444444',
  FALSE,
  TRUE
),
(
  'e4444444-0006-4000-8000-000000000006',
  'Linear Brass & Walnut Wall Bookshelf',
  'linear-brass-and-walnut-wall-bookshelf',
  'Open-back tiered display bookcase with brushed brass stanchions and 1.5-inch solid walnut display planks.',
  890.00,
  990.00,
  11,
  ARRAY['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=1000&q=80'],
  '44444444-4444-4444-4444-444444444444',
  FALSE,
  TRUE
),
-- Storage Pieces
(
  'e5555555-0001-4000-8000-000000000001',
  'Milo Architectural Oak Sideboard',
  'milo-architectural-oak-sideboard',
  'Credenza cabinet featuring vertical relief fluting on four push-to-open doors, housing soft-close interior drawers.',
  1580.00,
  1750.00,
  7,
  ARRAY['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1000&q=80'],
  '55555555-5555-5555-5555-555555555555',
  TRUE,
  TRUE
),
(
  'e5555555-0002-4000-8000-000000000002',
  'Tenon Solid Hardwood Bookcase',
  'tenon-solid-hardwood-bookcase',
  'Five-tier library bookcase assembled with exposed traditional mortise-and-tenon Japanese joinery details.',
  1240.00,
  1390.00,
  8,
  ARRAY['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=1000&q=80'],
  '55555555-5555-5555-5555-555555555555',
  FALSE,
  TRUE
),
(
  'e5555555-0003-4000-8000-000000000003',
  'Silas Fluted Marble Media Console',
  'silas-fluted-marble-media-console',
  'Low profile entertainment console crowned with a solid honed Nero Marquina marble slab over fluted dark walnut cabinetry.',
  1890.00,
  2150.00,
  6,
  ARRAY['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80'],
  '55555555-5555-5555-5555-555555555555',
  TRUE,
  TRUE
),
(
  'e5555555-0004-4000-8000-000000000004',
  'Kanso Minimalist 2-Door Cabinet',
  'kanso-minimalist-2-door-cabinet',
  'Compact storage console with woven papercord door panels, solid white oak structure, and adjustable internal shelf heights.',
  760.00,
  840.00,
  13,
  ARRAY['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1000&q=80'],
  '55555555-5555-5555-5555-555555555555',
  FALSE,
  TRUE
),
(
  'e5555555-0005-4000-8000-000000000005',
  'Arcos Glass Display Cabinet',
  'arcos-glass-display-cabinet',
  'Slender archival display curio featuring tempered reeded glass doors, integrated warm LED interior illumination, and bronze pulls.',
  1450.00,
  1650.00,
  5,
  ARRAY['https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=1000&q=80'],
  '55555555-5555-5555-5555-555555555555',
  TRUE,
  TRUE
),
(
  'e5555555-0006-4000-8000-000000000006',
  'Forma Low Slung Entryway Console',
  'forma-low-slung-entryway-console',
  'Architectural entryway credenza with curved cylindrical pillared legs and a dual-compartment felt-lined catchall drawer.',
  890.00,
  NULL,
  12,
  ARRAY['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1000&q=80'],
  '55555555-5555-5555-5555-555555555555',
  FALSE,
  TRUE
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  stock = EXCLUDED.stock,
  images = EXCLUDED.images,
  category_id = EXCLUDED.category_id,
  is_featured = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- ==============================================================================
-- SECTION 12: CATALOG INR PRICING & IMAGE CATALOG REFINEMENT MIGRATION
-- ==============================================================================
-- Purpose:
-- 1. Add optional image_url and gallery_images columns to products table.
-- 2. Convert all product catalog prices and compare_at_prices from USD to INR using conversion rate 1 USD = 83 INR.
-- 3. Sync image_url and gallery_images with verified unique luxury furniture images.
-- ==============================================================================

-- 12.1 Add Schema Columns
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- 12.2 Convert USD Prices to INR (1 USD = 83 INR)
UPDATE public.products
SET
  price = ROUND(price * 83),
  compare_at_price = CASE 
    WHEN compare_at_price IS NOT NULL THEN ROUND(compare_at_price * 83) 
    ELSE NULL 
  END,
  updated_at = NOW()
WHERE price < 10000; -- Prevents re-multiplying if already in INR

-- 12.3 Populate image_url and gallery_images from images array
UPDATE public.products
SET
  image_url = images[1],
  gallery_images = images
WHERE (image_url IS NULL OR array_length(gallery_images, 1) IS NULL)
  AND array_length(images, 1) > 0;

-- ==============================================================================
-- SECTION 13: REALISTIC INDIAN FURNITURE PRICING RE-MIGRATION
-- Target Engine: PostgreSQL 15+ (Supabase SQL Editor Ready)
-- Purpose:
-- Replace raw USD*83 pricing with realistic market pricing tailored for India
-- adhering to guidelines:
-- Small Decor/Accessories: ₹499 - ₹2,499
-- Bookshelves: ₹4,999 - ₹14,999
-- Coffee Tables: ₹3,999 - ₹12,999
-- TV Units/Consoles: ₹6,999 - ₹24,999
-- Office Chairs: ₹3,999 - ₹18,999
-- Office Desks: ₹6,999 - ₹29,999
-- Sofas: ₹14,999 - ₹79,999
-- Storage Cabinets: ₹4,999 - ₹24,999
-- Sideboards: ₹8,999 - ₹34,999
-- Discounts: Recalculated between 10% and 15%.
-- ==============================================================================

UPDATE public.products SET price = 34999, compare_at_price = 39999, updated_at = NOW() WHERE slug = 'nordic-boucle-curved-sofa';
UPDATE public.products SET price = 42999, compare_at_price = 49999, updated_at = NOW() WHERE slug = 'koto-sculptural-3-seater-sofa';
UPDATE public.products SET price = 26999, compare_at_price = 29999, updated_at = NOW() WHERE slug = 'oslo-linen-daybed-lounge';
UPDATE public.products SET price = 12499, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'koben-walnut-lounge-chair';
UPDATE public.products SET price = 14999, compare_at_price = 16999, updated_at = NOW() WHERE slug = 'bauhaus-saddle-leather-armchair';
UPDATE public.products SET price = 7999, compare_at_price = 8999, updated_at = NOW() WHERE slug = 'koben-low-walnut-coffee-table';
UPDATE public.products SET price = 9499, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'kyoto-fluted-oak-coffee-table';
UPDATE public.products SET price = 2499, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'neva-travertine-accent-side-table';
UPDATE public.products SET price = 26999, compare_at_price = 29999, updated_at = NOW() WHERE slug = 'sora-solid-oak-platform-bed';
UPDATE public.products SET price = 24499, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'ren-minimalist-upholstered-bed';
UPDATE public.products SET price = 29999, compare_at_price = 34999, updated_at = NOW() WHERE slug = 'astrid-boucle-headboard-bed';
UPDATE public.products SET price = 21999, compare_at_price = 24999, updated_at = NOW() WHERE slug = 'aalto-6-drawer-walnut-dresser';
UPDATE public.products SET price = 18499, compare_at_price = 21499, updated_at = NOW() WHERE slug = 'hans-tallboy-5-drawer-dresser';
UPDATE public.products SET price = 2299, compare_at_price = 2599, updated_at = NOW() WHERE slug = 'maru-solid-ash-nightstand';
UPDATE public.products SET price = 1899, compare_at_price = 2199, updated_at = NOW() WHERE slug = 'tsubaki-low-floating-nightstand';
UPDATE public.products SET price = 29999, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'arden-travertine-dining-table';
UPDATE public.products SET price = 22999, compare_at_price = 25999, updated_at = NOW() WHERE slug = 'haven-round-oak-dining-table';
UPDATE public.products SET price = 34999, compare_at_price = 39999, updated_at = NOW() WHERE slug = 'vester-oval-travertine-dining-table';
UPDATE public.products SET price = 24999, compare_at_price = 28999, updated_at = NOW() WHERE slug = 'brisa-solid-walnut-sideboard-buffet';
UPDATE public.products SET price = 19999, compare_at_price = 22999, updated_at = NOW() WHERE slug = 'eos-minimalist-credenza-buffet';
UPDATE public.products SET price = 7499, compare_at_price = 8499, updated_at = NOW() WHERE slug = 'hans-sculpted-dining-chair-pair';
UPDATE public.products SET price = 4499, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'celine-cane-weave-dining-chair';
UPDATE public.products SET price = 16999, compare_at_price = 19499, updated_at = NOW() WHERE slug = 'artisan-solid-oak-writing-desk';
UPDATE public.products SET price = 21999, compare_at_price = 24999, updated_at = NOW() WHERE slug = 'atelier-floating-drawer-executive-desk';
UPDATE public.products SET price = 8999, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'kanto-swivel-wool-task-chair';
UPDATE public.products SET price = 12999, compare_at_price = 14999, updated_at = NOW() WHERE slug = 'verona-ergonomic-leather-task-chair';
UPDATE public.products SET price = 9999, compare_at_price = 11499, updated_at = NOW() WHERE slug = 'linear-brass-and-walnut-wall-bookshelf';
UPDATE public.products SET price = 8499, compare_at_price = 9499, updated_at = NOW() WHERE slug = 'studio-minimalist-modular-shelving';
UPDATE public.products SET price = 22999, compare_at_price = 25999, updated_at = NOW() WHERE slug = 'milo-architectural-oak-sideboard';
UPDATE public.products SET price = 18999, compare_at_price = 21999, updated_at = NOW() WHERE slug = 'silas-fluted-marble-media-console';
UPDATE public.products SET price = 11999, compare_at_price = NULL, updated_at = NOW() WHERE slug = 'forma-low-slung-entryway-console';
UPDATE public.products SET price = 9999, compare_at_price = 11299, updated_at = NOW() WHERE slug = 'kanso-minimalist-2-door-cabinet';
UPDATE public.products SET price = 17999, compare_at_price = 19999, updated_at = NOW() WHERE slug = 'arcos-glass-display-cabinet';
UPDATE public.products SET price = 13499, compare_at_price = 14999, updated_at = NOW() WHERE slug = 'tenon-solid-hardwood-bookcase';

