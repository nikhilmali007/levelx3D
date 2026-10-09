import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getAdminOrders, updateAdminOrderStatus } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = decodeURIComponent(params.id).trim();

    if (!rawId) {
      return NextResponse.json(
        { success: false, error: 'Order ID or tracking query is required' },
        { status: 400 }
      );
    }

    // 1. Query from Supabase
    if (isSupabaseConfigured) {
      try {
        // First try exact UUID or prefix
        let query = supabase
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
            updated_at,
            order_items(id, product_id, qty, unit_price_inr, options_json)
          `);

        if (rawId.includes('-') && rawId.length >= 32) {
          query = query.eq('id', rawId);
        } else {
          // If searching by short id (first 8 chars) or email or phone
          query = query.or(`id.ilike.${rawId}%,address_json->>phone.ilike.%${rawId}%,address_json->>email.ilike.%${rawId}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

        if (!error && data) {
          return NextResponse.json({
            success: true,
            order: {
              id: data.id,
              status: data.status,
              subtotal_inr: Number(data.subtotal_inr),
              shipping_inr: Number(data.shipping_inr),
              total_inr: Number(data.total_inr),
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              customer: data.address_json,
              created_at: data.created_at,
              updated_at: data.updated_at,
              items: (data.order_items || []).map((it: any) => ({
                id: it.id,
                name: it.options_json?.product_name || 'Archival 3D Object',
                slug: it.options_json?.product_slug || '',
                qty: it.qty,
                price: Number(it.unit_price_inr),
                options: it.options_json?.selected_options || it.options_json || {},
              })),
            },
          });
        }
      } catch (dbErr) {
        console.warn('Error querying order from Supabase:', dbErr);
      }
    }

    // 2. Memory / fallback query
    const adminOrders = await getAdminOrders();
    const found = adminOrders.find(
      (o) =>
        o.id.toLowerCase() === rawId.toLowerCase() ||
        o.id.toLowerCase().startsWith(rawId.toLowerCase()) ||
        o.customer?.phone?.includes(rawId) ||
        o.customer?.email?.toLowerCase().includes(rawId.toLowerCase())
    );

    if (found) {
      return NextResponse.json({
        success: true,
        order: {
          id: found.id,
          status: found.status,
          subtotal_inr: found.subtotal_inr,
          shipping_inr: found.shipping_inr,
          total_inr: found.total_inr,
          razorpay_order_id: found.razorpay_order_id,
          razorpay_payment_id: found.razorpay_payment_id,
          customer: found.customer,
          created_at: found.created_at,
          items: found.items.map((it) => ({
            id: it.id,
            name: it.product_name,
            slug: it.product_slug,
            qty: it.qty,
            price: it.unit_price_inr,
            options: it.options_json || {},
          })),
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'No order found matching your inquiry.' },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('Error in order tracking API:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = decodeURIComponent(params.id).trim();
    const body = await req.json();
    const { status, razorpay_payment_id } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const updateData: any = { status };
      if (razorpay_payment_id) {
        updateData.razorpay_payment_id = razorpay_payment_id;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', rawId);

      if (error) {
        console.warn('Error updating order status in Supabase:', error);
      }
    }

    await updateAdminOrderStatus(rawId, status);

    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    console.error('Error updating order:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
