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
    <div className="w-full overflow-hidden bg-amber-400 text-black py-2.5 border-y-2 border-black font-black">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="mx-4 md:mx-8 text-[11px] md:text-xs tracking-[0.15em] uppercase flex items-center gap-3 md:gap-5"
          >
            <span className="text-base">🪔</span>
            <span className="font-black text-black">
              DIWALI FESTIVE SALE: CODE <strong className="bg-black text-amber-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">DIWALI20</strong> FOR 20% OFF
            </span>
            <span className="text-stone-900 font-black">•</span>
            <span className="flex items-center gap-1.5 font-bold text-stone-950">
              <Sparkles size={14} className="text-black shrink-0" />
              50ML EDP BY HARSH BENIWAL (25%+ FRENCH OILS)
            </span>
            <span className="text-stone-900 font-black">•</span>
            <span className="flex items-center gap-1.5 font-bold text-stone-950">
              <Truck size={14} className="text-black shrink-0" />
              FREE EXPRESS DELIVERY & COD ACROSS INDIA
            </span>
            <span className="text-stone-900 font-black">•</span>
            <span className="flex items-center gap-1.5 font-bold text-stone-950">
              <ShieldCheck size={14} className="text-black shrink-0" />
              100% ORIGINAL & DELUXE FESTIVE PACKAGING
            </span>
            <span className="text-stone-900 font-black">•</span>
            <span className="flex items-center gap-1 text-[11px] bg-black text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
              <Clock size={12} className="shrink-0" />
              ENDS IN: {timeLeft || "00:00:00"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
