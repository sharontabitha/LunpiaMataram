-- ==============================================================================
-- DATABASE SCHEMA SUPABASE: LUNPIA MATARAM PANDANARAN
-- Jalankan query ini di menu "SQL Editor" pada dashboard Supabase Anda.
-- ==============================================================================

-- 1. TABEL PENGATURAN SITUS & KONTEN (SITE SETTINGS)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  brand_name TEXT NOT NULL DEFAULT 'Lunpia Mataram Pandanaran',
  logo_url TEXT,
  hero_badge TEXT DEFAULT 'SEJAK 1988 · RESEP WARISAN SEMARANG',
  hero_title_html TEXT DEFAULT 'Cita rasa Semarang, <span class="italic font-serif text-[#dfa62c]">hangat di setiap gigitan.</span>',
  hero_subtitle TEXT DEFAULT 'Lunpia autentik dengan rebung pilihan tanpa bau pesing, telur, dan udang segar. Diracik setiap hari dan disajikan segar untuk Anda.',
  hero_opening_hours TEXT DEFAULT 'Buka setiap hari, 08.00–21.00',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
  
  highlights JSONB DEFAULT '[
    {"number": "01", "title": "Resep Warisan", "desc": "Racikan autentik yang dijaga lintas generasi sejak 1988."},
    {"number": "02", "title": "Dibuat Setiap Hari", "desc": "Selalu segar dari wajan, hangat, dan siap dinikmati."},
    {"number": "03", "title": "Oleh-oleh Semarang", "desc": "Dikemas rapi untuk perjalanan dan buah tangan keluarga."}
  ]'::jsonb,

  about_title TEXT DEFAULT 'Cerita di Balik Kelezatan Lunpia Mataram',
  about_subtitle TEXT DEFAULT 'Tradisi Kuliner Semarang yang Melegenda',
  about_story TEXT DEFAULT 'Lunpia Mataram Pandanaran berawal dari dedikasi melestarikan kekayaan kuliner khas kota Semarang...',
  about_quote TEXT DEFAULT 'Kuliner bukan hanya tentang rasa, melainkan kenangan hangat keluarga dan warisan yang terus hidup.',
  about_image1 TEXT DEFAULT 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  about_image2 TEXT DEFAULT 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',

  store_phone TEXT DEFAULT '(024) 8451001',
  store_whatsapp TEXT DEFAULT '081901661459',
  gofood_url TEXT DEFAULT 'https://gofood.co.id/jakarta/restaurant/37081343-6ea5-4e23-bcc1-09c41eaaac86?as=gmaps',
  opening_hours TEXT DEFAULT '08.00 - 21.00 WIB',
  address TEXT DEFAULT 'Jl. Pandanaran No.29A, Randusari, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50244',
  gmaps_url TEXT DEFAULT 'https://maps.app.goo.gl/jZQnXTnf7QqiUVQR9',
  gmaps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2185672804533!2d110.40871267499709!3d-6.983508993017441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4eb905ef03%3A0x7d6a7ef642a4fb8f!2sJl.%20Pandanaran%20No.29A%2C%20Randusari%2C%20Kec.%20Semarang%20Sel.%2C%20Kota%20Semarang%2C%20Jawa%20Tengah%2050244!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  footer_note TEXT DEFAULT 'Dibuat hangat dengan resep dan cerita dari Semarang',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL DAFTAR MENU (MENU ITEMS)
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Satuan',
  badge TEXT DEFAULT 'SATUAN',
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT,
  available BOOLEAN DEFAULT TRUE,
  allowed_options JSONB DEFAULT '["Basah", "Goreng"]'::jsonb,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL RIWAYAT PESANAN (ORDERS)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  fulfillment_type TEXT NOT NULL,
  address_or_notes TEXT,
  status TEXT DEFAULT 'Menunggu',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS) & PUBLIC READ/WRITE ACCESS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update site_settings" ON site_settings FOR ALL USING (true);

CREATE POLICY "Allow public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public all menu_items" ON menu_items FOR ALL USING (true);

CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update orders" ON orders FOR ALL USING (true);

-- INSERT SEED DATA JIKA BELUM ADA
INSERT INTO site_settings (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, name, category, badge, description, price, image, available, allowed_options, order_index)
VALUES 
  ('item-1', 'Lunpia Original', 'Satuan', 'SATUAN', 'Rebung muda, udang, dan racikan bumbu warisan khas Semarang.', 18000, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80', true, '["Basah", "Goreng"]'::jsonb, 1),
  ('item-2', 'Lunpia Spesial', 'Satuan', 'SATUAN', 'Isian lebih melimpah dengan telur dan udang pilihan.', 22000, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', true, '["Basah", "Goreng"]'::jsonb, 2),
  ('item-3', 'Besek Keluarga', 'Paket Besek', 'PAKET BESEK', 'Isi 5 lunpia, lengkap dengan saus, acar, dan daun bawang.', 85000, 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80', true, '["Basah", "Goreng", "Campur (Basah & Goreng)"]'::jsonb, 3),
  ('item-4', 'Besek Oleh-oleh', 'Paket Besek', 'PAKET BESEK', 'Isi 10 lunpia dalam besek bambu, cocok untuk buah tangan.', 165000, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', false, '["Basah", "Goreng", "Campur (Basah & Goreng)"]'::jsonb, 4)
ON CONFLICT (id) DO NOTHING;
