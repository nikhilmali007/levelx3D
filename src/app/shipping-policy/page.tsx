import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 prose">
        <h1 className="font-heading uppercase tracking-apple-wide text-4xl mb-6">Shipping Policy</h1>
        <p>We process orders within 1-2 business days.</p>
        <h2>Shipping Times</h2>
        <p>Standard delivery takes 5-7 business days across India.</p>
        <h2>Shipping Rates</h2>
        <p>Calculated at checkout based on your zone and order value.</p>
      </main>
      <Footer />
    </div>
  );
}
