-- ==============================================================================
-- Level X 3D - Production Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 0. Enable Necessary Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABLES CREATION
-- ==============================================================================

-- 1.1 Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    shelf TEXT,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.2 Products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price_inr NUMERIC(10, 2) NOT NULL CHECK (price_inr >= 0),
    compare_at_price_inr NUMERIC(10, 2) CHECK (compare_at_price_inr >= price_inr),
    is_customizable BOOLEAN DEFAULT FALSE NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    stock INTEGER DEFAULT 0 NOT NULL CHECK (stock >= 0),
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'draft', 'archived')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.3 Product Images
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.4 Product Options (Customization: Colour, Size, Engraving Text, etc.)
CREATE TABLE IF NOT EXISTS public.product_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. 'Finish / Colour', 'Scale / Size', 'Custom Laser Engraving'
    type TEXT NOT NULL CHECK (type IN ('select', 'color', 'text', 'radio')),
    values JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.5 Customers
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.6 Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    address_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.7 Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    qty INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
    unit_price_inr NUMERIC(10, 2) NOT NULL,
    options_json JSONB DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- 2. INDEXES
-- ==============================================================================

-- Categories Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);

-- Products Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_premium ON public.products(is_premium);

-- Product Images Indexes
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON public.product_images(sort_order);

-- Product Options Indexes
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON public.product_options(product_id);

-- Customers Indexes
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- Orders Indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Order Items Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 3.1 Public Catalog Access (Anyone can read categories, products, images, and options)
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" 
    ON public.categories FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" 
    ON public.products FOR SELECT 
    USING (status = 'active');

DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images" 
    ON public.product_images FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Public can view product options" ON public.product_options;
CREATE POLICY "Public can view product options" 
    ON public.product_options FOR SELECT 
    USING (true);

-- 3.2 Customers Profile RLS (Customer can read/update their own profile)
DROP POLICY IF EXISTS "Customers can view their own profile" ON public.customers;
CREATE POLICY "Customers can view their own profile" 
    ON public.customers FOR SELECT 
    USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Customers can update their own profile" ON public.customers;
CREATE POLICY "Customers can update their own profile" 
    ON public.customers FOR UPDATE 
    USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Customers can insert their own profile" ON public.customers;
CREATE POLICY "Customers can insert their own profile" 
    ON public.customers FOR INSERT 
    WITH CHECK (auth.uid() = auth_user_id);

-- 3.3 Orders RLS (Customer can read and create only their own orders)
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
CREATE POLICY "Customers can view their own orders" 
    ON public.orders FOR SELECT 
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Customers can create their own orders" ON public.orders;
CREATE POLICY "Customers can create their own orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE auth_user_id = auth.uid()
        )
    );

