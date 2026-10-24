import { Skeleton, ProductCardSkeleton, CategoryPillsSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="bg-white min-h-screen text-[#222222]">
      {/* Category Pills Strip Skeleton */}
      <div className="border-b border-[#ebebeb] bg-white py-3.5 px-4 sm:px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <CategoryPillsSkeleton />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-10 space-y-12">
        
        {/* Hero Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-10 sm:h-12 w-4/5 rounded-lg" />
            <Skeleton className="h-4 w-3/5 rounded" />
            <div className="flex gap-3 pt-3">
              <Skeleton className="h-12 w-44 rounded-lg" />
              <Skeleton className="h-12 w-44 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[420px] aspect-[4/3] rounded-[14px] bg-[#f2f2f2] animate-pulse border border-[#ebebeb]" />
          </div>
        </div>

        {/* 64px Rating Trust Box Skeleton */}
        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-[14px] p-8 md:p-12 text-center max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-6 w-36 mx-auto rounded-full" />
          <Skeleton className="h-16 w-32 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-64 mx-auto rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#ebebeb]">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </div>

        {/* Marketplace 8-Card Product Grid Skeleton */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-60 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
