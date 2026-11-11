"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { HeroSlideBottle, HeroSlideData } from "@/lib/hero-slides";
import { formatPriceINR } from "@/lib/catalog-types";
import { useBlackFridayActive } from "@/lib/black-friday";

const AUTOPLAY_INTERVAL_MS = 5500;

interface PlinthBottleProps {
  bottle: HeroSlideBottle;
  slotIndex: number;
  isCurrentSlide: boolean;
  isPreloadSlide: boolean;
  variant: "desktop" | "mobile";
}

function PlinthBottle({
  bottle,
  slotIndex,
  isCurrentSlide,
  isPreloadSlide,
  variant,
}: PlinthBottleProps) {
  // Position each genuine bottle cutout onto the three travertine stone pedestals
  const desktopPlacement =
    slotIndex === 0
      ? "left-[6%] xl:left-[8%] bottom-[19.5%] z-10 h-[56%] max-w-[29%]"
      : slotIndex === 1
        ? "left-[37%] xl:left-[37%] bottom-[17%] z-20 h-[62%] max-w-[29%]"
        : "right-[5%] xl:right-[6%] bottom-[14.5%] z-30 h-[57%] max-w-[30%]";

  const mobilePlacement =
    slotIndex === 0
      ? "h-[154px] sm:h-[202px] -translate-y-2 sm:-translate-y-2.5 z-10"
      : slotIndex === 1
        ? "h-[172px] sm:h-[224px] -translate-y-0.5 z-20"
        : "h-[160px] sm:h-[210px] translate-y-1 z-30";

  const loadingMode: "eager" | "lazy" =
    isCurrentSlide || isPreloadSlide ? "eager" : "lazy";
  const fetchPriorityMode = !isCurrentSlide ? "low" : undefined;

  return (
    <Link
      href={`/products/${bottle.handle}`}
      tabIndex={isCurrentSlide ? undefined : -1}
      aria-label={`${bottle.title} — ${formatPriceINR(bottle.price)}`}
      className={`group flex flex-col items-center justify-end focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-4 rounded-[8px] ${
        variant === "desktop"
          ? `absolute ${desktopPlacement}`
          : `relative flex-1 min-w-0 ${mobilePlacement}`
      }`}
    >
      <div className="relative h-full w-full flex items-end justify-center">
        <img
          src={bottle.image}
          alt={bottle.title}
          width={bottle.width}
          height={bottle.height}
          loading={loadingMode}
          fetchPriority={fetchPriorityMode}
          decoding="async"
          className={`max-h-full w-auto max-w-full object-contain object-bottom transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:-translate-y-1 ${
            bottle.isCutout
              ? "drop-shadow-[0_14px_20px_rgba(32,24,16,0.22)]"
              : "mix-blend-multiply rounded-[6px]"
          }`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[72%] h-3 rounded-full bg-[#2B2016]/28 blur-[5px]"
        />
      </div>

      <span className="pointer-events-none mt-1.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 motion-reduce:transition-none bg-white/95 backdrop-blur-xs border border-[#DFD7CA] rounded-full px-2.5 py-0.5 text-[10px] font-medium text-[#24211E] shadow-xs whitespace-nowrap max-w-[175px] truncate hidden sm:inline-block">
        {bottle.shortTitle} · {formatPriceINR(bottle.price)}
      </span>
    </Link>
  );
}

function SlideCopy({
  slide,
  isPrimarySlide,
  isActive,
  isBlackFriday,
  compact,
}: {
  slide: HeroSlideData;
  isPrimarySlide: boolean;
  isActive: boolean;
  isBlackFriday: boolean;
  compact: boolean;
}) {
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex flex-wrap items-center gap-2">
        {isBlackFriday && (
          <span className="bf-badge-glow inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1F1D1B] text-[#D4AF7A] text-[10px] font-semibold uppercase tracking-[0.14em]">
            <Sparkles size={10} aria-hidden="true" />
            Black Friday
          </span>
        )}
        <p className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-[#5C4E3C]">
          {slide.eyebrow}
        </p>
      </div>

      {isPrimarySlide ? (
        <h1
          className={`font-serif font-semibold text-[#1E1B18] tracking-[-0.02em] ${
            compact
              ? "text-[32px] sm:text-[40px] leading-[1.08]"
              : "text-[42px] xl:text-[52px] leading-[1.06]"
          }`}
        >
          {slide.headlineTop}{" "}
          <span className="block">{slide.headlineAccent}</span>
        </h1>
      ) : (
        <h2
          className={`font-serif font-semibold text-[#1E1B18] tracking-[-0.02em] ${
            compact
              ? "text-[32px] sm:text-[40px] leading-[1.08]"
              : "text-[42px] xl:text-[52px] leading-[1.06]"
          }`}
        >
          {slide.headlineTop}{" "}
          <span className="block">{slide.headlineAccent}</span>
        </h2>
      )}

      <p
        className={`text-[#464038] leading-[1.6] ${
          compact ? "text-[13.5px] sm:text-[14.5px]" : "text-[14.5px] xl:text-[15.5px] max-w-md"
        }`}
      >
        {slide.description}
      </p>

      {slide.featuredBrands.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {(compact ? slide.featuredBrands.slice(0, 6) : slide.featuredBrands).map((brand) => (
            <Link
              key={brand.slug}
              href={brand.href}
              tabIndex={isActive ? undefined : -1}
              className="px-2.5 py-0.5 sm:py-1 rounded-full bg-white/75 hover:bg-white border border-[#DCD4C8] hover:border-[#9A7953] text-[10.5px] sm:text-[11px] font-medium text-[#3F3A33] hover:text-[#1E1B18] transition-colors"
            >
              {brand.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
        <Link
          href={slide.ctaHref}
          tabIndex={isActive ? undefined : -1}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#24211E] hover:bg-[#141210] text-white text-xs font-semibold tracking-[0.03em] px-5 sm:px-6 py-3 sm:py-3.5 transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-2"
        >
          <span>{slide.ctaLabel}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link
          href={slide.secondaryCtaHref}
          tabIndex={isActive ? undefined : -1}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 hover:bg-white text-[#24211E] border border-[#C6BCB0] hover:border-[#9A7953] text-xs font-semibold tracking-[0.03em] px-4 sm:px-5 py-3 sm:py-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-2"
        >
          <span>{slide.secondaryCtaLabel}</span>
        </Link>
      </div>

      {/* Verified Store Trust Indicators */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3.5 max-w-[360px] sm:max-w-sm border-t border-[#DED6CA]/90">
        <Link
          href="/collections/all"
          tabIndex={isActive ? undefined : -1}
          className="flex items-center gap-1.5 sm:gap-2 text-[#2E2923] hover:text-[#9A7953] transition-colors"
        >
          <ShieldCheck
            size={15}
            strokeWidth={1.6}
            className="text-[#8A6B46] shrink-0"
            aria-hidden="true"
          />
          <span className="text-[10.5px] sm:text-[11px] leading-tight font-medium">
            Authentic
            <span className="block text-[9.5px] sm:text-[10px] text-[#564E43]">
              Products
            </span>
          </span>
        </Link>
        <Link
          href="/pages/shipping-policy"
          tabIndex={isActive ? undefined : -1}
          className="flex items-center gap-1.5 sm:gap-2 text-[#2E2923] hover:text-[#9A7953] transition-colors"
        >
          <Truck
            size={15}
            strokeWidth={1.6}
            className="text-[#8A6B46] shrink-0"
            aria-hidden="true"
          />
          <span className="text-[10.5px] sm:text-[11px] leading-tight font-medium">
            Pan-India
            <span className="block text-[9.5px] sm:text-[10px] text-[#564E43]">
              Shipping
            </span>
          </span>
        </Link>
        <Link
          href="/pages/returns-refund-policy"
          tabIndex={isActive ? undefined : -1}
          className="flex items-center gap-1.5 sm:gap-2 text-[#2E2923] hover:text-[#9A7953] transition-colors"
        >
          <RotateCcw
            size={15}
            strokeWidth={1.6}
            className="text-[#8A6B46] shrink-0"
            aria-hidden="true"
          />
          <span className="text-[10.5px] sm:text-[11px] leading-tight font-medium">
            Easy
            <span className="block text-[9.5px] sm:text-[10px] text-[#564E43]">
              Returns
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function HeroShowcase({
  slides,
}: {
  slides: HeroSlideData[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [liveMessage, setLiveMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const isBlackFriday = useBlackFridayActive();
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);

  const slideCount = slides.length;
  const safeActiveIdx = slideCount > 0 ? activeIdx % slideCount : 0;
  const currentSlide = slides[safeActiveIdx];
  const nextSlideIdx = slideCount > 0 ? (safeActiveIdx + 1) % slideCount : 0;

  const selectSlide = useCallback(
    (nextIndex: number, announce = true) => {
      if (slideCount === 0) return;
      const wrapped = ((nextIndex % slideCount) + slideCount) % slideCount;
      setActiveIdx(wrapped);
      if (announce) {
        const target = slides[wrapped];
        setLiveMessage(
          `Slide ${wrapped + 1} of ${slideCount}: ${target.tabLabel} — ${target.headlineTop} ${target.headlineAccent}`
        );
      }
    },
    [slideCount, slides]
  );

  const goPrev = useCallback(() => {
    selectSlide(safeActiveIdx - 1, true);
  }, [safeActiveIdx, selectSlide]);

  const goNext = useCallback(() => {
    selectSlide(safeActiveIdx + 1, true);
  }, [safeActiveIdx, selectSlide]);

  // Autoplay: respects prefers-reduced-motion, hover/focus pause, and tab visibility
  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let timerId: number | null = null;

    const startTimer = () => {
      if (timerId !== null) window.clearInterval(timerId);
      if (document.visibilityState === "hidden") return;
      timerId = window.setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % slideCount);
      }, AUTOPLAY_INTERVAL_MS);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (timerId !== null) {
          window.clearInterval(timerId);
          timerId = null;
        }
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      if (timerId !== null) window.clearInterval(timerId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [slideCount, isPaused, safeActiveIdx]);

  const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
  };

  const handlePointerUp = (e: PointerEvent<HTMLElement>) => {
    const startX = pointerStartXRef.current;
    const startY = pointerStartYRef.current;
    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
    if (startX === null || startY === null) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) >= 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  if (!currentSlide) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured fragrance collections"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative w-full overflow-hidden bg-[#F3EEE6] border-b border-[#E6DFD3] touch-pan-y select-none lg:select-text"
    >
      {/* DESKTOP VIEWPORT (lg+: Full-width sunlit architectural backdrop) */}
      <div className="hidden lg:block relative w-full min-h-[540px] xl:min-h-[590px]">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous fragrance category"
          className="inline-flex items-center justify-center absolute left-4 xl:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#24211E] border border-[#DDD5C7] shadow-xs transition-all cursor-pointer touch-manipulation active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-2"
        >
          <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next fragrance category"
          className="inline-flex items-center justify-center absolute right-4 xl:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#24211E] border border-[#DDD5C7] shadow-xs transition-all cursor-pointer touch-manipulation active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-2"
        >
          <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <picture className="pointer-events-none select-none">
          <source srcSet="/images/fragrance-hero-bg.webp" type="image/webp" />
          <img
            src="/images/fragrance-hero-bg.png"
            alt=""
            width={1024}
            height={512}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </picture>

        <div className="relative z-10 max-w-[1440px] mx-auto px-14 xl:px-20 min-h-[540px] xl:min-h-[590px] grid grid-cols-12 items-center gap-6">
          {/* Left 42% Editorial Copy */}
          <div className="col-span-5 py-12 relative">
            <div className="relative min-h-[370px] flex items-center">
              {slides.map((slide, idx) => {
                const isActive = idx === safeActiveIdx;
                return (
                  <div
                    key={slide.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${idx + 1} of ${slideCount}: ${slide.tabLabel}`}
                    aria-hidden={!isActive}
                    inert={!isActive ? true : undefined}
                    className={`w-full transition-all duration-500 ease-out motion-reduce:transition-none ${
                      isActive
                        ? "relative opacity-100 translate-x-0 z-10"
                        : "absolute inset-0 opacity-0 translate-x-3 pointer-events-none z-0"
                    }`}
                  >
                    <SlideCopy
                      slide={slide}
                      isPrimarySlide={idx === 0}
                      isActive={isActive}
                      isBlackFriday={isBlackFriday}
                      compact={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 58% Stone Plinth Composition */}
          <div className="col-span-7 relative h-[490px] xl:h-[540px] self-end">
            {slides.map((slide, idx) => {
              const isActive = idx === safeActiveIdx;
              const isPreload = idx === nextSlideIdx;
              return (
                <div
                  key={slide.id}
                  aria-hidden={!isActive}
                  inert={!isActive ? true : undefined}
                  className={`absolute inset-0 transition-all duration-500 ease-out motion-reduce:transition-none ${
                    isActive
                      ? "opacity-100 translate-x-0 z-10"
                      : "opacity-0 translate-x-4 pointer-events-none z-0"
                  }`}
                >
                  {slide.bottles.map((bottle, bIdx) => (
                    <PlinthBottle
                      key={bottle.id}
                      bottle={bottle}
                      slotIndex={bIdx}
                      isCurrentSlide={isActive}
                      isPreloadSlide={isPreload}
                      variant="desktop"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET VIEWPORT (< lg: Headline First + Full-Detail Stone Plinth Stage) */}
      <div className="lg:hidden">
        <div className="px-4 sm:px-8 pt-6 pb-5 bg-[#F4EFE7]">
          <div className="max-w-xl mx-auto relative">
            {slides.map((slide, idx) => {
              const isActive = idx === safeActiveIdx;
              return (
                <div
                  key={slide.id}
                  aria-hidden={!isActive}
                  inert={!isActive ? true : undefined}
                  className={`transition-all duration-400 ease-out motion-reduce:transition-none ${
                    isActive
                      ? "relative opacity-100 translate-x-0 z-10"
                      : "absolute inset-0 opacity-0 translate-x-3 pointer-events-none z-0"
                  }`}
                >
                  <SlideCopy
                    slide={slide}
                    isPrimarySlide={idx === 0}
                    isActive={isActive}
                    isBlackFriday={isBlackFriday}
                    compact
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Stone Plinth Stage */}
        <div className="relative w-full h-[245px] sm:h-[305px] overflow-hidden border-t border-[#E7E0D4]">
          <picture className="pointer-events-none select-none">
            <source srcSet="/images/fragrance-hero-bg.webp" type="image/webp" />
            <img
              src="/images/fragrance-hero-bg.png"
              alt=""
              width={1024}
              height={512}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-[72%_65%]"
            />
          </picture>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous fragrance category"
            className="inline-flex items-center justify-center absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#24211E] border border-[#DDD5C7] shadow-xs touch-manipulation focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-2"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next fragrance category"
            className="inline-flex items-center justify-center absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#24211E] border border-[#DDD5C7] shadow-xs touch-manipulation focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-2"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>

          {slides.map((slide, idx) => {
            const isActive = idx === safeActiveIdx;
            const isPreload = idx === nextSlideIdx;
            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                inert={!isActive ? true : undefined}
                className={`absolute inset-0 max-w-lg mx-auto px-10 sm:px-14 flex items-end justify-center gap-2 sm:gap-5 pb-9 sm:pb-10 transition-all duration-400 ease-out motion-reduce:transition-none ${
                  isActive
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 translate-x-4 pointer-events-none z-0"
                }`}
              >
                {slide.bottles.map((bottle, bIdx) => (
                  <PlinthBottle
                    key={bottle.id}
                    bottle={bottle}
                    slotIndex={bIdx}
                    isCurrentSlide={isActive}
                    isPreloadSlide={isPreload}
                    variant="mobile"
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Screen-reader polite status announcement on user-initiated navigation */}
      <p className="sr-only" role="status" aria-live="polite">
        {liveMessage}
      </p>

      {/* Bottom Center Pagination Indicators */}
      <nav
        aria-label="Choose featured fragrance category slide"
        className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1"
      >
        {slides.map((slide, idx) => {
          const isCurrent = idx === safeActiveIdx;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => selectSlide(idx, true)}
              aria-label={`Go to ${slide.tabLabel} (slide ${idx + 1} of ${slideCount})`}
              aria-current={isCurrent ? "true" : undefined}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-1"
            >
              <span
                aria-hidden="true"
                className={`block rounded-full transition-all duration-300 motion-reduce:transition-none ${
                  isCurrent
                    ? "w-5 h-2 bg-[#24211E]"
                    : "w-2 h-2 bg-white/90 border border-[#8E8171]"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </section>
  );
}
