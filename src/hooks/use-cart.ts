'use client';

import { useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';

const CART_STORAGE_KEY = 'levelx3d_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync from localStorage on mount
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
        if (updated) setItems(JSON.parse(updated));
      } catch (e) {}
    };

    window.addEventListener('cart-updated', handleStorageChange);
    return () => window.removeEventListener('cart-updated', handleStorageChange);
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {}
  };

  const addItem = (product: Product, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...items, { product, quantity }];
    }

    saveItems(updated);
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    const updated = items.filter((i) => i.product.id !== productId);
    saveItems(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const updated = items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
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
