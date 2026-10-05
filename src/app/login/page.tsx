import { Suspense } from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoginView } from '@/components/auth/login-view';

export const metadata: Metadata = {
  title: 'Sign In | Collector Portal | Level X 3D',
  description: 'Sign in or create your Level X 3D collector account to access bespoke 3D print commissions and track orders.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-onyx selection:text-chalk">
      <Header theme="light" />

      <main className="flex-1 flex items-center justify-center py-6 sm:py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto px-4 py-20 text-center">
              <div className="w-8 h-8 border border-hairline-dark/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
              <span className="font-mono text-xs text-slate uppercase tracking-wider">
                Loading Portal...
              </span>
            </div>
          }
        >
          <LoginView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
