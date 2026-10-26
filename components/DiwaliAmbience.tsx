"use client";

import { useEffect, useState } from "react";

export default function DiwaliAmbience() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
    >
      {/* Top Subtle Golden Festive Ambient Glows */}
      <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/12 via-yellow-400/8 to-transparent blur-3xl" />
      <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-gradient-to-bl from-rose-500/10 via-amber-400/8 to-transparent blur-3xl" />

      {/* Floating Shimmer Sparks in Left and Right Margins */}
      <div className="hidden lg:block">
        {/* Left Floating Festive Diya Sparkle */}
        <div className="absolute top-48 left-6 flex items-center gap-1.5 opacity-65 animate-pulse">
          <span className="text-sm">🪔</span>
          <span className="text-[10px] font-bold text-amber-700/70 tracking-widest uppercase">
            Shubh Deepavali
          </span>
        </div>

        {/* Right Floating Festive Sparkle */}
        <div className="absolute top-64 right-6 flex items-center gap-1.5 opacity-65 animate-pulse">
          <span className="text-amber-500 text-xs">✨</span>
          <span className="text-[10px] font-bold text-amber-700/70 tracking-widest uppercase">
            Festive Lights
          </span>
          <span className="text-sm">🪔</span>
        </div>

        {/* Gentle Golden Sparkle Stars */}
        <span
          className="absolute top-96 left-12 text-amber-400 text-xs animate-ping"
          style={{ animationDuration: "3s" }}
        >
          ✦
        </span>
        <span
          className="absolute top-[480px] right-14 text-amber-400 text-xs animate-ping"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          ✦
        </span>
        <span
          className="absolute top-[800px] left-10 text-yellow-500 text-[10px] animate-pulse"
          style={{ animationDuration: "2.5s" }}
        >
          ✨
        </span>
        <span
          className="absolute top-[1100px] right-10 text-amber-500 text-xs animate-pulse"
          style={{ animationDuration: "3.5s" }}
        >
          🪔
        </span>
      </div>
    </div>
  );
}
