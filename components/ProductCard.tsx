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
  const [isSaved, setIsSaved] = useState(false);
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
      }, 1400);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
      className="group flex flex-col relative"
    >
      {/* Photo Plate with 14px corner clipping */}
      <div 
        className="relative aspect-square w-full rounded-[14px] overflow-hidden bg-[#f7f7f7] group-hover:shadow-airbnb-hover transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          {/* Floating "Guest favorite" Badge top-left */}
          <span className="guest-favorite-badge flex items-center gap-1.5">
            <span>Guest favorite</span>
          </span>

          {/* Images */}
          {allImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`${product.name} - Harsh Beniwal EDP`}
              fill
              unoptimized
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className={`object-contain p-4 transition-all duration-500 ease-out ${
                idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          {/* Image Dots Indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {allImages.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    dotIdx === currentImageIndex ? "bg-white scale-125 shadow-xs" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Heart Wishlist Save Button top-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          className="heart-save-btn cursor-pointer"
        >
          <svg
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className={`w-6 h-6 stroke-[2] transition-colors ${
              isSaved
                ? "fill-[#ff385c] stroke-[#ff385c]"
                : "fill-black/30 stroke-white hover:fill-black/50"
            }`}
          >
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05A6.98 6.98 0 0 0 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z"></path>
          </svg>
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-250 ease-out z-20 hidden sm:block">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-full bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white py-2.5 rounded-[8px] text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <ShoppingBag size={14} strokeWidth={2.2} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Meta Block Beneath Photo */}
      <div className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="flex-1 truncate">
            <h3 className="text-[15px] font-semibold text-[#222222] hover:text-[#ff385c] transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-[13px] font-semibold text-[#222222] shrink-0">
            <span className="text-[11px]">★</span>
            <span>4.92</span>
          </div>
        </div>

        <p className="text-[14px] text-[#6a6a6a] truncate">
          25%+ French Oils • 12H Longevity
        </p>

        <p className="text-[14px] text-[#6a6a6a] truncate">
          Includes free 7ML Paradox tester
        </p>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[15px] font-semibold text-[#222222]">
            {formatINR(product.price)}
          </span>
          <span className="text-[13px] text-[#6a6a6a]">total</span>
          {product.compareAtPrice > product.price && (
            <span className="text-[12px] text-[#ff385c] font-medium ml-auto">
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Mobile Fast Action Buttons */}
        <div className="mt-2.5 flex items-center gap-2 sm:hidden">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex-1 bg-[#ff385c] active:bg-[#e00b41] text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ShoppingBag size={13} />
            <span>Add to Cart</span>
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="px-3.5 py-2 bg-white text-[#222222] border border-[#dddddd] rounded-lg text-xs font-semibold active:scale-95 transition-all text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
