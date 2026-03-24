export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white shadow-sm p-6 ${className}`} aria-hidden="true">
      <div className="bg-gray-200 rounded-lg aspect-[4/3] mb-4" />
      <div className="bg-gray-200 rounded h-5 w-3/4 mb-2" />
      <div className="bg-gray-200 rounded h-4 w-full" />
    </div>
  );
}

export function SkeletonSection({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`} aria-hidden="true">
      <div className="bg-gray-200 rounded h-8 w-2/3 mx-auto" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="bg-gray-200 rounded h-4 w-full max-w-[600px] mx-auto" />
      ))}
    </div>
  );
}

export default function PageSkeleton() {
  return (
    <div className="min-h-screen" role="status" aria-label="Loading content">
      {/* Hero skeleton */}
      <div className="pt-[calc(70px+2rem)] pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-[800px] mx-auto px-4 text-center space-y-6">
          <div className="space-y-3">
            <SkeletonLine className="h-10 w-4/5 mx-auto" />
            <SkeletonLine className="h-10 w-3/5 mx-auto" />
            <SkeletonLine className="h-10 w-2/5 mx-auto" />
          </div>
          <SkeletonLine className="h-5 w-3/4 mx-auto" />
          <div className="flex justify-center gap-4">
            <SkeletonLine className="h-14 w-48 rounded-lg" />
            <SkeletonLine className="h-14 w-36 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <SkeletonSection lines={2} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
