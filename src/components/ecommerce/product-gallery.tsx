'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Eye, Layers, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
  badge?: string;
  isPremium?: boolean;
  geometryType?: 'torus' | 'sphere' | 'cyber-cube' | 'prism' | 'headset';
}

export function ProductGallery({
  images,
  name,
  badge,
  isPremium,
  geometryType = 'torus',
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | '3d-viewer'>('gallery');
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const galleryImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85'];

  const currentImage = galleryImages[activeIndex] || galleryImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 sm:gap-6 w-full">
      {/* 1. Thumbnail Strip */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-20 shrink-0 scrollbar-none py-1">
        {galleryImages.map((img, idx) => {
          const isActive = activeIndex === idx && viewMode === 'gallery';
          return (
            <button
              key={`${img}-${idx}`}
              onClick={() => {
                setActiveIndex(idx);
                setViewMode('gallery');
              }}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-200 shrink-0 bg-[#ECE9E2] ${
                isActive
                  ? 'border-ink shadow-sm ring-1 ring-ink'
                  : 'border-hairline-light hover:border-slate/50 opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${idx + 1} of ${name}`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          );
        })}

        {/* 3D Model Viewer Thumbnail Button */}
        <button
          onClick={() => setViewMode('3d-viewer')}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-200 shrink-0 flex flex-col items-center justify-center p-2 text-center bg-[#ECE9E2] ${
            viewMode === '3d-viewer'
              ? 'border-ink shadow-sm ring-1 ring-ink text-ink font-medium'
              : 'border-hairline-light hover:border-slate/50 text-slate opacity-75 hover:opacity-100'
          }`}
          aria-label="View 3D Model slot"
        >
          <Box className="w-5 h-5 stroke-[1.4] mb-1" />
          <span className="text-[9px] font-mono tracking-wider uppercase leading-none">
            3D View
          </span>
        </button>
      </div>

      {/* 2. Main Large Display Container */}
      <div className="flex-1 space-y-3">
        {/* View mode toggle pill */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1 rounded-full text-xs font-heading font-light tracking-apple-wide transition-all ${
                viewMode === 'gallery'
                  ? 'bg-ink text-chalk shadow-sm'
                  : 'bg-transparent text-slate hover:text-ink'
              }`}
            >
              Gallery Photos ({galleryImages.length})
            </button>
            <button
              onClick={() => setViewMode('3d-viewer')}
              className={`px-3 py-1 rounded-full text-xs font-heading font-light tracking-apple-wide transition-all flex items-center gap-1.5 ${
                viewMode === '3d-viewer'
                  ? 'bg-ink text-chalk shadow-sm'
                  : 'bg-transparent text-slate hover:text-ink'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D CAD Model</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate">
            <ZoomIn className="w-3 h-3" />
            <span>Hover image to zoom</span>
          </span>
        </div>

        <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#ECE9E2] border border-hairline-light">
          {badge && (
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="text-[10px] font-mono tracking-apple-widest uppercase px-3 py-1 rounded-full bg-canvas/90 backdrop-blur-md text-ink border border-hairline-light shadow-sm">
                {badge}
              </span>
            </div>
          )}

          {viewMode === 'gallery' ? (
            /* Photographic High-Res Gallery with Hover Zoom */
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
              className="relative w-full h-full cursor-crosshair overflow-hidden group"
            >
              <Image
                src={currentImage}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-transform duration-300 ease-apple-out ${
                  isHovering ? 'scale-[2]' : 'scale-100'
                }`}
                style={
                  isHovering
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />

              {/* Minimal zoom hint overlay */}
              {!isHovering && (
                <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md bg-canvas/80 backdrop-blur text-slate border border-hairline-light flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" />
                    2x Optical Loupe
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
               3D MODEL VIEWER SLOT:
               Clearly marked interactive slot for Three.js / WebGL / @google/model-viewer.
               ========================================================================= */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-[#EAE7E0] text-center select-none overflow-hidden">
              {/* Subtle architectural CAD grid background */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#0B0B0B 1px, transparent 1px), radial-gradient(#0B0B0B 1px, #EAE7E0 1px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              {/* Wireframe Rotating Indicator */}
              <div className="relative z-10 space-y-6 max-w-sm mx-auto">
                <div className="w-20 h-20 mx-auto rounded-2xl border border-hairline-dark/20 bg-canvas flex items-center justify-center shadow-sm relative group">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  >
                    <Box className="w-10 h-10 text-ink stroke-[1.2]" />
                  </motion.div>
                  <span className="absolute -bottom-2 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-onyx text-chalk">
                    {geometryType}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-apple-widest text-slate block">
                    3D Digital Twin &bull; Micro-SLA Mesh
                  </span>
                  <h4 className="font-heading text-lg font-light tracking-apple-wide text-ink uppercase">
                    3D Model Viewer Slot
                  </h4>
                  <p className="text-xs text-slate font-sans leading-relaxed">
                    Interactive WebGL / glTF viewport slot reserved for real-time 360&deg; rotational inspection, layer slicing, and millimeter scale verification.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border border-hairline-light bg-canvas text-slate">
                    <Layers className="w-3 h-3" />
                    25μm Layer Precision
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border border-hairline-light bg-canvas text-slate">
                    <Eye className="w-3 h-3" />
                    CAD Verified
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            3D MODEL VIEWER SLOT:
            Clearly marked interactive slot where a 3D model viewer (Three.js /
            React Three Fiber / @google/model-viewer) can be mounted for premium items.
            ========================================================================= */}
        {isPremium && (
          <div
            id="cad-3d-model-viewer-slot"
            className="p-5 sm:p-6 rounded-2xl border border-dashed border-hairline-dark/40 bg-[#ECE9E2]/50 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-hairline-light">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-ink stroke-[1.4]" />
                <span className="font-heading text-xs tracking-apple-widest uppercase text-ink font-light">
                  3D Model Viewer Slot
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-onyx text-chalk">
                Micro-SLA CAD Mesh
              </span>
            </div>

            <p className="text-xs text-slate font-sans leading-relaxed text-left">
              Reserved integration slot for real-time 3D interactive WebGL CAD models. Supports full 360&deg; orbital rotation, micro-lattice inspection, and slicing simulation.
            </p>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate">
              <span>Ready for Three.js / WebGL</span>
              <button
                onClick={() => setViewMode('3d-viewer')}
                className="text-ink font-medium underline hover:text-slate transition-colors"
              >
                Inspect 3D Geometry Mode &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
