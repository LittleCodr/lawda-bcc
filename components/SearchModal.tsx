"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (e) {
        console.error("Failed to search", e);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-center items-start pt-[10vh] px-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-[16px] shadow-2xl border border-[#ebebeb] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Area */}
        <div className="p-4 border-b border-[#ebebeb] flex items-center gap-3 relative">
          <div className="w-8 h-8 rounded-full bg-[#ff385c] text-white flex items-center justify-center shrink-0">
            <Search size={16} strokeWidth={2.5} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search perfumes, accords, fragrance notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-[16px] outline-none bg-transparent placeholder:text-[#929292] text-[#222222]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onClose();
                router.push(`/collections/all?q=${encodeURIComponent(query)}`);
              }
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1.5 hover:bg-[#f7f7f7] rounded-full text-[#6a6a6a] cursor-pointer">
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 hover:bg-[#f7f7f7] rounded-full text-[#222222] ml-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto flex-1 p-4 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#ff385c]">
              <Loader2 className="animate-spin mb-3" size={28} />
              <p className="text-xs font-medium text-[#6a6a6a]">Searching collection...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#6a6a6a] px-2 mb-2">Fragrance Results</p>
              {results.map((product) => (
                <Link
                  href={`/products/${product.handle}`}
                  key={product.id}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-[#f7f7f7] border border-transparent hover:border-[#ebebeb] transition-all group"
                >
                  <div className="relative w-14 h-14 rounded-[8px] overflow-hidden bg-[#f7f7f7] shrink-0 border border-[#ebebeb] p-1">
                    <Image
                      src={product.images?.[0]?.local_src || product.images?.[0]?.localPath || product.images?.[0]?.src || "/logo.png"}
                      alt={product.title}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors truncate">{product.title}</h4>
                    <p className="text-[12px] text-[#6a6a6a] truncate">50ML Eau De Parfum • 25%+ French Oils</p>
                    <p className="text-[13px] font-semibold text-[#222222] mt-0.5">₹{product.variants?.[0]?.price || "1299"}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-[16px] font-semibold text-[#222222] mb-1">No matches for &quot;{query}&quot;</p>
              <p className="text-sm text-[#6a6a6a]">Try searching for Overlord, Paradox, Promised, or fresh notes</p>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-[#6a6a6a] font-medium mb-6">Popular perfume searches</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {['Overlord (Sauvage)', 'Paradox (Les Sables Roses)', 'Promised (BR540)', 'Mirage', 'Harsh Beniwal', 'Oud Wood'].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term.split(' ')[0])}
                    className="px-3.5 py-1.5 bg-[#f7f7f7] hover:bg-[#ebebeb] border border-[#dddddd] rounded-full text-xs font-medium text-[#222222] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
