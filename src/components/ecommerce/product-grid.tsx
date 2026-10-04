'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { INITIAL_PRODUCTS } from '@/lib/products-data';
import { ProductCard } from '@/components/ecommerce/product-card';
import { ProductViewerModal } from '@/components/3d/product-viewer-modal';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CATEGORIES = ['All', 'Desk Art', 'Wearables', 'Collectibles', 'Cyber Gear'];

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan text-xs font-mono tracking-widest uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Precision 3D Catalog</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Level X <span className="bg-gradient-to-r from-cyan to-pink-500 bg-clip-text text-transparent">Artifacts</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-md">
            Explore our curated gallery of aerospace-grade 3D printed artifacts, biometric wearables, and futuristic desk sculptures.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search artifacts, gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-cyan text-slate-950 border-cyan shadow-[0_0_15px_rgba(0,242,254,0.35)]'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-white/5 rounded-3xl">
          <p className="text-slate-400 text-base">
            No artifacts found matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 text-xs text-cyan underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInspect3D={(p) => setInspectingProduct(p)}
            />
          ))}
        </div>
      )}

      {/* 3D Inspect Modal */}
      <ProductViewerModal
        product={inspectingProduct}
        onClose={() => setInspectingProduct(null)}
      />
    </section>
  );
}
