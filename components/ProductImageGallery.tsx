"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: { src: string; alt: string; id?: number }[];
  selectedImageId?: number | null;
}

export default function ProductImageGallery({ images, selectedImageId }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset loading state when the image changes
  useEffect(() => {
    setIsImgLoading(true);
    setRetryCount(0);
  }, [currentIndex]);

  // Retry logic: if loading takes more than 3 seconds, retry
  useEffect(() => {
    if (!isImgLoading) return;
    
    const timer = setTimeout(() => {
      if (retryCount >= 2) {
        setIsImgLoading(false); // Force show after a few retries
      } else {
        setRetryCount(prev => prev + 1);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isImgLoading, retryCount]);

  // Sync selectedImageId with currentIndex when it changes from the parent (e.g. via variant click)
  useEffect(() => {
    if (selectedImageId && images) {
      const idx = images.findIndex(img => img.id === selectedImageId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [selectedImageId, images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-[#FDF8F5] w-full flex items-center justify-center rounded-sm border border-[#E5B8B7]/30">
        <span className="text-[#E5B8B7]">No Image</span>
      </div>
    );
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Hover Zoom Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)", // 2x Zoom
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomStyle({ transformOrigin: "center center", transform: "scale(1)" });
  };

  const getRetrySrc = (src: string) => {
    if (retryCount === 0) return src;
    return `${src}${src.includes('?') ? '&' : '?'}retry=${retryCount}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div 
        className="relative aspect-square sm:aspect-[4/4] bg-stone-50/80 w-full rounded-xl overflow-hidden border border-stone-200/80 cursor-zoom-in group shadow-inner"
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
      >
        <div 
          className="absolute inset-0 transition-transform duration-200 ease-out bg-stone-50/50 flex items-center justify-center p-2 sm:p-4"
          style={isHovering ? zoomStyle : { transformOrigin: "center center", transform: "scale(1)" }}
        >
          <Image 
            src={getRetrySrc(images[currentIndex].src)} 
            alt={images[currentIndex].alt || "Product image"}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2 sm:p-4 z-10 transition-transform duration-300" 
            onLoad={() => setIsImgLoading(false)}
            onError={() => {
              if (retryCount < 2) setRetryCount(prev => prev + 1);
              else setIsImgLoading(false);
            }}
          />
        </div>

        {/* Gallery Navigation Arrows (if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-md z-20 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:scale-105"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-md z-20 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:scale-105"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        
        {/* Hover Hint */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-stone-700 z-20">
          <ZoomIn size={16} />
        </div>

        {/* Counter Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-stone-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none z-20 tracking-wider">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all bg-white p-1 ${
                currentIndex === idx 
                  ? "border-stone-950 shadow-md ring-2 ring-stone-950/20 scale-102" 
                  : "border-stone-200/80 opacity-70 hover:opacity-100 hover:border-stone-400"
              }`}
            >
              <Image 
                src={img.src} 
                alt={img.alt || `Thumbnail ${idx + 1}`} 
                fill 
                unoptimized 
                className="object-contain p-1" 
                sizes="80px" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center touch-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full shadow-lg text-white hover:bg-white hover:text-black transition-colors z-[110]"
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
          >
            <X size={24} />
          </button>
          
          <button 
            className="absolute left-4 md:left-12 p-3 bg-white/10 hover:bg-white rounded-full shadow-lg text-white hover:text-black transition-colors z-[110] backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); handlePrev(e); }}
          >
            <ChevronLeft size={28} />
          </button>

          <div 
            className="relative w-full max-w-4xl h-[80vh] px-12 md:px-24 z-[105]"
            onClick={(e) => e.stopPropagation()}
          >
            {isImgLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                 <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            <Image 
              src={getRetrySrc(images[currentIndex].src)} 
              alt={images[currentIndex].alt}
              fill
              unoptimized
              className={`object-contain z-10 transition-opacity duration-300 ${isImgLoading ? 'opacity-0' : 'opacity-100'}`}
              sizes="100vw"
              onLoad={() => setIsImgLoading(false)}
              onError={() => {
                if (retryCount < 2) setRetryCount(prev => prev + 1);
                else setIsImgLoading(false);
              }}
            />
          </div>

          <button 
            className="absolute right-4 md:right-12 p-3 bg-white/10 hover:bg-white rounded-full shadow-lg text-white hover:text-black transition-colors z-[110] backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); handleNext(e); }}
          >
            <ChevronRight size={28} />
          </button>

          <div 
            className="absolute bottom-6 font-medium tracking-widest uppercase text-white text-sm bg-black/50 backdrop-blur-md px-6 py-2 rounded-full shadow-sm z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
            {currentIndex + 1} / {images.length}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
