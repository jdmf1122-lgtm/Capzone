-- ==============================================================================
-- CAPZONE HEADWEAR E-COMMERCE - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- Location: Roxas, Oriental Mindoro, Philippines
-- Run this complete script inside your Supabase Project:
-- Dashboard -> SQL Editor -> New Query -> Paste & Click "RUN"
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    item_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    stock INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_limited BOOLEAN DEFAULT false,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DISCOUNTS / PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS public.discounts (
    code TEXT PRIMARY KEY,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    value NUMERIC(10, 2) NOT NULL,
    min_spend NUMERIC(10, 2) DEFAULT 0,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- USERS / CUSTOMERS & ADMIN TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    fullname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    address TEXT,
    city TEXT DEFAULT 'Roxas, Oriental Mindoro',
    postal_code TEXT DEFAULT '5212',
    contact_number TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar TEXT,
    member_since TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    contact_number TEXT,
    shipping_address TEXT,
    city TEXT DEFAULT 'Roxas, Oriental Mindoro',
    postal_code TEXT DEFAULT '5212',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    discount_code TEXT,
    shipping_fee NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'gcash', 'maya', 'card')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending')),
    tracking_number TEXT,
    carrier TEXT DEFAULT 'CapZone Mindoro Express Fleet',
    estimated_delivery TEXT,
    tracking_history JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for client anon access
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Anon insert/update/delete for admin actions
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all modification categories" ON public.categories;
CREATE POLICY "Allow all modification categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Products: Public read, Anon insert/update/delete for admin actions
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all modification products" ON public.products;
CREATE POLICY "Allow all modification products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Discounts: Public read, modification allowed
DROP POLICY IF EXISTS "Allow public read discounts" ON public.discounts;
CREATE POLICY "Allow public read discounts" ON public.discounts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all modification discounts" ON public.discounts;
CREATE POLICY "Allow all modification discounts" ON public.discounts FOR ALL USING (true) WITH CHECK (true);

-- Users: Read and write
DROP POLICY IF EXISTS "Allow all access users" ON public.users;
CREATE POLICY "Allow all access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Orders: Public read, insert, update
DROP POLICY IF EXISTS "Allow all access orders" ON public.orders;
CREATE POLICY "Allow all access orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Reviews: Public read, insert
DROP POLICY IF EXISTS "Allow all access reviews" ON public.reviews;
CREATE POLICY "Allow all access reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. SEED INITIAL DATA
-- ==============================================================================

-- CATEGORIES SEED
INSERT INTO public.categories (id, name, slug, description, image, item_count)
VALUES
('cat-1', 'Baseball Caps', 'baseball-caps', 'Classic curved brim 6-panel athletic silhouettes engineered for all-day comfort.', '/assets/images/product_classic_baseball_1791343174954.jpg', 45),
('cat-2', 'Snapback Caps', 'snapback-caps', 'Structured high-crown street caps with stiffened flat bills and adjustable snap closures.', '/assets/images/product_ny_snapback_1791343189156.jpg', 38),
('cat-3', 'Bucket Hats', 'bucket-hats', 'Relaxed 360-degree all-weather brim silhouettes tailored in heavy denim and ripstop.', '/assets/images/product_denim_bucket_1791343201371.jpg', 24),
('cat-4', 'Dad Hats', 'dad-hats', 'Unstructured low-profile washed cotton caps for an effortless casual fit.', '/assets/images/product_vintage_dad_1791343263123.jpg', 50),
('cat-5', 'Trucker Caps', 'trucker-caps', 'Breathable poly mesh back panels matched with structured front panels for airflow in coastal heat.', '/assets/images/product_sports_trucker_1791343277334.jpg', 32),
('cat-6', 'Premium Embroidered Caps', 'premium-embroidered-caps', 'Elevated high-density 3D stitch work showcasing artisan needlecraft.', '/assets/images/product_embroidered_wave_1791343289132.jpg', 20),
('cat-7', 'Limited Edition Caps', 'limited-edition-caps', 'Ultra-exclusive numbered drops using bespoke fabrics and titanium hardware.', '/assets/images/product_crown_limited_1791343211771.jpg', 12),
('cat-8', 'Streetwear Collection', 'streetwear-collection', 'Modern aggressive urban silhouettes with technical fabrics and 3M reflective trims.', '/assets/images/product_urban_snapback_1791343301888.jpg', 29),
('cat-9', 'Sports Collection', 'sports-collection', 'Ultra-lightweight hydrophobic running caps with laser-cut ventilation ports.', '/assets/images/product_sports_trucker_1791343277334.jpg', 18)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  item_count = EXCLUDED.item_count;

