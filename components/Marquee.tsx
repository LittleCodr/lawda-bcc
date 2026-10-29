"use client";

import { Sparkles, ShieldCheck, Truck, Gift } from "lucide-react";

export default function Marquee() {
  const items = Array.from({ length: 4 }).map((_, i) => i);

  return (
    <div className="w-full overflow-hidden bg-stone-900 text-stone-200 py-2.5 border-y border-stone-800 font-medium text-xs">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="mx-4 md:mx-8 text-[12px] tracking-normal flex items-center gap-3 md:gap-5"
          >
            <span className="text-amber-400 font-bold">✨</span>
            <span className="font-bold text-white">
              Luxury Fragrance Sale: Code <strong className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded font-mono text-[11px] font-extrabold">LUXURY25</strong> for 25% OFF
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Gift size={13} className="text-amber-400 shrink-0" />
              Free 7ML Paradox EDP Tester (₹399) on All Orders
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Sparkles size={13} className="text-amber-400 shrink-0" />
              25%+ French Oils • 12H+ Beast-Mode Sillage
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Truck size={13} className="text-stone-400 shrink-0" />
              Complimentary Express Delivery Across India
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
              100% Authentic Sealed Bottles & Verified Batch Codes
            </span>
            <span className="text-stone-600">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
