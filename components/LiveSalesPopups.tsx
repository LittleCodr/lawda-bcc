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
      className={`fixed bottom-6 left-6 z-50 bg-paper border border-ink/20 shadow-2xl p-4 flex gap-4 max-w-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-amber-500/10 text-amber-600 rounded-full w-10 h-10 flex items-center justify-center shrink-0 self-start mt-1">
        <ShoppingCart size={18} strokeWidth={2} />
      </div>
      <div>
        <div className="flex items-center justify-between gap-4 mb-1">
          <p className="text-sm font-medium">Someone in {popup.city}</p>
          <button onClick={() => setVisible(false)} className="text-ink/40 hover:text-ink">
            <X size={14} />
          </button>
        </div>
        <p className="text-xs text-ink/70 leading-relaxed mt-1">
          {popup.name} purchased <strong className="text-ink">{popup.product}</strong>
          {popup.promo && <span className="text-emerald-600 font-bold ml-1 text-[11px] block mt-0.5">{popup.promo}</span>}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] uppercase tracking-widest text-ink/50 font-medium">
          <MapPin size={10} />
          <span>Verified Buyer • {popup.time}</span>
        </div>
      </div>
    </div>
  );
}
