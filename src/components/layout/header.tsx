'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

interface HeaderProps {
  theme?: 'light' | 'dark';
  onSearchClick?: () => void;
}

export function Header({ theme = 'light', onSearchClick }: HeaderProps) {
  const { totalItems, setIsDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLight = theme === 'light';
  const logoSrc = isLight ? '/logo-light.svg' : '/logo-dark.svg';
  const textColor = isLight ? 'text-ink' : 'text-chalk';
  const subtextColor = 'text-slate';
  const borderBottom = isLight ? 'border-hairline-light' : 'border-hairline-dark';
  const bgGlass = isLight
    ? 'bg-canvas/85 backdrop-blur-xl'
    : 'bg-onyx/85 backdrop-blur-xl';

  const NAV_LINKS = [
    { label: 'Shop', href: '#shop' },
    { label: 'Premium', href: '#premium' },
    { label: 'Custom Studio', href: '#studio' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 border-b ${borderBottom} ${bgGlass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo Image */}
        <Link href="/" className="flex items-center group">
          <div className="relative h-7 sm:h-8 w-36 sm:w-44 transition-opacity duration-300 group-hover:opacity-80">
            <Image
              src={logoSrc}
              alt="Level X 3D"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links (Jost 300 uppercase letter-spaced) */}
        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-heading text-xs tracking-apple-wide font-light ${subtextColor} hover:${textColor} transition-colors duration-200 relative group py-1`}
            >
              <span>{link.label}</span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[1px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                  isLight ? 'bg-ink' : 'bg-chalk'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Quiet Actions: Search & Cart */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            aria-label="Search objects"
            className={`p-1.5 transition-colors duration-200 ${subtextColor} hover:${textColor}`}
          >
            <Search className="w-4 h-4 stroke-[1.4]" />
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Cart"
            className={`relative p-1.5 transition-colors duration-200 flex items-center gap-1.5 ${subtextColor} hover:${textColor}`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.4]" />
            {totalItems > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                  isLight
                    ? 'bg-ink text-chalk border-ink'
                    : 'bg-chalk text-onyx border-chalk'
                }`}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
            className={`md:hidden p-1.5 transition-colors ${subtextColor} hover:${textColor}`}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 stroke-[1.4]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.4]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          className={`md:hidden border-b px-6 py-8 space-y-6 ${borderBottom} ${
            isLight ? 'bg-canvas text-ink' : 'bg-onyx text-chalk'
          }`}
        >
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-heading text-sm tracking-apple-wide font-light ${subtextColor} hover:${textColor} py-1`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
