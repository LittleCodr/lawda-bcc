"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2, Tag } from "lucide-react";
import { formatPriceINR, type ProductSummary, type BrandSummary } from "@/lib/catalog-types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SEARCHES = [
  { label: "Rasasi Hawas", query: "hawas" },
  { label: "Lattafa Khamrah", query: "khamrah" },
  { label: "Overlord EDP", query: "overlord" },
  { label: "Dior Sauvage", query: "sauvage" },
  { label: "Afnan 9PM", query: "9 pm" },
  { label: "Creed Aventus", query: "aventus" },
  { label: "Oud & Amber", query: "oud" },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [brands, setBrands] = useState<BrandSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Synchronize native top-layer <dialog> state without mutating body overflow
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      setBrands([]);
      setTotal(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=8`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setBrands(Array.isArray(data.brands) ? data.brands : []);
        setTotal(Number(data.total) || 0);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // Native backdrop pointer check per modern-web-guidance dialog spec
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const panel = dialog.firstElementChild;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (outside) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={handleDialogClick}
      aria-label="Search Octopus Perfumes catalog"
      className="fc-dialog w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-14 items-start"
    >
      <div className="bg-white rounded-[12px] border border-[#E8E6E1] shadow-2xl overflow-hidden w-full">
        {/* Search Header */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[#E8E6E1] bg-[#F7F6F3]"
        >
          <Search size={18} className="text-[#777777] shrink-0" />
          <label htmlFor="global-perfume-search" className="sr-only">
            Search perfumes, brands, notes, or concentrations
          </label>
          <input
            id="global-perfume-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search by perfume, house (Lattafa, Dior, Creed), note (oud, vanilla)..."
            className="flex-1 bg-transparent text-[15px] text-[#242424] placeholder:text-[#96928B] focus:outline-none"
          />
          {loading && <Loader2 size={17} className="animate-spin text-[#9A7953]" />}
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="text-xs font-medium text-[#777777] hover:text-[#242424] px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-2 rounded-full hover:bg-white border border-transparent hover:border-[#E8E6E1] text-[#242424] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </form>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
          {query.trim().length < 2 ? (
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#777777] mb-3">
                  Trending Queries
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCHES.map((item) => (
                    <button
                      key={item.query}
                      type="button"
                      onClick={() => setQuery(item.query)}
                      className="px-3.5 py-1.5 rounded-full bg-[#F7F6F3] hover:bg-[#1F1D1B] hover:text-white border border-[#E8E6E1] text-xs font-medium text-[#242424] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#777777] mb-3">
                  Popular Collections
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-sm">
                  {[
                    { label: "Middle Eastern Houses", href: "/collections/middle-eastern-perfumes" },
                    { label: "Designer Classics", href: "/collections/designer-perfumes" },
                    { label: "Niche Perfumery", href: "/collections/niche-perfumes" },
                    { label: "Miniatures & Samples", href: "/collections/miniatures" },
                    { label: "Under ₹1,500", href: "/collections/under-1500" },
                    { label: "Harsh Beniwal × Octopus", href: "/brands/octopus-perfumes-by-harsh-beniwal" },
                  ].map((col) => (
                    <Link
                      key={col.href}
                      href={col.href}
                      onClick={onClose}
                      className="px-3.5 py-2.5 rounded-[8px] border border-[#E8E6E1] bg-white hover:border-[#9A7953] text-[#242424] font-medium flex items-center justify-between transition-colors"
                    >
                      <span className="truncate">{col.label}</span>
                      <ArrowRight size={13} className="text-[#9A7953] shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Brand Matches */}
              {brands.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#777777] mb-2.5">
                    Matching Houses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((b) => (
                      <Link
                        key={b.slug}
                        href={`/brands/${b.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] border border-[#D4CFC7] bg-[#F7F6F3] hover:bg-[#1F1D1B] hover:text-white text-xs font-semibold text-[#242424] transition-colors"
                      >
                        <Tag size={12} />
                        {b.name}
                        <span className="opacity-65 font-normal">({b.count})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              {results.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#777777]">
                      Perfumes ({total} {total === 1 ? "match" : "matches"})
                    </p>
                    <Link
                      href={`/search?q=${encodeURIComponent(query.trim())}`}
                      onClick={onClose}
                      className="text-xs font-semibold text-[#9A7953] hover:text-[#242424] inline-flex items-center gap-1"
                    >
                      View all {total} results <ArrowRight size={13} />
                    </Link>
                  </div>

                  <div className="divide-y divide-[#E8E6E1] border border-[#E8E6E1] rounded-[8px] overflow-hidden">
                    {results.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.handle}`}
                        onClick={onClose}
                        className="flex items-center gap-3.5 p-3 hover:bg-[#F7F6F3] transition-colors"
                      >
                        <div className="w-14 h-14 rounded-[6px] bg-[#F7F6F3] border border-[#E8E6E1] p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777777] truncate">
                            {item.brand} · {item.primarySize}
                          </p>
                          <p className="text-sm font-medium text-[#242424] truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#777777] truncate">
                            {item.concentration} · {item.gender}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#242424] tabular-nums">
                            {formatPriceINR(item.price)}
                          </p>
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <p className="text-[11px] text-[#96928B] line-through tabular-nums">
                              {formatPriceINR(item.compareAtPrice)}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {total > results.length && (
                    <div className="mt-4">
                      <Link
                        href={`/search?q=${encodeURIComponent(query.trim())}`}
                        onClick={onClose}
                        className="w-full btn-luxury-primary py-3 text-xs"
                      >
                        Explore All {total} Results for &ldquo;{query.trim()}&rdquo;
                      </Link>
                    </div>
                  )}
                </div>
              ) : !loading ? (
                <div className="text-center py-10">
                  <p className="font-serif text-xl text-[#242424] mb-1.5">
                    No bottles matched &ldquo;{query.trim()}&rdquo;
                  </p>
                  <p className="text-xs text-[#777777] mb-5">
                    Try searching a house like Lattafa, Dior, Rasasi, or browse our full collection.
                  </p>
                  <Link
                    href="/collections/all"
                    onClick={onClose}
                    className="btn-luxury-secondary text-xs"
                  >
                    Browse All Fragrances
                  </Link>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
