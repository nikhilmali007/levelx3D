'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, Trash2, CheckCircle2, AlertCircle, Plus, ChevronDown, ChevronUp
} from 'lucide-react';
import { AdminProduct, AdminProductOption, slugify } from '@/lib/supabase/admin';
import { SHELVES_DATA } from '@/lib/products-data';
import { formatPrice } from '@/lib/utils';
import { compressImage } from '@/lib/image-utils';

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
  const [description, setDescription] = useState('');
  const [combinedCategory, setCombinedCategory] = useState('');
  const [priceInr, setPriceInr] = useState<number>(15000);
  
  // Advanced State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [compareAtPriceInr, setCompareAtPriceInr] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [options, setOptions] = useState<AdminProductOption[]>([]);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionType, setNewOptionType] = useState<'color' | 'select' | 'text'>('select');
  const [newOptionValuesRaw, setNewOptionValuesRaw] = useState('');

  // Image State
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<{ id: string; file: File; progress: number; preview: string }[]>([]);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const categoryOptions = SHELVES_DATA.flatMap(shelf => 
    shelf.categories.map(cat => ({
      value: `${shelf.shelf}__${cat.name}`,
      label: `${shelf.shelf} > ${cat.name}`,
      shelf: shelf.shelf,
      category: cat.name
    }))
  );

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setCombinedCategory(`${product.shelf}__${product.category}`);
      setPriceInr(product.price_inr);
      setCompareAtPriceInr(product.compare_at_price_inr);
      setStock(product.stock ?? 10);
      setIsCustomizable(Boolean(product.is_customizable));
      setIsPremium(Boolean(product.is_premium));
      setStatus(product.status || 'active');
      const prodImages = product.images && product.images.length > 0
        ? product.images
        : product.image_url ? [product.image_url] : [];
      setImages(prodImages);
      setOptions(product.options || []);
    } else {
      setName('');
      setDescription('');
      if (categoryOptions.length > 0) setCombinedCategory(categoryOptions[0].value);
      setPriceInr(14500);
      setCompareAtPriceInr(undefined);
      setStock(12);
      setIsCustomizable(false);
      setIsPremium(false);
      setStatus('active');
      setImages([]);
      setOptions([
        {
          id: 'opt-1',
          name: 'Material Finish',
          type: 'select',
          values: [
            { label: 'Matte Obsidian PA12', value: 'Matte Obsidian PA12' },
            { label: 'Raw Alabaster Gypsum', value: 'Raw Alabaster Gypsum' },
          ],
        },
      ]);
    }
    setErrorMessage(null);
    setUploadingImages([]);
    setShowAdvanced(false);
  }, [product, isOpen]);

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

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setErrorMessage(null);

    const newUploads = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      preview: URL.createObjectURL(file)
    }));

    setUploadingImages(prev => [...prev, ...newUploads]);

    const uploadPromises = newUploads.map(async (uploadItem) => {
      try {
        const compressedBlob = await compressImage(uploadItem.file, 1200, 0.8);
        const compressedFile = new File([compressedBlob], uploadItem.file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        const formData = new FormData();
        formData.append('file', compressedFile);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'x-admin-key': sessionStorage.getItem('levelx3d_admin_passkey') || '',
          },
          body: formData,
        });

        const data = await res.json();
        
        setUploadingImages(prev => prev.filter(u => u.id !== uploadItem.id));
        
        if (res.ok && data.url) {
          setImages(prev => [...prev, data.url]);
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (err: any) {
        setUploadingImages(prev => prev.filter(u => u.id !== uploadItem.id));
        setErrorMessage(prev => prev ? `${prev} | ${err.message}` : err.message);
      }
    });

    await Promise.all(uploadPromises);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !priceInr || priceInr < 0) {
      setErrorMessage('Valid name and price are required.');
      return;
    }

    if (uploadingImages.length > 0) {
      setErrorMessage('Please wait for all images to finish uploading.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=85'];
      const primaryImage = finalImages[0];
      
      const catOpt = categoryOptions.find(c => c.value === combinedCategory) || categoryOptions[0];

      const payload = {
        id: product?.id,
        name: name.trim(),
        slug: product?.slug || slugify(name.trim()),
        description: description.trim(),
        shelf: catOpt.shelf,
        category: catOpt.category,
        price_inr: Number(priceInr),
        compare_at_price_inr: compareAtPriceInr ? Number(compareAtPriceInr) : undefined,
        stock: Number(stock),
        is_customizable: isCustomizable,
        is_premium: isPremium,
        status,
        image_url: primaryImage,
        images: finalImages,
        options,
      };

      const res = await fetch('/api/admin/products', {
        method: product ? 'PUT' : 'POST',
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
        className="w-full max-w-2xl bg-canvas border border-hairline-dark/20 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col font-sans"
      >
        <div className="p-6 border-b border-hairline-light flex items-center justify-between bg-white">
          <h2 className="font-heading text-xl sm:text-2xl font-light tracking-apple-wide text-ink uppercase">
            {product ? 'Edit Product' : 'Create Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider">Name <span className="text-red-500">*</span></label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-sm text-ink outline-none" placeholder="Product Title" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider">Price (₹) <span className="text-red-500">*</span></label>
                <input required type="number" min={0} step={100} value={priceInr} onChange={(e) => setPriceInr(Number(e.target.value))} className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-sm font-mono text-ink outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider">Category</label>
                <select value={combinedCategory} onChange={(e) => setCombinedCategory(e.target.value)} className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-sm text-ink outline-none">
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider">Images (Drag & Drop)</label>
                
                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-hairline-light group">
                      <Image src={img} alt="Product" fill className="object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                  
                  {uploadingImages.map((up) => (
                    <div key={up.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-hairline-light">
                      <Image src={up.preview} alt="Uploading" fill className="object-cover opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDragging ? 'border-ink bg-slate-50' : 'border-hairline-light hover:border-slate-400 bg-white'}`}
                >
                  <Upload className="w-5 h-5 mx-auto text-slate mb-2" />
                  <p className="text-sm font-medium text-ink">{isDragging ? 'Drop images here' : 'Click or drop images here'}</p>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => e.target.files && processFiles(e.target.files)} className="hidden" />
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate tracking-wider">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-sm text-ink outline-none resize-none" placeholder="Short description..." />
              </div>
            </div>
          </div>

          <div className="border-t border-hairline-light pt-4">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-sm font-medium text-ink hover:text-slate-600 w-full text-left">
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Show Advanced Options
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-slate tracking-wider">Compare Price (₹)</label>
                      <input type="number" min={0} step={100} value={compareAtPriceInr || ''} onChange={(e) => setCompareAtPriceInr(e.target.value ? Number(e.target.value) : undefined)} className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-sm font-mono text-ink outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-slate tracking-wider">Stock</label>
                      <input type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-sm font-mono text-ink outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-slate tracking-wider">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-white border border-hairline-light focus:border-ink rounded-xl px-4 py-3 text-sm text-ink outline-none">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                        <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4 rounded text-ink" />
                        Premium Product
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                        <input type="checkbox" checked={isCustomizable} onChange={(e) => setIsCustomizable(e.target.checked)} className="w-4 h-4 rounded text-ink" />
                        Customizable
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-hairline-light">
                    <h4 className="text-xs font-mono uppercase text-slate tracking-wider mb-3">Custom Options</h4>
                    <div className="space-y-2 mb-3">
                      {options.map((opt, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-hairline-light flex justify-between items-center text-sm">
                          <div><span className="font-medium">{opt.name}</span> <span className="text-slate text-xs ml-2">({opt.type})</span></div>
                          <button type="button" onClick={() => handleRemoveOption(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" placeholder="Name" value={newOptionName} onChange={(e) => setNewOptionName(e.target.value)} className="bg-white border border-hairline-light rounded-lg px-3 py-2 text-sm" />
                      <select value={newOptionType} onChange={(e) => setNewOptionType(e.target.value as any)} className="bg-white border border-hairline-light rounded-lg px-3 py-2 text-sm">
                        <option value="select">Select</option>
                        <option value="color">Color</option>
                        <option value="text">Text</option>
                      </select>
                      <input type="text" placeholder="Values (comma sep)" value={newOptionValuesRaw} onChange={(e) => setNewOptionValuesRaw(e.target.value)} className="bg-white border border-hairline-light rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <button type="button" onClick={handleAddOption} className="mt-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1"><Plus className="w-3 h-3" /> Add Option</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-hairline-light flex items-center justify-end gap-3 sticky bottom-0 bg-canvas pb-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting || uploadingImages.length > 0} className="px-6 py-2.5 rounded-xl bg-onyx text-chalk text-sm font-medium hover:bg-ink transition-colors flex items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Save Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
