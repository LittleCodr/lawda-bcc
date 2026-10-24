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
    <div className="w-full overflow-hidden bg-white text-[#222222] py-2.5 border-y border-[#ebebeb] font-medium">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="mx-4 md:mx-8 text-[12px] tracking-normal flex items-center gap-3 md:gap-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff385c]"></span>
            <span className="font-semibold text-[#222222]">
              Festive Offer: Code <strong className="bg-[#f7f7f7] border border-[#dddddd] text-[#ff385c] px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold">DIWALI20</strong> for 20% OFF
            </span>
            <span className="text-[#dddddd]">•</span>
            <span className="flex items-center gap-1.5 text-[#6a6a6a]">
              <Sparkles size={13} className="text-[#ff385c] shrink-0" />
              50ML EDP by Harsh Beniwal (25%+ French Oils)
            </span>
            <span className="text-[#dddddd]">•</span>
            <span className="flex items-center gap-1.5 text-[#6a6a6a]">
              <Truck size={13} className="text-[#222222] shrink-0" />
              Free Pan-India Express Delivery
            </span>
            <span className="text-[#dddddd]">•</span>
            <span className="flex items-center gap-1.5 text-[#6a6a6a]">
              <ShieldCheck size={13} className="text-[#222222] shrink-0" />
              Complimentary 7ML Paradox Tester Included
            </span>
            <span className="text-[#dddddd]">•</span>
            <span className="flex items-center gap-1 text-[11px] bg-[#f7f7f7] text-[#222222] px-2.5 py-0.5 rounded-full font-mono border border-[#ebebeb]">
              <Clock size={11} className="shrink-0 text-[#ff385c]" />
              Ends in: {timeLeft || "00:00:00"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
