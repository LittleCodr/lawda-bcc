"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

export default function LiveViewerCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Generate random count only on the client to avoid hydration mismatch
    setCount(Math.floor(Math.random() * 50) + 20);
    
    // Slowly fluctuate the count to feel alive
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(15, Math.min(70, prev + delta));
      });
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null; // Don't render on server / before hydration

  return (
    <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 w-fit rounded-sm">
      <Eye size={14} className="animate-pulse" />
      <p className="text-[11px] font-medium tracking-wide uppercase">{count} people looking</p>
    </div>
  );
}
