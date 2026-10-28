"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, Sparkles, ShieldCheck } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  id?: number;
  isFeatureSlide?: boolean;
  slideType?: "authenticity" | "shipping";
}

interface ProductImageGalleryProps {
  images: { src: string; alt: string; id?: number }[];
  selectedImageId?: number | null;
  productTitle?: string;
  isPerfume?: boolean;
}

export default function ProductImageGallery({
  images,
  selectedImageId,
  productTitle = "Perfume",
  isPerfume = true,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Touch swipe coordinates
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build the complete display list of slides
  const displayImages: GalleryImage[] = [...(images || [])];

  // If a perfume only has 1 image, supplement with verified luxury assurance presentation slides
  if (isPerfume && displayImages.length === 1) {
    displayImages.push(
      {
        src: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        alt: `${productTitle} - Deluxe Fragrance Packaging Box & Seal`,
        isFeatureSlide: true,
        slideType: "authenticity",
      },
      {
        src: "/harsh-beniwal/octopus/perfumes/images/paradox_lifestyle.png",
        alt: `${productTitle} - 25%+ French Oil Concentration & 12H Beast-Mode Longevity`,
        isFeatureSlide: true,
        slideType: "shipping",
      }
    );
  }

  // Reset loading state when index changes
  useEffect(() => {
    setIsImgLoading(true);
    setRetryCount(0);
  }, [currentIndex]);

  // Sync selectedImageId with currentIndex when variant clicked
  useEffect(() => {
    if (selectedImageId && displayImages) {
      const idx = displayImages.findIndex((img) => img.id === selectedImageId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [selectedImageId]);

  if (!displayImages || displayImages.length === 0) {
    return (
      <div className="aspect-square bg-[#FDF8F5] w-full flex items-center justify-center rounded-xl border border-[#E5B8B7]/30">
        <span className="text-[#6a6a6a]">No Image</span>
      </div>
    );
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Hover Zoom Logic (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomStyle({ transformOrigin: "center center", transform: "scale(1)" });
  };

  const currentImage = displayImages[currentIndex];

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Main Image Viewport / Carousel */}
      <div
        className="relative aspect-square sm:aspect-[4/4] bg-stone-50/90 w-full rounded-2xl overflow-hidden border border-stone-200/80 cursor-zoom-in group shadow-xs"
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsLightboxOpen(true)}
      >
        <div
          className="absolute inset-0 transition-transform duration-200 ease-out bg-stone-50/50 flex items-center justify-center p-3 sm:p-5"
          style={isHovering ? zoomStyle : { transformOrigin: "center center", transform: "scale(1)" }}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt || productTitle}
            fill
            priority
            loading="eager"
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2 sm:p-4 z-10 transition-transform duration-300"
            onLoad={() => setIsImgLoading(false)}
            onError={() => {
              if (retryCount < 2) setRetryCount((prev) => prev + 1);
              else setIsImgLoading(false);
            }}
          />
        </div>

        {/* Feature Slide Banner Overlay */}
        {currentImage.isFeatureSlide && (
          <div className="absolute top-4 left-4 right-4 bg-black/75 backdrop-blur-md text-white p-3 rounded-xl z-20 flex items-center gap-2.5 shadow-lg">
            {currentImage.slideType === "authenticity" ? (
              <>
                <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                <div className="text-left text-xs leading-tight">
                  <span className="font-bold block text-white">100% Authentic Luxury Guarantee</span>
                  <span className="text-stone-300 text-[11px]">Factory sealed with batch inspection stamp</span>
                </div>
              </>
            ) : (
              <>
                <Sparkles size={20} className="text-amber-400 shrink-0" />
                <div className="text-left text-xs leading-tight">
                  <span className="font-bold block text-white">25%+ French Oil Beast-Mode Wear</span>
                  <span className="text-stone-300 text-[11px]">Includes Free 7ML Paradox Tester Pack</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-stone-900 p-2.5 rounded-full shadow-lg z-20 transition-all duration-200 hover:scale-110 active:scale-95 border border-stone-200/80 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-stone-900 p-2.5 rounded-full shadow-lg z-20 transition-all duration-200 hover:scale-110 active:scale-95 border border-stone-200/80 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Hover Hint */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-stone-700 z-20">
          <ZoomIn size={16} />
        </div>

        {/* Counter Badge */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full pointer-events-none z-20 tracking-wider">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Carousel Pagination Dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-200 rounded-full ${
                  currentIndex === idx
                    ? "w-4 h-1.5 bg-white shadow-xs"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Track Carousel */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide px-0.5">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all bg-white p-1 cursor-pointer ${
                currentIndex === idx
                  ? "border-[#222222] shadow-md ring-2 ring-[#222222]/20 scale-102"
                  : "border-stone-200/80 opacity-70 hover:opacity-100 hover:border-stone-400"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `Thumbnail ${idx + 1}`}
                fill
                unoptimized
                loading="eager"
                className="object-contain p-1"
                sizes="80px"
              />
              {img.isFeatureSlide && (
                <div className="absolute bottom-0 inset-x-0 bg-stone-900/85 text-[9px] text-white font-bold text-center py-0.5 leading-none">
                  Info
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center touch-none select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full shadow-lg text-white hover:bg-white hover:text-black transition-colors z-[110] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
            >
              <X size={24} />
            </button>

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 md:left-12 p-3 bg-white/10 hover:bg-white rounded-full shadow-lg text-white hover:text-black transition-colors z-[110] backdrop-blur-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev(e);
                  }}
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  className="absolute right-4 md:right-12 p-3 bg-white/10 hover:bg-white rounded-full shadow-lg text-white hover:text-black transition-colors z-[110] backdrop-blur-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext(e);
                  }}
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div
              className="relative w-full max-w-4xl h-[80vh] px-12 md:px-24 z-[105] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || productTitle}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Lightbox Footer Thumbnail Bar */}
            {displayImages.length > 1 && (
              <div
                className="absolute bottom-6 flex gap-2 z-[110] bg-black/60 backdrop-blur-md p-2 rounded-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      currentIndex === idx ? "border-white scale-105" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.src} alt="" fill unoptimized className="object-contain p-0.5" />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
