import { NextRequest, NextResponse } from "next/server";
import {
  filterProducts,
  getAllPerfumeSummaries,
  getCollectionDefinition,
  getFacetCounts,
  sortProducts,
  toGridSummary,
  type BrandTier,
  type CatalogFilters,
  type FragranceGender,
  type SizeBucket,
  type SortKey,
} from "@/lib/catalog";

function parseListParam(sp: URLSearchParams, key: string): string[] | undefined {
  const allValues = sp
    .getAll(key)
    .flatMap((v) => v.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
  return allValues.length > 0 ? allValues : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const collectionSlug = (sp.get("collection") || "").trim();
    const def = collectionSlug ? getCollectionDefinition(collectionSlug) : null;

    const allPerfumes = getAllPerfumeSummaries();
    let pool = def ? filterProducts(allPerfumes, def.filters) : allPerfumes;
    if (collectionSlug === "bestsellers") {
      pool = pool.filter((p) => p.isBestseller || p.isFlagship || p.discountPct >= 30);
    }

    const minPriceRaw = sp.get("minPrice");
    const maxPriceRaw = sp.get("maxPrice");

    const userFilters: CatalogFilters = {
      query: (sp.get("q") || "").trim() || undefined,
      brands: parseListParam(sp, "brands"),
      tiers: parseListParam(sp, "tiers") as BrandTier[] | undefined,
      genders: parseListParam(sp, "genders") as FragranceGender[] | undefined,
      concentrations: parseListParam(sp, "concentrations"),
      sizes: parseListParam(sp, "sizes") as SizeBucket[] | undefined,
      families: parseListParam(sp, "families"),
      occasions: parseListParam(sp, "occasions"),
      seasons: parseListParam(sp, "seasons"),
      minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
      maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
      inStockOnly: sp.get("inStockOnly") === "1" || undefined,
      discountedOnly: sp.get("discountedOnly") === "1" || undefined,
      giftSetsOnly: sp.get("giftSetsOnly") === "1" || undefined,
      miniaturesOnly: sp.get("miniaturesOnly") === "1" || undefined,
    };

    const sortKey = (sp.get("sort") || def?.filters.sort || "featured") as SortKey;
    const offset = Math.max(0, Number(sp.get("offset") || "0") || 0);
    const limit = Math.min(60, Math.max(1, Number(sp.get("limit") || "24") || 24));

    const filtered = filterProducts(pool, userFilters);
    const sorted = sortProducts(filtered, sortKey);
    const slice = sorted.slice(offset, offset + limit).map(toGridSummary);

    const includeFacets = sp.get("facets") === "1";

    return NextResponse.json(
      {
        items: slice,
        total: sorted.length,
        ...(includeFacets ? { facets: getFacetCounts(pool) } : {}),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Catalog API error:", error);
    return NextResponse.json({ error: "Catalog query failed" }, { status: 500 });
  }
}

