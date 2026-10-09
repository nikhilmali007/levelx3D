import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 prose">
        <h1 className="font-heading uppercase tracking-apple-wide text-4xl mb-6">Privacy Policy</h1>
        <p>Your privacy is important to us.</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide during checkout, such as name, email, and shipping address.</p>
        <h2>How We Use It</h2>
        <p>We use your information to fulfill orders and communicate with you.</p>
      </main>
      <Footer />
    </div>
  );
}
