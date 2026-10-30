import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { 
  ShieldCheck, 
  Truck, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Award, 
  Droplets, 
  Zap, 
  Gem, 
  Gift,
  Heart,
  Package,
  Layers,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";
import { getAllBrands } from "@/lib/brands";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "OCTOPUS Haute Parfumerie | 2,300+ Luxury Designer & Niche Perfumes India",
  description: "Shop 100% authentic luxury fragrances from 130+ world-class perfume houses (Lattafa, Armaf, Afnan, Dior, Rasasi, Tom Ford) and official Harsh Beniwal signature collection. Flat 25% OFF with code LUXURY25. Free 7ML Paradox tester + express pan-India delivery.",
  keywords: [
    "luxury perfumes india",
    "buy perfumes online india",
    "authentic designer perfumes",
    "lattafa perfumes india",
    "armaf club de nuit india",
    "afnan 9pm buy online",
    "rasasi hawas india",
    "french avenue perfumes",
    "harsh beniwal perfume",
    "octopus perfume official",
    "best edp perfumes for men",
    "long lasting perfumes 12 hours",
    "french edp perfumes online",
    "beast mode perfumes",
    "perfume brands directory india",
    "free perfume tester with order",
    "middle eastern perfumes india",
    "dubai perfumes buy online"
  ],
  alternates: {
    canonical: "https://www.octopusperfume.in",
  },
  openGraph: {
    title: "OCTOPUS Haute Parfumerie | 2,300+ Luxury Designer & Niche Perfumes India",
    description: "Discover 100% authentic luxury perfumes from 130+ top fragrance houses and Harsh Beniwal signature collection. 25%+ French oils, 12H beast-mode longevity, free tester pack & express delivery across India.",
    url: "https://www.octopusperfume.in",
    siteName: "OCTOPUS Luxury Perfumes",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 630,
        alt: "OCTOPUS Luxury Perfumes - 2,300+ Fragrances in India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OCTOPUS Haute Parfumerie | 2,300+ Luxury Perfumes India",
    description: "Shop 100% authentic luxury perfumes & Harsh Beniwal signature collection. Code LUXURY25 for 25% OFF + Free 7ML tester.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
};

const FEATURED_BRANDS = [
  {
    name: "Lattafa Perfumes",
    slug: "lattafa",
    origin: "Dubai, UAE",
    highlight: "Khamrah, Yara & Asad",
    description: "Dubai's foremost luxury house celebrated worldwide for opulent amber, spicy vanilla, and rich royal oud.",
    badge: "Bestselling House"
  },
  {
    name: "Armaf",
    slug: "armaf",
    origin: "UAE / France",
    highlight: "Club De Nuit Collection",
    description: "Powerhouse perfumery formulated with French oils, renowned for legendary all-day projection and citrus-smoky drydowns.",
    badge: "Beast-Mode Icon"
  },
  {
    name: "Afnan Perfumes",
    slug: "afnan",
    origin: "UAE",
    highlight: "9PM & Supremacy",
    description: "Sophisticated compositions fusing European craftsmanship with Middle Eastern heritage. Creators of the viral 9PM.",
    badge: "Viral Classic"
  },
  {
    name: "Rasasi",
    slug: "rasasi",
    origin: "Dubai, UAE",
    highlight: "Hawas for Him & Her",
    description: "Four decades of Gulf luxury perfumery, celebrated for fresh aquatic zest blended with warm driftwood and ambergris.",
    badge: "Royalty Favorite"
  },
  {
    name: "French Avenue",
    slug: "french-avenue",
    origin: "Paris Corner, France/UAE",
    highlight: "Liquid Brun & Artisanal Extraits",
    description: "High-concentration extrait formulations inspired by rare Parisian private reserves with deep gourmand warmth.",
    badge: "Extrait De Parfum"
  },
  {
    name: "Christian Dior",
    slug: "christian-dior",
    origin: "Paris, France",
    highlight: "Sauvage & Miss Dior",
    description: "The pinnacle of French Haute Parfumerie, formulating timeless icons with radiant bergamot and noble florals.",
    badge: "Haute Couture"
  },
  {
    name: "Tom Ford",
    slug: "tom-ford",
    origin: "New York, USA",
    highlight: "Oud Wood & Ombré Leather",
    description: "Provocative modern luxury crafted with rare woods, intoxicating leather, and sun-drenched resins.",
    badge: "Private Blend"
  },
  {
    name: "Paris Corner",
    slug: "paris-corner",
    origin: "Dubai, UAE",
    highlight: "Emir, Ministry of Oud & Voux",
    description: "Visionary Oriental perfumery specializing in niche luxury interpretations with rich sillage.",
    badge: "Niche Reserve"
  }
];

export default async function Home() {
  const perfumes = (scrapedPerfumes as any[]).slice(0, 9);
  const heroPerfume = perfumes[0] || {
    title: "Overlord",
    handle: "overlord",
    tagline: "Electrifying citrus crashes into aromatic herbs and magnetic ambroxan.",
    inspiredBy: "Dior Sauvage",
    price: 1299,
    compareAtPrice: 2099,
    images: [{ src: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png" }]
  };

  const allBrands = getAllBrands();

  // Structured Data Schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OCTOPUS Haute Parfumerie",
    "url": "https://www.octopusperfume.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.octopusperfume.in/api/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OCTOPUS Luxury Perfumes",
    "alternateName": [
      "Octopus Perfumes by Harsh Beniwal",
      "Octopus Haute Parfumerie",
      "Harsh Beniwal Perfumes", 
      "BuyOctopus",
      "Octopus Perfumes India"
    ],
    "url": "https://www.octopusperfume.in",
    "logo": "https://www.octopusperfume.in/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Harsh Beniwal"
    },
    "description": "Premier fragrance destination offering 2,300+ authentic luxury, designer, and Middle Eastern perfumes alongside the official Harsh Beniwal signature collection with free pan-India express shipping."
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Signature Flagship Fragrances by Harsh Beniwal",
    "description": "Nine luxury 50ML Eau De Parfum formulations crafted with 25%+ French fragrance oil concentration.",
    "numberOfItems": perfumes.length,
    "itemListElement": perfumes.map((perfume: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${perfume.title} - Octopus Perfumes (50ML EDP)`,
        "url": `https://www.octopusperfume.in/products/${perfume.handle}`,
        "image": perfume.images?.[0]?.url || `https://www.octopusperfume.in${perfume.images?.[0]?.src || ""}`,
        "description": perfume.tagline || perfume.descriptionText,
        "sku": perfume.sku || `OCT-${index + 1}`,
        "brand": {
          "@type": "Brand",
          "name": "Octopus Perfumes"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.octopusperfume.in/products/${perfume.handle}`,
          "priceCurrency": "INR",
          "price": (perfume.price || 1299).toString(),
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      }
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are all perfumes on Octopus Perfumes 100% authentic and original?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, guaranteed 100% authentic. All bottles are sourced directly through authorized brand distributors in their original factory-sealed packaging with verifiable batch codes. We do not sell open testers, decants, or grey-market duplicates."
        }
      },
      {
        "@type": "Question",
        "name": "What concentration are Octopus Perfumes and how long do they last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our flagship fragrances are formulated as high-grade Eau De Parfum (EDP) containing 25%+ imported French perfume essence. This concentration provides 12+ hours of beast-mode projection and sillage on skin, and 24+ hours on fabrics."
        }
      },
      {
        "@type": "Question",
        "name": "How does the free 7ML Paradox tester offer work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every perfume order placed on our store automatically includes a complimentary 7ML Paradox Eau De Parfum discovery tester pack (valued at ₹399) inside your presentation package at no extra cost."
        }
      },
      {
        "@type": "Question",
        "name": "What are the shipping charges and delivery timeframe across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide complimentary free express shipping across all serviceable pin codes in India. Orders placed before 5 PM are dispatched same-day and delivered within 2 to 4 business days via priority air couriers (BlueDart, Delhivery, Expressbees)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the return and replacement policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We maintain a 7-day hassle-free replacement and return policy for items that arrive damaged or in the rare event of a fulfillment error. Because fragrances are personal care items, bottles must remain in their original unopened shrink-wrapped condition."
        }
      }
    ]
  };

  return (
    <div className="bg-white text-[#222222] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 1. Quick Category Strip */}
      <section className="border-b border-[#ebebeb] bg-white sticky top-20 z-20 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {[
              { label: "✨ All Perfumes (2,300+)", href: "/collections/all", active: true, tag: "ALL" },
              { label: "🏛️ 136 Perfume Brands", href: "/brands", active: false, tag: "DIRECTORY" },
              { label: "🔥 Harsh Beniwal 9 EDPs", href: "/harsh-beniwal/octopus/perfumes", active: false, tag: "FLAGSHIP" },
              { label: "👑 Dubai Oud & Amber", href: "/brands/lattafa", active: false, tag: null },
              { label: "⚡ Beast-Mode Men's", href: "/collections/all", active: false, tag: null },
              { label: "🌹 Luxury Women's Florals", href: "/products/darling-women", active: false, tag: null },
              { label: "🎁 Free 7ML Tester Included", href: "/products/paradox", active: false, tag: "FREE" },
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className={`relative px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  cat.active
                    ? "bg-stone-900 text-white shadow-xs font-semibold"
                    : "bg-[#f7f7f7] text-[#222222] hover:bg-stone-200"
                }`}
              >
                <span>{cat.label}</span>
                {cat.tag && (
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                    cat.active ? "bg-amber-400 text-stone-950" : "bg-stone-900 text-white"
                  }`}>
                    {cat.tag}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <Link href="/octopus-perfume-coupon-code" className="hidden lg:flex items-center gap-2 shrink-0 border-l border-[#ebebeb] pl-4 hover:opacity-90 transition-opacity">
            <span className="text-[12px] text-stone-600 font-bold flex items-center gap-1">
              <span>🏷️</span> Code:
            </span>
            <span className="font-mono text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md">
              LUXURY25
            </span>
            <span className="text-[12px] font-bold text-amber-700">Flat 25% OFF</span>
          </Link>
        </div>
      </section>

      {/* 2. Hero Section - Haute Parfumerie Narrative */}
      <section className="px-4 sm:px-6 md:px-12 pt-8 sm:pt-14 pb-16 max-w-[1440px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200 px-4 py-1.5 rounded-full text-xs font-bold text-stone-900 mb-5 shadow-2xs">
              <Sparkles size={14} className="text-amber-600" />
              <span className="tracking-wide uppercase text-[11px]">HAUTE PARFUMERIE · 100% ORIGINAL AUTHENTICITY</span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-extrabold text-[#222222] leading-[1.12] tracking-[-0.75px] mb-5 font-serif">
              Where Rare French Essence Meets All-Day Beast-Mode Sillage
            </h1>

            <p className="text-[16px] sm:text-[17px] text-[#4a4a4a] leading-[1.6] mb-6 max-w-2xl">
              Explore <strong>2,300+ authentic luxury fragrances</strong> from <strong>136 world-renowned perfume houses</strong> alongside the official Harsh Beniwal signature collection. Formulated with <strong>25%+ imported French perfume essence</strong> for unforgettable 12+ hour projection.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-8">
              <span className="inline-flex items-center gap-1.5 text-xs text-stone-950 bg-amber-400/20 border border-amber-300 px-3 py-1.5 rounded-lg font-bold">
                <Sparkles size={13} className="text-amber-700" />
                Code LUXURY25 for 25% OFF
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Gift size={13} className="text-amber-600" />
                Free 7ML Paradox Tester (₹399)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <CheckCircle2 size={13} className="text-emerald-600" />
                25%+ French Oils
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Clock size={13} className="text-stone-700" />
                12H+ Longevity
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Truck size={13} className="text-stone-700" />
                Free Express Pan-India Delivery
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <Link 
                href="/collections/all" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 hover:bg-black active:scale-95 text-white px-7 py-4 rounded-xl font-bold text-[15px] shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <span>Shop All 2,300+ Perfumes</span>
                <ArrowRight size={16} />
              </Link>

              <Link 
                href="/brands" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#222222] border-2 border-stone-800 hover:bg-stone-50 active:scale-95 px-6 py-4 rounded-xl font-semibold text-[15px] transition-all cursor-pointer"
              >
                <span>Browse 136 Brands</span>
              </Link>

              <Link 
                href="/harsh-beniwal/octopus/perfumes" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-6 py-4 rounded-xl font-semibold text-[15px] transition-all cursor-pointer"
              >
                <span>Harsh Beniwal 9 EDPs</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-7 flex items-center gap-2 text-sm text-[#222222]">
              <span className="font-bold text-amber-600">★ 4.94</span>
              <span className="text-[#6a6a6a]">·</span>
              <span className="text-[#6a6a6a]">Over 65,000+ Bottles Delivered Across India</span>
              <span className="text-[#6a6a6a]">·</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Verified Authentic
              </span>
            </div>

          </div>

          {/* Right Column: Hero Bottle Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border border-[#ebebeb] rounded-[20px] p-5 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
              
              <div className="absolute top-0 right-0 bg-stone-900 text-amber-400 text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs z-20">
                Flagship Scent
              </div>

              {/* Photo Container */}
              <div className="relative aspect-square w-full bg-[#f7f7f7] rounded-[14px] overflow-hidden mb-4">
                <Image 
                  src={heroPerfume.images?.[0]?.src || "/harsh-beniwal/octopus/perfumes/images/overlord_box.png"}
                  alt="Overlord 50ML EDP by Harsh Beniwal"
                  fill
                  priority
                  unoptimized
                  className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Meta Block */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#222222] font-serif">
                    {heroPerfume.title} 50ML EDP
                  </h2>
                  <p className="text-[12px] text-amber-700 font-semibold mb-1">Inspired by Dior Sauvage DNA</p>
                  <p className="text-[12px] text-[#6a6a6a]">Calabrian Bergamot, Ambroxan, Sichuan Pepper</p>
                  <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                    <Gift size={12} /> Free 7ML Paradox tester included in box
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="flex items-center justify-end gap-1 text-[13px] text-amber-600 font-bold">
                    <span>★</span>
                    <span>4.94</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[12px] text-[#6a6a6a] line-through mr-1">₹2,099</span>
                    <span className="text-[18px] font-bold text-[#222222]">₹{heroPerfume.price || 1299}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#ebebeb] flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">With Code LUXURY25:</span>
                <span className="text-[16px] font-bold text-amber-700">₹979 Only</span>
              </div>

              <Link
                href={`/products/${heroPerfume.handle}`}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-black active:scale-95 text-white py-3 rounded-xl font-bold text-[14px] shadow-sm transition-all"
              >
                <ShoppingBag size={15} />
                <span>Order Now · Free Express Delivery</span>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* 3. ICONIC FRAGRANCE HOUSES SHOWCASE (136 BRANDS) */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-2.5">
              <Gem size={12} className="text-amber-600" />
              <span>World-Class Perfumeries</span>
            </div>
            <h2 className="text-[26px] sm:text-[34px] font-bold text-[#222222] tracking-tight font-serif">
              Iconic Fragrance Houses & Niche Perfumeries
            </h2>
            <p className="text-[14px] text-[#6a6a6a] mt-1 max-w-2xl">
              From Dubai&apos;s royal oud powerhouses to Parisian Haute Parfumerie, browse authenticated masterpieces with flat 25% OFF.
            </p>
          </div>

          <Link
            href="/brands"
            className="text-[14px] font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1 transition-colors shrink-0 group"
          >
            <span>View All 136 Brands ({allBrands.length})</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8 Featured Brand Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_BRANDS.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="bg-white border border-[#ebebeb] hover:border-stone-400/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                    {b.origin}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {b.badge}
                  </span>
                </div>

                <h3 className="text-[18px] font-bold text-[#222222] group-hover:text-amber-700 transition-colors font-serif mb-1">
                  {b.name}
                </h3>
                
                <p className="text-xs font-semibold text-stone-700 mb-2.5">
                  Famous For: {b.highlight}
                </p>

                <p className="text-xs text-[#6a6a6a] leading-relaxed line-clamp-3">
                  {b.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#ebebeb] flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-amber-700">
                <span>Explore Fragrances</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. HARSH BENIWAL 9 SIGNATURE EDPs SHOWCASE */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-[#ebebeb] bg-[#fafafa]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-900 bg-white border border-stone-200 px-3 py-1 rounded-full mb-2.5 shadow-2xs">
              <Award size={12} className="text-amber-600" />
              <span>In-House Signature Formulations</span>
            </div>
            <h2 className="text-[26px] sm:text-[34px] font-bold text-[#222222] tracking-tight font-serif">
              The 9 Flagship EDPs by Harsh Beniwal
            </h2>
            <p className="text-[14px] text-[#6a6a6a] mt-1 max-w-2xl">
              Formulated in Grasse, France with 25%+ fragrance oil concentration. Each bottle includes a complimentary 7ML Paradox luxury tester pack.
            </p>
          </div>

          <Link
            href="/harsh-beniwal/octopus/perfumes"
            className="text-[14px] font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1 transition-colors shrink-0 group"
          >
            <span>Explore All 9 Flagship Scents</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 9 EDP Fragrances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfumes.map((p: any, idx: number) => {
            const inspiredNotes: Record<string, { dna: string; notes: string }> = {
              "overlord": { dna: "Dior Sauvage DNA", notes: "Calabrian Bergamot, Ambroxan, Sichuan Pepper" },
              "paradox": { dna: "Louis Vuitton Les Sables Roses DNA", notes: "Grasse Rose, Ambergris, Smoky Oud" },
              "promised": { dna: "Baccarat Rouge 540 DNA", notes: "Saffron, Jasmine, Cedarwood, Ambergris" },
              "outlaw": { dna: "Tom Ford Ombré Leather DNA", notes: "Black Leather, Cardamom, Patchouli, Moss" },
              "mirage": { dna: "Louis Vuitton Ombre Nomade DNA", notes: "Royal Oud Wood, Benzoin Tears, Raspberry" },
              "somersault": { dna: "Louis Vuitton Imagination DNA", notes: "Black Tea, Italian Neroli, Ambrox, Ginger" },
              "rhapsody": { dna: "Maison Margiela Jazz Club DNA", notes: "Pink Pepper, Rum Absolute, Tobacco Leaf" },
              "your-move": { dna: "Tom Ford Oud Wood DNA", notes: "Rare Oud, Rosewood, Cardamom, Sandalwood" },
              "darling-women": { dna: "Miss Dior Couture DNA", notes: "Damascena Rose, Peony, Iris, Tender Musks" },
            };
            const meta = inspiredNotes[p.handle] || { dna: "Luxury Designer DNA", notes: "French Fragrance Essence" };

            return (
              <div 
                key={p.handle}
                className="bg-white border border-[#ebebeb] hover:border-stone-400/80 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square w-full bg-[#f7f7f7] rounded-xl overflow-hidden mb-4">
                    <span className="absolute top-2.5 left-2.5 z-10 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      50ML EDP
                    </span>
                    <span className="absolute top-2.5 right-2.5 z-10 bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      25%+ Oils
                    </span>
                    <Image 
                      src={p.images?.[0]?.src || "/harsh-beniwal/octopus/perfumes/images/overlord_box.png"}
                      alt={`${p.title} 50ML EDP by Harsh Beniwal`}
                      fill
                      unoptimized
                      className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-[19px] font-bold text-[#222222] group-hover:text-amber-700 transition-colors font-serif">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <span>★</span>
                      <span>4.9{idx % 3 + 2}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-amber-700 mb-1.5">
                    {meta.dna}
                  </p>

                  <p className="text-xs text-[#6a6a6a] line-clamp-2 mb-3">
                    {meta.notes}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ebebeb] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#6a6a6a] line-through block">₹2,099</span>
                    <span className="text-[17px] font-bold text-[#222222]">₹{p.price || 1299}</span>
                  </div>

                  <Link
                    href={`/products/${p.handle}`}
                    className="px-4 py-2 bg-stone-900 hover:bg-black active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <ShoppingBag size={13} />
                    <span>View Scent</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. THE OLFACTORY PYRAMID & LONGEVITY GUIDE */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-900 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full mb-3">
            <Droplets size={12} className="text-amber-600" />
            <span>Fragrance Engineering</span>
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#222222] font-serif">
            The Scent Pyramid: Anatomy of 12+ Hour Beast-Mode Sillage
          </h2>
          <p className="text-sm text-[#6a6a6a] mt-2 leading-relaxed">
            Every bottle formulation is structured around a three-tier olfactory pyramid calibrated to withstand warm weather and deliver enduring projection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-left relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">Phase 1 · 0 to 30 Mins</span>
            <h3 className="text-xl font-bold text-stone-900 font-serif mb-2">Top Notes (Opening)</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              The initial burst of radiant energy upon spraying. High-volatility citrus, sparkling aldehydes, and spicy pink pepper create instant charisma.
            </p>
            <div className="text-[11px] font-semibold text-stone-800 bg-white p-2.5 rounded-lg border border-stone-200">
              Calabrian Bergamot · Italian Mandarin · Cardamom · Pink Pepper
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 text-left relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">Phase 2 · 30 Mins to 4 Hours</span>
            <h3 className="text-xl font-bold text-stone-900 font-serif mb-2">Heart Notes (Character)</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              The signature soul of the fragrance. Voluptuous florals, aromatic herbs, and exotic spices develop as body heat blooms the essence.
            </p>
            <div className="text-[11px] font-semibold text-amber-900 bg-white p-2.5 rounded-lg border border-amber-200">
              Grasse Rose · Saffron · Black Tea · Lavender · Rum Absolute
            </div>
          </div>

          <div className="bg-stone-900 text-white rounded-2xl p-6 text-left relative overflow-hidden shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">Phase 3 · 4 to 14+ Hours</span>
            <h3 className="text-xl font-bold text-white font-serif mb-2">Base Notes (Beast-Mode Drydown)</h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              Heavy molecular fixatives anchored by French oils that cling to skin and fabrics, providing unmistakable magnetic sillage through the night.
            </p>
            <div className="text-[11px] font-semibold text-stone-200 bg-stone-800 p-2.5 rounded-lg border border-stone-700">
              Ambroxan · Royal Oud · Tonka Bean · Tuscan Leather · Benzoin
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & STORE COMMITMENTS */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-[#ebebeb] bg-[#fcfcfc]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5 p-4 bg-white rounded-xl border border-[#ebebeb]">
            <ShieldCheck size={28} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#222222]">100% Original & Sealed</h4>
              <p className="text-xs text-[#6a6a6a] mt-1">Directly sourced through authorized distributors with verified batch codes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 bg-white rounded-xl border border-[#ebebeb]">
            <Droplets size={28} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#222222]">25%+ French Essence</h4>
              <p className="text-xs text-[#6a6a6a] mt-1">Formulated as Eau De Parfum and Extraits for maximum 12H+ longevity.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 bg-white rounded-xl border border-[#ebebeb]">
            <Gift size={28} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#222222]">Complimentary Tester</h4>
              <p className="text-xs text-[#6a6a6a] mt-1">Every order includes a free 7ML Paradox EDP luxury discovery pack.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 bg-white rounded-xl border border-[#ebebeb]">
            <Truck size={28} className="text-stone-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#222222]">Express Pan-India Delivery</h4>
              <p className="text-xs text-[#6a6a6a] mt-1">Dispatched same-day and delivered in 2 to 4 business days nationwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[26px] sm:text-[32px] font-bold text-[#222222] font-serif">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#6a6a6a] mt-1">
              Everything you need to know about our authentic perfumes, formulations, and delivery.
            </p>
          </div>

          <div className="divide-y divide-[#ebebeb] border-y border-[#ebebeb]">
            {faqSchema.mainEntity.map((faq, i) => (
              <details key={i} className="py-4 group cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-[15px] text-[#222222] group-hover:text-amber-700 transition-colors list-none">
                  <span>{faq.name}</span>
                  <ChevronRight size={16} className="text-[#6a6a6a] group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-[#4a4a4a] leading-relaxed pl-1">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
