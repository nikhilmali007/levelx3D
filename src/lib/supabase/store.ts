import { supabase, isSupabaseConfigured } from './client';
import { INITIAL_PRODUCTS, SHELVES_DATA, Product } from '@/lib/products-data';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  shelf: string;
  description: string;
  sort_order: number;
}

export async function getStoreCategories(): Promise<{
  shelves: { shelf: string; categories: { name: string; slug: string; description?: string }[] }[];
  flatCategories: CategoryItem[];
}> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        // Group by shelf
        const shelfMap = new Map<string, { name: string; slug: string; description?: string }[]>();
        data.forEach((cat) => {
          const s = cat.shelf || 'General';
          if (!shelfMap.has(s)) shelfMap.set(s, []);
          shelfMap.get(s)!.push({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || undefined,
          });
        });

        const shelves = Array.from(shelfMap.entries()).map(([shelf, categories]) => ({
          shelf,
          categories,
        }));

        return { shelves, flatCategories: data as CategoryItem[] };
      }
    } catch (e) {
      console.warn('Could not fetch categories from Supabase, using seeded data.', e);
    }
  }

  // Fallback to seeded shelves data
  const flatCategories: CategoryItem[] = [];
  let order = 1;
  SHELVES_DATA.forEach((s) => {
    s.categories.forEach((c) => {
      flatCategories.push({
        id: `cat-${order}`,
        name: c.name,
        slug: c.slug,
        shelf: s.shelf,
        description: `${c.name} in ${s.shelf}`,
        sort_order: order++,
      });
    });
  });

  return { shelves: SHELVES_DATA, flatCategories };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          price_inr,
          compare_at_price_inr,
          is_customizable,
          is_premium,
          stock,
          status,
          categories(name, shelf),
          product_images(url, alt, sort_order)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p: any) => {
          const img =
            p.product_images && p.product_images.length > 0
              ? p.product_images[0].url
              : 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&auto=format&fit=crop&q=85';

          return {
            id: p.id,
            name: p.name,
            tagline: p.description?.slice(0, 75) || 'Archival 3D printed artifact',
            description: p.description || '',
            price: Number(p.price_inr),
            originalPrice: p.compare_at_price_inr ? Number(p.compare_at_price_inr) : undefined,
            category: p.categories?.name || 'Signature',
            shelf: p.categories?.shelf || 'Signature / Premium',
            rating: 5.0,
            reviewsCount: 35,
            badge: p.is_premium ? 'Signature' : undefined,
            image: img,
            geometryType: 'torus',
            inStock: p.stock > 0,
            specs: {
              material: 'Selective Laser Sintered (SLS) Nylon PA12',
              resolution: '25 Microns',
              finish: 'Vapor-Polished Monochrome',
              dimensions: 'Custom Archival Scale',
            },
          };
        });
      }
    } catch (e) {
      console.warn('Could not fetch products from Supabase, using seeded catalog.', e);
    }
  }

  // Fallback to seeded products
  return INITIAL_PRODUCTS;
}
