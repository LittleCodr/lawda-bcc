"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, MapPin, X } from "lucide-react";

const CITIES = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Gurgaon", "Noida"];
const PRODUCTS = ["Mirage", "Overlord", "Darling", "Outlaw", "Phantom", "Siren", "Enigma"];
const TIMES = ["just now", "1 min ago", "2 mins ago", "5 mins ago", "12 mins ago", "1 hour ago"];
const NAMES = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Rohit", "Anjali", "Karan", "Pooja", "Arjun", "Kritika"];
const PROMOS = ["(Used Code: HARSH10)", "(Unlocked FREE Gift)", "(Used Code: HARSH15)", ""];

type PopupData = {
  city: string;
  product: string;
  time: string;
  name: string;
  promo: string;
};

export default function LiveSalesPopups() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextPopup = () => {
      // Hide current popup if any
      setVisible(false);

      // Random delay between 5s and 15s
      const nextDelay = Math.floor(Math.random() * 10000) + 5000;

      timeoutId = setTimeout(() => {
        // Generate random data
        const newPopup = {
          city: CITIES[Math.floor(Math.random() * CITIES.length)],
          product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
          time: TIMES[Math.floor(Math.random() * TIMES.length)],
          name: NAMES[Math.floor(Math.random() * NAMES.length)],
          promo: PROMOS[Math.floor(Math.random() * PROMOS.length)],
        };
        
        setPopup(newPopup);
        setVisible(true);

        // Hide after 4 seconds
        setTimeout(() => {
          setVisible(false);
          // Schedule next one after it hides
          setTimeout(scheduleNextPopup, 1000);
        }, 4000);
      }, nextDelay);
    };

    // Start the cycle
    scheduleNextPopup();

    return () => clearTimeout(timeoutId);
  }, []);

  if (!popup) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 bg-white border border-[#ebebeb] shadow-airbnb p-3.5 rounded-[12px] flex gap-3.5 max-w-sm transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-[#fff0f3] text-[#ff385c] rounded-full w-9 h-9 flex items-center justify-center shrink-0 self-start mt-0.5">
        <ShoppingCart size={16} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-0.5">
          <p className="text-[13px] font-semibold text-[#222222]">Verified order in {popup.city}</p>
          <button onClick={() => setVisible(false)} className="text-[#929292] hover:text-[#222222] p-0.5 cursor-pointer">
            <X size={13} />
          </button>
        </div>
        <p className="text-[12px] text-[#6a6a6a] leading-tight">
          {popup.name} reserved <strong className="text-[#222222] font-semibold">{popup.product} EDP</strong>
          {popup.promo && <span className="text-[#ff385c] font-medium ml-1 inline-block">{popup.promo}</span>}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#929292]">
          <MapPin size={10} />
          <span>{popup.time} • Free Express Shipping</span>
        </div>
      </div>
    </div>
  );
}
