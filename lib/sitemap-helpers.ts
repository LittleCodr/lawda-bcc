import fs from "fs";
import path from "path";
import { getAllBrands, type BrandInfo } from "@/lib/brands";
import {
  getAllCollectionSlugs,
  getAllProducts,
  type EnrichedProduct,
} from "@/lib/catalog";
import { rakhiConfig } from "@/app/collections/[slug]/rakhi-config";

export const SITE_URL = "https://www.octopusperfume.in";

export function toAbsoluteSiteUrl(src: string): string {
  if (!src) return `${SITE_URL}/placeholder.svg`;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${SITE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export function escapeXml(unsafe: string): string {
  return String(unsafe || "").replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return char;
    }
  });
}

export function toSafeDate(raw?: string): Date {
  if (!raw) return new Date();
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Returns every valid, indexable collection slug resolved by app/collections/[slug]/page.tsx.
 */
export function getValidCollectionSlugs(): string[] {
  const staticHandles = getAllCollectionSlugs();
  const seasonalHandles = Object.keys(rakhiConfig);

  let legacyHandles: string[] = [];
  try {
    const colPath = path.join(process.cwd(), "lib", "data", "collections.json");
    if (fs.existsSync(colPath)) {
      const parsed = JSON.parse(fs.readFileSync(colPath, "utf-8")) as Array<{
        handle?: string;
      }>;
      legacyHandles = parsed
        .map((c) => (c.handle || "").trim())
        .filter(Boolean);
    }
  } catch (err) {
    console.error("Error reading collections.json for sitemap:", err);
  }

  return Array.from(new Set([...staticHandles, ...seasonalHandles, ...legacyHandles]));
}

export function getVerifiedBrandEntries(): BrandInfo[] {
  return getAllBrands();
}

export function getVerifiedCatalogProducts(includeNonPerfumes = true): EnrichedProduct[] {
  const seenHandles = new Set<string>();
  const unique: EnrichedProduct[] = [];

  for (const product of getAllProducts(includeNonPerfumes)) {
    if (!product.handle || seenHandles.has(product.handle)) continue;
    seenHandles.add(product.handle);
    unique.push(product);
  }

  return unique;
}

export function getHarshBeniwalPerfumeHandles(): string[] {
  try {
    const hbPath = path.join(
      process.cwd(),
      "harsh-beniwal",
      "octopus",
      "perfumes",
      "scraped_products.json"
    );
    if (!fs.existsSync(hbPath)) return [];
    const parsed = JSON.parse(fs.readFileSync(hbPath, "utf-8")) as Array<{
      handle?: string;
    }>;
    return parsed.map((p) => (p.handle || "").trim()).filter(Boolean);
  } catch (err) {
    console.error("Error reading Harsh Beniwal handles for sitemap:", err);
    return [];
  }
}

