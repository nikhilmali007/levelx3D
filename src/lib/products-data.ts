export interface ShelfCategory {
  name: string;
  slug: string;
  shelf: string;
  description: string;
  sort_order: number;
}

export const SHELVES_DATA = [
  {
    shelf: 'Signature / Premium',
    slug: 'signature-premium',
    categories: [
      { name: 'Designer Lamps', slug: 'premium-designer-lamps' },
      { name: 'Luxury Handbags', slug: 'luxury-handbags' },
      { name: 'Custom Temple', slug: 'premium-custom-temple' },
      { name: '3D Car Frame Wall Art', slug: '3d-car-frame-wall-art' },
      { name: 'Wall Sculptures', slug: 'premium-wall-sculptures' },
      { name: 'Lithophane Photo Art', slug: 'lithophane-photo-art' },
    ],
  },
  {
    shelf: 'Lighting',
    slug: 'lighting',
    categories: [
      { name: 'Table Lamps', slug: 'table-lamps' },
      { name: 'Pendant Lamps', slug: 'pendant-lamps' },
      { name: 'Night & Mood Lamps', slug: 'night-mood-lamps' },
      { name: 'Moon Lamps', slug: 'moon-lamps' },
      { name: 'Lithophane Lamps', slug: 'lithophane-lamps' },
      { name: 'Name Boards', slug: 'lighting-name-boards' },
    ],
  },
  {
    shelf: 'Home Decor',
    slug: 'home-decor',
    categories: [
      { name: 'Vases', slug: 'vases' },
      { name: 'Showpieces', slug: 'showpieces' },
      { name: 'Wall Art', slug: 'home-wall-art' },
      { name: 'Clocks', slug: 'clocks' },
      { name: 'Photo Frames', slug: 'photo-frames' },
      { name: 'Candle Holders', slug: 'candle-holders' },
      { name: 'Coasters', slug: 'coasters' },
      { name: 'Name Plates', slug: 'name-plates' },
    ],
  },
  {
    shelf: 'Planters & Garden',
    slug: 'planters-garden',
    categories: [
      { name: 'Geometric Planters', slug: 'geometric-planters' },
      { name: 'Self-watering Pots', slug: 'self-watering-pots' },
      { name: 'Hanging Planters', slug: 'hanging-planters' },
      { name: 'Plant Markers', slug: 'plant-markers' },
    ],
  },
  {
    shelf: 'Kitchen & Utility',
    slug: 'kitchen-utility',
    categories: [
      { name: 'Napkin Holders', slug: 'napkin-holders' },
      { name: 'Organisers', slug: 'kitchen-organisers' },
      { name: 'Fridge Magnets', slug: 'fridge-magnets' },
      { name: 'Wall Hooks', slug: 'wall-hooks' },
      { name: 'Tissue Covers', slug: 'tissue-covers' },
    ],
  },
  {
    shelf: 'Desk & Office',
    slug: 'desk-office',
    categories: [
      { name: 'Pen Stands', slug: 'pen-stands' },
      { name: 'Desk Organisers', slug: 'desk-organisers' },
      { name: 'Phone & Tablet Stands', slug: 'phone-tablet-stands' },
      { name: 'Headphone Stands', slug: 'headphone-stands' },
      { name: 'Bookmarks', slug: 'bookmarks' },
    ],
  },
  {
    shelf: 'Tech Accessories',
    slug: 'tech-accessories',
    categories: [
      { name: 'Phone Holders', slug: 'tech-phone-holders' },
      { name: 'Earbud Cases', slug: 'earbud-cases' },
      { name: 'Cable Organisers', slug: 'cable-organisers' },
      { name: 'Charging Docks', slug: 'charging-docks' },
    ],
  },
  {
    shelf: 'Automotive',
    slug: 'automotive',
    categories: [
      { name: 'Dashboard Figures', slug: 'dashboard-figures' },
      { name: 'Car Mounts', slug: 'car-mounts' },
      { name: 'Car Wall Art', slug: 'automotive-car-wall-art' },
      { name: 'Logo Keychains', slug: 'logo-keychains' },
      { name: 'Interior Organisers', slug: 'car-interior-organisers' },
    ],
  },
  {
    shelf: 'Beauty & Personal',
    slug: 'beauty-personal',
    categories: [
      { name: 'Press-on Nails', slug: 'press-on-nails' },
      { name: 'Nail Charms', slug: 'nail-charms' },
      { name: 'Hair Clips', slug: 'hair-clips' },
      { name: 'Makeup Organisers', slug: 'makeup-organisers' },
      { name: 'Jewellery Trays', slug: 'jewellery-trays' },
    ],
  },
  {
    shelf: 'Jewellery',
    slug: 'jewellery',
    categories: [
      { name: 'Earrings', slug: 'earrings' },
      { name: 'Pendants', slug: 'pendants' },
      { name: 'Rings', slug: 'rings' },
      { name: 'Bangles', slug: 'bangles' },
      { name: 'Brooches', slug: 'brooches' },
      { name: 'Hair Jewellery', slug: 'hair-jewellery' },
    ],
  },
  {
    shelf: 'Bags',
    slug: 'bags',
    categories: [
      { name: 'Handbags', slug: 'bags-handbags' },
      { name: 'Clutches', slug: 'clutches' },
      { name: 'Tote Panels', slug: 'tote-panels' },
      { name: 'Bag Charms', slug: 'bag-charms' },
    ],
  },
  {
    shelf: 'Devotional',
    slug: 'devotional',
    categories: [
      { name: 'Custom Temple', slug: 'devotional-custom-temple' },
      { name: 'Idols', slug: 'idols' },
      { name: 'Toran', slug: 'toran' },
      { name: 'Om & Swastik Art', slug: 'om-swastik-art' },
      { name: 'Diya Holders', slug: 'diya-holders' },
      { name: 'Dashboard Deities', slug: 'dashboard-deities' },
    ],
  },
  {
    shelf: 'Gifts & Personalised',
    slug: 'gifts-personalised',
    categories: [
      { name: 'Custom Mementos', slug: 'custom-mementos' },
      { name: 'Trophies & Awards', slug: 'trophies-awards' },
      { name: 'Name Keychains', slug: 'name-keychains' },
      { name: 'Couple Gifts', slug: 'couple-gifts' },
      { name: 'Photo Lithophanes', slug: 'photo-lithophanes' },
      { name: 'Custom Bobbleheads', slug: 'custom-bobbleheads' },
    ],
  },
  {
    shelf: 'Kids & Toys',
    slug: 'kids-toys',
    categories: [
      { name: 'Flexi Toys', slug: 'flexi-toys' },
      { name: 'Fidget Toys', slug: 'fidget-toys' },
      { name: 'Puzzles', slug: 'puzzles' },
      { name: 'Educational Toys', slug: 'educational-toys' },
      { name: 'Action Figures', slug: 'action-figures' },
      { name: 'Name Puzzles', slug: 'name-puzzles' },
    ],
  },
  {
    shelf: 'Miniatures & Collectibles',
    slug: 'miniatures-collectibles',
    categories: [
      { name: 'Tabletop Miniatures', slug: 'tabletop-miniatures' },
      { name: 'Figurines', slug: 'figurines' },
      { name: 'Scale Models', slug: 'scale-models' },
      { name: 'Dioramas', slug: 'dioramas' },
      { name: 'Chess Sets', slug: 'chess-sets' },
    ],
  },
  {
    shelf: 'Storage',
    slug: 'storage',
    categories: [
      { name: 'Storage Boxes', slug: 'storage-boxes' },
      { name: 'Drawer Organisers', slug: 'drawer-organisers' },
      { name: 'Stackable Bins', slug: 'stackable-bins' },
      { name: 'Jewellery Organisers', slug: 'storage-jewellery-organisers' },
    ],
  },
  {
    shelf: 'Festive & Seasonal',
    slug: 'festive-seasonal',
    categories: [
      { name: 'Diwali Decor', slug: 'diwali-decor' },
      { name: 'Rakhi', slug: 'rakhi' },
      { name: 'Christmas Ornaments', slug: 'christmas-ornaments' },
      { name: 'Wedding Favours', slug: 'wedding-favours' },
      { name: 'Festival Decor', slug: 'festival-decor' },
    ],
  },
  {
    shelf: 'Custom Studio',
    slug: 'custom-studio',
    categories: [
      { name: 'Upload Your Design', slug: 'upload-your-design' },
      { name: 'Photo to Lithophane', slug: 'custom-photo-to-lithophane' },
      { name: 'Custom Text Products', slug: 'custom-text-products' },
      { name: 'Bulk & Corporate Orders', slug: 'bulk-corporate-orders' },
    ],
  },
];

