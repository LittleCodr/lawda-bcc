import fs from "fs";
import path from "path";
import type { BrandSummary, BrandTier, ProductSummary } from "@/lib/catalog-types";

export interface HeroSlideBottle {
  id: string;
  handle: string;
  title: string;
  shortTitle: string;
  brand: string;
  price: number;
  image: string;
  isCutout: boolean;
  width: number;
  height: number;
}

export interface HeroFeaturedBrand {
  label: string;
  name: string;
  slug: string;
  href: string;
}

export interface HeroSlideData {
  id: "designer" | "middle-eastern" | "niche";
  tabLabel: string;
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  featuredBrands: HeroFeaturedBrand[];
  bottles: HeroSlideBottle[];
}

interface BrandCandidateSpec {
  label: string;
  matchNames: string[];
}

interface SlideDefinition {
  id: "designer" | "middle-eastern" | "niche";
  tabLabel: string;
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  tier: BrandTier;
  requestedBrands: BrandCandidateSpec[];
  preferredHandles: string[];
}

const SLIDE_DEFINITIONS: SlideDefinition[] = [
  {
    id: "designer",
    tabLabel: "Designer Fragrances",
    eyebrow: "THE WORLD OF DESIGNER FRAGRANCE",
    headlineTop: "Timeless Icons.",
    headlineAccent: "Unforgettable Impressions.",
    description:
      "Discover iconic fragrances from the world's most recognised luxury designers.",
    ctaLabel: "Explore Designer",
    ctaHref: "/collections/designer-perfumes",
    secondaryCtaLabel: "Explore by Category",
    secondaryCtaHref: "#shop-by-category",
    tier: "designer",
    requestedBrands: [
      { label: "Dior", matchNames: ["Christian Dior", "Dior"] },
      { label: "Chanel", matchNames: ["Chanel"] },
      { label: "Versace", matchNames: ["Versace"] },
      { label: "Armani", matchNames: ["Giorgio Armani", "Emporio Armani", "Armani"] },
      { label: "YSL", matchNames: ["Yves Saint Laurent", "YSL"] },
      { label: "Tom Ford", matchNames: ["Tom Ford"] },
      { label: "Prada", matchNames: ["Prada"] },
      { label: "Paco Rabanne", matchNames: ["Paco Rabanne", "Rabanne"] },
    ],
    preferredHandles: [
      "dior-sauvage-elixir",
      "yves-saint-laurent-y-eau-de-parfum-intense-for-men",
      "versace-eros-parfum-for-men",
      "armani-acqua-di-gio-profondo-parfum-for-men",
    ],
  },
  {
    id: "middle-eastern",
    tabLabel: "Middle Eastern Perfumes",
    eyebrow: "DISCOVER THE ART OF ARABIAN PERFUMERY",
    headlineTop: "Bold Scents.",
    headlineAccent: "Extraordinary Character.",
    description:
      "Explore captivating oud, amber, gourmand and oriental fragrances from the Middle East.",
    ctaLabel: "Explore Middle Eastern",
    ctaHref: "/collections/middle-eastern-perfumes",
    secondaryCtaLabel: "Explore by Category",
    secondaryCtaHref: "#shop-by-category",
    tier: "middle-eastern",
    requestedBrands: [
      { label: "Lattafa", matchNames: ["Lattafa"] },
      { label: "Afnan", matchNames: ["Afnan"] },
      { label: "Rasasi", matchNames: ["Rasasi"] },
      { label: "Armaf", matchNames: ["Armaf"] },
      { label: "Ajmal", matchNames: ["Ajmal"] },
      { label: "Al Haramain", matchNames: ["Al Haramain"] },
      { label: "Maison Alhambra", matchNames: ["Maison Alhambra"] },
      { label: "Paris Corner", matchNames: ["Paris Corner"] },
      { label: "Fragrance World", matchNames: ["Fragrance World"] },
    ],
    preferredHandles: [
      "lattafa-khamrah-waha-eau-de-parfum-for-men",
      "afnan-9pm-elixir-for-men",
      "rasasi-hawas-fire-eau-de-parfum-for-men",
      "afnan-supremacy-collectors-edition-eau-de-parfum-for-men",
    ],
  },
  {
    id: "niche",
    tabLabel: "Niche Fragrances",
    eyebrow: "BEYOND THE ORDINARY",
    headlineTop: "For Those Who Seek",
    headlineAccent: "Something Rare.",
    description:
      "Discover distinctive compositions, exceptional ingredients and fragrances that make a lasting impression.",
    ctaLabel: "Explore Niche",
    ctaHref: "/collections/niche-perfumes",
    secondaryCtaLabel: "Explore by Category",
    secondaryCtaHref: "#shop-by-category",
    tier: "niche",
    requestedBrands: [
      { label: "Xerjoff", matchNames: ["Xerjoff"] },
      { label: "Nishane", matchNames: ["Nishane"] },
      { label: "Amouage", matchNames: ["Amouage"] },
      { label: "Creed", matchNames: ["Creed"] },
      { label: "Mancera", matchNames: ["Mancera"] },
      { label: "Montale", matchNames: ["Montale"] },
      { label: "Initio", matchNames: ["Initio"] },
      { label: "Parfums de Marly", matchNames: ["Parfums de Marly"] },
      { label: "Maison Francis Kurkdjian", matchNames: ["Maison Francis Kurkdjian", "MFK"] },
    ],
    preferredHandles: [
      "creed-aventus-eau-de-parfum-1",
      "parfums-de-marly-haltane-eau-de-parfum-for-men",
      "nishane-hacivat-extrait-de-parfum",
      "xerjoff-nio-eau-de-parfum",
    ],
  },
];

