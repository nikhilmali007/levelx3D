import { Suspense } from 'react';
import { Metadata } from 'next';
import { AdminGate } from '@/components/admin/admin-gate';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const metadata: Metadata = {
  title: 'Executive Studio Console | Level X 3D Admin',
  description: 'Manage 3D printed artifacts, inventory catalog, customer orders, and SLA production statuses.',
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
        </div>
      }
    >
      <AdminGate>
        <AdminDashboard />
      </AdminGate>
    </Suspense>
  );
}
