'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

export function useWishlist() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('levelx3d_wishlist');
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      }
      setIsLoaded(true);
    };

    loadWishlist();

    const handleUpdate = () => loadWishlist();
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  const saveWishlist = (newItems: Product[]) => {
    setItems(newItems);
    localStorage.setItem('levelx3d_wishlist', JSON.stringify(newItems));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      saveWishlist(items.filter((item) => item.id !== product.id));
    } else {
      saveWishlist([...items, product]);
    }
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  return {
    items,
    isLoaded,
    totalItems: items.length,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };
}
