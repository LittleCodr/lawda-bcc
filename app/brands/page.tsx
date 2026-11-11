import type { Metadata } from "next";
import Link from "next/link";
import { getBrandSummaries } from "@/lib/catalog";
import BrandDirectoryClient from "@/components/BrandDirectoryClient";

export const metadata: Metadata = {
  title: "All Luxury & Middle Eastern Perfume Brands A–Z | Octopus Perfumes India",
  description:
    "Explore 130+ original fragrance houses: Lattafa, Rasasi, Afnan, Christian Dior, Hermès, Tom Ford, Creed, Xerjoff, Parfums de Marly & Harsh Beniwal × Octopus.",
  alternates: {
    canonical: "https://www.octopusperfume.in/brands",
  },
};

export default function BrandsPage() {
  const brands = getBrandSummaries();

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#777777] mb-5 flex items-center gap-2">
          <Link href="/" className="hover:text-[#242424]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#242424] font-medium">Brands A–Z</span>
        </nav>

        <header className="pb-8 border-b border-[#E8E6E1] mb-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1.5">
            {brands.length} Curated Houses
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#242424] leading-tight mb-3">
            Fragrance Houses &amp; Brands A–Z
          </h1>
          <p className="text-sm sm:text-base text-[#5C5954] leading-relaxed">
            Browse every designer maison, Gulf extrait house, niche perfumery, and our Harsh Beniwal × Octopus collection stocked in sealed original bottles.
          </p>
        </header>

        <BrandDirectoryClient brands={brands} />
      </div>
    </div>
  );
}
