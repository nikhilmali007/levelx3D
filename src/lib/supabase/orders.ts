import { supabase, isSupabaseConfigured } from './client';
import { CartItem } from '@/types/product';

export interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface CreateOrderParams {
  customer: ShippingAddress;
  items: CartItem[];
  subtotalInr: number;
  shippingInr: number;
  totalInr: number;
}

export interface CreateOrderResult {
  success: boolean;
  orderId: string;
  status: 'pending';
  amountPaise: number;
  currency: 'INR';
  customer: ShippingAddress;
  itemsCount: number;
  createdAt: string;
  message?: string;
  error?: string;
}

// Generate valid v4 UUID for order tracking
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function createPendingOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  const { customer, items, subtotalInr, shippingInr, totalInr } = params;
  const orderId = generateUUID();
  const createdAt = new Date().toISOString();
  const amountPaise = Math.round(totalInr * 100);

  const addressData = {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    street: customer.street,
    city: customer.city,
    state: customer.state,
    pincode: customer.pincode,
    landmark: customer.landmark || '',
  };

  if (isSupabaseConfigured) {
    try {
      // 1. Try to find or insert customer in public.customers
      let customerId: string | null = null;
      try {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', customer.email)
          .maybeSingle();

        if (existingCustomer?.id) {
          customerId = existingCustomer.id;
        } else {
          const newCustId = generateUUID();
          const { data: insertedCust, error: custErr } = await supabase
            .from('customers')
            .insert({
              id: newCustId,
              name: customer.name,
              phone: customer.phone,
              email: customer.email,
            })
            .select('id')
            .maybeSingle();

          if (!custErr && insertedCust) {
            customerId = insertedCust.id;
          }
        }
      } catch (custErr) {
        console.warn('Could not upsert customer profile, continuing with guest order', custErr);
      }

      // 2. Insert into public.orders with status 'pending'
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          customer_id: customerId,
          status: 'pending',
          subtotal_inr: subtotalInr,
          shipping_inr: shippingInr,
          total_inr: totalInr,
          address_json: addressData,
          created_at: createdAt,
        });

      if (!orderError) {
        // 3. Insert line items into public.order_items
        if (items && items.length > 0) {
          const orderItemsData = items.map((item) => {
            // Check if product.id is a valid UUID, otherwise null
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.product.id);
            return {
              id: generateUUID(),
              order_id: orderId,
              product_id: isUUID ? item.product.id : null,
              qty: item.quantity,
              unit_price_inr: item.product.price,
              options_json: {
                product_name: item.product.name,
                product_slug: item.product.slug,
                selected_options: item.selectedOptions || {},
              },
            };
          });

          await supabase.from('order_items').insert(orderItemsData);
        }

        return {
          success: true,
          orderId,
          status: 'pending',
          amountPaise,
          currency: 'INR',
          customer,
          itemsCount: items.length,
          createdAt,
          message: 'Order created in Supabase with status pending.',
        };
      } else {
        console.warn('Supabase order insert returned error:', orderError);
      }
    } catch (e) {
      console.warn('Could not insert order into Supabase, saving to local pending orders', e);
    }
  }

  // Fallback: Save pending order locally (session / localStorage)
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('levelx3d_pending_orders') || '[]');
      existing.unshift({
        id: orderId,
        status: 'pending',
        customer,
        items,
        subtotalInr,
        shippingInr,
        totalInr,
        amountPaise,
        createdAt,
      });
      localStorage.setItem('levelx3d_pending_orders', JSON.stringify(existing.slice(0, 20)));
    } catch (e) {}
  }

  return {
    success: true,
    orderId,
    status: 'pending',
    amountPaise,
    currency: 'INR',
    customer,
    itemsCount: items.length,
    createdAt,
    message: 'Pending order created and queued for Razorpay payment.',
  };
}
