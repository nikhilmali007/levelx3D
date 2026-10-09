import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getAdminOrders } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const rawId = decodeURIComponent(params.orderId).trim();

    if (!rawId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    let orderData = null;

    // 1. Query from Supabase
    if (isSupabaseConfigured) {
      try {
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
          query = query.ilike('id', `${rawId}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

        if (!error && data) {
          orderData = {
            id: data.id,
            status: data.status,
            subtotal_inr: Number(data.subtotal_inr),
            shipping_inr: Number(data.shipping_inr),
            total_inr: Number(data.total_inr),
            customer: data.address_json,
            created_at: data.created_at,
            items: (data.order_items || []).map((it: any) => ({
              id: it.id,
              name: it.options_json?.product_name || 'Archival 3D Object',
              qty: it.qty,
              price: Number(it.unit_price_inr),
            })),
          };
        }
      } catch (dbErr) {
        console.warn('Error querying order from Supabase:', dbErr);
      }
    }

    // 2. Memory / fallback query
    if (!orderData) {
      const adminOrders = await getAdminOrders();
      const found = adminOrders.find(
        (o) =>
          o.id.toLowerCase() === rawId.toLowerCase() ||
          o.id.toLowerCase().startsWith(rawId.toLowerCase())
      );

      if (found) {
        orderData = {
          id: found.id,
          status: found.status,
          subtotal_inr: found.subtotal_inr,
          shipping_inr: found.shipping_inr,
          total_inr: found.total_inr,
          customer: found.customer,
          created_at: found.created_at,
          items: found.items.map((it) => ({
            id: it.id,
            name: it.product_name || 'Archival 3D Object',
            qty: it.qty,
            price: it.unit_price_inr,
          })),
        };
      }
    }

    if (!orderData) {
      return NextResponse.json(
        { success: false, error: 'No order found matching your inquiry.' },
        { status: 404 }
      );
    }

    // Calculate GST breakdown
    // Subtotal (before shipping) includes 18% GST (9% CGST, 9% SGST)
    const basePrice = Math.round((orderData.subtotal_inr / 1.18) * 100) / 100;
    const cgst = Math.round((basePrice * 0.09) * 100) / 100;
    const sgst = Math.round((basePrice * 0.09) * 100) / 100;

    return NextResponse.json({
      success: true,
      order: {
        ...orderData,
        gst_breakdown: {
          base_price: basePrice,
          cgst: cgst,
          sgst: sgst,
          hsn: '3926' // Placeholder HSN code for plastic articles
        }
      },
    });
  } catch (err: any) {
    console.error('Error in invoice API:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
