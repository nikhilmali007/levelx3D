import { useState, useEffect } from 'react';
import { Product } from '@/lib/products-data';

const COMPARE_KEY = 'levelx3d_compare';
const MAX_COMPARE = 4;

export function useCompare() {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(COMPARE_KEY);
    if (saved) {
      try {
        setCompareItems(JSON.parse(saved));
      } catch (e) {
        console.warn('Could not parse compare items', e);
      }
    }
  }, []);

  const toggleCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= MAX_COMPARE) {
          alert('You can compare up to 4 items at a time.');
          return prev;
        }
        updated = [...prev, product];
      }
      localStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeCompare = (id: string) => {
    setCompareItems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
    localStorage.removeItem(COMPARE_KEY);
  };

  const isInCompare = (id: string) => compareItems.some((p) => p.id === id);

  return { compareItems, toggleCompare, removeCompare, clearCompare, isInCompare };
}
