import type { Metadata } from 'next';
import './globals.css';
import { SmoothScroll } from '@/components/layout/smooth-scroll';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/ecommerce/cart-drawer';

export const metadata: Metadata = {
  title: 'Level X 3D — Next-Gen 3D E-Commerce Platform',
  description:
    'Aerospace-grade 3D printed artifacts, biometric wearables, and futuristic kinetic sculptures with realtime 360° WebGL preview.',
  keywords: [
    '3D Printing',
    'Three.js',
    'Next.js E-Commerce',
    'WebGL 3D Models',
    'Futuristic Desk Art',
    'Level X 3D',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#05070c] text-slate-100 antialiased selection:bg-cyan selection:text-slate-950 font-sans">
        <SmoothScroll>
          <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
