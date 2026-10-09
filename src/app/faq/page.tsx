import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'FAQ / Help Center — Level X 3D',
  description: 'Frequently asked questions about Level X 3D printing process, orders, and shipping.',
};

const faqs = [
  {
    category: 'Shipping & Delivery',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express takes 2-3 business days. Remote areas may take longer.' },
      { q: 'Do you ship internationally?', a: 'Currently, we only ship across India.' }
    ]
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for defective or damaged items.' },
      { q: 'How do I request a refund?', a: 'Use the "Returns" link in the footer to submit a request with your order ID.' }
    ]
  },
  {
    category: 'Payment Methods',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, and Netbanking via Razorpay.' }
    ]
  },
  {
    category: '3D Printing Process',
    items: [
      { q: 'What materials do you use?', a: 'We use high-grade photopolymers, sintered nylon, and PLA depending on the product specifications.' },
      { q: 'How precise are the prints?', a: 'Our Micro-SLA machines can achieve up to 12-micron layer height precision.' }
    ]
  },
  {
    category: 'Custom Orders',
    items: [
      { q: 'Do you take custom commissions?', a: 'Yes! Contact us via WhatsApp to discuss your custom 3D printing requirements.' }
    ]
  },
  {
    category: 'Care Instructions',
    items: [
      { q: 'How should I clean my 3D printed objects?', a: 'Use a soft dry cloth. Avoid direct harsh sunlight and abrasive cleaners.' }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <h1 className="font-heading text-4xl font-light tracking-apple-wide uppercase mb-12 text-center">
          FAQ & Help Center
        </h1>
        
        <div className="space-y-12">
          {faqs.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="font-heading text-2xl tracking-wide uppercase border-b border-hairline-light pb-2">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <details key={i} className="group border border-hairline-light rounded-xl bg-[#ECE9E2]/50 cursor-pointer">
                    <summary className="p-4 font-medium font-heading list-none flex justify-between items-center text-lg">
                      {item.q}
                      <span className="text-slate group-open:rotate-180 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </summary>
                    <div className="p-4 pt-0 text-slate font-sans leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
