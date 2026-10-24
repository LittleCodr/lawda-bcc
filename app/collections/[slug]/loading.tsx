import { Skeleton, ProductCardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="bg-white min-h-screen text-[#222222] py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 space-y-8">
        
        {/* Banner Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>

        {/* 2 Highlight Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-[14px]" />
          <Skeleton className="h-64 rounded-[14px]" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
}
