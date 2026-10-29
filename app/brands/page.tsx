import Link from "next/link";
import { getAllBrands } from "@/lib/brands";
import { ChevronRight, Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "All Perfume Brands & Fragrance Houses | Octopus Perfumes India",
  description:
    "Explore 130+ luxury, designer, and Middle Eastern perfume houses. 100% original authentic fragrances with flat 25% OFF, free 7ML Paradox tester & express Pan-India shipping.",
  alternates: {
    canonical: "https://www.octopusperfume.in/brands",
  },
  openGraph: {
    title: "All Perfume Brands | Octopus Perfumes India",
    description: "Explore 130+ luxury, designer, and Middle Eastern perfume houses.",
    url: "https://www.octopusperfume.in/brands",
    siteName: "Octopus Perfumes India",
    images: [{ url: "https://www.octopusperfume.in/logo.png" }],
  },
};

export default function BrandsDirectoryPage() {
  const brands = getAllBrands();

  // Group brands alphabetically
  const grouped: Record<string, typeof brands> = {};
  for (const b of brands) {
    const letter = b.name.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  }

  const sortedLetters = Object.keys(grouped).sort();

  const directorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Perfume Brands Directory",
    "description": "Comprehensive directory of authentic luxury, designer, and niche perfume brands.",
    "url": "https://www.octopusperfume.in/brands",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": brands.length,
      "itemListElement": brands.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": b.name,
        "url": `https://www.octopusperfume.in/brands/${b.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />

      <div className="bg-[#FDF8F5] min-h-screen">
        {/* Directory Header */}
        <header className="bg-[#f3efe9] py-14 px-6 md:px-16 border-b border-[#E5B8B7]/30 text-center">
          <div className="max-w-4xl mx-auto">
            <nav className="flex justify-center items-center gap-2 text-xs uppercase tracking-wider text-[#6a6a6a] mb-4">
              <Link href="/" className="hover:text-[#222222]">Home</Link>
              <ChevronRight size={12} />
              <span className="text-[#222222] font-bold">Fragrance Brands</span>
            </nav>

            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              <ShieldCheck size={14} /> 100% Original Authentic Verified Houses
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-black text-stone-950 uppercase tracking-wide mb-3">
              Perfume Brands Directory
            </h1>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Explore our curated portfolio of over {brands.length} iconic fragrance houses, French perfumeries, and Dubai artisan creators. Flat 25% instant OFF across all collections.
            </p>

            {/* Quick Letter Jump Navigation */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-8 max-w-2xl mx-auto">
              {sortedLetters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-800 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* Directory Listings */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {sortedLetters.map((letter) => (
              <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-stone-900">
                  <span className="text-2xl font-black text-stone-900 font-serif">{letter}</span>
                  <span className="text-xs text-stone-500 font-medium">({grouped[letter].length} brands)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {grouped[letter].map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      className="p-4 bg-white border border-stone-200/90 rounded-xl hover:border-stone-900 hover:shadow-sm transition-all group flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-sm font-bold text-stone-900 group-hover:text-[#ff385c] transition-colors block truncate">
                          {b.name}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {b.productCount} {b.productCount === 1 ? "fragrance" : "fragrances"}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-stone-400 group-hover:text-stone-900 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

