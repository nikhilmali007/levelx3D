-- ==============================================================================
-- Level X 3D - Categories & Premium Products Seed Script
-- Run this script in the Supabase SQL Editor to populate all shelves, categories,
-- and the 6 Signature / Premium placeholder products with prices in Rs (INR).
-- ==============================================================================

-- 1. SEED ALL CATEGORIES WITH SHELVES, SLUGS, AND SORT ORDERS
INSERT INTO public.categories (name, slug, shelf, description, sort_order) VALUES
-- Signature / Premium (1 - 6)
('Designer Lamps', 'premium-designer-lamps', 'Signature / Premium', 'Bespoke parametric and architectural lighting sculptures', 1),
('Luxury Handbags', 'luxury-handbags', 'Signature / Premium', 'Rigid architectural structure bags with aerospace magnetic hinges', 2),
('Custom Temple', 'premium-custom-temple', 'Signature / Premium', 'Bespoke sanctuaries with micro-sintered jali carvings and illumination', 3),
('3D Car Frame Wall Art', '3d-car-frame-wall-art', 'Signature / Premium', 'Aerodynamic supercar relief sculptures mounted in museum frames', 4),
('Wall Sculptures', 'premium-wall-sculptures', 'Signature / Premium', 'Fluid topographical parametric art with acoustic wave cavities', 5),
('Lithophane Photo Art', 'lithophane-photo-art', 'Signature / Premium', 'High-density micro-photopolymer backlit photo reliefs', 6),

-- Lighting (7 - 12)
('Table Lamps', 'table-lamps', 'Lighting', 'Architectural desk and bedside lamps', 7),
('Pendant Lamps', 'pendant-lamps', 'Lighting', 'Suspended ceiling fixtures with parametric light diffusion', 8),
('Night & Mood Lamps', 'night-mood-lamps', 'Lighting', 'Calm ambient luminescence for bedrooms and creative studios', 9),
('Moon Lamps', 'moon-lamps', 'Lighting', 'Topographically accurate lunar orb lamps with multi-spectrum LEDs', 10),
('Lithophane Lamps', 'lithophane-lamps', 'Lighting', 'Geometric lamp cylinders featuring translucent photo panels', 11),
('Name Boards', 'lighting-name-boards', 'Lighting', 'Edge-lit 3D name plates and studio callouts', 12),

-- Home Decor (13 - 20)
('Vases', 'vases', 'Home Decor', 'Parametric spiral and voronoi watertight vessels', 13),
('Showpieces', 'showpieces', 'Home Decor', 'Abstract mathematical kinetic sculptures', 14),
('Wall Art', 'home-wall-art', 'Home Decor', 'Geometric modular panels and dimensional reliefs', 15),
('Clocks', 'clocks', 'Home Decor', 'Minimalist architectural wall and desk timepieces', 16),
('Photo Frames', 'photo-frames', 'Home Decor', 'Deep-set shadow boxes with faceted borders', 17),
('Candle Holders', 'candle-holders', 'Home Decor', 'Fluted and lattice tea-light lanterns', 18),
('Coasters', 'coasters', 'Home Decor', 'Hexagonal, topo, and fractal coaster suites', 19),
('Name Plates', 'name-plates', 'Home Decor', 'Modern entrance doors and desk markers', 20),

-- Planters & Garden (21 - 24)
('Geometric Planters', 'geometric-planters', 'Planters & Garden', 'Faceted and low-poly indoor succulent containers', 21),
('Self-watering Pots', 'self-watering-pots', 'Planters & Garden', 'Dual-chamber pots with internal capillary wick channels', 22),
('Hanging Planters', 'hanging-planters', 'Planters & Garden', 'Lightweight suspended aerial vessels', 23),
('Plant Markers', 'plant-markers', 'Planters & Garden', 'Minimalist botanical identification spikes', 24),

