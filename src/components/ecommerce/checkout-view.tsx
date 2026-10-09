'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  RotateCcw,
  AlertCircle,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { QuietButton } from '@/components/ui/quiet-button';
import { CreateOrderResult } from '@/lib/supabase/orders';
import { useAuth } from '@/context/auth-context';
import { calculateGST } from '@/lib/gst';

import { calculateShipping, ShippingZone } from '@/lib/shipping';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Chandigarh',
  'Jammu & Kashmir', 'Ladakh'
];

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export function CheckoutView() {
  const { items, isLoaded, totalPrice, totalItems, clearCart } = useCart();
  const { user, customer } = useAuth();

  // Collapsible summary state for mobile
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  // Pre-fill form when user or customer profile is loaded
  useState(() => {
    if (user || customer) {
      setFormData((prev) => ({
        name: prev.name || customer?.name || user?.user_metadata?.name || '',
        email: prev.email || customer?.email || user?.email || '',
        phone: prev.phone || customer?.phone || user?.user_metadata?.phone || '',
        street: prev.street || customer?.street || user?.user_metadata?.street || '',
        landmark: prev.landmark || '',
        city: prev.city || customer?.city || user?.user_metadata?.city || '',
        state: prev.state || customer?.state || user?.user_metadata?.state || 'Maharashtra',
        pincode: prev.pincode || customer?.pincode || user?.user_metadata?.pincode || '',
      }));
    }
  });

  // Also update when user or customer changes asynchronously
  useEffect(() => {
    if (user || customer) {
      setFormData((prev) => ({
        name: prev.name || customer?.name || user?.user_metadata?.name || '',
        email: prev.email || customer?.email || user?.email || '',
        phone: prev.phone || customer?.phone || user?.user_metadata?.phone || '',
        street: prev.street || customer?.street || user?.user_metadata?.street || '',
        landmark: prev.landmark || '',
        city: prev.city || customer?.city || user?.user_metadata?.city || '',
        state: prev.state || customer?.state || user?.user_metadata?.state || 'Maharashtra',
        pincode: prev.pincode || customer?.pincode || user?.user_metadata?.pincode || '',
      }));
    }
  }, [user, customer]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<CreateOrderResult | null>(null);

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'freeship' | null>(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'FIRST10') {
      setDiscountType('percent');
      setDiscountValue(10);
      setPromoApplied(true);
    } else if (code === 'LEVEL20') {
      setDiscountType('percent');
      setDiscountValue(20);
      setPromoApplied(true);
    } else if (code === 'FREESHIP') {
      setDiscountType('freeship');
      setDiscountValue(0);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid or expired promo code');
      setPromoApplied(false);
      setDiscountType(null);
      setDiscountValue(0);
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setDiscountType(null);
    setDiscountValue(0);
    setPromoError('');
  };

  const discountAmount = discountType === 'percent' ? (totalPrice * discountValue) / 100 : 0;
  const [isExpress, setIsExpress] = useState(false);
  const [shippingResult, setShippingResult] = useState(calculateShipping('', totalPrice, isExpress));

  useEffect(() => {
    setShippingResult(calculateShipping(formData.pincode, totalPrice, isExpress));
  }, [formData.pincode, totalPrice, isExpress]);

  const shippingCost = discountType === 'freeship' ? 0 : shippingResult.cost;
  const orderTotal = Math.max(0, totalPrice - discountAmount + shippingCost);

  const taxableAmount = Math.max(0, totalPrice - discountAmount);
  const gstBreakdown = calculateGST(taxableAmount, formData.state);
  const [showGst, setShowGst] = useState(false);

  // Validation function
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\+]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone) && !/^91[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.street.trim() || formData.street.trim().length < 5) {
      newErrors.street = 'Please enter complete street / apartment address';
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      newErrors.city = 'Please enter your city';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Please select a state';
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      street: true,
      city: true,
      state: true,
      pincode: true,
    });

    if (!validate()) {
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);
    
    import('@/lib/analytics').then(({ trackEcommerceEvent }) => {
      trackEcommerceEvent('begin_checkout', items, orderTotal);
    });

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items,
          subtotalInr: totalPrice,
          shippingInr: shippingCost,
          totalInr: orderTotal,
          authUserId: user?.id || undefined,
          shippingZone: shippingResult.zone,
          deliveryEstimate: shippingResult.deliveryEstimate,
          gstJson: gstBreakdown,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderResult(data);
        clearCart();
        
        import('@/lib/analytics').then(({ trackEcommerceEvent }) => {
          trackEcommerceEvent('purchase', items, orderTotal);
        });
      } else {
        alert(data.error || 'Failed to create order. Please verify your details.');
      }
    } catch (err: any) {
      console.error('Error submitting order:', err);
      alert('Error creating order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 text-center">
        <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
        <span className="font-mono text-xs text-slate uppercase tracking-wider">
          Initializing Archival Checkout...
        </span>
      </div>
    );
  }

  // 1. Order Successfully Created -> Ready to hand off to Razorpay
  if (orderResult) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-20 font-sans space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-hairline-light bg-[#ECE9E2]/50 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full border border-hairline-light mx-auto flex items-center justify-center text-ink bg-canvas shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[1.4]" />
          </div>

          <div className="space-y-2">
            <span className="font-heading text-xs tracking-apple-widest text-slate uppercase block">
              Supabase Status &bull; Pending Verification
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase">
              Order Registered
            </h1>
            <p className="font-mono text-xs text-slate">
              Order ID: <span className="text-ink font-semibold">{orderResult.orderId}</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-canvas border border-hairline-light text-left space-y-3 max-w-lg mx-auto text-xs">
            <div className="flex items-center justify-between border-b border-hairline-light pb-2">
              <span className="font-mono uppercase text-slate text-[11px]">Database Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-200 font-semibold">
                pending
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate">Customer Name:</span>
              <span className="text-ink font-medium">{orderResult.customer.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate">Contact Phone:</span>
              <span className="text-ink font-mono">{orderResult.customer.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate">Delivery PIN:</span>
              <span className="text-ink font-mono">{orderResult.customer.pincode} ({orderResult.customer.city})</span>
            </div>
            <div className="flex items-center justify-between border-t border-hairline-light pt-2">
              <span className="text-slate font-medium">Payable Amount:</span>
              <span className="font-mono font-semibold text-sm text-ink">
                {formatPrice(orderResult.amountPaise / 100)} ({orderResult.amountPaise} paise)
              </span>
            </div>
            <div className="text-center pt-2 text-[10px] text-slate font-mono">
              GST (18% incl.): {formatPrice(gstBreakdown.gstAmount)} | GSTIN: —
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {/* WhatsApp Confirmation */}
            <a
              href={`https://wa.me/917208752822?text=${encodeURIComponent(
                `Hi Level X 3D, I just commissioned Order #${orderResult.orderId.slice(0, 8)} for ${formatPrice(orderResult.amountPaise / 100)}. Please confirm fabrication details for ${orderResult.customer.name} (PIN: ${orderResult.customer.pincode}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-heading font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Confirm on WhatsApp</span>
            </a>

            {/* Track Order Live */}
            <Link
              href={`/track?id=${orderResult.orderId}`}
              className="p-4 rounded-2xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-apple-wide uppercase transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <span>Track Live Fabrication</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
            </Link>
          </div>

          {/* Razorpay Handoff & Payment Simulation Card */}
          <div className="p-6 rounded-2xl bg-onyx text-chalk space-y-4 max-w-lg mx-auto text-left shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-chalk/80" />
                <span className="font-heading text-xs uppercase tracking-apple-wide">
                  Razorpay Payment Gateway
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-chalk/10 text-chalk/90">
                Encrypted UPI / Card
              </span>
            </div>

            <p className="text-xs text-chalk/80 leading-relaxed font-sans">
              Order registered in Supabase. You can complete live payment authorization below or verify via bank transfer with studio concierge.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/orders/${orderResult.orderId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        status: 'paid',
                        razorpay_payment_id: `pay_${Date.now()}`
                      })
                    });
                    if (res.ok) {
                      alert(`✅ Payment of ${formatPrice(orderResult.amountPaise / 100)} verified! Status updated to PAID in Supabase.`);
                      window.location.href = `/track?id=${orderResult.orderId}`;
                    }
                  } catch (e) {
                    alert('Error confirming payment simulation.');
                  }
                }}
                className="flex-1 py-3 bg-canvas hover:bg-white text-ink text-xs font-heading font-light tracking-apple-wide uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Complete Payment &bull; {formatPrice(orderResult.amountPaise / 100)}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
              </button>

              <Link
                href={`/invoice/${orderResult.orderId}`}
                target="_blank"
                className="py-3 px-4 border border-chalk/20 hover:border-chalk text-chalk text-xs font-heading uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                title="Download Invoice"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Invoice</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/shop">
              <QuietButton variant="light">
                Return to Shop &rarr;
              </QuietButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart Check
  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full border border-hairline-light mx-auto flex items-center justify-center text-slate bg-canvas">
          <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
            No Objects In Bag
          </h2>
          <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed">
            Please add an architectural 3D printed piece to your bag before proceeding to checkout.
          </p>
        </div>
        <div>
          <Link href="/shop">
            <QuietButton variant="light">
              Explore The Collection &rarr;
            </QuietButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12 font-sans space-y-8">
      {/* Breadcrumbs */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: 'Archival Bag', href: '/cart' },
            { label: 'Checkout' },
          ]}
          theme="light"
        />
      </div>

      {/* MOBILE-ONLY: Collapsible Order Summary Accordion Bar */}
      <div className="lg:hidden border border-hairline-light rounded-2xl overflow-hidden bg-[#ECE9E2]/50">
        <button
          type="button"
          onClick={() => setSummaryExpanded(!summaryExpanded)}
          className="w-full p-4 flex items-center justify-between text-left transition-colors"
          aria-expanded={summaryExpanded}
        >
          <div className="flex items-center gap-2 text-xs font-heading font-light tracking-apple-wide uppercase text-ink">
            <ShoppingBag className="w-4 h-4 text-slate" />
            <span>{summaryExpanded ? 'Hide order summary' : 'Show order summary'} ({totalItems})</span>
            {summaryExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate" />
            )}
          </div>
          <span className="font-mono text-sm font-medium text-ink">
            {formatPrice(orderTotal)}
          </span>
        </button>

        <AnimatePresence>
          {summaryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-hairline-light p-4 space-y-4 bg-canvas"
            >
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id || item.product.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#ECE9E2] border border-hairline-light shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-heading text-xs font-light tracking-wide text-ink truncate block">
                          {item.product.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate block">
                          Qty: {item.quantity} &bull; {formatPrice(item.product.price)}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-medium text-ink shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-hairline-light">
                {!isPromoOpen && !promoApplied ? (
                  <button
                    type="button"
                    onClick={() => setIsPromoOpen(true)}
                    className="text-xs font-heading font-medium tracking-wide uppercase text-slate hover:text-ink transition-colors flex items-center gap-1.5"
                  >
                    <span>Have a promo code?</span>
                  </button>
                ) : promoApplied ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-700 font-semibold">{promoCode.toUpperCase()} Applied</span>
                      <button type="button" onClick={removePromo} className="text-xs font-sans text-emerald-600 hover:text-emerald-800 underline">Remove</button>
                    </div>
                    <span className="text-[11px] font-sans text-emerald-600">
                      {discountType === 'percent' ? `${discountValue}% off your order.` : 'Free shipping on your order.'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 bg-white border border-hairline-light rounded-xl px-3 py-2 text-xs text-ink outline-none uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-ink text-chalk rounded-xl text-xs font-medium hover:bg-onyx transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[11px] text-red-500 font-sans">{promoError}</p>}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-hairline-light space-y-1.5 text-xs font-sans text-slate">
                <div className="flex justify-between">
                  <span>Subtotal (incl. GST)</span>
                  <span className="font-mono text-ink">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="pl-4">
                  <button type="button" onClick={() => setShowGst(!showGst)} className="text-[10px] text-slate hover:text-ink transition-colors flex items-center gap-1 mb-1">
                    {showGst ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showGst ? 'Hide' : 'Show'} GST breakdown
                  </button>
                  <AnimatePresence>
                    {showGst && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="font-mono text-[11px] text-slate overflow-hidden">
                        <div className="flex justify-between py-0.5">
                          <span>├ Base Price</span>
                          <span>{formatPrice(gstBreakdown.subtotalBeforeGst)}</span>
                        </div>
                        {gstBreakdown.isInterState ? (
                          <div className="flex justify-between py-0.5">
                            <span>└ IGST (18%)</span>
                            <span>{formatPrice(gstBreakdown.igst)}</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between py-0.5">
                              <span>├ CGST (9%)</span>
                              <span>{formatPrice(gstBreakdown.cgst)}</span>
                            </div>
                            <div className="flex justify-between py-0.5">
                              <span>└ SGST (9%)</span>
                              <span>{formatPrice(gstBreakdown.sgst)}</span>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({discountValue}%)</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-ink">
                    {shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Validated Checkout Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="border-b border-hairline-light pb-4">
            <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1">
              Secure Studio Dispatch
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase">
              Shipping & Customer Details
            </h1>
          </div>

          {/* Customer Auth Indicator */}
          {user ? (
            <div className="p-4 rounded-2xl bg-canvas border border-hairline-light flex items-center justify-between gap-4 text-xs font-sans">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate truncate">
                  Signed in as <strong className="text-ink font-medium">{user.email}</strong> &bull; Profile details applied
                </span>
              </div>
              <Link
                href="/account"
                className="text-[11px] font-mono text-slate hover:text-ink underline shrink-0 transition-colors"
              >
                Manage Profile &rarr;
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#ECE9E2]/50 border border-hairline-light flex items-center justify-between gap-4 text-xs font-sans">
              <span className="text-slate">
                Checking out as Guest. Have a collector account?
              </span>
              <Link
                href="/login?redirect=/checkout"
                className="text-[11px] font-mono text-ink font-medium hover:underline shrink-0 transition-colors"
              >
                Sign in to pre-fill &rarr;
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Section A: Contact Details */}
            <div className="space-y-4">
              <h3 className="font-heading text-xs tracking-apple-widest uppercase text-slate font-light">
                1. Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="name" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    Full Name <span className="text-ink">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Nikhil Mali"
                    className={`w-full bg-canvas border rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors ${
                      touched.name && errors.name
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-hairline-light focus:border-ink'
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p className="text-[11px] font-sans text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    Email Address <span className="text-ink">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="nikhil@example.com"
                    className={`w-full bg-canvas border rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-hairline-light focus:border-ink'
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="text-[11px] font-sans text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Mobile Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    Phone (10-digit mobile) <span className="text-ink">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-mono text-slate pointer-events-none">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      maxLength={12}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="9876543210"
                      className={`w-full bg-canvas border rounded-xl pl-12 pr-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors ${
                        touched.phone && errors.phone
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-hairline-light focus:border-ink'
                      }`}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <p className="text-[11px] font-sans text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section B: Delivery Address */}
            <div className="space-y-4 pt-4 border-t border-hairline-light">
              <h3 className="font-heading text-xs tracking-apple-widest uppercase text-slate font-light">
                2. Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Street / Apartment */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="street" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    Address / Apartment / Suite <span className="text-ink">*</span>
                  </label>
                  <input
                    id="street"
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleChange('street', e.target.value)}
                    onBlur={() => handleBlur('street')}
                    placeholder="Flat 402, Level X Towers, Worli Sea Face"
                    className={`w-full bg-canvas border rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors ${
                      touched.street && errors.street
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-hairline-light focus:border-ink'
                    }`}
                  />
                  {touched.street && errors.street && (
                    <p className="text-[11px] font-sans text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.street}
                    </p>
                  )}
                </div>

                {/* Landmark */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="landmark" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    Landmark <span className="text-slate text-[10px]">(Optional)</span>
                  </label>
                  <input
                    id="landmark"
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => handleChange('landmark', e.target.value)}
                    placeholder="Near St. Regis / Coastline Promenade"
                    className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    City <span className="text-ink">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    placeholder="Mumbai"
                    className={`w-full bg-canvas border rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors ${
                      touched.city && errors.city
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-hairline-light focus:border-ink'
                    }`}
                  />
                  {touched.city && errors.city && (
                    <p className="text-[11px] font-sans text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div className="space-y-1.5">
                  <label htmlFor="pincode" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    PIN Code (6 digits) <span className="text-ink">*</span>
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    onBlur={() => handleBlur('pincode')}
                    placeholder="400018"
                    className={`w-full bg-canvas border rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors font-mono ${
                      touched.pincode && errors.pincode
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-hairline-light focus:border-ink'
                    }`}
                  />
                  {touched.pincode && errors.pincode && (
                    <p className="text-[11px] font-sans text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.pincode}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="state" className="text-xs font-mono uppercase text-slate tracking-wider block">
                    State / Union Territory <span className="text-ink">*</span>
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors cursor-pointer"
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shipping Calculation */}
                {formData.pincode.length === 6 && (
                  <div className="sm:col-span-2 mt-4 p-4 rounded-xl border border-hairline-light bg-[#ECE9E2]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate">Shipping Zone:</span>
                      <span className="text-xs font-medium text-ink">{shippingResult.zoneName}</span>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isExpress} 
                        onChange={(e) => setIsExpress(e.target.checked)}
                        className="w-4 h-4 rounded border-hairline-light text-ink focus:ring-ink"
                      />
                      <span className="text-xs font-sans text-ink">
                        Express Delivery ({shippingResult.deliveryEstimate})
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Pay Now Button */}
            <div className="pt-6 border-t border-hairline-light space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 px-6 rounded-2xl bg-onyx hover:bg-ink text-chalk text-xs sm:text-sm font-heading font-light tracking-apple-wide uppercase text-center shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-chalk/30 border-t-chalk rounded-full animate-spin" />
                    <span>Creating Pending Order in Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Pay now &bull; {formatPrice(orderTotal)}</span>
                    <ArrowRight className="w-4 h-4 stroke-[1.4]" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate text-center">
                <Lock className="w-3 h-3 text-slate" />
                <span>256-bit Encrypted Checkout &bull; Powered by Razorpay</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Desktop Sticky Order Summary (5 cols) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-28 space-y-6">
          <div className="p-7 rounded-3xl border border-hairline-light bg-[#ECE9E2]/40 space-y-6 shadow-sm">
            <h3 className="font-heading text-sm font-light tracking-apple-wide uppercase text-ink border-b border-hairline-light pb-4">
              Order Summary ({totalItems})
            </h3>

            {/* Compact items list */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                const hasOptions = item.selectedOptions && Object.keys(item.selectedOptions).length > 0;

                return (
                  <div key={item.id || item.product.id} className="flex gap-3.5 pb-4 border-b border-hairline-light/60 last:border-0 last:pb-0">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#ECE9E2] border border-hairline-light shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="font-heading text-xs font-light tracking-wide text-ink truncate block">
                          {item.product.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate">
                          Qty: {item.quantity} &bull; {formatPrice(item.product.price)}
                        </span>
                      </div>

                      {hasOptions && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.selectedOptions!).map(([k, v]) => (
                            <span key={k} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-canvas text-slate border border-hairline-light truncate max-w-[140px]">
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-medium text-ink">
                        {formatPrice(lineTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Block */}
            <div className="pt-4 border-t border-hairline-light">
              {!isPromoOpen && !promoApplied ? (
                <button
                  type="button"
                  onClick={() => setIsPromoOpen(true)}
                  className="text-xs font-heading font-medium tracking-wide uppercase text-slate hover:text-ink transition-colors flex items-center gap-1.5"
                >
                  <span>Have a promo code?</span>
                </button>
              ) : promoApplied ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-700 font-semibold">{promoCode.toUpperCase()} Applied</span>
                    <button type="button" onClick={removePromo} className="text-xs font-sans text-emerald-600 hover:text-emerald-800 underline">Remove</button>
                  </div>
                  <span className="text-[11px] font-sans text-emerald-600">
                    {discountType === 'percent' ? `${discountValue}% off your order.` : 'Free shipping on your order.'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-white border border-hairline-light rounded-xl px-3 py-2 text-xs text-ink outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-ink text-chalk rounded-xl text-xs font-medium hover:bg-onyx transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-red-500 font-sans">{promoError}</p>}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-hairline-light space-y-2 text-xs font-sans text-slate">
              <div className="flex justify-between items-center">
                <span>Subtotal (incl. GST)</span>
                <span className="font-mono text-ink font-medium">{formatPrice(totalPrice)}</span>
              </div>

              <div className="pl-4">
                <button type="button" onClick={() => setShowGst(!showGst)} className="text-[10px] text-slate hover:text-ink transition-colors flex items-center gap-1 mb-1">
                  {showGst ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showGst ? 'Hide' : 'Show'} GST breakdown
                </button>
                <AnimatePresence>
                  {showGst && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="font-mono text-[11px] text-slate overflow-hidden">
                      <div className="flex justify-between py-0.5">
                        <span>├ Base Price</span>
                        <span>{formatPrice(gstBreakdown.subtotalBeforeGst)}</span>
                      </div>
                      {gstBreakdown.isInterState ? (
                        <div className="flex justify-between py-0.5">
                          <span>└ IGST (18%)</span>
                          <span>{formatPrice(gstBreakdown.igst)}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between py-0.5">
                            <span>├ CGST (9%)</span>
                            <span>{formatPrice(gstBreakdown.cgst)}</span>
                          </div>
                          <div className="flex justify-between py-0.5">
                            <span>└ SGST (9%)</span>
                            <span>{formatPrice(gstBreakdown.sgst)}</span>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({discountValue}%)</span>
                  <span className="font-mono font-medium">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingResult.zoneName}, {shippingResult.deliveryEstimate})</span>
                <span className="text-ink">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-hairline-light text-base font-heading font-light tracking-wide text-ink">
                <span className="uppercase">Total (INR)</span>
                <span className="font-mono text-lg font-medium">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Assurance Badges */}
            <div className="space-y-2 pt-4 border-t border-hairline-light text-[11px] font-mono text-slate">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate" />
                <span>Numbered Edition with Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate" />
                <span>Micro-SLA 25μm Layer Precision</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
