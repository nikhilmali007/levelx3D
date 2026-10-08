import { NextRequest, NextResponse } from 'next/server';
import { getAdminProducts, saveAdminProduct, deleteAdminProduct } from '@/lib/supabase/admin';
import { verifyAdminRequest } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const products = await getAdminProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validation
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Product name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    if (body.price_inr === undefined || Number(body.price_inr) < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid price in INR is required.' },
        { status: 400 }
      );
    }

    const result = await saveAdminProduct({
      ...body,
      price_inr: Number(body.price_inr),
      compare_at_price_inr: body.compare_at_price_inr ? Number(body.compare_at_price_inr) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      is_customizable: Boolean(body.is_customizable),
      is_premium: Boolean(body.is_premium),
      status: body.status || 'active',
      image_url: body.image_url || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
      images: body.images || [body.image_url || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85'],
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error creating product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for update.' },
        { status: 400 }
      );
    }

    const result = await saveAdminProduct({
      ...body,
      price_inr: Number(body.price_inr),
      compare_at_price_inr: body.compare_at_price_inr ? Number(body.compare_at_price_inr) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : 0,
      is_customizable: Boolean(body.is_customizable),
      is_premium: Boolean(body.is_premium),
      status: body.status || 'active',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID query parameter is required.' },
        { status: 400 }
      );
    }

    const success = await deleteAdminProduct(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error deleting product' },
      { status: 500 }
    );
  }
}