-- Kitchen & Utility (25 - 29)
('Napkin Holders', 'napkin-holders', 'Kitchen & Utility', 'Architectural fin and bridge napkin stands', 25),
('Organisers', 'kitchen-organisers', 'Kitchen & Utility', 'Cutlery and spice drawer dividers', 26),
('Fridge Magnets', 'fridge-magnets', 'Kitchen & Utility', 'Minimalist tactile neodymium magnetic studs', 27),
('Wall Hooks', 'wall-hooks', 'Kitchen & Utility', 'High-tensile organic branch coat and key pegs', 28),
('Tissue Covers', 'tissue-covers', 'Kitchen & Utility', 'Monolithic cuboid tissue box shrouds', 29),

-- Desk & Office (30 - 34)
('Pen Stands', 'pen-stands', 'Desk & Office', 'Heavy-base slotted parametric pencil holders', 30),
('Desk Organisers', 'desk-organisers', 'Desk & Office', 'Modular desk caddies and stationery catchalls', 31),
('Phone & Tablet Stands', 'phone-tablet-stands', 'Desk & Office', 'Ergonomic multi-angle device cradles', 32),
('Headphone Stands', 'headphone-stands', 'Desk & Office', 'Sleek curved and arch headphone pedestals', 33),
('Bookmarks', 'bookmarks', 'Desk & Office', 'Ultra-thin flexible laser-sintered page clips', 34),

-- Tech Accessories (35 - 38)
('Phone Holders', 'tech-phone-holders', 'Tech Accessories', 'MagSafe compatible and mechanical desk holders', 35),
('Earbud Cases', 'earbud-cases', 'Tech Accessories', 'Impact-resistant snap cases for AirPods and earbuds', 36),
('Cable Organisers', 'cable-organisers', 'Tech Accessories', 'Weighted desk cable snakes and routing clips', 37),
('Charging Docks', 'charging-docks', 'Tech Accessories', '3-in-1 integrated nightstand charging hubs', 38),

-- Automotive (39 - 43)
('Dashboard Figures', 'dashboard-figures', 'Automotive', 'Articulated and weighted dashboard companion figures', 39),
('Car Mounts', 'car-mounts', 'Automotive', 'Air-vent and dashboard phone stabilization mounts', 40),
('Car Wall Art', 'automotive-car-wall-art', 'Automotive', 'Iconic silhouette and engine block wall plates', 41),
('Logo Keychains', 'logo-keychains', 'Automotive', 'Precision embossed automotive emblem tags', 42),
('Interior Organisers', 'car-interior-organisers', 'Automotive', 'Cup holder inserts and center console trays', 43),

-- Beauty & Personal (44 - 48)
('Press-on Nails', 'press-on-nails', 'Beauty & Personal', 'Custom contoured 3D printed luxury nail sets', 44),
('Nail Charms', 'nail-charms', 'Beauty & Personal', 'Microscopic architectural nail embellishments', 45),
('Hair Clips', 'hair-clips', 'Beauty & Personal', 'Parametric claw and barrette clips with snap tension', 46),
('Makeup Organisers', 'makeup-organisers', 'Beauty & Personal', 'Tiered lipstick and cosmetic brush matrices', 47),
('Jewellery Trays', 'jewellery-trays', 'Beauty & Personal', 'Valet trinket dishes with ribbed ring slots', 48),

-- Jewellery (49 - 54)
('Earrings', 'earrings', 'Jewellery', 'Ultra-lightweight hollow lace and hoop earrings', 49),
('Pendants', 'pendants', 'Jewellery', 'Sacred geometry and mobius strip neck pendants', 50),
('Rings', 'rings', 'Jewellery', 'Generative mesh and cellular band rings', 51),
('Bangles', 'bangles', 'Jewellery', 'Seamless cuff and interlocking torque bangles', 52),
('Brooches', 'brooches', 'Jewellery', 'Sculptural lapel pins with safety clasp slots', 53),
('Hair Jewellery', 'hair-jewellery', 'Jewellery', 'Parametric tiaras and braided hairpin accents', 54),

