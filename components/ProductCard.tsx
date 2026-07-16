"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Hourglass, Star, ShoppingBag } from "lucide-react";
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
    ? { icon: <Flame size={11} />, label: "Selling Fast", style: "bg-rose-500 text-white" }
    : index % 3 === 1 
    ? { icon: <Hourglass size={11} />, label: `Only ${(index % 5) + 2} Left`, style: "bg-ink text-paper" }
    : { icon: <Star size={11} className="fill-current" />, label: "Bestseller", style: "bg-gold text-white" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col"
    >
      <Link href={`/products/${product.slug}`} className="block relative">
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-neutral-100"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badge */}
          <span className={`absolute top-3 left-3 z-10 ${badge.style} text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 flex items-center gap-1.5 font-bold`}>
            {badge.icon} {badge.label}
          </span>

          {/* Images */}
          {allImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`${product.name} - image ${idx + 1}`}
              fill
              quality={100}
              sizes="(max-width: 768px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 ease-out ${
                idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          {/* Hover overlay with quick-add */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-full bg-ink/90 backdrop-blur-sm text-paper py-4 text-[10px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 hover:bg-gold transition-colors duration-300"
            >
              <ShoppingBag size={14} />
              Quick Add — {formatINR(product.price)}
            </button>
          </div>

          {/* Bottom gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </Link>

      {/* Product Info - left-aligned, minimal */}
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-[9px] tracking-[0.3em] uppercase text-ink/40 font-medium">
          Inspired by {product.inspiredBy}
        </p>
        <div className="flex items-baseline justify-between gap-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif-display text-xl md:text-2xl text-ink group-hover:text-gold transition-colors duration-300">{product.name}</h3>
          </Link>
          <span className="text-sm font-semibold text-ink/80 tracking-wide">{formatINR(product.price)}</span>
        </div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-ink/50 font-medium">{product.gender}</p>
      </div>
    </motion.div>
  );
}
