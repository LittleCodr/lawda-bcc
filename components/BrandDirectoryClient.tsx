"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { formatPriceINR, type BrandSummary, type BrandTier } from "@/lib/catalog-types";

interface BrandDirectoryClientProps {
  brands: BrandSummary[];
}

const TIER_TABS: { value: "all" | BrandTier; label: string }[] = [
  { value: "all", label: "All Houses" },
  { value: "middle-eastern", label: "Middle Eastern" },
  { value: "designer", label: "Designer" },
  { value: "niche", label: "Haute Niche" },
  { value: "in-house", label: "Octopus × Harsh Beniwal" },
];

export default function BrandDirectoryClient({ brands }: BrandDirectoryClientProps) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<"all" | BrandTier>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brands.filter((b) => {
      if (tier !== "all" && b.tier !== tier) return false;
      if (q && !b.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [brands, query, tier]);

  // Alphabetical grouping for quick jump bar
  const grouped = useMemo(() => {
    const groups = new Map<string, BrandSummary[]>();
    const alphaSorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    for (const b of alphaSorted) {
      const ch = b.name.charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(ch) ? ch : "#";
      const arr = groups.get(letter) || [];
      arr.push(b);
      groups.set(letter, arr);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="bg-[#F7F6F3] border border-[#E8E6E1] rounded-[10px] p-4 sm:p-5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {TIER_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTier(t.value)}
              className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                tier === t.value
                  ? "bg-[#1F1D1B] text-white"
                  : "bg-white border border-[#D4CFC7] text-[#3E3C38] hover:border-[#242424]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]"
          />
          <label htmlFor="brand-filter-input" className="sr-only">
            Filter fragrance houses by name
          </label>
          <input
            id="brand-filter-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find house (Dior, Rasasi, Creed...)"
            className="fc-input pl-9 pr-3 py-2 text-xs"
          />
        </div>
      </div>

      {/* Alphabet Quick Jump Pills */}
      {grouped.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-4 border-b border-[#E8E6E1]">
          {grouped.map(([letter]) => (
            <a
              key={letter}
              href={`#brand-letter-${letter}`}
              className="w-8 h-8 rounded-[6px] border border-[#E8E6E1] bg-white hover:bg-[#1F1D1B] hover:text-white text-xs font-semibold text-[#242424] flex items-center justify-center transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      {/* Alphabetical Brand Sections */}
      {grouped.length > 0 ? (
        <div className="space-y-10">
          {grouped.map(([letter, list]) => (
            <section key={letter} id={`brand-letter-${letter}`} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-serif text-3xl font-semibold text-[#242424]">
                  {letter}
                </h2>
                <span className="h-px flex-1 bg-[#E8E6E1]" />
                <span className="text-xs text-[#777777]">{list.length} houses</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {list.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/brands/${b.slug}`}
                    className="group p-3.5 rounded-[8px] border border-[#E8E6E1] bg-white hover:border-[#9A7953] shadow-luxury hover:shadow-luxury-hover transition-all flex items-center gap-3.5"
                  >
                    <div className="w-14 h-14 rounded-[6px] bg-[#F7F6F3] p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={b.sampleImage}
                        alt={b.name}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors truncate">
                        {b.name}
                      </p>
                      <p className="text-[11px] text-[#777777] mt-0.5">
                        {b.count} {b.count === 1 ? "perfume" : "perfumes"} · From{" "}
                        {formatPriceINR(b.minPrice)}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-[#96928B] group-hover:text-[#9A7953] shrink-0"
                    />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 bg-[#F7F6F3] rounded-[10px] border border-[#E8E6E1]">
          <p className="font-serif text-2xl text-[#242424] mb-1">
            No houses match your search
          </p>
          <p className="text-xs text-[#777777]">
            Clear your search filter or switch to All Houses.
          </p>
        </div>
      )}
    </div>
  );
}

