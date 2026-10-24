"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Zap, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function MobileStickyShopBar() {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCartStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 250px
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not show on product detail page (which has its own dedicated sticky product bar) or checkout
  if (!pathname || pathname.startsWith("/products/") || pathname.startsWith("/checkout")) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <aside 
        aria-label="Quick Checkout Action"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dddddd] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-4 py-2.5 lg:hidden pb-[calc(10px+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom duration-250 ease-out"
      >
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          {/* Pricing Stack */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[17px] font-bold text-[#222222] leading-none">₹999</span>
              <span className="text-[11px] text-[#929292] line-through leading-none">₹1,799</span>
              <span className="text-[10px] font-bold text-[#ff385c] bg-[#fff0f3] px-1.5 py-0.5 rounded leading-none">
                44% OFF
              </span>
            </div>
            <span className="text-[11px] text-[#6a6a6a] truncate mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Free 7ML Paradox Tester Included
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-[#222222] border border-[#dddddd] hover:border-[#222222] p-2 rounded-lg active:scale-95 transition-all relative flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="View Cart"
            >
              <ShoppingBag size={18} />
              {totalItems() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#ff385c] text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </button>

            <Link
              href="/harsh-beniwal/octopus/perfumes"
              className="bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white font-semibold py-2 px-4 rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Zap size={14} className="fill-white" />
              <span>Buy Now</span>
            </Link>
          </div>
        </div>
      </aside>
      <div className="h-16 lg:hidden"></div>
    </>
  );
}
