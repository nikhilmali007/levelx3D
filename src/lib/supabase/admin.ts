import { supabase, isSupabaseConfigured } from './client';
import { supabaseAdmin, isServiceRoleConfigured } from './server';
import { generateUUID } from './orders';
import { INITIAL_PRODUCTS, Product, SHELVES_DATA } from '@/lib/products-data';
import { shelfToSlug } from './store';

export type ProductStatus = 'active' | 'draft' | 'archived';
export type OrderStatus = 'pending' | 'paid' | 'printing' | 'shipped' | 'delivered' | 'cancelled';

export interface AdminProductOption {
  id?: string;
  name: string;
  type: 'color' | 'select' | 'text' | 'radio';
  values: {
    label?: string;
    value?: string;
    color?: string;
    placeholder?: string;
  }[];
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  shelf: string;
  shelfSlug: string;
  price_inr: number;
  compare_at_price_inr?: number;
  stock: number;
  is_customizable: boolean;
  is_premium: boolean;
  status: ProductStatus;
  image_url: string;
  images: string[];
  options: AdminProductOption[];
  created_at: string;
}

export interface AdminOrderCustomer {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface AdminOrderItem {
  id: string;
  product_id?: string;
  product_name: string;
  product_slug?: string;
  qty: number;
  unit_price_inr: number;
  options_json?: any;
}

export interface AdminOrder {
  id: string;
  customer_id?: string;
  status: OrderStatus;
  subtotal_inr: number;
  shipping_inr: number;
  total_inr: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  customer: AdminOrderCustomer;
  items: AdminOrderItem[];
  created_at: string;
}

const LOCAL_ADMIN_PRODUCTS_KEY = 'levelx3d_admin_products';
const LOCAL_PENDING_ORDERS_KEY = 'levelx3d_pending_orders';

// Server-side / process-wide memory store for dev and demo sandbox
interface MemoryStore {
  products: Map<string, AdminProduct>;
  orders: Map<string, AdminOrder>;
}

const globalStore = (globalThis as any);
if (!globalStore.__levelx3d_admin_store) {
  globalStore.__levelx3d_admin_store = {
    products: new Map<string, AdminProduct>(),
    orders: new Map<string, AdminOrder>(),
  };
}
const memoryStore: MemoryStore = globalStore.__levelx3d_admin_store;

// Convert title to URL slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 1. Fetch all products for the admin panel
 */
export async function getAdminProducts(): Promise<AdminProduct[]> {
  const productsMap = new Map<string, AdminProduct>();

  // Memory store entries first
  memoryStore.products.forEach((p) => {
    productsMap.set(p.id, p);
  });

  // 1a. Load seeded initial catalog
  INITIAL_PRODUCTS.forEach((p) => {
    productsMap.set(p.id, {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: p.category,
      categorySlug: p.categorySlug,
      shelf: p.shelf,
      shelfSlug: p.shelfSlug,
      price_inr: p.price,
      compare_at_price_inr: p.originalPrice,
      stock: p.stock ?? 10,
      is_customizable: Boolean(p.isCustomizable),
      is_premium: Boolean(p.badge === 'Signature' || p.shelfSlug === 'signature-premium'),
      status: 'active',
      image_url: p.image,
      images: p.images || [p.image],
      options: (p.options || []).map((o) => ({
        id: o.id || generateUUID(),
        name: o.name,
        type: o.type,
        values: o.values || [],
      })),
      created_at: p.createdAt || new Date('2026-01-01').toISOString(),
    });
  });

  // 1b. Load from Supabase if configured
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
        .order('created_at', { ascending: false });

      if (!error && data) {
        data.forEach((p: any) => {
          const sortedImages =
            p.product_images && p.product_images.length > 0
              ? [...p.product_images]
                  .sort((a: any, b: any) => a.sort_order - b.sort_order)
                  .map((img: any) => img.url)
              : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85'];

          const catName = p.categories?.name || 'Designer Lamps';
          const catSlug = p.categories?.slug || 'premium-designer-lamps';
          const shelfName = p.categories?.shelf || 'Signature / Premium';

          productsMap.set(p.id, {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || '',
            category: catName,
            categorySlug: catSlug,
            shelf: shelfName,
            shelfSlug: shelfToSlug(shelfName),
            price_inr: Number(p.price_inr),
            compare_at_price_inr: p.compare_at_price_inr ? Number(p.compare_at_price_inr) : undefined,
            stock: Number(p.stock),
            is_customizable: Boolean(p.is_customizable),
            is_premium: Boolean(p.is_premium),
            status: (p.status as ProductStatus) || 'active',
            image_url: sortedImages[0],
            images: sortedImages,
            options: (p.product_options || []).map((o: any) => ({
              id: o.id,
              name: o.name,
              type: o.type,
              values: o.values || [],
            })),
            created_at: p.created_at,
          });
        });
      }
    } catch (e) {
      console.warn('Could not query products from Supabase:', e);
    }
  }

  // 1c. Load locally created / edited products from localStorage
  if (typeof window !== 'undefined') {
    try {
      const localProducts: AdminProduct[] = JSON.parse(
        localStorage.getItem(LOCAL_ADMIN_PRODUCTS_KEY) || '[]'
      );
      localProducts.forEach((p) => {
        productsMap.set(p.id, p);
      });
    } catch (e) { console.warn('Context-specific message:', e); }
  }

  return Array.from(productsMap.values()).sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

