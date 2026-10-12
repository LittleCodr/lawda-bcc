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
    <Link href="/harsh-beniwal/octopus/perfumes" className="group relative w-full max-w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-[6px] border-black bg-stone-900 block rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
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
