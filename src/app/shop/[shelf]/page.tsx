import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShopCatalogView } from '@/components/ecommerce/shop-catalog-view';
import { getFilteredProducts, slugToShelf } from '@/lib/supabase/store';
import { SHELVES_DATA } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

interface ShelfPageProps {
  params: {
    shelf: string;
  };
}

export async function generateStaticParams() {
  return SHELVES_DATA.map((s) => ({
    shelf: s.slug,
  }));
}

export async function generateMetadata({ params }: ShelfPageProps): Promise<Metadata> {
  const shelfName = slugToShelf(params.shelf) || 'Shelf';
  return {
    title: `${shelfName} Collection — Level X 3D`,
    description: `Discover 3D printed objects and architectural pieces in the ${shelfName} collection.`,
  };
}

export default async function ShelfPage({ params }: ShelfPageProps) {
  const shelfName = slugToShelf(params.shelf);
  const shelfObj = SHELVES_DATA.find((s) => s.slug === params.shelf);

  if (!shelfName || !shelfObj) {
    notFound();
  }

  const products = await getFilteredProducts({
    shelfSlug: params.shelf,
  });

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />

      <main className="flex-1">
        <ShopCatalogView
          title={shelfName}
          subtitle={`Curated architectural pieces in the ${shelfName} collection. Manufactured in numbered editions via micro-SLA and laser-sintered nylon.`}
          initialProducts={products}
          currentShelfSlug={params.shelf}
          breadcrumbs={[
            { label: 'Shop', href: '/shop' },
            { label: shelfName },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