const CUTOUT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  "dior-sauvage-elixir": { w: 251, h: 430 },
  "yves-saint-laurent-y-eau-de-parfum-intense-for-men": { w: 228, h: 460 },
  "versace-eros-parfum-for-men": { w: 305, h: 411 },
  "armani-acqua-di-gio-profondo-parfum-for-men": { w: 240, h: 485 },
  "lattafa-khamrah-waha-eau-de-parfum-for-men": { w: 264, h: 420 },
  "afnan-9pm-elixir-for-men": { w: 211, h: 483 },
  "rasasi-hawas-fire-eau-de-parfum-for-men": { w: 232, h: 411 },
  "afnan-supremacy-collectors-edition-eau-de-parfum-for-men": { w: 239, h: 488 },
  "creed-aventus-eau-de-parfum-1": { w: 232, h: 422 },
  "parfums-de-marly-haltane-eau-de-parfum-for-men": { w: 236, h: 483 },
  "nishane-hacivat-extrait-de-parfum": { w: 266, h: 423 },
  "xerjoff-nio-eau-de-parfum": { w: 238, h: 554 },
};

function shortenTitle(title: string): string {
  return title
    .replace(/\s+(Eau de Parfum|Eau de Toilette|Extrait de Parfum|Parfum)\b.*$/i, "")
    .trim();
}

function resolveHeroBottle(p: ProductSummary): HeroSlideBottle {
  const cutoutRel = `/images/hero-bottles/${p.handle}.webp`;
  const cutoutAbs = path.join(process.cwd(), "public", cutoutRel);
  const hasCutout = fs.existsSync(cutoutAbs);
  const dims = CUTOUT_DIMENSIONS[p.handle] || { w: 300, h: 460 };

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    shortTitle: shortenTitle(p.title),
    brand: p.brand,
    price: p.price,
    image: hasCutout ? cutoutRel : p.image,
    isCutout: hasCutout,
    width: dims.w,
    height: dims.h,
  };
}

/**
 * Dynamically populates the 3-category hero carousel strictly from real in-stock
 * catalog products and verified existing catalog brands.
 */
export function buildHeroSlides(
  allPerfumes: ProductSummary[],
  allBrands: BrandSummary[]
): HeroSlideData[] {
  const byHandle = new Map(allPerfumes.map((p) => [p.handle, p]));
  const brandByLower = new Map(allBrands.map((b) => [b.name.toLowerCase(), b]));

  return SLIDE_DEFINITIONS.map((def) => {
    const verifiedBrands: HeroFeaturedBrand[] = [];
    for (const candidate of def.requestedBrands) {
      const matched = candidate.matchNames
        .map((n) => brandByLower.get(n.toLowerCase()))
        .find((b): b is BrandSummary => Boolean(b && b.count > 0));
      if (matched) {
        verifiedBrands.push({
          label: candidate.label,
          name: matched.name,
          slug: matched.slug,
          href: `/brands/${matched.slug}`,
        });
      }
    }

    const picked: ProductSummary[] = [];
    const seenIds = new Set<string>();

    for (const handle of def.preferredHandles) {
      const match = byHandle.get(handle);
      if (match && match.available && !seenIds.has(match.id)) {
        picked.push(match);
        seenIds.add(match.id);
      }
      if (picked.length >= 3) break;
    }

    // Dynamic catalog fallback if fewer than 3 preferred SKUs are in stock
    if (picked.length < 3) {
      const allowedSlugs = new Set(verifiedBrands.map((b) => b.slug));
      const pool = allPerfumes.filter(
        (p) =>
          p.available &&
          p.isPerfume &&
          !p.isGiftSet &&
          !p.isMiniature &&
          p.brandTier === def.tier &&
          !seenIds.has(p.id) &&
          (allowedSlugs.size === 0 || allowedSlugs.has(p.brandSlug))
      );
      for (const fallbackItem of pool) {
        picked.push(fallbackItem);
        seenIds.add(fallbackItem.id);
        if (picked.length >= 3) break;
      }
    }

    return {
      id: def.id,
      tabLabel: def.tabLabel,
      eyebrow: def.eyebrow,
      headlineTop: def.headlineTop,
      headlineAccent: def.headlineAccent,
      description: def.description,
      ctaLabel: def.ctaLabel,
      ctaHref: def.ctaHref,
      secondaryCtaLabel: def.secondaryCtaLabel,
      secondaryCtaHref: def.secondaryCtaHref,
      featuredBrands: verifiedBrands,
      bottles: picked.map(resolveHeroBottle),
    };
  });
}
