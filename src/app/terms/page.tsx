import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Header theme="light" />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 prose">
        <h1 className="font-heading uppercase tracking-apple-wide text-4xl mb-6">Terms of Service</h1>
        <p>Welcome to Level X 3D. By accessing our website, you agree to these terms.</p>
        <h2>Intellectual Property</h2>
        <p>All designs and 3D models are the property of Level X 3D.</p>
        <h2>Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials for personal viewing.</p>
      </main>
      <Footer />
    </div>
  );
}
