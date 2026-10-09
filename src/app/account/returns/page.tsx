'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Package, CornerDownLeft, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { QuietButton } from '@/components/ui/quiet-button';

interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function ReturnsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'eligible' | 'requests'>('eligible');
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [eligibleOrders, setEligibleOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const [reason, setReason] = useState('Defective/Damaged');
  const [description, setDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      // Mock loading eligible orders (status = 'delivered', within 7 days)
      // In real app, we would fetch from Supabase
      setEligibleOrders([]);
      
      const saved = localStorage.getItem('levelx3d_return_requests');
      if (saved) {
        setReturnRequests(JSON.parse(saved));
      }
    }
    setIsLoading(false);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !user?.email) return;

    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder,
          reason,
          description,
          email: user.email
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        const newRequests = [data.returnRequest, ...returnRequests];
        setReturnRequests(newRequests);
        localStorage.setItem('levelx3d_return_requests', JSON.stringify(newRequests));
        
        setSelectedOrder(null);
        setReason('Defective/Damaged');
        setDescription('');
        setActiveTab('requests');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error submitting request');
    }
  };

  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-light mb-4">Returns & Refunds</h1>
        <p className="text-slate mb-6 text-sm">Please sign in to view your eligible returns.</p>
        <Link href="/login?redirect=/account/returns">
          <QuietButton>Sign In</QuietButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-20 font-sans space-y-8">
      <div className="border-b border-hairline-light pb-4">
        <h1 className="font-heading text-2xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase">
          Returns & Refunds
        </h1>
        <p className="text-sm text-slate mt-2">
          Manage your return requests for delivered artifacts.
        </p>
      </div>

      <div className="flex gap-4 border-b border-hairline-light pb-4">
        <button
          onClick={() => setActiveTab('eligible')}
          className={`text-xs font-heading font-medium tracking-wide uppercase px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'eligible' ? 'bg-onyx text-chalk' : 'bg-canvas hover:bg-[#ECE9E2]'
          }`}
        >
          Eligible Orders
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`text-xs font-heading font-medium tracking-wide uppercase px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'requests' ? 'bg-onyx text-chalk' : 'bg-canvas hover:bg-[#ECE9E2]'
          }`}
        >
          Past Requests ({returnRequests.length})
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">Loading...</div>
      ) : activeTab === 'eligible' ? (
        <div className="space-y-6">
          {selectedOrder ? (
            <div className="p-6 border border-hairline-light rounded-2xl bg-white space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-light tracking-wide">Request Return for #{selectedOrder.slice(0, 8)}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-xs text-slate hover:text-ink underline">Cancel</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate tracking-wider block">Reason</label>
                  <select 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-canvas border border-hairline-light rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    <option>Defective/Damaged</option>
                    <option>Wrong Item</option>
                    <option>Not as Described</option>
                    <option>Changed Mind</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate tracking-wider block">Description (Optional)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-canvas border border-hairline-light rounded-xl px-4 py-3 text-sm outline-none"
                    placeholder="Provide details about the issue..."
                  />
                </div>
                
                <button type="submit" className="px-6 py-3 bg-onyx text-chalk rounded-xl text-xs font-heading font-light tracking-wide uppercase hover:bg-ink transition-colors">
                  Submit Request
                </button>
              </form>
            </div>
          ) : eligibleOrders.length === 0 ? (
            <div className="text-center py-16 border border-hairline-light border-dashed rounded-2xl text-slate text-sm">
              <Package className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>You have no recently delivered orders eligible for return.</p>
              <p className="text-xs mt-1">Returns are accepted within 7 days of delivery.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {eligibleOrders.map((order) => (
                <div key={order.id} className="p-4 border border-hairline-light rounded-2xl bg-white flex justify-between items-center">
                  <div>
                    <span className="font-mono text-sm font-semibold">#{order.id.slice(0, 8)}</span>
                    <span className="text-xs text-slate block mt-1">Delivered {new Date(order.deliveredAt).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order.id)}
                    className="px-4 py-2 bg-canvas border border-hairline-light rounded-lg text-xs font-medium hover:bg-[#ECE9E2] transition-colors"
                  >
                    Request Return
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {returnRequests.length === 0 ? (
            <div className="text-center py-16 border border-hairline-light border-dashed rounded-2xl text-slate text-sm">
              <CornerDownLeft className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No past return requests found.</p>
            </div>
          ) : (
            returnRequests.map((req) => (
              <div key={req.id} className="p-5 border border-hairline-light rounded-2xl bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-ink">Order #{req.orderId.slice(0, 8)}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                      req.status === 'Approved' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                      req.status === 'Refunded' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
                      'bg-red-100 text-red-900 border-red-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate space-y-1">
                    <p><strong className="font-medium text-ink">Reason:</strong> {req.reason}</p>
                    <p>Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
