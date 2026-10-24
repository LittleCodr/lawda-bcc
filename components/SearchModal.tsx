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
    <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-md flex justify-center items-start pt-[10vh] px-4 animate-in fade-in duration-200">
      <div className="backdrop-blur-2xl bg-white/90 w-full max-w-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-white/80 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Area */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-4 relative">
          <Search size={20} className="text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for fragrances, scents, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg font-serif outline-none bg-transparent placeholder:text-stone-300 text-stone-900"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onClose();
                router.push(`/collections/all?q=${encodeURIComponent(query)}`);
              }
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-2 hover:bg-stone-100 rounded-full text-stone-500">
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-900 ml-2">
            <X size={20} />
          </button>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto flex-1 p-4 bg-stone-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#800020]">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-xs uppercase tracking-widest font-bold text-stone-500">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Products</p>
              {results.map((product) => (
                <Link
                  href={`/products/${product.handle}`}
                  key={product.id}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl hover:shadow-md border border-white/80 hover:border-amber-300/60 transition-all group"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FDF8F5] shrink-0 border border-stone-100">
                    <Image
                      src={product.images?.[0]?.local_src || product.images?.[0]?.localPath || product.images?.[0]?.src || "/logo.png"}
                      alt={product.title}
                      fill
                      unoptimized
                      className={`${(product.images?.[0]?.local_src || product.images?.[0]?.src || '').includes('perfume') || (product.images?.[0]?.src || '').endsWith('.png') ? 'object-contain p-1' : 'object-cover'} group-hover:scale-110 transition-transform`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg text-stone-900 truncate group-hover:text-amber-800 transition-colors mb-0.5">{product.title}</h4>
                    <p className="text-[9px] uppercase tracking-widest text-amber-800 font-bold mb-1">25%+ French Oils • 12H Longevity</p>
                    <p className="text-xs font-bold text-amber-700">₹{product.variants?.[0]?.price || "0"}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <p className="font-serif text-xl text-stone-900 mb-2">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-stone-500">Try checking your spelling or use more general terms</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm uppercase tracking-widest font-bold text-stone-400">Start typing to search...</p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <span className="text-xs font-bold text-stone-600 w-full mb-2">Popular Searches:</span>
                {['Perfumes', 'Overlord', 'Paradox', 'Promised', 'Mirage', 'Harsh Beniwal'].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-white/80 backdrop-blur-md border border-stone-200/80 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800 shadow-sm hover:bg-amber-100 hover:border-amber-300 hover:text-amber-950 hover:shadow-md active:scale-95 transition-all cursor-pointer"
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
