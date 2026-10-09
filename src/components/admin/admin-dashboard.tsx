'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Layers,
  LogOut,
  RefreshCw,
  Clock,
  Printer,
  CheckCircle2,
  Truck,
  XCircle,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import { AdminProduct, AdminOrder, OrderStatus, slugify } from '@/lib/supabase/admin';
import { ProductModal } from '@/components/admin/product-modal';
import { formatPrice } from '@/lib/utils';
import { openWhatsAppOrderStatus } from '@/lib/notifications';
import { compressImage } from '@/lib/image-utils';
import { SHELVES_DATA } from '@/lib/products-data';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'returns' | 'analytics'>('products');
  const [returnRequests, setReturnRequests] = useState<any[]>([]);
  const [stockNotifications, setStockNotifications] = useState<any[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'returns') {
      const saved = localStorage.getItem('levelx3d_return_requests');
      if (saved) setReturnRequests(JSON.parse(saved));
    }
    const notifs = localStorage.getItem('levelx3d_stock_notifications');
    if (notifs) setStockNotifications(JSON.parse(notifs));
    
    const news = localStorage.getItem('levelx3d_newsletter_subscribers');
    if (news) setNewsletterSubscribers(JSON.parse(news));

    if (activeTab === 'analytics') {
      import('@/lib/analytics').then(({ getAnalyticsSummary }) => {
        setAnalyticsSummary(getAnalyticsSummary());
      });
    }
  }, [activeTab]);

  // Products State
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Add State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaName, setQaName] = useState('');
  const [qaPrice, setQaPrice] = useState<number>(14500);
  const [qaCategory, setQaCategory] = useState('');
  const [qaImage, setQaImage] = useState<File | null>(null);
  const [qaPreview, setQaPreview] = useState<string | null>(null);
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const categoryOptions = SHELVES_DATA.flatMap(shelf => 
    shelf.categories.map(cat => ({
      value: `${shelf.shelf}__${cat.name}`,
      label: `${shelf.shelf} > ${cat.name}`,
      shelf: shelf.shelf,
      category: cat.name
    }))
  );

  useEffect(() => {
    if (categoryOptions.length > 0 && !qaCategory) {
      setQaCategory(categoryOptions[0].value);
    }
  }, [categoryOptions, qaCategory]);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaName.trim() || !qaPrice || !qaImage) return;
    
    setIsQuickAdding(true);
    try {
      // 1. Compress and Upload Image
      const compressedBlob = await compressImage(qaImage, 1200, 0.8);
      const compressedFile = new File([compressedBlob], qaImage.name, { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', compressedFile);

      const upRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '' },
        body: formData,
      });
      const upData = await upRes.json();
      if (!upRes.ok || !upData.url) throw new Error(upData.error || 'Upload failed');
      
      // 2. Save Product
      const catOpt = categoryOptions.find(c => c.value === qaCategory) || categoryOptions[0];
      const payload = {
        name: qaName.trim(),
        slug: slugify(qaName.trim()),
        shelf: catOpt.shelf,
        category: catOpt.category,
        price_inr: Number(qaPrice),
        status: 'active',
        image_url: upData.url,
        images: [upData.url],
        stock: 10,
        options: []
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || ''
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(prev => [data.product, ...prev]);
        setShowQuickAdd(false);
        setQaName('');
        setQaImage(null);
        setQaPreview(null);
        showToast(`Product "${data.product.name}" added instantly.`);
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (err: any) {
      alert(err.message || 'Quick add failed');
    } finally {
      setIsQuickAdding(false);
    }
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Products
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products', {
        headers: {
          'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '',
        },
      });
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.warn('Error fetching admin products:', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '',
        },
      });
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.warn('Error fetching admin orders:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Update Order Status handler
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order #${orderId.slice(0, 8)} status updated to ${newStatus.toUpperCase()}`);
        
        // Auto-open WhatsApp notification
        const order = orders.find(o => o.id === orderId);
        if (order && order.customer?.phone) {
          openWhatsAppOrderStatus(order.customer.phone, order.id, newStatus, order.customer.name || 'Customer');
        }
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (e) {
      console.error('Error changing order status:', e);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the inventory?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '',
        },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Product "${name}" deleted successfully.`);
      }
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLockConsole = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('levelx3d_admin_unlocked');
    }
    window.location.reload();
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_inr || 0), 0);
  const totalPrinting = orders.filter((o) => o.status === 'printing').length;
  const totalPending = orders.filter((o) => o.status === 'pending').length;
  const activeProductsCount = products.filter((p) => p.status === 'active').length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.shelf.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStatus =
      productStatusFilter === 'all' || p.status === productStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus =
      orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-onyx selection:text-chalk">
      {/* Top Console Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-hairline-light bg-canvas/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-heading text-xl sm:text-2xl font-light tracking-apple-wide uppercase text-ink">
                Level X 3D
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-onyx text-chalk">
                Admin Console
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate hover:text-ink transition-colors"
            >
              <span>View Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLockConsole}
              className="py-2 px-3.5 rounded-xl border border-hairline-light hover:border-red-300 hover:text-red-600 bg-white text-xs font-sans text-slate transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Revenue */}
          <div className="p-6 rounded-3xl border border-hairline-light bg-[#ECE9E2]/40 space-y-2">
            <div className="flex items-center justify-between text-slate">
              <span className="text-xs font-mono uppercase tracking-wider">Gross Commission Volume</span>
              <DollarSign className="w-4 h-4 stroke-[1.4]" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-light tracking-apple-wide text-ink">
              {formatPrice(totalRevenue)}
            </div>
            <span className="text-[11px] font-sans text-slate block">
              Cumulative orders recorded
            </span>
          </div>

          {/* Card 2: Orders Total */}
          <div className="p-6 rounded-3xl border border-hairline-light bg-[#ECE9E2]/40 space-y-2">
            <div className="flex items-center justify-between text-slate">
              <span className="text-xs font-mono uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 stroke-[1.4]" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-light tracking-apple-wide text-ink">
              {orders.length}
            </div>
            <span className="text-[11px] font-sans text-slate block">
              {totalPending} orders awaiting payment
            </span>
          </div>

          {/* Card 3: In Production / Printing */}
          <div className="p-6 rounded-3xl border border-hairline-light bg-[#ECE9E2]/40 space-y-2">
            <div className="flex items-center justify-between text-slate">
              <span className="text-xs font-mono uppercase tracking-wider">In SLA Production</span>
              <Printer className="w-4 h-4 stroke-[1.4]" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-light tracking-apple-wide text-ink">
              {totalPrinting}
            </div>
            <span className="text-[11px] font-sans text-slate block">
              Status set to Printing / SLA
            </span>
          </div>

          {/* Card 4: Catalog Products */}
          <div className="p-6 rounded-3xl border border-hairline-light bg-[#ECE9E2]/40 space-y-2">
            <div className="flex items-center justify-between text-slate">
              <span className="text-xs font-mono uppercase tracking-wider">Catalog Inventory</span>
              <Layers className="w-4 h-4 stroke-[1.4]" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-light tracking-apple-wide text-ink">
              {activeProductsCount}
            </div>
            <span className="text-[11px] font-sans text-slate block">
              {products.length} total across 18 shelves &bull; {stockNotifications.length} restock requests
            </span>
            <span className="text-[11px] font-sans text-slate block mt-1">
              {newsletterSubscribers.length} newsletter subscribers
            </span>
          </div>
        </div>

        {/* Console Mode Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-light pb-4">
          <div className="flex items-center gap-2 p-1 bg-[#ECE9E2]/60 rounded-2xl border border-hairline-light">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2.5 px-6 rounded-xl text-xs font-heading font-light tracking-apple-wide uppercase transition-all ${
                activeTab === 'products'
                  ? 'bg-onyx text-chalk shadow-sm'
                  : 'text-slate hover:text-ink'
              }`}
            >
              Products Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 px-6 rounded-xl text-xs font-heading font-light tracking-apple-wide uppercase transition-all ${
                activeTab === 'orders'
                  ? 'bg-onyx text-chalk shadow-sm'
                  : 'text-slate hover:text-ink'
              }`}
            >
              Orders Ledger ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`py-2.5 px-6 rounded-xl text-xs font-heading font-light tracking-apple-wide uppercase transition-all ${
                activeTab === 'returns'
                  ? 'bg-onyx text-chalk shadow-sm'
                  : 'text-slate hover:text-ink'
              }`}
            >
              Returns
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2.5 px-6 rounded-xl text-xs font-heading font-light tracking-apple-wide uppercase transition-all ${
                activeTab === 'analytics'
                  ? 'bg-onyx text-chalk shadow-sm'
                  : 'text-slate hover:text-ink'
              }`}
            >
              Analytics
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'products' ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQuickAdd(!showQuickAdd)}
                  className="py-3 px-5 rounded-xl border border-hairline-light hover:bg-slate-50 text-ink text-xs font-heading font-light tracking-apple-wide uppercase transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Quick Add</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsModalOpen(true);
                  }}
                  className="py-3 px-5 rounded-xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-apple-wide uppercase shadow-sm transition-all flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Full Builder</span>
                </button>
              </div>
            ) : (
              <button
                onClick={fetchOrders}
                disabled={isLoadingOrders}
                className="py-3 px-4 rounded-xl border border-hairline-light hover:border-ink bg-white text-xs font-mono text-slate hover:text-ink transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh Ledger</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: PRODUCTS INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Quick Add Form Inline */}
            <AnimatePresence>
              {showQuickAdd && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleQuickAdd} className="p-5 bg-white border border-hairline-light rounded-2xl flex flex-col sm:flex-row gap-4 items-end shadow-sm">
                    <div className="flex-1 min-w-[150px]">
                      <label className="text-[10px] font-mono uppercase text-slate tracking-wider block mb-1">Name</label>
                      <input required type="text" value={qaName} onChange={(e) => setQaName(e.target.value)} placeholder="Product Name" className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                    <div className="w-28">
                      <label className="text-[10px] font-mono uppercase text-slate tracking-wider block mb-1">Price (₹)</label>
                      <input required type="number" min="0" step="100" value={qaPrice} onChange={(e) => setQaPrice(Number(e.target.value))} className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-lg px-3 py-2 text-sm font-mono outline-none" />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="text-[10px] font-mono uppercase text-slate tracking-wider block mb-1">Category</label>
                      <select value={qaCategory} onChange={(e) => setQaCategory(e.target.value)} className="w-full bg-canvas border border-hairline-light focus:border-ink rounded-lg px-3 py-2 text-sm outline-none">
                        {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div className="w-32">
                      <label className="text-[10px] font-mono uppercase text-slate tracking-wider block mb-1">Image</label>
                      <div className="relative">
                        <input required type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setQaImage(file);
                            setQaPreview(URL.createObjectURL(file));
                          }
                        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="h-[38px] w-full bg-canvas border border-hairline-light rounded-lg flex items-center justify-center text-xs text-slate overflow-hidden relative">
                          {qaPreview ? <Image src={qaPreview} alt="Preview" fill className="object-cover" /> : 'Choose Image'}
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={isQuickAdding} className="py-2.5 px-5 rounded-lg bg-onyx hover:bg-ink text-chalk text-sm font-medium transition-colors disabled:opacity-50 h-[38px] flex items-center justify-center min-w-[100px]">
                      {isQuickAdding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title, category, shelf..."
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate">Status:</span>
                <select
                  value={productStatusFilter}
                  onChange={(e) => setProductStatusFilter(e.target.value)}
                  className="bg-white border border-hairline-light rounded-xl px-3 py-2 text-xs font-mono text-ink outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="draft">Drafts Only</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Products Table (Desktop Focused) */}
            <div className="border border-hairline-light rounded-3xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-hairline-light bg-[#ECE9E2]/30 text-slate font-mono uppercase text-[11px]">
                      <th className="py-4 px-6 font-medium">Piece</th>
                      <th className="py-4 px-6 font-medium">Classification</th>
                      <th className="py-4 px-6 font-medium">Price (INR)</th>
                      <th className="py-4 px-6 font-medium">Stock</th>
                      <th className="py-4 px-6 font-medium">Attributes</th>
                      <th className="py-4 px-6 font-medium">Status</th>
                      <th className="py-4 px-6 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light/60">
                    {isLoadingProducts ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate font-mono">
                          <div className="w-6 h-6 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-2" />
                          <span>Querying Supabase Products Catalog...</span>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate font-sans">
                          No products matched your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          {/* Image & Title */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3.5">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#ECE9E2] border border-hairline-light shrink-0">
                                <Image
                                  src={p.image_url}
                                  alt={p.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <span className="font-heading text-sm font-light tracking-wide text-ink truncate block">
                                  {p.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate block truncate max-w-[200px]">
                                  /{p.slug}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Shelf & Category */}
                          <td className="py-4 px-6">
                            <span className="font-medium text-ink block">{p.category}</span>
                            <span className="text-[10px] font-mono text-slate block">
                              {p.shelf}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-6 font-mono font-medium text-ink">
                            {formatPrice(p.price_inr)}
                            {p.compare_at_price_inr && (
                              <span className="block text-[10px] text-slate line-through">
                                {formatPrice(p.compare_at_price_inr)}
                              </span>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="py-4 px-6 font-mono text-slate">
                            {p.stock > 0 ? (
                              <span className={p.stock <= 3 ? "text-red-500 font-bold" : "text-ink"}>{p.stock} units</span>
                            ) : (
                              <span className="text-red-500 font-medium">Sold Out</span>
                            )}
                          </td>

                          {/* Attributes */}
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1">
                              {p.is_premium && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-onyx text-chalk">
                                  Signature
                                </span>
                              )}
                              {p.is_customizable && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-canvas border border-hairline-light text-slate">
                                  Customizable
                                </span>
                              )}
                              {p.options && p.options.length > 0 && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 text-slate">
                                  {p.options.length} options
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6">
                            {p.status === 'active' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                                Active
                              </span>
                            )}
                            {p.status === 'draft' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-200">
                                Draft
                              </span>
                            )}
                            {p.status === 'archived' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                Archived
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 rounded-lg border border-hairline-light hover:border-ink hover:bg-slate-50 text-slate hover:text-ink transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 rounded-lg border border-hairline-light hover:border-red-300 hover:text-red-600 hover:bg-red-50/50 text-slate transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS LEDGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order ID, customer name, email..."
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-hairline-light rounded-xl px-3 py-2 text-xs font-mono text-ink outline-none cursor-pointer"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="printing">Printing (SLA)</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="border border-hairline-light rounded-3xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-hairline-light bg-[#ECE9E2]/30 text-slate font-mono uppercase text-[11px]">
                      <th className="py-4 px-6 font-medium">Order ID & Date</th>
                      <th className="py-4 px-6 font-medium">Customer & Destination</th>
                      <th className="py-4 px-6 font-medium">Commissioned Objects</th>
                      <th className="py-4 px-6 font-medium">Total (INR)</th>
                      <th className="py-4 px-6 font-medium">Production Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light/60">
                    {isLoadingOrders ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-slate font-mono">
                          <div className="w-6 h-6 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-2" />
                          <span>Loading Supabase Orders Ledger...</span>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-slate font-sans">
                          No orders found matching the filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const dateFormatted = new Date(o.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                            {/* Order ID & Date */}
                            <td className="py-4 px-6 align-top">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-semibold text-ink text-xs">
                                  #{o.id.slice(0, 8)}
                                </span>
                                <button
                                  onClick={() => handleCopy(o.id)}
                                  className="p-1 text-slate hover:text-ink transition-colors"
                                  title="Copy full UUID"
                                >
                                  {copiedId === o.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                              <span className="text-[10px] font-mono text-slate block mt-1">
                                {dateFormatted}
                              </span>
                            </td>

                            {/* Customer Details */}
                            <td className="py-4 px-6 align-top">
                              <span className="font-medium text-ink block">
                                {o.customer?.name || 'Studio Collector'}
                              </span>
                              <span className="text-[11px] font-mono text-slate block">
                                {o.customer?.email}
                              </span>
                              <span className="text-[10px] font-sans text-slate block mt-0.5">
                                {o.customer?.city}, {o.customer?.state} &bull; {o.customer?.pincode}
                              </span>
                              {o.customer?.phone && (
                                <span className="text-[10px] font-mono text-slate block">
                                  Tel: +91 {o.customer.phone}
                                </span>
                              )}
                            </td>

                            {/* Line items */}
                            <td className="py-4 px-6 align-top">
                              <div className="space-y-2 max-w-sm">
                                {(o.items || []).map((item, idx) => (
                                  <div key={item.id || idx} className="text-xs">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-heading font-light tracking-wide text-ink">
                                        {item.product_name}
                                      </span>
                                      <span className="font-mono text-[10px] text-slate">
                                        &times;{item.qty}
                                      </span>
                                    </div>
                                    {item.options_json &&
                                      typeof item.options_json === 'object' &&
                                      Object.keys(item.options_json).length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-0.5">
                                          {Object.entries(item.options_json).map(([k, v]) => (
                                            <span
                                              key={k}
                                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-canvas border border-hairline-light text-slate"
                                            >
                                              {k}: {String(v)}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Total in INR */}
                            <td className="py-4 px-6 align-top font-mono">
                              <span className="font-semibold text-sm text-ink block">
                                {formatPrice(o.total_inr)}
                              </span>
                              <span className="text-[10px] text-slate block">
                                Subtotal: {formatPrice(o.subtotal_inr)}
                              </span>
                            </td>

                            {/* Status Dropdown with Live Updater */}
                            <td className="py-4 px-6 align-top">
                              <div className="space-y-1.5">
                                <div className="relative inline-block w-40">
                                  <select
                                    disabled={updatingOrderId === o.id}
                                    value={o.status}
                                    onChange={(e) =>
                                      handleStatusChange(o.id, e.target.value as OrderStatus)
                                    }
                                    className={`w-full py-1.5 pl-3 pr-8 rounded-xl text-[11px] font-mono uppercase font-semibold border appearance-none outline-none cursor-pointer transition-colors ${
                                      o.status === 'paid'
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                        : o.status === 'printing'
                                        ? 'bg-onyx text-chalk border-onyx'
                                        : o.status === 'shipped'
                                        ? 'bg-blue-50 text-blue-900 border-blue-300'
                                        : o.status === 'delivered'
                                        ? 'bg-teal-50 text-teal-900 border-teal-300'
                                        : o.status === 'cancelled'
                                        ? 'bg-red-50 text-red-900 border-red-300'
                                        : 'bg-amber-50 text-amber-900 border-amber-300'
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="printing">Printing (SLA)</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                                </div>

                                {updatingOrderId === o.id && (
                                  <span className="text-[10px] font-mono text-slate flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 border border-slate border-t-transparent rounded-full animate-spin" />
                                    Updating...
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* TAB 3: RETURNS */}
        {activeTab === 'returns' && (
          <div className="space-y-6">
            <div className="border border-hairline-light rounded-3xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-hairline-light bg-[#ECE9E2]/30 text-slate font-mono uppercase text-[11px]">
                      <th className="py-4 px-6 font-medium">Order ID</th>
                      <th className="py-4 px-6 font-medium">Customer Email</th>
                      <th className="py-4 px-6 font-medium">Reason</th>
                      <th className="py-4 px-6 font-medium">Date Requested</th>
                      <th className="py-4 px-6 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light/60">
                    {returnRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-slate font-sans">No return requests found.</td>
                      </tr>
                    ) : (
                      returnRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-mono text-ink">#{req.orderId.slice(0, 8)}</td>
                          <td className="py-4 px-6 font-sans text-ink">{req.email}</td>
                          <td className="py-4 px-6 font-sans text-slate">{req.reason}</td>
                          <td className="py-4 px-6 font-mono text-slate">{new Date(req.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6">
                            <select
                              value={req.status}
                              onChange={(e) => {
                                const updated = returnRequests.map(r => r.id === req.id ? { ...r, status: e.target.value } : r);
                                setReturnRequests(updated);
                                localStorage.setItem('levelx3d_return_requests', JSON.stringify(updated));
                              }}
                              className="bg-white border border-hairline-light rounded-lg px-2 py-1 outline-none font-mono text-[10px] uppercase"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Refund Initiated">Refund Initiated</option>
                              <option value="Refunded">Completed</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && analyticsSummary && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl border border-hairline-light bg-white">
                <div className="text-xs font-mono uppercase text-slate mb-2">Total Page Views</div>
                <div className="text-3xl font-heading text-ink">{analyticsSummary.totalPageViews}</div>
              </div>
              <div className="p-6 rounded-3xl border border-hairline-light bg-white">
                <div className="text-xs font-mono uppercase text-slate mb-2">Total Events</div>
                <div className="text-3xl font-heading text-ink">{analyticsSummary.totalEvents}</div>
              </div>
              <div className="p-6 rounded-3xl border border-hairline-light bg-white">
                <div className="text-xs font-mono uppercase text-slate mb-2">Conversion Rate</div>
                <div className="text-3xl font-heading text-ink">{analyticsSummary.conversionRate}%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl border border-hairline-light bg-white">
                <h3 className="text-sm font-heading tracking-wide uppercase text-ink mb-4">Conversion Funnel</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span>Page Views</span>
                    <span>{analyticsSummary.funnel.views}</span>
                  </div>
                  <div className="w-full bg-[#ECE9E2] h-2 rounded-full overflow-hidden">
                    <div className="bg-slate h-full" style={{ width: '100%' }} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span>Add to Cart</span>
                    <span>{analyticsSummary.funnel.cart}</span>
                  </div>
                  <div className="w-full bg-[#ECE9E2] h-2 rounded-full overflow-hidden">
                    <div className="bg-slate h-full" style={{ width: `${analyticsSummary.funnel.views ? (analyticsSummary.funnel.cart / analyticsSummary.funnel.views) * 100 : 0}%` }} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span>Begin Checkout</span>
                    <span>{analyticsSummary.funnel.checkout}</span>
                  </div>
                  <div className="w-full bg-[#ECE9E2] h-2 rounded-full overflow-hidden">
                    <div className="bg-slate h-full" style={{ width: `${analyticsSummary.funnel.views ? (analyticsSummary.funnel.checkout / analyticsSummary.funnel.views) * 100 : 0}%` }} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span>Purchases</span>
                    <span>{analyticsSummary.funnel.purchase}</span>
                  </div>
                  <div className="w-full bg-[#ECE9E2] h-2 rounded-full overflow-hidden">
                    <div className="bg-ink h-full" style={{ width: `${analyticsSummary.funnel.views ? (analyticsSummary.funnel.purchase / analyticsSummary.funnel.views) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-3xl border border-hairline-light bg-white">
                <h3 className="text-sm font-heading tracking-wide uppercase text-ink mb-4">Top Pages</h3>
                <div className="space-y-3 font-mono text-xs">
                  {analyticsSummary.topPages.map((page: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 hover:bg-canvas rounded-lg">
                      <span className="truncate max-w-[200px]">{page.path}</span>
                      <span>{page.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Creation / Editing Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSaved={(savedProduct) => {
          showToast(`Product "${savedProduct.name}" saved successfully.`);
          fetchProducts();
        }}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 py-3 px-5 rounded-2xl bg-onyx text-chalk text-xs font-mono shadow-2xl flex items-center gap-2.5 border border-hairline-dark"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
