"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Hourglass, Star, ShoppingBag, Gem } from "lucide-react";
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
    ? { icon: <Flame size={12} />, label: "Selling Fast", style: "bg-red-50 text-red-600 border-red-100" }
    : index % 3 === 1 
    ? { icon: <Hourglass size={12} />, label: `Only ${(index % 5) + 2} Left`, style: "bg-stone-100 text-stone-700 border-stone-200" }
    : { icon: <Star size={12} className="fill-current" />, label: "Bestseller", style: "bg-yellow-50 text-yellow-700 border-yellow-200" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl border border-stone-100 transition-all duration-500"
    >
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden rounded-xl bg-stone-50">
        <div 
          className="relative aspect-[4/5] w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badge */}
          <span className={`absolute top-3 left-3 z-10 border ${badge.style} text-[10px] tracking-widest uppercase px-3 py-1.5 flex items-center gap-1.5 font-semibold rounded-full shadow-sm`}>
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
              className={`object-cover transition-all duration-700 ease-out ${
                idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          {/* Hover overlay with quick-add */}
          <div className="absolute inset-x-2 bottom-2 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-full bg-white/95 backdrop-blur-md text-stone-900 py-3.5 rounded-lg text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-gold hover:text-white transition-colors duration-300 shadow-lg border border-white/20"
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
          </div>

          {/* Bottom gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-5 px-1 flex flex-col gap-1.5 pb-2">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#b8860b] font-bold flex items-center gap-1.5">
          <Gem size={12} /> 22K Gold Plated • Anti Tarnish
        </p>
        <div className="flex items-start justify-between gap-3 mt-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif-display text-xl sm:text-2xl text-stone-800 group-hover:text-gold transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-semibold text-stone-900 tracking-wide bg-stone-50 px-2 py-1 rounded-md">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-stone-400 line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] tracking-[0.1em] uppercase text-stone-500 font-medium mt-1">{product.gender}</p>
      </div>
    </motion.div>
  );
}
