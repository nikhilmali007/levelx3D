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
    categories: [
      { name: 'Geometric Planters', slug: 'geometric-planters' },
      { name: 'Self-watering Pots', slug: 'self-watering-pots' },
      { name: 'Hanging Planters', slug: 'hanging-planters' },
      { name: 'Plant Markers', slug: 'plant-markers' },
    ],
  },
  {
    shelf: 'Kitchen & Utility',
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
    categories: [
      { name: 'Phone Holders', slug: 'tech-phone-holders' },
      { name: 'Earbud Cases', slug: 'earbud-cases' },
      { name: 'Cable Organisers', slug: 'cable-organisers' },
      { name: 'Charging Docks', slug: 'charging-docks' },
    ],
  },
  {
    shelf: 'Automotive',
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
    categories: [
      { name: 'Handbags', slug: 'bags-handbags' },
      { name: 'Clutches', slug: 'clutches' },
      { name: 'Tote Panels', slug: 'tote-panels' },
      { name: 'Bag Charms', slug: 'bag-charms' },
    ],
  },
  {
    shelf: 'Devotional',
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
    categories: [
      { name: 'Storage Boxes', slug: 'storage-boxes' },
      { name: 'Drawer Organisers', slug: 'drawer-organisers' },
      { name: 'Stackable Bins', slug: 'stackable-bins' },
      { name: 'Jewellery Organisers', slug: 'storage-jewellery-organisers' },
    ],
  },
  {
    shelf: 'Festive & Seasonal',
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
    categories: [
      { name: 'Upload Your Design', slug: 'upload-your-design' },
      { name: 'Photo to Lithophane', slug: 'custom-photo-to-lithophane' },
      { name: 'Custom Text Products', slug: 'custom-text-products' },
      { name: 'Bulk & Corporate Orders', slug: 'bulk-corporate-orders' },
    ],
  },
];

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in INR
  originalPrice?: number; // in INR
  category: string;
  shelf: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  geometryType: 'torus' | 'sphere' | 'cyber-cube' | 'prism' | 'headset';
  inStock: boolean;
  specs: {
    material: string;
    resolution: string;
    finish: string;
    dimensions: string;
  };
}

