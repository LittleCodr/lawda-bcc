"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Sparkles,
  Gift,
  ChevronDown,
  MapPin,
  Check,
  Star,
  Share2,
  Droplets,
  Calendar,
  Compass,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCartStore } from "@/lib/store";
import { trackEcommerceEvent } from "@/lib/analytics";
import { useBlackFridayActive } from "@/lib/black-friday";
import {
  formatPriceINR,
  type EnrichedProduct,
  type ProductSummary,
} from "@/lib/catalog-types";
import ProductImageGallery from "@/components/ProductImageGallery";
import WishlistButton from "@/components/WishlistButton";
import ProductCarousel from "@/components/ProductCarousel";
import RecentlyViewed from "@/components/RecentlyViewed";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  createdAt?: string;
}

interface ProductUIProps {
  product: EnrichedProduct;
  summary: ProductSummary;
  similarProducts: ProductSummary[];
  sameBrandProducts: ProductSummary[];
}

export default function ProductUI({
  product,
  summary,
  similarProducts,
  sameBrandProducts,
}: ProductUIProps) {
  const router = useRouter();
  const { addItem, setIsOpen } = useCartStore();
  const isBlackFriday = useBlackFridayActive();

  const defaultVariant =
    product.variants.find((v) => v.available) || product.variants[0] || null;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant?.id || product.id
  );
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Delivery Pincode Estimator state
  const [pincode, setPincode] = useState("");
  const [pinTouched, setPinTouched] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinResult, setPinResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  // Sticky mobile purchase bar observer
  const primaryActionRef = useRef<HTMLDivElement>(null);
  const [showStickyMobile, setShowStickyMobile] = useState(false);

  // Honest Firestore Customer Reviews (zero fake seeding)
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState("");
  const [revBody, setRevBody] = useState("");
  const [revSubmitting, setRevSubmitting] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || defaultVariant;

  const unitPrice = activeVariant ? activeVariant.price : product.price;
  const compareAt = activeVariant
    ? activeVariant.compareAtPrice
    : product.compareAtPrice;
  const variantDiscountPct =
    compareAt && compareAt > unitPrice
      ? Math.round(((compareAt - unitPrice) / compareAt) * 100)
      : product.discountPct;
  const inStock = activeVariant ? activeVariant.available : product.available;
  const primaryImage =
    activeVariant?.featuredImage || product.image || "/placeholder.svg";

  useEffect(() => {
    const el = primaryActionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setShowStickyMobile(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    async function loadReviews() {
      try {
        const q = query(
          collection(db, "reviews"),
          where("productHandle", "==", product.handle)
        );
        const snap = await getDocs(q);
        if (!active) return;
        const loaded: ReviewItem[] = [];
        snap.forEach((doc) => {
          const d = doc.data();
          loaded.push({
            id: doc.id,
            author: String(d.author || "Verified Collector"),
            rating: Number(d.rating) || 5,
            title: String(d.title || ""),
            comment: String(d.comment || ""),
            createdAt: d.createdAt?.toDate
              ? d.createdAt.toDate().toLocaleDateString("en-IN")
              : undefined,
          });
        });
        setReviews(loaded);
      } catch {
        // Gracefully handle empty/restricted reads with clean state
        if (active) setReviews([]);
      } finally {
        if (active) setReviewsLoading(false);
      }
    }
    loadReviews();
    return () => {
      active = false;
    };
  }, [product.handle]);

  useEffect(() => {
    trackEcommerceEvent("view_item", {
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_brand: product.brand,
          item_variant: product.primarySize,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }, [product.id, product.title, product.brand, product.primarySize, product.price]);

  const handleAddToCart = (openDrawer = true) => {
    if (!inStock || unitPrice <= 0) return;
    addItem({
      id: product.id,
      title: product.title,
      price: unitPrice,
      image: primaryImage,
      quantity: qty,
      variantId: activeVariant?.id,
      variantTitle: activeVariant?.title || product.primarySize,
    });
    trackEcommerceEvent("add_to_cart", {
      value: unitPrice * qty,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_brand: product.brand,
          item_variant: activeVariant?.title || product.primarySize,
          price: unitPrice,
          quantity: qty,
        },
      ],
    });
    setAddedFeedback(true);
    if (openDrawer) setIsOpen(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleBuyNow = () => {
    if (!inStock || unitPrice <= 0) return;
    addItem({
      id: product.id,
      title: product.title,
      price: unitPrice,
      image: primaryImage,
      quantity: qty,
      variantId: activeVariant?.id,
      variantTitle: activeVariant?.title || product.primarySize,
    });
    trackEcommerceEvent("add_to_cart", {
      value: unitPrice * qty,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_brand: product.brand,
          item_variant: activeVariant?.title || product.primarySize,
          price: unitPrice,
          quantity: qty,
        },
      ],
    });
    setIsOpen(false);
    router.push("/checkout");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied");
    } catch {
      toast.error("Unable to copy link");
    }
  };

  const checkPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinTouched(true);
    const clean = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setPinResult({
        ok: false,
        message: "Please enter a valid 6-digit Indian PIN code (e.g., 110001).",
      });
      return;
    }

    setPinLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
      const json = await res.json();
      const first = Array.isArray(json) ? json[0] : null;
      if (first?.Status === "Success" && first.PostOffice?.length > 0) {
        const po = first.PostOffice[0];
        setPinResult({
          ok: true,
          message: `Free Express Delivery available to ${po.District}, ${po.State} (2–5 business days via air/surface courier).`,
        });
      } else {
        setPinResult({
          ok: false,
          message: "PIN code not found in India Post directory. Double-check digits and retry.",
        });
      }
    } catch {
      setPinResult({
        ok: true,
        message: "Prepaid Express India serviceability covers almost all 19,000+ PIN codes (2–5 business days).",
      });
    } finally {
      setPinLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revBody.trim()) {
      toast.error("Please enter your name and review comments.");
      return;
    }
    setRevSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        productHandle: product.handle,
        productTitle: product.title,
        author: revName.trim(),
        rating: revRating,
        title: revTitle.trim(),
        comment: revBody.trim(),
        createdAt: serverTimestamp(),
      });
      setReviews((prev) => [
        {
          id: docRef.id,
          author: revName.trim(),
          rating: revRating,
          title: revTitle.trim(),
          comment: revBody.trim(),
          createdAt: "Just now",
        },
        ...prev,
      ]);
      setRevName("");
      setRevTitle("");
      setRevBody("");
      setReviewFormOpen(false);
      toast.success("Thank you! Your review has been published.");
    } catch {
      toast.error("Sign in on Account or try again to publish verified reviews.");
    } finally {
      setRevSubmitting(false);
    }
  };

  const comparePeers = similarProducts.slice(0, 3);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="bg-white">
      {/* Main Product Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-[#777777] mb-6 flex flex-wrap items-center gap-2"
        >
          <Link href="/" className="hover:text-[#242424]">
            Home
          </Link>
          <span>/</span>
          <Link href="/brands" className="hover:text-[#242424]">
            Brands
          </Link>
          <span>/</span>
          <Link href={`/brands/${product.brandSlug}`} className="hover:text-[#242424]">
            {product.brand}
          </Link>
          <span>/</span>
          <span className="text-[#242424] font-medium truncate max-w-[240px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* ABOVE THE FOLD: 2-Column Asymmetric Gallery + Sticky Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Product Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={product.images}
              productTitle={product.title}
              discountPct={variantDiscountPct}
              available={inStock}
              isFlagship={product.isFlagship}
              selectedImageSrc={activeVariant?.featuredImage || null}
            />
          </div>

          {/* Right Column: Purchase Box (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Brand Link + Utility Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/brands/${product.brandSlug}`}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9A7953] hover:text-[#242424] transition-colors"
              >
                {product.brand}
              </Link>

              <div className="flex items-center gap-2">
                <WishlistButton
                  handle={product.handle}
                  title={product.title}
                  className="w-9 h-9"
                />
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share this perfume"
                  className="w-9 h-9 rounded-full border border-[#E8E6E1] bg-white hover:bg-[#F7F6F3] flex items-center justify-center text-[#5C5954] transition-colors cursor-pointer"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="font-serif text-[28px] sm:text-[36px] font-semibold text-[#242424] leading-[1.14] tracking-tight">
                {product.title}
              </h1>

              {product.tagline && (
                <p className="text-sm text-[#5C5954] mt-2 leading-relaxed">
                  {product.tagline}
                </p>
              )}

              {/* Concise Real Meta Row */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-[4px] bg-[#F7F6F3] border border-[#E8E6E1] text-[11px] font-semibold text-[#242424]">
                  {product.concentration}
                </span>
                <span className="px-2.5 py-1 rounded-[4px] bg-[#F7F6F3] border border-[#E8E6E1] text-[11px] font-medium text-[#5C5954]">
                  {product.gender}
                </span>
                <span className="px-2.5 py-1 rounded-[4px] bg-[#F7F6F3] border border-[#E8E6E1] text-[11px] font-medium text-[#5C5954]">
                  {product.primarySize}
                </span>
                {avgRating && (
                  <a
                    href="#customer-reviews"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#F5EFE6] text-[11px] font-semibold text-[#242424]"
                  >
                    <Star size={12} className="fill-[#9A7953] text-[#9A7953]" />
                    <span>{avgRating}</span>
                    <span className="text-[#777777] font-normal">({reviews.length})</span>
                  </a>
                )}
              </div>
            </div>

            {/* Pricing Panel */}
            <div className="p-4 sm:p-5 rounded-[10px] bg-[#F7F6F3] border border-[#E8E6E1] space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-[#242424] tabular-nums">
                  {formatPriceINR(unitPrice)}
                </span>
                {compareAt && compareAt > unitPrice && (
                  <span className="text-lg text-[#96928B] line-through tabular-nums">
                    {formatPriceINR(compareAt)}
                  </span>
                )}
                {variantDiscountPct > 0 && (
                  isBlackFriday ? (
                    <span className="bf-badge-glow px-2.5 py-0.5 rounded-[4px] bg-[#141210] text-[#D4AF7A] border text-[11px] font-bold uppercase tracking-wider">
                      Black Friday · Save {variantDiscountPct}%
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#B83232] text-white text-[11px] font-bold uppercase tracking-wider">
                      Save {variantDiscountPct}%
                    </span>
                  )
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5C5954]">Inclusive of all taxes · Free Express Delivery</span>
                <span
                  className={`font-semibold ${
                    inStock ? "text-[#347A54]" : "text-[#B83232]"
                  }`}
                >
                  {inStock ? "In Stock & Ready to Ship" : "Currently Sold Out"}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E8E6E1] text-xs text-[#5C5954] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#9A7953] shrink-0" />
                <span>
                  Use <strong className="text-[#242424]">OCTOPUS5</strong> for 5% OFF on ₹5,000+ · Buy 2 get 3% / 3+ get 5%
                </span>
              </div>
            </div>

            {/* Bottle Size / Variant Selection */}
            {product.variants.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#242424]">
                    Bottle Size / Option
                  </span>
                  <span className="text-xs text-[#777777]">
                    {activeVariant?.title || product.primarySize}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const selected = v.id === activeVariant?.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-4 py-2.5 rounded-[6px] border text-xs font-semibold transition-all cursor-pointer ${
                          selected
                            ? "border-[#1F1D1B] bg-[#1F1D1B] text-white"
                            : "border-[#D4CFC7] bg-white text-[#242424] hover:border-[#242424]"
                        } ${!v.available ? "opacity-50" : ""}`}
                      >
                        {v.title} · {formatPriceINR(v.price)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Primary Purchase CTAs */}
            <div ref={primaryActionRef} className="space-y-3">
              <div className="flex items-stretch gap-3">
                <div className="flex items-center border border-[#D4CFC7] rounded-[6px] bg-[#F7F6F3] px-1">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-[#5C5954] hover:text-[#242424] cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-[#242424] tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="p-2.5 text-[#5C5954] hover:text-[#242424] cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!inStock}
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 btn-luxury-secondary py-3.5 px-5 text-xs uppercase tracking-[0.14em] disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  {addedFeedback ? (
                    <>
                      <Check size={15} className="text-[#347A54]" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} /> {inStock ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                disabled={!inStock}
                onClick={handleBuyNow}
                className="w-full btn-luxury-primary py-4 text-xs tracking-[0.18em] disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {inStock
                  ? `Buy Now — ${formatPriceINR(unitPrice * qty)}`
                  : "Currently Unavailable"}
              </button>
            </div>

            {/* Complimentary Tester Highlight */}
            <div className="p-3.5 rounded-[8px] border border-[#E8E6E1] bg-white flex items-center gap-3">
              <div className="w-11 h-11 rounded-[6px] bg-[#F7F6F3] p-1 shrink-0 flex items-center justify-center">
                <img
                  src="/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png"
                  alt="Complimentary Paradox 7ML EDP"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A7953] flex items-center gap-1">
                  <Gift size={12} /> Complimentary Bonus
                </p>
                <p className="text-xs font-medium text-[#242424]">
                  Free 7ML Paradox EDP pocket spray added automatically with this order.
                </p>
              </div>
            </div>

            {/* Real PIN Code Serviceability Estimator */}
            <div className="p-4 rounded-[8px] border border-[#E8E6E1] bg-white space-y-2.5">
              <label
                htmlFor="pdp-pincode"
                className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#242424] flex items-center gap-1.5"
              >
                <MapPin size={14} className="text-[#9A7953]" /> Check India Express Delivery
              </label>
              <p className="text-[11px] text-[#777777]">
                Enter a 6-digit Indian PIN code (e.g. 110001 or 400001).
              </p>
              <form onSubmit={checkPincode} className="flex gap-2" noValidate>
                <input
                  id="pdp-pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[1-9][0-9]{5}"
                  autoComplete="postal-code"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    if (pinResult) setPinResult(null);
                  }}
                  placeholder="Enter 6-digit PIN"
                  className={`flex-1 fc-input px-3 py-2 text-xs ${
                    pinTouched && !/^[1-9][0-9]{5}$/.test(pincode)
                      ? "user-invalid-fallback"
                      : ""
                  }`}
                />
                <button
                  type="submit"
                  disabled={pinLoading}
                  className="btn-luxury-secondary px-4 py-2 text-xs shrink-0"
                >
                  {pinLoading ? "Checking..." : "Check"}
                </button>
              </form>
              {pinResult && (
                <p
                  className={`text-xs leading-relaxed ${
                    pinResult.ok ? "text-[#347A54]" : "text-[#B83232]"
                  }`}
                >
                  {pinResult.message}
                </p>
              )}
            </div>

            {/* Concise Trust & Return Accordions */}
            <div className="fc-accordion border-t border-[#E8E6E1]">
              <details className="py-3">
                <summary className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-[#242424] py-1">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#347A54]" /> 100% Authenticity Guarantee
                  </span>
                  <ChevronDown size={14} className="text-[#777777]" />
                </summary>
                <p className="pt-2 text-xs text-[#5C5954] leading-relaxed">
                  Every unit is factory cellophane sealed with verifiable laser/printed batch codes on box and bottle. We never stock decants passed off as sealed originals or unverified testers.
                </p>
              </details>

              <details className="py-3">
                <summary className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-[#242424] py-1">
                  <span className="flex items-center gap-2">
                    <Truck size={14} className="text-[#9A7953]" /> Shipping &amp; Unboxing Policy
                  </span>
                  <ChevronDown size={14} className="text-[#777777]" />
                </summary>
                <p className="pt-2 text-xs text-[#5C5954] leading-relaxed">
                  Dispatched securely across India free of cost via insured express couriers. Please record a brief single-take unboxing video when opening transit parcels in case of breakage or shortage.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* BELOW THE FOLD: Editorial Perfume Breakdown */}
      <section className="bg-[#F7F6F3] border-y border-[#E8E6E1] py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Fragrance Pyramid OR Olfactory Character */}
          {product.notes ? (
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                  Olfactory Architecture
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#242424]">
                  Fragrance Notes Pyramid
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    stage: "Top Notes",
                    subtitle: "First Impression · 0–20 Mins",
                    list: product.notes.top,
                  },
                  {
                    stage: "Heart Notes",
                    subtitle: "Core Signature · 20 Mins–3 Hrs",
                    list: product.notes.heart,
                  },
                  {
                    stage: "Base Notes",
                    subtitle: "Dry Down & Trail · 4+ Hours",
                    list: product.notes.base,
                  },
                ].map((tier) => (
                  <div
                    key={tier.stage}
                    className="bg-white border border-[#E8E6E1] rounded-[10px] p-6 shadow-luxury"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953]">
                      {tier.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl font-semibold text-[#242424] mt-1 mb-4">
                      {tier.stage}
                    </h3>
                    {tier.list.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tier.list.map((note) => (
                          <span
                            key={note}
                            className="px-3 py-1.5 rounded-full bg-[#F7F6F3] border border-[#E8E6E1] text-xs font-medium text-[#242424]"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#777777]">
                        Blended seamlessly within the core accord.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Characteristics & Wearing Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Editorial Copy / Sanitized House Narrative */}
            <div className="lg:col-span-7 bg-white border border-[#E8E6E1] rounded-[10px] p-6 sm:p-8 shadow-luxury space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953]">
                About {product.brand}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424]">
                The Scent Profile &amp; Craft
              </h2>

              {product.inspiredBy && (
                <div className="p-3.5 rounded-[8px] bg-[#F5EFE6] border border-[#E8E6E1] text-xs text-[#242424]">
                  <strong className="uppercase tracking-wider text-[#9A7953] mr-2">
                    Fine Fragrance Profile:
                  </strong>
                  <span>{product.inspiredBy}</span>
                </div>
              )}

              {product.scentStory && (
                <p className="text-sm text-[#3E3C38] leading-relaxed">
                  {product.scentStory}
                </p>
              )}

              {product.goodToKnow && product.goodToKnow.length > 0 && (
                <ul className="space-y-1.5 pt-2">
                  {product.goodToKnow.map((pt) => (
                    <li
                      key={pt}
                      className="text-xs text-[#5C5954] flex items-center gap-2"
                    >
                      <Check size={13} className="text-[#347A54] shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}

              {product.cleanHtml && !product.isFlagship && (
                <div
                  className="prose prose-sm max-w-none text-[#3E3C38] leading-relaxed [&_h1]:text-base [&_h1]:font-semibold [&_h4]:text-xs [&_h4]:uppercase [&_h4]:tracking-wider [&_h4]:text-[#9A7953] [&_h4]:mt-4 [&_table]:w-full [&_td]:py-1 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: product.cleanHtml }}
                />
              )}
            </div>

            {/* Wearing Spec Grid */}
            <div className="lg:col-span-5 bg-white border border-[#E8E6E1] rounded-[10px] p-6 sm:p-8 shadow-luxury space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953]">
                Wearing Guide
              </p>
              <h3 className="font-serif text-2xl font-semibold text-[#242424]">
                At-a-Glance Characteristics
              </h3>

              <dl className="divide-y divide-[#E8E6E1] text-sm">
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-xs text-[#777777] flex items-center gap-2">
                    <Droplets size={14} className="text-[#9A7953]" /> Concentration
                  </dt>
                  <dd className="font-medium text-[#242424] text-right">
                    {product.concentration}
                  </dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-xs text-[#777777] flex items-center gap-2">
                    <Compass size={14} className="text-[#9A7953]" /> Scent Family
                  </dt>
                  <dd className="font-medium text-[#242424] text-right">
                    {product.families.join(", ")}
                  </dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-xs text-[#777777] flex items-center gap-2">
                    <Calendar size={14} className="text-[#9A7953]" /> Recommended Season
                  </dt>
                  <dd className="font-medium text-[#242424] text-right">
                    {product.seasons.join(", ")}
                  </dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-xs text-[#777777] flex items-center gap-2">
                    <Clock size={14} className="text-[#9A7953]" /> Best Occasions
                  </dt>
                  <dd className="font-medium text-[#242424] text-right">
                    {product.occasions.join(", ")}
                  </dd>
                </div>
                {product.origin && (
                  <div className="py-3 flex items-center justify-between gap-4">
                    <dt className="text-xs text-[#777777]">Origin</dt>
                    <dd className="font-medium text-[#242424] text-right max-w-[60%]">
                      {product.origin}
                    </dd>
                  </div>
                )}
              </dl>

              <p className="text-xs text-[#777777] bg-[#F7F6F3] p-3.5 rounded-[6px] leading-relaxed">
                Tip: Spray onto moisturized pulse points (wrists, behind ears, and collarbone) without rubbing to keep top-note aromatics crisp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Table */}
      {comparePeers.length > 0 && (
        <section className="py-12 border-b border-[#E8E6E1]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Collector Comparison
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424]">
                Compare with Similar Scents
              </h2>
            </div>

            <div className="overflow-x-auto border border-[#E8E6E1] rounded-[10px]">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead>
                  <tr className="bg-[#F7F6F3] border-b border-[#E8E6E1]">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#777777] w-44">
                      Attribute
                    </th>
                    {[summary, ...comparePeers].map((item, idx) => (
                      <th key={item.id} className="p-4 align-top">
                        <div className="flex flex-col gap-2">
                          <div className="w-16 h-16 rounded-[6px] bg-white border border-[#E8E6E1] p-1 flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            {idx === 0 && (
                              <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#9A7953] text-white rounded-[3px] mb-1">
                                Current Bottle
                              </span>
                            )}
                            <Link
                              href={`/products/${item.handle}`}
                              className="block text-xs font-semibold text-[#242424] hover:text-[#9A7953] line-clamp-2"
                            >
                              {item.title}
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E1] text-xs">
                  <tr>
                    <td className="p-4 font-semibold text-[#5C5954]">Price</td>
                    {[summary, ...comparePeers].map((item) => (
                      <td key={item.id} className="p-4 font-bold text-[#242424] tabular-nums">
                        {formatPriceINR(item.price)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#5C5954]">House</td>
                    {[summary, ...comparePeers].map((item) => (
                      <td key={item.id} className="p-4 text-[#242424]">
                        {item.brand}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#5C5954]">Concentration</td>
                    {[summary, ...comparePeers].map((item) => (
                      <td key={item.id} className="p-4 text-[#242424]">
                        {item.concentration}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#5C5954]">Size &amp; Gender</td>
                    {[summary, ...comparePeers].map((item) => (
                      <td key={item.id} className="p-4 text-[#242424]">
                        {item.primarySize} · {item.gender}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#5C5954]">Scent Families</td>
                    {[summary, ...comparePeers].map((item) => (
                      <td key={item.id} className="p-4 text-[#5C5954]">
                        {item.families.slice(0, 2).join(", ")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Honest Firestore Product Reviews */}
      <section
        id="customer-reviews"
        className="py-12 border-b border-[#E8E6E1] scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Verified Collector Feedback
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424]">
                Reviews {reviews.length > 0 ? `(${reviews.length})` : ""}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setReviewFormOpen((o) => !o)}
              className="btn-luxury-secondary px-4 py-2 text-xs"
            >
              {reviewFormOpen ? "Close Form" : "Write a Review"}
            </button>
          </div>

          {reviewFormOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 p-5 sm:p-6 rounded-[10px] border border-[#E8E6E1] bg-[#F7F6F3] space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rev-name" className="block text-xs font-semibold text-[#242424] mb-1">
                    Your Name *
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="e.g. Aarav S."
                    className="fc-input px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="rev-rating" className="block text-xs font-semibold text-[#242424] mb-1">
                    Rating
                  </label>
                  <select
                    id="rev-rating"
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="fc-input px-3 py-2 text-xs"
                  >
                    <option value={5}>5 Stars — Exceptional</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Balanced</option>
                    <option value={2}>2 Stars — Mild</option>
                    <option value={1}>1 Star — Not For Me</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="rev-title" className="block text-xs font-semibold text-[#242424] mb-1">
                  Review Headline
                </label>
                <input
                  id="rev-title"
                  type="text"
                  value={revTitle}
                  onChange={(e) => setRevTitle(e.target.value)}
                  placeholder="How does the projection and longevity perform?"
                  className="fc-input px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label htmlFor="rev-body" className="block text-xs font-semibold text-[#242424] mb-1">
                  Your Review *
                </label>
                <textarea
                  id="rev-body"
                  rows={3}
                  required
                  value={revBody}
                  onChange={(e) => setRevBody(e.target.value)}
                  placeholder="Share opening impression, dry-down, and longevity in your climate..."
                  className="fc-input px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={revSubmitting}
                className="btn-luxury-primary px-6 py-2.5 text-xs"
              >
                {revSubmitting ? "Publishing..." : "Submit Review"}
              </button>
            </form>
          )}

          {reviewsLoading ? (
            <p className="text-xs text-[#777777]">Loading collector reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="p-5 rounded-[10px] border border-[#E8E6E1] bg-white space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-[#9A7953]">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={13} className="fill-[#9A7953]" />
                      ))}
                    </div>
                    {r.createdAt && (
                      <span className="text-[11px] text-[#777777]">{r.createdAt}</span>
                    )}
                  </div>
                  {r.title && (
                    <h3 className="text-sm font-semibold text-[#242424]">{r.title}</h3>
                  )}
                  <p className="text-xs sm:text-sm text-[#5C5954] leading-relaxed">
                    {r.comment}
                  </p>
                  <p className="text-[11px] font-semibold text-[#242424] pt-1">
                    — {r.author}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-[10px] border border-[#E8E6E1] bg-[#F7F6F3] text-center space-y-2">
              <p className="text-sm font-medium text-[#242424]">
                No reviews published for {product.title} yet.
              </p>
              <p className="text-xs text-[#777777]">
                We only show genuine customer reviews — click &ldquo;Write a Review&rdquo; to share your wearing experience.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Carousels */}
      {sameBrandProducts.length > 0 && (
        <ProductCarousel
          eyebrow={`More from ${product.brand}`}
          title={`More by ${product.brand}`}
          viewAllHref={`/brands/${product.brandSlug}`}
          viewAllLabel={`View All ${product.brand}`}
          products={sameBrandProducts}
        />
      )}

      {similarProducts.length > 0 && (
        <ProductCarousel
          eyebrow="Customers Also Explored"
          title="Similar Scent Profiles"
          viewAllHref="/collections/all"
          products={similarProducts}
        />
      )}

      <RecentlyViewed currentProduct={summary} />

      {/* Mobile Sticky Bottom Purchase Bar (triggers when main CTA scrolls away) */}
      {showStickyMobile && inStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8E6E1] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#777777] truncate">
              {activeVariant?.title || product.primarySize}
            </p>
            <p className="text-base font-bold text-[#242424] tabular-nums">
              {formatPriceINR(unitPrice * qty)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            className="btn-luxury-primary px-5 py-2.5 text-xs shrink-0"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
