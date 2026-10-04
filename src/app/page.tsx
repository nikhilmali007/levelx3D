'use client';

import Link from 'next/link';
import { HeroCanvas } from '@/components/3d/hero-canvas';
import { FeaturesBar } from '@/components/ecommerce/features-bar';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  ExternalLink,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-6 pb-12">
        {/* Subtle Ambient Radial Gradients */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-cyan/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              <span>LEVEL X 3D &bull; NEXT-GEN E-COMMERCE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              PHYSICAL ARTIFACTS.{' '}
              <span className="bg-gradient-to-r from-cyan via-blue-400 to-pink-500 bg-clip-text text-transparent">
                DIGITAL
              </span>{' '}
              DIMENSIONS.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Curated collector artifacts, ergonomic wearables, and kinetic desk sculptures manufactured via aerospace-grade 3D micro-SLA. Inspect every surface in real-time WebGL before ordering.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="#products">
                <Button size="lg" className="gap-2.5 text-base px-8 py-6 shadow-xl">
                  <span>Explore Artifacts</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#studio">
                <Button size="lg" variant="secondary" className="gap-2 text-base px-7 py-6">
                  <Sliders className="w-5 h-5 text-cyan" />
                  <span>3D Studio</span>
                </Button>
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                  12μm
                </span>
                <span className="text-xs text-slate-400">Micro Precision</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                  100%
                </span>
                <span className="text-xs text-slate-400">On-Demand SLA</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                  48h
                </span>
                <span className="text-xs text-slate-400">Global Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Canvas */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <div className="w-full h-[460px] sm:h-[540px] rounded-3xl bg-slate-900/30 border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
              <HeroCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <FeaturesBar />

      {/* Product Grid Catalog */}
      <ProductGrid />

      {/* 3D Studio & Customization Section */}
      <section id="studio" className="py-24 px-4 bg-slate-950/60 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
              <Layers className="w-3.5 h-3.5" />
              <span>PARAMETRIC CUSTOMIZATION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Bring Your Own Geometry To Reality.
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Upload your proprietary 3D assets (<code className="text-cyan">.STL</code>, <code className="text-cyan">.OBJ</code>, <code className="text-cyan">.STEP</code>) or configure our modular parametric presets. Our automated slicing cloud verifies structural integrity and prints with laser micro-precision.
            </p>

            <div className="space-y-3">
              {[
                { title: 'Automated Mesh Validation', desc: 'Instant wall-thickness analysis and overhang validation.' },
                { title: 'Material Swapping', desc: 'Switch between carbon lattice, sintered aluminum, and glow resins.' },
                { title: 'Zero Minimum Order Quantity', desc: 'Single-piece bespoke fabrication at production tier prices.' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">{feat.title}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="#products">
              <Button size="lg" className="mt-2">
                Order Custom 3D Prototype
              </Button>
            </Link>
          </div>

          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl relative space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">LEVELX_3D_PRINT_KERNEL.v4</span>
                </div>
                <Badge variant="default">ONLINE</Badge>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Resin Tank Chemistry</span>
                  <span className="text-cyan">Aerospace Polycarbonate Composite</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Laser Spot Size</span>
                  <span className="text-white">35 μm Ultra-Fine</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Tensile Modulus</span>
                  <span className="text-white">3,200 MPa</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Post-Process Finish</span>
                  <span className="text-pink-400">Vapor Smooth + UV Anneal</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/20 text-xs text-cyan flex items-center gap-3">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Ready for instant production queue dispatch upon checkout.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supabase Integration Ready Notice */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">
                  Supabase Client Pre-Configured
                </h3>
                <Badge variant="secondary">Ready</Badge>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                The Supabase JS client is integrated in <code className="text-cyan">src/lib/supabase/client.ts</code>. Simply drop your live <code className="text-slate-200">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-slate-200">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> into <code className="text-cyan">.env.local</code> to synchronize products, orders, and customer authentication.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
            >
              <span>Supabase Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
