'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product, SHELVES_DATA } from '@/lib/products-data';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ecommerce/breadcrumbs';
import { AnimatedCard } from '@/components/motion/animated-card';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { QuietButton } from '@/components/ui/quiet-button';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { SlidersHorizontal, ArrowUpDown, X, Box, Sparkles } from 'lucide-react';

interface ShopCatalogViewProps {
  title: string;
  subtitle?: string;
  initialProducts: Product[];
  currentShelfSlug?: string;
  currentCategorySlug?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function ShopCatalogView({
  title,
  subtitle,
  initialProducts,
  currentShelfSlug,
  currentCategorySlug,
  breadcrumbs,
}: ShopCatalogViewProps) {
  const { addItem } = useCart();
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [priceRange, setPriceRange] = useState<'all' | 'under-5k' | '5k-20k' | 'above-20k'>('all');

  // Filter & Sort calculation
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Price Filter
    if (priceRange === 'under-5k') {
      list = list.filter((p) => p.price < 5000);
    } else if (priceRange === '5k-20k') {
      list = list.filter((p) => p.price >= 5000 && p.price <= 20000);
    } else if (priceRange === 'above-20k') {
      list = list.filter((p) => p.price > 20000);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => {
        const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dB - dA;
      });
    }

    return list;
  }, [initialProducts, priceRange, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Breadcrumbs */}
      <div>
        <Breadcrumbs items={breadcrumbs} theme="light" />
      </div>

      {/* 2. Page Heading & Sub-line */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hairline-light pb-10">
        <div>
          <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-2">
            Archival Store &bull; Level X 3D
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-ink uppercase leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate mt-2 max-w-xl font-sans leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="font-mono text-xs text-slate">
          Showing <span className="text-ink font-semibold">{filteredProducts.length}</span> Objects
        </div>
      </div>

      {/* 3. Shelf Navigation Horizontal Bar (Quick Jump) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-hairline-light">
        <Link
          href="/shop"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-light tracking-apple-wide whitespace-nowrap transition-all border ${
            !currentShelfSlug && !currentCategorySlug
              ? 'bg-onyx text-chalk border-onyx'
              : 'bg-canvas text-slate border-hairline-light hover:text-ink'
          }`}
        >
          All Shelves
        </Link>
        {SHELVES_DATA.map((shelf) => {
          const isActive = currentShelfSlug === shelf.slug;
          return (
            <Link
              key={shelf.slug}
              href={`/shop/${shelf.slug}`}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-light tracking-apple-wide whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-onyx text-chalk border-onyx'
                  : 'bg-canvas text-slate border-hairline-light hover:text-ink'
              }`}
            >
              {shelf.shelf}
            </Link>
          );
        })}
      </div>

      {/* 4. Controls Toolbar (Sorting & Price Filter) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 bg-[#ECE9E2]/40 rounded-2xl p-4 border border-hairline-light">
        {/* Price Filter Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate mr-1">
            Price Filter:
          </span>
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'under-5k', label: 'Under ₹5,000' },
            { id: '5k-20k', label: '₹5,000 – ₹20,000' },
            { id: 'above-20k', label: 'Above ₹20,000' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setPriceRange(tier.id as any)}
              className={`px-3 py-1 rounded-md text-xs font-sans transition-all border ${
                priceRange === tier.id
                  ? 'bg-ink text-chalk border-ink font-medium'
                  : 'bg-canvas text-slate border-hairline-light hover:text-ink'
              }`}
            >
              {tier.label}
            </button>
          ))}
          {priceRange !== 'all' && (
            <button
              onClick={() => setPriceRange('all')}
              className="text-[11px] text-slate hover:text-ink flex items-center gap-1 font-mono ml-2 underline"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate stroke-[1.5]" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-canvas border border-hairline-light text-ink text-xs rounded-lg px-2.5 py-1 outline-none font-sans cursor-pointer focus:border-ink transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 5. Product Grid / Tasteful Empty State */}
      {filteredProducts.length === 0 ? (
        /* Tasteful Apple-Grade Empty State */
        <div className="py-24 px-6 rounded-3xl border border-hairline-light bg-[#ECE9E2]/30 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-full border border-hairline-light mx-auto flex items-center justify-center text-slate">
            <Box className="w-6 h-6 stroke-[1.2]" />
          </div>

          <div className="space-y-2">
            <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block">
              Archival Status &bull; Pending Fabrication
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-light tracking-apple-wide text-ink uppercase">
              No Objects In This Category Yet
            </h3>
            <p className="text-xs text-slate font-sans max-w-md mx-auto leading-relaxed">
              Our studio fabricates editions in numbered batches. You can commission a bespoke 3D geometry in our Custom Studio, or browse other shelves.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/shop">
              <QuietButton variant="light" size="sm">
                Explore All Shelves &rarr;
              </QuietButton>
            </Link>
            <Link href="/#studio">
              <QuietButton variant="light" size="sm" className="text-slate hover:text-ink">
                Commission Custom 3D &rarr;
              </QuietButton>
            </Link>
          </div>
        </div>
      ) : (
        <ScrollReveal staggerChildren={0.08}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <AnimatedCard
                key={product.id}
                href={`/product/${product.slug}`}
                title={product.name}
                subtitle={product.tagline}
                category={product.category}
                price={product.price}
                image={product.image}
                theme="light"
                actionLabel="Add to Bag"
                onAction={() => addItem(product)}
              />
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* 6. Sub-category Explorer for the Active Shelf */}
      {currentShelfSlug && (
        <div className="pt-16 border-t border-hairline-light">
          <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-4">
            Categories In This Shelf
          </span>
          <div className="flex flex-wrap gap-2.5">
            {SHELVES_DATA.find((s) => s.slug === currentShelfSlug)?.categories.map((cat) => {
              const isCurrent = currentCategorySlug === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-heading font-light tracking-apple-wide transition-colors ${
                    isCurrent
                      ? 'bg-onyx text-chalk border-onyx shadow-sm'
                      : 'border-hairline-light bg-canvas hover:border-slate/40 text-ink'
                  }`}
                >
                  {cat.name} {isCurrent ? '•' : '→'}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
