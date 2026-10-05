import { MetadataRoute } from 'next';
import { SHELVES_DATA } from '@/lib/products-data';
import { getAllProducts } from '@/lib/supabase/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://levelx3d.com';
  const now = new Date();

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // 2. Shelf Routes (18 Shelves)
  const shelfRoutes: MetadataRoute.Sitemap = SHELVES_DATA.map((shelf) => ({
    url: `${baseUrl}/shop/${shelf.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Category Routes
  const categoryRoutes: MetadataRoute.Sitemap = SHELVES_DATA.flatMap((shelf) =>
    shelf.categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  // 4. Dynamic Product Routes
  const products = await getAllProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.createdAt ? new Date(product.createdAt) : now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticRoutes, ...shelfRoutes, ...categoryRoutes, ...productRoutes];
}
