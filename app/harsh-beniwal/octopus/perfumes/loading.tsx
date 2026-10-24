import { Skeleton, ProductCardSkeleton, CategoryPillsSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="bg-white min-h-screen text-[#222222] py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 space-y-8">
        
        {/* Header Breadcrumb & Title Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-9 w-80 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>

        {/* Filter Pills Skeleton */}
        <CategoryPillsSkeleton />

        {/* 9 Fragrance Marketplace Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
}
