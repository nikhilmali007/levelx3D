'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  MapPin,
  ShoppingBag,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getCustomerOrders, OrderRecord } from '@/lib/supabase/orders';
import { formatPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { QuietButton } from '@/components/ui/quiet-button';

export function OrdersView() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/account/orders');
    }
  }, [user, isLoading, router]);

  // Fetch orders for current user
  const fetchOrders = async () => {
    if (!user) return;
    setIsFetchingOrders(true);
    try {
      const records = await getCustomerOrders(user.email, user.id);
      setOrders(records);
    } catch (e) {
      console.warn('Error fetching orders:', e);
    } finally {
      setIsFetchingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium">
            Paid &bull; Confirmed
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-onyx text-chalk border border-onyx font-medium">
            In SLA Production
          </span>
        );
      case 'shipped':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-blue-100 text-blue-900 border border-blue-200 font-medium">
            Dispatched &bull; En Route
          </span>
        );
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-teal-100 text-teal-900 border border-teal-200 font-medium">
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-red-100 text-red-900 border border-red-200 font-medium">
            Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 font-medium">
            Pending Payment
          </span>
        );
    }
  };

  if (isLoading || !user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
        <span className="font-mono text-xs text-slate uppercase tracking-wider">
          Verifying Collector Credentials...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12 font-sans space-y-10">
      {/* Breadcrumbs */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: 'Collector Account', href: '/account' },
            { label: 'Order History' },
          ]}
          theme="light"
        />
      </div>

      {/* Header */}
      <div className="border-b border-hairline-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block">
            Supabase Protected Ledger
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-ink uppercase">
            Order History
          </h1>
          <p className="text-xs text-slate max-w-lg leading-relaxed">
            Every piece commissioned under account <strong className="text-ink font-medium">{user.email}</strong> is recorded below with verified status and price breakdown.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={isFetchingOrders}
            className="py-2.5 px-4 rounded-xl border border-hairline-light hover:border-ink bg-canvas text-xs font-mono text-slate hover:text-ink transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOrders ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>

          <Link href="/account">
            <button className="py-2.5 px-4 rounded-xl border border-hairline-light hover:border-ink bg-canvas text-xs font-heading font-light tracking-wide uppercase text-ink transition-all">
              Manage Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Order List State */}
      {isFetchingOrders ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto" />
          <span className="font-mono text-xs text-slate uppercase tracking-wider block">
            Querying Supabase Ledger...
          </span>
        </div>
      ) : orders.length === 0 ? (
        /* Empty Ledger State */
        <div className="p-12 sm:p-20 rounded-3xl border border-hairline-light bg-[#ECE9E2]/30 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border border-hairline-light mx-auto flex items-center justify-center text-slate bg-canvas">
            <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
              No Commissions Found
            </h2>
            <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed">
              You haven&apos;t placed any orders yet. When you acquire an architectural 3D printed piece or custom studio commission, it will appear here.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/shop">
              <QuietButton variant="light">
                Explore The Collection &rarr;
              </QuietButton>
            </Link>
          </div>
        </div>
      ) : (
        /* Render Orders List */
        <div className="space-y-6">
          {orders.map((order) => {
            const dateFormatted = new Date(order.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-hairline-light bg-[#ECE9E2]/30 p-6 sm:p-8 space-y-6 shadow-2xs backdrop-blur-sm"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate">Order</span>
                      <span className="font-mono text-xs font-semibold text-ink">
                        #{order.id.slice(0, 8)}...{order.id.slice(-4)}
                      </span>
                      <button
                        onClick={() => handleCopyOrderId(order.id)}
                        title="Copy full UUID"
                        className="p-1 rounded text-slate hover:text-ink transition-colors"
                      >
                        {copiedId === order.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <span className="text-[11px] font-sans text-slate block">
                      Placed on {dateFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="font-mono font-medium text-base sm:text-lg text-ink">
                      {formatPrice(order.total_inr)}
                    </span>
                    <Link
                      href={`/invoice/${order.id}`}
                      target="_blank"
                      className="py-1.5 px-3 rounded-xl border border-hairline-light bg-white hover:border-ink text-[10px] font-heading uppercase text-slate hover:text-ink transition-colors flex items-center gap-1 shadow-2xs"
                      title="Download Invoice"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Invoice</span>
                    </Link>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-mono uppercase text-slate tracking-wider">
                    Commissioned Objects ({order.items?.length || 0})
                  </h4>

                  <div className="divide-y divide-hairline-light/60">
                    {(order.items || []).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <div className="space-y-1 min-w-0">
                          {item.product_slug ? (
                            <Link
                              href={`/product/${item.product_slug}`}
                              className="font-heading text-sm font-light tracking-wide text-ink hover:underline inline-flex items-center gap-1.5"
                            >
                              <span>{item.product_name}</span>
                              <ExternalLink className="w-3 h-3 text-slate" />
                            </Link>
                          ) : (
                            <span className="font-heading text-sm font-light tracking-wide text-ink block">
                              {item.product_name}
                            </span>
                          )}

                          <span className="text-xs font-mono text-slate block">
                            Qty: {item.qty} &bull; Unit Price: {formatPrice(item.unit_price_inr)}
                          </span>

                          {/* Selected Options / Customizations */}
                          {item.options_json && typeof item.options_json === 'object' && Object.keys(item.options_json).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {Object.entries(item.options_json).map(([k, v]) => (
                                <span
                                  key={k}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-canvas border border-hairline-light text-slate"
                                >
                                  {k}: {String(v)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="font-mono text-xs font-medium text-ink shrink-0 pt-0.5">
                          {formatPrice(item.unit_price_inr * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer: Shipping Destination & Pending Payment Hint */}
                <div className="pt-4 border-t border-hairline-light flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans text-slate">
                  {order.address_json && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate shrink-0" />
                      <span>
                        Deliver to: <strong className="text-ink font-medium">{order.address_json.name}</strong>,{' '}
                        {order.address_json.city}, {order.address_json.state} &bull; {order.address_json.pincode}
                      </span>
                    </div>
                  )}

                  {order.status === 'pending' && (
                    <div className="flex items-center gap-2 text-amber-800 bg-amber-50/70 border border-amber-200 px-3 py-1.5 rounded-xl font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Order registered in Supabase. Ready for Razorpay payment handoff.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
