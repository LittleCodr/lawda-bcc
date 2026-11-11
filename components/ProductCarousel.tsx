"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ProductSummary } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

interface ProductCarouselProps {
  title: string;
  eyebrow?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  products: ProductSummary[];
  priorityFirst?: boolean;
}

export default function ProductCarousel({
  title,
  eyebrow,
  viewAllHref,
  viewAllLabel = "View All",
  products,
  priorityFirst = false,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(products.length > 4);
  const [announcement, setAnnouncement] = useState("");

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(maxScroll - el.scrollLeft > 4);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [products.length]);

  const scrollByTrack = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(260, Math.round(el.clientWidth * 0.82));
    el.scrollBy({ left: direction * step });
    setAnnouncement(
      direction > 0 ? `Scrolled forward in ${title}` : `Scrolled back in ${title}`
    );
  };

  if (products.length === 0) return null;

  return (
    <section
      aria-label={title}
      className="py-10 sm:py-12 border-b border-[#E8E6E1] last:border-b-0"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Controls */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-7">
          <div>
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1.5">
                {eyebrow}
              </p>
            )}
            <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424] leading-[1.15] tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-xs sm:text-[13px] font-semibold text-[#242424] hover:text-[#9A7953] underline underline-offset-4 decoration-[#D4CFC7] hover:decoration-[#9A7953] transition-colors whitespace-nowrap"
              >
                {viewAllLabel}
              </Link>
            )}

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollByTrack(-1)}
                disabled={!canPrev}
                aria-label={`Previous ${title}`}
                className="w-9 h-9 rounded-full border border-[#D4CFC7] bg-white hover:bg-[#F7F6F3] hover:border-[#242424] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-[#242424] transition-colors touch-manipulation cursor-pointer"
              >
                <ArrowLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => scrollByTrack(1)}
                disabled={!canNext}
                aria-label={`Next ${title}`}
                className="w-9 h-9 rounded-full border border-[#D4CFC7] bg-white hover:bg-[#F7F6F3] hover:border-[#242424] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-[#242424] transition-colors touch-manipulation cursor-pointer"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Native Scroll-Snap Carousel Track */}
        <div
          ref={trackRef}
          onScroll={updateScrollState}
          tabIndex={0}
          aria-roledescription="carousel"
          className="carousel-track no-scrollbar flex gap-3.5 sm:gap-5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[62%] min-[480px]:w-[46%] sm:w-[31%] lg:w-[23.2%] xl:w-[19%]"
            >
              <ProductCard
                product={product}
                index={idx}
                priority={priorityFirst && idx < 4}
              />
            </div>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </section>
  );
}