-- Bags (55 - 58)
('Handbags', 'bags-handbags', 'Bags', 'Polymer lattice shell and evening handbags', 55),
('Clutches', 'clutches', 'Bags', 'Hardshell geometric party and gala clutches', 56),
('Tote Panels', 'tote-panels', 'Bags', 'Modular interlocking flexible bag faces', 57),
('Bag Charms', 'bag-charms', 'Bags', 'Architectural monogram and geometric bag pendants', 58),

-- Devotional (59 - 64)
('Custom Temple', 'devotional-custom-temple', 'Devotional', 'Modular and wall-mounted pooja mandirs', 59),
('Idols', 'idols', 'Devotional', 'Ganesha, Shiva, Krishna, and Buddha divine idols', 60),
('Toran', 'toran', 'Devotional', 'Auspicious door hangings with mango leaf motifs', 61),
('Om & Swastik Art', 'om-swastik-art', 'Devotional', 'Sacred symbology wall installations', 62),
('Diya Holders', 'diya-holders', 'Devotional', 'Heat-shielded lotus and star oil lamp stands', 63),
('Dashboard Deities', 'dashboard-deities', 'Devotional', 'Compact sanctified idols with non-marking base', 64),

-- Gifts & Personalised (65 - 70)
('Custom Mementos', 'custom-mementos', 'Gifts & Personalised', 'Commemorative plaques with embedded typography', 65),
('Trophies & Awards', 'trophies-awards', 'Gifts & Personalised', 'Architectural geometric corporate recognitions', 66),
('Name Keychains', 'name-keychains', 'Gifts & Personalised', 'Dual-color personalized letter keychains', 67),
('Couple Gifts', 'couple-gifts', 'Gifts & Personalised', 'Interlocking heart and initials puzzle keepsakes', 68),
('Photo Lithophanes', 'photo-lithophanes', 'Gifts & Personalised', 'Backlit portrait panels with wooden light bases', 69),
('Custom Bobbleheads', 'custom-bobbleheads', 'Gifts & Personalised', 'Personalized caricature desk bobbleheads', 70),

-- Kids & Toys (71 - 76)
('Flexi Toys', 'flexi-toys', 'Kids & Toys', 'Articulated print-in-place dragons and animals', 71),
('Fidget Toys', 'fidget-toys', 'Kids & Toys', 'Infinity cubes, gyroscopes, and gear spinners', 72),
('Puzzles', 'puzzles', 'Kids & Toys', 'Interlocking 3D brainteasers and tessellations', 73),
('Educational Toys', 'educational-toys', 'Kids & Toys', 'Anatomical, celestial, and STEM learning models', 74),
('Action Figures', 'action-figures', 'Kids & Toys', 'Multi-joint poseable cyber characters', 75),
('Name Puzzles', 'name-puzzles', 'Kids & Toys', 'Custom alphabet sorting and building blocks', 76),

-- Miniatures & Collectibles (77 - 81)
('Tabletop Miniatures', 'tabletop-miniatures', 'Miniatures & Collectibles', '28mm & 32mm ultra-detail resin gaming heroes', 77),
('Figurines', 'figurines', 'Miniatures & Collectibles', 'Anime and pop-culture shelf display sculptures', 78),
('Scale Models', 'scale-models', 'Miniatures & Collectibles', 'Architectural structures and aircraft replicas', 79),
('Dioramas', 'dioramas', 'Miniatures & Collectibles', 'Detailed environmental scenery and miniature bases', 80),
('Chess Sets', 'chess-sets', 'Miniatures & Collectibles', 'Brutalist, architectural, and cybernetic chess armies', 81),

-- Storage (82 - 85)
('Storage Boxes', 'storage-boxes', 'Storage', 'Interlocking snap-lid modular utility bins', 82),
('Drawer Organisers', 'drawer-organisers', 'Storage', 'Custom-fit honeycomb and grid partition systems', 83),
('Stackable Bins', 'stackable-bins', 'Storage', 'Open-front modular hardware and craft crates', 84),
('Jewellery Organisers', 'storage-jewellery-organisers', 'Storage', 'Tiered ring cones and earring tree towers', 85),

