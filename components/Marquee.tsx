"use client";

import { Heart, Clock, Gift } from "lucide-react";
import { useEffect, useState } from "react";

export default function Marquee() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      // Countdown to the end of the day
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

  const items = Array.from({ length: 6 }).map((_, i) => i);

  return (
    <div className="w-full overflow-hidden bg-red-600 text-white py-3 border-b border-red-700">
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="mx-4 md:mx-8 text-[9px] md:text-[11px] tracking-[0.2em] font-bold uppercase flex items-center gap-2 md:gap-4"
          >
            <Heart size={14} className="text-yellow-300 fill-yellow-300 shrink-0" />
            <span>SIBLING LOVE SALE! CODE ILYBEHENA FOR ₹150 OFF</span>
            <Gift size={14} className="text-yellow-300 shrink-0" />
            <span className="flex items-center gap-1"><Clock size={14} className="text-yellow-300 shrink-0" />
            ENDS IN: {timeLeft || "00:00:00"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
