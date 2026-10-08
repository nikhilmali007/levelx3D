'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';
import { AdminProduct, AdminProductOption, slugify } from '@/lib/supabase/admin';
import { SHELVES_DATA } from '@/lib/products-data';
import { formatPrice } from '@/lib/utils';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: AdminProduct | null;
  onSaved: (product: AdminProduct) => void;
}

export function ProductModal({ isOpen, onClose, product, onSaved }: ProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shelf, setShelf] = useState(SHELVES_DATA[0].shelf);
  const [category, setCategory] = useState(SHELVES_DATA[0].categories[0].name);
  const [priceInr, setPriceInr] = useState<number>(15000);
  const [compareAtPriceInr, setCompareAtPriceInr] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [imageUrl, setImageUrl] = useState('');

  // Options State
  const [options, setOptions] = useState<AdminProductOption[]>([]);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionType, setNewOptionType] = useState<'color' | 'select' | 'text'>('select');
  const [newOptionValuesRaw, setNewOptionValuesRaw] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description || '');
      setShelf(product.shelf || SHELVES_DATA[0].shelf);
      setCategory(product.category || SHELVES_DATA[0].categories[0].name);
      setPriceInr(product.price_inr);
      setCompareAtPriceInr(product.compare_at_price_inr);
      setStock(product.stock ?? 10);
      setIsCustomizable(Boolean(product.is_customizable));
      setIsPremium(Boolean(product.is_premium));
      setStatus(product.status || 'active');
      setImageUrl(product.image_url || '');
      setOptions(product.options || []);
    } else {
      // Defaults for new product
      setName('');
      setSlug('');
      setDescription('');
      setShelf(SHELVES_DATA[0].shelf);
      setCategory(SHELVES_DATA[0].categories[0].name);
      setPriceInr(14500);
      setCompareAtPriceInr(undefined);
      setStock(12);
      setIsCustomizable(false);
      setIsPremium(false);
      setStatus('active');
      setImageUrl('');
      setOptions([
        {
          id: 'opt-1',
          name: 'Material Finish',
          type: 'select',
          values: [
            { label: 'Matte Obsidian PA12', value: 'Matte Obsidian PA12' },
            { label: 'Raw Alabaster Gypsum', value: 'Raw Alabaster Gypsum' },
            { label: 'Vapor-Polished Bone White', value: 'Vapor-Polished Bone White' },
          ],
        },
      ]);
    }
    setErrorMessage(null);
  }, [product, isOpen]);

  // Available categories for selected shelf
  const currentShelfObj = SHELVES_DATA.find((s) => s.shelf === shelf) || SHELVES_DATA[0];

  const handleNameChange = (val: string) => {
    setName(val);
    if (!product) {
      setSlug(slugify(val));
    }
  };

  const handleAddOption = () => {
    if (!newOptionName.trim()) return;
    const valuesArray = newOptionValuesRaw
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map((val) => ({ label: val, value: val }));

    const newOpt: AdminProductOption = {
      id: `opt-${Date.now()}`,
      name: newOptionName.trim(),
      type: newOptionType,
      values: valuesArray.length > 0 ? valuesArray : [{ label: 'Standard', value: 'Standard' }],
    };

    setOptions([...options, newOpt]);
    setNewOptionName('');
    setNewOptionValuesRaw('');
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, idx) => idx !== index));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '',
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        setErrorMessage(data.error || 'Failed to upload image.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product title is required.');
      return;
    }

    if (!priceInr || priceInr < 0) {
      setErrorMessage('Valid price in INR is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: product?.id,
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim(),
        shelf,
        category,
        price_inr: Number(priceInr),
        compare_at_price_inr: compareAtPriceInr ? Number(compareAtPriceInr) : undefined,
        stock: Number(stock),
        is_customizable: isCustomizable,
        is_premium: isPremium,
        status,
        image_url:
          imageUrl ||
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
        images: [
          imageUrl ||
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85',
        ],
        options,
      };

      const method = product ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSaved(data.product);
        onClose();
      } else {
        setErrorMessage(data.error || 'Failed to save product.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-onyx/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl bg-canvas border border-hairline-dark/20 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col font-sans"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-hairline-light flex items-center justify-between bg-[#ECE9E2]/50">
          <div>
            <span className="font-heading text-xs tracking-apple-widest text-slate font-light uppercase block">
              Level X 3D &bull; Inventory Management
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
              {product ? `Edit Product: ${product.name}` : 'Create Bespoke Product'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-hairline-light transition-colors text-slate hover:text-ink"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Core Details */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs uppercase tracking-apple-wide text-slate font-light border-b border-hairline-light pb-2">
              1. General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Product Name <span className="text-ink">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Lumina Voronoi Designer Lamp"
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="lumina-voronoi-designer-lamp"
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink font-mono outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none cursor-pointer"
                >
                  <option value="active">Active (Visible in Store)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Description & Archival Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Parametric SLA lattice lamp calculated using 3D Voronoi cell partitioning..."
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none transition-colors resize-y"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shelf, Category & Pricing */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs uppercase tracking-apple-wide text-slate font-light border-b border-hairline-light pb-2">
              2. Shelf, Classification & Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Curated Shelf
                </label>
                <select
                  value={shelf}
                  onChange={(e) => {
                    const newShelf = e.target.value;
                    setShelf(newShelf);
                    const shelfObj = SHELVES_DATA.find((s) => s.shelf === newShelf);
                    if (shelfObj && shelfObj.categories.length > 0) {
                      setCategory(shelfObj.categories[0].name);
                    }
                  }}
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none cursor-pointer"
                >
                  {SHELVES_DATA.map((s) => (
                    <option key={s.shelf} value={s.shelf}>
                      {s.shelf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Specific Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm text-ink outline-none cursor-pointer"
                >
                  {currentShelfObj.categories.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Price (INR &#8377;) <span className="text-ink">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={100}
                  value={priceInr}
                  onChange={(e) => setPriceInr(Number(e.target.value))}
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-ink outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Compare Price (&#8377;)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={compareAtPriceInr || ''}
                  onChange={(e) =>
                    setCompareAtPriceInr(e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="Optional"
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-ink outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                  Inventory Stock
                </label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-ink outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col justify-center space-y-2 pt-4">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-sans text-ink">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="w-4 h-4 accent-ink rounded cursor-pointer"
                  />
                  <span>Signature / Premium Shelf</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-sans text-ink">
                  <input
                    type="checkbox"
                    checked={isCustomizable}
                    onChange={(e) => setIsCustomizable(e.target.checked)}
                    className="w-4 h-4 accent-ink rounded cursor-pointer"
                  />
                  <span>Customizable by Buyer</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Product Image & Supabase Storage */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs uppercase tracking-apple-wide text-slate font-light border-b border-hairline-light pb-2">
              3. Visual Asset & Supabase Storage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Preview Thumbnail */}
              <div className="md:col-span-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#ECE9E2] border border-hairline-light flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Product preview"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-mono text-slate uppercase">No Image Loaded</span>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="md:col-span-8 space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-hairline-dark/30 hover:border-ink rounded-2xl text-center cursor-pointer transition-colors bg-white hover:bg-slate-50/50 space-y-2"
                >
                  <Upload className="w-6 h-6 mx-auto text-slate" />
                  <p className="text-xs text-ink font-medium">
                    {isUploading
                      ? 'Uploading to Supabase Storage...'
                      : 'Click to upload product image to Supabase Storage'}
                  </p>
                  <p className="text-[11px] text-slate font-mono">
                    Accepts PNG, JPG, WEBP (stored in bucket product-images)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate tracking-wider block">
                    Or Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-ink outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Customizable Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline-light pb-2">
              <h3 className="font-heading text-xs uppercase tracking-apple-wide text-slate font-light">
                4. Customizable Options ({options.length})
              </h3>
              <span className="text-[10px] font-mono text-slate">
                Colour swatches, size choices, engraving text fields
              </span>
            </div>

            {/* List Existing Options */}
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div
                  key={opt.id || idx}
                  className="p-3.5 bg-white rounded-xl border border-hairline-light flex items-center justify-between gap-4 text-xs font-sans"
                >
                  <div>
                    <span className="font-medium text-ink block">{opt.name}</span>
                    <span className="text-[11px] text-slate font-mono">
                      Type: <strong className="text-ink">{opt.type}</strong> &bull; Values:{' '}
                      {opt.values.map((v) => v.label || v.value).join(', ')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1 text-slate hover:text-red-600 transition-colors"
                    title="Remove option"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Option Inputs */}
            <div className="p-4 bg-[#ECE9E2]/40 rounded-2xl border border-hairline-light space-y-3">
              <span className="text-xs font-heading uppercase text-ink font-light block">
                Add Custom Option
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Option Name (e.g. Size, Tone)"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  className="bg-white border border-hairline-light rounded-xl px-3 py-2 text-xs text-ink outline-none"
                />

                <select
                  value={newOptionType}
                  onChange={(e) => setNewOptionType(e.target.value as any)}
                  className="bg-white border border-hairline-light rounded-xl px-3 py-2 text-xs text-ink outline-none"
                >
                  <option value="select">Dropdown Select</option>
                  <option value="color">Colour Swatch</option>
                  <option value="text">Text Field (Engraving)</option>
                </select>

                <input
                  type="text"
                  placeholder="Values separated by comma (e.g. 15cm, 25cm)"
                  value={newOptionValuesRaw}
                  onChange={(e) => setNewOptionValuesRaw(e.target.value)}
                  className="bg-white border border-hairline-light rounded-xl px-3 py-2 text-xs text-ink outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddOption}
                className="py-2 px-4 rounded-xl border border-hairline-light hover:border-ink bg-white text-xs font-sans text-ink flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Option To Product</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-hairline-light flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl border border-hairline-light hover:bg-slate-100 text-xs font-sans text-slate transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="py-3 px-6 rounded-xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-apple-wide uppercase transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-chalk/30 border-t-chalk rounded-full animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{product ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
