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


