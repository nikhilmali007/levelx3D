'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Send, Check, Heart, Shield, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="border-t border-white/10 bg-slate-950/90 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan/20 border border-cyan flex items-center justify-center">
                <Box className="w-4 h-4 text-cyan" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                LEVEL <span className="text-cyan">X</span> 3D
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pioneering next-generation physical-digital artifacts. Designed parametrically, rendered in WebGL, manufactured with aerospace micro-SLA and metal sintering.
            </p>
            <div className="text-[11px] font-mono text-cyan flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Next.js 14 App Router &bull; Lenis &bull; Supabase</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="#products" className="hover:text-cyan transition-colors">
                  Desk Sculptures & Artifacts
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-cyan transition-colors">
                  Biometric Cyber Wearables
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-cyan transition-colors">
                  Kinetic Perpetual Timepieces
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-cyan transition-colors">
                  Modular Mechanical Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & Architecture */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-slate-300">Three.js WebGL Engine</span>
              </li>
              <li>
                <span className="text-slate-300">Tailwind CSS + shadcn/ui</span>
              </li>
              <li>
                <span className="text-slate-300">Lenis Smooth Momentum</span>
              </li>
              <li>
                <span className="text-slate-300">Framer Motion Transitions</span>
              </li>
              <li>
                <span className="text-slate-300">Supabase JS Client Integration</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Drops */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-2">
              Exclusive 3D Drops
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe for early access to limited edition 3D printed runs and CAD design files.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs h-10"
                />
                <Button type="submit" size="sm" className="h-10 px-3 shrink-0">
                  {subscribed ? <Check className="w-4 h-4 text-slate-950" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-cyan font-mono">
                  ✓ Subscribed! Welcome to Level X.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Level X 3D Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="#terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <a
              href="https://github.com/nikhilmali007/levelx3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline font-mono"
            >
              github.com/nikhilmali007/levelx3D
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
