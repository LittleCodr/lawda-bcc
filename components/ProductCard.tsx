"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Hourglass, Star, ShoppingBag, Gem, Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [
    product.images.hero,
    product.images.lifestyle,
    product.images.mood,
    product.images.box,
  ].filter(Boolean) as string[];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && allImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 1200);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  const badge = index % 3 === 0 
    ? { icon: <Flame size={12} className="text-rose-600 fill-rose-500" />, label: "Selling Fast", style: "bg-rose-50/90 text-rose-900 border-rose-200/70" }
    : index % 3 === 1 
    ? { icon: <Hourglass size={12} className="text-amber-600" />, label: `Only ${(index % 5) + 2} Left`, style: "bg-amber-50/90 text-amber-900 border-amber-200/70" }
    : { icon: <Star size={12} className="text-amber-500 fill-amber-400" />, label: "Diwali Hit", style: "bg-yellow-50/90 text-yellow-950 border-yellow-200/70" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group flex flex-col backdrop-blur-xl bg-white/80 border border-white/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.2)] rounded-3xl p-3.5 hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden"
    >
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden rounded-2xl bg-gradient-to-b from-stone-50 to-stone-100/70 border border-stone-200/50">
        <div 
          className="relative aspect-[4/5] w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Frosted Glass Badge */}
          <span className={`absolute top-3 left-3 z-10 border ${badge.style} backdrop-blur-md text-[10px] tracking-wider uppercase px-3 py-1 flex items-center gap-1.5 font-bold rounded-full shadow-sm`}>
            {badge.icon} {badge.label}
          </span>

          {/* Images */}
          {allImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`${product.name} - image ${idx + 1}`}
              fill
              unoptimized
              quality={100}
              sizes="(max-width: 768px) 50vw, 33vw"
              className={`object-cover transition-all duration-500 ease-out ${
                idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          {/* Hover overlay with quick-add */}
          <div className="absolute inset-x-3 bottom-3 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-full bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-amber-300 py-3 rounded-xl text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 border border-stone-800 shadow-xl hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer backdrop-blur-md"
            >
              <ShoppingBag size={14} className="stroke-[2.2]" />
              Quick Add
            </button>
          </div>

          {/* Subtle bottom gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 px-1.5 flex flex-col gap-1 pb-1">
        <p className="text-[10px] tracking-wider uppercase text-amber-700 font-bold flex items-center gap-1">
          <Sparkles size={11} className="stroke-[2] text-amber-500" /> 25%+ French Oils • 12H Longevity
        </p>
        <div className="flex items-start justify-between gap-2 mt-1">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-tight line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-sm font-extrabold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-300 px-2.5 py-0.5 rounded-xl border border-amber-300/50 shadow-sm">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-stone-400 line-through font-medium">
                  {formatINR(product.compareAtPrice)}
                </span>
                <span className="text-[9px] font-bold text-rose-600 uppercase">
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-[10px] tracking-wider uppercase text-stone-400 font-semibold mt-0.5">{product.gender}</p>
      </div>
    </motion.div>
  );
}
