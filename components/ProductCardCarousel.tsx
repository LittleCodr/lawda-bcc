"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardCarouselProps {
  images: Array<{
    src: string;
    local_src?: string;
    localPath?: string;
    alt?: string;
  }>;
  title: string;
  isPerfume?: boolean;
}

export default function ProductCardCarousel({
  images,
  title,
  isPerfume = true,
}: ProductCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize image URLs
  const cleanImages = (images || [])
    .map((img) => img.local_src || img.localPath || img.src)
    .filter(Boolean);

  if (cleanImages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#6a6a6a] bg-[#f7f7f7]">
        No Image
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? cleanImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === cleanImages.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  return (
    <div className="relative w-full h-full aspect-square bg-[#f7f7f7] overflow-hidden group select-none">
      {/* Active Carousel Image */}
      <div className="relative w-full h-full">
        <Image
          src={cleanImages[currentIndex]}
          alt={`${title} - View ${currentIndex + 1}`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className={`${
            isPerfume ? "object-contain p-4" : "object-cover"
          } transition-all duration-300 ease-out group-hover:scale-105`}
        />
      </div>

      {/* Navigation Arrows for multi-image cards */}
      {cleanImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white text-stone-800 rounded-full flex items-center justify-center shadow-md z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white text-stone-800 rounded-full flex items-center justify-center shadow-md z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dot Indicator Track */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
            {cleanImages.slice(0, 7).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleDotClick(e, idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-200 rounded-full ${
                  currentIndex === idx
                    ? "w-4 h-1.5 bg-[#222222] shadow-xs"
                    : "w-1.5 h-1.5 bg-[#222222]/30 hover:bg-[#222222]/60"
                }`}
              />
            ))}
            {cleanImages.length > 7 && (
              <span className="text-[9px] font-bold text-[#222222]/70 ml-0.5">
                +{cleanImages.length - 7}
              </span>
            )}
          </div>
        </>
      )}

      {/* Multiple Images Badge */}
      {cleanImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full z-10 opacity-75 group-hover:opacity-100 transition-opacity">
          {currentIndex + 1}/{cleanImages.length}
        </div>
      )}
    </div>
  );
}