export interface ProductOptionValue {
  label?: string;
  value?: string;
  placeholder?: string;
  maxLength?: number;
  priceDeltaInr?: number;
}

export interface ProductOption {
  id?: string;
  name: string;
  type: 'color' | 'select' | 'text' | 'radio';
  values: ProductOptionValue[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in INR
  originalPrice?: number; // in INR
  category: string;
  categorySlug: string;
  shelf: string;
  shelfSlug: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  images?: string[];
  isCustomizable?: boolean;
  options?: ProductOption[];
  geometryType: 'torus' | 'sphere' | 'cyber-cube' | 'prism' | 'headset';
  inStock: boolean;
  stock?: number;
  specs: {
    material: string;
    resolution: string;
    finish: string;
    dimensions: string;
  };
  createdAt?: string;
}

// Initial products across multiple shelves with INR pricing
export const INITIAL_PRODUCTS: Product[] = [
  // Signature / Premium Shelf (6 products)
  {
    id: 'prem-01',
    slug: 'lumina-voronoi-designer-lamp',
    name: 'Lumina Voronoi Signature Designer Lamp',
    tagline: 'Parametric Voronoi cellular shell with touch warm LED diffusion',
    description: 'Architectural ambient table lamp featuring a generative Voronoi cellular shell. 3D printed with heat-resistant matte ceramic polymer, integrated with touch-dimming warm LED core (2700K).',
    price: 18500,
    originalPrice: 22000,
    category: 'Designer Lamps',
    categorySlug: 'premium-designer-lamps',
    shelf: 'Signature / Premium',
    shelfSlug: 'signature-premium',
    rating: 5.0,
    reviewsCount: 48,
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'torus',
    inStock: true,
    stock: 15,
    isCustomizable: true,
    options: [
      {
        name: 'Ceramic Finish Tone',
        type: 'color',
        values: [
          { label: 'Obsidian Black', value: '#0B0B0B' },
          { label: 'Chalk Cream', value: '#F3F1EC' },
          { label: 'Slate Smoke', value: '#6E6E6E' },
        ],
      },
      {
        name: 'Light Temperature',
        type: 'select',
        values: [
          { label: 'Warm Candlelight (2200K)', value: '2200K' },
          { label: 'Studio Warm White (2700K)', value: '2700K' },
          { label: 'Architectural Neutral (4000K)', value: '4000K' },
        ],
      },
      {
        name: 'Laser Engraved Studio Monogram',
        type: 'text',
        values: [{ placeholder: 'Initials or Serial (e.g. LX-01)', maxLength: 20 }],
      },
    ],
    specs: {
      material: 'Heat-Resistant Ceramic SLA Composite',
      resolution: '25 Microns',
      finish: 'Matte Chalk / Obsidian Black',
      dimensions: '180mm x 180mm x 280mm',
    },
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'prem-02',
    slug: 'aura-geometrique-luxury-handbag',
    name: 'Aura Geometrique Luxury Handbag',
    tagline: 'Parametric rigid lattice bag with aerospace magnetic hinges',
    description: 'Parametric rigid lattice handbag fabricated via Selective Laser Sintering (SLS) nylon PA12. Equipped with aerospace neodymium magnetic snap clasps, hand-stitched interior liner, and detachable chain.',
    price: 24900,
    originalPrice: 29500,
    category: 'Luxury Handbags',
    categorySlug: 'luxury-handbags',
    shelf: 'Signature / Premium',
    shelfSlug: 'signature-premium',
    rating: 4.9,
    reviewsCount: 31,
    badge: 'Limited Run',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'cyber-cube',
    inStock: true,
    stock: 8,
    isCustomizable: true,
    options: [
      {
        name: 'Exterior Lattice Tone',
        type: 'color',
        values: [
          { label: 'Matte Onyx', value: '#0B0B0B' },
          { label: 'Ceramic Canvas', value: '#F3F1EC' },
        ],
      },
      {
        name: 'Hardware Clasp Finish',
        type: 'select',
        values: [
          { label: 'Gunmetal Titanium', value: 'gunmetal' },
          { label: 'Brushed Silver', value: 'silver' },
        ],
      },
      {
        name: 'Personalized Monogram',
        type: 'text',
        values: [{ placeholder: 'Initials (e.g. N.M.)', maxLength: 4 }],
      },
    ],
    specs: {
      material: 'Sintered Nylon PA12 & Vegan Leather',
      resolution: '50 Microns SLS',
      finish: 'Vapor-Polished Obsidian',
      dimensions: '220mm x 140mm x 75mm',
    },
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'prem-03',
    slug: 'maha-mandir-bespoke-temple',
    name: 'Maha-Mandir Bespoke Custom Temple',
    tagline: 'Sacred architectural sanctuary with micro-sintered jali carvings',
    description: 'Sacred home sanctuary manufactured with micro-sintered jali fretwork and stone-composite polymer. Features concealed LED halo backlighting, pull-out bhog tray, and customizable deity niche dimensions.',
    price: 58000,
    originalPrice: 68000,
    category: 'Custom Temple',
    categorySlug: 'premium-custom-temple',
    shelf: 'Signature / Premium',
    shelfSlug: 'signature-premium',
    rating: 5.0,
    reviewsCount: 19,
    badge: 'Bespoke Order',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'prism',
    inStock: true,
    stock: 5,
    isCustomizable: true,
    options: [
      {
        name: 'Sanctuary Scale',
        type: 'select',
        values: [
          { label: 'Compact Studio (2.5 ft x 2 ft)', value: 'compact' },
          { label: 'Grand Mandir (3.5 ft x 2.5 ft)', value: 'grand' },
        ],
      },
      {
        name: 'Backlit Jali Lattice Motif',
        type: 'select',
        values: [
          { label: 'Sacred Lotus Lattice', value: 'lotus' },
          { label: 'Geometric Om Mandala', value: 'mandala' },
          { label: 'Minimalist Chevron', value: 'chevron' },
        ],
      },
      {
        name: 'Family Inscription Plaque',
        type: 'text',
        values: [{ placeholder: 'Family Name or Shloka (e.g. The Mali Residence)', maxLength: 36 }],
      },
    ],
    specs: {
      material: 'Direct Stone Composite & Laser Sintered Jali',
      resolution: '30 Microns',
      finish: 'Hand-Finished Marble Chalk & Warm Gold',
      dimensions: '450mm x 350mm x 600mm',
    },
    createdAt: '2026-10-03T10:00:00Z',
  },
  {
    id: 'prem-04',
    slug: 'porsche-911-gt3-rs-wall-frame',
    name: 'Porsche 911 GT3 RS 3D Car Frame Wall Art',
    tagline: 'Aerodynamic half-scale supercar relief in anodized museum frame',
    description: 'Half-scale high-precision aerodynamic body sculpture emerging from a matte black aluminum gallery frame. Laser-sintered curves with technical CAD drafting blueprint background and museum acrylic cover.',
    price: 14500,
    originalPrice: 17500,
    category: '3D Car Frame Wall Art',
    categorySlug: '3d-car-frame-wall-art',
    shelf: 'Signature / Premium',
    shelfSlug: 'signature-premium',
    rating: 4.9,
    reviewsCount: 64,
    badge: 'Collector',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'headset',
    inStock: true,
    stock: 12,
    isCustomizable: true,
    options: [
      {
        name: 'Relief Silhouette Shade',
        type: 'color',
        values: [
          { label: 'Matte Onyx', value: '#0B0B0B' },
          { label: 'Chalk White', value: '#F3F1EC' },
          { label: 'Slate Shadow', value: '#6E6E6E' },
        ],
      },
      {
        name: 'Frame Finish',
        type: 'select',
        values: [
          { label: 'Anodized Black Aluminum', value: 'black-aluminum' },
          { label: 'Raw Brushed Titanium', value: 'titanium' },
        ],
      },
      {
        name: 'Chassis Plaque Laser Engraving',
        type: 'text',
        values: [{ placeholder: 'e.g. 01/50 — NIKHIL MALI SPECIAL EDITION', maxLength: 32 }],
      },
    ],
    specs: {
      material: 'Aero Polymer Shell & Anodized Aluminum',
      resolution: '20 Microns High-Def',
      finish: 'Matte Chalk on Deep Onyx Frame',
      dimensions: '500mm x 400mm x 85mm Depth',
    },
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'prem-05',
    slug: 'ethereal-monolith-wall-sculpture',
    name: 'Ethereal Monolith Topographical Wall Sculpture',
    tagline: 'Parametric fluid wave sculpture with acoustic wave chambers',
    description: 'Parametric fluid wave sculpture crafted through multi-axis laser sintering. Designed with interior acoustic sound-dampening hollow chambers and finished in vapor-smoothed chalk obsidian finish.',
    price: 19900,
    originalPrice: 24000,
    category: 'Wall Sculptures',
    categorySlug: 'premium-wall-sculptures',
    shelf: 'Signature / Premium',
    shelfSlug: 'signature-premium',
    rating: 4.8,
    reviewsCount: 27,
    badge: 'Architectural',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'sphere',
    inStock: true,
    stock: 10,
    isCustomizable: true,
    options: [
      {
        name: 'Acoustic Sintered Tone',
        type: 'color',
        values: [
          { label: 'Vapor Chalk White', value: '#F3F1EC' },
          { label: 'Obsidian Smoke', value: '#0B0B0B' },
        ],
      },
      {
        name: 'Mounting Orientation',
        type: 'select',
        values: [
          { label: 'Vertical Pillar (120cm x 40cm)', value: 'vertical' },
          { label: 'Horizontal Wave (40cm x 120cm)', value: 'horizontal' },
        ],
      },
      {
        name: 'Bespoke Dimension Note',
        type: 'text',
        values: [{ placeholder: 'Wall bracket / offset request', maxLength: 40 }],
      },
    ],
    specs: {
      material: 'Laser-Sintered Acoustic Nylon Matrix',
      resolution: '40 Microns',
      finish: 'Vapor-Smoothed Chalk White',
      dimensions: '600mm x 600mm x 70mm',
    },
    createdAt: '2026-09-25T10:00:00Z',
  },
  {
    id: 'prem-06',
    slug: 'curved-panorama-lithophane-art',
    name: 'Curved Panorama Bespoke Lithophane Art Frame',
    tagline: 'High-density micro-photopolymer backlit photo relief',
    description: 'Custom panoramic photo relief printed with 12-micron high-density photopolymer. Seamlessly reveals lifelike photographic contrast and warm grayscale shadows when backlit by the integrated touch base.',
    price: 8900,
    originalPrice: 10500,
    category: 'Lithophane Photo Art',
    categorySlug: 'lithophane-photo-art',
    shelf: 'Signature / Premium',
    shelfSlug: 'signature-premium',
    rating: 5.0,
    reviewsCount: 82,
    badge: 'Personalized',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'torus',
    inStock: true,
    stock: 25,
    isCustomizable: true,
    options: [
      {
        name: 'Pedestal Wood Type',
        type: 'select',
        values: [
          { label: 'Smoked Dark Walnut', value: 'walnut' },
          { label: 'Natural Nordic Birch', value: 'birch' },
        ],
      },
      {
        name: 'Backlight Temperature',
        type: 'select',
        values: [
          { label: 'Warm 2400K Candlelight', value: '2400K' },
          { label: 'Neutral 3500K Studio', value: '3500K' },
        ],
      },
      {
        name: 'Engraved Pedestal Base Date / Dedication',
        type: 'text',
        values: [{ placeholder: 'e.g. In Commemoration — 2026', maxLength: 30 }],
      },
    ],
    specs: {
      material: 'Ultra-Fine 12μm Optical Photopolymer',
      resolution: '12 Microns Micro-SLA',
      finish: 'Translucent Optical Relief & Walnut Base',
      dimensions: '200mm Diameter Semi-Cylinder',
    },
    createdAt: '2026-09-30T10:00:00Z',
  },

  // Lighting Shelf (2 products)
  {
    id: 'light-01',
    slug: 'apollo-precision-lunar-lamp',
    name: 'Apollo Precision Lunar Orb Lamp',
    tagline: 'Topographically mapped moon lamp with hidden dual-spectrum LEDs',
    description: 'High-resolution lunar sphere with scientifically verified topography derived from NASA lunar reconnaissance orbital data. Fitted with magnetic touch-docking base.',
    price: 4500,
    originalPrice: 5800,
    category: 'Moon Lamps',
    categorySlug: 'moon-lamps',
    shelf: 'Lighting',
    shelfSlug: 'lighting',
    rating: 4.9,
    reviewsCount: 114,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'sphere',
    inStock: true,
    stock: 40,
    isCustomizable: false,
    specs: {
      material: 'Biodegradable PLA Silk Polymer',
      resolution: '50 Microns',
      finish: 'Matte Lunar Surface',
      dimensions: '180mm Diameter Sphere',
    },
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'light-02',
    slug: 'zenith-minimalist-table-lamp',
    name: 'Zenith Minimalist Monolith Table Lamp',
    tagline: 'Fluted architectural table lantern with warm diffusion',
    description: 'Cast with architectural fluting and a hollow spiral light tunnel. Emits a gentle 360-degree ambient halo without harsh glare.',
    price: 6800,
    originalPrice: 7900,
    category: 'Table Lamps',
    categorySlug: 'table-lamps',
    shelf: 'Lighting',
    shelfSlug: 'lighting',
    rating: 4.8,
    reviewsCount: 56,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'prism',
    inStock: true,
    stock: 20,
    isCustomizable: false,
    specs: {
      material: 'Ceramic Composite Resin',
      resolution: '30 Microns',
      finish: 'Matte White Chalk',
      dimensions: '120mm x 120mm x 320mm',
    },
    createdAt: '2026-09-29T10:00:00Z',
  },

  // Home Decor Shelf (2 products)
  {
    id: 'home-01',
    slug: 'voronoi-spiral-amphora-vase',
    name: 'Voronoi Spiral Watertight Amphora Vase',
    tagline: 'Parametric architectural vessel for botanical stems',
    description: 'Generative spiral form engineered with thick internal watertight barrier walls. Beautiful as an independent sculpture or botanical vessel.',
    price: 3800,
    originalPrice: 4600,
    category: 'Vases',
    categorySlug: 'vases',
    shelf: 'Home Decor',
    shelfSlug: 'home-decor',
    rating: 4.9,
    reviewsCount: 92,
    badge: 'Editor Choice',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'torus',
    inStock: true,
    stock: 18,
    isCustomizable: true,
    options: [
      {
        name: 'Ceramic Tone',
        type: 'color',
        values: [
          { label: 'Satin Obsidian', value: '#0B0B0B' },
          { label: 'Matte Chalk White', value: '#F3F1EC' },
        ],
      },
      {
        name: 'Vessel Scale',
        type: 'select',
        values: [
          { label: 'Tabletop 260mm', value: 'standard' },
          { label: 'Floor Statement 420mm', value: 'oversized' },
        ],
      },
      {
        name: 'Base Stamp Text',
        type: 'text',
        values: [{ placeholder: 'Studio seal or name', maxLength: 16 }],
      },
    ],
    specs: {
      material: 'Hydrophobic Ceramic Infused Polymer',
      resolution: '40 Microns',
      finish: 'Satin Obsidian Black',
      dimensions: '140mm x 140mm x 260mm',
    },
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'home-02',
    slug: 'brutalist-silent-radial-clock',
    name: 'Brutalist Silent Radial Desk Clock',
    tagline: 'Deep-set shadowed numerals with silent sweep mechanism',
    description: 'Minimalist radial timepiece featuring faceted hour wedges and high-torque silent quartz movement. No ticking, pure serenity.',
    price: 5200,
    originalPrice: 6200,
    category: 'Clocks',
    categorySlug: 'clocks',
    shelf: 'Home Decor',
    shelfSlug: 'home-decor',
    rating: 5.0,
    reviewsCount: 41,
    badge: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'cyber-cube',
    inStock: true,
    stock: 30,
    isCustomizable: false,
    specs: {
      material: 'Stone Composite Sintered Resin',
      resolution: '35 Microns',
      finish: 'Raw Chalk Grey',
      dimensions: '160mm x 160mm x 45mm',
    },
    createdAt: '2026-09-27T10:00:00Z',
  },

  // Desk & Office Shelf (1 product)
  {
    id: 'desk-01',
    slug: 'aero-arch-headphone-pedestal',
    name: 'Aero-Arch Dual-Material Headphone Pedestal',
    tagline: 'Sculptural headphone arch with weighted steel base',
    description: 'Curved to match ergonomic headband contours preventing foam compression. Heavy concealed base provides stable single-handed docking.',
    price: 4900,
    originalPrice: 5900,
    category: 'Headphone Stands',
    categorySlug: 'headphone-stands',
    shelf: 'Desk & Office',
    shelfSlug: 'desk-office',
    rating: 4.9,
    reviewsCount: 77,
    badge: 'Desk Setup',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'headset',
    inStock: true,
    stock: 35,
    isCustomizable: false,
    specs: {
      material: 'Carbon Lattice & Steel Counterweight',
      resolution: '30 Microns',
      finish: 'Matte Gunmetal Obsidian',
      dimensions: '130mm x 130mm x 280mm',
    },
    createdAt: '2026-09-26T10:00:00Z',
  },

  // Devotional Shelf (1 product)
  {
    id: 'devo-01',
    slug: 'serene-parametric-ganesha-idol',
    name: 'Serene Parametric Ganesha Divine Idol',
    tagline: 'Modern architectural sacred form crafted in pure chalk marble resin',
    description: 'Graceful flowing facets evoking timeless divinity with contemporary minimalist restraint. Coated in non-porous ceremonial protective sealant.',
    price: 7500,
    originalPrice: 9000,
    category: 'Idols',
    categorySlug: 'idols',
    shelf: 'Devotional',
    shelfSlug: 'devotional',
    rating: 5.0,
    reviewsCount: 153,
    badge: 'Divine',
    image: 'https://images.unsplash.com/photo-1567591414240-e14b2d5f3089?w=1200&auto=format&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1567591414240-e14b2d5f3089?w=1200&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85',
    ],
    geometryType: 'prism',
    inStock: true,
    stock: 22,
    isCustomizable: true,
    options: [
      {
        name: 'Micro-SLA Finish Tone',
        type: 'color',
        values: [
          { label: 'Pristine Chalk White', value: '#F3F1EC' },
          { label: 'Deep Basalt Onyx', value: '#0B0B0B' },
        ],
      },
      {
        name: 'Consecration Pedestal Text',
        type: 'text',
        values: [{ placeholder: 'Name or Auspicious Date', maxLength: 25 }],
      },
    ],
    specs: {
      material: 'Marble-Infused Micro-SLA Resin',
      resolution: '20 Microns Ultra-Fine',
      finish: 'Pristine Chalk White',
      dimensions: '110mm x 100mm x 165mm',
    },
    createdAt: '2026-09-18T10:00:00Z',
  },
];
