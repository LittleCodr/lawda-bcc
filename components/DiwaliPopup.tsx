"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, Gift, Truck, ShieldCheck, Flame } from "lucide-react";
import toast from "react-hot-toast";

export default function DiwaliPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show popup after 1.8 seconds on first visit of session
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("diwaliPopupSeen");
      if (!hasSeenPopup) {
        setIsOpen(true);
        sessionStorage.setItem("diwaliPopupSeen", "true");
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const copyCode = () => {
    navigator.clipboard.writeText("DIWALI20");
    setCopied(true);
    toast.success("Coupon code DIWALI20 copied! 20% OFF applied at checkout.", {
      style: {
        borderRadius: "14px",
        padding: "14px 20px",
        color: "#222222",
        fontWeight: "600",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        background: "rgba(255, 255, 255, 0.98)",
        border: "1px solid #f59e0b",
      },
      icon: "🪔",
    });
    setTimeout(() => {
      setIsOpen(false);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white border-2 border-amber-400/60 rounded-[20px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="diwali-popup-title"
      >
        {/* Festive Top Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-6 py-4 text-white text-center relative">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100">
            <span>🪔</span>
            <span>Shubh Deepavali 2026 Special</span>
            <span>✨</span>
          </div>
          <h2 id="diwali-popup-title" className="text-[22px] font-bold text-white mt-1 leading-tight">
            Light Up Diwali With Luxury Fragrances
          </h2>
          <p className="text-[12px] text-amber-100 mt-0.5">
            Harsh Beniwal&apos;s 100% Original 50ML Eau De Parfums
          </p>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close festive popup"
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-white text-left">
          <p className="text-[14px] text-[#3f3f3f] leading-relaxed mb-4">
            Skip generic sweet boxes this Diwali. Elevate your gifting with long-lasting French Eau De Parfums (25%+ oils) crafted for 12+ hour sillage.
          </p>

          {/* Coupon Voucher Box */}
          <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-amber-50/80 border border-amber-300 rounded-[14px] p-4 mb-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block">
                  Diwali Festive Coupon
                </span>
                <span className="text-2xl font-extrabold text-[#222222] font-mono tracking-wider">
                  DIWALI20
                </span>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white font-semibold py-2.5 px-4 rounded-lg text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied ? <Check size={15} className="text-white" /> : <Copy size={15} />}
                {copied ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>
            
            {/* Festive Highlights Checklist */}
            <div className="border-t border-amber-200/80 mt-3.5 pt-3 grid grid-cols-1 gap-2 text-[12px] text-[#222222]">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Flat 20% OFF</strong> on all 50ML EDP perfumes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Free 7ML Paradox Tester</strong> (worth ₹399) inside every box</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Deluxe Diwali Gift Packaging</strong> + Free Pan-India Delivery</span>
              </div>
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={copyCode}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-[14px] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>🪔</span>
              <span>Claim 20% Diwali Discount</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[13px] text-[#6a6a6a] hover:text-[#222222] font-medium px-2 py-3 cursor-pointer"
            >
              Skip
            </button>
          </div>

          <p className="text-[11px] text-center text-[#6a6a6a] mt-3">
            ⚡ Guaranteed delivery before Diwali celebrations for all orders placed this week.
          </p>
        </div>
      </div>
    </div>
  );
}
