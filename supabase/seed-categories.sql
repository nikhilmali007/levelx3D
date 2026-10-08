-- ============================================================
-- Level X 3D — Seed Categories (94 categories across 18 shelves)
-- Run AFTER schema.sql
-- ============================================================

-- Clear existing categories (if re-seeding)
TRUNCATE public.categories CASCADE;

INSERT INTO public.categories (name, slug, shelf, description, sort_order) VALUES
-- Signature / Premium (6)
('Designer Lamps', 'premium-designer-lamps', 'Signature / Premium', 'Designer Lamps in Signature / Premium', 1),
('Luxury Handbags', 'luxury-handbags', 'Signature / Premium', 'Luxury Handbags in Signature / Premium', 2),
('Custom Temple', 'premium-custom-temple', 'Signature / Premium', 'Custom Temple in Signature / Premium', 3),
('3D Car Frame Wall Art', '3d-car-frame-wall-art', 'Signature / Premium', '3D Car Frame Wall Art in Signature / Premium', 4),
('Wall Sculptures', 'wall-sculptures', 'Signature / Premium', 'Wall Sculptures in Signature / Premium', 5),
('Lithophane Photo Art', 'lithophane-photo-art', 'Signature / Premium', 'Lithophane Photo Art in Signature / Premium', 6),

-- Lighting (6)
('Table Lamps', 'table-lamps', 'Lighting', 'Table Lamps in Lighting', 7),
('Pendant Lamps', 'pendant-lamps', 'Lighting', 'Pendant Lamps in Lighting', 8),
('Night & Mood Lamps', 'night-mood-lamps', 'Lighting', 'Night & Mood Lamps in Lighting', 9),
('Moon Lamps', 'moon-lamps', 'Lighting', 'Moon Lamps in Lighting', 10),
('Lithophane Lamps', 'lithophane-lamps', 'Lighting', 'Lithophane Lamps in Lighting', 11),
('Name Boards', 'name-boards', 'Lighting', 'Name Boards in Lighting', 12),

-- Home Decor (8)
('Vases', 'vases', 'Home Decor', 'Vases in Home Decor', 13),
('Showpieces', 'showpieces', 'Home Decor', 'Showpieces in Home Decor', 14),
('Wall Art', 'wall-art', 'Home Decor', 'Wall Art in Home Decor', 15),
('Clocks', 'clocks', 'Home Decor', 'Clocks in Home Decor', 16),
('Photo Frames', 'photo-frames', 'Home Decor', 'Photo Frames in Home Decor', 17),
('Candle Holders', 'candle-holders', 'Home Decor', 'Candle Holders in Home Decor', 18),
('Coasters', 'coasters', 'Home Decor', 'Coasters in Home Decor', 19),
('Name Plates', 'name-plates', 'Home Decor', 'Name Plates in Home Decor', 20),

-- Planters & Garden (4)
('Geometric Planters', 'geometric-planters', 'Planters & Garden', 'Geometric Planters in Planters & Garden', 21),
('Self-watering Pots', 'self-watering-pots', 'Planters & Garden', 'Self-watering Pots in Planters & Garden', 22),
('Hanging Planters', 'hanging-planters', 'Planters & Garden', 'Hanging Planters in Planters & Garden', 23),
('Plant Markers', 'plant-markers', 'Planters & Garden', 'Plant Markers in Planters & Garden', 24),

-- Kitchen & Utility (5)
('Napkin Holders', 'napkin-holders', 'Kitchen & Utility', 'Napkin Holders in Kitchen & Utility', 25),
('Organisers', 'kitchen-organisers', 'Kitchen & Utility', 'Organisers in Kitchen & Utility', 26),
('Fridge Magnets', 'fridge-magnets', 'Kitchen & Utility', 'Fridge Magnets in Kitchen & Utility', 27),
('Wall Hooks', 'wall-hooks', 'Kitchen & Utility', 'Wall Hooks in Kitchen & Utility', 28),
('Tissue Covers', 'tissue-covers', 'Kitchen & Utility', 'Tissue Covers in Kitchen & Utility', 29),

