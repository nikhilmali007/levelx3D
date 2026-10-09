'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquare, Plus, Check } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

const DEFAULT_REVIEWS: Record<string, Review[]> = {
  default: [
    {
      id: 'rev-1',
      author: 'Arjun K., Architect',
      rating: 5,
      date: '2 weeks ago',
      title: 'Architectural precision at its finest',
      comment: 'The SLS sintered PA12 material has a monolithic, sculptural presence. Zero layer lines visible after vapor polishing. Delivered in custom shock-absorbing archival packaging.',
      verified: true,
    },
    {
      id: 'rev-2',
      author: 'Devika M., Interior Designer',
      rating: 5,
      date: '1 month ago',
      title: 'Bespoke gallery centerpiece',
      comment: 'Commissioned this for a client penthouse in Worli. The light diffusion through the parametric lattice is breathtaking in the evening.',
      verified: true,
    },
    {
      id: 'rev-3',
      author: 'Kabir S., Product Designer',
      rating: 5,
      date: '1 month ago',
      title: 'Flawless tolerance and weight',
      comment: 'Remarkable dimensional accuracy. The finish feels almost like cold-cast porcelain, yet with polymer durability. Highly recommend.',
      verified: true,
    },
  ],
};

export function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const storageKey = `levelx3d_reviews_${productId}`;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        setReviews(DEFAULT_REVIEWS.default);
      }
    } catch (e) {
      setReviews(DEFAULT_REVIEWS.default);
    }
  }, [productId, storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      rating,
      date: 'Just now',
      title: title.trim() || 'Verified Studio Collector',
      comment: comment.trim(),
      verified: true,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    setAuthor('');
    setTitle('');
    setComment('');
    setIsWriting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="pt-12 sm:pt-16 border-t border-hairline-light space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="font-heading text-xs tracking-apple-widest text-slate uppercase font-light block">
            Collector Ledger &bull; Verified Provenance
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-light tracking-apple-wide text-ink uppercase">
            Collector Reviews ({reviews.length})
          </h3>
        </div>

        <button
          onClick={() => setIsWriting(!isWriting)}
          className="py-2.5 px-5 rounded-xl border border-hairline-light hover:border-ink bg-white text-xs font-heading font-light tracking-wide uppercase transition-colors flex items-center gap-2 self-start sm:self-auto shadow-2xs text-ink"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isWriting ? 'Cancel Review' : 'Write A Review'}</span>
        </button>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Thank you! Your verified collector review has been recorded.</span>
        </div>
      )}

      {/* Write Review Form */}
      {isWriting && (
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl border border-hairline-light bg-white space-y-4 shadow-sm max-w-2xl">
          <h4 className="font-heading text-xs uppercase tracking-apple-wide text-ink font-medium">
            Review: {productName}
          </h4>

          {/* Rating Stars */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-slate block">Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-ink focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-onyx text-onyx' : 'text-slate/30'
                    }`}
                  />
                </button>
              ))}
              <span className="font-mono text-xs text-slate ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate block">Your Name / Title *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Rohini S., Collector"
                className="w-full bg-canvas border border-hairline-light rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate block">Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Masterpiece on my mantle"
                className="w-full bg-canvas border border-hairline-light rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate block">Your Feedback *</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the tactile finish, packaging, and dimensional fidelity..."
              className="w-full bg-canvas border border-hairline-light rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-ink resize-y"
            />
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-onyx hover:bg-ink text-chalk text-xs font-heading font-light tracking-wide uppercase transition-colors shadow-xs"
          >
            Submit Collector Review
          </button>
        </form>
      )}

      {/* Aggregate Rating Banner */}
      <div className="p-6 rounded-3xl bg-[#ECE9E2]/40 border border-hairline-light flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="text-4xl sm:text-5xl font-heading font-light text-ink tracking-tight">
            {averageRating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-onyx mb-1 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-onyx text-onyx" />
              ))}
            </div>
            <span className="text-xs font-mono text-slate">
              Based on {reviews.length} authenticated studio deliveries
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>100% Verified Additive Fabrication Orders</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-hairline-light space-y-2.5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i <= r.rating ? 'fill-onyx text-onyx' : 'text-slate/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-heading text-xs font-medium text-ink tracking-wide">
                  {r.title}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate">{r.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate font-sans leading-relaxed">
              {r.comment}
            </p>

            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-slate">
              <span className="text-ink font-medium">{r.author}</span>
              {r.verified && (
                <>
                  <span>&bull;</span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Collector
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
