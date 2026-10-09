'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Printer,
  Sparkles,
  Truck,
  Box,
  Clock,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { QuietButton } from '@/components/ui/quiet-button';

interface TrackedOrder {
  id: string;
  status: 'pending' | 'paid' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal_inr: number;
  shipping_inr: number;
  total_inr: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    id: string;
    name: string;
    slug?: string;
    qty: number;
    price: number;
    options?: Record<string, string>;
  }[];
  created_at: string;
  updated_at?: string;
}

const PRODUCTION_STEPS = [
  {
    key: 'placed',
    title: 'Order Confirmed',
    description: 'Design ledger entry validated and queued for fabrication.',
    icon: CheckCircle2,
  },
  {
    key: 'printing',
    title: 'SLA / SLS 3D Printing',
    description: 'Precision additive sintering in high-grade PA12 / resin at 25-micron layer resolution.',
    icon: Printer,
  },
  {
    key: 'smoothing',
    title: 'Vapor Smoothing & QA',
    description: 'Acoustic cleaning, surface vapor-polishing, and architectural tolerance inspection.',
    icon: Sparkles,
  },
  {
    key: 'shipped',
    title: 'Pan-India Express Transit',
    description: 'Secure, shock-cushioned archival packaging dispatched via priority courier.',
    icon: Truck,
  },
  {
    key: 'delivered',
    title: 'Delivered into Collection',
    description: 'Artifact safely placed in your custody.',
    icon: Box,
  },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (searchId: string) => {
    if (!searchId.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchId.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.error || 'No matching order found. Please check your Order ID.');
      }
    } catch (err: any) {
      setError('Unable to query the studio production ledger. Please try again.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  // Determine current active step index (0 to 4)
  const getStepIndex = (status: string): number => {
    switch (status) {
      case 'pending':
        return 0;
      case 'paid':
        return 1;
      case 'printing':
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-16 font-sans space-y-10">
      {/* Breadcrumbs */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: 'Track Fabrication', href: '/track' },
          ]}
          theme="light"
        />
      </div>

      {/* Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-hairline-light pb-6">
        <span className="font-heading text-xs tracking-apple-widest text-slate uppercase font-light block">
          Level X 3D &bull; Fabrication Ledger
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-ink uppercase">
          Track Your Commission
        </h1>
        <p className="text-xs sm:text-sm text-slate max-w-xl font-sans font-normal leading-relaxed">
          Monitor your 3D printed piece as it transitions from parametric CAD slicing to laser sintering, surface vapor smoothing, and insured priority transit.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl space-y-2">
        <label className="text-xs font-mono uppercase text-slate tracking-wider block">
          Enter Order ID or Contact Mobile
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. b8c4e09f or 917208752822"
            className="w-full bg-white border border-hairline-light focus:border-ink rounded-2xl pl-11 pr-28 py-3.5 text-xs sm:text-sm text-ink font-mono outline-none shadow-xs transition-colors"
          />
          <Search className="w-4 h-4 text-slate absolute left-4 pointer-events-none" />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 py-2 px-4 rounded-xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-wide uppercase transition-all shadow-xs disabled:opacity-40"
          >
            {isLoading ? 'Querying...' : 'Track'}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5 max-w-xl"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Order Tracking Dashboard */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Order Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-hairline-light bg-[#ECE9E2]/50 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-light pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate tracking-wider block">
                  Studio Order Reference
                </span>
                <span className="font-mono text-base sm:text-lg font-semibold text-ink">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-xs text-slate font-mono block">
                  Commissioned on{' '}
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase font-semibold border ${
                    order.status === 'delivered'
                      ? 'bg-teal-100 text-teal-900 border-teal-300'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : order.status === 'printing'
                      ? 'bg-onyx text-chalk border-onyx'
                      : order.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-900 border-red-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {order.status === 'printing' ? 'In SLA Fabrication' : order.status.toUpperCase()}
                </span>

                <button
                  onClick={handlePrintReceipt}
                  className="py-2 px-3.5 rounded-xl border border-hairline-light bg-white hover:border-ink text-xs font-sans text-slate hover:text-ink transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Print official receipt"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tax Invoice</span>
                </button>
              </div>
            </div>

            {/* Visual 5-Step Production Progress Bar */}
            {!isCancelled ? (
              <div className="space-y-6 pt-2">
                <h3 className="font-heading text-xs uppercase tracking-apple-wide text-slate font-light">
                  Fabrication & Dispatch Timeline
                </h3>

                <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4">
                  {PRODUCTION_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div
                        key={step.key}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-white border-ink shadow-sm ring-1 ring-ink/10'
                            : isCompleted
                            ? 'bg-white/70 border-hairline-light'
                            : 'bg-transparent border-dashed border-hairline-light opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                              isCurrent
                                ? 'bg-onyx text-chalk'
                                : isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-mono text-[10px] text-slate uppercase">
                            Step 0{idx + 1}
                          </span>
                        </div>
                        <h4 className="font-heading text-xs font-medium text-ink tracking-wide block mb-1">
                          {step.title}
                        </h4>
                        <p className="text-[11px] font-sans text-slate leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800">
                This commission was cancelled. If you believe this is an error, please reach out to our studio concierge below.
              </div>
            )}

            {/* Two Column Summary: Destination & Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-hairline-light text-xs font-sans">
              {/* Delivery Details */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase text-slate tracking-wider block">
                  Delivery Destination
                </span>
                <p className="font-medium text-ink">{order.customer?.name}</p>
                <p className="text-slate">{order.customer?.street}</p>
                <p className="text-slate font-mono">
                  {order.customer?.city}, {order.customer?.state} &bull; {order.customer?.pincode}
                </p>
                {order.customer?.phone && (
                  <p className="text-slate font-mono">Tel: +91 {order.customer.phone}</p>
                )}
              </div>

              {/* Order Items & Totals */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase text-slate tracking-wider block">
                  Commissioned Pieces ({order.items.length})
                </span>
                <div className="space-y-2 divide-y divide-hairline-light">
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-heading font-light tracking-wide text-ink block">
                          {item.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate">
                          &times;{item.qty} &bull; {formatPrice(item.price)}
                        </span>
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {Object.entries(item.options).map(([k, v]) => (
                              <span key={k} className="text-[9px] font-mono px-1 py-0.2 rounded bg-white border border-hairline-light text-slate">
                                {k}: {String(v)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="font-mono font-medium text-ink shrink-0">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-hairline-light flex items-center justify-between font-mono">
                  <span className="text-slate">Total Amount:</span>
                  <span className="text-sm font-semibold text-ink">{formatPrice(order.total_inr)}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Button */}
            <div className="pt-4 border-t border-hairline-light flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fabrication backed by Level X 3D Dimensional Accuracy Guarantee</span>
              </div>

              <a
                href={`https://wa.me/917208752822?text=${encodeURIComponent(
                  `Hi Level X 3D, I am inquiring about Order #${order.id.slice(0, 8)} (${order.items.map(i => i.name).join(', ')}). Please provide an update on fabrication.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-heading font-medium tracking-wide uppercase transition-colors flex items-center gap-2 shadow-xs shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp &bull; +91 72087 52822</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
