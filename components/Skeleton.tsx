import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#ebebeb] animate-pulse rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col relative rounded-[14px] bg-white border border-[#ebebeb] p-3 shadow-airbnb">
      {/* Photo Plate Skeleton */}
      <div className="relative aspect-square w-full rounded-[10px] bg-[#f2f2f2] animate-pulse overflow-hidden">
        {/* Shimmer line */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      {/* Meta block skeleton */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-8 rounded" />
        </div>
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ebebeb]">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="bg-white min-h-screen pt-8 pb-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-3.5 w-12 rounded" />
          <span className="text-[#dddddd]">/</span>
          <Skeleton className="h-3.5 w-24 rounded" />
          <span className="text-[#dddddd]">/</span>
          <Skeleton className="h-3.5 w-32 rounded" />
        </div>

        {/* 2-Column Listing Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (~64%) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Gallery Skeleton */}
            <div className="aspect-square w-full rounded-[14px] bg-[#f2f2f2] animate-pulse relative overflow-hidden border border-[#ebebeb]">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>

            {/* Thumbnail dots skeleton */}
            <div className="flex gap-3 justify-center">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="w-16 h-16 rounded-lg" />
            </div>

            {/* Amenity Rows Skeleton */}
            <div className="border-y border-[#ebebeb] py-4 divide-y divide-[#ebebeb] space-y-4">
              <div className="flex items-center gap-3 pt-3">
                <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (~36% Sticky Reservation/Checkout Card) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#dddddd] rounded-[14px] p-6 sm:p-7 shadow-airbnb space-y-5">
              {/* Price & Rating */}
              <div className="flex justify-between items-center pb-4 border-b border-[#ebebeb]">
                <div className="space-y-1">
                  <Skeleton className="h-8 w-28 rounded" />
                  <Skeleton className="h-3.5 w-36 rounded" />
                </div>
                <Skeleton className="h-6 w-16 rounded" />
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-4/5 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>

              {/* Countdown Ticker */}
              <Skeleton className="h-10 w-full rounded-lg" />

              {/* Variant Selector */}
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3.5 w-24 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </div>

              {/* Free Gift Strip */}
              <Skeleton className="h-14 w-full rounded-lg" />

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#ebebeb]">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3.5 w-16 rounded" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-3.5 w-12 rounded" />
                </div>
                <div className="flex justify-between pt-2 border-t border-[#ebebeb]">
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-20 rounded" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function CategoryPillsSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-28 rounded-full shrink-0" />
      ))}
    </div>
  );
}
