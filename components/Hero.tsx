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
    <section className="relative w-full overflow-hidden bg-paper">
      {/* Mobile: Full-bleed image with overlay text */}
      <div className="lg:hidden relative h-[90svh] min-h-[550px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].mobile}
              alt="Octopus fragrance"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4 font-bold">Est. 2025 · Harsh Beniwal</p>
            <h1 className="font-serif-display text-white text-5xl leading-[1.1] mb-4">
              The Art of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-400">Fragrance</span>
            </h1>
            <p className="text-white/70 text-sm max-w-sm mb-8 leading-relaxed">
              Nine signature Eau de Parfums, crafted in India. No middlemen. No markup. Just exceptional scent.
            </p>
            <Link
              href="#shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-ink font-bold tracking-[0.15em] uppercase text-xs hover:bg-white transition-colors"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Desktop: Split-screen layout */}
      <div className="hidden lg:grid grid-cols-2 min-h-[92svh]">
        {/* Left: Text Panel */}
        <div className="flex flex-col justify-center px-16 xl:px-24 py-20 bg-paper relative">
          <div className="absolute top-8 left-16 xl:left-24">
            <div className="w-12 h-[1px] bg-gold" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-8 font-bold">Est. 2025 · Harsh Beniwal</p>
            <h1 className="font-serif-display text-ink text-6xl xl:text-7xl 2xl:text-8xl leading-[1.05] mb-8">
              The Art<br />
              of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">Fragrance</span>
            </h1>
            <p className="text-ink/60 text-base xl:text-lg max-w-md mb-12 leading-relaxed">
              Nine signature Eau de Parfums, crafted in India. No middlemen. No markup. Just exceptional scent.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#shop"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-ink text-paper font-bold tracking-[0.15em] uppercase text-xs hover:bg-gold transition-colors duration-500"
              >
                Explore Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pages/about-us"
                className="text-xs tracking-[0.2em] uppercase text-ink/50 hover:text-gold transition-colors font-medium border-b border-ink/20 pb-1 hover:border-gold"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
          <div className="absolute bottom-8 left-16 xl:left-24 flex items-center gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-500 ${
                  currentSlide === i
                    ? "w-10 h-[3px] bg-gold"
                    : "w-4 h-[2px] bg-ink/20 hover:bg-ink/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
            <span className="text-[10px] tracking-[0.2em] text-ink/30 ml-4 font-medium">
              {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right: Image Carousel */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[currentSlide].desktop}
                alt="Octopus fragrance"
                fill
                priority
                sizes="50vw"
                quality={100}
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-ink/10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
