'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Box, Database, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function Navbar() {
  const { totalItems, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/75 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan to-pink-500 p-0.5 shadow-[0_0_15px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_25px_rgba(0,242,254,0.6)] transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-cyan group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-extrabold text-xl tracking-tight text-white">
              <span>LEVEL</span>
              <span className="bg-gradient-to-r from-cyan to-pink-500 bg-clip-text text-transparent">
                X
              </span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/10 text-cyan border border-cyan/30">
                3D
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              Next-Gen 3D E-Commerce
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#products" className="hover:text-cyan transition-colors">
            Artifacts
          </Link>
          <Link href="#studio" className="hover:text-cyan transition-colors">
            3D Studio
          </Link>
          <Link href="#specs" className="hover:text-cyan transition-colors">
            Materials & Tech
          </Link>
          <a
            href="https://github.com/nikhilmali007/levelx3D"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan transition-colors text-xs font-mono text-slate-400"
          >
            GitHub
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <div
            title={
              isSupabaseConfigured
                ? 'Supabase backend connected'
                : 'Running on local demo catalog. Add Supabase keys to .env.local to link live database'
            }
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              isSupabaseConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Supabase Demo'}</span>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 p-2.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-white/15 hover:border-cyan text-white hover:text-cyan transition-all shadow-lg active:scale-95"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan text-slate-950 font-mono text-[11px] font-extrabold flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.6)]">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-white/10 px-4 py-6 space-y-4">
          <Link
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan text-sm font-medium"
          >
            Artifacts
          </Link>
          <Link
            href="#studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan text-sm font-medium"
          >
            3D Studio
          </Link>
          <Link
            href="#specs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan text-sm font-medium"
          >
            Materials & Tech
          </Link>
          <a
            href="https://github.com/nikhilmali007/levelx3D"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs font-mono text-cyan"
          >
            GitHub Repository &rarr;
          </a>
        </div>
      )}
    </header>
  );
}
