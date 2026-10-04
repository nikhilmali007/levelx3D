export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  shelf?: string;
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
  slug?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedOptions?: Record<string, string>;
}
