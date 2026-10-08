'use client';

import { Product } from '@/types/product';
import { ProductCard } from '@/components/ecommerce/product-card';
import { useRouter } from 'next/navigation';

export function RelatedProductsClient({ products }: { products: Product[] }) {
  const router = useRouter();

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 border-t border-hairline-light mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide uppercase mb-10 text-ink">
          You May Also Like
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onInspect3D={() => router.push(`/product/${product.slug}`)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
