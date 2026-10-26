import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { 
  ShieldCheck, 
  Truck, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Award, 
  Plus, 
  Minus, 
  MessageSquare, 
  Droplets, 
  Zap, 
  Gem, 
  Gift,
  Heart,
  Package
} from "lucide-react";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";

export const metadata: Metadata = {
  title: "Octopus Perfumes by Harsh Beniwal | Shubh Deepavali 2026 Sale • 100% Original 50ML EDP",
  description: "Celebrate Diwali 2026 with official Octopus Perfumes by Harsh Beniwal. 9 luxury 50ML Eau De Parfums formulated with 25%+ French fragrance oil concentration, beast-mode sillage, and 12+ hour longevity. Flat 20% OFF with code DIWALI20 + Free 7ML Paradox tester (₹399) + Deluxe Diwali Gift Box. Free Pan-India express delivery.",
  keywords: [
    "Harsh Beniwal perfume",
    "Octopus perfume",
    "Octopus perfume by Harsh Beniwal",
    "Buy Octopus perfume",
    "Octopus perfume official website",
    "Octopus perfumes price",
    "Octopus perfume review",
    "Harsh Beniwal perfume price",
    "Octopus perfume India",
    "BuyOctopus",
    "harsh beniwal octopus perfume",
    "harsh beniwal fragrance",
    "harsh beniwal cologne",
    "overlord perfume harsh beniwal",
    "overlord perfume",
    "promised perfume harsh beniwal",
    "somersault perfume harsh beniwal",
    "mirage perfume harsh beniwal",
    "rhapsody perfume harsh beniwal",
    "outlaw perfume harsh beniwal",
    "your move perfume harsh beniwal",
    "paradox perfume harsh beniwal",
    "darling perfume harsh beniwal",
    "buy octopus perfume online",
    "best edp perfumes for men in india",
    "luxury perfumes india",
    "long lasting perfumes 12 hours",
    "french edp perfumes online",
    "diwali perfume gifts",
    "diwali gifts 2026",
    "luxury diwali gifts india",
    "diwali gift hampers 2026",
    "diwali perfume gift sets",
    "best diwali gift for boyfriend",
    "best diwali gift for girlfriend",
    "diwali gift for husband",
    "diwali gifts for wife",
    "diwali gifts for men",
    "diwali gifts for sister",
    "diwali corporate gifting perfumes",
    "corporate diwali gift hampers 2026",
    "diwali discount on luxury perfumes",
    "coupon code DIWALI20",
    "dior sauvage clone long lasting india diwali gift",
    "baccarat rouge clone india buy online",
    "louis vuitton ombre nomade clone buy india",
    "beast mode winter perfumes india 2026"
  ],
  alternates: {
    canonical: "https://www.octopusperfume.in",
  },
  openGraph: {
    title: "Octopus Perfumes by Harsh Beniwal | Shubh Deepavali 2026 Sale (50ML EDP)",
    description: "Shop 100% original Octopus Perfumes by Harsh Beniwal for Diwali 2026. 25%+ French fragrance oils, 12+ hour sillage, free 7ML Paradox tester & deluxe festive gift boxes. Use code DIWALI20 for 20% OFF.",
    url: "https://www.octopusperfume.in",
    siteName: "Octopus Perfumes by Harsh Beniwal",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 630,
        alt: "Octopus Perfumes by Harsh Beniwal - Diwali Luxury Fragrance Gift Sets",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octopus Perfumes by Harsh Beniwal | Diwali Festive Sale 2026",
    description: "Shop official Octopus Perfumes by Harsh Beniwal. 25%+ French fragrance oils, 12+ hour longevity. Code DIWALI20 for 20% OFF + Free 7ML tester.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
};

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

  // Structured Data Schema for Google Search Dominance & AI Overview (AEO/GEO)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Octopus Perfumes by Harsh Beniwal",
    "alternateName": [
      "Octopus Perfumes", 
      "Harsh Beniwal Perfumes", 
      "Octopus EDP",
      "BuyOctopus",
      "Buy Octopus Perfume",
      "Octopus Perfume Official Website",
      "Octopus Perfume India",
      "Diwali Luxury Perfume Gifts"
    ],
    "url": "https://www.octopusperfume.in",
    "logo": "https://www.octopusperfume.in/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Harsh Beniwal"
    },
    "description": "Official luxury fragrance house by Harsh Beniwal. High-concentration 50ML Eau De Parfum crafted with 25%+ imported French perfume oils. Exclusive Diwali gift hampers with complimentary 7ML Paradox tester packs."
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Diwali 2026 Luxury Perfume Gifts Collection by Harsh Beniwal",
    "description": "Official 9 luxury 50ML Eau De Parfum fragrances curated by Harsh Beniwal for Diwali gifting.",
    "numberOfItems": perfumes.length,
    "itemListElement": perfumes.map((perfume: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${perfume.title} - Octopus Perfumes by Harsh Beniwal (50ML EDP)`,
        "url": `https://www.octopusperfume.in/products/${perfume.handle}`,
        "image": perfume.images?.[0]?.url || `https://www.octopusperfume.in${perfume.images?.[0]?.src || ""}`,
        "description": perfume.tagline || perfume.descriptionText,
        "sku": perfume.sku || `OCT-${index + 1}`,
        "mpn": perfume.sku || `OCT-${index + 1}`,
        "brand": {
          "@type": "Brand",
          "name": "Octopus Perfumes by Harsh Beniwal"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.octopusperfume.in/products/${perfume.handle}`,
          "priceCurrency": "INR",
          "price": (perfume.price || 1299).toString(),
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Octopus Perfumes"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": perfume.rating?.value?.toString() || "4.92",
          "reviewCount": perfume.rating?.count || 5280
        }
      }
    }))
  };

  const diwaliSaleSchema = {
    "@context": "https://schema.org",
    "@type": "SaleEvent",
    "name": "Diwali Mega Festive Fragrance Sale 2026",
    "description": "Celebrate Diwali with 100% original 50ML Eau De Parfums by Harsh Beniwal. Enjoy flat 20% OFF using coupon DIWALI20, a free 7ML Paradox tester pack, and deluxe festive gift box packaging with guaranteed pre-Diwali delivery.",
    "startDate": "2026-10-15T00:00:00+05:30",
    "endDate": "2026-11-15T23:59:59+05:30",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "location": {
      "@type": "VirtualLocation",
      "url": "https://www.octopusperfume.in"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Octopus Perfumes by Harsh Beniwal",
      "url": "https://www.octopusperfume.in"
    },
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://www.octopusperfume.in/diwali-gifts"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I get guaranteed delivery before Diwali 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All orders placed this week are dispatched via priority express air couriers (BlueDart, Delhivery, Expressbees) with guaranteed 2 to 4 business days pan-India delivery, ensuring your festive gift hampers arrive in time for Diwali celebrations and puja."
        }
      },
      {
        "@type": "Question",
        "name": "Why are luxury perfumes the best Diwali gifts for 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike traditional sweets and dry fruits that expire quickly or get re-gifted, luxury 50ML Eau De Parfums by Harsh Beniwal offer over 750+ sprays lasting 12+ months. Formulated with 25%+ French fragrance oils, they create unforgettable olfactory memories that evoke confidence and joy every single morning."
        }
      },
      {
        "@type": "Question",
        "name": "How do I claim the 20% Diwali discount code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply apply coupon code DIWALI20 at checkout to receive flat 20% OFF on all 50ML EDP perfumes and festive gift hampers. In addition, every order automatically receives a complimentary 7ML Paradox tester pack (worth ₹399) inside the deluxe presentation box."
        }
      },
      {
        "@type": "Question",
        "name": "Can I send Diwali perfume hampers directly to relatives or colleagues?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely! During checkout, simply enter the recipient's shipping address. All orders are packed in heavy, crush-resistant festive gift presentation boxes with tamper-evident seals and can include a complimentary personalized festive greeting message."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Octopus Perfumes by Harsh Beniwal last so long during festive parties?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every bottle is formulated as a high-grade Eau De Parfum (EDP) with 25%+ imported French fragrance oil concentration. This delivers 12+ hours of beast-mode longevity on skin and over 24 hours on fabrics, specifically engineered to withstand warm indoor card parties, fireworks smoke, and outdoor gatherings."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Octopus perfumes price and Harsh Beniwal perfume price in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The official Octopus perfumes price is ₹1,299 for each 50ML Eau De Parfum (discounted from MRP ₹2,099). Applying coupon code DIWALI20 at checkout brings the price down to approximately ₹1,039, making authentic French-formulated luxury perfumes accessible to everyone."
        }
      },
      {
        "@type": "Question",
        "name": "What iconic luxury fragrance DNAs are in the Harsh Beniwal collection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The collection features 9 iconic scents: Overlord (Dior Sauvage DNA), Promised (Baccarat Rouge 540 DNA), Somersault (LV Imagination DNA), Mirage (LV Ombre Nomade DNA), Rhapsody (Jazz Club DNA), Your Move (TF Oud Wood DNA), Outlaw (TF Ombré Leather DNA), Paradox (LV Les Sables Roses DNA), and Darling (Miss Dior DNA)."
        }
      },
      {
        "@type": "Question",
        "name": "Is BuyOctopus the official website for Harsh Beniwal perfume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BuyOctopus (https://www.octopusperfume.in) is the verified official flagship website to purchase 100% original Octopus perfumes co-created by Harsh Beniwal."
        }
      }
    ]
  };

  return (
    <div className="bg-white text-[#222222] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(diwaliSaleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 1. Category Strip - Diwali Gifting Focused */}
      <section className="border-b border-[#ebebeb] bg-white sticky top-20 z-20 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {[
              { label: "🪔 Diwali Bestsellers", href: "/diwali-gifts", active: true, tag: "SALE" },
              { label: "🎁 Festive Gift Hampers", href: "/diwali-gifts", active: false, tag: "POPULAR" },
              { label: "👑 Royal Oud & Amber", href: "/harsh-beniwal/octopus/perfumes", active: false, tag: null },
              { label: "✨ Fresh & Citrus", href: "/harsh-beniwal/octopus/perfumes", active: false, tag: null },
              { label: "💑 Couple Gifting", href: "/diwali-gifts", active: false, tag: null },
              { label: "🏢 Corporate Diwali Gifts", href: "/diwali-gifts", active: false, tag: null },
              { label: "🔥 Free 7ML Tester Included", href: "/products/paradox", active: false, tag: "FREE" },
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className={`relative px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  cat.active
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm font-semibold"
                    : "bg-[#f7f7f7] text-[#222222] hover:bg-[#ebebeb]"
                }`}
              >
                <span>{cat.label}</span>
                {cat.tag && (
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                    cat.active ? "bg-white text-amber-900" : "bg-[#ff385c] text-white"
                  }`}>
                    {cat.tag}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0 border-l border-[#ebebeb] pl-4">
            <span className="text-[12px] text-amber-800 font-bold flex items-center gap-1">
              <span>🪔</span> Code:
            </span>
            <span className="font-mono text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md">
              DIWALI20
            </span>
            <span className="text-[12px] font-bold text-[#ff385c]">Flat 20% OFF</span>
          </div>
        </div>
      </section>

      {/* 2. Hero Section - Festive Diwali Photography-Led Showcase */}
      <section className="px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 pb-12 max-w-[1440px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand & Festive Deepavali Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Shubh Deepavali Handcrafted Pill */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 mb-4 shadow-2xs">
              <span className="text-sm">🪔</span>
              <span className="tracking-wide">Shubh Deepavali 2026 • Harsh Beniwal Fragrance House</span>
            </div>

            {/* Festive Hero H1 */}
            <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-[#222222] leading-[1.15] tracking-[-0.5px] mb-4">
              Celebrate Diwali With Luxury Fragrances by Harsh Beniwal
            </h1>

            <p className="text-[16px] text-[#3f3f3f] leading-[1.55] mb-6 max-w-xl">
              Nine luxury <strong>50ML Eau De Parfums</strong> formulated with <strong>25%+ imported French perfume essence</strong>. Engineered for 12+ hour beast-mode sillage in Indian festive gatherings. Includes a complimentary <strong>7ML Paradox discovery tester pack (₹399 value)</strong> and deluxe gift packaging with every order.
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-bold">
                <span>🪔</span>
                Code DIWALI20 for 20% OFF
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Gift size={14} className="text-[#ff385c]" />
                Free 7ML Paradox Tester (₹399)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <CheckCircle2 size={14} className="text-[#188038]" />
                25%+ French Oils
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Clock size={14} className="text-[#222222]" />
                12H+ Longevity
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Truck size={14} className="text-[#222222]" />
                Guaranteed Pre-Diwali Delivery
              </span>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link 
                href="/diwali-gifts" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white px-7 py-3.5 rounded-xl font-bold text-[15px] shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <span>🪔</span>
                <span>Shop Diwali Gift Hampers</span>
                <ArrowRight size={16} />
              </Link>

              <Link 
                href="/harsh-beniwal/octopus/perfumes" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#222222] border-2 border-[#222222] hover:bg-[#f7f7f7] active:scale-95 px-6 py-3.5 rounded-xl font-semibold text-[15px] transition-all cursor-pointer"
              >
                <span>Explore 9 Perfumes • ₹999</span>
              </Link>
            </div>

            {/* Social Proof Rating */}
            <div className="mt-6 flex items-center gap-2 text-sm text-[#222222]">
              <span className="font-bold text-amber-600">★ 4.92</span>
              <span className="text-[#6a6a6a]">·</span>
              <span className="text-[#6a6a6a]">50,000+ Festive Orders Delivered</span>
              <span className="text-[#6a6a6a]">·</span>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Verified Official Store</span>
            </div>

          </div>

          {/* Right Column: Hero Showcase Card with Diwali Accents */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border-2 border-amber-300 rounded-[18px] p-4 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden">
              
              {/* Corner Festive Ribbon */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs z-20">
                🪔 Diwali Special
              </div>

              {/* Photo Plate */}
              <div className="relative aspect-square w-full bg-[#f7f7f7] rounded-[12px] overflow-hidden mb-4">
                <div className="guest-favorite-badge">
                  Festive Bestseller
                </div>

                <Image 
                  src={heroPerfume.images?.[0]?.src || "/harsh-beniwal/octopus/perfumes/images/overlord_box.png"}
                  alt="Overlord 50ML EDP by Harsh Beniwal - Diwali Luxury Gift"
                  fill
                  priority
                  unoptimized
                  className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Meta Block */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[17px] font-bold text-[#222222]">
                    {heroPerfume.title} 50ML EDP (Sauvage DNA)
                  </h2>
                  <p className="text-[13px] text-[#6a6a6a]">Calabrian Bergamot, Ambroxan, Sichuan Pepper</p>
                  <p className="text-[12px] font-semibold text-amber-800 mt-1 flex items-center gap-1">
                    <span>🎁 Free 7ML Paradox tester included inside box</span>
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="flex items-center justify-end gap-1 text-[14px] text-amber-600 font-bold">
                    <span>★</span>
                    <span>4.94</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[12px] text-[#6a6a6a] line-through mr-1">₹2,099</span>
                    <span className="text-[16px] font-bold text-[#222222]">₹{heroPerfume.price || 1299}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="text-amber-900 font-semibold">With Code DIWALI20:</span>
                <span className="text-[15px] font-bold text-[#ff385c]">₹1,039 Only</span>
              </div>

              <Link
                href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white py-3 rounded-xl font-bold text-[14px] shadow-sm transition-all"
              >
                <Zap size={15} className="fill-white" />
                <span>Buy Now • ₹1,039 with DIWALI20</span>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* 3. NEW FLAGSHIP SECTION: Curated Diwali Fragrance Gift Hampers 2026 */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb] bg-gradient-to-b from-amber-50/40 via-white to-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-2">
              <span>🪔</span>
              <span>Diwali 2026 Exclusive Hampers</span>
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#222222] tracking-tight">
              Curated Diwali Fragrance Gift Hampers & Boxes
            </h2>
            <p className="text-[14px] text-[#6a6a6a] mt-1">
              Elevate your festive gifting with handpicked perfume pairings in deluxe presentation packaging with free discovery testers.
            </p>
          </div>

          <Link
            href="/diwali-gifts"
            className="text-[14px] font-bold text-amber-700 hover:text-amber-900 underline underline-offset-4 transition-colors shrink-0"
          >
            Explore all Diwali gift hampers &rarr;
          </Link>
        </div>

        {/* 4 Curated Diwali Hampers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Hamper 1: Royal Couple Hamper */}
          <div className="bg-white border-2 border-amber-300/80 rounded-[16px] p-4 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="relative aspect-square bg-[#f7f7f7] rounded-[12px] overflow-hidden mb-3">
                <span className="absolute top-2 left-2 z-10 bg-amber-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  Couple Gifting
                </span>
                <Image 
                  src="/harsh-beniwal/octopus/perfumes/images/darling_box.png"
                  alt="Royal Couple Diwali Hamper"
                  fill
                  unoptimized
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-[16px] font-bold text-[#222222] leading-snug">
                Royal Couple Festive Hamper (Overlord + Darling)
              </h3>
              <p className="text-[12px] text-[#6a6a6a] mt-1">
                His & Her luxury duo: Dior Sauvage DNA + Miss Dior DNA in deluxe dual gift packaging.
              </p>

              <div className="mt-3 p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 space-y-0.5">
                <p>✓ 2x Full 50ML EDP Bottles</p>
                <p>✓ 2x Free 7ML Paradox Testers (₹798 Value)</p>
                <p>✓ Gold Festive Gift Presentation</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6a6a6a] line-through block">MRP ₹4,298</span>
                <span className="text-[16px] font-bold text-[#222222]">₹1,718</span>
                <span className="text-[10px] text-amber-800 font-bold block">with DIWALI20</span>
              </div>
              <Link
                href="/products/darling-women"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95"
              >
                Buy Hamper
              </Link>
            </div>
          </div>

          {/* Hamper 2: Emperor's Connoisseur Trio */}
          <div className="bg-white border-2 border-amber-400 rounded-[16px] p-4 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group relative">
            <span className="absolute -top-3 right-4 bg-[#ff385c] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full z-10">
              VIP Bestseller
            </span>

            <div>
              <div className="relative aspect-square bg-[#f7f7f7] rounded-[12px] overflow-hidden mb-3">
                <span className="absolute top-2 left-2 z-10 bg-[#222222] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  Grand Trio Box
                </span>
                <Image 
                  src="/harsh-beniwal/octopus/perfumes/images/promised_box.png"
                  alt="Emperor's Connoisseur Trio Diwali Box"
                  fill
                  unoptimized
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-[16px] font-bold text-[#222222] leading-snug">
                Emperor&apos;s Connoisseur Trio (Overlord + Promised + Mirage)
              </h3>
              <p className="text-[12px] text-[#6a6a6a] mt-1">
                The ultimate festive authority: Sauvage DNA + Baccarat Rouge 540 DNA + LV Ombre Nomade Oud.
              </p>

              <div className="mt-3 p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 space-y-0.5">
                <p>✓ 3x Full 50ML EDP Fragrances</p>
                <p>✓ Free 7ML Paradox Tester Included</p>
                <p>✓ Premium Presentation Master Box</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6a6a6a] line-through block">MRP ₹7,397</span>
                <span className="text-[16px] font-bold text-[#222222]">₹2,717</span>
                <span className="text-[10px] text-amber-800 font-bold block">with DIWALI20</span>
              </div>
              <Link
                href="/products/promised"
                className="px-4 py-2 bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-lg text-xs font-bold shadow-xs active:scale-95"
              >
                Buy Trio Box
              </Link>
            </div>
          </div>

          {/* Hamper 3: Signature Solo Festive Box */}
          <div className="bg-white border-2 border-amber-300/80 rounded-[16px] p-4 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="relative aspect-square bg-[#f7f7f7] rounded-[12px] overflow-hidden mb-3">
                <span className="absolute top-2 left-2 z-10 bg-amber-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  Under ₹1,100
                </span>
                <Image 
                  src="/harsh-beniwal/octopus/perfumes/images/overlord_box.png"
                  alt="Overlord Solo Festive Box"
                  fill
                  unoptimized
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-[16px] font-bold text-[#222222] leading-snug">
                Signature Solo Festive Box (Overlord 50ML EDP)
              </h3>
              <p className="text-[12px] text-[#6a6a6a] mt-1">
                India&apos;s #1 festive fragrance gift. Electric bergamot, ambroxan, and 12+ hour beast-mode sillage.
              </p>

              <div className="mt-3 p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 space-y-0.5">
                <p>✓ 50ML Eau De Parfum (25%+ Oils)</p>
                <p>✓ Free 7ML Paradox Tester (₹399)</p>
                <p>✓ Heavy crush-proof gift carton</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6a6a6a] line-through block">MRP ₹2,099</span>
                <span className="text-[16px] font-bold text-[#222222]">₹1,039</span>
                <span className="text-[10px] text-amber-800 font-bold block">with DIWALI20</span>
              </div>
              <Link
                href="/products/overlord"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95"
              >
                Buy Now
              </Link>
            </div>
          </div>

          {/* Hamper 4: Corporate & VIP Bulk Gifting */}
          <div className="bg-white border-2 border-amber-300/80 rounded-[16px] p-4 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="relative aspect-square bg-[#f7f7f7] rounded-[12px] overflow-hidden mb-3">
                <span className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  Corporate
                </span>
                <Image 
                  src="/harsh-beniwal/octopus/perfumes/images/mirage_box.png"
                  alt="Corporate Diwali Perfume Gifting"
                  fill
                  unoptimized
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-[16px] font-bold text-[#222222] leading-snug">
                Corporate Diwali Gifting Hamper Box
              </h3>
              <p className="text-[12px] text-[#6a6a6a] mt-1">
                Custom bulk fragrance gifting for clients, executives, and business partners with personalized festive notes.
              </p>

              <div className="mt-3 p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 space-y-0.5">
                <p>✓ 10 to 500+ Box Bulk Capacity</p>
                <p>✓ Custom Branded Greeting Cards</p>
                <p>✓ Direct Multi-Address Pan-India Delivery</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6a6a6a] block">Bulk Volume Pricing</span>
                <span className="text-[15px] font-bold text-amber-900">Custom Quote</span>
              </div>
              <Link
                href="/pages/contact"
                className="px-4 py-2 bg-[#222222] hover:bg-black text-white rounded-lg text-xs font-bold shadow-xs active:scale-95"
              >
                Inquire Bulk
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Flagship Marketplace Grid: The 9 Harsh Beniwal Perfumes */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-2">
              <span>🪔</span>
              <span>100% Original 50ML EDP Fragrances</span>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-bold text-[#222222] tracking-tight">
              Explore the 9 Iconic Harsh Beniwal Fragrances
            </h2>
            <p className="text-[14px] text-[#6a6a6a] mt-1">
              Formulated with 25%+ French fragrance oils, 12+ hour sillage, and a complimentary 7ML Paradox tester pack in every box.
            </p>
          </div>

          <Link
            href="/harsh-beniwal/octopus/perfumes"
            className="text-[14px] font-bold text-[#222222] hover:text-[#ff385c] underline underline-offset-4 transition-colors"
          >
            View all 9 perfumes &rarr;
          </Link>
        </div>

        {/* 9 Perfumes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {perfumes.map((perfume: any) => {
            const mainImg = perfume.images?.[0]?.src || "/logo.png";

            return (
              <div 
                key={perfume.handle}
                className="group bg-white border border-[#ebebeb] hover:border-amber-300 rounded-[16px] p-4 shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                {/* Photo Plate */}
                <div className="relative aspect-square bg-[#f7f7f7] rounded-[12px] overflow-hidden mb-3">
                  <div className="guest-favorite-badge flex items-center gap-1">
                    <span>🪔</span>
                    <span>Diwali Special</span>
                  </div>

                  <Image 
                    src={mainImg}
                    alt={`${perfume.title} 50ML EDP by Harsh Beniwal - Diwali Perfume Gift`}
                    fill
                    unoptimized
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Meta Content */}
                <div className="flex flex-col flex-1">
                  
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[16px] font-bold text-[#222222] truncate">
                      {perfume.title} 50ML EDP
                    </h3>
                    <div className="flex items-center gap-1 text-[13px] font-bold text-amber-600 shrink-0">
                      <span>★</span>
                      <span>{perfume.rating?.value || "4.92"}</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#6a6a6a] truncate mt-0.5">
                    {perfume.inspiredBy ? `Inspired by ${perfume.inspiredBy}` : "25%+ French Essence Oils"}
                  </p>

                  <p className="text-[12px] text-amber-800 font-semibold truncate mt-0.5">
                    🎁 Free 7ML Paradox Tester (₹399) Included
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#ebebeb] flex items-center justify-between">
                    <div>
                      <span className="text-[12px] text-[#6a6a6a] line-through mr-1.5">
                        ₹{perfume.compareAtPrice || 2099}
                      </span>
                      <span className="text-[16px] font-bold text-[#222222]">
                        ₹{perfume.price || 1299}
                      </span>
                      <span className="text-[11px] text-[#6a6a6a] font-normal"> / bottle</span>
                    </div>

                    <Link
                      href={`/harsh-beniwal/octopus/perfumes/${perfume.handle}`}
                      className="px-4 py-2 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Buy Now</span>
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Diwali Gifting Matrix: Why Fragrances Beat Sweets for Diwali 2026 */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full mb-3">
              <span>🪔</span>
              <span>Diwali Gifting Guide 2026</span>
            </div>
            <h2 className="text-[24px] sm:text-[32px] font-extrabold text-[#222222] tracking-tight">
              Why Luxury Perfumes Beat Traditional Sweets for Diwali
            </h2>
            <p className="text-[15px] text-[#6a6a6a] mt-2 max-w-2xl mx-auto">
              Compare why thousands of modern Indian families are switching from perishable sweets (mithai) to everlasting Eau De Parfum fragrances.
            </p>
          </div>

          <div className="overflow-x-auto shadow-airbnb rounded-[16px] border border-[#ebebeb] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7f7f7] border-b border-[#ebebeb] text-[#222222] font-bold">
                <tr>
                  <th className="py-4 px-6 text-[13px] uppercase tracking-wider">Gifting Factor</th>
                  <th className="py-4 px-6 text-[13px] uppercase tracking-wider bg-amber-50 text-amber-900 border-x border-amber-200">
                    🪔 Octopus Perfumes by Harsh Beniwal
                  </th>
                  <th className="py-4 px-6 text-[13px] uppercase tracking-wider text-[#6a6a6a]">
                    Traditional Sweets & Dry Fruits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb] text-[14px]">
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#222222]">Shelf Life & Usability</td>
                  <td className="py-4 px-6 bg-amber-50/50 text-[#222222] font-semibold border-x border-amber-200">
                    36+ Months (750+ luxury sprays worn daily)
                  </td>
                  <td className="py-4 px-6 text-[#6a6a6a]">5 to 7 Days (Stales rapidly, creates food waste)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#222222]">Memorability & Sillage</td>
                  <td className="py-4 px-6 bg-amber-50/50 text-[#222222] font-semibold border-x border-amber-200">
                    Every spray recalls your thoughtful gesture for a whole year
                  </td>
                  <td className="py-4 px-6 text-[#6a6a6a]">Consumed in 10 minutes or re-gifted to neighbors</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#222222]">Health & Lifestyle</td>
                  <td className="py-4 px-6 bg-amber-50/50 text-[#222222] font-semibold border-x border-amber-200">
                    100% Calorie-free, skin-safe, IFRA certified French oils
                  </td>
                  <td className="py-4 px-6 text-[#6a6a6a]">High sugar, artificial colors, health concerns for elders</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#222222]">Prestige & Presentation</td>
                  <td className="py-4 px-6 bg-amber-50/50 text-[#222222] font-semibold border-x border-amber-200">
                    Deluxe festive presentation box + Heavy luxury glass bottle
                  </td>
                  <td className="py-4 px-6 text-[#6a6a6a]">Mass-produced generic cardboard boxes</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#222222]">Complimentary Gift</td>
                  <td className="py-4 px-6 bg-amber-50/50 text-[#222222] font-semibold border-x border-amber-200">
                    Free 7ML Paradox EDP Discovery Tester (₹399 value)
                  </td>
                  <td className="py-4 px-6 text-[#6a6a6a]">None</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/diwali-gifts"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-8 rounded-xl text-[14px] shadow-sm transition-all"
            >
              <span>🪔</span>
              <span>Shop Thoughtful Diwali Fragrance Gifts</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Pre-Diwali Guaranteed Delivery Banner */}
      <section className="px-4 sm:px-6 md:px-12 py-8 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-300 rounded-[18px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm text-2xl">
              🪔
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Festive Assurance
              </span>
              <h3 className="text-[20px] font-bold text-[#222222]">
                Guaranteed Pan-India Delivery in Time for Diwali
              </h3>
              <p className="text-[13px] text-[#6a6a6a] mt-0.5">
                Priority express air courier dispatch via BlueDart & Delhivery across all 19,000+ Indian pin codes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/diwali-gifts"
              className="bg-[#222222] hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95"
            >
              Order Diwali Gifts Now
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Performance Benchmark (Why Octopus EDP Dominates) */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="mb-8">
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[#222222] tracking-tight">
            Performance Benchmark: 25%+ French Oils
          </h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">
            See how Harsh Beniwal&apos;s high-concentration Eau De Parfum compares to mass market sprays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Mass Retail EDT */}
          <div className="bg-white border border-[#ebebeb] rounded-[14px] p-6 shadow-airbnb flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase bg-[#f7f7f7] text-[#6a6a6a] px-2.5 py-1 rounded-full">
                Mass Retail EDTs
              </span>
              <h3 className="text-[18px] font-semibold text-[#222222] mt-3 mb-2">
                Department Store Bottles
              </h3>
              <ul className="space-y-2 text-[13px] text-[#6a6a6a] mb-6">
                <li>• 8% - 12% Diluted Oil Concentration</li>
                <li>• Lasts only 2 to 4 hours on skin</li>
                <li>• Harsh initial alcohol blast</li>
                <li>• Requires 4-5 re-sprays throughout festive parties</li>
              </ul>
            </div>
            <div className="border-t border-[#ebebeb] pt-3">
              <span className="text-[13px] text-[#6a6a6a]">Typical Price: ₹1,500 - ₹3,000</span>
            </div>
          </div>

          {/* OCTOPUS EDP - HIGHLIGHTED */}
          <div className="bg-white border-2 border-amber-400 rounded-[14px] p-6 shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              🪔 Official Choice
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full">
                Harsh Beniwal Collection
              </span>
              <h3 className="text-[18px] font-bold text-[#222222] mt-3 mb-2">
                Octopus 50ML Eau De Parfum
              </h3>
              <ul className="space-y-2.5 text-[13px] font-medium text-[#222222] mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-600 shrink-0" />
                  <span>25%+ Pure Imported French Oils</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-600 shrink-0" />
                  <span>12+ Hours Proven All-Day Longevity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-600 shrink-0" />
                  <span>Beast-Mode Sillage in Card Parties & Pujas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-600 shrink-0" />
                  <span>Free 7ML Paradox Tester Pack (₹399)</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-[#ebebeb] pt-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6a6a6a] line-through mr-1 block">MRP ₹2,099</span>
                <span className="text-[18px] font-bold text-[#222222]">₹1,039 (Code: DIWALI20)</span>
              </div>
              <Link
                href="/diwali-gifts"
                className="bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                Buy Now
              </Link>
            </div>
          </div>

          {/* Imported Designer Brands */}
          <div className="bg-white border border-[#ebebeb] rounded-[14px] p-6 shadow-airbnb flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase bg-[#f7f7f7] text-[#6a6a6a] px-2.5 py-1 rounded-full">
                Imported Luxury
              </span>
              <h3 className="text-[18px] font-semibold text-[#222222] mt-3 mb-2">
                Designer French Houses
              </h3>
              <ul className="space-y-2 text-[13px] text-[#6a6a6a] mb-6">
                <li>• 15% - 20% Fragrance Oils</li>
                <li>• 6 to 8 hours longevity</li>
                <li>• Massive 10x marketing retail markup</li>
                <li>• ₹15,000+ price tag prohibits daily wear</li>
              </ul>
            </div>
            <div className="border-t border-[#ebebeb] pt-3">
              <span className="text-[13px] text-[#6a6a6a]">Typical Price: ₹12,000 - ₹35,000</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Creator Note: Harsh Beniwal */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-[16px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-airbnb">
          
          <div className="lg:col-span-5 relative aspect-square bg-white rounded-[12px] overflow-hidden border border-[#dddddd] shadow-sm">
            <Image 
              src="/harsh-beniwal/octopus/perfumes/images/overlord_lifestyle.png"
              alt="Harsh Beniwal Octopus Perfume Collection for Diwali"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col items-start space-y-4">
            <div className="inline-flex items-center gap-2 bg-white border border-[#dddddd] px-3 py-1 rounded-full text-[11px] font-bold text-[#222222]">
              <span>Creator Message</span>
            </div>

            <h2 className="text-[22px] sm:text-[28px] font-bold text-[#222222] leading-tight tracking-tight">
              &quot;This Diwali, Gift Scent Memories That Truly Never Fade.&quot;
            </h2>

            <p className="text-[14px] text-[#3f3f3f] leading-relaxed">
              &quot;Every Diwali, we see the same sugary sweet boxes that get passed around from house to house and forgotten within days. I wanted to build something permanent — a fragrance that turns heads the moment you step into a Diwali gathering and lingers for 12+ hours.&quot;
            </p>

            <p className="text-[14px] text-[#3f3f3f] leading-relaxed">
              &quot;We partnered with top French master blenders with 25%+ imported perfume oils to deliver world-class sillage without the ₹15,000 retail gouging. Whether you gift <strong>Overlord</strong> to your brother or <strong>Promised</strong> to your partner, you are giving elegance and lasting confidence. Shubh Deepavali to you and your family!&quot;
            </p>

            <div className="pt-3 border-t border-[#dddddd] w-full flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-[#222222]">Harsh Beniwal</p>
                <p className="text-[12px] text-[#6a6a6a]">Creator & Co-Founder</p>
              </div>

              <Link
                href="/diwali-gifts"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Explore Diwali Hampers
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 9. Diwali Customer Reviews */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-[22px] sm:text-[26px] font-bold text-[#222222]">
            ★ 4.92 · 50,000+ Verified Diwali Customers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Vikram Singhania",
              city: "Delhi NCR",
              date: "October 2026",
              perfume: "Overlord & Promised Gift Set",
              review: "Ordered 5 hampers for my business partners as Diwali corporate gifts. The box presentation is stunning, completely crush-proof, and the Sauvage clone DNA is spot on. All my clients were blown away by the gesture!"
            },
            {
              name: "Ananya Iyer",
              city: "Mumbai",
              date: "October 2026",
              perfume: "Royal Couple Hamper (Overlord + Darling)",
              review: "Got this for my husband and myself for Diwali celebrations. Darling has the most beautiful romantic rose and vanilla trail, while Overlord lasted all through our Diwali card party until 3 AM. Best purchase this festive season!"
            },
            {
              name: "Kartik Mehta",
              city: "Bengaluru",
              date: "October 2026",
              perfume: "Emperor's Connoisseur Trio",
              review: "Applied code DIWALI20 and got an insane price. Promised smells 100% identical to Baccarat Rouge 540 with that warm saffron and cotton candy projection. Delivery took only 2 days. 10/10 recommendation!"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#ebebeb] hover:border-amber-300 rounded-[16px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900 text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#222222]">{item.name}</h4>
                    <p className="text-[12px] text-[#6a6a6a]">{item.city} · {item.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[12px] text-amber-600 font-bold mb-2">
                  <span>★★★★★</span>
                  <span className="text-[#6a6a6a] font-normal">· {item.perfume}</span>
                </div>

                <p className="text-[14px] text-[#3f3f3f] leading-relaxed">
                  &quot;{item.review}&quot;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between">
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded uppercase">Verified Buyer</span>
                <span className="text-[11px] text-[#6a6a6a]">🪔 Diwali Order</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ Accordion Section - Micro-Niche Diwali Queries */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-4xl mx-auto border-t border-[#ebebeb]">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-2">
            <span>🪔</span>
            <span>Diwali Help Center</span>
          </div>
          <h2 className="text-[22px] sm:text-[28px] font-bold text-[#222222] tracking-tight">
            Frequently Asked Questions • Diwali 2026
          </h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">
            Everything you need to know about purchasing Harsh Beniwal&apos;s Octopus Perfumes for Diwali.
          </p>
        </div>

        <div className="divide-y divide-[#ebebeb] border-y border-[#ebebeb]">
          {faqSchema.mainEntity.map((faq, idx) => (
            <details 
              key={idx} 
              className="group py-5 cursor-pointer"
            >
              <summary className="flex items-center justify-between text-[16px] font-medium text-[#222222] list-none">
                <span className="font-semibold">{faq.name}</span>
                <span className="relative flex-shrink-0 ml-4 w-7 h-7 rounded-full bg-[#f7f7f7] border border-[#ebebeb] flex items-center justify-center text-[#222222] group-hover:bg-[#ebebeb] transition-colors">
                  <Plus className="w-3.5 h-3.5 group-open:hidden" strokeWidth={2} />
                  <Minus className="w-3.5 h-3.5 hidden group-open:block" strokeWidth={2} />
                </span>
              </summary>
              <p className="mt-3 text-[14px] text-[#6a6a6a] leading-relaxed pr-8">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/pages/contact" 
            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#ff385c] hover:underline"
          >
            <MessageSquare size={15} /> Still have questions? Our festive fragrance concierge is available 24/7
          </Link>
        </div>
      </section>

      {/* 11. SEO Brand & Micro-Niche Keyword Manifesto */}
      <section className="bg-[#f7f7f7] border-t border-[#ebebeb] text-[#222222] px-6 md:px-12 py-12">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white border border-[#ebebeb] px-3 py-1 rounded-full text-[11px] font-bold text-amber-900">
            <span>🪔 Official Harsh Beniwal Diwali Fragrance Destination</span>
          </div>

          <h2 className="text-[18px] sm:text-[22px] font-bold text-[#222222]">
            Buy Octopus Perfume Online • Official Diwali 2026 Fragrance Store India
          </h2>

          <p className="text-[13px] text-[#6a6a6a] leading-relaxed">
            Welcome to the <strong>Octopus perfume official website</strong> (<strong>BuyOctopus</strong>), the exclusive destination to buy authentic <strong>Octopus perfume by Harsh Beniwal</strong> for Diwali 2026. Designed to dismantle overpriced retail markups, our collection delivers the pinnacle of olfactory craftsmanship: 100% original 50ML Eau De Parfum fragrances formulated with 25%+ pure imported French perfume oils.
          </p>

          <p className="text-[13px] text-[#6a6a6a] leading-relaxed">
            Looking for the true <strong>Octopus perfumes price</strong> and <strong>Harsh Beniwal perfume price</strong> for Diwali gifts? Every 50ML EDP bottle is available at an accessible direct-to-consumer price of ₹1,299 (MRP ₹2,099), further reduced by 20% using festive coupon code <strong>DIWALI20</strong> down to ₹1,039, complete with a complimentary 7ML Paradox tester pack (worth ₹399) and heavy crush-resistant festive packaging.
          </p>

          <p className="text-[13px] text-[#6a6a6a] leading-relaxed">
            Searching for the best <strong>Diwali gifts for boyfriend</strong>, <strong>Diwali gifts for husband</strong>, <strong>Diwali gifts for girlfriend</strong>, or <strong>corporate Diwali gift hampers</strong>? Scents like <strong>Overlord</strong> (Dior Sauvage DNA), <strong>Promised</strong> (Baccarat Rouge 540 DNA), <strong>Somersault</strong> (LV Imagination DNA), <strong>Mirage</strong> (LV Ombre Nomade DNA), and <strong>Darling</strong> (Miss Dior DNA) provide 12+ hours of beast-mode projection. Enjoy guaranteed pre-Diwali express delivery across India with 100% secure online prepaid checkout.
          </p>
        </div>
      </section>

    </div>
  );
}
