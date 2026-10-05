'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QuietButton } from '@/components/ui/quiet-button';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <footer className="w-full bg-onyx text-chalk border-t border-hairline-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-24">
        {/* Top: Logo & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-hairline-dark">
          {/* Logo & Philosophy */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative h-7 w-40">
              <Image
                src="/logo-dark.svg"
                alt="Level X 3D"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-slate max-w-sm leading-relaxed font-sans font-normal">
              An architectural exploration in physical-digital permanence. Manufactured on-demand with selective laser sintering and micro-stereolithography.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-7 flex flex-col justify-end">
            <span className="font-heading text-xs tracking-apple-wide font-light text-chalk mb-2 block">
              Archival Dispatch
            </span>
            <p className="text-xs text-slate mb-5 max-w-md">
              Receive quiet announcements on unreleased geometries and short-batch studio fabrications.
            </p>

            <form onSubmit={handleSubmit} className="flex max-w-md items-end gap-4 border-b border-hairline-dark pb-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for archival dispatch
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-xs text-chalk placeholder:text-slate/60 outline-none py-2 font-sans focus-visible:ring-1 focus-visible:ring-chalk/50 rounded"
              />
              <QuietButton variant="dark" size="sm" type="submit">
                {submitted ? 'Subscribed' : 'Join'}
              </QuietButton>
            </form>
          </div>
        </div>

        {/* Middle: Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-hairline-dark">
          <div>
            <h4 className="font-heading text-xs tracking-apple-widest font-light text-slate uppercase mb-3">
              Collections
            </h4>
            <ul className="space-y-1 text-xs font-sans text-chalk/80">
              <li>
                <Link href="/shop" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Kinetic Desk Art
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Sintered Nylon PA12
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Biometric Wearables
                </Link>
              </li>
              <li>
                <Link href="/shop/signature-premium" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Numbered Archives
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xs tracking-apple-widest font-light text-slate uppercase mb-3">
              Custom Studio
            </h4>
            <ul className="space-y-1 text-xs font-sans text-chalk/80">
              <li>
                <Link href="/#studio" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  CAD File Ingestion
                </Link>
              </li>
              <li>
                <Link href="/#studio" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Tolerance Standards
                </Link>
              </li>
              <li>
                <Link href="/#studio" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Vapor Smoothing
                </Link>
              </li>
              <li>
                <Link href="/#studio" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Bespoke Sizing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xs tracking-apple-widest font-light text-slate uppercase mb-3">
              Philosophy
            </h4>
            <ul className="space-y-1 text-xs font-sans text-chalk/80">
              <li>
                <Link href="/#about" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Materials Ethics
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Apple-Grade Craft
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Monochrome Code
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Recyclable Polymers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xs tracking-apple-widest font-light text-slate uppercase mb-3">
              Legal & Direct
            </h4>
            <ul className="space-y-1 text-xs font-sans text-chalk/80">
              <li>
                <Link href="/#terms" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Terms of Fabrication
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#shipping" className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1">
                  Worldwide Shipping
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nikhilmali007/levelx3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Level X 3D GitHub Source Code Repository"
                  className="hover:text-chalk transition-colors min-h-[44px] flex items-center py-1"
                >
                  GitHub Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: Payment Icons & Copyright */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate">
          <p className="font-sans">
            &copy; {new Date().getFullYear()} Level X 3D. Crafted with restraint.
          </p>

          {/* Monochrome Apple-Grade Payment Glyphs */}
          <div className="flex items-center gap-4 text-slate">
            {/* Apple Pay */}
            <div className="h-6 px-2.5 rounded border border-hairline-dark flex items-center justify-center font-sans text-[10px] tracking-wide text-chalk/80">
              Pay
            </div>
            {/* Visa */}
            <div className="h-6 px-2.5 rounded border border-hairline-dark flex items-center justify-center font-heading text-[10px] tracking-widest text-chalk/80">
              VISA
            </div>
            {/* Mastercard */}
            <div className="h-6 px-2.5 rounded border border-hairline-dark flex items-center justify-center font-sans text-[10px] text-chalk/80">
              MC
            </div>
            {/* Amex */}
            <div className="h-6 px-2.5 rounded border border-hairline-dark flex items-center justify-center font-sans text-[10px] text-chalk/80">
              AMEX
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
