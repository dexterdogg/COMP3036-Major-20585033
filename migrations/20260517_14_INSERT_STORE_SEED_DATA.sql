INSERT INTO product_categories (name, slug)
VALUES
  ('Electronics', 'electronics'),
  ('Clothing', 'clothing'),
  ('Study Supplies', 'study-supplies'),
  ('Accessories', 'accessories')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  category_id,
  name,
  slug,
  description,
  price_cents,
  image_url,
  stock_quantity,
  is_active
)
VALUES
  (
    (SELECT id FROM product_categories WHERE slug = 'electronics'),
    'Wireless Study Headphones',
    'wireless-study-headphones',
    'Noise-reducing Bluetooth headphones for study sessions, commuting, and online classes.',
    7995,
    'https://placehold.co/600x400?text=Headphones',
    20,
    true
  ),
  (
    (SELECT id FROM product_categories WHERE slug = 'electronics'),
    'USB-C Laptop Hub',
    'usb-c-laptop-hub',
    'Compact multi-port hub with HDMI, USB-A, USB-C, and SD card support.',
    4995,
    'https://placehold.co/600x400?text=USB-C+Hub',
    30,
    true
  ),
  (
    (SELECT id FROM product_categories WHERE slug = 'study-supplies'),
    'Premium Lecture Notebook',
    'premium-lecture-notebook',
    'A5 ruled notebook designed for lecture notes, tutorial exercises, and exam revision.',
    1295,
    'https://placehold.co/600x400?text=Notebook',
    100,
    true
  ),
  (
    (SELECT id FROM product_categories WHERE slug = 'clothing'),
    'Campus Hoodie',
    'campus-hoodie',
    'Warm cotton-blend hoodie suitable for campus, labs, and casual wear.',
    5995,
    'https://placehold.co/600x400?text=Hoodie',
    25,
    true
  ),
  (
    (SELECT id FROM product_categories WHERE slug = 'accessories'),
    'Reusable Water Bottle',
    'reusable-water-bottle',
    'Insulated stainless-steel bottle for lectures, gym, and commuting.',
    2495,
    'https://placehold.co/600x400?text=Bottle',
    40,
    true
  )
ON CONFLICT (slug) DO NOTHING;