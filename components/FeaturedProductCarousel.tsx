"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const perfumeImages = [
  "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
  "/harsh-beniwal/octopus/perfumes/images/paradox_box.png",
  "/harsh-beniwal/octopus/perfumes/images/promised_box.png",
  "/harsh-beniwal/octopus/perfumes/images/outlaw_box.png",
];

export default function FeaturedProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % perfumeImages.length);
    }, 3000); // 3 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <Link href="/harsh-beniwal/octopus/perfumes" className="group relative w-full max-w-[450px] aspect-[4/3] rounded-3xl overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-stone-900/90 via-stone-950/90 to-stone-900/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] block hover:scale-[1.02] hover:border-amber-400/40 transition-all duration-500 cursor-pointer">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 p-4 flex items-center justify-center"
        >
          <Image 
            src={perfumeImages[currentIndex]} 
            alt="Harsh Beniwal Octopus Eau De Parfum" 
            fill 
            unoptimized 
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" 
          />
        </motion.div>
      </AnimatePresence>
    </Link>
  );
}
