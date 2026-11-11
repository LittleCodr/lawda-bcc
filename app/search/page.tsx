import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllPerfumeSummaries,
  filterProducts,
  getBrandSummaries,
  toGridSummary,
} from "@/lib/catalog";
import CatalogExplorer from "@/components/CatalogExplorer";

export const metadata: Metadata = {
  title: "Search Perfumes & Fragrance Houses | Octopus Perfumes",
  description:
    "Search over 1,700 authentic designer, niche, and Middle Eastern fragrances by house, note, concentration, or bottle size.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const query = (sp.q || "").trim();

  const allPerfumes = getAllPerfumeSummaries();
  const matched = query ? filterProducts(allPerfumes, { query }) : allPerfumes;
  const matchingBrands = query
    ? getBrandSummaries()
        .filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Bar */}
        <div className="bg-[#F7F6F3] border border-[#E8E6E1] rounded-[10px] p-6 sm:p-8 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1.5">
            Catalog Search
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#242424] mb-4">
            {query ? `Results for "${query}"` : "Search All Fragrances"}
          </h1>

          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <label htmlFor="page-search-input" className="sr-only">
              Search fragrances
            </label>
            <input
              id="page-search-input"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Try 'Hawas Ice', 'Khamrah', 'Oud', 'Dior Sauvage', 'Vanilla'..."
              className="flex-1 fc-input px-4 py-2.5 text-sm"
            />
            <button type="submit" className="btn-luxury-primary px-6 py-2.5 text-xs shrink-0">
              Search Catalog
            </button>
          </form>

          {matchingBrands.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#E8E6E1] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#5C5954] mr-1">
                Matching Houses:
              </span>
              {matchingBrands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="px-3 py-1 rounded-full bg-white border border-[#D4CFC7] hover:border-[#242424] text-xs font-semibold text-[#242424]"
                >
                  {b.name} ({b.count})
                </Link>
              ))}
            </div>
          )}
        </div>

        <CatalogExplorer
          products={matched.map(toGridSummary)}
          emptyTitle={query ? `No perfumes matched "${query}"` : "No perfumes found"}
          emptyDescription="Try searching a single brand name (Lattafa, Rasasi, Creed, Dior), concentration (EDP, Extrait), or browse one of our curated collections."
        />
      </div>
    </div>
  );
}

