import { useState, useEffect } from 'react';
import { Product } from '@/lib/products-data';

const RECENTLY_VIEWED_KEY = 'levelx3d_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.warn('Could not parse recently viewed from local storage', e);
      }
    }
  }, []);

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recentlyViewed, addRecentlyViewed };
}
