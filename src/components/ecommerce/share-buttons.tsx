'use client';

import { useState } from 'react';
import { Share2, Check, Twitter, Facebook, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Product } from '@/lib/products-data';

interface ShareButtonsProps {
  product: Product;
}

export function ShareButtons({ product }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : `https://levelx3d.com/product/${product.slug}`;
  };

  const shareText = `Check out the ${product.name} at Level X 3D!`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(getShareUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch (e) {
      console.warn('Could not copy link', e);
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(shareText);
    
    let shareLink = '';
    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-2 pt-4 border-t border-hairline-light">
      <span className="text-[10px] font-mono text-slate uppercase mr-2">Share:</span>
      <button
        onClick={() => handleShare('whatsapp')}
        className="p-2 rounded-full border border-hairline-light text-slate hover:text-[#25D366] hover:border-[#25D366] transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-full border border-hairline-light text-slate hover:text-sky-500 hover:border-sky-500 transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-full border border-hairline-light text-slate hover:text-blue-600 hover:border-blue-600 transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopy}
        className="p-2 rounded-full border border-hairline-light text-slate hover:text-ink hover:border-ink transition-colors"
        title="Copy Link"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}
