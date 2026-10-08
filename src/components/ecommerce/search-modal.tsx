'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, ArrowRight, History } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function SearchModal({ isOpen, onClose, theme = 'light' }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === 'light';
  const bgColors = isLight ? 'bg-canvas text-ink' : 'bg-onyx text-chalk';
  const overlayBg = isLight ? 'bg-canvas/90' : 'bg-onyx/90';
  const subtextColor = 'text-slate';
  const inputBg = isLight ? 'bg-white border-hairline-light' : 'bg-slate-900 border-hairline-dark';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const saved = localStorage.getItem('levelx3d_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (productName: string) => {
    let searches = [productName, ...recentSearches.filter((s) => s !== productName)].slice(0, 5);
    setRecentSearches(searches);
    localStorage.setItem('levelx3d_recent_searches', JSON.stringify(searches));
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('levelx3d_recent_searches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 z-[100] backdrop-blur-xl ${overlayBg} flex flex-col`}
        >
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={onClose}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className={`w-full max-w-4xl mx-auto px-4 pt-24 pb-8 flex-1 flex flex-col`}>
            {/* Search Input */}
            <div className="relative group">
              <SearchIcon className={`absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 ${subtextColor}`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories..."
                className={`w-full h-20 pl-20 pr-6 text-2xl sm:text-4xl font-heading font-light outline-none rounded-3xl transition-all ${inputBg} shadow-sm focus:shadow-md focus:border-cyan/50`}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-slate hover:text-ink transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Results Area */}
            <div className="mt-12 flex-1 overflow-y-auto hide-scrollbar">
              {!query && recentSearches.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-xs uppercase tracking-apple-wide font-light text-slate">
                      Recent Searches
                    </h3>
                    <button onClick={clearRecent} className="text-[10px] uppercase font-mono text-slate hover:text-ink">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(term)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${inputBg} text-sm hover:border-cyan/50 transition-colors`}
                      >
                        <History className="w-3.5 h-3.5 text-slate" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && query && (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-ink rounded-full animate-spin" />
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="text-center py-20 text-slate">
                  <p className="text-xl font-heading font-light">No results found for &quot;{query}&quot;</p>
                  <p className="text-sm mt-2">Try checking the spelling or use broader terms.</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="font-heading text-xs uppercase tracking-apple-wide font-light text-slate mb-6">
                    Products ({results.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => handleResultClick(product.name)}
                        className={`flex gap-4 p-4 rounded-2xl border ${inputBg} hover:border-cyan/50 transition-all group`}
                      >
                        <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center flex-1">
                          <span className="text-[10px] font-mono text-slate uppercase">{product.category}</span>
                          <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-cyan transition-colors">{product.name}</h4>
                          <span className="text-sm font-semibold mt-1">{formatPrice(product.price)}</span>
                        </div>
                        <div className="flex items-center justify-center px-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                          <ArrowRight className="w-5 h-5 text-cyan" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
