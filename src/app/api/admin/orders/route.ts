import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrders, updateAdminOrderStatus, OrderStatus } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const orders = await getAdminOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    const validStatuses: OrderStatus[] = [
      'pending',
      'paid',
      'printing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const result = await updateAdminOrderStatus(orderId, status);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error updating order status' },
      { status: 500 }
    );
  }
}
