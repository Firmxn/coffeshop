-- =============================================
-- ARCoffee Database Schema
-- Jalankan SQL ini di Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query)
-- =============================================

-- 1. Tabel Categories (Kategori Menu)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Products (Produk/Menu)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    price INTEGER NOT NULL, -- Harga dalam Rupiah
    image_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Options (Opsi Kustomisasi)
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name VARCHAR(50) NOT NULL, -- size, ice, sugar, addon
    name VARCHAR(100) NOT NULL,
    extra_price INTEGER DEFAULT 0, -- Harga tambahan
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Product Options (Relasi Produk-Opsi)
CREATE TABLE product_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    option_id UUID REFERENCES options(id) ON DELETE CASCADE,
    UNIQUE(product_id, option_id)
);

-- 5. Tabel Orders (Pesanan)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) NOT NULL UNIQUE, -- Format: ARC-XXXXX
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, ready, completed, cancelled
    total_price INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Order Items (Item dalam Pesanan)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL, -- Snapshot nama produk
    product_price INTEGER NOT NULL, -- Snapshot harga produk
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Order Item Options (Opsi yang dipilih per item)
CREATE TABLE order_item_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    option_id UUID REFERENCES options(id) ON DELETE SET NULL,
    option_name VARCHAR(100) NOT NULL, -- Snapshot nama opsi
    extra_price INTEGER DEFAULT 0 -- Snapshot harga tambahan
);

-- =============================================
-- INDEXES untuk performa query
-- =============================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;

-- Policies: Allow read for everyone (public menu)
CREATE POLICY "Allow public read categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow public read options" ON options
    FOR SELECT USING (true);

CREATE POLICY "Allow public read product_options" ON product_options
    FOR SELECT USING (true);

-- Orders: Allow insert for everyone, read own orders
CREATE POLICY "Allow public insert orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Allow public update orders" ON orders
    FOR UPDATE USING (true);

CREATE POLICY "Allow public insert order_items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read order_items" ON order_items
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert order_item_options" ON order_item_options
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read order_item_options" ON order_item_options
    FOR SELECT USING (true);

-- =============================================
-- SEED DATA: Categories
-- =============================================

INSERT INTO categories (name, slug, description) VALUES
    ('Kopi', 'kopi', 'Berbagai pilihan kopi signature kami'),
    ('Non-Kopi', 'non-kopi', 'Minuman segar tanpa kafein'),
    ('Makanan', 'makanan', 'Cemilan dan makanan pendamping');

-- =============================================
-- SEED DATA: Options
-- =============================================

INSERT INTO options (group_name, name, extra_price) VALUES
    -- Size
    ('size', 'Regular', 0),
    ('size', 'Large', 5000),
    -- Ice Level
    ('ice', 'No Ice', 0),
    ('ice', 'Less Ice', 0),
    ('ice', 'Normal Ice', 0),
    ('ice', 'Extra Ice', 0),
    -- Sugar Level
    ('sugar', 'Less Sugar', 0),
    ('sugar', 'Normal Sugar', 0),
    ('sugar', 'Extra Sugar', 0),
    -- Add-ons
    ('addon', 'Extra Espresso Shot', 5000),
    ('addon', 'Whipped Cream', 3000),
    ('addon', 'Coffee Jelly', 4000),
    ('addon', 'Brown Sugar Boba', 5000);

-- =============================================
-- SEED DATA: Products
-- =============================================

-- Get category IDs
DO $$
DECLARE
    cat_kopi UUID;
    cat_nonkopi UUID;
    cat_makanan UUID;
BEGIN
    SELECT id INTO cat_kopi FROM categories WHERE slug = 'kopi';
    SELECT id INTO cat_nonkopi FROM categories WHERE slug = 'non-kopi';
    SELECT id INTO cat_makanan FROM categories WHERE slug = 'makanan';

    -- Insert products
    INSERT INTO products (name, slug, description, price, category_id) VALUES
        ('Espresso', 'espresso', 'Espresso murni dengan crema sempurna. Bold dan intens.', 18000, cat_kopi),
        ('Americano', 'americano', 'Espresso dengan air panas. Rasa kopi yang smooth dan ringan.', 22000, cat_kopi),
        ('Cafe Latte', 'cafe-latte', 'Espresso dengan steamed milk yang creamy. Favorit sepanjang masa.', 28000, cat_kopi),
        ('Cappuccino', 'cappuccino', 'Espresso dengan foam susu yang tebal. Klasik Italia.', 28000, cat_kopi),
        ('Caramel Macchiato', 'caramel-macchiato', 'Latte dengan vanilla syrup dan caramel drizzle. Manis dan creamy.', 32000, cat_kopi),
        ('Matcha Latte', 'matcha-latte', 'Green tea premium dengan susu. Earthy dan creamy.', 30000, cat_nonkopi),
        ('Chocolate', 'chocolate', 'Cokelat premium dengan susu. Manis dan comforting.', 26000, cat_nonkopi),
        ('Croissant', 'croissant', 'Pastry butter berlapis-lapis. Renyah di luar, lembut di dalam.', 25000, cat_makanan),
        ('Banana Bread', 'banana-bread', 'Roti pisang homemade dengan walnut. Moist dan flavorful.', 22000, cat_makanan),
        ('Cookies', 'cookies', 'Chocolate chip cookies fresh from oven. Chewy dan gooey.', 15000, cat_makanan);
END $$;

-- =============================================
-- SEED DATA: Product Options (linking products to options)
-- =============================================

-- Espresso: only size and extra shot
INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'espresso' AND o.group_name = 'size';

INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'espresso' AND o.name = 'Extra Espresso Shot';

-- Americano: size, ice, extra shot
INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'americano' AND (o.group_name IN ('size', 'ice') OR o.name = 'Extra Espresso Shot');

-- Cafe Latte: all options except boba
INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'cafe-latte' AND o.name != 'Brown Sugar Boba';

-- Cappuccino: size, sugar, extra shot
INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'cappuccino' AND (o.group_name IN ('size', 'sugar') OR o.name = 'Extra Espresso Shot');

-- Caramel Macchiato: all options except boba and jelly
INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'caramel-macchiato' AND o.name NOT IN ('Brown Sugar Boba', 'Coffee Jelly');

-- Matcha Latte: size, ice, sugar, boba
INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'matcha-latte' AND (o.group_name IN ('size', 'ice', 'sugar') OR o.name = 'Brown Sugar Boba');

-- Chocolate: size, ice, sugar, whipped cream
INSERT INTO product_options (product_id, option_id)
SELECT p.id, o.id FROM products p, options o
WHERE p.slug = 'chocolate' AND (o.group_name IN ('size', 'ice', 'sugar') OR o.name = 'Whipped Cream');

-- Food items don't have options (croissant, banana-bread, cookies)