// 6 Placeholder products in the "Signature / Premium" shelf priced in INR
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prem-01',
    name: 'Lumina Voronoi Signature Designer Lamp',
    tagline: 'Parametric Voronoi cellular shell with touch warm LED diffusion',
    description: 'Architectural ambient table lamp featuring a generative Voronoi cellular shell. 3D printed with heat-resistant matte ceramic polymer, integrated with touch-dimming warm LED core (2700K).',
    price: 18500,
    originalPrice: 22000,
    category: 'Designer Lamps',
    shelf: 'Signature / Premium',
    rating: 5.0,
    reviewsCount: 48,
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&auto=format&fit=crop&q=85',
    geometryType: 'torus',
    inStock: true,
    specs: {
      material: 'Heat-Resistant Ceramic SLA Composite',
      resolution: '25 Microns',
      finish: 'Matte Chalk / Obsidian Black',
      dimensions: '180mm x 180mm x 280mm',
    },
  },
  {
    id: 'prem-02',
    name: 'Aura Geometrique Luxury Handbag',
    tagline: 'Parametric rigid lattice bag with aerospace magnetic hinges',
    description: 'Parametric rigid lattice handbag fabricated via Selective Laser Sintering (SLS) nylon PA12. Equipped with aerospace neodymium magnetic snap clasps, hand-stitched interior liner, and detachable chain.',
    price: 24900,
    originalPrice: 29500,
    category: 'Luxury Handbags',
    shelf: 'Signature / Premium',
    rating: 4.9,
    reviewsCount: 31,
    badge: 'Limited Run',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop&q=85',
    geometryType: 'cyber-cube',
    inStock: true,
    specs: {
      material: 'Sintered Nylon PA12 & Vegan Leather',
      resolution: '50 Microns SLS',
      finish: 'Vapor-Polished Obsidian',
      dimensions: '220mm x 140mm x 75mm',
    },
  },
  {
    id: 'prem-03',
    name: 'Maha-Mandir Bespoke Custom Temple',
    tagline: 'Sacred architectural sanctuary with micro-sintered jali carvings',
    description: 'Sacred home sanctuary manufactured with micro-sintered jali fretwork and stone-composite polymer. Features concealed LED halo backlighting, pull-out bhog tray, and customizable deity niche dimensions.',
    price: 58000,
    originalPrice: 68000,
    category: 'Custom Temple',
    shelf: 'Signature / Premium',
    rating: 5.0,
    reviewsCount: 19,
    badge: 'Bespoke Order',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=85',
    geometryType: 'prism',
    inStock: true,
    specs: {
      material: 'Direct Stone Composite & Laser Sintered Jali',
      resolution: '30 Microns',
      finish: 'Hand-Finished Marble Chalk & Warm Gold',
      dimensions: '450mm x 350mm x 600mm',
    },
  },
  {
    id: 'prem-04',
    name: 'Porsche 911 GT3 RS 3D Car Frame Wall Art',
    tagline: 'Aerodynamic half-scale supercar relief in anodized museum frame',
    description: 'Half-scale high-precision aerodynamic body sculpture emerging from a matte black aluminum gallery frame. Laser-sintered curves with technical CAD drafting blueprint background and museum acrylic cover.',
    price: 14500,
    originalPrice: 17500,
    category: '3D Car Frame Wall Art',
    shelf: 'Signature / Premium',
    rating: 4.9,
    reviewsCount: 64,
    badge: 'Collector',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1000&auto=format&fit=crop&q=85',
    geometryType: 'headset',
    inStock: true,
    specs: {
      material: 'Aero Polymer Shell & Anodized Aluminum',
      resolution: '20 Microns High-Def',
      finish: 'Matte Chalk on Deep Onyx Frame',
      dimensions: '500mm x 400mm x 85mm Depth',
    },
  },
  {
    id: 'prem-05',
    name: 'Ethereal Monolith Topographical Wall Sculpture',
    tagline: 'Parametric fluid wave sculpture with acoustic wave chambers',
    description: 'Parametric fluid wave sculpture crafted through multi-axis laser sintering. Designed with interior acoustic sound-dampening hollow chambers and finished in vapor-smoothed chalk obsidian finish.',
    price: 19900,
    originalPrice: 24000,
    category: 'Wall Sculptures',
    shelf: 'Signature / Premium',
    rating: 4.8,
    reviewsCount: 27,
    badge: 'Architectural',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=85',
    geometryType: 'sphere',
    inStock: true,
    specs: {
      material: 'Laser-Sintered Acoustic Nylon Matrix',
      resolution: '40 Microns',
      finish: 'Vapor-Smoothed Chalk White',
      dimensions: '600mm x 600mm x 70mm',
    },
  },
  {
    id: 'prem-06',
    name: 'Curved Panorama Bespoke Lithophane Art Frame',
    tagline: 'High-density micro-photopolymer backlit photo relief',
    description: 'Custom panoramic photo relief printed with 12-micron high-density photopolymer. Seamlessly reveals lifelike photographic contrast and warm grayscale shadows when backlit by the integrated touch base.',
    price: 8900,
    originalPrice: 10500,
    category: 'Lithophane Photo Art',
    shelf: 'Signature / Premium',
    rating: 5.0,
    reviewsCount: 82,
    badge: 'Personalized',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=85',
    geometryType: 'torus',
    inStock: true,
    specs: {
      material: 'Ultra-Fine 12μm Optical Photopolymer',
      resolution: '12 Microns Micro-SLA',
      finish: 'Translucent Optical Relief & Walnut Base',
      dimensions: '200mm Diameter Semi-Cylinder',
    },
  },
];