-- Festive & Seasonal (86 - 90)
('Diwali Decor', 'diwali-decor', 'Festive & Seasonal', 'Rangoli stencils, hanging lanterns, and torans', 86),
('Rakhi', 'rakhi', 'Festive & Seasonal', 'Intricate lightweight eco-resin rakhis', 87),
('Christmas Ornaments', 'christmas-ornaments', 'Festive & Seasonal', 'Voronoi snowflakes and geodesic baubles', 88),
('Wedding Favours', 'wedding-favours', 'Festive & Seasonal', 'Custom initial boxes and monogram gifts', 89),
('Festival Decor', 'festival-decor', 'Festive & Seasonal', 'Seasonal celebration lighting and centerpieces', 90),

-- Custom Studio (91 - 94)
('Upload Your Design', 'upload-your-design', 'Custom Studio', 'Instant CAD ingestion (.STL/.STEP) & automated slicing', 91),
('Photo to Lithophane', 'custom-photo-to-lithophane', 'Custom Studio', 'Upload your photo for automated 3D relief conversion', 92),
('Custom Text Products', 'custom-text-products', 'Custom Studio', 'Parametric signage, keyrings, and engraved blocks', 93),
('Bulk & Corporate Orders', 'bulk-corporate-orders', 'Custom Studio', 'High-volume production runs with B2B volume pricing', 94)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    shelf = EXCLUDED.shelf,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;


-- ==============================================================================
-- 2. SEED 6 PLACEHOLDER PRODUCTS IN THE "SIGNATURE / PREMIUM" SHELF (Prices in INR)
-- ==============================================================================

-- 2.1 Product 1: Designer Lamps
INSERT INTO public.products (
    id,
    name,
    slug,
    description,
    category_id,
    price_inr,
    compare_at_price_inr,
    is_customizable,
    is_premium,
    stock,
    status
) VALUES (
    'b1111111-1111-1111-1111-111111111111',
    'Lumina Voronoi Signature Designer Lamp',
    'lumina-voronoi-designer-lamp',
    'Architectural ambient table lamp featuring a generative Voronoi cellular shell. 3D printed with heat-resistant matte ceramic polymer, integrated with touch-dimming warm LED core (2700K).',
    (SELECT id FROM public.categories WHERE slug = 'premium-designer-lamps'),
    18500.00,
    22000.00,
    TRUE,
    TRUE,
    15,
    'active'
) ON CONFLICT (slug) DO UPDATE
SET price_inr = EXCLUDED.price_inr,
    compare_at_price_inr = EXCLUDED.compare_at_price_inr,
    is_premium = TRUE;

-- 2.2 Product 2: Luxury Handbags
INSERT INTO public.products (
    id,
    name,
    slug,
    description,
    category_id,
    price_inr,
    compare_at_price_inr,
    is_customizable,
    is_premium,
    stock,
    status
) VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'Aura Geometrique Luxury Structured Handbag',
    'aura-geometrique-luxury-handbag',
    'Parametric rigid lattice handbag fabricated via Selective Laser Sintering (SLS) nylon PA12. Equipped with aerospace neodymium magnetic snap clasps, hand-stitched interior liner, and detachable chain.',
    (SELECT id FROM public.categories WHERE slug = 'luxury-handbags'),
    24900.00,
    29500.00,
    TRUE,
    TRUE,
    8,
    'active'
) ON CONFLICT (slug) DO UPDATE
SET price_inr = EXCLUDED.price_inr,
    compare_at_price_inr = EXCLUDED.compare_at_price_inr,
    is_premium = TRUE;

