import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  Gift,
  Sparkles,
  Compass,
  BookOpen,
  Layers,
} from "lucide-react";
import {
  getAllPerfumeSummaries,
  getBrandSummaries,
  filterProducts,
  sortProducts,
  toGridSummary,
} from "@/lib/catalog";
import { EDITORIAL_ARTICLES } from "@/lib/editorial";
import ProductCarousel from "@/components/ProductCarousel";
import HeroShowcase from "@/components/HeroShowcase";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Octopus Perfumes | Buy 100% Authentic Designer, Niche & Middle Eastern Perfumes in India",
  description:
    "Shop 1,700+ original sealed perfumes in India: Rasasi, Lattafa, Dior, Tom Ford, Creed, Afnan, French Avenue & Harsh Beniwal × Octopus 25% French oil EDPs. Free pan-India express shipping.",
  alternates: {
    canonical: "https://www.octopusperfume.in",
  },
};

export default function HomePage() {
  const allPerfumes = getAllPerfumeSummaries();
  const allBrands = getBrandSummaries();

  // Real filtered pools for merchandising sections (zero invented products/discounts)
  const bestsellers = sortProducts(
    allPerfumes.filter((p) => p.isBestseller && p.available),
    "featured"
  )
    .slice(0, 14)
    .map(toGridSummary);

  const middleEastern = sortProducts(
    filterProducts(allPerfumes, { tiers: ["middle-eastern"], inStockOnly: true }),
    "featured"
  )
    .slice(0, 14)
    .map(toGridSummary);

  const designerSelection = sortProducts(
    filterProducts(allPerfumes, { tiers: ["designer"], inStockOnly: true }),
    "featured"
  )
    .slice(0, 14)
    .map(toGridSummary);

  const nicheSelection = sortProducts(
    filterProducts(allPerfumes, { tiers: ["niche"], inStockOnly: true }),
    "featured"
  )
    .slice(0, 14)
    .map(toGridSummary);

  const flagshipHarshBeniwal = allPerfumes.filter((p) => p.isFlagship).map(toGridSummary);

  const newArrivals = sortProducts(
    allPerfumes.filter((p) => p.available),
    "newest"
  )
    .slice(0, 14)
    .map(toGridSummary);

  const trendingMarkdowns = sortProducts(
    allPerfumes.filter((p) => p.available && p.discountPct >= 35 && !p.isBestseller),
    "discount"
  )
    .slice(0, 14)
    .map(toGridSummary);

  // Real dynamic counts for category, budget, and size cards
  const menCount = filterProducts(allPerfumes, { genders: ["Men", "Unisex"] }).length;
  const womenCount = filterProducts(allPerfumes, { genders: ["Women", "Unisex"] }).length;
  const unisexCount = filterProducts(allPerfumes, { genders: ["Unisex"] }).length;
  const meCount = filterProducts(allPerfumes, { tiers: ["middle-eastern"] }).length;
  const designerCount = filterProducts(allPerfumes, { tiers: ["designer"] }).length;
  const nicheCount = filterProducts(allPerfumes, { tiers: ["niche"] }).length;
  const miniCount = filterProducts(allPerfumes, { miniaturesOnly: true }).length;
  const giftCount = filterProducts(allPerfumes, { giftSetsOnly: true }).length;

  const budgetTiers = [
    {
      label: "Under ₹1,500",
      subtitle: "Miniatures, vials & signature EDPs",
      href: "/collections/under-1500",
      count: filterProducts(allPerfumes, { maxPrice: 1500 }).length,
    },
    {
      label: "₹1,500 – ₹3,000",
      subtitle: "Lattafa, Armaf & French Avenue hits",
      href: "/collections/1500-to-3000",
      count: filterProducts(allPerfumes, { minPrice: 1500, maxPrice: 3000 }).length,
    },
    {
      label: "₹3,000 – ₹5,000",
      subtitle: "Everyday designer & Arabic icons",
      href: "/collections/3000-to-5000",
      count: filterProducts(allPerfumes, { minPrice: 3000, maxPrice: 5000 }).length,
    },
    {
      label: "₹5,000 – ₹9,000",
      subtitle: "Dior, YSL, Armani, Prada & Mancera",
      href: "/collections/5000-to-9000",
      count: filterProducts(allPerfumes, { minPrice: 5000, maxPrice: 9000 }).length,
    },
    {
      label: "₹9,000 & Above",
      subtitle: "Creed, Parfums de Marly, Xerjoff",
      href: "/collections/premium",
      count: filterProducts(allPerfumes, { minPrice: 9000 }).length,
    },
  ];

  const sizeTiers = [
    {
      label: "Discovery & Vials",
      detail: "1ml – 20ml",
      href: "/collections/miniatures",
      count: miniCount,
    },
    {
      label: "30ml Pocket",
      detail: "Travel friendly",
      href: "/collections/size-30ml",
      count: filterProducts(allPerfumes, { sizes: ["30ml"] }).length,
    },
    {
      label: "50ml Signature",
      detail: "Balanced daily",
      href: "/collections/size-50ml",
      count: filterProducts(allPerfumes, { sizes: ["50ml"] }).length,
    },
    {
      label: "75ml Collector",
      detail: "Niche standard",
      href: "/collections/size-75ml",
      count: filterProducts(allPerfumes, { sizes: ["75ml"] }).length,
    },
    {
      label: "100ml Full Size",
      detail: "Best per-ml value",
      href: "/collections/size-100ml",
      count: filterProducts(allPerfumes, { sizes: ["100ml"] }).length,
    },
  ];

  const showcaseBrands = allBrands
    .filter((b) => b.name !== "Buy 1 Get 1 Free" && b.name !== "Perfume Network India")
    .slice(0, 18);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are all designer, niche, and Middle Eastern perfumes on Octopus Perfumes 100% authentic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every bottle ships brand-new and factory sealed with verifiable batch codes printed on both the monocarton box and glass flacon.",
        },
      },
      {
        "@type": "Question",
        name: "How fast is shipping across India and what are the shipping charges?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prepaid express shipping across India is complimentary on every order. International shipments carry a flat ₹1,500 logistics fee.",
        },
      },
      {
        "@type": "Question",
        name: "How do bundle discounts and coupon codes like LUXURY25 work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Adding 2 perfumes triggers an automatic 15% bundle discount, and 3+ items unlock 33% OFF. Prepaid coupon codes like LUXURY25 apply extra savings at checkout on qualifying orders above ₹499.",
        },
      },
    ],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Luxury Campaign Hero */}
      <HeroShowcase
        totalPerfumesCount={allPerfumes.length}
        brandsCount={allBrands.length}
      />

      {/* 1b. Trust & Service Bar */}
      <section aria-label="Service guarantees" className="bg-[#F7F6F3] border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { icon: ShieldCheck, title: "100% Sealed Originals", sub: "Batch codes on every bottle" },
            { icon: Truck, title: "Free Express Shipping", sub: "Insured pan-India dispatch" },
            { icon: Gift, title: "Free 7ML Paradox EDP", sub: "Included automatically on orders" },
            { icon: Sparkles, title: "Bundle Up to 33% OFF", sub: "+ Code LUXURY25 at checkout" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-2.5">
                <Icon size={16} className="text-[#9A7953] shrink-0" />
                <div>
                  <strong className="block text-[#242424] font-semibold">{item.title}</strong>
                  <span className="text-[#777777]">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Shop by Category Tiles */}
      <section className="py-10 sm:py-12 border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Curated Departments
              </p>
              <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424]">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/collections/all"
              className="text-xs sm:text-[13px] font-semibold text-[#242424] hover:text-[#9A7953] underline underline-offset-4 decoration-[#D4CFC7]"
            >
              Browse All {allPerfumes.length}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: "For Men", count: menCount, href: "/collections/men" },
              { label: "For Women", count: womenCount, href: "/collections/women" },
              { label: "Unisex", count: unisexCount, href: "/collections/unisex" },
              { label: "Middle Eastern", count: meCount, href: "/collections/middle-eastern-perfumes" },
              { label: "Designer", count: designerCount, href: "/collections/designer-perfumes" },
              { label: "Haute Niche", count: nicheCount, href: "/collections/niche-perfumes" },
              { label: "Miniatures", count: miniCount, href: "/collections/miniatures" },
              { label: "Gift Sets", count: giftCount, href: "/collections/gift-sets" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group p-4 rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] hover:bg-white hover:border-[#9A7953] transition-all flex flex-col justify-between min-h-[104px]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9A7953]">
                  {cat.count} Scents
                </span>
                <div className="mt-3 flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors leading-tight">
                    {cat.label}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-[#96928B] group-hover:text-[#9A7953] group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Fragrance House */}
      <section className="py-10 sm:py-12 border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Verified Houses &amp; Maisons
              </p>
              <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424]">
                Shop by Brand
              </h2>
            </div>
            <Link
              href="/brands"
              className="text-xs sm:text-[13px] font-semibold text-[#242424] hover:text-[#9A7953] underline underline-offset-4 decoration-[#D4CFC7]"
            >
              All {allBrands.length} Brands A–Z →
            </Link>
          </div>

          <div className="carousel-track no-scrollbar flex gap-3 sm:gap-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {showcaseBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="snap-start shrink-0 w-[148px] sm:w-[170px] group bg-white border border-[#E8E6E1] hover:border-[#9A7953] rounded-[8px] p-3.5 transition-all flex flex-col items-center text-center shadow-luxury"
              >
                <div className="w-20 h-20 rounded-[6px] bg-[#F7F6F3] p-2 mb-3 flex items-center justify-center">
                  <img
                    src={brand.sampleImage}
                    alt={`${brand.name} perfumes`}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors line-clamp-1 w-full">
                  {brand.name}
                </p>
                <p className="text-[11px] text-[#777777] mt-0.5">
                  {brand.count} {brand.count === 1 ? "bottle" : "bottles"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bestsellers Carousel */}
      <ProductCarousel
        eyebrow="Customer Favourites"
        title="Bestsellers & Icons"
        viewAllHref="/collections/bestsellers"
        viewAllLabel="Explore All Bestsellers"
        products={bestsellers}
        priorityFirst
      />

      {/* 5. Middle Eastern Powerhouses Carousel */}
      <ProductCarousel
        eyebrow="UAE & Arabian Maisons"
        title="Middle Eastern Powerhouses"
        viewAllHref="/collections/middle-eastern-perfumes"
        viewAllLabel="All Middle Eastern"
        products={middleEastern}
      />

      {/* 6. Harsh Beniwal & Octopus Perfumes Dual Business Highlights */}
      <section className="py-12 sm:py-14 bg-[#F7F6F3] border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Two Signature Spotlight Cards: Harsh Beniwal & Octopus Perfumes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Highlight 1: Harsh Beniwal Flagship Edit */}
            <div className="rounded-[12px] bg-[#141210] text-white p-6 sm:p-8 flex flex-col justify-between border border-[#2C2722]">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[10px] bg-white/6 border border-white/10 p-2 shrink-0 flex items-center justify-center">
                  <img
                    src="/harsh-beniwal/octopus/perfumes/images/overlord_hero.png"
                    alt="Harsh Beniwal Signature Perfumes"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF7A]">
                    Creator Collaboration · Flagship Highlight
                  </p>
                  <h2 className="font-serif text-3xl font-semibold text-white">
                    Harsh Beniwal Signature Edit
                  </h2>
                  <p className="text-xs sm:text-sm text-[#C7C1B8] leading-relaxed">
                    Anchored by Overlord, Outlaw, Rhapsody, and Your Move—bold modern accords engineered for unmistakable sillage from morning commute to night events.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#D4CFC7]">
                  25%+ French Oil Concentration · 50ML Eau de Parfum
                </span>
                <Link
                  href="/collections/harsh-beniwal"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[6px] bg-[#D4AF7A] hover:bg-white text-[#141210] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Shop Harsh Beniwal <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Highlight 2: Octopus Perfumes Brand Standard */}
            <div className="rounded-[12px] bg-white p-6 sm:p-8 flex flex-col justify-between border border-[#D4CFC7] shadow-luxury">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[10px] bg-[#F7F6F3] border border-[#E8E6E1] p-2 shrink-0 flex items-center justify-center">
                  <img
                    src="/harsh-beniwal/octopus/perfumes/images/paradox_box.png"
                    alt="Octopus Perfumes Official Monocarton Box"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953]">
                    In-House Perfumery · Core Identity
                  </p>
                  <h2 className="font-serif text-3xl font-semibold text-[#242424]">
                    House of Octopus Perfumes
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5954] leading-relaxed">
                    Crafted with IFRA-compliant aromatic compounds and imported French oils. Every online order automatically includes a complimentary 7ML Paradox pocket spray.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-[#E8E6E1] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#5C5954]">
                  Free 7ML Tester Included · Bundle up to 33% OFF
                </span>
                <Link
                  href="/harsh-beniwal/octopus/perfumes"
                  className="btn-luxury-primary px-5 py-2.5 text-xs"
                >
                  Explore Octopus Hub <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Complete Signature Series
              </p>
              <h3 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424]">
                All 9 Harsh Beniwal × Octopus 50ML EDPs
              </h3>
            </div>
            <Link
              href="/harsh-beniwal/octopus/perfumes"
              className="btn-luxury-secondary px-5 py-2.5 text-xs shrink-0 self-start md:self-auto"
            >
              View Flagship Catalog
            </Link>
          </div>
        </div>
        <div className="-mt-4">
          <ProductCarousel
            title=""
            products={flagshipHarshBeniwal}
          />
        </div>
      </section>

      {/* 7. Shop by Budget & Bottle Size Split Matrix */}
      <section className="py-12 border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Shop by Budget */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
              Transparent Tiers
            </p>
            <h2 className="font-serif text-[26px] sm:text-[30px] font-semibold text-[#242424] mb-5">
              Shop by Budget
            </h2>
            <div className="space-y-2.5">
              {budgetTiers.map((tier) => (
                <Link
                  key={tier.href}
                  href={tier.href}
                  className="group flex items-center justify-between gap-4 p-4 rounded-[8px] border border-[#E8E6E1] bg-white hover:bg-[#F7F6F3] hover:border-[#9A7953] transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors">
                      {tier.label}
                    </p>
                    <p className="text-xs text-[#777777] mt-0.5">{tier.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-[#5C5954] tabular-nums">
                      {tier.count} scents
                    </span>
                    <ArrowRight size={15} className="text-[#9A7953]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Shop by Volume */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
              Every Format
            </p>
            <h2 className="font-serif text-[26px] sm:text-[30px] font-semibold text-[#242424] mb-5">
              Shop by Bottle Size
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sizeTiers.map((sz) => (
                <Link
                  key={sz.href}
                  href={sz.href}
                  className="group p-4 rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] hover:bg-white hover:border-[#9A7953] transition-colors flex flex-col justify-between min-h-[106px]"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#9A7953]">
                    <span>{sz.detail}</span>
                    <span>{sz.count}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-xl font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors">
                      {sz.label}
                    </span>
                    <ArrowRight size={15} className="text-[#777777]" />
                  </div>
                </Link>
              ))}
              <Link
                href="/collections/gift-sets"
                className="group p-4 rounded-[8px] border border-[#D4CFC7] bg-white hover:bg-[#1F1D1B] hover:text-white transition-colors flex flex-col justify-between min-h-[106px]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A7953]">
                  Celebration Coffrets
                </span>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-serif text-xl font-semibold">
                    Gift Sets ({giftCount})
                  </span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. New Arrivals Carousel */}
      <ProductCarousel
        eyebrow="Just Stocked"
        title="New Arrivals"
        viewAllHref="/collections/new-arrivals"
        viewAllLabel="See Latest Releases"
        products={newArrivals}
      />

      {/* 9. Designer Classics Carousel */}
      <ProductCarousel
        eyebrow="Runway & Signature Houses"
        title="Designer Icons"
        viewAllHref="/collections/designer-perfumes"
        viewAllLabel="All Designer Houses"
        products={designerSelection}
      />

      {/* 10. Haute Niche Carousel */}
      <ProductCarousel
        eyebrow="Rare & Artisanal"
        title="Niche Perfumery"
        viewAllHref="/collections/niche-perfumes"
        viewAllLabel="All Niche Houses"
        products={nicheSelection}
      />

      {/* 10b. Trending Value Offers */}
      <ProductCarousel
        eyebrow="Curated Offers"
        title="Trending Drops & Special Markdowns"
        viewAllHref="/collections/deals"
        viewAllLabel="Shop All Markdowns"
        products={trendingMarkdowns}
      />

      {/* 11. Olfactory Families & Occasion Discovery */}
      <section className="py-12 bg-[#F7F6F3] border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Scent Architecture
              </p>
              <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424]">
                Discover by Note &amp; Occasion
              </h2>
            </div>
            <Link
              href="/collections/all"
              className="text-xs font-semibold text-[#242424] underline underline-offset-4 decoration-[#D4CFC7]"
            >
              Open Full Filter Explorer →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { name: "Amber & Oud", desc: "Saffron, resin & dark woods", href: "/collections/amber-oud" },
              { name: "Woody & Vetiver", desc: "Cedar, sandalwood & moss", href: "/collections/woody" },
              { name: "Citrus & Fresh", desc: "Bergamot, blood orange & mint", href: "/collections/citrus-fresh" },
              { name: "Floral Blossoms", desc: "Rose, jasmine & orange blossom", href: "/collections/floral" },
              { name: "Gourmand & Vanilla", desc: "Tonka, caramel & pistachio", href: "/collections/gourmand" },
              { name: "Leather & Smoky", desc: "Suede, birch & bold spice", href: "/collections/leather" },
            ].map((fam) => (
              <Link
                key={fam.href}
                href={fam.href}
                className="group bg-white border border-[#E8E6E1] hover:border-[#9A7953] rounded-[8px] p-4 transition-colors flex flex-col justify-between min-h-[116px]"
              >
                <Compass size={18} className="text-[#9A7953]" />
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors">
                    {fam.name}
                  </p>
                  <p className="text-[11px] text-[#777777] mt-0.5 leading-snug">
                    {fam.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C5954] mr-2 flex items-center gap-1.5">
              <Layers size={14} className="text-[#9A7953]" /> Wear by Setting:
            </span>
            {[
              { label: "Office & Daily Wear", href: "/collections/office" },
              { label: "Date Night & Evening", href: "/collections/date-night" },
              { label: "Party & Night Out", href: "/collections/party-clubbing" },
              { label: "Wedding & Festive", href: "/collections/wedding-festive" },
              { label: "Summer Heat-Proof", href: "/collections/summer" },
              { label: "Winter & Monsoon", href: "/collections/winter" },
            ].map((occ) => (
              <Link
                key={occ.href}
                href={occ.href}
                className="px-3.5 py-2 rounded-full bg-white border border-[#D4CFC7] hover:bg-[#1F1D1B] hover:text-white hover:border-[#1F1D1B] text-xs font-medium text-[#242424] transition-colors"
              >
                {occ.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Fragrance Journal & Editorial Guides */}
      <section className="py-12 border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Editorial &amp; Education
              </p>
              <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424]">
                The Fragrance Journal
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-xs sm:text-[13px] font-semibold text-[#242424] hover:text-[#9A7953] underline underline-offset-4 decoration-[#D4CFC7]"
            >
              Read All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {EDITORIAL_ARTICLES.map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className="group bg-white border border-[#E8E6E1] hover:border-[#9A7953] rounded-[10px] overflow-hidden flex flex-col shadow-luxury transition-all"
              >
                <div className="aspect-[16/10] bg-[#F7F6F3] p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9A7953] mb-1.5">
                    <span>{post.category}</span>
                    <span className="text-[#777777]">{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#242424] group-hover:text-[#9A7953] transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#5C5954] leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="mt-auto text-xs font-semibold text-[#242424] inline-flex items-center gap-1.5">
                    <BookOpen size={13} className="text-[#9A7953]" /> Read Article
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12b. Collector Dispatch Newsletter */}
      <section className="py-12 border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterForm />
        </div>
      </section>

      {/* 13. Native Smooth Store FAQs */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
              Store Policy &amp; Help
            </p>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-semibold text-[#242424]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="fc-accordion border-t border-[#E8E6E1]">
            {[
              {
                q: "Are all designer, niche, and Middle Eastern bottles 100% genuine?",
                a: "Yes. Every unit is sourced through verified importers and ships brand-new, cellophane/factory sealed with matching batch codes printed on both the monocarton box and bottle base.",
              },
              {
                q: "What delivery speed and coverage do you provide in India?",
                a: "Prepaid express delivery across India is free on every order, wrapped in protective honeycombed cushioning. International deliveries ship flat-rate for ₹1,500.",
              },
              {
                q: "Do orders include the complimentary 7ML Paradox EDP tester?",
                a: "Yes — every qualified order includes a complimentary 7ML Paradox Eau de Parfum pocket spray automatically.",
              },
              {
                q: "How do automatic multi-bottle bundle discounts and coupon codes work?",
                a: "Adding 2 perfumes applies 15% OFF in your cart, and 3 or more bottles unlock 33% OFF. Prepaid discount codes such as LUXURY25 or DIWALI20 can also be applied at checkout for orders above ₹499.",
              },
            ].map((faq, idx) => (
              <details key={idx} open={idx === 0} className="py-4">
                <summary className="flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-[#242424] py-1">
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className="text-[#777777] shrink-0" />
                </summary>
                <div className="pt-2.5 pb-1 text-sm text-[#5C5954] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
