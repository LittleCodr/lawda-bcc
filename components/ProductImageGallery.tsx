"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export interface GalleryImage {
  id?: string | number;
  src: string;
  alt: string;
  type?: string;
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  productTitle: string;
  discountPct?: number;
  available?: boolean;
  isFlagship?: boolean;
  selectedImageSrc?: string | null;
}

export default function ProductImageGallery({
  images,
  productTitle,
  discountPct = 0,
  available = true,
  isFlagship = false,
  selectedImageSrc,
}: ProductImageGalleryProps) {
  const safeImages =
    images.length > 0
      ? images
      : [{ src: "/placeholder.svg", alt: productTitle }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevSelectedSrc, setPrevSelectedSrc] = useState(selectedImageSrc);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync active thumbnail during render when selected variant image changes
  if (selectedImageSrc !== prevSelectedSrc) {
    setPrevSelectedSrc(selectedImageSrc);
    if (selectedImageSrc) {
      const found = safeImages.findIndex((im) => im.src === selectedImageSrc);
      if (found >= 0) setActiveIndex(found);
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxOpen && !dialog.open) dialog.showModal();
    else if (!lightboxOpen && dialog.open) dialog.close();
  }, [lightboxOpen]);

  const current = safeImages[activeIndex] || safeImages[0];

  const stepImage = (dir: -1 | 1) => {
    setActiveIndex((prev) => (prev + dir + safeImages.length) % safeImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  return (
    <div className="space-y-3.5">
      {/* Main Studio Stage */}
      <div
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full rounded-[10px] border border-[#E8E6E1] bg-[#F7F6F3] overflow-hidden select-none group"
      >
        <img
          src={current.src}
          alt={current.alt || productTitle}
          style={
            isZooming
              ? {
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transform: "scale(1.35)",
                }
              : undefined
          }
          className="w-full h-full object-contain p-5 sm:p-8 transition-transform duration-200 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Top-left Status / Savings Badge */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 pointer-events-none">
          {!available ? (
            <span className="bg-[#242424] text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
              Sold Out
            </span>
          ) : discountPct > 0 ? (
            <span className="bg-[#B83232] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
              Save {discountPct}%
            </span>
          ) : isFlagship ? (
            <span className="bg-[#9A7953] text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
              25%+ French Oil EDP
            </span>
          ) : null}
        </div>

        {/* Zoom / Fullscreen Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open full-screen photo lightbox"
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 hover:bg-white border border-[#E8E6E1] text-[#242424] shadow-sm transition-colors cursor-pointer"
        >
          <Maximize2 size={15} />
        </button>

        {/* Multi-image Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => stepImage(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#E8E6E1] text-[#242424] flex items-center justify-center shadow-sm cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => stepImage(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#E8E6E1] text-[#242424] flex items-center justify-center shadow-sm cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>

            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 border border-[#E8E6E1] text-[11px] font-medium text-[#5C5954] tabular-nums">
              {activeIndex + 1} / {safeImages.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={`${img.src}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1} of ${productTitle}`}
              aria-pressed={activeIndex === idx}
              className={`shrink-0 w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] rounded-[8px] bg-[#F7F6F3] p-1.5 border-2 transition-colors cursor-pointer ${
                activeIndex === idx
                  ? "border-[#1F1D1B]"
                  : "border-[#E8E6E1] hover:border-[#D4CFC7]"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt || productTitle}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Native <dialog> Lightbox (zero body overflow mutations) */}
      <dialog
        ref={dialogRef}
        closedby="any"
        onCancel={(e) => {
          e.preventDefault();
          setLightboxOpen(false);
        }}
        onClick={(e) => {
          const panel = dialogRef.current?.firstElementChild;
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            setLightboxOpen(false);
          }
        }}
        aria-label={`Zoomed view of ${productTitle}`}
        className="fc-dialog w-full max-w-4xl p-4 sm:p-6"
      >
        <div className="bg-white rounded-[12px] border border-[#E8E6E1] overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 border-b border-[#E8E6E1] flex items-center justify-between bg-[#F7F6F3]">
            <p className="text-xs sm:text-sm font-semibold text-[#242424] truncate pr-4">
              {productTitle}
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close zoomed image"
              className="p-1.5 rounded-full hover:bg-white text-[#242424] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative aspect-square sm:aspect-[16/10] bg-[#F7F6F3] p-4 sm:p-8 flex items-center justify-center">
            <img
              src={current.src}
              alt={current.alt || productTitle}
              className="max-h-full max-w-full object-contain"
            />
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => stepImage(-1)}
                  aria-label="Previous lightbox photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E8E6E1] text-[#242424] flex items-center justify-center shadow cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => stepImage(1)}
                  aria-label="Next lightbox photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E8E6E1] text-[#242424] flex items-center justify-center shadow cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
