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
        border: "2px solid #121212",
        padding: "12px 16px",
        color: "#121212",
        fontWeight: "bold",
        boxShadow: "3px 3px 0px 0px #121212",
        background: "#FFFDF7",
      },
    });
    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#FFFDF7] border-[3px] border-[#121212] rounded-2xl shadow-[8px_8px_0px_0px_#121212] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close popup"
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-white border-2 border-[#121212] rounded-full flex items-center justify-center text-[#121212] hover:bg-stone-200 shadow-[2px_2px_0px_0px_#121212] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Festive Header Banner */}
        <div className="bg-gradient-to-r from-[#800020] via-[#c00030] to-[#b8860b] p-6 text-center text-white border-b-[3px] border-[#121212] relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />

          {/* Festive Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFDE59] text-[#121212] border-2 border-[#121212] rounded-full px-3.5 py-1 text-[10px] font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_0px_#121212]">
            <span>🪔</span> SHUBH DIWALI DHAMAKA <span>✨</span>
          </div>

          <h2 className="font-serif text-3xl font-extrabold text-white tracking-wide leading-tight mb-1 drop-shadow-sm">
            Light Up Their World
          </h2>
          <p className="text-amber-200 text-xs uppercase tracking-widest font-black">
            Grand Diwali Festive Gifting Offer
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center bg-[#FAF7F2]">
          <p className="text-stone-800 text-xs md:text-sm font-semibold leading-relaxed mb-5">
            Celebrate the Festival of Lights with timeless keepsakes! Handcrafted 22K gold plated personalized jewelry & luxury Harsh Beniwal perfumes.
          </p>

          {/* Coupon Card Ticket */}
          <div className="bg-white border-2 border-dashed border-[#121212] rounded-xl p-4 mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] relative">
            <div className="flex items-center justify-between text-left mb-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#800020] block">
                  Limited Festive Code
                </span>
                <span className="text-2xl font-black text-[#121212] tracking-wider font-mono">
                  DIWALI20
                </span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 bg-[#FFDE59] text-[#121212] border-2 border-[#121212] rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            
            <div className="border-t border-stone-200 pt-2 flex flex-col gap-1 text-[11px] text-stone-600 font-medium text-left">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                ✓ Flat 20% OFF on orders above ₹499
              </span>
              <span className="text-stone-700 flex items-center gap-1">
                ✓ FREE 18K Paw Ring automatically added
              </span>
              <span className="text-stone-700 flex items-center gap-1">
                ✓ FREE Luxury Festive Packaging & Card
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={copyCode}
            className="w-full bg-[#800020] text-white border-2 border-[#121212] py-4 rounded-xl text-xs font-black uppercase tracking-[0.15em] shadow-[4px_4px_0px_0px_#121212] hover:bg-[#600018] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#121212] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} className="text-amber-300" />
            Claim 20% Discount Now
            <Gift size={16} className="text-amber-300" />
          </button>
          
          <p className="mt-3 text-[10px] text-stone-500 uppercase tracking-widest font-bold">
            ⚡ Fast Pan-India Express Delivery • 100% Genuine Harsh Beniwal EDP
          </p>
        </div>
      </div>
    </div>
  );
}
