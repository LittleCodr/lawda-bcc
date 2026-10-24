"use client";

import { Clock, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function Marquee() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      // Countdown to midnight
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const items = Array.from({ length: 4 }).map((_, i) => i);

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-amber-400/90 via-amber-300/95 to-yellow-400/90 backdrop-blur-md text-stone-950 py-2.5 border-y border-amber-400/30 font-bold shadow-sm">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="mx-4 md:mx-8 text-[11px] md:text-xs tracking-[0.15em] uppercase flex items-center gap-3 md:gap-5"
          >
            <span className="text-base animate-soft-pulse">🪔</span>
            <span className="font-extrabold text-stone-950">
              DIWALI FESTIVE SALE: CODE <strong className="bg-stone-950/90 text-amber-300 px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm font-mono text-xs">DIWALI20</strong> FOR 20% OFF
            </span>
            <span className="text-stone-700/60 font-black">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-stone-900">
              <Sparkles size={14} className="text-amber-800 shrink-0" />
              50ML EDP BY HARSH BENIWAL (25%+ FRENCH OILS)
            </span>
            <span className="text-stone-700/60 font-black">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-stone-900">
              <Truck size={14} className="text-amber-800 shrink-0" />
              FREE PAN-INDIA EXPRESS SHIPPING • 100% PREPAID SECURE
            </span>
            <span className="text-stone-700/60 font-black">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-stone-900">
              <ShieldCheck size={14} className="text-amber-800 shrink-0" />
              100% ORIGINAL & DELUXE FESTIVE PACKAGING
            </span>
            <span className="text-stone-700/60 font-black">•</span>
            <span className="flex items-center gap-1 text-[11px] bg-stone-950/90 text-amber-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-white/10 shadow-sm">
              <Clock size={12} className="shrink-0 text-amber-400" />
              ENDS IN: {timeLeft || "00:00:00"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
