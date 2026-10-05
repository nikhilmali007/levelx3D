'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Package,
  LogOut,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAuth, CustomerProfile } from '@/context/auth-context';
import { getCustomerOrders } from '@/lib/supabase/orders';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Chandigarh',
  'Jammu & Kashmir', 'Ladakh'
];

export function ProfileView() {
  const router = useRouter();
  const { user, customer, isLoading, signOut, updateProfile } = useAuth();

  const [ordersCount, setOrdersCount] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [user, isLoading, router]);

  // Load customer profile data
  useEffect(() => {
    if (customer || user) {
      setFormData({
        name: customer?.name || user?.user_metadata?.name || '',
        phone: customer?.phone || user?.user_metadata?.phone || '',
        street: customer?.street || user?.user_metadata?.street || '',
        city: customer?.city || user?.user_metadata?.city || '',
        state: customer?.state || user?.user_metadata?.state || 'Maharashtra',
        pincode: customer?.pincode || user?.user_metadata?.pincode || '',
      });
    }
  }, [customer, user]);

  // Load orders count
  useEffect(() => {
    if (user?.email) {
      getCustomerOrders(user.email, user.id).then((orders) => {
        setOrdersCount(orders.length);
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);

    if (!formData.name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(res.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
        <span className="font-mono text-xs text-slate uppercase tracking-wider">
          Verifying Collector Session...
        </span>
      </div>
    );
  }

  const displayName = customer?.name || user.user_metadata?.name || user.email.split('@')[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12 font-sans space-y-10">
      {/* Breadcrumbs */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: 'Collector Account' },
          ]}
          theme="light"
        />
      </div>

      {/* Account Header Hero */}
      <div className="border-b border-hairline-light pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block">
            Collector Identity &bull; Level X 3D
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-ink uppercase">
            {displayName}
          </h1>
          <p className="font-mono text-xs text-slate flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
            <span className="text-hairline-dark/30">&bull;</span>
            <span className="text-emerald-700 font-sans text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Authenticated
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/account/orders">
            <button className="py-3 px-5 rounded-xl border border-hairline-light hover:border-ink bg-canvas text-ink text-xs font-heading font-light tracking-apple-wide uppercase transition-all flex items-center gap-2 shadow-2xs">
              <Package className="w-4 h-4 stroke-[1.4]" />
              <span>Order Ledger {ordersCount !== null && `(${ordersCount})`}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
            </button>
          </Link>

          <button
            onClick={handleSignOut}
            className="py-3 px-4 rounded-xl border border-hairline-light hover:border-red-300 hover:text-red-600 bg-canvas text-slate text-xs font-sans transition-all flex items-center gap-1.5"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Overview Cards + Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Quick Stats & Order Ledger Teaser (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Ledger Card */}
          <div className="p-6 rounded-3xl border border-hairline-light bg-[#ECE9E2]/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-canvas border border-hairline-light flex items-center justify-center text-ink">
                <Package className="w-5 h-5 stroke-[1.4]" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-canvas border border-hairline-light text-slate">
                Supabase Ledger
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-lg font-light tracking-apple-wide text-ink uppercase">
                Past Commissions
              </h3>
              <p className="text-xs text-slate leading-relaxed">
                Review your micro-SLA and FDM commissions, tracking statuses, and archival invoices.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/account/orders"
                className="w-full py-3 px-4 bg-onyx hover:bg-ink text-chalk rounded-xl text-xs font-heading font-light tracking-apple-wide uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Studio Assurance Card */}
          <div className="p-6 rounded-3xl border border-hairline-light bg-canvas space-y-3 text-xs text-slate">
            <div className="flex items-center gap-2 text-ink font-heading text-xs tracking-apple-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-ink stroke-[1.4]" />
              <span>Row-Level Security</span>
            </div>
            <p className="leading-relaxed">
              Your account details and commission history are strictly isolated via Supabase Row Level Security. Only you can access your order records.
            </p>
          </div>
        </div>

        {/* Right Column: Editable Delivery Profile Form (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl border border-hairline-light bg-[#ECE9E2]/30 space-y-8 backdrop-blur-sm">
          <div>
            <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1">
              Saved Dispatch Profile
            </span>
            <h2 className="font-heading text-2xl font-light tracking-apple-wide text-ink uppercase">
              Default Shipping Address
            </h2>
            <p className="text-xs text-slate leading-relaxed mt-1">
              Save your address here once. Our checkout will automatically pre-populate these details for fast, friction-free dispatch.
            </p>
          </div>

          {/* Feedback Banners */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 font-sans"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Default shipping details saved successfully. They will auto-fill at checkout.</span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 font-sans"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Full Name <span className="text-ink">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nikhil Mali"
                  className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-[#ECE9E2]/60 border border-hairline-light rounded-xl px-4 py-3 text-xs sm:text-sm text-slate cursor-not-allowed outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Mobile Phone (10 digits)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono text-slate pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl pl-12 pr-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Street Address / Apartment
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Flat 402, Level X Towers, Worli Sea Face"
                  className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Mumbai"
                  className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                />
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="400018"
                  className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors font-mono"
                />
              </div>

              {/* State */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  State / Union Territory
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors cursor-pointer"
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline-light flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="py-3.5 px-6 rounded-xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-apple-wide uppercase transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-chalk/30 border-t-chalk rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <span>Save Delivery Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
