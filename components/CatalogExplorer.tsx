"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from "lucide-react";
import type {
  BrandTier,
  CatalogFilters,
  FragranceGender,
  ProductSummary,
  SizeBucket,
  SortKey,
} from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

interface CatalogExplorerProps {
  products: ProductSummary[];
  initialFilters?: CatalogFilters;
  hideBrandFilter?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const PAGE_SIZE = 24;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured & Bestselling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Savings" },
  { value: "newest", label: "Newest Releases" },
  { value: "title-asc", label: "Alphabetical (A–Z)" },
  { value: "title-desc", label: "Alphabetical (Z–A)" },
];

const TIER_LABELS: Record<BrandTier, string> = {
  "middle-eastern": "Middle Eastern",
  designer: "Designer",
  niche: "Niche & Haute Parfumerie",
  "in-house": "Octopus × Harsh Beniwal",
  miniatures: "Sampling & Vials",
  keepsakes: "Keepsakes",
};

function toggleArrayValue<T extends string>(arr: T[] | undefined, value: T): T[] {
  const list = arr || [];
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function applyClientFilters(
  items: ProductSummary[],
  filters: CatalogFilters,
  sort: SortKey
): ProductSummary[] {
  const q = (filters.query || "").trim().toLowerCase();
  const brandSet = filters.brands?.length ? new Set(filters.brands) : null;
  const tierSet = filters.tiers?.length ? new Set(filters.tiers) : null;
  const genderSet = filters.genders?.length ? new Set(filters.genders) : null;
  const concSet = filters.concentrations?.length ? new Set(filters.concentrations) : null;
  const sizeSet = filters.sizes?.length ? new Set(filters.sizes) : null;
  const famSet = filters.families?.length ? new Set(filters.families) : null;
  const occSet = filters.occasions?.length ? new Set(filters.occasions) : null;
  const seaSet = filters.seasons?.length ? new Set(filters.seasons) : null;

  const filtered = items.filter((p) => {
    if (brandSet && !brandSet.has(p.brandSlug) && !brandSet.has(p.brand)) return false;
    if (tierSet && !tierSet.has(p.brandTier)) return false;
    if (genderSet && !genderSet.has(p.gender)) return false;
    if (concSet && !concSet.has(p.concentration)) return false;
    if (sizeSet && !p.sizeBuckets.some((b) => sizeSet.has(b))) return false;
    if (famSet && !p.families.some((f) => famSet.has(f))) return false;
    if (occSet && !p.occasions.some((o) => occSet.has(o))) return false;
    if (seaSet && !p.seasons.some((s) => seaSet.has(s))) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    if (filters.inStockOnly && !p.available) return false;
    if (filters.discountedOnly && p.discountPct <= 0) return false;
    if (filters.giftSetsOnly && !p.isGiftSet) return false;
    if (filters.miniaturesOnly && !p.isMiniature) return false;
    if (q) {
      const hay = `${p.title} ${p.brand} ${p.concentration} ${p.gender} ${p.families.join(" ")}`.toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      if (!tokens.every((t) => hay.includes(t))) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "discount":
      return sorted.sort((a, b) => b.discountPct - a.discountPct || a.price - b.price);
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.available !== b.available) return a.available ? -1 : 1;
        if (a.isFlagship !== b.isFlagship) return a.isFlagship ? -1 : 1;
        if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
        return b.discountPct - a.discountPct;
      });
  }
}

