"use client";

import { Zap, Clock } from "lucide-react";
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
            className="mx-8 text-[11px] tracking-[0.2em] font-bold uppercase flex items-center gap-4"
          >
            <Zap size={14} className="text-yellow-300 fill-yellow-300" />
            FREEDOM SALE ON INDEPENDENCE DAY! USE CODE FREEDOM FOR 15% OFF 
            <Clock size={14} className="text-yellow-300 ml-2" />
            ENDS IN: {timeLeft || "00:00:00"}
          </span>
        ))}
      </div>
    </div>
  );
}