-- 2.3 Product 3: Custom Temple
INSERT INTO public.products (
    id,
    name,
    slug,
    description,
    category_id,
    price_inr,
    compare_at_price_inr,
    is_customizable,
    is_premium,
    stock,
    status
) VALUES (
    'b3333333-3333-3333-3333-333333333333',
    'Maha-Mandir Archival Bespoke Temple',
    'maha-mandir-bespoke-temple',
    'Sacred home sanctuary manufactured with micro-sintered jali fretwork and stone-composite polymer. Features concealed LED halo backlighting, pull-out bhog tray, and customizable deity niche dimensions.',
    (SELECT id FROM public.categories WHERE slug = 'premium-custom-temple'),
    58000.00,
    68000.00,
    TRUE,
    TRUE,
    5,
    'active'
) ON CONFLICT (slug) DO UPDATE
SET price_inr = EXCLUDED.price_inr,
    compare_at_price_inr = EXCLUDED.compare_at_price_inr,
    is_premium = TRUE;

-- 2.4 Product 4: 3D Car Frame Wall Art
INSERT INTO public.products (
    id,
    name,
    slug,
    description,
    category_id,
    price_inr,
    compare_at_price_inr,
    is_customizable,
    is_premium,
    stock,
    status
) VALUES (
    'b4444444-4444-4444-4444-444444444444',
    'Porsche 911 GT3 RS Aerodynamic 3D Frame Art',
    'porsche-911-gt3-rs-3d-car-frame',
    'Half-scale high-precision aerodynamic body sculpture emerging from a matte black aluminum gallery frame. Laser-sintered curves with technical CAD drafting blueprint background and museum acrylic cover.',
    (SELECT id FROM public.categories WHERE slug = '3d-car-frame-wall-art'),
    14500.00,
    17500.00,
    TRUE,
    TRUE,
    12,
    'active'
) ON CONFLICT (slug) DO UPDATE
SET price_inr = EXCLUDED.price_inr,
    compare_at_price_inr = EXCLUDED.compare_at_price_inr,
    is_premium = TRUE;

-- 2.5 Product 5: Wall Sculptures
INSERT INTO public.products (
    id,
    name,
    slug,
    description,
    category_id,
    price_inr,
    compare_at_price_inr,
    is_customizable,
    is_premium,
    stock,
    status
) VALUES (
    'b5555555-5555-5555-5555-555555555555',
    'Ethereal Monolith Topographical Wall Sculpture',
    'ethereal-monolith-wall-sculpture',
    'Parametric fluid wave sculpture crafted through multi-axis laser sintering. Designed with interior acoustic sound-dampening hollow chambers and finished in vapor-smoothed chalk obsidian finish.',
    (SELECT id FROM public.categories WHERE slug = 'premium-wall-sculptures'),
    19900.00,
    24000.00,
    TRUE,
    TRUE,
    10,
    'active'
) ON CONFLICT (slug) DO UPDATE
SET price_inr = EXCLUDED.price_inr,
    compare_at_price_inr = EXCLUDED.compare_at_price_inr,
    is_premium = TRUE;

-- 2.6 Product 6: Lithophane Photo Art
INSERT INTO public.products (
    id,
    name,
    slug,
    description,
    category_id,
    price_inr,
    compare_at_price_inr,
    is_customizable,
    is_premium,
    stock,
    status
) VALUES (
    'b6666666-6666-6666-6666-666666666666',
    'Curved Panorama Bespoke Lithophane Art Frame',
    'curved-panorama-lithophane-art',
    'Custom panoramic photo relief printed with 12-micron high-density photopolymer. Seamlessly reveals lifelike photographic contrast and warm grayscale shadows when backlit by the integrated touch base.',
    (SELECT id FROM public.categories WHERE slug = 'lithophane-photo-art'),
    8900.00,
    10500.00,
    TRUE,
    TRUE,
    25,
    'active'
) ON CONFLICT (slug) DO UPDATE
SET price_inr = EXCLUDED.price_inr,
    compare_at_price_inr = EXCLUDED.compare_at_price_inr,
    is_premium = TRUE;


