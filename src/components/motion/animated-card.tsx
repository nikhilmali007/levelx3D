'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { QuietButton } from '@/components/ui/quiet-button';

import Link from 'next/link';

interface AnimatedCardProps {
  href?: string;
  title: string;
  subtitle?: string;
  category?: string;
  price?: number;
  image: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  theme?: 'light' | 'dark';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: ReactNode;
}

export function AnimatedCard({
  href,
  title,
  subtitle,
  category,
  price,
  image,
  aspectRatio = 'portrait',
  theme = 'light',
  actionLabel = 'Explore Object',
  onAction,
  className = '',
  children,
}: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const isLight = theme === 'light';
  const hairlineColor = isLight ? '#E4E1DA' : '#262626';
  const bgColor = isLight ? 'bg-canvas' : 'bg-onyx';
  const textColor = isLight ? 'text-ink' : 'text-chalk';
  const subtextColor = 'text-slate';

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      className={`group relative rounded-2xl overflow-hidden ${bgColor} ${textColor} transition-all duration-400 ease-apple-out hover:-translate-y-1.5 flex flex-col justify-between ${className}`}
    >
      {/* Hairline Border that Draws Itself */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.rect
          x="0.75"
          y="0.75"
          width="calc(100% - 1.5px)"
          height="calc(100% - 1.5px)"
          rx="15"
          fill="none"
          stroke={hairlineColor}
          strokeWidth="1"
          variants={{
            hidden: { pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: {
                  duration: shouldReduceMotion ? 0 : 0.85,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { duration: 0.2 },
              },
            },
          }}
        />
      </svg>

      {/* Image Container with Gentle Zoom on Hover */}
      {href ? (
        <Link
          href={href}
          className={`relative block w-full overflow-hidden cursor-pointer ${
            aspectRatio === 'square'
              ? 'aspect-square'
              : aspectRatio === 'portrait'
              ? 'aspect-[4/5]'
              : 'aspect-[16/10]'
          } ${isLight ? 'bg-[#ECE9E2]' : 'bg-[#121212]'}`}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-apple-out group-hover:scale-[1.04]"
          />

          {category && (
            <div className="absolute top-4 left-4 z-10">
              <span
                className={`text-[10px] font-mono tracking-apple-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-md border ${
                  isLight
                    ? 'bg-canvas/80 text-ink border-hairline-light'
                    : 'bg-onyx/80 text-chalk border-hairline-dark'
                }`}
              >
                {category}
              </span>
            </div>
          )}
        </Link>
      ) : (
        <div
          className={`relative w-full overflow-hidden ${
            aspectRatio === 'square'
              ? 'aspect-square'
              : aspectRatio === 'portrait'
              ? 'aspect-[4/5]'
              : 'aspect-[16/10]'
          } ${isLight ? 'bg-[#ECE9E2]' : 'bg-[#121212]'}`}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-apple-out group-hover:scale-[1.04]"
          />

          {category && (
            <div className="absolute top-4 left-4 z-10">
              <span
                className={`text-[10px] font-mono tracking-apple-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-md border ${
                  isLight
                    ? 'bg-canvas/80 text-ink border-hairline-light'
                    : 'bg-onyx/80 text-chalk border-hairline-dark'
                }`}
              >
                {category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card Content Details */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4 relative z-10">
        <div>
          {href ? (
            <Link href={href}>
              <h3 className="font-heading text-lg sm:text-xl font-light tracking-apple-wide mb-1 leading-snug hover:opacity-75 transition-opacity">
                {title}
              </h3>
            </Link>
          ) : (
            <h3 className="font-heading text-lg sm:text-xl font-light tracking-apple-wide mb-1 leading-snug">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-xs ${subtextColor} leading-relaxed line-clamp-2`}>
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {/* Footer info: Price & Quiet Action */}
        <div
          className={`pt-4 border-t flex items-center justify-between gap-4 ${
            isLight ? 'border-hairline-light' : 'border-hairline-dark'
          }`}
        >
          {price !== undefined && (
            <div>
              <span className={`text-[10px] uppercase font-mono block ${subtextColor}`}>
                Edition
              </span>
              <span className="text-sm font-light font-heading tracking-wider">
                {formatPrice(price)}
              </span>
            </div>
          )}

          <QuietButton
            variant={isLight ? 'light' : 'dark'}
            onClick={onAction}
            className="text-xs tracking-apple-wide"
          >
            {actionLabel}
          </QuietButton>
        </div>
      </div>
    </motion.div>
  );
}
