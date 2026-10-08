import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/supabase/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json([]);
    }

    const products = await getAllProducts();
    const results = products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tagline?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.shelf.toLowerCase().includes(query)
        );
      })
      .slice(0, 12);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
