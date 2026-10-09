import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { headers } from 'next/headers';

async function getInvoiceData(orderId: string) {
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  try {
    const res = await fetch(`${protocol}://${host}/api/invoice/${encodeURIComponent(orderId)}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    
    if (res.ok && data.success && data.order) {
      return data.order;
    }
    return null;
  } catch (e) {
    console.error('Failed to fetch invoice:', e);
    return null;
  }
}

export default async function InvoicePage({ params }: { params: { orderId: string } }) {
  const order = await getInvoiceData(params.orderId);

  if (!order) {
    notFound();
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white text-black font-sans min-h-screen">
      <div className="border border-black p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-widest uppercase mb-2">Level X 3D</h1>
            <p className="text-sm">Architectural 3D Prints</p>
            <p className="text-sm">Mumbai, Maharashtra 400001</p>
            <p className="text-sm mt-1">GSTIN: 27AAAAA0000A1Z5</p>
          </div>
          <div className="text-right">
            <h2 className="font-heading text-4xl font-light tracking-wider uppercase mb-4">Invoice</h2>
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Invoice #:</span> INV-{shortId}</p>
              <p><span className="font-semibold">Date:</span> {orderDate}</p>
              <p><span className="font-semibold">Order ID:</span> {shortId}</p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-12 border-t border-black pt-6">
          <h3 className="font-heading text-sm font-semibold tracking-wider uppercase mb-3">Bill To:</h3>
          <div className="text-sm space-y-1">
            <p className="font-bold">{order.customer?.name}</p>
            <p>{order.customer?.street}</p>
            <p>{order.customer?.city}, {order.customer?.state}</p>
            <p>PIN: {order.customer?.pincode}</p>
            <p>Phone: {order.customer?.phone}</p>
            <p>Email: {order.customer?.email}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-12 text-sm border-collapse border border-black">
          <thead>
            <tr className="border-b border-black bg-gray-50">
              <th className="py-3 px-4 text-left font-semibold border-r border-black w-12">#</th>
              <th className="py-3 px-4 text-left font-semibold border-r border-black">Item Description</th>
              <th className="py-3 px-4 text-center font-semibold border-r border-black w-24">Qty</th>
              <th className="py-3 px-4 text-right font-semibold border-r border-black w-32">Rate</th>
              <th className="py-3 px-4 text-right font-semibold w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-black">
                <td className="py-3 px-4 border-r border-black">{idx + 1}</td>
                <td className="py-3 px-4 border-r border-black">{item.name}</td>
                <td className="py-3 px-4 text-center border-r border-black">{item.qty}</td>
                <td className="py-3 px-4 text-right border-r border-black">{formatPrice(item.price)}</td>
                <td className="py-3 px-4 text-right">{formatPrice(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal_inr)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Base Price:</span>
              <span>{formatPrice(order.gst_breakdown.base_price)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>CGST (9%):</span>
              <span>{formatPrice(order.gst_breakdown.cgst)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>SGST (9%):</span>
              <span>{formatPrice(order.gst_breakdown.sgst)}</span>
            </div>
            <div className="flex justify-between border-b border-black pb-2">
              <span>Shipping:</span>
              <span>{formatPrice(order.shipping_inr)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>TOTAL:</span>
              <span>{formatPrice(order.total_inr)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="border-t border-black pt-6 text-sm text-gray-600 space-y-1">
          <p>HSN: {order.gst_breakdown.hsn}</p>
          <p>Note: Prices inclusive of GST</p>
          <p className="mt-4 font-semibold text-black">Thank you for your patronage.</p>
          <p className="text-black">levelx3d.com</p>
        </div>
      </div>
    </div>
  );
}
