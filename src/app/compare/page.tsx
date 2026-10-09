'use client';

import { useCompare } from '@/hooks/use-compare';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

export default function ComparePage() {
  const { compareItems, removeCompare, clearCompare } = useCompare();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-light tracking-apple-wide uppercase">
            Compare Objects
          </h1>
          {compareItems.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-mono text-slate hover:text-ink transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {compareItems.length === 0 ? (
          <div className="text-center py-24 text-slate">
            <p className="mb-4">You have not selected any objects to compare.</p>
            <Link href="/shop" className="text-xs font-mono border-b border-slate hover:text-ink hover:border-ink transition-colors pb-0.5">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-hairline-light w-48"></th>
                  {compareItems.map((item) => (
                    <th key={item.id} className="p-4 border-b border-hairline-light align-top w-64">
                      <div className="relative w-full aspect-square bg-[#ECE9E2] rounded-xl overflow-hidden mb-3">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <button
                          onClick={() => removeCompare(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-canvas/80 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Link href={`/product/${item.slug}`} className="block font-heading text-lg font-light tracking-wide hover:text-slate transition-colors mb-1">
                        {item.name}
                      </Link>
                      <div className="font-mono font-medium mb-3">
                        {formatPrice(item.price)}
                      </div>
                      <button
                        onClick={() => addItem(item as any, 1)}
                        disabled={!item.inStock}
                        className="w-full py-2 bg-onyx text-chalk rounded-xl text-xs font-heading font-light tracking-apple-wide uppercase hover:bg-ink transition-colors disabled:opacity-50"
                      >
                        {item.inStock ? 'Add to Bag' : 'Out of Stock'}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-light/60 text-sm">
                <tr>
                  <td className="p-4 font-mono text-xs uppercase text-slate">Shelf</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4">{item.shelf}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs uppercase text-slate">Category</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4">{item.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs uppercase text-slate">Material</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4">{item.specs?.material || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs uppercase text-slate">Finish</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4">{item.specs?.finish || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs uppercase text-slate">Dimensions</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4">{item.specs?.dimensions || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs uppercase text-slate">Weight</td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-4">{(item as any).weight_grams ? `${(item as any).weight_grams} g` : '-'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
