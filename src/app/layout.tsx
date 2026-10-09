import type { Metadata, Viewport } from 'next';
import { Jost, Inter } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/layout/smooth-scroll';
import { CartDrawer } from '@/components/ecommerce/cart-drawer';
import { AuthProvider } from '@/context/auth-context';
import { BackToTop } from '@/components/ui/back-to-top';
import { CookieConsent } from '@/components/ui/cookie-consent';

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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3F1EC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0B0B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://levelx3d.com'),
  title: {
    default: 'Level X 3D — Apple-Grade Minimalist 3D E-Commerce',
    template: '%s | Level X 3D',
  },
  description:
    'Calm, architectural 3D printed artifacts. Sintered laser nylon, micro-stereolithography 25μm precision, and bespoke physical-digital geometries commissioned for architectural spaces.',
  keywords: [
    '3D Printing India',
    'Architectural 3D Decor',
    'Micro-SLA Precision',
    'Selective Laser Sintering SLS',
    'Designer Lamps',
    'Luxury 3D Handbags',
    'Lithophane Photo Art',
    'Custom 3D Studio',
    'Apple-grade 3D E-commerce',
    'Level X 3D',
  ],
  authors: [{ name: 'Level X 3D Atelier', url: 'https://levelx3d.com' }],
  creator: 'Level X 3D',
  publisher: 'Level X 3D',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://levelx3d.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://levelx3d.com',
    siteName: 'Level X 3D',
    title: 'Level X 3D — Apple-Grade Minimalist 3D E-Commerce',
    description:
      'Calm, architectural 3D printed artifacts. Sintered laser nylon, micro-stereolithography 25μm precision, and bespoke physical-digital geometries.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Level X 3D - Architectural 3D Printing Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Level X 3D — Apple-Grade Minimalist 3D E-Commerce',
    description:
      'Calm, architectural 3D printed artifacts. Sintered laser nylon, micro-stereolithography, and bespoke physical-digital geometries.',
    images: ['/opengraph-image'],
    creator: '@levelx3d',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Level X 3D',
  url: 'https://levelx3d.com',
  logo: 'https://levelx3d.com/logo-light.svg',
  description:
    'Calm, architectural 3D printed artifacts. Sintered laser nylon, micro-stereolithography, and bespoke physical-digital geometries.',
  sameAs: [
    'https://instagram.com/levelx3d',
    'https://github.com/nikhilmali007/levelx3D',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'collector@levelx3d.com',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi'],
  },
};

import { AnalyticsProvider } from '@/components/analytics/analytics-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-canvas text-ink antialiased selection:bg-onyx selection:text-chalk font-sans">
        {/* Skip to Main Content Link for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-onyx focus:text-chalk focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-chalk text-xs font-mono"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <AnalyticsProvider>
            <SmoothScroll>
              <div className="relative flex min-h-screen flex-col overflow-x-hidden">
                <main id="main-content" className="flex-1">
                  {children}
                </main>
                <CartDrawer />
                <BackToTop />
                <CookieConsent />
              </div>
            </SmoothScroll>
          </AnalyticsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
