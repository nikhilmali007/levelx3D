'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BrushstrokeX } from '@/components/motion/brushstroke-x';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { AnimatedCard } from '@/components/motion/animated-card';
import { QuietButton } from '@/components/ui/quiet-button';
import { HeroCanvas } from '@/components/3d/hero-canvas';
import { useCart } from '@/hooks/use-cart';
import { INITIAL_PRODUCTS, SHELVES_DATA } from '@/lib/products-data';
import { Smartphone, Monitor, ArrowDown, ChevronRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { addItem } = useCart();
  const [devicePreviewWidth, setDevicePreviewWidth] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedShelf, setSelectedShelf] = useState<string>('Signature / Premium');

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-onyx selection:text-chalk">
      {/* 1. Slim Sticky Header (Black-on-cream on light section) */}
      <Header theme="light" />

      {/* 2. Hero Section (Calm, Apple-Grade Minimalism with Brushstroke X Drawing on Load) */}
      <section className="relative min-h-[88vh] flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto w-full pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & Architectural Drawing */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Animated Brushstroke X drawing once on load */}
            <div className="flex items-center gap-4">
              <BrushstrokeX size={72} color="#141414" />
              <div className="h-8 w-[1px] bg-hairline-light" />
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase">
                Studio Edition 01 &bull; 2026
              </span>
            </div>

            {/* Heading: Jost light 300 with wide letter-spacing */}
            <ScrollReveal delay={0.1}>
              <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl font-light tracking-apple-wide text-ink leading-[1.08] uppercase">
                Architectural <br />
                Permanence.
              </h1>
            </ScrollReveal>

            {/* Body: Inter font, slate secondary text */}
            <ScrollReveal delay={0.25}>
              <p className="font-sans text-sm sm:text-base text-slate max-w-lg leading-relaxed font-normal">
                Tangible physical artifacts designed through parametric computation and fabricated via aerospace micro-stereolithography and laser-sintered nylon.
              </p>
            </ScrollReveal>

            {/* Quiet Primary Button with wipe-in underline on hover */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-8 pt-2">
                <Link href="#premium">
                  <QuietButton variant="light" size="lg">
                    Signature Shelf &rarr;
                  </QuietButton>
                </Link>
                <Link href="#shelves">
                  <QuietButton variant="light" size="lg" className="text-slate hover:text-ink">
                    All 18 Shelves
                  </QuietButton>
                </Link>
              </div>
            </ScrollReveal>

            {/* Subtle engineering metrics */}
            <ScrollReveal delay={0.55}>
              <div className="pt-8 border-t border-hairline-light grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <span className="font-heading text-lg sm:text-xl font-light tracking-wider text-ink block">
                    12 μm
                  </span>
                  <span className="text-[11px] text-slate font-sans uppercase tracking-wider">
                    Laser Pitch
                  </span>
                </div>
                <div>
                  <span className="font-heading text-lg sm:text-xl font-light tracking-wider text-ink block">
                    PA12
                  </span>
                  <span className="text-[11px] text-slate font-sans uppercase tracking-wider">
                    Sintered Nylon
                  </span>
                </div>
                <div>
                  <span className="font-heading text-lg sm:text-xl font-light tracking-wider text-ink block">
                    18 Shelves
                  </span>
                  <span className="text-[11px] text-slate font-sans uppercase tracking-wider">
                    Archival Studio
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Restrained Monochrome 3D Canvas */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl border border-hairline-light bg-[#EBE7DF]/40 overflow-hidden">
              <HeroCanvas theme="light" />
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="text-[10px] font-mono tracking-apple-widest uppercase px-2.5 py-1 rounded-full bg-canvas/80 text-slate border border-hairline-light">
                  Object 01 &bull; Voronoi Torus
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet scroll indicator */}
        <div className="pt-12 flex justify-center">
          <Link href="#premium" aria-label="Scroll down">
            <ArrowDown className="w-4 h-4 text-slate animate-bounce stroke-[1.2]" />
          </Link>
        </div>
      </section>

      {/* 3. SIGNATURE / PREMIUM SHELF (6 Products with Prices in INR) */}
      <section id="premium" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-hairline-light">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-slate">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Shelf 01 &bull; Signature Collection</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase">
                Signature / Premium
              </h2>
            </div>
            <p className="text-xs text-slate max-w-md font-sans leading-relaxed">
              Our flagship bespoke architectural works. Numbered editions manufactured with micron laser tolerance and museum curation.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Signature / Premium Products Grid */}
        <ScrollReveal staggerChildren={0.12}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_PRODUCTS.map((prod) => (
              <AnimatedCard
                key={prod.id}
                title={prod.name}
                subtitle={prod.tagline}
                category={prod.category}
                price={prod.price}
                image={prod.image}
                theme="light"
                actionLabel="Add to Bag"
                onAction={() => addItem(prod)}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 4. COMPONENT & MOTION SHOWCASE: Mobile (390px) vs Desktop Width Viewer */}
      <section id="showcase" className="py-20 px-4 sm:px-8 border-t border-hairline-light bg-[#EBE7DF]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1">
                Motion System Verification
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
                Mobile &bull; Desktop Viewport Preview
              </h2>
              <p className="text-xs text-slate mt-1 max-w-lg font-sans">
                Observe the self-drawing hairline border on scroll, gentle lift, and slight image zoom on hover. Toggle below to test responsive mobile (390px) and desktop behaviors.
              </p>
            </div>

            {/* Mobile / Desktop Toggle Switch */}
            <div className="inline-flex p-1 rounded-xl bg-canvas border border-hairline-light self-start sm:self-auto">
              <button
                onClick={() => setDevicePreviewWidth('desktop')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-light tracking-apple-wide transition-all ${
                  devicePreviewWidth === 'desktop'
                    ? 'bg-onyx text-chalk'
                    : 'text-slate hover:text-ink'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Desktop Width</span>
              </button>
              <button
                onClick={() => setDevicePreviewWidth('mobile')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-light tracking-apple-wide transition-all ${
                  devicePreviewWidth === 'mobile'
                    ? 'bg-onyx text-chalk'
                    : 'text-slate hover:text-ink'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Mobile Width (390px)</span>
              </button>
            </div>
          </div>

          {/* Interactive Responsive Sandbox Container */}
          <div className="flex justify-center transition-all duration-500">
            <div
              className={`w-full transition-all duration-500 ${
                devicePreviewWidth === 'mobile'
                  ? 'max-w-[390px] border border-hairline-light rounded-[32px] p-4 bg-canvas shadow-2xl overflow-hidden'
                  : 'max-w-7xl'
              }`}
            >
              {devicePreviewWidth === 'mobile' && (
                <div className="pb-3 mb-4 border-b border-hairline-light flex items-center justify-between text-[10px] font-mono text-slate">
                  <span>Level X 3D &bull; Mobile Viewport</span>
                  <span>390 &times; 844</span>
                </div>
              )}

              <ScrollReveal staggerChildren={0.12}>
                <div
                  className={`grid gap-6 ${
                    devicePreviewWidth === 'mobile'
                      ? 'grid-cols-1'
                      : 'grid-cols-1 md:grid-cols-3'
                  }`}
                >
                  <AnimatedCard
                    title={INITIAL_PRODUCTS[0].name}
                    subtitle={INITIAL_PRODUCTS[0].tagline}
                    category={INITIAL_PRODUCTS[0].category}
                    price={INITIAL_PRODUCTS[0].price}
                    image={INITIAL_PRODUCTS[0].image}
                    theme="light"
                    actionLabel="Add to Bag"
                    onAction={() => addItem(INITIAL_PRODUCTS[0])}
                  />

                  <AnimatedCard
                    title={INITIAL_PRODUCTS[1].name}
                    subtitle={INITIAL_PRODUCTS[1].tagline}
                    category={INITIAL_PRODUCTS[1].category}
                    price={INITIAL_PRODUCTS[1].price}
                    image={INITIAL_PRODUCTS[1].image}
                    theme="light"
                    actionLabel="Add to Bag"
                    onAction={() => addItem(INITIAL_PRODUCTS[1])}
                  />

                  <AnimatedCard
                    title={INITIAL_PRODUCTS[2].name}
                    subtitle={INITIAL_PRODUCTS[2].tagline}
                    category={INITIAL_PRODUCTS[2].category}
                    price={INITIAL_PRODUCTS[2].price}
                    image={INITIAL_PRODUCTS[2].image}
                    theme="light"
                    actionLabel="Add to Bag"
                    onAction={() => addItem(INITIAL_PRODUCTS[2])}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPLETE 18 SHELVES DIRECTORY */}
      <section id="shelves" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-hairline-light">
        <ScrollReveal>
          <div className="mb-12">
            <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1">
              Store Taxonomy &bull; 18 Curated Shelves
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase">
              Archival Shelves Directory
            </h2>
            <p className="text-xs text-slate mt-1 max-w-md font-sans">
              Select a shelf to inspect its specialized category architecture and production lines.
            </p>
          </div>
        </ScrollReveal>

        {/* Shelves Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-10 scrollbar-none">
          {SHELVES_DATA.map((s) => (
            <button
              key={s.shelf}
              onClick={() => setSelectedShelf(s.shelf)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-light tracking-apple-wide whitespace-nowrap transition-all border ${
                selectedShelf === s.shelf
                  ? 'bg-onyx text-chalk border-onyx'
                  : 'bg-canvas text-slate border-hairline-light hover:text-ink hover:border-slate/40'
              }`}
            >
              {s.shelf}
            </button>
          ))}
        </div>

        {/* Active Shelf Categories Grid */}
        {(() => {
          const current = SHELVES_DATA.find((s) => s.shelf === selectedShelf) || SHELVES_DATA[0];
          return (
            <div className="p-8 sm:p-10 rounded-2xl border border-hairline-light bg-[#ECE9E2]/50">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-hairline-light">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-light tracking-apple-wide text-ink uppercase">
                    {current.shelf}
                  </h3>
                  <span className="text-xs text-slate font-mono">
                    {current.categories.length} Specialized Fabrication Categories
                  </span>
                </div>
                <Link href="#premium">
                  <QuietButton variant="light" size="sm">
                    View Seeded Products &rarr;
                  </QuietButton>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {current.categories.map((cat, idx) => (
                  <div
                    key={cat.slug}
                    className="p-4 rounded-xl border border-hairline-light bg-canvas hover:border-slate/40 transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-heading text-xs font-light tracking-apple-wide text-ink group-hover:text-black">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate block mt-0.5">
                        {cat.slug}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate group-hover:text-ink group-hover:translate-x-0.5 transition-all stroke-[1.5]" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* 6. Dark Section Showcase (Onyx #0B0B0B with Cream-on-Black Logo in /public/logo-dark.svg) */}
      <section id="studio" className="w-full bg-onyx text-chalk py-28 px-4 sm:px-8 border-t border-hairline-dark">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Section Header using cream-on-black logo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-hairline-dark pb-16">
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-8 w-44">
                <Image
                  src="/logo-dark.svg"
                  alt="Level X 3D Dark Theme Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <span className="text-[11px] font-mono tracking-widest text-slate uppercase block">
                Dark Mode Specification &bull; Onyx #0B0B0B
              </span>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-chalk uppercase">
                Custom Parametric Studio
              </h3>
              <p className="text-xs text-slate leading-relaxed max-w-xl font-sans">
                Our fabrication lab ingests custom CAD files (<code className="text-chalk">.STL</code>, <code className="text-chalk">.STEP</code>, <code className="text-chalk">.OBJ</code>) directly into multi-axis stereolithography rigs. Monochromatic finishing with vapor-polished matte black or ceramic chalk.
              </p>
              <div className="pt-2">
                <QuietButton variant="dark">
                  Initiate Bespoke Ingestion &rarr;
                </QuietButton>
              </div>
            </div>
          </div>

          {/* Dark Cards with Hairline #262626 drawing themselves */}
          <div>
            <div className="mb-10">
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1">
                Dark Hairline Frame Test
              </span>
              <h4 className="font-heading text-xl font-light tracking-apple-wide text-chalk uppercase">
                Limited Dark Run &bull; Numbered Obsidian
              </h4>
            </div>

            <ScrollReveal staggerChildren={0.12}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatedCard
                  title={INITIAL_PRODUCTS[1].name}
                  subtitle={INITIAL_PRODUCTS[1].tagline}
                  category={INITIAL_PRODUCTS[1].category}
                  price={INITIAL_PRODUCTS[1].price}
                  image={INITIAL_PRODUCTS[1].image}
                  theme="dark"
                  actionLabel="Acquire 1/8"
                  onAction={() => addItem(INITIAL_PRODUCTS[1])}
                />
                <AnimatedCard
                  title={INITIAL_PRODUCTS[3].name}
                  subtitle={INITIAL_PRODUCTS[3].tagline}
                  category={INITIAL_PRODUCTS[3].category}
                  price={INITIAL_PRODUCTS[3].price}
                  image={INITIAL_PRODUCTS[3].image}
                  theme="dark"
                  actionLabel="Acquire 1/12"
                  onAction={() => addItem(INITIAL_PRODUCTS[3])}
                />
                <AnimatedCard
                  title={INITIAL_PRODUCTS[4].name}
                  subtitle={INITIAL_PRODUCTS[4].tagline}
                  category={INITIAL_PRODUCTS[4].category}
                  price={INITIAL_PRODUCTS[4].price}
                  image={INITIAL_PRODUCTS[4].image}
                  theme="dark"
                  actionLabel="Acquire 1/10"
                  onAction={() => addItem(INITIAL_PRODUCTS[4])}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. Footer (Onyx #0B0B0B, Newsletter, Link Columns, Monochrome Payment Icons) */}
      <Footer />
    </div>
  );
}
