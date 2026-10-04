export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'Wearables' | 'Desk Art' | 'Collectibles' | 'Cyber Gear';
  rating: number;
  reviewsCount: number;
  badge?: 'Best Seller' | 'Limited Edition' | 'New Arrival' | '3D Interactive';
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

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}
