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
    ? { icon: <Flame size={12} className="stroke-[2.5]" />, label: "Selling Fast", style: "bg-red-200 text-red-950 border-black" }
    : index % 3 === 1 
    ? { icon: <Hourglass size={12} className="stroke-[2.5]" />, label: `Only ${(index % 5) + 2} Left`, style: "bg-amber-200 text-amber-950 border-black" }
    : { icon: <Star size={12} className="fill-current stroke-[2.5]" />, label: "Diwali Hit", style: "bg-yellow-300 text-black border-black" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group flex flex-col bg-white rounded-2xl p-3 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300"
    >
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden rounded-xl bg-stone-100 border border-black/10">
        <div 
          className="relative aspect-[4/5] w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badge */}
          <span className={`absolute top-2.5 left-2.5 z-10 border-2 ${badge.style} text-[9px] tracking-wider uppercase px-2.5 py-1 flex items-center gap-1 font-black rounded-full shadow-[2px_2px_0px_0px_#000]`}>
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
          <div className="absolute inset-x-2 bottom-2 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-full bg-black text-amber-300 py-3 rounded-xl text-[11px] font-black tracking-wider uppercase flex items-center justify-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_#f59e0b] hover:bg-stone-900 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <ShoppingBag size={14} className="stroke-[2.5]" />
              Quick Add
            </button>
          </div>

          {/* Bottom gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 px-1 flex flex-col gap-1 pb-1">
        <p className="text-[9px] tracking-wider uppercase text-[#800020] font-black flex items-center gap-1">
          <Gem size={11} className="stroke-[2.5]" /> 22K Gold Plated • Anti Tarnish
        </p>
        <div className="flex items-start justify-between gap-2 mt-1">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#800020] transition-colors leading-tight line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-sm font-black text-black bg-[#FFDE59] px-2 py-0.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-stone-400 line-through font-medium">
                  {formatINR(product.compareAtPrice)}
                </span>
                <span className="text-[9px] font-black text-red-600 uppercase">
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-[10px] tracking-wider uppercase text-stone-500 font-bold mt-0.5">{product.gender}</p>
      </div>
    </motion.div>
  );
}
