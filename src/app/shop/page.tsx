import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShopCatalogView } from '@/components/ecommerce/shop-catalog-view';
import { getAllProducts } from '@/lib/supabase/store';

export const metadata: Metadata = {
  title: 'All Shelves & Collections — Level X 3D',
  description:
    'Browse our comprehensive catalog of 3D printed architectural artifacts across 18 specialized shelves.',
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />

      <main className="flex-1">
        <ShopCatalogView
          title="All Collections"
          subtitle="Explore architectural sculptures, kinetic desk art, biometric wearables, and bespoke devotional sanctuaries across all 18 shelves."
          initialProducts={products}
          breadcrumbs={[{ label: 'Shop', href: '/shop' }]}
        />
      </main>

      <Footer />
    </div>
  );
}
