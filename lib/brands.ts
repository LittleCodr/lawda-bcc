import fs from "fs";
import path from "path";

export interface BrandInfo {
  name: string;
  slug: string;
  count: number;
  sampleImage: string;
  minPrice: number;
  maxPrice: number;
}

const BRAND_ALIASES: Record<string, string> = {
  Bvlagri: "Bvlgari",
};

function normalizeName(vendor?: string | null): string {
  const clean = (vendor || "").trim();
  if (!clean) return "Octopus Perfumes";
  return BRAND_ALIASES[clean] || clean;
}

export function slugifyBrand(name: string): string {
  return normalizeName(name)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let cachedBrands: BrandInfo[] | null = null;

export function getAllBrands(): BrandInfo[] {
  if (cachedBrands) return cachedBrands;

  const rawPath = path.join(process.cwd(), "lib", "data", "products.json");
  const raw = JSON.parse(fs.readFileSync(rawPath, "utf8")) as Array<{
    vendor?: string;
    product_type?: string;
    title?: string;
    variants?: Array<{ price?: string | number }>;
    images?: Array<{ src?: string; local_src?: string; localPath?: string }>;
  }>;

  const map = new Map<string, BrandInfo>();

  for (const p of raw) {
    const pType = (p.product_type || "").trim();
    if (!/^(Perfume|Perfume & Cologne|perf)$/i.test(pType)) continue;
    if (/\bgift card\b|\bblotter\b|\bstrips\b/i.test(p.title || "")) continue;

    const brand = normalizeName(p.vendor);
    if (brand === "Perfume Network India" || brand === "Buy 1 Get 1 Free") continue;

    const slug = slugifyBrand(brand);
    const price = Number(p.variants?.[0]?.price || 0);
    const img =
      p.images?.[0]?.local_src ||
      p.images?.[0]?.localPath ||
      p.images?.[0]?.src ||
      "/placeholder.svg";

    const existing = map.get(slug);
    if (!existing) {
      map.set(slug, {
        name: brand,
        slug,
        count: 1,
        sampleImage: img,
        minPrice: price,
        maxPrice: price,
      });
    } else {
      existing.count += 1;
      if (price > 0 && (existing.minPrice === 0 || price < existing.minPrice)) {
        existing.minPrice = price;
      }
      if (price > existing.maxPrice) existing.maxPrice = price;
      if (existing.sampleImage === "/placeholder.svg" && img !== "/placeholder.svg") {
        existing.sampleImage = img;
      }
    }
  }

  cachedBrands = Array.from(map.values()).sort((a, b) => b.count - a.count);
  return cachedBrands;
}

export function getBrandBySlug(slug: string): BrandInfo | null {
  const normalized =
    slug.toLowerCase().trim() === "bvlagri"
      ? "bvlgari"
      : slug.toLowerCase().trim();
  return getAllBrands().find((b) => b.slug === normalized) || null;
}
