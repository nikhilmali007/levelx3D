import { Skeleton } from '@/components/ui/skeleton';

export default function ShopLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10 animate-fade-in font-sans">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-40 rounded-full" />

      {/* Catalog Title skeleton */}
      <div className="space-y-3 max-w-md">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-10 w-80 rounded-2xl" />
        <Skeleton className="h-4 w-full rounded-full" />
      </div>

      {/* Filter and Shelf Pills bar skeleton */}
      <div className="flex gap-2.5 overflow-x-hidden py-2 border-y border-hairline-light">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-9 w-32 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Products Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-3xl border border-hairline-light bg-white/40 space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-5 w-4/5 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
              <div className="flex items-center justify-between pt-3">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
