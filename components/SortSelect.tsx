"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SortSelect({ slug, queryParam, defaultSort }: { slug: string, queryParam?: string, defaultSort: string }) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const url = new URLSearchParams();
    if (queryParam) url.set("q", queryParam);
    url.set("sort", sort);
    router.push(`/collections/${slug}?${url.toString()}`);
  };

  return (
    <div className="relative">
      <select 
        name="sort" 
        id="sort" 
        defaultValue={defaultSort}
        onChange={handleChange}
        className="bg-transparent border-none text-[#800020] focus:ring-0 outline-none cursor-pointer appearance-none pr-6 font-bold text-xs uppercase tracking-widest"
      >
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="title-asc">Alphabetically: A-Z</option>
        <option value="title-desc">Alphabetically: Z-A</option>
      </select>
      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#800020]" />
    </div>
  );
}
