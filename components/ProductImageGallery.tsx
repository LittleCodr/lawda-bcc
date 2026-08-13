"use client";

import { useState, useRef, useEffect } from "react";
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
  
  const imgRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div 
        className="relative aspect-[4/5] bg-[#FDF8F5] w-full rounded-sm overflow-hidden border border-[#E5B8B7]/30 cursor-zoom-in group"
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
      >
        <div 
          className="absolute inset-0 transition-transform duration-200 ease-out"
          style={isHovering ? zoomStyle : { transformOrigin: "center center", transform: "scale(1)" }}
        >
          <Image 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover" 
          />
        </div>
        
        {/* Hover Hint */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-[#800020]">
          <ZoomIn size={20} />
        </div>
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 rounded-sm overflow-hidden border-2 transition-all ${
                currentIndex === idx ? "border-[#800020] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center touch-none">
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full shadow-lg text-white hover:bg-white hover:text-black transition-colors z-50"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={24} />
          </button>
          
          <button 
            className="absolute left-4 md:left-12 p-3 bg-white/10 hover:bg-white rounded-full shadow-lg text-white hover:text-black transition-colors z-50 backdrop-blur-sm"
            onClick={handlePrev}
          >
            <ChevronLeft size={28} />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] px-12 md:px-24">
            <Image 
              src={images[currentIndex].src} 
              alt={images[currentIndex].alt}
              fill
              className="object-contain" 
              sizes="100vw"
            />
          </div>

          <button 
            className="absolute right-4 md:right-12 p-3 bg-white/10 hover:bg-white rounded-full shadow-lg text-white hover:text-black transition-colors z-50 backdrop-blur-sm"
            onClick={handleNext}
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-6 font-medium tracking-widest uppercase text-white text-sm bg-black/50 backdrop-blur-md px-6 py-2 rounded-full shadow-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
