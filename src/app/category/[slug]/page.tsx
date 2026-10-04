import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShopCatalogView } from '@/components/ecommerce/shop-catalog-view';
import { getFilteredProducts, getCategoryDetails, getStoreCategories } from '@/lib/supabase/store';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const { flatCategories } = await getStoreCategories();
  return flatCategories.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const details = await getCategoryDetails(params.slug);
  if (!details) {
    return {
      title: 'Category — Level X 3D',
      description: 'Discover precision 3D printed objects and architectural pieces.',
    };
  }
  return {
    title: `${details.category.name} — ${details.shelf.shelf} — Level X 3D`,
    description: `Discover 3D printed ${details.category.name} in the ${details.shelf.shelf} collection. Engineered with aerospace precision.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const details = await getCategoryDetails(params.slug);

  if (!details) {
    notFound();
  }

  const { category, shelf } = details;
  const products = await getFilteredProducts({
    categorySlug: params.slug,
  });

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />

      <main className="flex-1">
        <ShopCatalogView
          title={category.name}
          subtitle={`Curated ${category.name} within the ${shelf.shelf} shelf. Manufactured in numbered editions via micro-SLA and laser-sintered nylon.`}
          initialProducts={products}
          currentShelfSlug={shelf.slug}
          currentCategorySlug={params.slug}
          breadcrumbs={[
            { label: 'Shop', href: '/shop' },
            { label: shelf.shelf, href: `/shop/${shelf.slug}` },
            { label: category.name },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
