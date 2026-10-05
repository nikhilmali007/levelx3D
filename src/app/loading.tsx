import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 animate-fade-in">
      {/* Header bar skeleton */}
      <div className="space-y-4 max-w-lg">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 w-96 rounded-2xl" />
        <Skeleton className="h-4 w-64 rounded-full" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-3xl border border-hairline-light space-y-4 bg-white/40">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
