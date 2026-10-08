import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { ProductGallery } from '@/components/ecommerce/product-gallery';
import { ProductDetailsClient } from '@/components/ecommerce/product-details-client';
import { RelatedProducts } from '@/components/ecommerce/related-products';
import { getAllProducts, getProductBySlug } from '@/lib/supabase/store';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Object Not Found — Level X 3D',
      description: 'The requested archival 3D printed piece could not be located.',
    };
  }

  const title = `${product.name} — Level X 3D`;
  const description = product.description || product.tagline;
  const canonicalUrl = `https://levelx3d.com/product/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Level X 3D',
      images: [
        {
          url: `/product/${product.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${product.name} — Level X 3D Specimen`,
        },
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/product/${product.slug}/opengraph-image`],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Schema.org JSON-LD for rich snippets (Google, WhatsApp, Instagram)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description || product.tagline,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Level X 3D',
    },
    offers: {
      '@type': 'Offer',
      url: `https://levelx3d.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const breadcrumbs = [
    { label: 'Shop', href: '/shop' },
    { label: product.shelf, href: `/shop/${product.shelfSlug}` },
    { label: product.category, href: `/category/${product.categorySlug}` },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header theme="light" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-8 sm:space-y-12 pb-24 md:pb-14">
        {/* Breadcrumb Navigation */}
        <div>
          <Breadcrumbs items={breadcrumbs} theme="light" />
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Gallery with Thumbnails, Hover Zoom & 3D Slot */}
          <div className="lg:col-span-7 w-full sticky lg:top-28">
            <ProductGallery
              images={product.images || [product.image]}
              name={product.name}
              badge={product.badge}
              isPremium={product.shelfSlug === 'signature-premium' || product.badge === 'Signature'}
              geometryType={product.geometryType}
            />
          </div>

          {/* Right Column: Details, Customization Inputs, and Actions */}
          <div className="lg:col-span-5 w-full">
            <ProductDetailsClient product={product} />
          </div>
        </div>

        <RelatedProducts 
          currentProductId={product.id} 
          categorySlug={product.categorySlug} 
          shelfSlug={product.shelfSlug} 
        />
      </main>

      <Footer />
    </div>
  );
}
