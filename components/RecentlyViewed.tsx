"use client";

import { useEffect, useState } from "react";
import type { ProductSummary } from "@/lib/catalog-types";
import ProductCard from "@/components/ProductCard";

const RECENT_KEY = "octopus_recently_viewed_v1";

export default function RecentlyViewed({
  currentProduct,
}: {
  currentProduct: ProductSummary;
}) {
  const [recentItems, setRecentItems] = useState<ProductSummary[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(RECENT_KEY);
        const parsed: ProductSummary[] = raw ? JSON.parse(raw) : [];
        const others = Array.isArray(parsed)
          ? parsed.filter((item) => item && item.handle !== currentProduct.handle)
          : [];
        setRecentItems(others.slice(0, 6));

        const compactCurrent: ProductSummary = {
          ...currentProduct,
          notes: null,
        };
        const updated = [compactCurrent, ...others].slice(0, 8);
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage availability errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [currentProduct]);

  if (recentItems.length === 0) return null;

  return (
    <section
      aria-label="Recently viewed perfumes"
      className="py-10 sm:py-12 border-t border-[#E8E6E1]"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
            Your Session History
          </p>
          <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424]">
            Recently Viewed Bottles
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {recentItems.slice(0, 5).map((item, idx) => (
            <ProductCard key={item.id} product={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