-- PRODUCTS SEED
INSERT INTO public.products (id, name, category, description, image, price, original_price, stock, rating, review_count, colors, is_featured, is_new_arrival, is_best_seller, is_limited, specs)
VALUES
('prod-001', 'Black Classic Baseball Cap', 'Baseball Caps', 'The definitive minimalist headwear staple. Structured 6-panel silhouette cut from 100% brushed cotton twill, featuring a pre-curved visor, embroidered tonal eyelets, and an antiqued brass metal slide closure.', '/assets/images/product_classic_baseball_1791343174954.jpg', 299, 399, 45, 4.8, 142, '[{"name":"Matte Black","hex":"#111827"},{"name":"Charcoal","hex":"#374151"},{"name":"Pure White","hex":"#F9FAFB"}]'::jsonb, true, false, true, false, '{"material":"100% Heavy Brushed Cotton Twill","crown":"Structured 6-Panel Mid-Profile","closure":"Antiqued Brass Buckle with Tuck-In Strap","visor":"Permacurv Memory Visor","origin":"Crafted in Roxas, Oriental Mindoro, Philippines"}'::jsonb),
('prod-002', 'New York Snapback', 'Snapback Caps', 'Iconic street pedigree meets modern luxury. High-profile flat brim snapback accented with high-density 3D tonal embroidery on front crown and contrast moisture-wicking royal blue sweatband inside.', '/assets/images/product_ny_snapback_1791343189156.jpg', 499, 599, 28, 4.9, 98, '[{"name":"Royal Blue & Black","hex":"#2563EB"},{"name":"Stealth Black","hex":"#111827"},{"name":"Heather Gray","hex":"#6B7280"}]'::jsonb, true, true, true, false, '{"material":"80% Acrylic / 20% Wool Blend","crown":"High-Profile Structured Crown with Buckram","closure":"Adjustable 7-Hole Snapback","visor":"Flat Stiffened Street Brim with Green Underbrim","origin":"Imported Materials, Hand-Finished in Roxas, Oriental Mindoro"}'::jsonb),
('prod-003', 'Urban Street Snapback', 'Snapback Caps', 'Engineered for contemporary city life. Asphalt gray textured weave with reinforced front panels, matte black rubberized patch, and an aerodynamic brim designed to maintain rigidity across heavy wear.', '/assets/images/product_urban_snapback_1791343301888.jpg', 599, 750, 22, 4.7, 64, '[{"name":"Asphalt Gray","hex":"#4B5563"},{"name":"Pitch Black","hex":"#0B0F17"},{"name":"Crimson Edge","hex":"#991B1B"}]'::jsonb, true, false, false, false, '{"material":"Heavyweight Poly-Cotton Ripstop","crown":"Structured High-Crown 6-Panel","closure":"Dual-Row Heavy-Duty Snap","visor":"Squared Flat Brim","origin":"Roxas Coastal Streetwear Studio, Oriental Mindoro"}'::jsonb),
('prod-004', 'Vintage Dad Hat', 'Dad Hats', 'Effortless vintage relaxed silhouette. Garment-washed soft cotton unconstructed crown that contours naturally to your head from day one. Finished with subtle tonal side logo and woven fabric clasp.', '/assets/images/product_vintage_dad_1791343263123.jpg', 399, 480, 50, 4.9, 185, '[{"name":"Washed Khaki","hex":"#A3907C"},{"name":"Faded Olive","hex":"#556B2F"},{"name":"Vintage Black","hex":"#1F2937"},{"name":"Desert Sand","hex":"#D2B48C"}]'::jsonb, true, false, true, false, '{"material":"100% Chino Washed Cotton","crown":"Unstructured Low-Profile Soft Crown","closure":"Fabric Strap with Antiqued Metal Grommet","visor":"Natural Curve Visor","origin":"Mindoro Vintage Wash Lab, Roxas"}'::jsonb),
('prod-005', 'Denim Bucket Hat', 'Bucket Hats', 'Japanese raw denim inspired wide-brim bucket hat. Tailored concentric rim stitching provides structured shape without rigidity. Features interior cotton herringbone taping and breathable eyelet ports.', '/assets/images/product_denim_bucket_1791343201371.jpg', 449, 550, 19, 4.8, 76, '[{"name":"Raw Indigo","hex":"#1E3A8A"},{"name":"Washed Black Denim","hex":"#262626"},{"name":"Ecru Natural","hex":"#E5E7EB"}]'::jsonb, true, true, false, false, '{"material":"12oz Raw Selvedge-Style Cotton Denim","crown":"Round Flat-Top Bucket Crown","closure":"Fitted (Medium 57cm / Large 59cm)","visor":"Downward Sloping Reinforced Rim","origin":"Artisanal Denim Workshop, Roxas, Oriental Mindoro"}'::jsonb),
('prod-006', 'Sports Trucker Cap', 'Trucker Caps', 'Coastline heat ready. High-density foam front panel bonded to hydrophobic mesh back panels that maximize airflow during warm tropical days. Finished with terry-cloth moisture absorption brow band.', '/assets/images/product_sports_trucker_1791343277334.jpg', 349, 420, 35, 4.6, 92, '[{"name":"Black & White Mesh","hex":"#111827"},{"name":"Navy & White","hex":"#1E3A8A"},{"name":"Olive Camo","hex":"#4B5320"}]'::jsonb, false, false, true, false, '{"material":"Polyfoam Front with Breathable Micro-Mesh Back","crown":"High-Profile 5-Panel Trucker","closure":"Single Snap Plastic Closure","visor":"Semi-Curved Visor with Contrast Stitching","origin":"Mindoro Coast Athletics, Roxas"}'::jsonb),
('prod-007', 'Wave Embroidered Cap', 'Premium Embroidered Caps', 'Handcrafted tribute to the coastal waters of Oriental Mindoro. Over 45,000 stitches of high-tensile metallic thread creating a multi-layered tidal wave sculpture across the front crown.', '/assets/images/product_embroidered_wave_1791343289132.jpg', 699, 850, 15, 5.0, 48, '[{"name":"Midnight Ocean","hex":"#0F172A"},{"name":"Sunset Amber","hex":"#B45309"}]'::jsonb, true, true, false, false, '{"material":"100% Merino-Wool Hand-Woven Twill","crown":"Structured Mid-Profile with Satin Lining","closure":"Embossed Vegetable-Tanned Leather Strap","visor":"Pre-Curved Poly Visor with Underside Wave Print","origin":"Artisan Embroidery Guild · Roxas, Oriental Mindoro"}'::jsonb),
('prod-008', 'The Crown Limited Edition Cap', 'Limited Edition Caps', 'Numbered collector piece (Run #042/250). Features 24k gold-plated brass crown crest emblem, French silk satin interior lining, titanium slide clasp, and serialized certificate of authenticity card.', '/assets/images/product_crown_limited_1791343211771.jpg', 899, 1200, 8, 5.0, 31, '[{"name":"Obsidian Gold","hex":"#0B0F17"}]'::jsonb, true, true, false, true, '{"material":"Ultra-Dense Tech Wool + Genuine Suede Underbrim","crown":"Custom Sculptural Crown with Silk Satin Liner","closure":"Brushed Titanium Slide Clasp with Leather Taper","visor":"Signature Flat-To-Curve Hybrid Visor","origin":"Limited Run of 250 Units Worldwide · Atelier Roxas, Oriental Mindoro"}'::jsonb),
('prod-009', 'Cyber Streetwear Fitted Cap', 'Streetwear Collection', 'Futuristic silhouette designed with reflective 3M piping along the crown seams. Engineered for low-light urban night life with moisture-wicking coolmax interior sweatband.', '/assets/images/product_urban_snapback_1791343301888.jpg', 649, 799, 18, 4.8, 37, '[{"name":"Reflective Carbon","hex":"#1E293B"},{"name":"Neon Cyber Blue","hex":"#2563EB"}]'::jsonb, false, false, false, false, '{"material":"Technical Nylon Ripstop with 3M Reflective Accents","crown":"Unstructured Deep Crown","closure":"Elasticated True-Fit Band","visor":"Square Curved Visor","origin":"CapZone Street Lab, Roxas Port Road, Oriental Mindoro"}'::jsonb),
('prod-010', 'Active Hydro Pro Sport Cap', 'Sports Collection', 'Featherlight 48-gram performance sports cap engineered with laser-perforated side cooling vents and UPF 50+ sun protection for marathon running and outdoor sports.', '/assets/images/product_sports_trucker_1791343277334.jpg', 420, 499, 30, 4.9, 51, '[{"name":"Pitch Matte Black","hex":"#111827"},{"name":"Arctic White","hex":"#F9FAFB"}]'::jsonb, false, false, false, false, '{"material":"Hydrophobic 4-Way Stretch Poly Spandex","crown":"Aerodynamic Low-Profile Unstructured","closure":"Low-Snag Velcro with Reflective Pull Tab","visor":"Pliable Crushable Packable Visor","origin":"Mindoro Aerotech Lab, Roxas, Oriental Mindoro"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  colors = EXCLUDED.colors,
  specs = EXCLUDED.specs;

-- DISCOUNTS SEED
INSERT INTO public.discounts (code, discount_type, value, min_spend, description, active)
VALUES
('CAPZONE10', 'percentage', 10, 300, '10% off on all orders above ₱300', true),
('FREESHIP', 'fixed', 35, 500, 'Free Roxas delivery fee waiver on orders ₱500+', true),
('MINDORO20', 'percentage', 20, 1000, '20% off for major headwear hauls above ₱1,000', true),
('ROXASVIBES', 'fixed', 50, 400, '₱50 instant voucher for Roxas locals', true)
ON CONFLICT (code) DO UPDATE SET
  value = EXCLUDED.value,
  min_spend = EXCLUDED.min_spend,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- USERS SEED
INSERT INTO public.users (id, fullname, email, password, address, city, postal_code, contact_number, role, member_since)
VALUES
('usr-customer-01', 'Juan Miguel dela Cruz', 'juan.delacruz@example.com', 'password123', 'Rizal Street, Barangay Paclasan', 'Roxas, Oriental Mindoro', '5212', '+63 917 555 4321', 'user', 'January 2026'),
('usr-admin-01', 'CapZone Headmaster', 'admin@capzone.ph', 'adminpassword', 'CapZone Flagship Studio & Headwear Lab, Port Road, Barangay Dangay', 'Roxas, Oriental Mindoro', '5212', '+63 920 888 9999', 'admin', 'December 2025')
ON CONFLICT (id) DO UPDATE SET
  fullname = EXCLUDED.fullname,
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  address = EXCLUDED.address,
  role = EXCLUDED.role;

-- REVIEWS SEED
INSERT INTO public.reviews (id, product_id, user_name, user_email, rating, comment, date, verified_purchase)
VALUES
('rev-001', 'prod-001', 'Arnel Santos (Brgy. Dangay)', 'arnel@gmail.com', 5, 'Sobrang ganda ng quality! Makapal ang twill at matibay ang tahi. Sulit ang ₱299, parang international brand ang dating.', '2026-02-14', true),
('rev-002', 'prod-001', 'Mark Lester D.', 'mark@yahoo.com', 5, 'Dumating agad sa Paclasan via local rider delivery in 2 hours! Perfect fit sa ulo ko.', '2026-02-18', true),
('rev-003', 'prod-002', 'Jerome Mendoza', 'jerome@gmail.com', 5, 'Matigas ang brim, hindi madaling malusaw kahit mahamugan. Clean 3D embroidery.', '2026-02-22', true),
('rev-004', 'prod-004', 'Patricia Reyes', 'patricia@outlook.com', 5, 'Favorite everyday cap ko na to! Super comfortable at bagay sa kahit anong outfit.', '2026-02-26', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, user_id, customer_name, customer_email, contact_number, shipping_address, city, postal_code, items, subtotal, discount_amount, shipping_fee, total_amount, order_status, payment_method, payment_status, tracking_number, carrier, estimated_delivery, tracking_history)
VALUES
('ORD-10492', 'usr-customer-01', 'Juan Miguel dela Cruz', 'juan.delacruz@example.com', '+63 917 555 4321', 'Rizal Street, Barangay Paclasan, Roxas, Oriental Mindoro', 'Roxas, Oriental Mindoro', '5212', '[{"id":"item-1","productId":"prod-001","productName":"Black Classic Baseball Cap","productImage":"/assets/images/product_classic_baseball_1791343174954.jpg","price":299,"color":"Matte Black","quantity":1},{"id":"item-2","productId":"prod-002","productName":"New York Snapback","productImage":"/assets/images/product_ny_snapback_1791343189156.jpg","price":499,"color":"Royal Blue & Black","quantity":1}]'::jsonb, 798, 0, 0, 798, 'delivered', 'gcash', 'paid', 'CZ-991240PH', 'CapZone Roxas Local Express Rider', 'Delivered Feb 22, 2026', '[{"status":"Order Placed","timestamp":"Feb 20, 2026 - 09:30 AM","location":"CapZone Online Portal","description":"Order verified via GCash payment.","completed":true},{"status":"Dispatched to Courier","timestamp":"Feb 21, 2026 - 11:00 AM","location":"CapZone Studio, Roxas, Oriental Mindoro","description":"Handed to Roxas Local Rider Fleet.","completed":true},{"status":"Delivered","timestamp":"Feb 22, 2026 - 02:15 PM","location":"Barangay Paclasan, Roxas, Oriental Mindoro","description":"Signed and received by customer.","completed":true}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 6. STORAGE BUCKET FOR CAP PRODUCT IMAGES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public product-images read" ON storage.objects;
CREATE POLICY "Public product-images read" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow product-images upload" ON storage.objects;
CREATE POLICY "Allow product-images upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow product-images update" ON storage.objects;
CREATE POLICY "Allow product-images update" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');
