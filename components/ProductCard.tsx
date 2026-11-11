"use client";

import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import type { ProductSummary } from "@/lib/catalog-types";
import { formatPriceINR } from "@/lib/catalog-types";
import type { Product as LegacyProduct } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import WishlistButton from "@/components/WishlistButton";
import { trackEcommerceEvent } from "@/lib/analytics";

type CardInput = ProductSummary | LegacyProduct;

function normalizeCardProduct(input: CardInput) {
  if ("handle" in input) {
    const defaultVariant =
      input.variants.find((v) => v.available) || input.variants[0] || null;
    return {
      id: input.id,
      handle: input.handle,
      title: input.title,
      brand: input.brand,
      brandSlug: input.brandSlug,
      gender: input.gender,
      concentrationShort: input.concentrationShort,
      primarySize: input.primarySize,
      price: defaultVariant ? defaultVariant.price : input.price,
      compareAtPrice: defaultVariant
        ? defaultVariant.compareAtPrice
        : input.compareAtPrice,
      discountPct: input.discountPct,
      available: input.available,
      isNewArrival: input.isNewArrival,
      isFlagship: input.isFlagship,
      image: input.image || "/placeholder.svg",
      secondaryImage: input.secondaryImage || null,
      variantId: defaultVariant?.id,
      variantTitle: defaultVariant?.title || input.primarySize,
    };
  }

  const discountPct =
    input.compareAtPrice > input.price
      ? Math.round(((input.compareAtPrice - input.price) / input.compareAtPrice) * 100)
      : 0;
  const legacyId = input.sku || input.slug;
  const genderLabel =
    /her|women/i.test(input.gender)
      ? "Women"
      : /him|men/i.test(input.gender)
        ? "Men"
        : "Unisex";
  return {
    id: legacyId,
    handle: input.slug,
    title: input.name,
    brand: "Octopus Perfumes by Harsh Beniwal",
    brandSlug: "octopus-perfumes-by-harsh-beniwal",
    gender: genderLabel,
    concentrationShort: "EDP",
    primarySize: "50ML",
    price: input.price,
    compareAtPrice: input.compareAtPrice > input.price ? input.compareAtPrice : null,
    discountPct,
    available: true,
    isNewArrival: false,
    isFlagship: true,
    image: input.images?.grid || input.images?.hero || "/placeholder.svg",
    secondaryImage: input.images?.box || input.images?.mood || null,
    variantId: legacyId,
    variantTitle: "50ML EDP",
  };
}

export default function ProductCard({
  product,
  priority = false,
}: {
  product: CardInput;
  index?: number;
  priority?: boolean;
}) {
  const { addItem, setIsOpen } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);

  const p = normalizeCardProduct(product);
  const href = `/products/${p.handle}`;

  const handleQuickAdd = () => {
    if (!p.available || p.price <= 0) return;
    addItem({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      quantity: 1,
      variantId: p.variantId,
      variantTitle: p.variantTitle,
    });
    trackEcommerceEvent("add_to_cart", {
      value: p.price,
      items: [
        {
          item_id: p.id,
          item_name: p.title,
          item_brand: p.brand,
          item_variant: p.variantTitle,
          price: p.price,
          quantity: 1,
        },
      ],
    });
    setJustAdded(true);
    setIsOpen(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="group flex flex-col h-full bg-white border border-[#E8E6E1] hover:border-[#D4CFC7] rounded-[8px] overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-200">
      {/* Studio Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#F7F6F3] overflow-hidden">
        <Link
          href={href}
          className="block w-full h-full p-4 sm:p-5 flex items-center justify-center relative"
          aria-label={p.title}
        >
          <img
            src={p.image}
            alt={p.title}
            loading={priority ? "eager" : "lazy"}
            className={`w-full h-full object-contain transition-all duration-300 ${
              p.secondaryImage
                ? "group-hover:opacity-0 group-hover:scale-[1.03]"
                : "group-hover:scale-[1.04]"
            } ${!p.available ? "opacity-55 grayscale-[35%]" : ""}`}
          />
          {p.secondaryImage && (
            <img
              src={p.secondaryImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-4 sm:p-5 opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-300"
            />
          )}
        </Link>

        {/* Top-left Status / Savings Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
          {!p.available ? (
            <span className="inline-block bg-[#242424] text-white text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-[4px]">
              Sold Out
            </span>
          ) : p.discountPct > 0 ? (
            <span className="inline-block bg-[#B83232] text-white text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-[4px]">
              -{p.discountPct}% Off
            </span>
          ) : p.isFlagship ? (
            <span className="inline-block bg-[#9A7953] text-white text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-[4px]">
              25% Oil EDP
            </span>
          ) : p.isNewArrival ? (
            <span className="inline-block bg-[#1F1D1B] text-white text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-[4px]">
              New
            </span>
          ) : null}
        </div>

        {/* Wishlist Action */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton handle={p.handle} title={p.title} className="w-8 h-8" />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Link
            href={`/brands/${p.brandSlug}`}
            className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.11em] text-[#777777] hover:text-[#9A7953] transition-colors truncate"
          >
            {p.brand}
          </Link>
        </div>

        <Link href={href} className="block">
          <h3 className="text-[13px] sm:text-[14px] font-medium text-[#242424] group-hover:text-[#9A7953] transition-colors leading-[1.38] line-clamp-2 min-h-[2.4rem]">
            {p.title}
          </h3>
        </Link>

        <p className="text-[11px] text-[#777777] mt-1 truncate">
          {p.primarySize}
          {p.concentrationShort && !p.primarySize.toLowerCase().includes(p.concentrationShort.toLowerCase())
            ? ` · ${p.concentrationShort}`
            : ""}
          {p.gender ? ` · ${p.gender}` : ""}
        </p>

        {/* Price Row */}
        <div className="mt-auto pt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-[15px] sm:text-[16px] font-bold text-[#242424] tabular-nums">
            {formatPriceINR(p.price)}
          </span>
          {p.compareAtPrice && p.compareAtPrice > p.price && (
            <span className="text-[12px] text-[#96928B] line-through tabular-nums">
              {formatPriceINR(p.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Quick Add CTA */}
        <div className="mt-3">
          {p.available && p.price > 0 ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`w-full py-2 px-3 rounded-[6px] text-[11px] font-semibold uppercase tracking-[0.08em] inline-flex items-center justify-center gap-1.5 border transition-colors touch-manipulation cursor-pointer ${
                justAdded
                  ? "bg-[#347A54] text-white border-[#347A54]"
                  : "bg-[#F7F6F3] text-[#242424] border-[#E8E6E1] hover:bg-[#1F1D1B] hover:text-white hover:border-[#1F1D1B]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={13} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={13} /> Quick Add
                </>
              )}
            </button>
          ) : (
            <Link
              href={href}
              className="w-full py-2 px-3 rounded-[6px] text-[11px] font-semibold uppercase tracking-[0.08em] inline-flex items-center justify-center border border-[#E8E6E1] text-[#777777] bg-white hover:border-[#D4CFC7] transition-colors"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