/**
 * 2. Save or update a product (Supabase + LocalStorage)
 */
export async function saveAdminProduct(
  productData: Omit<AdminProduct, 'created_at'> & { created_at?: string }
): Promise<{ success: boolean; product: AdminProduct; error?: string }> {
  const productId = productData.id || generateUUID();
  const slug = productData.slug ? slugify(productData.slug) : slugify(productData.name);
  const createdAt = productData.created_at || new Date().toISOString();

  // Find shelf from category
  let shelfName = productData.shelf;
  if (!shelfName) {
    const foundShelf = SHELVES_DATA.find((s) =>
      s.categories.some((c) => c.name.toLowerCase() === productData.category.toLowerCase())
    );
    shelfName = foundShelf ? foundShelf.shelf : 'Signature / Premium';
  }
  const shelfSlug = shelfToSlug(shelfName);
  const categorySlug = slugify(productData.category);

  const fullProduct: AdminProduct = {
    ...productData,
    id: productId,
    slug,
    shelf: shelfName,
    shelfSlug,
    categorySlug,
    created_at: createdAt,
  };

  // 2a. Supabase persistence
  if (isSupabaseConfigured) {
    const client = isServiceRoleConfigured ? supabaseAdmin : supabase;
    try {
      // Find or link category_id
      let categoryId: string | null = null;
      const { data: catRecord } = await client
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (catRecord?.id) {
        categoryId = catRecord.id;
      }

      // Upsert product in public.products
      const { error: prodErr } = await client.from('products').upsert({
        id: productId,
        name: fullProduct.name,
        slug: fullProduct.slug,
        description: fullProduct.description,
        category_id: categoryId,
        price_inr: fullProduct.price_inr,
        compare_at_price_inr: fullProduct.compare_at_price_inr || null,
        is_customizable: fullProduct.is_customizable,
        is_premium: fullProduct.is_premium,
        stock: fullProduct.stock,
        status: fullProduct.status,
      });

      if (prodErr) {
        console.warn('Error saving product in Supabase:', prodErr);
      } else {
        // Upsert images
        if (fullProduct.image_url) {
          await client.from('product_images').upsert({
            id: generateUUID(),
            product_id: productId,
            url: fullProduct.image_url,
            sort_order: 0,
          });
        }

        // Upsert options
        if (fullProduct.options && fullProduct.options.length > 0) {
          // Delete old options
          await client.from('product_options').delete().eq('product_id', productId);
          // Insert new options
          const optionsData = fullProduct.options.map((opt) => ({
            id: opt.id || generateUUID(),
            product_id: productId,
            name: opt.name,
            type: opt.type,
            values: opt.values,
          }));
          await client.from('product_options').insert(optionsData);
        }
      }
    } catch (e) {
      console.warn('Exception saving product in Supabase:', e);
    }
  }

  // 2b. LocalStorage & MemoryStore persistence
  memoryStore.products.set(productId, fullProduct);

  if (typeof window !== 'undefined') {
    try {
      const existing: AdminProduct[] = JSON.parse(
        localStorage.getItem(LOCAL_ADMIN_PRODUCTS_KEY) || '[]'
      );
      const index = existing.findIndex((p) => p.id === productId);
      if (index >= 0) {
        existing[index] = fullProduct;
      } else {
        existing.unshift(fullProduct);
      }
      localStorage.setItem(LOCAL_ADMIN_PRODUCTS_KEY, JSON.stringify(existing));
    } catch (e) { console.warn('Context-specific message:', e); }
  }

  return { success: true, product: fullProduct };
}

/**
 * 3. Delete a product
 */
export async function deleteAdminProduct(productId: string): Promise<boolean> {
  memoryStore.products.delete(productId);

  if (isSupabaseConfigured) {
    const client = isServiceRoleConfigured ? supabaseAdmin : supabase;
    try {
      await client.from('products').delete().eq('id', productId);
    } catch (e) { console.warn('Context-specific message:', e); }
  }

  if (typeof window !== 'undefined') {
    try {
      const existing: AdminProduct[] = JSON.parse(
        localStorage.getItem(LOCAL_ADMIN_PRODUCTS_KEY) || '[]'
      );
      const filtered = existing.filter((p) => p.id !== productId);
      localStorage.setItem(LOCAL_ADMIN_PRODUCTS_KEY, JSON.stringify(filtered));
    } catch (e) { console.warn('Context-specific message:', e); }
  }

  return true;
}

/**
 * 4. Upload Product Image to Supabase Storage (with fallback)
 */
