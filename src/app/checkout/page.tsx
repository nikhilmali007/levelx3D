import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckoutView } from '@/components/ecommerce/checkout-view';

export const metadata: Metadata = {
  title: 'Checkout & Dispatch — Level X 3D',
  description: 'Provide delivery details and authorize your architectural 3D printed piece.',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />

      <main className="flex-1">
        <CheckoutView />
      </main>

      <Footer />
    </div>
  );
}