export default function CatalogExplorer({
  products,
  initialFilters = {},
  hideBrandFilter = false,
  emptyTitle = "No matching fragrances found",
  emptyDescription = "Try removing a filter or widening your price bracket.",
}: CatalogExplorerProps) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [sort, setSort] = useState<SortKey>(initialFilters.sort || "featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [brandSearch, setBrandSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const mobileDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = mobileDialogRef.current;
    if (!dialog) return;
    if (mobileOpen && !dialog.open) dialog.showModal();
    else if (!mobileOpen && dialog.open) dialog.close();
  }, [mobileOpen]);

  // Build facet options strictly from incoming collection pool so counts match real items
  const facets = useMemo(() => {
    const brandMap = new Map<string, { label: string; count: number }>();
    const genderMap = new Map<FragranceGender, number>();
    const concMap = new Map<string, number>();
    const sizeMap = new Map<SizeBucket, number>();
    const famMap = new Map<string, number>();
    const occMap = new Map<string, number>();
    const tierMap = new Map<BrandTier, number>();

    for (const p of products) {
      if (p.brand !== "Perfume Network India" && p.brand !== "Buy 1 Get 1 Free") {
        const b = brandMap.get(p.brandSlug);
        brandMap.set(p.brandSlug, { label: p.brand, count: (b?.count || 0) + 1 });
      }
      genderMap.set(p.gender, (genderMap.get(p.gender) || 0) + 1);
      concMap.set(p.concentration, (concMap.get(p.concentration) || 0) + 1);
      tierMap.set(p.brandTier, (tierMap.get(p.brandTier) || 0) + 1);
      for (const s of p.sizeBuckets) sizeMap.set(s, (sizeMap.get(s) || 0) + 1);
      for (const f of p.families) famMap.set(f, (famMap.get(f) || 0) + 1);
      for (const o of p.occasions) occMap.set(o, (occMap.get(o) || 0) + 1);
    }

    const toSorted = <T extends string>(m: Map<T, number>) =>
      Array.from(m.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);

    return {
      brands: Array.from(brandMap.entries())
        .map(([value, info]) => ({ value, label: info.label, count: info.count }))
        .sort((a, b) => b.count - a.count),
      genders: toSorted(genderMap),
      concentrations: toSorted(concMap),
      sizes: toSorted(sizeMap),
      families: toSorted(famMap),
      occasions: toSorted(occMap),
      tiers: toSorted(tierMap),
    };
  }, [products]);

  const filteredProducts = useMemo(
    () => applyClientFilters(products, filters, sort),
    [products, filters, sort]
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const updateFilters = (patch: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSort(initialFilters.sort || "featured");
    setBrandSearch("");
    setVisibleCount(PAGE_SIZE);
  };

  // Build active removable chips
  const activeChips: { label: string; onClear: () => void }[] = [];
  for (const g of filters.genders || []) {
    activeChips.push({
      label: `Gender: ${g}`,
      onClear: () => updateFilters({ genders: filters.genders?.filter((x) => x !== g) }),
    });
  }
  for (const b of filters.brands || []) {
    const label = facets.brands.find((x) => x.value === b)?.label || b;
    activeChips.push({
      label: `House: ${label}`,
      onClear: () => updateFilters({ brands: filters.brands?.filter((x) => x !== b) }),
    });
  }
  for (const c of filters.concentrations || []) {
    activeChips.push({
      label: c,
      onClear: () =>
        updateFilters({ concentrations: filters.concentrations?.filter((x) => x !== c) }),
    });
  }
  for (const s of filters.sizes || []) {
    activeChips.push({
      label: `Size: ${s}`,
      onClear: () => updateFilters({ sizes: filters.sizes?.filter((x) => x !== s) }),
    });
  }
  for (const f of filters.families || []) {
    activeChips.push({
      label: f,
      onClear: () => updateFilters({ families: filters.families?.filter((x) => x !== f) }),
    });
  }
  for (const o of filters.occasions || []) {
    activeChips.push({
      label: o,
      onClear: () => updateFilters({ occasions: filters.occasions?.filter((x) => x !== o) }),
    });
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    activeChips.push({
      label: `₹${filters.minPrice ?? 0} – ₹${filters.maxPrice ?? "Max"}`,
      onClear: () => updateFilters({ minPrice: undefined, maxPrice: undefined }),
    });
  }
  if (filters.inStockOnly) {
    activeChips.push({
      label: "In Stock Only",
      onClear: () => updateFilters({ inStockOnly: false }),
    });
  }
  if (filters.discountedOnly) {
    activeChips.push({
      label: "On Sale",
      onClear: () => updateFilters({ discountedOnly: false }),
    });
  }

  const visibleBrandFacets = facets.brands.filter((b) =>
    brandSearch.trim() ? b.label.toLowerCase().includes(brandSearch.trim().toLowerCase()) : true
  );

  const renderFilterSections = (idPrefix: string) => (
    <div className="fc-accordion divide-y divide-[#E8E6E1] text-sm">
      {/* Availability & Deals */}
      <details open className="py-3.5 first:pt-0">
        <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
          <span>Availability &amp; Offers</span>
          <ChevronDown size={14} className="text-[#777777]" />
        </summary>
        <div className="pt-2.5 space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[#3E3C38]">
            <input
              type="checkbox"
              checked={!!filters.inStockOnly}
              onChange={(e) => updateFilters({ inStockOnly: e.target.checked })}
              className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
            />
            <span>In Stock Only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[#3E3C38]">
            <input
              type="checkbox"
              checked={!!filters.discountedOnly}
              onChange={(e) => updateFilters({ discountedOnly: e.target.checked })}
              className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
            />
            <span>Verified Markdowns Only</span>
          </label>
        </div>
      </details>

      {/* Price Bracket */}
      <details open className="py-3.5">
        <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
          <span>Price Range (INR)</span>
          <ChevronDown size={14} className="text-[#777777]" />
        </summary>
        <div className="pt-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${idPrefix}-min-price`} className="block text-[10px] uppercase text-[#777777] mb-1">
                Min ₹
              </label>
              <input
                id={`${idPrefix}-min-price`}
                type="number"
                min={0}
                step={100}
                value={filters.minPrice ?? ""}
                placeholder="0"
                onChange={(e) =>
                  updateFilters({
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs rounded-[6px] border border-[#D4CFC7] bg-white text-[#242424]"
              />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-max-price`} className="block text-[10px] uppercase text-[#777777] mb-1">
                Max ₹
              </label>
              <input
                id={`${idPrefix}-max-price`}
                type="number"
                min={0}
                step={100}
                value={filters.maxPrice ?? ""}
                placeholder="30000+"
                onChange={(e) =>
                  updateFilters({
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs rounded-[6px] border border-[#D4CFC7] bg-white text-[#242424]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { label: "Under ₹1,500", min: undefined, max: 1500 },
              { label: "₹1.5k–₹3k", min: 1500, max: 3000 },
              { label: "₹3k–₹6k", min: 3000, max: 6000 },
              { label: "₹6k+", min: 6000, max: undefined },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => updateFilters({ minPrice: b.min, maxPrice: b.max })}
                className={`px-2 py-1 rounded-[4px] text-[11px] border transition-colors cursor-pointer ${
                  filters.minPrice === b.min && filters.maxPrice === b.max
                    ? "bg-[#1F1D1B] text-white border-[#1F1D1B]"
                    : "bg-[#F7F6F3] text-[#3E3C38] border-[#E8E6E1] hover:border-[#D4CFC7]"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </details>

      {/* Gender */}
      {facets.genders.length > 1 && (
        <details open className="py-3.5">
          <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
            <span>Gender</span>
            <ChevronDown size={14} className="text-[#777777]" />
          </summary>
          <div className="pt-2.5 space-y-2">
            {facets.genders.map((g) => (
              <label key={g.value} className="flex items-center justify-between gap-2 cursor-pointer text-[13px] text-[#3E3C38]">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.genders?.includes(g.value) || false}
                    onChange={() =>
                      updateFilters({ genders: toggleArrayValue(filters.genders, g.value) })
                    }
                    className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
                  />
                  <span>{g.value}</span>
                </span>
                <span className="text-[11px] text-[#96928B] tabular-nums">{g.count}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      {/* Concentration */}
      {facets.concentrations.length > 1 && (
        <details open className="py-3.5">
          <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
            <span>Concentration</span>
            <ChevronDown size={14} className="text-[#777777]" />
          </summary>
          <div className="pt-2.5 space-y-2">
            {facets.concentrations.map((c) => (
              <label key={c.value} className="flex items-center justify-between gap-2 cursor-pointer text-[13px] text-[#3E3C38]">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.concentrations?.includes(c.value) || false}
                    onChange={() =>
                      updateFilters({
                        concentrations: toggleArrayValue(filters.concentrations, c.value),
                      })
                    }
                    className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
                  />
                  <span className="truncate">{c.value}</span>
                </span>
                <span className="text-[11px] text-[#96928B] tabular-nums">{c.count}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      {/* House / Brand */}
      {!hideBrandFilter && facets.brands.length > 1 && (
        <details className="py-3.5">
          <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
            <span>Perfume House ({facets.brands.length})</span>
            <ChevronDown size={14} className="text-[#777777]" />
          </summary>
          <div className="pt-2.5 space-y-2">
            {facets.brands.length > 8 && (
              <input
                type="search"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Filter houses..."
                className="w-full px-2.5 py-1.5 text-xs rounded-[6px] border border-[#D4CFC7] bg-[#F7F6F3] mb-1.5"
              />
            )}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {visibleBrandFacets.slice(0, 40).map((b) => (
                <label key={b.value} className="flex items-center justify-between gap-2 cursor-pointer text-[13px] text-[#3E3C38]">
                  <span className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={filters.brands?.includes(b.value) || false}
                      onChange={() =>
                        updateFilters({ brands: toggleArrayValue(filters.brands, b.value) })
                      }
                      className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
                    />
                    <span className="truncate">{b.label}</span>
                  </span>
                  <span className="text-[11px] text-[#96928B] tabular-nums shrink-0">{b.count}</span>
                </label>
              ))}
            </div>
          </div>
        </details>
      )}

      {/* Bottle Size */}
      {facets.sizes.length > 1 && (
        <details className="py-3.5">
          <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
            <span>Bottle Size</span>
            <ChevronDown size={14} className="text-[#777777]" />
          </summary>
          <div className="pt-2.5 space-y-2">
            {facets.sizes.map((s) => (
              <label key={s.value} className="flex items-center justify-between gap-2 cursor-pointer text-[13px] text-[#3E3C38]">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.sizes?.includes(s.value) || false}
                    onChange={() =>
                      updateFilters({ sizes: toggleArrayValue(filters.sizes, s.value) })
                    }
                    className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
                  />
                  <span>{s.value}</span>
                </span>
                <span className="text-[11px] text-[#96928B] tabular-nums">{s.count}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      {/* Fragrance Family */}
      {facets.families.length > 1 && (
        <details className="py-3.5">
          <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
            <span>Fragrance Family</span>
            <ChevronDown size={14} className="text-[#777777]" />
          </summary>
          <div className="pt-2.5 space-y-2">
            {facets.families.map((f) => (
              <label key={f.value} className="flex items-center justify-between gap-2 cursor-pointer text-[13px] text-[#3E3C38]">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.families?.includes(f.value) || false}
                    onChange={() =>
                      updateFilters({ families: toggleArrayValue(filters.families, f.value) })
                    }
                    className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
                  />
                  <span>{f.value}</span>
                </span>
                <span className="text-[11px] text-[#96928B] tabular-nums">{f.count}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      {/* Origin Tier */}
      {!hideBrandFilter && facets.tiers.length > 1 && (
        <details className="py-3.5">
          <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
            <span>Perfume Origin Tier</span>
            <ChevronDown size={14} className="text-[#777777]" />
          </summary>
          <div className="pt-2.5 space-y-2">
            {facets.tiers.map((t) => (
              <label key={t.value} className="flex items-center justify-between gap-2 cursor-pointer text-[13px] text-[#3E3C38]">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.tiers?.includes(t.value) || false}
                    onChange={() =>
                      updateFilters({ tiers: toggleArrayValue(filters.tiers, t.value) })
                    }
                    className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
                  />
                  <span>{TIER_LABELS[t.value]}</span>
                </span>
                <span className="text-[11px] text-[#96928B] tabular-nums">{t.count}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      {/* Occasion */}
      {facets.occasions.length > 1 && (
        <details className="py-3.5">
          <summary className="flex items-center justify-between font-semibold text-xs uppercase tracking-[0.12em] text-[#242424] py-1">
            <span>Occasion</span>
            <ChevronDown size={14} className="text-[#777777]" />
          </summary>
          <div className="pt-2.5 space-y-2">
            {facets.occasions.map((o) => (
              <label key={o.value} className="flex items-center justify-between gap-2 cursor-pointer text-[13px] text-[#3E3C38]">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.occasions?.includes(o.value) || false}
                    onChange={() =>
                      updateFilters({
                        occasions: toggleArrayValue(filters.occasions, o.value),
                      })
                    }
                    className="rounded border-[#D4CFC7] accent-[#1F1D1B]"
                  />
                  <span>{o.value}</span>
                </span>
                <span className="text-[11px] text-[#96928B] tabular-nums">{o.count}</span>
              </label>
            ))}
          </div>
        </details>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Desktop Sticky Sidebar Filters */}
      <aside
        aria-label="Filter fragrances"
        className="hidden lg:block w-[265px] shrink-0 sticky top-24 bg-white border border-[#E8E6E1] rounded-[10px] p-5 shadow-luxury"
      >
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#E8E6E1]">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#242424]">
            Refine Results
          </h2>
          {activeChips.length > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-semibold text-[#9A7953] hover:text-[#242424] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
        </div>
        {renderFilterSections("desktop")}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        {/* Top Utility Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E8E6E1]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] border border-[#D4CFC7] bg-white hover:bg-[#F7F6F3] text-xs font-semibold text-[#242424] cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Filters{activeChips.length > 0 ? ` (${activeChips.length})` : ""}</span>
            </button>

            <p className="text-xs sm:text-sm text-[#5C5954]">
              Showing <strong className="text-[#242424] tabular-nums">{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1 ? "perfume" : "perfumes"}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="catalog-sort" className="text-xs text-[#777777] hidden sm:inline">
              Sort by:
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3 py-2 rounded-[6px] border border-[#D4CFC7] bg-white text-xs sm:text-[13px] font-medium text-[#242424] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.onClear}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F6F3] border border-[#D4CFC7] hover:border-[#242424] text-xs font-medium text-[#242424] transition-colors cursor-pointer"
              >
                <span>{chip.label}</span>
                <X size={12} />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#9A7953] hover:text-[#242424] underline underline-offset-4 px-1.5 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid or Honest Empty State */}
        {visibleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
              {visibleProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="mt-10 text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="btn-luxury-secondary px-8 py-3 text-xs uppercase tracking-[0.12em]"
                >
                  Load More ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-4 bg-[#F7F6F3] border border-[#E8E6E1] rounded-[10px]">
            <h3 className="font-serif text-2xl font-semibold text-[#242424] mb-2">
              {emptyTitle}
            </h3>
            <p className="text-sm text-[#777777] max-w-md mx-auto mb-6">
              {emptyDescription}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-luxury-primary px-6 py-3 text-xs"
            >
              Reset Active Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <dialog
        ref={mobileDialogRef}
        closedby="any"
        data-side="left"
        onCancel={(e) => {
          e.preventDefault();
          setMobileOpen(false);
        }}
        onClick={(e) => {
          const panel = mobileDialogRef.current?.firstElementChild;
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          if (e.clientX > rect.right || e.clientX < rect.left || e.clientY > rect.bottom || e.clientY < rect.top) {
            setMobileOpen(false);
          }
        }}
        aria-label="Filter fragrances"
        className="fc-drawer"
      >
        <div className="fc-drawer-panel w-[min(90vw,360px)] h-full bg-white flex flex-col shadow-2xl">
          <div className="px-5 py-4 border-b border-[#E8E6E1] bg-[#F7F6F3] flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-[#242424]">
              Filters
            </h3>
            <div className="flex items-center gap-3">
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#9A7953] cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
                className="p-1.5 rounded-full hover:bg-white text-[#242424] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {renderFilterSections("mobile")}
          </div>

          <div className="p-4 border-t border-[#E8E6E1] bg-[#F7F6F3]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-full btn-luxury-primary py-3 text-xs"
            >
              Show {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Perfume" : "Perfumes"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

