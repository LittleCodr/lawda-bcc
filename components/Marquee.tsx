"use client";

import { Sparkles, ShieldCheck, Truck, Gift } from "lucide-react";

export default function Marquee() {
  const items = Array.from({ length: 4 }).map((_, i) => i);

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-amber-50 via-white to-amber-50 text-[#222222] py-2.5 border-y border-amber-200/80 font-medium text-xs">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="mx-4 md:mx-8 text-[12px] tracking-normal flex items-center gap-3 md:gap-5"
          >
            <span className="text-amber-600 font-bold">🪔</span>
            <span className="font-bold text-[#222222]">
              Diwali Sale: Code <strong className="bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-extrabold">DIWALI20</strong> for 20% OFF
            </span>
            <span className="text-amber-300">•</span>
            <span className="flex items-center gap-1 text-[#3f3f3f]">
              <Gift size={13} className="text-[#ff385c] shrink-0" />
              Free 7ML Paradox Tester (₹399) + Deluxe Festive Box
            </span>
            <span className="text-amber-300">•</span>
            <span className="flex items-center gap-1 text-[#3f3f3f]">
              <Sparkles size={13} className="text-amber-600 shrink-0" />
              25%+ French Oils • 12H+ Longevity by Harsh Beniwal
            </span>
            <span className="text-amber-300">•</span>
            <span className="flex items-center gap-1 text-[#3f3f3f]">
              <Truck size={13} className="text-[#222222] shrink-0" />
              Guaranteed Express Pan-India Delivery for Diwali
            </span>
            <span className="text-amber-300">•</span>
            <span className="flex items-center gap-1 text-[#3f3f3f]">
              <ShieldCheck size={13} className="text-green-700 shrink-0" />
              100% Original Flagship Quality
            </span>
            <span className="text-amber-300">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
