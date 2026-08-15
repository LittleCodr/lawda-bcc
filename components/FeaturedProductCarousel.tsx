"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const fairyImages = [
  "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Fairynamenecklace3.webp?v=1745910455",
  "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Fairy_Name_necklace.webp?v=1745910385",
  "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Fairynamenecklace2.webp?v=1745910406",
  "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Fairynamenecklce1.webp?v=1745910443",
];

export default function FeaturedProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fairyImages.length);
    }, 3000); // 3 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <Link href="/products/fairy-name-necklace" className="group relative w-full max-w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white block rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image 
            src={fairyImages[currentIndex]} 
            alt="Fairy Name Necklace" 
            fill 
            unoptimized 
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </motion.div>
      </AnimatePresence>
    </Link>
  );
}
