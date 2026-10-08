'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { SearchModal } from '@/components/ecommerce/search-modal';
import { useAuth } from '@/context/auth-context';

interface HeaderProps {
  theme?: 'light' | 'dark';
  onSearchClick?: () => void;
}

export function Header({ theme = 'light', onSearchClick }: HeaderProps) {
  const { totalItems, setIsDrawerOpen, isLoaded } = useCart();
  const { totalItems: wishlistCount, isLoaded: wishlistLoaded } = useWishlist();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchClick = () => {
    if (onSearchClick) onSearchClick();
    else setSearchOpen(true);
  };

  const isLight = theme === 'light';
  const logoSrc = isLight ? '/logo-light.svg' : '/logo-dark.svg';
  const textColor = isLight ? 'text-ink' : 'text-chalk';
  const subtextColor = 'text-slate';
  const borderBottom = isLight ? 'border-hairline-light' : 'border-hairline-dark';
  const bgGlass = isLight
    ? 'bg-canvas/85 backdrop-blur-xl'
    : 'bg-onyx/85 backdrop-blur-xl';

  const NAV_LINKS = [
    { label: 'Shop', href: '/shop' },
    { label: 'Premium', href: '/shop/signature-premium' },
    { label: 'Custom Studio', href: '/#studio' },
    { label: 'About', href: '/#about' },
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

        {/* Quiet Actions: Search, Account & Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={handleSearchClick}
            aria-label="Search objects"
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl transition-colors duration-200 ${subtextColor} hover:${textColor}`}
          >
            <Search className="w-4 h-4 stroke-[1.4]" />
          </button>

          {/* User Account / Profile */}
          <Link
            href={user ? '/account' : '/login'}
            aria-label={user ? 'Customer Account' : 'Sign In'}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl transition-colors duration-200 relative ${subtextColor} hover:${textColor}`}
          >
            <User className="w-4 h-4 stroke-[1.4]" />
            {user && (
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-canvas" />
            )}
          </Link>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist (${wishlistCount} items)`}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl transition-colors duration-200 relative ${subtextColor} hover:${textColor}`}
          >
            <Heart className="w-4 h-4 stroke-[1.4]" />
            {wishlistLoaded && wishlistCount > 0 && (
              <span
                className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ring-2 ring-canvas bg-rose-500`}
              />
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label={`Open Cart (${totalItems} items)`}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl transition-colors duration-200 relative ${subtextColor} hover:${textColor}`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.4]" />
            {isLoaded && totalItems > 0 && (
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
            className={`md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl transition-colors ${subtextColor} hover:${textColor}`}
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

            <div className="pt-4 border-t border-hairline-light/60">
              <Link
                href={user ? '/account' : '/login'}
                onClick={() => setMobileOpen(false)}
                className={`font-heading text-sm tracking-apple-wide font-light ${subtextColor} hover:${textColor} py-1 flex items-center justify-between`}
              >
                <span>{user ? 'My Account & Orders' : 'Sign In / Account'}</span>
                <User className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} theme={theme} />
    </header>
  );
}
