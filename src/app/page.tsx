'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BrushstrokeX } from '@/components/motion/brushstroke-x';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { AnimatedCard } from '@/components/motion/animated-card';
import { QuietButton } from '@/components/ui/quiet-button';
import { SignatureBand } from '@/components/features/signature-band';
import { CustomStudioUpload } from '@/components/features/custom-studio-upload';
import { useCart } from '@/hooks/use-cart';
import { Product, INITIAL_PRODUCTS, SHELVES_DATA } from '@/lib/products-data';
import { getStoreCategories, getFeaturedProducts } from '@/lib/supabase/store';
import { Smartphone, Monitor, ArrowDown, ChevronRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [shelves, setShelves] = useState<typeof SHELVES_DATA>(SHELVES_DATA);
  const [selectedShelf, setSelectedShelf] = useState<string>('Signature / Premium');
  const [devicePreviewWidth, setDevicePreviewWidth] = useState<'desktop' | 'mobile'>('desktop');

  // Pull categories & featured products from Supabase (with automatic fallback to seed data)
  useEffect(() => {
    async function loadData() {
      try {
        const [catData, prodData] = await Promise.all([
          getStoreCategories(),
          getFeaturedProducts(),
        ]);
        if (catData.shelves && catData.shelves.length > 0) {
          setShelves(catData.shelves as any);
        }
        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        }
      } catch (e) {
        console.error('Store data load error', e);
      }
    }
    loadData();
  }, []);

  const heroProduct = products[0];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-onyx selection:text-chalk">
      {/* Slim Sticky Header */}
      <Header theme="light" />

      {/* =========================================================================
          SECTION 1: HERO
          Brushstroke-X load animation, oversized headline, short sub-line,
          one hero product image with a Shop button.
      ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-8 max-w-7xl mx-auto w-full pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Headline & Callout */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Brushstroke X drawing animation on load */}
            <div className="flex items-center gap-4">
              <BrushstrokeX size={76} color="#141414" />
              <div className="h-8 w-[1px] bg-hairline-light" />
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase">
                Studio Edition 01 &bull; 2026
              </span>
            </div>

            {/* Oversized Headline */}
            <ScrollReveal delay={0.1}>
              <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl font-light tracking-apple-wide text-ink leading-[1.06] uppercase">
                Architectural <br />
                Permanence.
              </h1>
            </ScrollReveal>

            {/* Short Sub-Line */}
            <ScrollReveal delay={0.25}>
              <p className="font-sans text-sm sm:text-base text-slate max-w-lg leading-relaxed font-normal">
                Tangible physical artifacts designed through parametric computation and fabricated via aerospace micro-stereolithography and laser-sintered nylon.
              </p>
            </ScrollReveal>

            {/* Shop Button */}
            <ScrollReveal delay={0.4}>
              <div className="pt-2">
                <Link href="#featured">
                  <QuietButton variant="light" size="lg">
                    Shop Collection &rarr;
                  </QuietButton>
                </Link>
              </div>
            </ScrollReveal>

            {/* Quiet technical hallmarks */}
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
                    1/50
                  </span>
                  <span className="text-[11px] text-slate font-sans uppercase tracking-wider">
                    Numbered Run
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: One Hero Product Image */}
          <div className="lg:col-span-5 w-full">
            <ScrollReveal delay={0.3}>
              <div className="group relative rounded-3xl border border-hairline-light bg-[#ECE9E2]/60 p-4 sm:p-6 overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#E2DFD8]">
                  <Image
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                    className="object-cover transition-transform duration-700 ease-apple-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-mono tracking-apple-widest uppercase px-3 py-1 rounded-full bg-canvas/80 backdrop-blur-md text-slate border border-hairline-light">
                      Hero Object &bull; {heroProduct.category}
                    </span>
                  </div>
                </div>

                <div className="pt-5 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-base font-light tracking-apple-wide text-ink uppercase">
                      {heroProduct.name}
                    </h3>
                    <span className="text-xs text-slate font-sans">
                      {heroProduct.tagline}
                    </span>
                  </div>
                  <Link href="#featured">
                    <QuietButton variant="light" size="sm">
                      Inspect &rarr;
                    </QuietButton>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Quiet scroll arrow */}
        <div className="pt-16 flex justify-center">
          <Link href="#signature" aria-label="Scroll down">
            <ArrowDown className="w-4 h-4 text-slate animate-bounce stroke-[1.2]" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SIGNATURE BAND ON ONYX BACKGROUND
          Premium categories as large editorial cards, pinned with smooth transitions.
      ========================================================================= */}
      <SignatureBand products={products} />

      {/* =========================================================================
          SECTION 3: SHOP BY CATEGORY GRID OF ALL SHELVES
          Full-width calm moment with tabs for all 18 shelves and category tiles.
      ========================================================================= */}
      <section id="shelves" className="py-32 sm:py-40 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-hairline-light">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-2">
                Store Taxonomy &bull; 18 Shelves
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase">
                Shop By Category
              </h2>
            </div>
            <p className="text-xs text-slate max-w-sm font-sans leading-relaxed">
              Explore specialized fabrication categories across architecture, desk art, biometric wearables, and devotional sanctuaries.
            </p>
          </div>
        </ScrollReveal>

        {/* Shelves Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-10 scrollbar-none">
          {shelves.map((s) => (
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
          const current = shelves.find((s) => s.shelf === selectedShelf) || shelves[0];
          return (
            <div className="p-8 sm:p-12 rounded-3xl border border-hairline-light bg-[#ECE9E2]/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-hairline-light gap-4">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-light tracking-apple-wide text-ink uppercase">
                    {current.shelf}
                  </h3>
                  <span className="text-xs text-slate font-mono">
                    {current.categories.length} Specialized Fabrication Categories
                  </span>
                </div>
                <Link href="#featured">
                  <QuietButton variant="light" size="sm">
                    View Featured Products &rarr;
                  </QuietButton>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {current.categories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="p-5 rounded-2xl border border-hairline-light bg-canvas hover:border-slate/40 transition-all duration-300 group flex items-center justify-between hover:-translate-y-0.5"
                  >
                    <div>
                      <h4 className="font-heading text-xs font-light tracking-apple-wide text-ink group-hover:text-black">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate block mt-1">
                        /{cat.slug}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate group-hover:text-ink group-hover:translate-x-1 transition-all stroke-[1.5]" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* =========================================================================
          SECTION 4: FEATURED-PRODUCTS ROW
          Calm row of the 6 Signature/Premium products with self-drawing borders.
      ========================================================================= */}
      <section id="featured" className="py-32 sm:py-40 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-hairline-light">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-slate">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Curated Artifacts</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-light tracking-apple-wide text-ink uppercase">
                Featured Products
              </h2>
            </div>
            <p className="text-xs text-slate max-w-sm font-sans leading-relaxed">
              Precision SLA and SLS pieces in numbered runs. Click any card to inspect or add directly to your archival bag.
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Products Grid */}
        <ScrollReveal staggerChildren={0.12}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod) => (
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

      {/* =========================================================================
          SECTION 5: CUSTOM STUDIO BLOCK (Inviting an Upload)
          Full-width calm moment on Onyx with CAD upload ingestion.
      ========================================================================= */}
      <section id="studio" className="w-full bg-onyx text-chalk py-32 sm:py-40 border-t border-hairline-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block">
                Shelf 18 &bull; Bespoke Fabrication
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-chalk uppercase">
                Custom Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate font-sans leading-relaxed">
                Bring your proprietary geometry to reality. Drop an <code className="text-chalk">.STL</code>, <code className="text-chalk">.STEP</code>, or <code className="text-chalk">.OBJ</code> file for automated mesh slicing and instant quotation in Indian Rupees (₹).
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Upload Box */}
          <ScrollReveal delay={0.2}>
            <CustomStudioUpload />
          </ScrollReveal>

          {/* Fabrication Standards */}
          <div className="pt-8 border-t border-hairline-dark grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <span className="font-heading text-sm font-light tracking-wide text-chalk block uppercase">
                Automated Slicing
              </span>
              <span className="text-xs text-slate font-sans mt-1 block">
                Instant wall-thickness analysis and structural inspection.
              </span>
            </div>
            <div>
              <span className="font-heading text-sm font-light tracking-wide text-chalk block uppercase">
                Aerospace Polymers
              </span>
              <span className="text-xs text-slate font-sans mt-1 block">
                High-temperature SLA composite & sintered PA12 nylon.
              </span>
            </div>
            <div>
              <span className="font-heading text-sm font-light tracking-wide text-chalk block uppercase">
                Single Piece Runs
              </span>
              <span className="text-xs text-slate font-sans mt-1 block">
                No minimum order quantity required.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: RESPONSIVE VIEWPORT SANDBOX (Mobile 390px vs Desktop)
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 border-t border-hairline-light bg-[#EBE7DF]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1">
                Responsive Motion Sandbox
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
                Mobile &bull; Desktop Viewport Preview
              </h2>
              <p className="text-xs text-slate mt-1 max-w-lg font-sans">
                Toggle below to test the card hairline border drawing and responsive behavior at standard mobile width (390px) and desktop width.
              </p>
            </div>

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
                    title={products[0].name}
                    subtitle={products[0].tagline}
                    category={products[0].category}
                    price={products[0].price}
                    image={products[0].image}
                    theme="light"
                    actionLabel="Add to Bag"
                    onAction={() => addItem(products[0])}
                  />

                  <AnimatedCard
                    title={products[1].name}
                    subtitle={products[1].tagline}
                    category={products[1].category}
                    price={products[1].price}
                    image={products[1].image}
                    theme="light"
                    actionLabel="Add to Bag"
                    onAction={() => addItem(products[1])}
                  />

                  <AnimatedCard
                    title={products[2].name}
                    subtitle={products[2].tagline}
                    category={products[2].category}
                    price={products[2].price}
                    image={products[2].image}
                    theme="light"
                    actionLabel="Add to Bag"
                    onAction={() => addItem(products[2])}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
