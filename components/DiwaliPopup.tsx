"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, Gift } from "lucide-react";
import toast from "react-hot-toast";

export default function DiwaliPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds on first visit of session
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("diwaliPopupSeen");
      if (!hasSeenPopup) {
        setIsOpen(true);
        sessionStorage.setItem("diwaliPopupSeen", "true");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const copyCode = () => {
    navigator.clipboard.writeText("DIWALI20");
    setCopied(true);
    toast.success("Coupon code DIWALI20 copied! 20% OFF applied at checkout.", {
      style: {
        borderRadius: "16px",
        padding: "14px 20px",
        color: "#09090b",
        fontWeight: "600",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
      },
    });
    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md backdrop-blur-2xl bg-white/95 border border-white/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close popup"
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-full flex items-center justify-center text-stone-800 hover:bg-white shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <X size={18} strokeWidth={2.2} />
        </button>

        {/* Festive Header Banner */}
        <div className="bg-gradient-to-r from-[#800020] via-[#a00028] to-[#b8860b] p-7 text-center text-white border-b border-amber-300/30 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-yellow-400/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-yellow-400/25 rounded-full blur-2xl pointer-events-none" />

          {/* Festive Badge */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-950 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider mb-3 shadow-sm border border-amber-300/50">
            <span>🪔</span> SHUBH DIWALI DHAMAKA <span>✨</span>
          </div>

          <h2 className="font-serif text-3xl font-extrabold text-white tracking-wide leading-tight mb-1 drop-shadow-sm">
            Light Up Their World
          </h2>
          <p className="text-amber-200 text-xs uppercase tracking-widest font-bold">
            Grand Diwali Festive Gifting Offer
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center bg-gradient-to-b from-[#FAF7F2] to-white/90">
          <p className="text-stone-700 text-xs md:text-sm font-medium leading-relaxed mb-5">
            Celebrate the Festival of Lights with Harsh Beniwal's official luxury fragrances! 100% Original 50ML Eau De Parfums with 25%+ French oils & 12H beast-mode projection. Plus a FREE 7ML Paradox tester with every order!
          </p>

          {/* Coupon Card Ticket */}
          <div className="bg-white/80 backdrop-blur-md border border-amber-300/60 rounded-2xl p-4 mb-5 shadow-sm relative">
            <div className="flex items-center justify-between text-left mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#800020] block">
                  Limited Festive Code
                </span>
                <span className="text-2xl font-black text-stone-900 tracking-wider font-mono">
                  DIWALI20
                </span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 rounded-xl px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            
            <div className="border-t border-stone-200/80 pt-2 flex flex-col gap-1 text-[11px] text-stone-600 font-medium text-left">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                ✓ Flat 20% OFF on orders above ₹499
              </span>
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                ✓ FREE 7ML Paradox EDP Tester Pack (Worth ₹399)
              </span>
              <span className="text-stone-600 flex items-center gap-1">
                ✓ FREE Luxury Festive Packaging & Card
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={copyCode}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 py-4 rounded-2xl text-xs font-extrabold uppercase tracking-[0.15em] shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/60"
          >
            <Sparkles size={16} className="text-amber-900" />
            Claim 20% Discount Now
            <Gift size={16} className="text-amber-900" />
          </button>
          
          <p className="mt-3 text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
            ⚡ Fast Pan-India Express Delivery • 100% Genuine Harsh Beniwal EDP
          </p>
        </div>
      </div>
    </div>
  );
}
