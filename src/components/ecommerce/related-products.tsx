import { getFilteredProducts } from '@/lib/supabase/store';
import { RelatedProductsClient } from '@/components/ecommerce/related-products-client';

interface RelatedProductsProps {
  currentProductId: string;
  categorySlug: string;
  shelfSlug: string;
}

export async function RelatedProducts({ currentProductId, categorySlug, shelfSlug }: RelatedProductsProps) {
  const categoryProducts = await getFilteredProducts({ categorySlug });
  const shelfProducts = await getFilteredProducts({ shelfSlug });

  const allRelated = [...categoryProducts, ...shelfProducts];
  const uniqueProducts = Array.from(new Map(allRelated.map(item => [item.id, item])).values());

  const finalProducts = uniqueProducts
    .filter(p => p.id !== currentProductId)
    .slice(0, 4);

  return <RelatedProductsClient products={finalProducts} />;
}
