import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { QuietButton } from '@/components/ui/quiet-button';

export const metadata = {
  title: '404 — Specimen Not Found | Level X 3D',
  description: 'The architectural 3D artifact you are looking for does not exist in our ledger.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-onyx selection:text-chalk font-sans">
      <Header theme="light" />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-8">
        <div className="max-w-xl mx-auto text-center space-y-8">
          {/* Subtle architectural wireframe accent */}
          <div className="w-20 h-20 mx-auto rounded-3xl border border-hairline-dark/20 flex items-center justify-center bg-[#ECE9E2]/60 shadow-xs">
            <span className="font-heading text-3xl font-light text-ink tracking-widest">
              404
            </span>
          </div>

          <div className="space-y-3">
            <span className="font-heading text-xs tracking-apple-widest uppercase text-slate font-light block">
              Physical-Digital Void &bull; Index Empty
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-ink uppercase">
              Object Not In Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed">
              The architectural specimen or archive coordinates you sought have dissolved into space or have not yet been sintered in physical form.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/shop">
              <QuietButton variant="light">
                Explore The Collection &rarr;
              </QuietButton>
            </Link>
            <Link
              href="/"
              className="text-xs font-mono uppercase text-slate hover:text-ink transition-colors py-2 tracking-wider"
            >
              Return to Studio Origin
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
