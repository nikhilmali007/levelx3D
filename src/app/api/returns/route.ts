import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, reason, description, email } = body;
    
    if (!orderId || !reason || !email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const returnRequest = {
      id: crypto.randomUUID(),
      orderId,
      reason,
      description: description || '',
      email,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, returnRequest });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit return request' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
  }
  
  return NextResponse.json({ success: true, requests: [] });
}
