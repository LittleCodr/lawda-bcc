"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    desktop: "/images/products/Mirage_Hero_Octopus.webp",
    mobile: "/images/products/Mirage_Hero_Octopus.webp",
  },
  {
    id: 2,
    desktop: "/images/products/Outlaw_Hero_Octopus.webp",
    mobile: "/images/products/Outlaw_Hero_Octopus.webp",
  },
  {
    id: 3,
    desktop: "/images/products/Somersault_Hero_Octopus.webp",
    mobile: "/images/products/Somersault_Hero_Octopus.webp",
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Mobile: Full-bleed image with floating glass text card */}
      <div className="lg:hidden relative h-[90svh] min-h-[600px] flex items-end justify-center pb-10 px-4">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].mobile}
              alt="Octopus perfume by Harsh Beniwal"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 bg-white/90 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center"
        >
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-3 font-bold">Harsh Beniwal Brand</p>
          <h1 className="font-serif-display text-stone-900 text-4xl leading-[1.15] mb-4">
            The Art of<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Fragrance</span>
          </h1>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            Nine signature Eau de Parfums, crafted in India. Exceptional scent.
          </p>
          <Link
            href="#shop"
            className="inline-flex justify-center w-full items-center gap-2 px-6 py-4 bg-stone-900 text-white font-bold tracking-[0.1em] uppercase text-xs hover:bg-gold transition-colors rounded-xl shadow-lg shadow-stone-900/20"
          >
            Explore Collection
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Desktop: Dynamic Split-screen layout */}
      <div className="hidden lg:grid grid-cols-12 min-h-[92svh]">
        {/* Left: Text Panel (7 cols for wider layout) */}
        <div className="col-span-6 xl:col-span-5 flex flex-col justify-center px-16 xl:px-24 py-20 bg-stone-50 relative z-10 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-gold" />
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold">Est. 2025 · Harsh Beniwal</p>
            </div>
            
            <h1 className="font-serif-display text-stone-900 text-6xl xl:text-7xl 2xl:text-8xl leading-[1.05] mb-8">
              Octopus<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">Perfumes</span>
            </h1>
            <p className="text-stone-600 text-base xl:text-lg max-w-md mb-12 leading-relaxed">
              Discover the official luxury fragrance brand by Harsh Beniwal. Nine signature Eau de Parfums designed to leave a lasting impression.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#shop"
                className="group inline-flex items-center gap-3 px-8 py-5 bg-stone-900 text-white font-bold tracking-[0.15em] uppercase text-xs hover:bg-gold transition-colors duration-300 rounded-lg shadow-xl shadow-stone-900/10"
              >
                Explore Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pages/about-us"
                className="text-xs tracking-[0.15em] uppercase text-stone-500 hover:text-stone-900 transition-colors font-medium border-b border-transparent hover:border-stone-900 pb-1"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
          <div className="absolute bottom-12 left-16 xl:left-24 flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-500 rounded-full ${
                  currentSlide === i
                    ? "w-8 h-2 bg-gold"
                    : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Image Carousel */}
        <div className="col-span-6 xl:col-span-7 relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[currentSlide].desktop}
                alt="buy octopus perfume"
                fill
                priority
                sizes="60vw"
                quality={100}
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
