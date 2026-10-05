'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCart, getCartItemId } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { QuietButton } from '@/components/ui/quiet-button';

const FREE_SHIPPING_THRESHOLD_INR = 5000;

export function CartPageView() {
  const {
    items,
    isLoaded,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD_INR || totalPrice === 0 ? 0 : 450;
  const orderTotal = totalPrice + shippingCost;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        clearCart();
        setCheckoutSuccess(false);
      }, 3500);
    }, 1200);
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-10 font-sans">
      {/* 1. Breadcrumbs */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: 'Archival Bag' },
          ]}
          theme="light"
        />
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-hairline-light pb-8">
        <div>
          <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1.5">
            Level X 3D &bull; Selected Editions
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-ink uppercase leading-tight">
            Your Archival Bag
          </h1>
        </div>

        {items.length > 0 && !checkoutSuccess && (
          <div className="flex items-center gap-4 text-xs font-mono text-slate">
            <span>
              <strong className="text-ink font-semibold">{totalItems}</strong> {totalItems === 1 ? 'Object' : 'Objects'}
            </span>
            <span>&bull;</span>
            <button
              onClick={clearCart}
              className="hover:text-ink underline transition-colors"
            >
              Clear Bag
            </button>
          </div>
        )}
      </div>

      {/* 3. Checkout Success State */}
      {checkoutSuccess ? (
        <div className="py-20 px-6 max-w-xl mx-auto rounded-3xl border border-hairline-light bg-[#ECE9E2]/50 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-hairline-light mx-auto flex items-center justify-center text-ink bg-canvas shadow-sm">
            <ShieldCheck className="w-8 h-8 stroke-[1.2]" />
          </div>
          <div className="space-y-2">
            <span className="font-heading text-xs tracking-apple-widest text-slate uppercase block">
              Order Confirmed &bull; Fabrication Queued
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
              Thank You For Your Commission
            </h2>
            <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed">
              Your archival order has been scheduled for micro-SLA laser fabrication. Our studio master will verify layer parameters and dispatch via insured courier.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/shop">
              <QuietButton variant="light">
                Return to Collection &rarr;
              </QuietButton>
            </Link>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* 4. Tasteful Apple-Grade Empty State */
        <div className="py-24 px-6 max-w-2xl mx-auto rounded-3xl border border-hairline-light bg-[#ECE9E2]/40 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-hairline-light mx-auto flex items-center justify-center text-slate bg-canvas">
            <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
          </div>

          <div className="space-y-2">
            <span className="font-heading text-xs tracking-apple-widest text-slate uppercase block font-light">
              Archival Bag &bull; 0 Objects
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
              Your Bag Is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed font-sans">
              Your architectural collection awaits. Discover precision micro-SLA and laser-sintered editions crafted in numbered runs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/shop">
              <QuietButton variant="light">
                Explore The Collection &rarr;
              </QuietButton>
            </Link>
            <Link href="/shop/signature-premium">
              <QuietButton variant="light" className="text-slate hover:text-ink">
                View Signature Pieces &rarr;
              </QuietButton>
            </Link>
          </div>
        </div>
      ) : (
        /* 5. 2-Column Full Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Line Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const itemKey = item.id || getCartItemId(item.product.id, item.selectedOptions);
                  const hasOptions = item.selectedOptions && Object.keys(item.selectedOptions).length > 0;
                  const lineTotal = item.product.price * item.quantity;

                  return (
                    <motion.div
                      key={itemKey}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="p-5 sm:p-6 rounded-2xl border border-hairline-light bg-canvas hover:border-slate/40 transition-colors shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Thumbnail */}
                        <Link
                          href={`/product/${item.product.slug || item.product.id}`}
                          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#ECE9E2] shrink-0 border border-hairline-light group"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="112px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {/* Title, Category & Price */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-mono text-slate uppercase tracking-wider block mb-1">
                                {item.product.shelf} &bull; {item.product.category}
                              </span>
                              <Link
                                href={`/product/${item.product.slug || item.product.id}`}
                                className="font-heading text-base sm:text-lg font-light tracking-apple-wide text-ink hover:text-slate transition-colors leading-snug block"
                              >
                                {item.product.name}
                              </Link>
                            </div>

                            <button
                              onClick={() => removeItem(itemKey)}
                              className="text-slate hover:text-ink transition-colors p-1.5 rounded-lg border border-transparent hover:border-hairline-light"
                              aria-label="Remove item"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4 stroke-[1.3]" />
                            </button>
                          </div>

                          <div className="pt-2 text-xs font-mono text-slate">
                            Unit Price: <span className="text-ink font-medium">{formatPrice(item.product.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Chosen Options Box */}
                      {hasOptions && (
                        <div className="p-3.5 rounded-xl bg-[#ECE9E2]/40 border border-hairline-light space-y-2">
                          <div className="text-[10px] font-mono text-slate uppercase flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-slate" />
                            <span>Bespoke Configuration:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.selectedOptions!).map(([key, val]) => {
                              if (!val) return null;
                              return (
                                <div
                                  key={key}
                                  className="text-xs font-sans px-3 py-1 rounded-lg bg-canvas border border-hairline-light text-ink flex items-center gap-1.5 shadow-xs"
                                >
                                  <span className="text-slate font-mono text-[10px] uppercase">{key}:</span>
                                  <span className="font-medium">{val}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quantity Controls and Line Total Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-hairline-light">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate hidden sm:inline">
                            Quantity:
                          </span>
                          <div className="flex items-center border border-hairline-light rounded-xl bg-canvas overflow-hidden">
                            <button
                              onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                              className="px-3 py-1.5 hover:text-ink text-slate transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[1.4]" />
                            </button>
                            <span className="px-3 text-xs font-mono text-ink font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                              className="px-3 py-1.5 hover:text-ink text-slate transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[1.4]" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate uppercase block leading-none mb-1">
                            Line Total
                          </span>
                          <span className="font-heading text-base sm:text-lg font-light tracking-wider text-ink font-medium">
                            {formatPrice(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Return to shop link */}
            <div className="pt-4">
              <Link
                href="/shop"
                className="text-xs font-heading font-light tracking-apple-wide text-slate hover:text-ink transition-colors inline-flex items-center gap-1"
              >
                &larr; Continue Exploring Catalog
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 sticky lg:top-28 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl border border-hairline-light bg-[#ECE9E2]/40 space-y-6 shadow-sm">
              <h3 className="font-heading text-sm font-light tracking-apple-wide uppercase text-ink border-b border-hairline-light pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs font-sans text-slate">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-ink font-mono font-medium">{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Pan-India Insured Dispatch</span>
                  <span className="text-ink font-medium">
                    {shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}
                  </span>
                </div>

                {totalPrice < FREE_SHIPPING_THRESHOLD_INR && (
                  <p className="text-[11px] text-slate/80 font-mono">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD_INR - totalPrice)} more for complimentary insured courier.
                  </p>
                )}

                <div className="flex justify-between pt-4 border-t border-hairline-light text-base font-heading font-light tracking-wide text-ink">
                  <span className="uppercase">Total (INR)</span>
                  <span className="font-mono text-lg font-medium">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Action */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-onyx hover:bg-ink text-chalk text-xs sm:text-sm font-heading font-light tracking-apple-wide uppercase rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-center"
              >
                <span>Proceed to Checkout &bull; {formatPrice(orderTotal)}</span>
                <ArrowRight className="w-4 h-4 stroke-[1.4]" />
              </Link>

              {/* Provenance assurances */}
              <div className="space-y-2.5 pt-4 border-t border-hairline-light text-[11px] font-mono text-slate">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate stroke-[1.5]" />
                  <span>25-Micron Sintered Authenticity</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate stroke-[1.5]" />
                  <span>Numbered Studio Archival Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-slate stroke-[1.5]" />
                  <span>Insured Pan-India Express Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
