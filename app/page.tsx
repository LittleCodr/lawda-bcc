
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



  // Structured Data Schema for Google Search Dominance
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
      "Octopus Perfume India"
    ],
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
        "name": "Where can I buy Octopus perfume online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can buy Octopus perfume directly on the Octopus perfume official website (https://www.octopusperfume.in). Ordering from BuyOctopus / the official store guarantees 100% authentic 50ML EDP bottles crafted by Harsh Beniwal, a free 7ML Paradox tester pack, and free express delivery across India."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Octopus perfumes price and Harsh Beniwal perfume price in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The official Octopus perfumes price is ₹1,299 for each 50ML Eau De Parfum (discounted from MRP ₹2,099). Harsh Beniwal perfume price is further reduced by applying coupon codes OCTOPUS20 or DIWALI20 at checkout for an additional 20% OFF, bringing luxury French fragrances under ₹1,040."
        }
      },
      {
        "@type": "Question",
        "name": "What do customer reviews say about Octopus perfume by Harsh Beniwal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Verified Octopus perfume reviews give the collection an outstanding 4.9 out of 5 stars based on 50,000+ customers. Reviewers consistently praise its 12+ hours beast-mode longevity in Indian weather, 25%+ imported French oil concentration, and luxury gift presentation."
        }
      },
      {
        "@type": "Question",
        "name": "Who created Octopus Perfumes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Octopus Perfumes is the official luxury fragrance house co-created and curated by renowned Indian creator and actor Harsh Beniwal to deliver ultra-premium niche-quality Eau De Parfum fragrances at accessible prices."
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
        "name": "How fast is Octopus perfume India shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Octopus perfume India provides Free Express Delivery within 2 to 4 business days to all serviceable Indian pin codes. We accept 100% secure online prepaid payments including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking."
        }
      },
      {
        "@type": "Question",
        "name": "Is BuyOctopus the official website for Harsh Beniwal perfume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BuyOctopus (https://www.octopusperfume.in) is the verified official website to purchase 100% original Octopus perfumes co-created by Harsh Beniwal."
        }
      }
    ]
  };

  return (
    <div className="text-stone-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 1. Hero Section - Luxury Glassmorphic Spotlight */}
      <section className="px-4 sm:px-6 md:px-12 pt-6 pb-16 max-w-[1440px] mx-auto">
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/90 via-amber-50/70 to-yellow-50/40 border border-white/90 rounded-[2.5rem] p-6 sm:p-10 md:p-16 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.18)] overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-24 -right-24 w-[32rem] h-[32rem] bg-gradient-to-br from-amber-300/30 via-yellow-300/20 to-transparent rounded-full blur-3xl pointer-events-none animate-soft-pulse" />
          <div className="absolute -bottom-24 -left-24 w-[32rem] h-[32rem] bg-gradient-to-tr from-rose-300/20 via-amber-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column: Harsh Beniwal Perfume Manifesto & Headline */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Creator Collab Pill */}
              <div className="inline-flex items-center gap-2 backdrop-blur-md bg-stone-950/90 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md border border-white/10 mb-6">
                <span>👑</span>
                <span>HARSH BENIWAL OFFICIAL FRAGRANCE LINE</span>
                <span className="animate-soft-pulse">✨</span>
              </div>

              {/* Main H1 Title - Highly Optimized for Google Search */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-stone-950 leading-[1.08] mb-6 tracking-tight">
                OCTOPUS PERFUMES <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">BY HARSH BENIWAL</span>
              </h1>

              {/* Subheadline with Key Differentiators */}
              <p className="text-base sm:text-lg font-medium text-stone-700 leading-relaxed mb-6 max-w-xl">
                Uncompromising luxury bottled in <strong className="text-stone-900 font-bold">50ML Eau De Parfum</strong>. Formulated with <strong className="text-stone-900 font-bold">25%+ imported French perfume essence</strong>, delivering beast-mode projection and guaranteed 12+ hour all-day longevity.
              </p>

              {/* Promo Coupon Chip */}
              <div className="inline-flex items-center gap-3 backdrop-blur-md bg-white/80 border border-white/90 rounded-2xl p-3 shadow-sm mb-8">
                <span className="text-xs font-bold uppercase text-stone-600">Special Promo:</span>
                <span className="font-mono text-sm font-black bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 px-3 py-0.5 rounded-lg shadow-sm border border-amber-300/60">
                  OCTOPUS20
                </span>
                <span className="text-xs font-bold text-amber-900">✦ Flat 20% OFF Sitewide</span>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/harsh-beniwal/octopus/perfumes" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 px-8 py-4 rounded-2xl font-extrabold uppercase tracking-wider text-xs shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-amber-300/50"
                >
                  <span>SHOP ALL 9 PERFUMES</span>
                  <ArrowRight size={16} />
                </Link>

                <Link 
                  href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`} 
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 backdrop-blur-md bg-white/85 text-stone-900 px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs border border-white/90 shadow-md hover:bg-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>OVERLORD (BESTSELLER)</span>
                  <Flame size={16} className="text-orange-500 fill-orange-400" />
                </Link>
              </div>

              {/* Social Proof Rating */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                  4.9 / 5.0 Rating (50,000+ Bottles Delivered Across India)
                </span>
              </div>

            </div>

            {/* Right Column: Hero Visual Card with Overlord Box & Bottle */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md backdrop-blur-xl bg-white/80 border border-white/90 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.2)] transition-all duration-500">
                
                {/* Floating Sticker Top */}
                <div className="absolute -top-3.5 -right-2 z-20 backdrop-blur-md bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md border border-amber-300">
                  🔥 25%+ FRENCH OILS
                </div>

                {/* Inspired By Ribbon */}
                <div className="absolute -top-3.5 -left-2 z-20 backdrop-blur-md bg-stone-950/90 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md border border-white/10">
                  SAUVAGE DNA
                </div>

                {/* Presentation Box Image Container */}
                <div className="relative aspect-square w-full bg-gradient-to-b from-stone-50 to-amber-50/40 border border-stone-200/50 rounded-2xl overflow-hidden mb-4">
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
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                      50ML EAU DE PARFUM
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                      {heroPerfume.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through font-semibold block">₹{heroPerfume.compareAtPrice || 2099}</span>
                    <span className="text-xl font-extrabold text-stone-950">₹{heroPerfume.price || 1299}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-medium mb-4 leading-relaxed line-clamp-2">
                  {heroPerfume.tagline}
                </p>

                <Link
                  href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-amber-300 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs border border-stone-800 shadow-md hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>EXPERIENCE OVERLORD EDP</span>
                  <ArrowRight size={14} />
                </Link>

              </div>
            </div>

          </div>

          {/* 4 Performance Guarantees Strip */}
          <div className="mt-12 pt-8 border-t border-amber-300/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Droplets size={22} className="text-amber-600 stroke-[2]" />
              <div>
                <p className="text-xs font-bold uppercase text-stone-900">25%+ French Oils</p>
                <p className="text-[10px] text-stone-600 font-medium">Concentrated EDP Blend</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={22} className="text-amber-600 stroke-[2]" />
              <div>
                <p className="text-xs font-bold uppercase text-stone-900">12+ Hours Longevity</p>
                <p className="text-[10px] text-stone-600 font-medium">Tested in Indian Weather</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={22} className="text-amber-600 stroke-[2]" />
              <div>
                <p className="text-xs font-bold uppercase text-stone-900">Free Pan-India Express</p>
                <p className="text-[10px] text-stone-600 font-medium">Delivered in 2-4 Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-emerald-700 stroke-[2]" />
              <div>
                <p className="text-xs font-bold uppercase text-stone-900">100% Skin Safe</p>
                <p className="text-[10px] text-stone-600 font-medium">IFRA Certified & Cruelty Free</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Flagship Collection: The 9 Harsh Beniwal Perfumes */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-stone-200/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 backdrop-blur-md bg-amber-100/90 text-amber-900 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-300/60 shadow-sm mb-3">
              <span>🔥 100% ORIGINAL LUXURY COLLECTION</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-stone-950 tracking-tight">
              The 9 Iconic Eau De Parfums
            </h2>
            <p className="text-sm font-medium text-stone-600 mt-2 max-w-xl">
              Each bottle is crafted in luxury rigid monocarton packaging with a magnetic-feel finish, 25%+ high fragrance essence oils, and notes inspired by the greatest perfumes ever created.
            </p>
          </div>

          <Link
            href="/harsh-beniwal/octopus/perfumes"
            className="flex items-center gap-2 bg-gradient-to-r from-stone-950 to-stone-900 text-amber-300 px-6 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-xl hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-fit cursor-pointer border border-stone-800"
          >
            <span>View All Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Perfume Grid - 9 Glassmorphic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {perfumes.map((perfume: any) => {
            const mainImg = perfume.images?.[0]?.src || "/logo.png";

            return (
              <div 
                key={perfume.handle}
                className="group backdrop-blur-xl bg-white/80 border border-white/80 rounded-3xl overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-10px_rgba(245,158,11,0.2)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col"
              >
                {/* Image Header Container with Frosted Glass Frame */}
                <div className="relative aspect-square bg-gradient-to-b from-stone-50 to-stone-100/70 border-b border-stone-100 overflow-hidden p-6 flex items-center justify-center">
                  
                  {/* Inspired By Tag */}
                  {perfume.inspiredBy && (
                    <div className="absolute top-3 left-3 z-10 backdrop-blur-md bg-amber-50/90 text-amber-900 text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-200/80 shadow-sm">
                      Inspired by {perfume.inspiredBy}
                    </div>
                  )}

                  {/* Volume Badge */}
                  <div className="absolute top-3 right-3 z-10 backdrop-blur-md bg-white/90 text-stone-800 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/80 shadow-sm">
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
                <div className="p-6 flex flex-col flex-1 bg-white/60">
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {perfume.gender || "Unisex"} • 25%+ French Oils
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star size={12} fill="currentColor" />
                      <span>{perfume.rating?.value || "4.9"}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1 group-hover:text-amber-800 transition-colors">
                    {perfume.title}
                  </h3>

                  <p className="text-xs font-medium text-stone-500 line-clamp-2 mb-4 leading-relaxed">
                    {perfume.tagline || perfume.descriptionText}
                  </p>

                  {/* Pricing & CTA */}
                  <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-stone-400 line-through font-semibold block">
                        ₹{perfume.compareAtPrice || 2099}
                      </span>
                      <span className="text-xl font-extrabold text-stone-950">
                        ₹{perfume.price || 1299}
                      </span>
                    </div>

                    <Link
                      href={`/harsh-beniwal/octopus/perfumes/${perfume.handle}`}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-amber-300 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs border border-stone-800 shadow-md hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
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
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-amber-900/10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 backdrop-blur-md text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-400/30 shadow-sm mb-3">
            <span>🧭 FRAGRANCE SELECTOR GUIDE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Find Your Signature Scent
          </h2>
          <p className="text-sm font-medium text-stone-600 mt-2 max-w-xl mx-auto">
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
              bg: "bg-gradient-to-br from-sky-500/10 via-white/80 to-sky-100/30 border-sky-200/60 hover:shadow-sky-500/15",
              accent: "text-sky-700",
              link: "/products/overlord"
            },
            {
              title: "Date Nights & Intimate Moments",
              scents: "Promised & Darling",
              notes: "Warm Amber, Saffron, Damask Rose, Vanilla",
              tag: "Seductive Magnet 💎",
              bg: "bg-gradient-to-br from-rose-500/10 via-white/80 to-rose-100/30 border-rose-200/60 hover:shadow-rose-500/15",
              accent: "text-rose-700",
              link: "/products/promised"
            },
            {
              title: "Clubbing, Parties & Evenings",
              scents: "Rhapsody & Outlaw",
              notes: "Smoky Rum, Cuban Tobacco, Black Leather, Cardamom",
              tag: "Beast Mode Party 🍸",
              bg: "bg-gradient-to-br from-amber-500/10 via-white/80 to-amber-100/30 border-amber-200/60 hover:shadow-amber-500/15",
              accent: "text-amber-800",
              link: "/products/rhapsody"
            },
            {
              title: "Royal Occasions & Power Meetings",
              scents: "Mirage, Paradox & Your Move",
              notes: "Precious Agarwood, Saffron, Bulgarian Rose, Oud",
              tag: "Regal Authority 👑",
              bg: "bg-gradient-to-br from-emerald-500/10 via-white/80 to-emerald-100/30 border-emerald-200/60 hover:shadow-emerald-500/15",
              accent: "text-emerald-800",
              link: "/products/mirage"
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className={`backdrop-blur-xl ${cat.bg} border rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/90 text-stone-900 px-3 py-1 rounded-full border border-white/80 shadow-sm inline-block mb-4">
                  {cat.tag}
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-950 mb-2 group-hover:text-amber-800 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs font-semibold text-stone-800 mb-2">
                  Featuring: <span className="font-bold underline decoration-amber-400/60">{cat.scents}</span>
                </p>
                <p className="text-[11px] font-medium text-stone-600 leading-relaxed mb-6">
                  {cat.notes}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-amber-700 group-hover:gap-3 transition-all">
                <span>Explore Scents</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Why Octopus EDP Dominates (Performance Benchmark) */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-amber-900/10">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/90 via-stone-50/80 to-amber-50/40 border border-white/90 rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-stone-900 text-amber-300 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm mb-3">
              <span>⚡ PERFORMANCE BENCHMARK</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Why Harsh Beniwal&apos;s EDP Beats Typical Market Fragrances
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600 mt-2">
              Most commercial perfumes in India are diluted Eau De Toilette (EDT) or deodorants with low oil concentration. Here is how Octopus EDP compares:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Standard Retail EDT */}
            <div className="backdrop-blur-xl bg-white/75 border border-white/80 rounded-3xl p-7 shadow-sm flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
              <div>
                <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200">
                  Typical Market EDT
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-3 mb-2">
                  Mass Retail Perfumes
                </h3>
                <ul className="space-y-2.5 text-xs font-medium text-stone-600 mb-6">
                  <li>• 8% - 12% Diluted Oil Concentration</li>
                  <li>• Lasts only 2 to 4 hours</li>
                  <li>• High alcohol projection fade</li>
                  <li>• Requires multiple re-sprays daily</li>
                </ul>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <span className="text-xs font-semibold text-stone-500">Retail Price: ₹1,500 - ₹3,000</span>
              </div>
            </div>

            {/* OCTOPUS EDP - HIGHLIGHTED */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-amber-400/25 via-amber-300/30 to-yellow-400/20 border-2 border-amber-400/60 rounded-3xl p-7 sm:p-8 shadow-[0_20px_45px_rgba(245,158,11,0.2)] flex flex-col justify-between relative transform md:-translate-y-2 ring-1 ring-amber-400/30">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg shadow-amber-500/30">
                👑 BEAST MODE VALUE
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase backdrop-blur-md bg-white/90 text-stone-900 px-3 py-1 rounded-full border border-white/80 shadow-sm">
                  OCTOPUS by Harsh Beniwal
                </span>
                <h3 className="font-serif text-2xl font-black text-stone-950 mt-3 mb-2">
                  50ML Eau De Parfum (EDP)
                </h3>
                <ul className="space-y-3 text-xs font-bold text-stone-900 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-700" /> 25%+ High French Essence Oil</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-700" /> 12+ Hours Proven All-Day Longevity</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-700" /> Beast Sillage & Heavy Compliments</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-700" /> Deluxe Rigid Monocarton Gift Box</li>
                </ul>
              </div>
              <div className="border-t border-amber-400/30 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-600 line-through font-semibold block">MRP ₹2,099</span>
                  <span className="text-2xl font-black text-stone-950">₹1,299 Only</span>
                </div>
                <Link
                  href="/harsh-beniwal/octopus/perfumes"
                  className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-amber-300 px-5 py-2.5 rounded-xl font-bold uppercase text-xs shadow-lg shadow-black/20 hover:scale-105 transition-all"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Imported Designer Brands */}
            <div className="backdrop-blur-xl bg-white/75 border border-white/80 rounded-3xl p-7 shadow-sm flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
              <div>
                <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200">
                  Imported Designers
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-3 mb-2">
                  French Luxury Houses
                </h3>
                <ul className="space-y-2.5 text-xs font-medium text-stone-600 mb-6">
                  <li>• 15% - 20% Fragrance Oils</li>
                  <li>• 6 to 8 hours longevity</li>
                  <li>• Massive brand marketing markup</li>
                  <li>• Prohibitive pricing for daily wear</li>
                </ul>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <span className="text-xs font-semibold text-stone-500">Retail Price: ₹12,000 - ₹35,000</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Creator Story: Harsh Beniwal's Vision */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-amber-900/10">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white border border-stone-800/80 rounded-[2.5rem] p-8 md:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.35)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
          
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="lg:col-span-5 relative aspect-square bg-stone-900/70 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <Image 
              src="/harsh-beniwal/octopus/perfumes/images/overlord_lifestyle.png"
              alt="Harsh Beniwal Octopus Perfume Collection"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
              <span>👑 A MESSAGE FROM HARSH BENIWAL</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
              &quot;I Wanted To Create Scents That Turn Heads The Moment You Enter The Room.&quot;
            </h2>

            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              &quot;For years, I looked for perfumes in India that actually lasted throughout the day without fading after 2 hours. The international niche brands charged ₹15,000 to ₹30,000, which made no sense. So we partnered with top French master blenders to craft <strong className="text-amber-300">Octopus Perfumes</strong> with 25%+ imported perfume oils, formulated specifically to project in our climate.&quot;
            </p>

            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              &quot;Whether you spray <strong className="text-amber-300">Overlord</strong> for daily versatility or <strong className="text-amber-300">Promised</strong> for an unforgettable date night, each scent represents confidence, charisma, and individuality. I wear these every single day.&quot;
            </p>

            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
              <div>
                <p className="font-serif text-lg font-bold text-amber-300">Harsh Beniwal</p>
                <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Creator & Actor</p>
              </div>

              <Link
                href="/harsh-beniwal/octopus/perfumes"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 px-6 py-3.5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Experience The Scents</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Customer Reviews & High Praise */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-amber-900/10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 backdrop-blur-md text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-400/30 shadow-sm mb-3">
            <span>⭐ VERIFIED BUYER FEEDBACK • OCTOPUS PERFUME REVIEWS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Loved By Over 50,000+ Fragrance Enthusiasts
          </h2>
          <p className="text-sm font-medium text-stone-600 mt-2 max-w-xl mx-auto">
            Read real Octopus perfume reviews from verified customers across Delhi, Mumbai, Bengaluru, and all over India.
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
              className="backdrop-blur-xl bg-white/80 border border-white/80 rounded-3xl p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-500 mb-3 drop-shadow-sm">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs font-medium text-stone-700 leading-relaxed mb-6 italic">
                  &quot;{item.review}&quot;
                </p>
              </div>

              <div className="border-t border-stone-100 pt-3">
                <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">{item.name}</p>
                <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest">{item.perfume}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Why Harsh Beniwal's Octopus Perfumes Outperform Section */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t border-amber-900/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 backdrop-blur-md text-amber-800 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/30 shadow-sm mb-3">
              <span>👑 HARSH BENIWAL FORMULATION STANDARDS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
              Why 25%+ French Oils Outperform Ordinary Perfumes
            </h2>
            <p className="text-sm font-medium text-stone-600 mt-2 max-w-2xl">
              Commercial perfumes dilute cheap scents in alcohol that evaporate in 2 hours. Every 50ML Octopus Eau De Parfum is handcrafted with imported French essences engineered for all-day sillage in the Indian climate.
            </p>
          </div>

          <Link
            href="/harsh-beniwal/octopus/perfumes"
            className="flex items-center gap-2 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-amber-300 px-6 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-black/20 hover:scale-105 transition-all w-fit cursor-pointer border border-stone-800"
          >
            <span>Explore All 9 EDPs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="backdrop-blur-xl bg-white/80 border border-white/80 rounded-3xl p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl border border-amber-400/20 backdrop-blur-md flex items-center justify-center text-2xl mb-4 shadow-sm">
                ⚗️
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">25%+ French Fragrance Oils</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium mb-4">
                Imported directly from Grasse, France. The ultra-high oil concentration means zero harsh chemical stinging and a rich, multifaceted drydown that evolves throughout your day.
              </p>
            </div>
            <div className="backdrop-blur-md bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50 text-[10px] font-bold text-amber-900 uppercase tracking-wider">
              vs. 8-12% oils in ordinary department store EDTs
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/80 border border-white/80 rounded-3xl p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 backdrop-blur-md flex items-center justify-center text-2xl mb-4 shadow-sm">
                ⏱️
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">12H+ Beast-Mode Projection</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium mb-4">
                Specifically formulated to thrive in Indian heat, humidity, and active days. Spray twice on collar and wrists; the magnetic scent trail stays on your garments until washed.
              </p>
            </div>
            <div className="backdrop-blur-md bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/50 text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
              Lab-tested 12h fabric & 8h skin projection
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/80 border border-white/80 rounded-3xl p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl border border-rose-400/20 backdrop-blur-md flex items-center justify-center text-2xl mb-4 shadow-sm">
                🎁
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Free 7ML Paradox Tester Pack</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium mb-4">
                Every bottle includes a complimentary 7ML Paradox EDP mini bottle (worth ₹399). Pocket-sized for travel, clubbing, and on-the-go touchups with zero extra charge.
              </p>
            </div>
            <div className="backdrop-blur-md bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/50 text-[10px] font-bold text-rose-900 uppercase tracking-wider">
              Automatically included with every order
            </div>
          </div>
        </div>

        {/* Harsh's Personal Bestseller Trio */}
        <div className="backdrop-blur-2xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white rounded-[2.5rem] p-6 md:p-10 border border-stone-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/30">
              HARSH BENIWAL&apos;S SIGNATURE PICKS
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-black mt-3 mb-2 tracking-tight">
              The 3 Bestsellers You Need To Experience
            </h3>
            <p className="text-xs text-stone-400">
              Whether you want fresh daytime confidence, mysterious evening romance, or high-status luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <div className="backdrop-blur-xl bg-white/[0.04] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 hover:bg-white/[0.07] transition-all flex flex-col group">
              <div className="relative aspect-square w-full mb-4 bg-stone-950/80 rounded-xl overflow-hidden p-4 border border-white/5 group-hover:scale-105 transition-transform duration-500">
                <Image src="/harsh-beniwal/octopus/perfumes/images/overlord_box.png" alt="Overlord EDP" fill className="object-contain p-2" />
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Overlord</h4>
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-2">Dior Sauvage DNA • Fresh & Bold</p>
              <p className="text-xs text-stone-300 mb-4 flex-1">Crisp Calabrian bergamot, Sichuan pepper, and magnetic ambroxan. The ultimate daily compliments puller.</p>
              <Link href="/products/overlord" className="w-full text-center py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black uppercase text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] transition-all">
                Order Overlord (₹1,299)
              </Link>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.06] rounded-2xl p-5 border border-amber-400/40 shadow-xl shadow-amber-500/10 flex flex-col relative group">
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow-md">
                Most Viral 🔥
              </div>
              <div className="relative aspect-square w-full mb-4 bg-stone-950/80 rounded-xl overflow-hidden p-4 border border-white/5 group-hover:scale-105 transition-transform duration-500">
                <Image src="/harsh-beniwal/octopus/perfumes/images/paradox_box.png" alt="Paradox EDP" fill className="object-contain p-2" />
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Paradox</h4>
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-2">LV Les Sables Roses DNA • Amber Oud</p>
              <p className="text-xs text-stone-300 mb-4 flex-1">Opulent Centifolia rose, smoky oud wood, and warm amber. Seductive, dark, and intoxicating.</p>
              <Link href="/products/paradox" className="w-full text-center py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black uppercase text-xs rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all">
                Order Paradox (₹1,299)
              </Link>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.04] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 hover:bg-white/[0.07] transition-all flex flex-col group">
              <div className="relative aspect-square w-full mb-4 bg-stone-950/80 rounded-xl overflow-hidden p-4 border border-white/5 group-hover:scale-105 transition-transform duration-500">
                <Image src="/harsh-beniwal/octopus/perfumes/images/promised_box.png" alt="Promised EDP" fill className="object-contain p-2" />
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Promised</h4>
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-2">Baccarat Rouge 540 DNA • Sweet Luxury</p>
              <p className="text-xs text-stone-300 mb-4 flex-1">Golden saffron, Egyptian jasmine, and warm amberwood. Smells like pure wealth and elegance.</p>
              <Link href="/products/promised" className="w-full text-center py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black uppercase text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] transition-all">
                Order Promised (₹1,299)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion Section */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-4xl mx-auto border-t border-amber-900/10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mt-2">
            Everything you need to know about Harsh Beniwal&apos;s Octopus Perfumes
          </p>
        </div>

        <div className="space-y-4">
          {faqSchema.mainEntity.map((faq, idx) => (
            <details 
              key={idx} 
              className="group backdrop-blur-xl bg-white/80 border border-white/80 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] transition-all cursor-pointer"
            >
              <summary className="flex items-center justify-between text-base font-serif font-bold text-stone-900 list-none">
                <span>{faq.name}</span>
                <span className="relative flex-shrink-0 ml-2 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-700">
                  <Plus className="w-4 h-4 group-open:hidden" strokeWidth={2.5} />
                  <Minus className="w-4 h-4 hidden group-open:block" strokeWidth={2.5} />
                </span>
              </summary>
              <p className="mt-4 text-xs font-medium text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link 
            href="/pages/contact" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-600 transition-colors"
          >
            <MessageSquare size={16} /> Have questions? Our fragrance concierge is available 24/7
          </Link>
        </div>
      </section>

      {/* 9. SEO Brand Manifesto Block (Targeting Google Rankings) */}
      <section className="bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white px-6 md:px-12 py-16 border-t border-stone-800/80 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
            <span>👑 OFFICIAL HARSH BENIWAL OCTOPUS PERFUMES HUB</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">
            Buy Octopus Perfume Online • Official Octopus Perfume Website India
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            Welcome to the <strong>Octopus perfume official website</strong> (<strong>BuyOctopus</strong>), the exclusive home to buy authentic <strong>Octopus perfume by Harsh Beniwal</strong>. Designed to dismantle overpriced designer retail markups, our collection delivers the pinnacle of olfactory craftsmanship: 100% original 50ML Eau De Parfum fragrances formulated with 25%+ pure imported French perfume oils.
          </p>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            Looking for the true <strong>Octopus perfumes price</strong> and <strong>Harsh Beniwal perfume price</strong>? Every 50ML EDP bottle is available at an accessible direct-to-consumer price of ₹1,299 (MRP ₹2,099), complete with an extra 20% discount using code <strong>OCTOPUS20</strong> and a complimentary 7ML Paradox tester pack.
          </p>

          <p className="text-xs text-stone-400 leading-relaxed">
            Rated 4.9/5 across thousands of verified <strong>Octopus perfume reviews</strong>, scents like <strong>Overlord</strong>, <strong>Promised</strong>, <strong>Somersault</strong>, and <strong>Mirage</strong> deliver 12+ hours of magnetic sillage. Experience <strong>Octopus perfume India</strong> with 100% secure online prepaid checkout and free express delivery to all serviceable pin codes nationwide.
          </p>
        </div>
      </section>

    </div>
  );
}
