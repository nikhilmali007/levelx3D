'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, ProductOption } from '@/lib/products-data';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Share2, Check, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Heart, MessageCircle, Truck } from 'lucide-react';
import { QuietButton } from '@/components/ui/quiet-button';
import { useWishlist } from '@/hooks/use-wishlist';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { getEstimatedDeliveryDate } from '@/lib/shipping';
import { ShareButtons } from '@/components/ecommerce/share-buttons';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addRecentlyViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleNotifyMe = () => {
    if (!notifyEmail) return;
    const key = 'levelx3d_stock_notifications';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ email: notifyEmail, productId: product.id, productName: product.name, date: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
    setNotifySuccess(true);
  };

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  const inWishlist = isInWishlist(product.id);

  // Initialize selected options state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.options && product.options.length > 0) {
      product.options.forEach((opt) => {
        if (opt.type === 'color' || opt.type === 'select' || opt.type === 'radio') {
          const firstVal = opt.values[0];
          initial[opt.name] = firstVal?.value || firstVal?.label || '';
        } else if (opt.type === 'text') {
          initial[opt.name] = '';
        }
      });
    }
    return initial;
  });

  // Calculate price adjustments if any
  const calculatedPrice = product.price;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    // Map product to Cart product format
    addItem(product as any, quantity, selectedOptions);
  };

  const handleShare = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch (e) {
      console.warn('Could not copy link', e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header: Badge, Title & Tagline */}
      <div className="space-y-3 border-b border-hairline-light pb-6">
        <div className="flex items-center justify-between gap-4">
          <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase">
            {product.shelf} &bull; {product.category}
          </span>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate hover:text-ink border border-hairline-light hover:border-slate/50 transition-all bg-canvas"
            title="Share object link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        <h1 className="font-heading text-2xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase leading-snug">
          {product.name}
        </h1>

        <p className="text-sm text-slate font-sans leading-relaxed">
          {product.tagline}
        </p>
      </div>

      {/* 2. Price & Stock Status */}
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-3xl sm:text-4xl font-light tracking-wider text-ink">
            {formatPrice(calculatedPrice)}
          </span>
          {product.originalPrice && product.originalPrice > calculatedPrice && (
            <span className="font-heading text-lg font-light text-slate line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-slate">
            {product.inStock
              ? product.stock
                ? `${product.stock} in batch edition`
                : 'In Stock &bull; Micro-SLA'
              : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* 3. Description paragraph */}
      <div className="text-xs sm:text-sm text-slate/90 leading-relaxed font-sans border-b border-hairline-light pb-6">
        {product.description}
      </div>

      {/* 4. Product Customization Options (if customizable) */}
      {product.isCustomizable && product.options && product.options.length > 0 && (
        <div className="space-y-6 p-5 sm:p-6 rounded-2xl bg-[#ECE9E2]/50 border border-hairline-light">
          <div className="flex items-center gap-2 pb-2 border-b border-hairline-light">
            <Sparkles className="w-4 h-4 text-slate stroke-[1.5]" />
            <h3 className="font-heading text-xs tracking-apple-widest text-ink uppercase font-light">
              Bespoke Customization Options
            </h3>
          </div>

          {product.options.map((option: ProductOption) => {
            const currentVal = selectedOptions[option.name] || '';

            return (
              <div key={option.name} className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate uppercase tracking-wider text-[11px]">
                    {option.name}
                  </span>
                  {option.type === 'color' && (
                    <span className="text-ink font-mono text-[11px]">
                      {option.values.find((v) => v.value === currentVal)?.label || currentVal}
                    </span>
                  )}
                </div>

                {/* A. Color Swatches */}
                {option.type === 'color' && (
                  <div className="flex items-center gap-3">
                    {option.values.map((val) => {
                      const isSelected = currentVal === val.value;
                      return (
                        <button
                          key={val.value}
                          onClick={() => handleOptionChange(option.name, val.value || '')}
                          className={`relative w-8 h-8 rounded-full border transition-all ${
                            isSelected
                              ? 'ring-2 ring-ink ring-offset-2 ring-offset-canvas scale-105'
                              : 'border-hairline-dark/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: val.value }}
                          title={val.label}
                          aria-label={`Select ${val.label}`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* B. Select / Dropdown */}
                {option.type === 'select' && (
                  <select
                    value={currentVal}
                    onChange={(e) => handleOptionChange(option.name, e.target.value)}
                    className="w-full bg-canvas border border-hairline-light text-ink text-xs rounded-xl px-3.5 py-2.5 outline-none font-sans cursor-pointer focus:border-ink transition-colors"
                  >
                    {option.values.map((val) => (
                      <option key={val.value || val.label} value={val.value || val.label}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* C. Radio Pills */}
                {option.type === 'radio' && (
                  <div className="grid grid-cols-2 gap-2">
                    {option.values.map((val) => {
                      const isSelected = currentVal === (val.value || val.label);
                      return (
                        <button
                          key={val.value || val.label}
                          type="button"
                          onClick={() => handleOptionChange(option.name, val.value || val.label || '')}
                          className={`px-3 py-2 rounded-xl text-xs font-sans transition-all border text-left ${
                            isSelected
                              ? 'bg-ink text-chalk border-ink font-medium shadow-sm'
                              : 'bg-canvas text-slate border-hairline-light hover:text-ink'
                          }`}
                        >
                          {val.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* D. Bespoke Custom Text / Engraving Field */}
                {option.type === 'text' && (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={currentVal}
                      maxLength={option.values[0]?.maxLength || 30}
                      onChange={(e) => handleOptionChange(option.name, e.target.value)}
                      placeholder={option.values[0]?.placeholder || 'Enter custom text / name'}
                      className="w-full bg-canvas border border-hairline-light text-ink text-xs rounded-xl px-3.5 py-2.5 outline-none font-sans focus:border-ink transition-colors"
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate px-1">
                      <span>Max {option.values[0]?.maxLength || 30} chars</span>
                      <span>{currentVal.length} / {option.values[0]?.maxLength || 30}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Quantity & Primary Add to Cart Action */}
      <div className="space-y-4 pt-2">
        <div className="text-[11px] font-mono text-emerald-600 font-medium">
          Buy 3+ items for 5% off &bull; Buy 5+ for 10% off
        </div>
        <div className="flex items-center gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center border border-hairline-light rounded-xl bg-canvas overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-3.5 py-2.5 text-xs text-slate hover:text-ink disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className="w-8 text-center text-xs font-mono text-ink">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3.5 py-2.5 text-xs text-slate hover:text-ink transition-colors"
              aria-label="Increase quantity"
            >
              &#43;
            </button>
          </div>

          {/* Primary Add to Cart Button */}
          {product.inStock ? (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 py-3 px-6 rounded-xl bg-onyx text-chalk hover:bg-ink transition-all duration-200 text-xs sm:text-sm font-heading font-light tracking-apple-wide uppercase text-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {`Add to Bag \u2022 ${formatPrice(
                  calculatedPrice * quantity * (quantity >= 5 ? 0.9 : quantity >= 3 ? 0.95 : 1)
                )}`}
            </button>
          ) : notifySuccess ? (
            <div className="flex-1 py-3 px-6 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-700 text-xs text-center">
              We'll notify you when available!
            </div>
          ) : (
            <div className="flex-1 flex gap-2">
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="Enter email to be notified"
                className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-3 text-xs outline-none"
              />
              <button
                onClick={handleNotifyMe}
                className="py-3 px-4 rounded-xl bg-onyx text-chalk text-xs font-medium shrink-0"
              >
                Notify Me
              </button>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-3 sm:p-3.5 rounded-xl border transition-colors ${
              inWishlist
                ? 'bg-ink border-ink text-chalk'
                : 'bg-canvas border-hairline-light text-slate hover:border-ink hover:text-ink'
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Guarantees & Archival provenance */}
        <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] font-mono text-slate border-t border-hairline-light">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate stroke-[1.5]" />
            <span>Numbered Studio Edition</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate stroke-[1.5]" />
            <span>Pan-India Secure Insured Courier</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs font-mono text-slate bg-canvas border border-hairline-light rounded-xl p-3 flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Estimated delivery: <strong>{getEstimatedDeliveryDate('5-7 business days')}</strong></span>
          </div>
        </div>

        {/* WhatsApp Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917208752822';
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hi Level X 3D, I would like to order ${product.name} (Price: ${formatPrice(calculatedPrice)}). Please assist me with the fabrication and order details.`)}`, '_blank');
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors text-xs font-heading font-medium tracking-wide uppercase shadow-sm sm:col-span-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order via WhatsApp</span>
          </button>
        </div>

        <ShareButtons product={product as any} />
      </div>

      {/* 6. Technical Specifications Card */}
      <div className="pt-6 border-t border-hairline-light space-y-4">
        <h4 className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase">
          Technical Specifications
        </h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-hairline-light bg-canvas space-y-1">
            <dt className="text-[10px] font-mono text-slate uppercase">Material</dt>
            <dd className="font-sans text-ink">{product.specs.material}</dd>
          </div>
          <div className="p-3.5 rounded-xl border border-hairline-light bg-canvas space-y-1">
            <dt className="text-[10px] font-mono text-slate uppercase">Resolution</dt>
            <dd className="font-sans text-ink">{product.specs.resolution}</dd>
          </div>
          <div className="p-3.5 rounded-xl border border-hairline-light bg-canvas space-y-1">
            <dt className="text-[10px] font-mono text-slate uppercase">Finish</dt>
            <dd className="font-sans text-ink">{product.specs.finish}</dd>
          </div>
          <div className="p-3.5 rounded-xl border border-hairline-light bg-canvas space-y-1">
            <dt className="text-[10px] font-mono text-slate uppercase">Dimensions</dt>
            <dd className="font-sans text-ink">{product.specs.dimensions}</dd>
          </div>
          {product.weight_grams && (
            <div className="p-3.5 rounded-xl border border-hairline-light bg-canvas space-y-1">
              <dt className="text-[10px] font-mono text-slate uppercase">Weight</dt>
              <dd className="font-sans text-ink">{product.weight_grams} g</dd>
            </div>
          )}
        </dl>
      </div>

      {/* 7. Mobile Sticky Bottom Add to Cart Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-xl border-t border-hairline-light p-3.5 shadow-2xl transition-transform">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-hairline-light bg-[#ECE9E2] shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <span className="font-heading text-xs font-light tracking-wide text-ink truncate block">
                {product.name}
              </span>
              <span className="font-mono text-xs text-ink font-medium">
                {formatPrice(calculatedPrice)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="px-4 py-2.5 rounded-xl bg-onyx text-chalk text-xs font-heading font-light tracking-apple-wide uppercase whitespace-nowrap shadow-sm"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
