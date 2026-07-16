"use client";

import { Zap } from "lucide-react";

export default function Marquee() {
  const items = Array.from({ length: 6 }).map((_, i) => i);

  return (
    <div className="w-full overflow-hidden bg-ink text-paper py-3 border-b border-ink/5">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="mx-8 text-[10px] tracking-[0.3em] font-medium uppercase flex items-center gap-4"
          >
            <Zap size={14} className="text-gold fill-gold" />
            USE CODE HARSH10 FOR 10% OFF ✦ FREE GIFT ON ORDERS OVER ₹1499 ✦ CRAFTED BY HARSH BENIWAL
          </span>
        ))}
      </div>
    </div>
  );
}
