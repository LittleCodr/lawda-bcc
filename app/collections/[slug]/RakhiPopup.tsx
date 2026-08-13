"use client";

import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";

export default function RakhiPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("rakhiPopupSeen");
      if (!hasSeenPopup) {
        setIsOpen(true);
        sessionStorage.setItem("rakhiPopupSeen", "true");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-[#800020] to-[#c00030] p-6 text-center text-white relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <Gift size={48} className="mx-auto mb-4 opacity-90" />
          <h2 className="font-serif text-3xl font-bold mb-2">Wait, Brother!</h2>
          <p className="text-sm opacity-90 uppercase tracking-widest font-bold">Don't checkout without this</p>
        </div>
        
        <div className="p-8 text-center bg-[#FDF8F5]">
          <p className="text-gray-700 mb-6 font-medium leading-relaxed">
            Make her smile this Rakshabandhan. Use this secret code at checkout to get an extra <strong className="text-[#800020] font-bold text-xl">₹150 OFF</strong> on these beautiful name necklaces!
          </p>
          
          <div className="bg-white border-2 border-dashed border-[#800020] rounded-xl p-4 mb-6">
            <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1 font-bold">Promo Code</span>
            <span className="text-2xl font-black text-[#800020] tracking-widest select-all">ILYBEHENA</span>
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#800020] text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg hover:bg-[#600018] transition-colors"
          >
            Claim Discount Now
          </button>
        </div>
      </div>
    </div>
  );
}
