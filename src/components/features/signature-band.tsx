'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { QuietButton } from '@/components/ui/quiet-button';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/lib/products-data';

interface SignatureBandProps {
  products: Product[];
}

export function SignatureBand({ products }: SignatureBandProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addItem } = useCart();

  const activeProduct = products[activeIndex] || products[0];

  return (
    <section id="signature" className="w-full bg-onyx text-chalk py-32 sm:py-40 border-t border-hairline-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Title Header */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-hairline-dark pb-10">
            <div>
              <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-2">
                Shelf 01 &bull; Signature Band
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-light tracking-apple-wide text-chalk uppercase">
                Signature / Premium
              </h2>
            </div>
            <p className="text-xs text-slate max-w-sm font-sans leading-relaxed">
              Six bespoke disciplines fabricated in numbered studio runs. High-density micro-SLA and multi-axis sintered nylon.
            </p>
          </div>
        </ScrollReveal>

        {/* Editorial Pinned / Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Pinned Category Navigation */}
          <div className="lg:col-span-5 space-y-3">
            <span className="font-heading text-[11px] tracking-apple-widest text-slate font-light uppercase block mb-4">
              Select Discipline
            </span>

            <div className="space-y-2">
              {products.map((prod, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={prod.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                      isActive
                        ? 'border-chalk/40 bg-[#161616]'
                        : 'border-hairline-dark/60 bg-transparent hover:border-hairline-dark'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-mono tracking-widest uppercase block ${
                        isActive ? 'text-chalk' : 'text-slate'
                      }`}>
                        0{idx + 1} &bull; {prod.category}
                      </span>
                      <h4 className={`font-heading text-sm font-light tracking-apple-wide transition-colors ${
                        isActive ? 'text-chalk' : 'text-slate group-hover:text-chalk/80'
                      }`}>
                        {prod.name}
                      </h4>
                    </div>

                    <span className="font-heading text-xs font-light tracking-wider text-slate">
                      {formatPrice(prod.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Large Editorial Card with Self-Drawing Hairline Border */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl bg-[#111111] border border-hairline-dark overflow-hidden flex flex-col justify-between"
              >
                {/* Hairline Border that Draws Itself */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl z-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.rect
                    x="0.75"
                    y="0.75"
                    width="calc(100% - 1.5px)"
                    height="calc(100% - 1.5px)"
                    rx="23"
                    fill="none"
                    stroke="#262626"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>

                {/* Large Editorial Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181818]">
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover transition-transform duration-700 ease-apple-out group-hover:scale-[1.03]"
                  />

                  <div className="absolute top-5 left-5 z-10">
                    <span className="text-[10px] font-mono tracking-apple-widest uppercase px-3 py-1 rounded-full bg-onyx/80 backdrop-blur-md text-chalk border border-hairline-dark">
                      {activeProduct.badge || 'Signature Edition'}
                    </span>
                  </div>

                  <div className="absolute bottom-5 right-5 z-10">
                    <span className="text-xs font-heading font-light tracking-widest uppercase px-3 py-1 rounded-full bg-onyx/80 backdrop-blur-md text-chalk border border-hairline-dark">
                      {formatPrice(activeProduct.price)}
                    </span>
                  </div>
                </div>

                {/* Editorial Details */}
                <div className="p-8 sm:p-10 space-y-6 relative z-10">
                  <div>
                    <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block mb-1">
                      {activeProduct.category}
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-chalk uppercase leading-tight">
                      {activeProduct.name}
                    </h3>
                    <p className="text-xs text-slate mt-2 leading-relaxed max-w-xl font-sans">
                      {activeProduct.description}
                    </p>
                  </div>

                  {/* Specifications bar */}
                  <div className="pt-4 border-t border-hairline-dark grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-mono text-slate">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate/70">Material</span>
                      <span className="text-chalk">{activeProduct.specs.material}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate/70">Resolution</span>
                      <span className="text-chalk">{activeProduct.specs.resolution}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate/70">Finish</span>
                      <span className="text-chalk">{activeProduct.specs.finish}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate/70">Dimensions</span>
                      <span className="text-chalk">{activeProduct.specs.dimensions}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex items-center justify-between">
                    <QuietButton
                      variant="dark"
                      size="lg"
                      onClick={() => addItem(activeProduct)}
                    >
                      Acquire Edition &bull; {formatPrice(activeProduct.price)}
                    </QuietButton>

                    <span className="text-[11px] font-mono text-slate">
                      Numbered 1/50 Studio Run
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
