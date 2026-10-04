'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { useState } from 'react';
import { QuietButton } from '@/components/ui/quiet-button';

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
    }, 1000);
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
            className="fixed inset-0 bg-onyx/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-canvas text-ink border-l border-hairline-light h-full flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-hairline-light flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 stroke-[1.4]" />
                <h3 className="font-heading text-sm font-light tracking-apple-wide uppercase">
                  Archival Bag
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-hairline-light bg-[#EBE7DF] text-ink">
                  {totalItems}
                </span>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded text-slate hover:text-ink transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[1.4]" />
              </button>
            </div>

            {/* Free Shipping Tier */}
            <div className="px-6 py-3.5 bg-[#EBE7DF]/40 border-b border-hairline-light">
              <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                <span className="text-slate text-[11px]">
                  {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-ink font-medium">Complimentary Worldwide Dispatch Qualified</span>
                  ) : (
                    <span>Add {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} for complimentary shipping</span>
                  )}
                </span>
                <span className="font-mono text-[10px] text-slate">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1 bg-[#E4E1DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-ink transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkoutSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full border border-hairline-light flex items-center justify-center text-ink mb-4">
                    <ShieldCheck className="w-6 h-6 stroke-[1.2]" />
                  </div>
                  <h4 className="font-heading text-base font-light tracking-apple-wide mb-1">
                    Fabrication Queued
                  </h4>
                  <p className="text-xs text-slate max-w-xs">
                    Your archival order has been entered into the SLS printing queue.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full border border-hairline-light flex items-center justify-center text-slate mb-4">
                    <ShoppingBag className="w-5 h-5 stroke-[1.2]" />
                  </div>
                  <h4 className="font-heading text-sm font-light tracking-apple-wide text-ink mb-1">
                    Bag Is Empty
                  </h4>
                  <p className="text-xs text-slate max-w-xs mb-6">
                    Select an architectural object to begin fabrication.
                  </p>
                  <QuietButton variant="light" onClick={() => setIsDrawerOpen(false)}>
                    Browse Collection
                  </QuietButton>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-4 p-3 rounded-xl border border-hairline-light bg-canvas hover:border-slate/40 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#ECE9E2] shrink-0 border border-hairline-light">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-heading text-xs font-light tracking-apple-wide text-ink leading-tight">
                            {item.product.name}
                          </h5>
                          <span className="text-[10px] text-slate font-mono uppercase">
                            {item.product.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate hover:text-ink transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.3]" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-hairline-light">
                        <div className="flex items-center border border-hairline-light rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:text-ink text-slate transition-colors"
                          >
                            <Minus className="w-3 h-3 stroke-[1.4]" />
                          </button>
                          <span className="px-2 text-xs font-mono text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:text-ink text-slate transition-colors"
                          >
                            <Plus className="w-3 h-3 stroke-[1.4]" />
                          </button>
                        </div>

                        <span className="text-xs font-heading font-light tracking-wider">
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
              <div className="p-6 border-t border-hairline-light bg-[#EBE7DF]/30 space-y-4">
                <div className="space-y-1.5 text-xs text-slate">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-ink font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispatch</span>
                    <span className="text-ink font-medium">
                      {totalPrice >= FREE_SHIPPING_THRESHOLD ? 'Complimentary' : '$15.00'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-hairline-light text-sm font-heading font-light tracking-wide text-ink">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        totalPrice + (totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 15)
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 bg-ink hover:bg-black text-chalk text-xs font-heading tracking-apple-wide transition-all uppercase rounded-xl flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    'Authenticating...'
                  ) : (
                    <>
                      <span>Secure Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate pt-1">
                  <span>Apple Pay &bull; Encrypted</span>
                  <button
                    onClick={clearCart}
                    className="hover:text-ink underline transition-colors"
                  >
                    Clear bag
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
