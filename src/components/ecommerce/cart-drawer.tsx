'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { useState } from 'react';

const FREE_SHIPPING_THRESHOLD = 250;

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const freeShippingProgress = Math.min(
    100,
    Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        clearCart();
        setCheckoutSuccess(false);
        setIsDrawerOpen(false);
      }, 2500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-slate-900 border-l border-white/10 h-full flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan" />
                <h3 className="text-lg font-bold text-white">Your Cart</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30 font-mono">
                  {totalItems} items
                </span>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Tier */}
            <div className="px-6 py-3 bg-slate-950/40 border-b border-white/5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Truck className="w-3.5 h-3.5 text-cyan" />
                  {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-cyan font-semibold">🎉 You unlocked FREE Worldwide Express Shipping!</span>
                  ) : (
                    <span>Add {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} for FREE Shipping</span>
                  )}
                </span>
                <span className="font-mono text-cyan">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan to-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkoutSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-cyan/20 border border-cyan flex items-center justify-center text-cyan mb-4 animate-bounce">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Order Confirmed!</h4>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Your Level X 3D artifacts have been queued for precision printing and shipping.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">Your cart is empty</h4>
                  <p className="text-sm text-slate-400 max-w-xs mb-6">
                    Discover futuristic 3D printed artifacts and add them to your collection.
                  </p>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                    Browse Catalog
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="text-sm font-semibold text-white leading-tight">
                            {item.product.name}
                          </h5>
                          <span className="text-[11px] text-cyan font-mono">
                            {item.product.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-white/10 rounded-lg bg-slate-900/80">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:text-cyan text-slate-400 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono text-white font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:text-cyan text-slate-400 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && !checkoutSuccess && (
              <div className="p-6 border-t border-white/10 bg-slate-950/60 space-y-4">
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-cyan font-medium">
                      {totalPrice >= FREE_SHIPPING_THRESHOLD ? 'FREE' : '$15.00'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10 text-base font-bold text-white">
                    <span>Total</span>
                    <span className="text-cyan">
                      {formatPrice(
                        totalPrice + (totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 15)
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full gap-2 text-base py-6"
                >
                  {isCheckingOut ? (
                    'Processing Order...'
                  ) : (
                    <>
                      <span>Secure Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    256-bit Encrypted Checkout
                  </span>
                  <button
                    onClick={clearCart}
                    className="hover:text-red-400 underline transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
