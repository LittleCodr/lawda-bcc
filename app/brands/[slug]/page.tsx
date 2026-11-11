import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";
import {
  getAllPerfumeSummaries,
  getBrandSummaries,
  filterProducts,
  formatPriceINR,
  toGridSummary,
} from "@/lib/catalog";
import { getBrandBySlug } from "@/lib/brands";
import CatalogExplorer from "@/components/CatalogExplorer";

export async function generateStaticParams() {
  return getBrandSummaries().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand Not Found | Octopus Perfumes" };

  return {
    title: `Buy Original ${brand.name} Perfumes Online in India | Octopus Perfumes`,
    description: `Shop ${brand.count} authentic ${brand.name} fragrances starting at ${formatPriceINR(
      brand.minPrice
    )}. 100% genuine batch-coded bottles with complimentary pan-India shipping.`,
    alternates: {
      canonical: `https://www.octopusperfume.in/brands/${brand.slug}`,
    },
  };
}

export default async function BrandCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const allPerfumes = getAllPerfumeSummaries();
  const brandProducts = filterProducts(allPerfumes, { brands: [brand.slug] });
  const brandMeta = getBrandSummaries().find((b) => b.slug === brand.slug);
  const brandTier = brandMeta?.tier || brandProducts[0]?.brandTier || "designer";

  const peerBrands = getBrandSummaries()
    .filter((b) => b.tier === brandTier && b.slug !== brand.slug)
    .slice(0, 8);

  const tierLabel =
    brandTier === "middle-eastern"
      ? "Middle Eastern House"
      : brandTier === "niche"
        ? "Niche & Haute Parfumerie"
        : brandTier === "in-house"
          ? "In-House Collaboration"
          : "Designer Maison";

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brand.name} Perfumes`,
    url: `https://www.octopusperfume.in/brands/${brand.slug}`,
    description: `Shop ${brand.count} authentic ${brand.name} fragrances online in India.`,
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-[#777777] mb-5 flex flex-wrap items-center gap-2"
        >
          <Link href="/" className="hover:text-[#242424]">
            Home
          </Link>
          <span>/</span>
          <Link href="/brands" className="hover:text-[#242424]">
            Brands
          </Link>
          <span>/</span>
          <span className="text-[#242424] font-medium">{brand.name}</span>
        </nav>

        {/* Brand Showcase Hero */}
        <header className="bg-[#F7F6F3] border border-[#E8E6E1] rounded-[12px] p-6 sm:p-9 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-9 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953]">
              {tierLabel}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#242424] leading-tight">
              {brand.name} Perfumes
            </h1>
            <p className="text-sm sm:text-base text-[#5C5954] max-w-2xl leading-relaxed">
              Explore {brandProducts.length} authentic {brand.name} editions starting from{" "}
              <strong className="text-[#242424]">{formatPriceINR(brand.minPrice)}</strong>.
              Every bottle arrives sealed with verifiable batch codes and complimentary pan-India express shipping.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#5C5954]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#347A54]" /> Sealed &amp; Batch Verified
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck size={14} className="text-[#9A7953]" /> Free India Express Shipping
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#9A7953]" /> Up to 5% Bundle Savings
              </span>
            </div>
          </div>

          <div className="lg:col-span-3 flex justify-start lg:justify-end">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[10px] bg-white border border-[#E8E6E1] p-3 flex items-center justify-center shadow-luxury">
              <img
                src={brand.sampleImage}
                alt={`${brand.name} signature bottle`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </header>

        {/* Filterable Brand Grid */}
        <CatalogExplorer
          products={brandProducts.map(toGridSummary)}
          hideBrandFilter={true}
          emptyTitle={`No ${brand.name} bottles match your current filters`}
        />

        {/* Peer Houses Cross-Links */}
        {peerBrands.length > 0 && (
          <section className="mt-14 pt-8 border-t border-[#E8E6E1]">
            <h2 className="font-serif text-2xl font-semibold text-[#242424] mb-4">
              Similar {tierLabel}s You Might Enjoy
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {peerBrands.map((peer) => (
                <Link
                  key={peer.slug}
                  href={`/brands/${peer.slug}`}
                  className="px-4 py-2 rounded-full border border-[#D4CFC7] bg-white hover:bg-[#1F1D1B] hover:text-white text-xs font-semibold text-[#242424] transition-colors"
                >
                  {peer.name} ({peer.count})
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
