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
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex justify-center items-start pt-[10vh] px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Area */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-4 relative">
          <Search size={20} className="text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for personalized gifts..."
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
        <div className="overflow-y-auto flex-1 p-4 bg-stone-50">
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
                  className="flex items-center gap-4 p-3 bg-white rounded-xl hover:shadow-md border border-transparent hover:border-[#E5B8B7] transition-all group"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-[#FDF8F5] shrink-0">
                    <Image
                      src={product.images?.[0]?.src || "/logo.png"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg text-stone-900 truncate group-hover:text-[#800020] transition-colors">{product.title}</h4>
                    <p className="text-xs font-bold text-[#800020]">₹{product.variants?.[0]?.price || "0"}</p>
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
              
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="text-xs text-stone-500 w-full mb-2">Popular Searches:</span>
                {['Necklace', 'Bracelet', 'Rakhi', 'Wallet', 'Ring'].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold uppercase tracking-widest text-stone-600 hover:border-[#800020] hover:text-[#800020] transition-colors"
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
