'use client';

import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCard } from '@/components/ecommerce/product-card';
import { useRouter } from 'next/navigation';

export function RecentlyViewed() {
  const { recentlyViewed } = useRecentlyViewed();
  const router = useRouter();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="py-12 border-t border-hairline-light mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="font-heading text-2xl font-light tracking-apple-wide text-ink mb-6 uppercase">
          Recently Viewed
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">
          {recentlyViewed.map((product) => (
            <div key={product.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-start">
              <ProductCard
                product={product as any}
                onInspect3D={() => router.push(`/product/${product.slug}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
