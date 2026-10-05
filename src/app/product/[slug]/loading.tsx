import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-8 animate-fade-in font-sans">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-48 rounded-full" />

      {/* 2-Column Product Gallery + Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Gallery Skeleton (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right: Details Skeleton (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-8 w-40 rounded-xl" />
          </div>

          <div className="space-y-2 py-4 border-y border-hairline-light">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-4 w-2/3 rounded-full" />
          </div>

          {/* Options Swatches */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            <div className="flex gap-2.5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="pt-4 space-y-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-4 w-48 mx-auto rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
