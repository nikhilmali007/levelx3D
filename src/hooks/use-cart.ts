'use client';

import { useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';

const CART_STORAGE_KEY = 'levelx3d_cart';

export const getCartItemId = (productId: string, options?: Record<string, string>): string => {
  if (!options || Object.keys(options).length === 0) return productId;
  return `${productId}::${JSON.stringify(options)}`;
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpenState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync from localStorage on mount and register listeners
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setIsLoaded(true);

    const handleStorageChange = () => {
      try {
        const updated = localStorage.getItem(CART_STORAGE_KEY);
        if (updated) {
          setItems(JSON.parse(updated));
        } else {
          setItems([]);
        }
      } catch (e) { console.warn('Context-specific message:', e); }
    };

    const handleDrawerState = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.open === 'boolean') {
        setIsDrawerOpenState(customEvent.detail.open);
      }
    };

    window.addEventListener('cart-updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-drawer-state', handleDrawerState);

    return () => {
      window.removeEventListener('cart-updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-drawer-state', handleDrawerState);
    };
  }, []);

  const setIsDrawerOpen = (open: boolean) => {
    setIsDrawerOpenState(open);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-drawer-state', { detail: { open } }));
    }
  };

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) { console.warn('Context-specific message:', e); }
  };

  const addItem = (product: Product, quantity = 1, selectedOptions?: Record<string, string>) => {
    const itemId = getCartItemId(product.id, selectedOptions);
    const existingIndex = items.findIndex((i) => (i.id || getCartItemId(i.product.id, i.selectedOptions)) === itemId);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...items, { id: itemId, product, quantity, selectedOptions }];
    }

    saveItems(updated);
    setIsDrawerOpen(true);
    
    import('@/lib/analytics').then(({ trackEvent }) => {
      trackEvent('add_to_cart', {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity,
      });
    });
  };

  const removeItem = (itemId: string) => {
    const updated = items.filter((i) => {
      const currentId = i.id || getCartItemId(i.product.id, i.selectedOptions);
      return currentId !== itemId && i.product.id !== itemId;
    });
    saveItems(updated);
    
    import('@/lib/analytics').then(({ trackEvent }) => {
      trackEvent('remove_from_cart', { item_id: itemId });
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const updated = items.map((i) => {
      const currentId = i.id || getCartItemId(i.product.id, i.selectedOptions);
      return currentId === itemId || i.product.id === itemId ? { ...i, quantity } : i;
    });
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return {
    items,
    isLoaded,
    isDrawerOpen,
    setIsDrawerOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
