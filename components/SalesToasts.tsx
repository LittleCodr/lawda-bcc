"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

const NAMES = [
  "Aarav", "Priya", "Rahul", "Sneha", "Aditya", "Neha", "Rohan", "Anjali", "Karan", "Kavya",
  "Arjun", "Riya", "Vikram", "Pooja", "Siddharth", "Simran", "Aryan", "Megha", "Kabir", "Nisha",
  "Dhruv", "Shruti", "Rishabh", "Tanvi", "Ayush", "Ishita", "Pranav", "Sanya", "Varun", "Ruchi",
  "Dev", "Aarti", "Nikhil", "Divya", "Ananya", "Kartik", "Kriti", "Laksh", "Tara", "Yash",
  "Aditi", "Harsh", "Vidya", "Manish", "Sonam", "Raghav", "Anita", "Samir", "Gauri", "Gautam"
];

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
  "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan", "Vasai-Virar", "Varanasi",
  "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli"
];

const PRICES = [799, 999, 1299, 1499, 1999, 2499, 2999];

export default function SalesToasts() {
  const [toast, setToast] = useState<{ name: string; city: string; price: number; id: number } | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showToast = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const price = PRICES[Math.floor(Math.random() * PRICES.length)];
      
      setToast({ name, city, price, id: Date.now() });

      // Hide toast after 5 seconds
      timeoutId = setTimeout(() => {
        setToast(null);
        // Schedule next toast between 15 and 25 seconds
        const nextInterval = Math.floor(Math.random() * 10000) + 15000;
        timeoutId = setTimeout(showToast, nextInterval);
      }, 5000);
    };

    // Initial delay before first toast
    timeoutId = setTimeout(showToast, Math.floor(Math.random() * 5000) + 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 left-4 md:bottom-6 md:left-6 z-50 pointer-events-auto"
        >
          <div className="bg-white border border-[#E5B8B7] shadow-lg rounded-sm p-3 pr-8 flex items-start gap-3 max-w-[300px]">
            <button 
              onClick={() => setToast(null)}
              className="absolute top-2 right-2 text-stone-400 hover:text-stone-700"
            >
              <X size={14} />
            </button>
            <div className="bg-[#FDF8F5] p-2 rounded-sm shrink-0">
              <CheckCircle2 size={16} className="text-[#800020]" />
            </div>
            <div>
              <p className="text-xs text-stone-900 font-medium leading-tight">
                {toast.name} from {toast.city}
              </p>
              <p className="text-[10px] text-stone-500 mt-1">
                just bought an item for ₹{toast.price}
              </p>
              <p className="text-[9px] text-[#800020] font-bold mt-1.5 uppercase tracking-widest">
                Verified Purchase
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
