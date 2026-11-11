import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { EDITORIAL_ARTICLES } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Fragrance Journal & Collecting Guides | Octopus Perfumes India",
  description:
    "Read guides on perfume concentration (EDP vs EDT vs Extrait), Middle Eastern fragrance performance, batch code verification, and building a signature scent wardrobe.",
  alternates: { canonical: "https://www.octopusperfume.in/journal" },
};

export default function JournalPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#777777] mb-5 flex items-center gap-2">
          <Link href="/" className="hover:text-[#242424]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#242424] font-medium">Fragrance Journal</span>
        </nav>

        <header className="pb-8 border-b border-[#E8E6E1] mb-10 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1.5">
            Editorial &amp; Education
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#242424] leading-tight mb-3">
            The Fragrance Journal
          </h1>
          <p className="text-sm sm:text-base text-[#5C5954] leading-relaxed">
            Practical guides on longevity in Indian humidity, perfume oil concentrations, batch authentication, and curating versatile scent wardrobes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {EDITORIAL_ARTICLES.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group bg-white border border-[#E8E6E1] hover:border-[#9A7953] rounded-[12px] overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col"
            >
              <div className="aspect-[16/9] bg-[#F7F6F3] p-6 flex items-center justify-center">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-2">
                  <span>{post.category}</span>
                  <span className="text-[#777777]">
                    {post.publishedAt} · {post.readTime}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors leading-snug mb-2.5">
                  {post.title}
                </h2>
                <p className="text-sm text-[#5C5954] leading-relaxed mb-5">
                  {post.excerpt}
                </p>
                <span className="mt-auto text-xs font-semibold text-[#242424] inline-flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#9A7953]" /> Read Full Guide{" "}
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

