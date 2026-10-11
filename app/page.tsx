import fs from "fs";
import path from "path";
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
  Gift 
} from "lucide-react";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";

export const metadata: Metadata = {
  title: "Octopus Perfumes by Harsh Beniwal | 100% Original 50ML EDP Collection",
  description: "Experience official Octopus Perfumes by Harsh Beniwal. 9 luxury 50ML Eau De Parfums formulated with 25%+ French fragrance oil concentration, beast-mode sillage, and 12+ hour longevity. Free Pan-India express shipping. Use code OCTOPUS20 for 20% OFF.",
  keywords: [
    "harsh beniwal perfume",
    "octopus perfumes",
    "octopus perfume by harsh beniwal",
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
    "french edp perfumes online"
  ],
  alternates: {
    canonical: "https://www.octopusperfume.in",
  },
  openGraph: {
    title: "Octopus Perfumes by Harsh Beniwal | 100% Original 50ML EDP Collection",
    description: "Shop 100% original Octopus Perfumes by Harsh Beniwal. Formulated with 25%+ French fragrance oils, 12+ hour sillage, and beast-mode projection. Free Pan-India express shipping.",
    url: "https://www.octopusperfume.in",
    siteName: "Octopus Perfumes by Harsh Beniwal",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 630,
        alt: "Octopus Perfumes by Harsh Beniwal - Luxury Fragrance Line",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octopus Perfumes by Harsh Beniwal | 100% Original 50ML EDP",
    description: "Shop official Octopus Perfumes by Harsh Beniwal. 25%+ French fragrance oils, 12+ hour longevity. Use code OCTOPUS20 for 20% OFF.",
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

  // Optional secondary keepsakes
  let jewelryProducts: any[] = [];
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const allProducts = JSON.parse(fileContent);
      jewelryProducts = allProducts.filter((p: any) => {
        const typeStr = (p.product_type || "").toLowerCase();
        const vendorStr = (p.vendor || "").toLowerCase();
        return !typeStr.includes("perfume") && !vendorStr.includes("harsh beniwal");
      }).slice(0, 4);
    }
  } catch (e) {
    console.error("Error loading secondary products:", e);
  }

  // Structured Data Schema for Google Search Dominance
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Octopus Perfumes by Harsh Beniwal",
    "alternateName": ["Harsh Beniwal Perfumes", "Octopus Fragrances", "Octopus EDP"],
    "url": "https://www.octopusperfume.in",
    "logo": "https://www.octopusperfume.in/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Harsh Beniwal"
    },
    "description": "Official luxury fragrance house by Harsh Beniwal. High-concentration 50ML Eau De Parfum crafted with 25%+ imported French perfume oils."
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Octopus Perfumes Collection by Harsh Beniwal",
    "description": "Official 9 luxury 50ML Eau De Parfum fragrances curated by Harsh Beniwal.",
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
          "ratingValue": perfume.rating?.value?.toString() || "4.9",
          "reviewCount": perfume.rating?.count || 180
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
        "name": "Who created Octopus Perfumes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Octopus Perfumes is the official luxury fragrance brand co-created and curated by renowned Indian creator and actor Harsh Beniwal to deliver ultra-premium niche-quality Eau De Parfum fragrances at accessible prices."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Octopus Perfumes by Harsh Beniwal last so long?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every bottle is formulated as a high-grade Eau De Parfum (EDP) with 25%+ imported French fragrance oil concentration. This provides 12+ hours of beast-mode longevity on skin and over 24 hours on clothes, specially formulated to thrive in Indian weather."
        }
      },
      {
        "@type": "Question",
        "name": "What luxury fragrance accords are featured in the collection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The collection features 9 iconic scents: Overlord (inspired by Sauvage DNA), Promised (inspired by Baccarat Rouge 540 DNA), Somersault (inspired by LV Imagination DNA), Mirage (inspired by LV Ombre Nomade DNA), Rhapsody (inspired by Jazz Club DNA), Your Move (inspired by TF Oud Wood DNA), Outlaw (inspired by TF Ombré Leather DNA), Paradox (inspired by LV Les Sables Roses DNA), and Darling (inspired by Miss Dior DNA)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the price of Harsh Beniwal's Octopus Perfumes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each 50ML Eau De Parfum bottle is priced at an exclusive direct-to-consumer price of ₹1,299 (MRP ₹2,099). You can also apply promo code OCTOPUS20 or DIWALI20 at checkout for flat 20% OFF."
        }
      },
      {
        "@type": "Question",
        "name": "How fast is shipping across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide Free Pan-India Express Delivery within 2 to 4 business days to all serviceable pin codes. We accept 100% secure online prepaid payments including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking."
        }
      },
      {
        "@type": "Question",
        "name": "Are Octopus perfumes skin safe and IFRA certified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all Octopus Perfumes are 100% IFRA certified, cruelty-free, paraben-free, non-staining, and dermatologically safe for daily application on all skin types."
        }
      }
    ]
  };

  return (
    <div className="bg-[#FFFDF9] text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 1. Hero Section - Neubrutalism UI with Harsh Beniwal Perfume Spotlight */}
      <section className="px-4 sm:px-6 md:px-12 pt-6 pb-16 max-w-[1440px] mx-auto">
        <div className="relative bg-amber-100 border-3 border-black rounded-3xl p-6 sm:p-10 md:p-16 shadow-[8px_8px_0px_0px_#000] overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-16 -right-16 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-yellow-300/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column: Harsh Beniwal Perfume Manifesto & Headline */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Creator Collab Pill */}
              <div className="inline-flex items-center gap-2 bg-black text-amber-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#f59e0b] mb-6">
                <span>👑</span>
                <span>HARSH BENIWAL OFFICIAL FRAGRANCE LINE</span>
                <span>✨</span>
              </div>

              {/* Main H1 Title - Highly Optimized for Google Search */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-black leading-[1.08] mb-6">
                OCTOPUS PERFUMES BY HARSH BENIWAL
              </h1>

              {/* Subheadline with Key Differentiators */}
              <p className="text-base sm:text-lg font-semibold text-stone-800 leading-relaxed mb-6 max-w-xl">
                Uncompromising luxury bottled in <strong className="text-black">50ML Eau De Parfum</strong>. Formulated with <strong className="text-black">25%+ imported French perfume essence</strong>, delivering beast-mode projection and guaranteed 12+ hour all-day longevity.
              </p>

              {/* Promo Coupon Chip */}
              <div className="inline-flex items-center gap-3 bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] mb-8">
                <span className="text-xs font-black uppercase text-stone-700">Special Promo:</span>
                <span className="font-mono text-sm font-black bg-amber-300 text-black px-2.5 py-0.5 rounded border border-black">
                  OCTOPUS20
                </span>
                <span className="text-xs font-bold text-amber-900">✦ Flat 20% OFF Sitewide</span>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/harsh-beniwal/octopus/perfumes" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-amber-300 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_0px_#f59e0b] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#f59e0b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>SHOP ALL 9 PERFUMES</span>
                  <ArrowRight size={16} />
                </Link>

                <Link 
                  href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`} 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-amber-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>OVERLORD (BESTSELLER)</span>
                  <Flame size={16} className="text-orange-500" />
                </Link>
              </div>

              {/* Social Proof Rating */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-black text-stone-900 uppercase tracking-wide">
                  4.9 / 5.0 Rating (50,000+ Bottles Delivered Across India)
                </span>
              </div>

            </div>

            {/* Right Column: Hero Visual Card with Overlord Box & Bottle */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white border-3 border-black rounded-2xl p-5 shadow-[8px_8px_0px_0px_#000]">
                
                {/* Floating Sticker Top */}
                <div className="absolute -top-4 -right-3 z-20 bg-yellow-300 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] rotate-3">
                  🔥 25%+ FRENCH OILS
                </div>

                {/* Inspired By Ribbon */}
                <div className="absolute -top-4 -left-3 z-20 bg-black text-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#f59e0b] -rotate-3">
                  SAUVAGE DNA
                </div>

                {/* Presentation Box Image Container */}
                <div className="relative aspect-square w-full bg-amber-50 border-2 border-black rounded-xl overflow-hidden mb-4">
                  <Image 
                    src={heroPerfume.images?.[0]?.src || "/harsh-beniwal/octopus/perfumes/images/overlord_box.png"}
                    alt="Overlord 50ML EDP by Harsh Beniwal"
                    fill
                    priority
                    unoptimized
                    className="object-contain p-4 hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Meta & Price */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-black px-2 py-0.5 rounded border border-black">
                      50ML EAU DE PARFUM
                    </span>
                    <h2 className="font-serif text-2xl font-black text-black mt-1">
                      {heroPerfume.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 line-through font-bold block">₹{heroPerfume.compareAtPrice || 2099}</span>
                    <span className="text-xl font-black text-black">₹{heroPerfume.price || 1299}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 font-semibold mb-4 leading-relaxed line-clamp-2">
                  {heroPerfume.tagline}
                </p>

                <Link
                  href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`}
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 text-black py-3 rounded-lg font-black uppercase tracking-wider text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>EXPERIENCE OVERLORD EDP</span>
                  <ArrowRight size={14} />
                </Link>

              </div>
            </div>

          </div>

          {/* 4 Performance Guarantees Strip */}
          <div className="mt-12 pt-8 border-t-2 border-black grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Droplets size={22} className="text-black stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase">25%+ French Oils</p>
                <p className="text-[10px] text-stone-700 font-bold">Concentrated EDP Blend</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={22} className="text-black stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase">12+ Hours Longevity</p>
                <p className="text-[10px] text-stone-700 font-bold">Tested in Indian Weather</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={22} className="text-black stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase">Free Pan-India Express</p>
                <p className="text-[10px] text-stone-700 font-bold">Delivered in 2-4 Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-black stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase">100% Skin Safe</p>
                <p className="text-[10px] text-stone-700 font-bold">IFRA Certified & Cruelty Free</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Flagship Collection: The 9 Harsh Beniwal Perfumes */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-300 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-3">
              <span>🔥 100% ORIGINAL LUXURY COLLECTION</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-black">
              The 9 Iconic Eau De Parfums
            </h2>
            <p className="text-sm font-semibold text-stone-700 mt-2 max-w-xl">
              Each bottle is crafted in luxury rigid monocarton packaging with a magnetic-feel finish, 25%+ high fragrance essence oils, and notes inspired by the greatest perfumes ever created.
            </p>
          </div>

          <Link
            href="/harsh-beniwal/octopus/perfumes"
            className="flex items-center gap-2 bg-black text-amber-300 px-6 py-3 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#f59e0b] hover:bg-stone-900 transition-all w-fit cursor-pointer"
          >
            <span>View All Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Perfume Grid - 9 Neubrutalist Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {perfumes.map((perfume: any) => {
            const mainImg = perfume.images?.[0]?.src || "/logo.png";

            return (
              <div 
                key={perfume.handle}
                className="group bg-white border-3 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all flex flex-col"
              >
                {/* Image Header Container with Neubrutalist Frame */}
                <div className="relative aspect-square bg-[#FAF7F2] border-b-2 border-black overflow-hidden p-6 flex items-center justify-center">
                  
                  {/* Inspired By Tag */}
                  {perfume.inspiredBy && (
                    <div className="absolute top-3 left-3 z-10 bg-amber-200 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_0px_#000]">
                      Inspired by {perfume.inspiredBy}
                    </div>
                  )}

                  {/* Volume Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-white text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                    50ML EDP
                  </div>

                  {/* Presentation Box Image */}
                  <Image 
                    src={mainImg}
                    alt={`${perfume.title} 50ML EDP by Harsh Beniwal`}
                    fill
                    unoptimized
                    className="object-contain p-6 transition-all duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 bg-white">
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                      {perfume.gender || "Unisex"} • 25%+ French Oils
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                      <Star size={12} fill="currentColor" />
                      <span>{perfume.rating?.value || "4.9"}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-black text-black mb-1 group-hover:text-amber-600 transition-colors">
                    {perfume.title}
                  </h3>

                  <p className="text-xs font-semibold text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                    {perfume.tagline || perfume.descriptionText}
                  </p>

                  {/* Pricing & CTA */}
                  <div className="mt-auto pt-3 border-t-2 border-black flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-stone-500 line-through font-bold block">
                        ₹{perfume.compareAtPrice || 2099}
                      </span>
                      <span className="text-xl font-black text-black">
                        ₹{perfume.price || 1299}
                      </span>
                    </div>

                    <Link
                      href={`/harsh-beniwal/octopus/perfumes/${perfume.handle}`}
                      className="flex items-center gap-1.5 bg-black text-amber-300 px-4 py-2.5 rounded-lg font-black uppercase tracking-wider text-xs border-2 border-black shadow-[2px_2px_0px_0px_#f59e0b] hover:bg-stone-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      <span>Buy EDP</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. The Scent Finder: Choosing Your Scent by Occasion */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-300 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-3">
            <span>🧭 FRAGRANCE SELECTOR GUIDE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-black">
            Find Your Signature Scent
          </h2>
          <p className="text-sm font-semibold text-stone-700 mt-2 max-w-xl mx-auto">
            Each of Harsh Beniwal&apos;s 9 fragrances is curated for specific moments, vibes, and expressions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Daily Office & Fresh Casual",
              scents: "Overlord & Somersault",
              notes: "Bergamot, Ambroxan, Black Tea, Crisp Citrus",
              tag: "Fresh All-Day ✦",
              bg: "bg-blue-100",
              link: "/products/overlord"
            },
            {
              title: "Date Nights & Intimate Moments",
              scents: "Promised & Darling",
              notes: "Warm Amber, Saffron, Damask Rose, Vanilla",
              tag: "Seductive Magnet 💎",
              bg: "bg-rose-100",
              link: "/products/promised"
            },
            {
              title: "Clubbing, Parties & Evenings",
              scents: "Rhapsody & Outlaw",
              notes: "Smoky Rum, Cuban Tobacco, Black Leather, Cardamom",
              tag: "Beast Mode Party 🍸",
              bg: "bg-amber-100",
              link: "/products/rhapsody"
            },
            {
              title: "Royal Occasions & Power Meetings",
              scents: "Mirage, Paradox & Your Move",
              notes: "Precious Agarwood, Saffron, Bulgarian Rose, Oud",
              tag: "Regal Authority 👑",
              bg: "bg-emerald-100",
              link: "/products/mirage"
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className={`${cat.bg} border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#000] transition-all flex flex-col justify-between group`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white text-black px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_0px_#000] inline-block mb-4">
                  {cat.tag}
                </span>
                <h3 className="font-serif text-xl font-black text-black mb-2 group-hover:text-amber-800 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs font-black text-stone-900 mb-2">
                  Featuring: <span className="underline">{cat.scents}</span>
                </p>
                <p className="text-[11px] font-semibold text-stone-700 leading-relaxed mb-6">
                  {cat.notes}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black group-hover:gap-3 transition-all">
                <span>Explore Scents</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Why Octopus EDP Dominates (Performance Benchmark) */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="bg-[#FAF7F2] border-3 border-black rounded-3xl p-8 md:p-14 shadow-[8px_8px_0px_0px_#000]">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-black text-amber-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-black mb-3">
              <span>⚡ PERFORMANCE BENCHMARK</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-black">
              Why Harsh Beniwal&apos;s EDP Beats Typical Market Fragrances
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-stone-700 mt-2">
              Most commercial perfumes in India are diluted Eau De Toilette (EDT) or deodorants with low oil concentration. Here is how Octopus EDP compares:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Standard Retail EDT */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between opacity-80">
              <div>
                <span className="text-[10px] font-black uppercase bg-stone-200 text-stone-800 px-2 py-0.5 rounded border border-black">
                  Typical Market EDT
                </span>
                <h3 className="font-serif text-xl font-black text-stone-900 mt-3 mb-2">
                  Mass Retail Perfumes
                </h3>
                <ul className="space-y-2 text-xs font-medium text-stone-600 mb-6">
                  <li>• 8% - 12% Diluted Oil Concentration</li>
                  <li>• Lasts only 2 to 4 hours</li>
                  <li>• High alcohol projection fade</li>
                  <li>• Requires multiple re-sprays daily</li>
                </ul>
              </div>
              <div className="border-t border-stone-200 pt-3">
                <span className="text-xs font-bold text-stone-500">Retail Price: ₹1,500 - ₹3,000</span>
              </div>
            </div>

            {/* OCTOPUS EDP - HIGHLIGHTED */}
            <div className="bg-amber-200 border-3 border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between relative transform md:-translate-y-2">
              <div className="absolute -top-3.5 right-6 bg-black text-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded border border-black">
                👑 BEAST MODE VALUE
              </div>
              <div>
                <span className="text-[10px] font-black uppercase bg-white text-black px-2 py-0.5 rounded border border-black">
                  OCTOPUS by Harsh Beniwal
                </span>
                <h3 className="font-serif text-2xl font-black text-black mt-3 mb-2">
                  50ML Eau De Parfum (EDP)
                </h3>
                <ul className="space-y-2.5 text-xs font-black text-black mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 25%+ High French Essence Oil</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 12+ Hours Proven All-Day Longevity</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Beast Sillage & Heavy Compliments</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Deluxe Rigid Monocarton Gift Box</li>
                </ul>
              </div>
              <div className="border-t-2 border-black pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-600 line-through font-bold block">MRP ₹2,099</span>
                  <span className="text-2xl font-black text-black">₹1,299 Only</span>
                </div>
                <Link
                  href="/harsh-beniwal/octopus/perfumes"
                  className="bg-black text-amber-300 px-4 py-2 rounded-lg font-black uppercase text-xs border border-black shadow-[2px_2px_0px_0px_#f59e0b] hover:bg-stone-900 transition-all"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Imported Designer Brands */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between opacity-80">
              <div>
                <span className="text-[10px] font-black uppercase bg-stone-200 text-stone-800 px-2 py-0.5 rounded border border-black">
                  Imported Designers
                </span>
                <h3 className="font-serif text-xl font-black text-stone-900 mt-3 mb-2">
                  French Luxury Houses
                </h3>
                <ul className="space-y-2 text-xs font-medium text-stone-600 mb-6">
                  <li>• 15% - 20% Fragrance Oils</li>
                  <li>• 6 to 8 hours longevity</li>
                  <li>• Massive brand marketing markup</li>
                  <li>• Prohibitive pricing for daily wear</li>
                </ul>
              </div>
              <div className="border-t border-stone-200 pt-3">
                <span className="text-xs font-bold text-stone-500">Retail Price: ₹12,000 - ₹35,000</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Creator Story: Harsh Beniwal's Vision */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="bg-stone-950 text-white border-3 border-black rounded-3xl p-8 md:p-14 shadow-[8px_8px_0px_0px_#000] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 relative aspect-square bg-stone-900 border-2 border-stone-700 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#f59e0b]">
            <Image 
              src="/harsh-beniwal/octopus/perfumes/images/overlord_lifestyle.png"
              alt="Harsh Beniwal Octopus Perfume Collection"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <span>👑 A MESSAGE FROM HARSH BENIWAL</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
              &quot;I Wanted To Create Scents That Turn Heads The Moment You Enter The Room.&quot;
            </h2>

            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              &quot;For years, I looked for perfumes in India that actually lasted throughout the day without fading after 2 hours. The international niche brands charged ₹15,000 to ₹30,000, which made no sense. So we partnered with top French master blenders to craft <strong className="text-amber-300">Octopus Perfumes</strong> with 25%+ imported perfume oils, formulated specifically to project in our climate.&quot;
            </p>

            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              &quot;Whether you spray <strong className="text-amber-300">Overlord</strong> for daily versatility or <strong className="text-amber-300">Promised</strong> for an unforgettable date night, each scent represents confidence, charisma, and individuality. I wear these every single day.&quot;
            </p>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <div>
                <p className="font-serif text-lg font-black text-amber-300">Harsh Beniwal</p>
                <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">Creator & Actor</p>
              </div>

              <Link
                href="/harsh-beniwal/octopus/perfumes"
                className="inline-flex items-center gap-2 bg-amber-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs border border-black shadow-[3px_3px_0px_0px_#000] hover:bg-amber-300 transition-all cursor-pointer"
              >
                <span>Experience The Scents</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Customer Reviews & High Praise */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-300 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-3">
            <span>⭐ VERIFIED BUYER FEEDBACK</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-black">
            Loved By Over 50,000+ Fragrance Enthusiasts
          </h2>
          <p className="text-sm font-semibold text-stone-700 mt-2 max-w-xl mx-auto">
            Real experiences from customers across Delhi, Mumbai, Bengaluru, and all over India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Aman Sharma, Delhi",
              perfume: "Overlord (50ML EDP)",
              review: "Overlord smells identical to Sauvage but lasts even longer! I applied it at 9 AM before office, and even at 9 PM my friends were asking what fragrance I was wearing. Beast mode performance!",
              rating: 5
            },
            {
              name: "Rohan Varma, Mumbai",
              perfume: "Promised & Rhapsody",
              review: "The presentation box is pure luxury. Promised has that sweet cotton candy and saffron airiness of BR540 that gets insane compliments. Highly recommended!",
              rating: 5
            },
            {
              name: "Pooja Malhotra, Bengaluru",
              perfume: "Darling & Somersault",
              review: "Ordered Darling for myself and Somersault for my partner. Both smell heavenly, completely non-irritating on the skin, and delivery took just 2 days. Harsh really delivered quality!",
              rating: 5
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border-3 border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_#000] flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-stone-800 leading-relaxed mb-6 italic">
                  &quot;{item.review}&quot;
                </p>
              </div>

              <div className="border-t-2 border-black/10 pt-3">
                <p className="text-xs font-black text-black uppercase tracking-wider">{item.name}</p>
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">{item.perfume}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Secondary Festive Keepsakes & Jewelry Collection */}
      {jewelryProducts.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-200 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-3">
                <span>✨ BESPOKE GIFT KEEPSAKES</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-black">
                Personalized Keepsakes To Pair With Scents
              </h2>
              <p className="text-sm font-semibold text-stone-700 mt-2 max-w-xl">
                Create the ultimate gift hamper with 22K gold-plated anti-tarnish custom name jewelry.
              </p>
            </div>

            <Link
              href="/collections/all"
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-stone-50 transition-all w-fit cursor-pointer"
            >
              <span>Explore All Keepsakes</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {jewelryProducts.map((product: any) => (
              <Link 
                href={`/products/${product.handle}`} 
                key={product.id}
                className="group bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-[#FAF7F2] border-b-2 border-black overflow-hidden p-4">
                  {product.images && product.images.length > 0 ? (
                    <Image 
                      src={product.images[0].local_src || product.images[0].localPath || product.images[0].src}
                      alt={product.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">No Image</div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 bg-white">
                  <h4 className="font-serif text-sm font-black text-black mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                    22K Gold Plated • Anti-Tarnish
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-black text-black">
                      ₹{product.variants?.[0]?.price || "499"}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-amber-100 text-black px-2 py-0.5 rounded border border-black">
                      Customize
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. FAQ Accordion Section */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-4xl mx-auto border-t-2 border-black">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-600 mt-2">
            Everything you need to know about Harsh Beniwal&apos;s Octopus Perfumes
          </p>
        </div>

        <div className="space-y-4">
          {faqSchema.mainEntity.map((faq, idx) => (
            <details 
              key={idx} 
              className="group bg-white border-2 border-black rounded-xl p-5 shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              <summary className="flex items-center justify-between text-base font-serif font-black text-black list-none">
                <span>{faq.name}</span>
                <span className="relative flex-shrink-0 ml-2 w-5 h-5 flex items-center justify-center">
                  <Plus className="w-5 h-5 group-open:hidden" strokeWidth={3} />
                  <Minus className="w-5 h-5 hidden group-open:block" strokeWidth={3} />
                </span>
              </summary>
              <p className="mt-4 text-xs font-semibold text-stone-700 leading-relaxed border-t border-stone-200 pt-3">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link 
            href="/pages/contact" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black hover:text-amber-600 transition-colors"
          >
            <MessageSquare size={16} /> Have questions? Our fragrance concierge is available 24/7
          </Link>
        </div>
      </section>

      {/* 9. SEO Brand Manifesto Block (Targeting Google Rankings) */}
      <section className="bg-stone-950 text-white px-6 md:px-12 py-16 border-t-3 border-black text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span>👑 OFFICIAL HARSH BENIWAL OCTOPUS PERFUMES HUB</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-black text-white">
            India&apos;s Premier House of Long-Lasting French Luxury Eau De Parfum
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
            Welcome to the official home of <strong>Octopus Perfumes by Harsh Beniwal</strong>. Designed to dismantle overpriced designer retail markups, our collection delivers the pinnacle of olfactory craftsmanship: authentic 50ML Eau De Parfum fragrances formulated with 25%+ pure imported French perfume oils.
          </p>

          <p className="text-xs text-stone-400 leading-relaxed">
            From the electric bergamot-ambroxan trail of <strong>Overlord</strong> to the warm saffron brilliance of <strong>Promised</strong>, the refreshing black tea notes of <strong>Somersault</strong>, and the smoky majesty of <strong>Mirage</strong>, Octopus scents provide an extraordinary 12+ hour sillage. Enjoy 100% secure online prepaid checkout, free express shipping across all Indian pin codes, and exclusive savings with coupon code <strong>OCTOPUS20</strong>.
          </p>
        </div>
      </section>

    </div>
  );
}
