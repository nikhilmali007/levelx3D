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

export function shelfToSlug(shelf: string): string {
  const found = SHELVES_DATA.find((s) => s.shelf.toLowerCase() === shelf.toLowerCase());
  if (found) return found.slug;
  return shelf
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function slugToShelf(slug: string): string | null {
  const found = SHELVES_DATA.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
  return found ? found.shelf : null;
}

export async function getStoreCategories(): Promise<{
  shelves: typeof SHELVES_DATA;
  flatCategories: CategoryItem[];
}> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return { shelves: SHELVES_DATA, flatCategories: data as CategoryItem[] };
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

export async function getCategoryDetails(slug: string) {
  const { flatCategories, shelves } = await getStoreCategories();
  const cat = flatCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  if (!cat) return null;
  const shelf = shelves.find((s) => s.shelf.toLowerCase() === cat.shelf.toLowerCase());
  return {
    category: cat,
    shelf: shelf || {
      shelf: cat.shelf,
      slug: shelfToSlug(cat.shelf),
      categories: [],
    },
  };
}

export async function getAllProducts(): Promise<Product[]> {
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
          created_at,
          categories(name, slug, shelf),
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

          const catName = p.categories?.name || 'Artifacts';
          const catSlug = p.categories?.slug || 'artifacts';
          const shelfName = p.categories?.shelf || 'Signature / Premium';

          return {
            id: p.id,
            name: p.name,
            tagline: p.description?.slice(0, 75) || 'Archival 3D printed artifact',
            description: p.description || '',
            price: Number(p.price_inr),
            originalPrice: p.compare_at_price_inr ? Number(p.compare_at_price_inr) : undefined,
            category: catName,
            categorySlug: catSlug,
            shelf: shelfName,
            shelfSlug: shelfToSlug(shelfName),
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
            createdAt: p.created_at,
          };
        });
      }
    } catch (e) {
      console.warn('Could not fetch products from Supabase, using local catalog.', e);
    }
  }

  return INITIAL_PRODUCTS;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.shelfSlug === 'signature-premium' || p.badge === 'Signature').slice(0, 6);
}

export interface FilterOptions {
  shelfSlug?: string;
  categorySlug?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc';
  minPrice?: number;
  maxPrice?: number;
}

export async function getFilteredProducts(options: FilterOptions): Promise<Product[]> {
  let list = await getAllProducts();

  if (options.shelfSlug) {
    const targetSlug = options.shelfSlug.toLowerCase();
    list = list.filter((p) => p.shelfSlug.toLowerCase() === targetSlug);
  }

  if (options.categorySlug) {
    const targetCat = options.categorySlug.toLowerCase();
    list = list.filter((p) => p.categorySlug.toLowerCase() === targetCat);
  }

  if (options.minPrice !== undefined) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }

  if (options.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Newest first by default
    list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  return list;
}
