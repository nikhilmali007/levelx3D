import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 prose">
        <h1 className="font-heading uppercase tracking-apple-wide text-4xl mb-6">Refund Policy</h1>
        <p>Our refund policy lasts 7 days.</p>
        <h2>Returns</h2>
        <p>To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
        <h2>Refunds</h2>
        <p>Once received and inspected, we will notify you of the approval or rejection of your refund.</p>
      </main>
      <Footer />
    </div>
  );
}
