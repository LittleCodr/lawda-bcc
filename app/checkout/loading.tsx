import { Skeleton } from "@/components/Skeleton";

export default function CheckoutLoading() {
  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Shipping Form Skeleton */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 border border-stone-200 space-y-8">
              <Skeleton className="h-8 w-48 rounded" />

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <Skeleton className="h-5 w-36 rounded" />
                  <Skeleton className="h-14 w-full rounded-[10px]" />
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <Skeleton className="h-5 w-36 rounded" />
                  <Skeleton className="h-14 w-full rounded-[10px]" />
                </div>

                <Skeleton className="h-14 w-full rounded-lg bg-[#ffd1da]" />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-stone-200 sticky top-32 space-y-6">
              <Skeleton className="h-7 w-40 rounded" />

              {/* Items Skeleton */}
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-20 h-20 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-4 w-1/4 rounded" />
                  </div>
                </div>
              </div>

              {/* Promo Skeleton */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <Skeleton className="h-3 w-24 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-xl" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                </div>
              </div>

              {/* Totals Skeleton */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-16 rounded" />
                  <Skeleton className="h-3.5 w-12 rounded" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-16 rounded" />
                  <Skeleton className="h-3.5 w-20 rounded" />
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200">
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-6 w-24 rounded" />
                </div>
              </div>

              {/* Trust Badges Skeleton */}
              <div className="grid grid-cols-4 gap-2 pt-6 border-t border-stone-100">
                <Skeleton className="h-10 rounded" />
                <Skeleton className="h-10 rounded" />
                <Skeleton className="h-10 rounded" />
                <Skeleton className="h-10 rounded" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