-- 3.4 Order Items RLS (Customer can read and insert items only for their own orders)
DROP POLICY IF EXISTS "Customers can view their own order items" ON public.order_items;
CREATE POLICY "Customers can view their own order items" 
    ON public.order_items FOR SELECT 
    USING (
        order_id IN (
            SELECT o.id FROM public.orders o
            JOIN public.customers c ON o.customer_id = c.id
            WHERE c.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Customers can insert items into their own orders" ON public.order_items;
CREATE POLICY "Customers can insert items into their own orders" 
    ON public.order_items FOR INSERT 
    WITH CHECK (
        order_id IN (
            SELECT o.id FROM public.orders o
            JOIN public.customers c ON o.customer_id = c.id
            WHERE c.auth_user_id = auth.uid()
        )
    );

-- ==============================================================================
-- 4. AUTOMATIC AUTH SYNC TRIGGER
-- Automatically creates a customer record when a user signs up with Supabase Auth
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customers (auth_user_id, email, name, phone)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        COALESCE(new.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (auth_user_id) DO UPDATE
    SET email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.customers.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 5. INITIAL SEED DATA FOR LEVEL X 3D
-- ==============================================================================

-- 5.1 Insert Categories
INSERT INTO public.categories (id, name, slug, shelf, description, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Desk Art', 'desk-art', 'Shelf 01', 'Architectural kinetic desk sculptures and tesseract geometries', 1),
('22222222-2222-2222-2222-222222222222', 'Biometric Wearables', 'wearables', 'Shelf 02', 'Parametric lightweight ergonomic lattices and neural visors', 2),
('33333333-3333-3333-3333-333333333333', 'Collectibles', 'collectibles', 'Shelf 03', 'Sequential numbered timepieces and gyroscopic artifacts', 3),
('44444444-4444-4444-4444-444444444444', 'Cyber Gear', 'cyber-gear', 'Shelf 04', 'Multi-axis mechanical controllers and aerospace gauntlets', 4)
ON CONFLICT (slug) DO NOTHING;

-- 5.2 Insert Products (with INR pricing)
INSERT INTO public.products (id, name, slug, description, category_id, price_inr, compare_at_price_inr, is_customizable, is_premium, stock, status) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'Vortex Quantum Core',
    'vortex-quantum-core',
    'Self-levitating kinetic art with luminescent core. Precision SLA printed using aerospace resin and magnetic induction levitation.',
    '11111111-1111-1111-1111-111111111111',
    15900.00,
    19900.00,
    TRUE,
    TRUE,
    25,
    'active'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Cybernetic Neural Visor',
    'cybernetic-neural-visor',
    'Ergonomic HUD wearable with dual prismatic optics. Custom fitted parametric wearable visor crafted with ultra-light carbon lattice.',
    '22222222-2222-2222-2222-222222222222',
    28900.00,
    34900.00,
    TRUE,
    TRUE,
    12,
    'active'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Hyper-Tesseract Desk Artifact',
    'hyper-tesseract-desk-artifact',
    '4D geometrical projection frozen in optical glass and sintered nylon PA12 exterior cage.',
    '11111111-1111-1111-1111-111111111111',
    10900.00,
    13500.00,
    TRUE,
    FALSE,
    40,
    'active'
),
(
    'a4444444-4444-4444-4444-444444444444',
    'Aero-Lattice Mech Gauntlet',
    'aero-lattice-mech-gauntlet',
    'Articulated biometric cybernetic forearm brace with magnetic snap hinges. Direct metal laser sintered AlSi10Mg.',
    '44444444-4444-4444-4444-444444444444',
    41500.00,
    NULL,
    TRUE,
    TRUE,
    8,
    'active'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Orbital Chrono Sphere',
    'orbital-chrono-sphere',
    'Gyroscopic perpetual desk timepiece. Multi-axis gimbal rings with micro ball bearings that spin silently with atmospheric breezes.',
    '33333333-3333-3333-3333-333333333333',
    17900.00,
    22900.00,
    FALSE,
    TRUE,
    18,
    'active'
),
(
    'a6666666-6666-6666-6666-666666666666',
    'Modular Cyber Blade Keypad',
    'modular-cyber-blade-keypad',
    'Parametric split ergonomic mechanical controller with acoustic dampening hollow matrix shell and hot-swappable switches.',
    '44444444-4444-4444-4444-444444444444',
    23200.00,
    NULL,
    TRUE,
    FALSE,
    30,
    'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 5.3 Insert Product Images
INSERT INTO public.product_images (product_id, url, alt, sort_order) VALUES
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=85', 'Vortex Quantum Core kinetic sculpture', 1),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1000&auto=format&fit=crop&q=85', 'Cybernetic Neural Visor wearable', 1),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop&q=85', 'Hyper-Tesseract Desk Artifact 4D geometric cube', 1),
('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=85', 'Aero-Lattice Mech Gauntlet AlSi10Mg', 1),
('a5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=85', 'Orbital Chrono Sphere gyroscopic desk timepiece', 1),
('a6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&auto=format&fit=crop&q=85', 'Modular Cyber Blade Keypad ceramic finish', 1)
ON CONFLICT DO NOTHING;

-- 5.4 Insert Product Options (Customization: Colour, Size, Engraving Text)
INSERT INTO public.product_options (product_id, name, type, values) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'Finish / Colour',
    'color',
    '[
        {"label": "Obsidian Black", "value": "#0B0B0B"},
        {"label": "Ceramic Chalk", "value": "#F3F1EC"},
        {"label": "Vapor Slate", "value": "#6E6E6E"}
    ]'::jsonb
),
(
    'a1111111-1111-1111-1111-111111111111',
    'Custom Engraving Text',
    'text',
    '[{"placeholder": "Max 18 characters laser-etched", "maxLength": 18}]'::jsonb
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Head Lattice Sizing',
    'select',
    '[
        {"label": "Small (54-56 cm)", "value": "S"},
        {"label": "Medium (57-59 cm)", "value": "M"},
        {"label": "Large (60-62 cm)", "value": "L"}
    ]'::jsonb
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Lattice Core Colour',
    'color',
    '[
        {"label": "Matte Onyx", "value": "#0B0B0B"},
        {"label": "Raw Titanium Chalk", "value": "#F3F1EC"}
    ]'::jsonb
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Scale / Size',
    'radio',
    '[
        {"label": "Standard (110mm)", "value": "110mm"},
        {"label": "Monumental (160mm)", "value": "160mm", "priceDeltaInr": 4500}
    ]'::jsonb
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Archival Serial Engraving',
    'text',
    '[{"placeholder": "Initials or Serial (e.g. LX-77)", "maxLength": 8}]'::jsonb
)
ON CONFLICT DO NOTHING;
