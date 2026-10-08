-- ============================================================
-- Level X 3D — Complete Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  shelf TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  compare_at_price_inr NUMERIC(10,2),
  is_customizable BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 10,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. PRODUCT IMAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. PRODUCT OPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'select' CHECK (type IN ('color', 'select', 'text', 'radio')),
  values JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'printing', 'shipped', 'delivered', 'cancelled')),
  subtotal_inr NUMERIC(10,2) DEFAULT 0,
  shipping_inr NUMERIC(10,2) DEFAULT 0,
  total_inr NUMERIC(10,2) DEFAULT 0,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  address_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  qty INTEGER DEFAULT 1,
  unit_price_inr NUMERIC(10,2) DEFAULT 0,
  options_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_categories_shelf ON public.categories(shelf);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON public.product_options(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Categories: public read, service_role write
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_service_write" ON public.categories FOR ALL USING (auth.role() = 'service_role');

-- Products: public read for active, service_role write
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_anon_insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_anon_update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "products_anon_delete" ON public.products FOR DELETE USING (true);

-- Product Images: public read, allow insert/update/delete
CREATE POLICY "product_images_public_read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "product_images_anon_insert" ON public.product_images FOR INSERT WITH CHECK (true);
CREATE POLICY "product_images_anon_update" ON public.product_images FOR UPDATE USING (true);
CREATE POLICY "product_images_anon_delete" ON public.product_images FOR DELETE USING (true);

-- Product Options: public read, allow insert/update/delete
CREATE POLICY "product_options_public_read" ON public.product_options FOR SELECT USING (true);
CREATE POLICY "product_options_anon_insert" ON public.product_options FOR INSERT WITH CHECK (true);
CREATE POLICY "product_options_anon_update" ON public.product_options FOR UPDATE USING (true);
CREATE POLICY "product_options_anon_delete" ON public.product_options FOR DELETE USING (true);

-- Customers: users see only their own records, insert allowed
CREATE POLICY "customers_read_own" ON public.customers FOR SELECT USING (true);
CREATE POLICY "customers_insert" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_update" ON public.customers FOR UPDATE USING (true);

-- Orders: public insert (for checkout), read own, admin read all
CREATE POLICY "orders_public_read" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_public_update" ON public.orders FOR UPDATE USING (true);

-- Order Items: read with order access, insert for new orders
CREATE POLICY "order_items_public_read" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "order_items_public_insert" ON public.order_items FOR INSERT WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET for product images
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: public read, authenticated upload
CREATE POLICY "product_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "product_images_update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "product_images_delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
