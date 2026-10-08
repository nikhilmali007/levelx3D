'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/ecommerce/product-card';
import { useWishlist } from '@/hooks/use-wishlist';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const { items, isLoaded } = useWishlist();
  const router = useRouter();

  const handleInspect3D = (product: Product) => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/shop" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-light">Your Wishlist</h1>
          <div className="ml-auto flex items-center gap-2">
            <Heart className="w-5 h-5" fill="currentColor" />
            <span className="font-mono text-sm">{items.length} Items</span>
          </div>
        </div>

        {!isLoaded ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-ink rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-light mb-2">Your wishlist is empty</h2>
              <p className="text-slate text-sm">Save your favorite architectural artifacts for later.</p>
            </div>
            <Link
              href="/shop"
              className="px-8 py-4 bg-ink text-chalk rounded-full text-sm font-medium hover:bg-onyx transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <ProductCard product={product} onInspect3D={handleInspect3D} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
