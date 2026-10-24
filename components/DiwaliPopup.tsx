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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white border border-[#ebebeb] rounded-[16px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close popup"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-[#222222] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Content Body */}
        <div className="p-8 text-left bg-white">
          <div className="inline-flex items-center gap-1.5 bg-[#f7f7f7] border border-[#dddddd] text-[#ff385c] rounded-full px-3 py-1 text-[11px] font-semibold mb-3">
            <span>Special Invitation</span>
          </div>

          <h2 className="text-[24px] font-bold text-[#222222] leading-tight mb-2">
            20% OFF Harsh Beniwal EDPs
          </h2>
          
          <p className="text-[14px] text-[#6a6a6a] leading-relaxed mb-6">
            Explore 100% original 50ML Eau De Parfums with 25%+ French fragrance oils and 12+ hour projection. Every order automatically includes a complimentary 7ML Paradox tester pack.
          </p>

          {/* Coupon Card Ticket */}
          <div className="bg-[#f7f7f7] border border-[#dddddd] rounded-[12px] p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-semibold text-[#6a6a6a] block">
                  Exclusive Promo Code
                </span>
                <span className="text-xl font-bold text-[#222222] font-mono tracking-wider">
                  DIWALI20
                </span>
              </div>
              <button
                onClick={copyCode}
                className="btn-secondary-airbnb py-2 px-3.5 text-xs flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-[#188038]" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>
            
            <div className="border-t border-[#ebebeb] pt-2.5 flex flex-col gap-1 text-[12px] text-[#6a6a6a]">
              <span>✓ Flat 20% OFF on all perfume orders</span>
              <span>✓ Complimentary 7ML Paradox tester (₹399 value)</span>
              <span>✓ Free Pan-India express delivery</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={copyCode}
            className="w-full bg-[#ff385c] hover:bg-[#e00b41] text-white py-3.5 rounded-[8px] text-[15px] font-medium transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            Claim 20% Discount
          </button>
          
          <p className="mt-3 text-[12px] text-[#929292] text-center font-normal">
            100% Genuine Harsh Beniwal EDP • Dispatched via express logistics
          </p>
        </div>
      </div>
    </div>
  );
}