-- Desk & Office (5)
('Pen Stands', 'pen-stands', 'Desk & Office', 'Pen Stands in Desk & Office', 30),
('Desk Organisers', 'desk-organisers', 'Desk & Office', 'Desk Organisers in Desk & Office', 31),
('Phone & Tablet Stands', 'phone-tablet-stands', 'Desk & Office', 'Phone & Tablet Stands in Desk & Office', 32),
('Headphone Stands', 'headphone-stands', 'Desk & Office', 'Headphone Stands in Desk & Office', 33),
('Bookmarks', 'bookmarks', 'Desk & Office', 'Bookmarks in Desk & Office', 34),

-- Tech Accessories (4)
('Phone Holders', 'phone-holders', 'Tech Accessories', 'Phone Holders in Tech Accessories', 35),
('Earbud Cases', 'earbud-cases', 'Tech Accessories', 'Earbud Cases in Tech Accessories', 36),
('Cable Organisers', 'cable-organisers', 'Tech Accessories', 'Cable Organisers in Tech Accessories', 37),
('Charging Docks', 'charging-docks', 'Tech Accessories', 'Charging Docks in Tech Accessories', 38),

-- Automotive (5)
('Dashboard Figures', 'dashboard-figures', 'Automotive', 'Dashboard Figures in Automotive', 39),
('Car Mounts', 'car-mounts', 'Automotive', 'Car Mounts in Automotive', 40),
('Car Wall Art', 'car-wall-art', 'Automotive', 'Car Wall Art in Automotive', 41),
('Logo Keychains', 'logo-keychains', 'Automotive', 'Logo Keychains in Automotive', 42),
('Interior Organisers', 'interior-organisers', 'Automotive', 'Interior Organisers in Automotive', 43),

-- Beauty & Personal (5)
('Press-on Nails', 'press-on-nails', 'Beauty & Personal', 'Press-on Nails in Beauty & Personal', 44),
('Nail Charms', 'nail-charms', 'Beauty & Personal', 'Nail Charms in Beauty & Personal', 45),
('Hair Clips', 'hair-clips', 'Beauty & Personal', 'Hair Clips in Beauty & Personal', 46),
('Makeup Organisers', 'makeup-organisers', 'Beauty & Personal', 'Makeup Organisers in Beauty & Personal', 47),
('Jewellery Trays', 'jewellery-trays', 'Beauty & Personal', 'Jewellery Trays in Beauty & Personal', 48),

-- Jewellery (6)
('Earrings', 'earrings', 'Jewellery', 'Earrings in Jewellery', 49),
('Pendants', 'pendants', 'Jewellery', 'Pendants in Jewellery', 50),
('Rings', 'rings', 'Jewellery', 'Rings in Jewellery', 51),
('Bangles', 'bangles', 'Jewellery', 'Bangles in Jewellery', 52),
('Brooches', 'brooches', 'Jewellery', 'Brooches in Jewellery', 53),
('Hair Jewellery', 'hair-jewellery', 'Jewellery', 'Hair Jewellery in Jewellery', 54),

-- Bags (4)
('Handbags', 'handbags', 'Bags', 'Handbags in Bags', 55),
('Clutches', 'clutches', 'Bags', 'Clutches in Bags', 56),
('Tote Panels', 'tote-panels', 'Bags', 'Tote Panels in Bags', 57),
('Bag Charms', 'bag-charms', 'Bags', 'Bag Charms in Bags', 58),

-- Devotional (6)
('Custom Temple', 'devotional-custom-temple', 'Devotional', 'Custom Temple in Devotional', 59),
('Idols', 'idols', 'Devotional', 'Idols in Devotional', 60),
('Toran', 'toran', 'Devotional', 'Toran in Devotional', 61),
('Om & Swastik Art', 'om-swastik-art', 'Devotional', 'Om & Swastik Art in Devotional', 62),
('Diya Holders', 'diya-holders', 'Devotional', 'Diya Holders in Devotional', 63),
('Dashboard Deities', 'dashboard-deities', 'Devotional', 'Dashboard Deities in Devotional', 64),