export async function uploadProductImageToStorage(
  file: File | Blob,
  filename?: string
): Promise<{ success: boolean; url: string; error?: string }> {
  const cleanName = `${Date.now()}-${filename ? slugify(filename) : 'product-image'}.jpg`;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(cleanName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(cleanName);

        if (publicData?.publicUrl) {
          return { success: true, url: publicData.publicUrl };
        }
      } else {
        console.warn('Supabase storage upload returned error:', error);
      }
    } catch (err: any) {
      console.warn('Could not upload to Supabase storage:', err);
    }
  }

  // Fallback: Convert file to Base64 data URL for offline/sandbox use
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          url: reader.result as string,
        });
      };
      reader.onerror = () => {
        resolve({
          success: true,
          url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=85',
        });
      };
      reader.readAsDataURL(file);
    } catch (e) {
      resolve({
        success: true,
        url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=85',
      });
    }
  });
}

/**
 * 5. Fetch all orders for Admin
 */
export async function getAdminOrders(): Promise<AdminOrder[]> {
  const ordersMap = new Map<string, AdminOrder>();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          customer_id,
          status,
          subtotal_inr,
          shipping_inr,
          total_inr,
          razorpay_order_id,
          razorpay_payment_id,
          address_json,
          created_at,
          order_items(id, product_id, qty, unit_price_inr, options_json)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        data.forEach((o: any) => {
          ordersMap.set(o.id, {
            id: o.id,
            customer_id: o.customer_id,
            status: (o.status as OrderStatus) || 'pending',
            subtotal_inr: Number(o.subtotal_inr),
            shipping_inr: Number(o.shipping_inr),
            total_inr: Number(o.total_inr),
            razorpay_order_id: o.razorpay_order_id,
            razorpay_payment_id: o.razorpay_payment_id,
            customer: o.address_json || {
              name: 'Studio Collector',
              email: 'collector@levelx3d.com',
              phone: '9876543210',
              street: 'Worli Sea Face',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400018',
            },
            items: (o.order_items || []).map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              product_name: item.options_json?.product_name || 'Archival 3D Object',
              product_slug: item.options_json?.product_slug || '',
              qty: item.qty,
              unit_price_inr: Number(item.unit_price_inr),
              options_json: item.options_json?.selected_options || item.options_json,
            })),
            created_at: o.created_at,
          });
        });
      }
    } catch (e) {
      console.warn('Could not fetch all orders from Supabase:', e);
    }
  }

  // Merge with locally stored pending orders
  if (typeof window !== 'undefined') {
    try {
      const localOrders = JSON.parse(localStorage.getItem(LOCAL_PENDING_ORDERS_KEY) || '[]');
      localOrders.forEach((o: any) => {
        const orderId = o.id;
        if (!ordersMap.has(orderId)) {
          ordersMap.set(orderId, {
            id: orderId,
            customer_id: o.customer_id,
            status: (o.status as OrderStatus) || 'pending',
            subtotal_inr: Number(o.subtotalInr || o.subtotal_inr || 0),
            shipping_inr: Number(o.shippingInr || o.shipping_inr || 0),
            total_inr: Number(o.totalInr || o.total_inr || 0),
            customer: o.customer || o.address_json || {
              name: 'Studio Collector',
              email: 'collector@levelx3d.com',
              phone: '9876543210',
              street: 'Worli Sea Face',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400018',
            },
            items: (o.items || []).map((it: any) => ({
              id: it.id || generateUUID(),
              product_id: it.product?.id,
              product_name: it.product?.name || 'Archival 3D Object',
              product_slug: it.product?.slug || '',
              qty: it.quantity || 1,
              unit_price_inr: it.product?.price || 0,
              options_json: it.selectedOptions || {},
            })),
            created_at: o.createdAt || o.created_at || new Date().toISOString(),
          });
        }
      });
    } catch (e) { console.warn('Context-specific message:', e); }
  }

  return Array.from(ordersMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * 6. Update Order Status in Supabase & LocalStorage
 */
export async function updateAdminOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  // If Supabase is configured:
  if (isSupabaseConfigured) {
    const client = isServiceRoleConfigured ? supabaseAdmin : supabase;
    try {
      // Map 'printing' to 'processing' if schema check requires it, or pass directly
      const dbStatus = newStatus === 'printing' ? 'processing' : newStatus;
      const { error } = await client
        .from('orders')
        .update({ status: dbStatus })
        .eq('id', orderId);

      if (error) {
        console.warn('Error updating order status in Supabase:', error);
      }
    } catch (e) {
      console.warn('Exception updating order in Supabase:', e);
    }
  }

  // Update in memoryStore
  const memOrder = memoryStore.orders.get(orderId);
  if (memOrder) {
    memOrder.status = newStatus;
  }

  // Update in local storage
  if (typeof window !== 'undefined') {
    try {
      const localOrders = JSON.parse(localStorage.getItem(LOCAL_PENDING_ORDERS_KEY) || '[]');
      const updated = localOrders.map((o: any) => {
        if (o.id === orderId) {
          return { ...o, status: newStatus };
        }
        return o;
      });
      localStorage.setItem(LOCAL_PENDING_ORDERS_KEY, JSON.stringify(updated));
    } catch (e) { console.warn('Context-specific message:', e); }
  }

  return { success: true };
}