-- ==============================================================================
-- 3. SEED IMAGES FOR THE 6 PREMIUM PRODUCTS
-- ==============================================================================
INSERT INTO public.product_images (product_id, url, alt, sort_order) VALUES
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&auto=format&fit=crop&q=85', 'Lumina Voronoi Signature Designer Lamp on dark pedestal', 1),
('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop&q=85', 'Aura Geometrique Luxury Structured Handbag in black matte', 1),
('b3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=85', 'Maha-Mandir Archival Bespoke Temple interior sanctuary', 1),
('b4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1000&auto=format&fit=crop&q=85', 'Porsche 911 GT3 RS 3D Car Frame relief art in gallery mount', 1),
('b5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=85', 'Ethereal Monolith Topographical Wall Sculpture textured waves', 1),
('b6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=85', 'Curved Panorama Bespoke Lithophane Art Frame illuminated', 1)
ON CONFLICT DO NOTHING;


-- ==============================================================================
-- 4. SEED CUSTOMIZATION OPTIONS FOR THE 6 PREMIUM PRODUCTS
-- ==============================================================================
INSERT INTO public.product_options (product_id, name, type, values) VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'Ceramic Finish Tone',
    'color',
    '[
        {"label": "Obsidian Black", "value": "#0B0B0B"},
        {"label": "Chalk Cream", "value": "#F3F1EC"},
        {"label": "Slate Smoke", "value": "#6E6E6E"}
    ]'::jsonb
),
(
    'b1111111-1111-1111-1111-111111111111',
    'Light Temperature',
    'select',
    '[
        {"label": "Warm Candlelight (2200K)", "value": "2200K"},
        {"label": "Studio Warm White (2700K)", "value": "2700K"},
        {"label": "Architectural Neutral (4000K)", "value": "4000K"}
    ]'::jsonb
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Exterior Lattice Shade',
    'color',
    '[
        {"label": "Matte Onyx", "value": "#0B0B0B"},
        {"label": "Ceramic Canvas", "value": "#F3F1EC"}
    ]'::jsonb
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Hardware Finish',
    'select',
    '[
        {"label": "Gunmetal Titanium", "value": "gunmetal"},
        {"label": "Brushed Silver", "value": "silver"}
    ]'::jsonb
),
(
    'b3333333-3333-3333-3333-333333333333',
    'Sanctuary Dimensions',
    'select',
    '[
        {"label": "Compact (2.5 ft x 2 ft)", "value": "compact"},
        {"label": "Grand (3.5 ft x 2.5 ft)", "value": "grand", "priceDeltaInr": 18000}
    ]'::jsonb
),
(
    'b3333333-3333-3333-3333-333333333333',
    'Backlit Jali Pattern',
    'select',
    '[
        {"label": "Sacred Lotus Lattice", "value": "lotus"},
        {"label": "Geometric Om Mandala", "value": "mandala"},
        {"label": "Minimalist Chevron", "value": "chevron"}
    ]'::jsonb
),
(
    'b4444444-4444-4444-4444-444444444444',
    'Vehicle Livery Accent',
    'select',
    '[
        {"label": "Monochrome Chalk & Onyx", "value": "monochrome"},
        {"label": "GT Silver & Carbon", "value": "silver"}
    ]'::jsonb
),
(
    'b4444444-4444-4444-4444-444444444444',
    'Personalized Chassis Plaque Text',
    'text',
    '[{"placeholder": "Chassis No. or Name (e.g. 01/50 - NIKHIL MALI)", "maxLength": 30}]'::jsonb
),
(
    'b5555555-5555-5555-5555-555555555555',
    'Sculpture Orientation',
    'radio',
    '[
        {"label": "Vertical Pillar (120cm x 40cm)", "value": "vertical"},
        {"label": "Horizontal Horizon (40cm x 120cm)", "value": "horizontal"}
    ]'::jsonb
),
(
    'b6666666-6666-6666-6666-666666666666',
    'Photo Upload / Aspect',
    'text',
    '[{"placeholder": "Enter custom photo drive link or reference", "maxLength": 100}]'::jsonb
),
(
    'b6666666-6666-6666-6666-666666666666',
    'Wooden Base Wood Tone',
    'select',
    '[
        {"label": "Smoked Dark Walnut", "value": "walnut"},
        {"label": "Natural Nordic Birch", "value": "birch"}
    ]'::jsonb
)
ON CONFLICT DO NOTHING;
