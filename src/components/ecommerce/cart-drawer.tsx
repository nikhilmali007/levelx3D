'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart, getCartItemId } from '@/hooks/use-cart';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { QuietButton } from '@/components/ui/quiet-button';

const FREE_SHIPPING_THRESHOLD_INR = 5000;

export function CartDrawer() {
  const {
    items,
    isLoaded,
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
    Math.round((totalPrice / FREE_SHIPPING_THRESHOLD_INR) * 100)
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
            className="relative w-full max-w-md bg-canvas text-ink border-l border-hairline-light h-full flex flex-col shadow-2xl z-10 font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-hairline-light flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 stroke-[1.4]" />
                <h3 className="font-heading text-sm font-light tracking-apple-wide uppercase text-ink">
                  Archival Bag
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-hairline-light bg-[#EBE7DF] text-ink">
                  {isLoaded ? totalItems : 0}
                </span>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded text-slate hover:text-ink transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-4 h-4 stroke-[1.4]" />
              </button>
            </div>

            {/* Free Shipping Tier (INR) */}
            <div className="px-6 py-3.5 bg-[#EBE7DF]/40 border-b border-hairline-light">
              <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                <span className="text-slate text-[11px]">
                  {totalPrice >= FREE_SHIPPING_THRESHOLD_INR ? (
                    <span className="text-ink font-medium">Complimentary Insured Courier Qualified</span>
                  ) : (
                    <span>Add {formatPrice(FREE_SHIPPING_THRESHOLD_INR - totalPrice)} for complimentary courier</span>
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
                  <h4 className="font-heading text-base font-light tracking-apple-wide mb-1 uppercase">
                    Fabrication Queued
                  </h4>
                  <p className="text-xs text-slate max-w-xs font-sans">
                    Your archival order has been entered into the micro-SLA and SLS printing queue.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full border border-hairline-light flex items-center justify-center text-slate mb-4">
                    <ShoppingBag className="w-5 h-5 stroke-[1.2]" />
                  </div>
                  <h4 className="font-heading text-sm font-light tracking-apple-wide text-ink mb-1 uppercase">
                    Your Bag Is Empty
                  </h4>
                  <p className="text-xs text-slate max-w-xs mb-6 font-sans leading-relaxed">
                    Select an architectural 3D printed piece or commission a bespoke geometry to begin fabrication.
                  </p>
                  <Link href="/shop" onClick={() => setIsDrawerOpen(false)}>
                    <QuietButton variant="light" size="sm">
                      Explore Collection &rarr;
                    </QuietButton>
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const itemKey = item.id || getCartItemId(item.product.id, item.selectedOptions);
                  const hasOptions = item.selectedOptions && Object.keys(item.selectedOptions).length > 0;

                  return (
                    <motion.div
                      key={itemKey}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3.5 rounded-xl border border-hairline-light bg-canvas hover:border-slate/40 transition-colors space-y-3"
                    >
                      <div className="flex gap-3.5">
                        <Link
                          href={`/product/${item.product.slug || item.product.id}`}
                          onClick={() => setIsDrawerOpen(false)}
                          className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#ECE9E2] shrink-0 border border-hairline-light"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${item.product.slug || item.product.id}`}
                                onClick={() => setIsDrawerOpen(false)}
                                className="font-heading text-xs font-light tracking-apple-wide text-ink hover:text-slate transition-colors truncate block"
                              >
                                {item.product.name}
                              </Link>
                              <span className="text-[10px] text-slate font-mono uppercase block">
                                {item.product.shelf} &bull; {item.product.category}
                              </span>
                            </div>
                            <button
                              onClick={() => removeItem(itemKey)}
                              className="text-slate hover:text-ink transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[1.3]" />
                            </button>
                          </div>

                          <div className="text-xs font-mono text-ink mt-1">
                            {formatPrice(item.product.price)} each
                          </div>
                        </div>
                      </div>

                      {/* Chosen Options Badges */}
                      {hasOptions && (
                        <div className="pt-2 border-t border-hairline-light/60 space-y-1">
                          <div className="text-[10px] font-mono text-slate uppercase flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Configured Options:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(item.selectedOptions!).map(([key, val]) => {
                              if (!val) return null;
                              return (
                                <span
                                  key={key}
                                  className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#ECE9E2] border border-hairline-light text-ink flex items-center gap-1"
                                >
                                  <span className="text-slate font-mono text-[9px] uppercase">{key}:</span>
                                  <span className="font-medium truncate max-w-[150px]">{val}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quantity Controls and Line Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-hairline-light">
                        <div className="flex items-center border border-hairline-light rounded-lg bg-canvas">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="px-2.5 py-1 hover:text-ink text-slate transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 stroke-[1.4]" />
                          </button>
                          <span className="px-2 text-xs font-mono text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="px-2.5 py-1 hover:text-ink text-slate transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 stroke-[1.4]" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate block leading-none">Line Total</span>
                          <span className="text-xs font-heading font-light tracking-wider text-ink font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && !checkoutSuccess && (
              <div className="p-6 border-t border-hairline-light bg-[#EBE7DF]/30 space-y-4">
                <div className="space-y-1.5 text-xs text-slate">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-ink font-medium font-mono">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Courier</span>
                    <span className="text-ink font-medium">
                      {totalPrice >= FREE_SHIPPING_THRESHOLD_INR ? 'Complimentary' : '₹450'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-hairline-light text-sm font-heading font-light tracking-wide text-ink">
                    <span className="uppercase">Estimated Total</span>
                    <span className="font-mono text-base">
                      {formatPrice(
                        totalPrice + (totalPrice >= FREE_SHIPPING_THRESHOLD_INR ? 0 : 450)
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/checkout"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-3.5 bg-onyx hover:bg-ink text-chalk text-xs font-heading tracking-apple-wide transition-all uppercase rounded-xl flex items-center justify-center gap-2 shadow-sm text-center"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-heading tracking-apple-wide uppercase text-slate hover:text-ink border border-hairline-light rounded-xl transition-colors hover:border-slate/40"
                  >
                    View Full Cart Page &rarr;
                  </Link>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate pt-1 font-mono">
                  <span>Pan-India Insured Dispatch</span>
                  <button
                    onClick={clearCart}
                    className="hover:text-ink underline transition-colors"
                  >
                    Clear Bag
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
