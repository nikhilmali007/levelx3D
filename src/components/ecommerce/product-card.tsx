'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Eye, Heart, Layers } from 'lucide-react';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCompare } from '@/hooks/use-compare';

interface ProductCardProps {
  product: Product;
  onInspect3D: (product: Product) => void;
}

export function ProductCard({ product, onInspect3D }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-slate-900/40 border border-white/10 hover:border-cyan/40 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:shadow-[0_10px_35px_rgba(0,242,254,0.15)] flex flex-col justify-between"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950/60">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                product.badge === 'Limited Edition'
                  ? 'neon'
                  : product.badge === 'Best Seller'
                  ? 'default'
                  : 'secondary'
              }
              className="pointer-events-none"
            >
              {product.badge || product.category}
            </Badge>
            {product.stock !== undefined && product.stock <= 3 && product.inStock && (
              <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white pointer-events-none text-[10px] uppercase font-bold py-0 h-5">
                Low Stock
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-slate-950/70 border border-white/10 px-2 py-0.5 rounded-full text-[11px] text-amber-400 font-mono pointer-events-none">
              <Star className="w-3 h-3 fill-amber-400" />
              {product.rating}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product as any);
              }}
              className="p-1.5 rounded-full bg-slate-950/70 border border-white/10 hover:border-cyan/50 hover:bg-slate-900 transition-colors"
              title={inCompare ? "Remove from compare" : "Compare"}
              aria-label={inCompare ? "Remove from compare" : "Compare"}
            >
              <Layers className={`w-4 h-4 ${inCompare ? 'text-cyan' : 'text-slate-300'}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="p-1.5 rounded-full bg-slate-950/70 border border-white/10 hover:border-cyan/50 hover:bg-slate-900 transition-colors"
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-cyan text-cyan' : 'text-slate-300'}`} />
            </button>
          </div>
        </div>

        {/* Floating 3D Inspect Quick Action */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
          <button
            onClick={() => onInspect3D(product)}
            className="w-full py-2 px-3 rounded-xl bg-slate-950/85 hover:bg-cyan hover:text-slate-950 text-white border border-white/10 hover:border-cyan text-xs font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-md shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive 3D Preview</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan/80 block mb-1">
            {product.category}
          </span>
          <h3 className="text-base font-bold text-white group-hover:text-cyan transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {product.tagline}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-mono">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant={justAdded ? 'neon' : 'default'}
            onClick={handleAddToCart}
            className="gap-1.5 px-4 font-semibold text-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{justAdded ? 'Added!' : 'Add to Cart'}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
