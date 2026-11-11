import { NextRequest, NextResponse } from "next/server";
import {
  getAllPerfumeSummaries,
  getBrandSummaries,
  filterProducts,
  sortProducts,
} from "@/lib/catalog";

export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get("q") || "").trim();
    const limitParam = Number(request.nextUrl.searchParams.get("limit") || "12");
    const limit = Math.min(Math.max(1, limitParam), 40);

    if (!q || q.length < 2) {
      return NextResponse.json({
        results: [],
        brands: [],
        total: 0,
      });
    }

    const qLower = q.toLowerCase();
    const all = getAllPerfumeSummaries();
    const matched = filterProducts(all, { query: q });

    const scored = sortProducts(matched, "featured").sort((a, b) => {
      if (a.isMiniature !== b.isMiniature) return a.isMiniature ? 1 : -1;
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aExact = aTitle.includes(qLower) ? 1 : 0;
      const bExact = bTitle.includes(qLower) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      const aStarts = aTitle.startsWith(qLower) || a.brand.toLowerCase().startsWith(qLower) ? 1 : 0;
      const bStarts = bTitle.startsWith(qLower) || b.brand.toLowerCase().startsWith(qLower) ? 1 : 0;
      return bStarts - aStarts;
    });

    const brands = getBrandSummaries()
      .filter(
        (b) =>
          b.name.toLowerCase().includes(qLower) ||
          b.slug.includes(qLower.replace(/\s+/g, "-"))
      )
      .slice(0, 4);

    return NextResponse.json({
      results: scored.slice(0, limit).map((r) => ({ ...r, notes: null })),
      brands,
      total: matched.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
