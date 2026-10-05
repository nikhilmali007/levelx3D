import type { Metadata } from 'next';
import { Jost, Inter } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/layout/smooth-scroll';
import { CartDrawer } from '@/components/ecommerce/cart-drawer';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-jost',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Level X 3D — Apple-Grade Minimalist 3D E-Commerce',
  description:
    'Calm, architectural 3D printed artifacts. Sintered laser nylon, micro-stereolithography, and bespoke physical-digital geometries.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

import { AuthProvider } from '@/context/auth-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-canvas text-ink antialiased selection:bg-onyx selection:text-chalk font-sans">
        <AuthProvider>
          <SmoothScroll>
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">
              <main className="flex-1">{children}</main>
              <CartDrawer />
            </div>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