-- Gifts & Personalised (6)
('Custom Mementos', 'custom-mementos', 'Gifts & Personalised', 'Custom Mementos in Gifts & Personalised', 65),
('Trophies & Awards', 'trophies-awards', 'Gifts & Personalised', 'Trophies & Awards in Gifts & Personalised', 66),
('Name Keychains', 'name-keychains', 'Gifts & Personalised', 'Name Keychains in Gifts & Personalised', 67),
('Couple Gifts', 'couple-gifts', 'Gifts & Personalised', 'Couple Gifts in Gifts & Personalised', 68),
('Photo Lithophanes', 'photo-lithophanes', 'Gifts & Personalised', 'Photo Lithophanes in Gifts & Personalised', 69),
('Custom Bobbleheads', 'custom-bobbleheads', 'Gifts & Personalised', 'Custom Bobbleheads in Gifts & Personalised', 70),

-- Kids & Toys (6)
('Flexi Toys', 'flexi-toys', 'Kids & Toys', 'Flexi Toys in Kids & Toys', 71),
('Fidget Toys', 'fidget-toys', 'Kids & Toys', 'Fidget Toys in Kids & Toys', 72),
('Puzzles', 'puzzles', 'Kids & Toys', 'Puzzles in Kids & Toys', 73),
('Educational Toys', 'educational-toys', 'Kids & Toys', 'Educational Toys in Kids & Toys', 74),
('Action Figures', 'action-figures', 'Kids & Toys', 'Action Figures in Kids & Toys', 75),
('Name Puzzles', 'name-puzzles', 'Kids & Toys', 'Name Puzzles in Kids & Toys', 76),

-- Miniatures & Collectibles (5)
('Tabletop Miniatures', 'tabletop-miniatures', 'Miniatures & Collectibles', 'Tabletop Miniatures in Miniatures & Collectibles', 77),
('Figurines', 'figurines', 'Miniatures & Collectibles', 'Figurines in Miniatures & Collectibles', 78),
('Scale Models', 'scale-models', 'Miniatures & Collectibles', 'Scale Models in Miniatures & Collectibles', 79),
('Dioramas', 'dioramas', 'Miniatures & Collectibles', 'Dioramas in Miniatures & Collectibles', 80),
('Chess Sets', 'chess-sets', 'Miniatures & Collectibles', 'Chess Sets in Miniatures & Collectibles', 81),

-- Storage (4)
('Storage Boxes', 'storage-boxes', 'Storage', 'Storage Boxes in Storage', 82),
('Drawer Organisers', 'drawer-organisers', 'Storage', 'Drawer Organisers in Storage', 83),
('Stackable Bins', 'stackable-bins', 'Storage', 'Stackable Bins in Storage', 84),
('Jewellery Organisers', 'jewellery-organisers', 'Storage', 'Jewellery Organisers in Storage', 85),

-- Festive & Seasonal (5)
('Diwali Decor', 'diwali-decor', 'Festive & Seasonal', 'Diwali Decor in Festive & Seasonal', 86),
('Rakhi', 'rakhi', 'Festive & Seasonal', 'Rakhi in Festive & Seasonal', 87),
('Christmas Ornaments', 'christmas-ornaments', 'Festive & Seasonal', 'Christmas Ornaments in Festive & Seasonal', 88),
('Wedding Favours', 'wedding-favours', 'Festive & Seasonal', 'Wedding Favours in Festive & Seasonal', 89),
('Festival Decor', 'festival-decor', 'Festive & Seasonal', 'Festival Decor in Festive & Seasonal', 90),

-- Custom Studio (4)
('Upload Your Design', 'upload-your-design', 'Custom Studio', 'Upload Your Design in Custom Studio', 91),
('Photo to Lithophane', 'photo-to-lithophane', 'Custom Studio', 'Photo to Lithophane in Custom Studio', 92),
('Custom Text Products', 'custom-text-products', 'Custom Studio', 'Custom Text Products in Custom Studio', 93),
('Bulk & Corporate Orders', 'bulk-corporate-orders', 'Custom Studio', 'Bulk & Corporate Orders in Custom Studio', 94);
