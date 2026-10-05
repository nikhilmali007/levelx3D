import { NextRequest, NextResponse } from 'next/server';
import { createPendingOrder } from '@/lib/supabase/orders';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, subtotalInr, shippingInr, totalInr, authUserId } = body;

    // Validation
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer shipping details are required.' },
        { status: 400 }
      );
    }

    if (!customer.name || customer.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Valid full name (minimum 2 characters) is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email || !emailRegex.test(customer.email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    // Indian mobile phone: 10 digits
    const cleanedPhone = customer.phone?.replace(/[\s\-\+]/g, '') || '';
    if (!/^[6-9]\d{9}$/.test(cleanedPhone) && !/^91[6-9]\d{9}$/.test(cleanedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit Indian phone number is required.' },
        { status: 400 }
      );
    }

    if (!customer.street || customer.street.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Full street address is required.' },
        { status: 400 }
      );
    }

    if (!customer.city || customer.city.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'City is required.' },
        { status: 400 }
      );
    }

    if (!customer.state || customer.state.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'State is required.' },
        { status: 400 }
      );
    }

    // Indian PIN code: 6 digits
    if (!/^\d{6}$/.test(customer.pincode?.trim() || '')) {
      return NextResponse.json(
        { success: false, error: 'Valid 6-digit PIN code is required.' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart must contain at least 1 item.' },
        { status: 400 }
      );
    }

    const result = await createPendingOrder({
      customer: {
        ...customer,
        phone: cleanedPhone.slice(-10),
      },
      items,
      subtotalInr: Number(subtotalInr || 0),
      shippingInr: Number(shippingInr || 0),
      totalInr: Number(totalInr || 0),
      authUserId: authUserId || undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error creating pending order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
