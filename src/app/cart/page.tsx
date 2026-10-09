import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartPageView } from '@/components/ecommerce/cart-page-view';
import { RecentlyViewed } from '@/components/ecommerce/recently-viewed';

export const metadata: Metadata = {
  title: 'Archival Bag — Level X 3D',
  description: 'Review your selected 3D printed architectural artifacts and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />

      <main className="flex-1">
        <CartPageView />
        <RecentlyViewed />
      </main>

      <Footer />
    </div>
  );
}
