import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OrdersView } from '@/components/account/orders-view';

export const metadata: Metadata = {
  title: 'Order History & Commissions | Level X 3D',
  description: 'View your commissioned 3D printed objects, live statuses, and archival invoices.',
};

export default function AccountOrdersPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-onyx selection:text-chalk">
      <Header theme="light" />

      <main className="flex-1">
        <OrdersView />
      </main>

      <Footer />
    </div>
  );
}
