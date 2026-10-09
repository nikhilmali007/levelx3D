import { supabase, isSupabaseConfigured } from './client';
import { INITIAL_PRODUCTS, SHELVES_DATA, Product } from '@/lib/products-data';

// Server-side memory store shared with admin — ensures products created
// via the admin API are visible on the storefront even if the Supabase
// write was blocked by RLS or the service-role key is missing.
const globalStore = globalThis as any;
interface MemoryStoreRef {
  products: Map<string, any>;
}
function getMemoryStore(): MemoryStoreRef {
  if (!globalStore.__levelx3d_admin_store) {
    globalStore.__levelx3d_admin_store = {
      products: new Map(),
      orders: new Map(),
    };
  }
  return globalStore.__levelx3d_admin_store;
}

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
  const productsMap = new Map<string, Product>();

  // 1. Seed with INITIAL_PRODUCTS as baseline
  INITIAL_PRODUCTS.forEach((p) => {
    productsMap.set(p.id, p);
  });

  // 2. If Supabase is configured, query products table
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
          product_images(url, alt, sort_order),
          product_options(id, name, type, values)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach((p: any) => {
          const sortedImages =
            p.product_images && p.product_images.length > 0
              ? [...p.product_images]
                  .sort((a: any, b: any) => a.sort_order - b.sort_order)
                  .map((img: any) => img.url)
              : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85'];

          const img = sortedImages[0];
          const catName = p.categories?.name || 'Artifacts';
          const catSlug = p.categories?.slug || 'artifacts';
          const shelfName = p.categories?.shelf || 'Signature / Premium';

          productsMap.set(p.id, {
            id: p.id,
            slug: p.slug || p.id,
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
            images: sortedImages,
            isCustomizable: Boolean(p.is_customizable),
            options: p.product_options || [],
            geometryType: 'torus',
            inStock: p.stock > 0,
            stock: p.stock,
            specs: {
              material: 'Selective Laser Sintered (SLS) Nylon PA12',
              resolution: '25 Microns',
              finish: 'Vapor-Polished Monochrome',
              dimensions: 'Custom Archival Scale',
            },
            createdAt: p.created_at,
          });
        });
      }
    } catch (e) {
      console.warn('Could not fetch products from Supabase, using local catalog.', e);
    }
  }

  // 3. Always merge server-side memoryStore (admin-created products in this session)
  const memStore = getMemoryStore();
  memStore.products.forEach((ap: any) => {
    // Skip archived or already-present products from Supabase
    if (ap.status === 'archived') {
      productsMap.delete(ap.id);
      return;
    }
    // Only add if not already present from Supabase (Supabase is authoritative)
    if (!productsMap.has(ap.id)) {
      productsMap.set(ap.id, {
        id: ap.id,
        slug: ap.slug || ap.id,
        name: ap.name,
        tagline: ap.description?.slice(0, 75) || 'Archival 3D printed artifact',
        description: ap.description || '',
        price: Number(ap.price_inr),
        originalPrice: ap.compare_at_price_inr ? Number(ap.compare_at_price_inr) : undefined,
        category: ap.category || 'Artifacts',
        categorySlug: ap.categorySlug || 'artifacts',
        shelf: ap.shelf || 'Signature / Premium',
        shelfSlug: ap.shelfSlug || shelfToSlug(ap.shelf || 'Signature / Premium'),
        rating: 5.0,
        reviewsCount: 24,
        badge: ap.is_premium ? 'Signature' : undefined,
        image: ap.image_url || ap.image,
        images: ap.images && ap.images.length > 0 ? ap.images : [ap.image_url || ap.image],
        isCustomizable: Boolean(ap.is_customizable),
        options: ap.options || [],
        geometryType: 'torus',
        inStock: (ap.stock ?? 10) > 0,
        stock: ap.stock ?? 10,
        specs: {
          material: 'Selective Laser Sintered (SLS) Nylon PA12',
          resolution: '25 Microns',
          finish: 'Vapor-Polished Monochrome',
          dimensions: 'Custom Archival Scale',
        },
        createdAt: ap.created_at,
      });
    }
  });

  // 4. Client-side: merge localStorage admin products (for dev/preview)
  if (typeof window !== 'undefined') {
    try {
      const localAdminProds = JSON.parse(localStorage.getItem('levelx3d_admin_products') || '[]');
      localAdminProds.forEach((ap: any) => {
        if (ap.status === 'archived') {
          productsMap.delete(ap.id);
          return;
        }
        if (!productsMap.has(ap.id)) {
          productsMap.set(ap.id, {
            id: ap.id,
            slug: ap.slug || ap.id,
            name: ap.name,
            tagline: ap.description?.slice(0, 75) || 'Archival 3D printed artifact',
            description: ap.description || '',
            price: Number(ap.price_inr),
            originalPrice: ap.compare_at_price_inr ? Number(ap.compare_at_price_inr) : undefined,
            category: ap.category || 'Artifacts',
            categorySlug: ap.categorySlug || 'artifacts',
            shelf: ap.shelf || 'Signature / Premium',
            shelfSlug: ap.shelfSlug || shelfToSlug(ap.shelf || 'Signature / Premium'),
            rating: 5.0,
            reviewsCount: 24,
            badge: ap.is_premium ? 'Signature' : undefined,
            image: ap.image_url || ap.image,
            images: ap.images && ap.images.length > 0 ? ap.images : [ap.image_url || ap.image],
            isCustomizable: Boolean(ap.is_customizable),
            options: ap.options || [],
            geometryType: 'torus',
            inStock: (ap.stock ?? 10) > 0,
            stock: ap.stock ?? 10,
            specs: {
              material: 'Selective Laser Sintered (SLS) Nylon PA12',
              resolution: '25 Microns',
              finish: 'Vapor-Polished Monochrome',
              dimensions: 'Custom Archival Scale',
            },
            createdAt: ap.created_at,
          });
        }
      });
    } catch (e) {
      // localStorage unavailable
    }
  }

  // Sort newest first
  return Array.from(productsMap.values()).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalizedSlug = slug.toLowerCase();

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
          product_images(url, alt, sort_order),
          product_options(id, name, type, values)
        `)
        .or(`slug.eq.${normalizedSlug},id.eq.${normalizedSlug}`)
        .maybeSingle();

      if (!error && data) {
        const raw = data as any;
        const sortedImages =
          raw.product_images && raw.product_images.length > 0
            ? [...raw.product_images]
                .sort((a: any, b: any) => a.sort_order - b.sort_order)
                .map((img: any) => img.url)
            : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85'];

        const img = sortedImages[0];
        const categoryObj = Array.isArray(raw.categories) ? raw.categories[0] : raw.categories;
        const catName = categoryObj?.name || 'Artifacts';
        const catSlug = categoryObj?.slug || 'artifacts';
        const shelfName = categoryObj?.shelf || 'Signature / Premium';

        return {
          id: raw.id,
          slug: raw.slug || raw.id,
          name: raw.name,
          tagline: raw.description?.slice(0, 75) || 'Archival 3D printed artifact',
          description: raw.description || '',
          price: Number(raw.price_inr),
          originalPrice: raw.compare_at_price_inr ? Number(raw.compare_at_price_inr) : undefined,
          category: catName,
          categorySlug: catSlug,
          shelf: shelfName,
          shelfSlug: shelfToSlug(shelfName),
          rating: 5.0,
          reviewsCount: 42,
          badge: raw.is_premium ? 'Signature' : undefined,
          image: img,
          images: sortedImages,
          isCustomizable: Boolean(raw.is_customizable),
          options: raw.product_options || [],
          geometryType: 'torus',
          inStock: raw.stock > 0,
          stock: raw.stock,
          specs: {
            material: 'Selective Laser Sintered (SLS) Nylon PA12',
            resolution: '25 Microns',
            finish: 'Vapor-Polished Monochrome',
            dimensions: 'Custom Archival Scale',
          },
          createdAt: raw.created_at,
        };
      }
    } catch (e) {
      console.warn('Could not fetch product from Supabase, checking local catalog.', e);
    }
  }

  // Fallback: check memoryStore for admin-created products
  const memStore = getMemoryStore();
  let memProduct: Product | null = null;
  memStore.products.forEach((ap: any) => {
    const apSlug = (ap.slug || '').toLowerCase();
    const apId = (ap.id || '').toLowerCase();
    if (apSlug === normalizedSlug || apId === normalizedSlug) {
      memProduct = {
        id: ap.id,
        slug: ap.slug || ap.id,
        name: ap.name,
        tagline: ap.description?.slice(0, 75) || 'Archival 3D printed artifact',
        description: ap.description || '',
        price: Number(ap.price_inr),
        originalPrice: ap.compare_at_price_inr ? Number(ap.compare_at_price_inr) : undefined,
        category: ap.category || 'Artifacts',
        categorySlug: ap.categorySlug || 'artifacts',
        shelf: ap.shelf || 'Signature / Premium',
        shelfSlug: ap.shelfSlug || shelfToSlug(ap.shelf || 'Signature / Premium'),
        rating: 5.0,
        reviewsCount: 24,
        badge: ap.is_premium ? 'Signature' : undefined,
        image: ap.image_url || ap.image,
        images: ap.images && ap.images.length > 0 ? ap.images : [ap.image_url || ap.image],
        isCustomizable: Boolean(ap.is_customizable),
        options: ap.options || [],
        geometryType: 'torus',
        inStock: (ap.stock ?? 10) > 0,
        stock: ap.stock ?? 10,
        specs: {
          material: 'Selective Laser Sintered (SLS) Nylon PA12',
          resolution: '25 Microns',
          finish: 'Vapor-Polished Monochrome',
          dimensions: 'Custom Archival Scale',
        },
        createdAt: ap.created_at,
      };
    }
  });
  if (memProduct) return memProduct;

  // Fallback to seeded catalog
  const found = INITIAL_PRODUCTS.find(
    (p) => p.slug.toLowerCase() === normalizedSlug || p.id.toLowerCase() === normalizedSlug
  );
  return found || null;
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
