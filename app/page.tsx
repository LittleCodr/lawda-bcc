
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
    <div className="bg-white text-[#222222] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 1. Airbnb Category Strip */}
      <section className="border-b border-[#ebebeb] bg-white sticky top-20 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {[
              { label: "All 9 EDPs", active: true, tag: null },
              { label: "Fresh & Citrus", active: false, tag: null },
              { label: "Woody & Oud", active: false, tag: null },
              { label: "Sweet & Amber", active: false, tag: null },
              { label: "Date Night", active: false, tag: null },
              { label: "Party & Club", active: false, tag: null },
              { label: "Complimentary Tester", active: false, tag: "NEW" },
            ].map((cat, i) => (
              <Link
                key={i}
                href="/harsh-beniwal/octopus/perfumes"
                className={`relative px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  cat.active
                    ? "bg-[#222222] text-white shadow-sm"
                    : "bg-[#f7f7f7] text-[#222222] hover:bg-[#ebebeb]"
                }`}
              >
                <span>{cat.label}</span>
                {cat.tag && (
                  <span className="bg-[#ff385c] text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                    {cat.tag}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0 border-l border-[#ebebeb] pl-4">
            <span className="text-[12px] text-[#6a6a6a] font-medium">Coupon:</span>
            <span className="font-mono text-[11px] font-bold bg-[#f7f7f7] text-[#222222] border border-[#dddddd] px-2.5 py-1 rounded-md">
              OCTOPUS20
            </span>
            <span className="text-[12px] font-semibold text-[#ff385c]">Flat 20% OFF</span>
          </div>
        </div>
      </section>

      {/* 2. Hero Section - Airbnb Photography-Led Marketplace Hero */}
      <section className="px-4 sm:px-6 md:px-12 pt-10 pb-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Airbnb Modest Display Typography & Brand Introduction */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Handcrafted Creator Pill */}
            <div className="inline-flex items-center gap-2 bg-[#f7f7f7] border border-[#ebebeb] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#222222] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff385c]"></span>
              <span className="tracking-wide">Harsh Beniwal Official Fragrance House</span>
            </div>

            {/* Airbnb Hero H1 - Modest Weight & Photography-Led Balance (28px - 34px / 700) */}
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#222222] leading-[1.18] tracking-[-0.5px] mb-4">
              Octopus Perfumes by Harsh Beniwal
            </h1>

            <p className="text-[16px] text-[#3f3f3f] leading-[1.5] mb-6 max-w-xl">
              Nine luxury <strong>50ML Eau De Parfums</strong> formulated with <strong>25%+ imported French perfume essence</strong>. Engineered for 12+ hour beast-mode sillage in Indian weather. Includes a complimentary 7ML Paradox discovery tester pack with every order.
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <CheckCircle2 size={14} className="text-[#ff385c]" />
                25%+ French Oils
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Clock size={14} className="text-[#222222]" />
                12H+ Longevity
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Truck size={14} className="text-[#222222]" />
                Free Express Pan-India
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#222222] bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-lg font-medium">
                <Gift size={14} className="text-[#ff385c]" />
                Free 7ML Tester (₹399)
              </span>
            </div>

            {/* Airbnb Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link 
                href="/harsh-beniwal/octopus/perfumes" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e00b41] text-white px-7 py-3.5 rounded-lg font-medium text-[15px] shadow-none hover:shadow-airbnb transition-all cursor-pointer"
              >
                <span>Reserve 50ML EDP</span>
                <ArrowRight size={16} />
              </Link>

              <Link 
                href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#222222] border border-[#222222] hover:bg-[#f7f7f7] px-6 py-3.5 rounded-lg font-medium text-[15px] transition-all cursor-pointer"
              >
                <span>Overlord (Sauvage DNA)</span>
              </Link>
            </div>

            {/* Social Proof Rating */}
            <div className="mt-6 flex items-center gap-2 text-sm text-[#222222]">
              <span className="font-bold">★ 4.92</span>
              <span className="text-[#6a6a6a]">·</span>
              <span className="text-[#6a6a6a]">50,000+ orders across India</span>
              <span className="text-[#6a6a6a]">·</span>
              <span className="text-xs font-semibold text-[#222222] underline cursor-pointer">Official Store</span>
            </div>

          </div>

          {/* Right Column: Airbnb Photo-First Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border border-[#dddddd] rounded-[14px] p-4 shadow-airbnb hover:shadow-airbnb-hover transition-all">
              
              {/* Photo Plate with 14px Corner Clipping */}
              <div className="relative aspect-square w-full bg-[#f7f7f7] rounded-[10px] overflow-hidden mb-4">
                
                {/* Floating Guest Favorite Badge */}
                <div className="guest-favorite-badge">
                  Guest favorite
                </div>

                {/* Wishlist Heart */}
                <button
                  type="button"
                  aria-label="Save to wishlist"
                  className="heart-save-btn"
                >
                  <svg viewBox="0 0 32 32" className="w-4 h-4 fill-black/40 stroke-white stroke-[2]">
                    <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-3.1 0-5.4 1.5-7 3.5C14.4 5.5 12.1 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
                  </svg>
                </button>

                <Image 
                  src={heroPerfume.images?.[0]?.src || "/harsh-beniwal/octopus/perfumes/images/overlord_box.png"}
                  alt="Overlord 50ML EDP by Harsh Beniwal"
                  fill
                  priority
                  unoptimized
                  className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Clean Airbnb 4-line Meta Block */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#222222]">
                    {heroPerfume.title} 50ML EDP
                  </h2>
                  <p className="text-[14px] text-[#6a6a6a]">Calabrian Bergamot, Ambroxan, Sichuan Pepper</p>
                  <p className="text-[13px] text-[#6a6a6a] mt-0.5">Free 7ML Paradox discovery tester included</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="flex items-center justify-end gap-1 text-[14px] text-[#222222] font-semibold">
                    <span>★</span>
                    <span>4.94</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[13px] text-[#6a6a6a] line-through mr-1.5">₹2,099</span>
                    <span className="text-[15px] font-semibold text-[#222222]">₹{heroPerfume.price || 1299}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e00b41] text-white py-3 rounded-lg font-medium text-[14px] transition-colors"
              >
                <span>Reserve Now</span>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* 3. Airbnb Listing Trust Signature: 64px Rating Display Card flanked by Laurel Wreaths */}
      <section className="px-4 sm:px-6 md:px-12 py-10 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-[14px] p-8 md:p-12 text-center max-w-4xl mx-auto shadow-airbnb">
          
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#222222] bg-white border border-[#dddddd] px-3.5 py-1 rounded-full mb-4">
            <span>Peak Olfactory Performance</span>
          </div>

          {/* 64px Rating Display with Laurel Wreaths */}
          <div className="flex items-center justify-center gap-4 my-2">
            {/* Left Laurel Wreath SVG */}
            <svg className="w-8 h-12 text-[#222222]" viewBox="0 0 24 36" fill="currentColor">
              <path d="M12 2C9.5 5 7 9 7 14c0 6.5 4.5 12 11 14-2.5-4-3-8.5-2-13 1-4.5 3-7.5 5-9.5-3 .5-6.5 1.5-9 4.5z"/>
            </svg>
            
            <span className="text-[52px] sm:text-[64px] font-bold text-[#222222] tracking-[-1.5px] leading-none">
              4.92
            </span>

            {/* Right Laurel Wreath SVG */}
            <svg className="w-8 h-12 text-[#222222] transform -scale-x-100" viewBox="0 0 24 36" fill="currentColor">
              <path d="M12 2C9.5 5 7 9 7 14c0 6.5 4.5 12 11 14-2.5-4-3-8.5-2-13 1-4.5 3-7.5 5-9.5-3 .5-6.5 1.5-9 4.5z"/>
            </svg>
          </div>

          <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#222222] mt-1 mb-1">
            Guest favorite
          </h3>
          <p className="text-[14px] text-[#6a6a6a] max-w-lg mx-auto">
            One of the most loved fragrance collections co-created by Harsh Beniwal, based on ratings, reviews, and verified Pan-India re-orders.
          </p>

          {/* Stat Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#dddddd] text-left">
            <div>
              <p className="text-[12px] text-[#6a6a6a] font-medium">Oil Concentration</p>
              <p className="text-[16px] font-bold text-[#222222] mt-0.5">25%+ French Oils</p>
              <p className="text-[12px] text-[#6a6a6a]">Pure imported essence</p>
            </div>
            <div>
              <p className="text-[12px] text-[#6a6a6a] font-medium">Longevity</p>
              <p className="text-[16px] font-bold text-[#222222] mt-0.5">12+ Hours Tested</p>
              <p className="text-[12px] text-[#6a6a6a]">Indian climate proof</p>
            </div>
            <div>
              <p className="text-[12px] text-[#6a6a6a] font-medium">Pan-India Express</p>
              <p className="text-[16px] font-bold text-[#222222] mt-0.5">Free 2-4 Days</p>
              <p className="text-[12px] text-[#6a6a6a]">BlueDart & Delhivery</p>
            </div>
            <div>
              <p className="text-[12px] text-[#6a6a6a] font-medium">Complimentary Gift</p>
              <p className="text-[16px] font-bold text-[#222222] mt-0.5">7ML Paradox (₹399)</p>
              <p className="text-[12px] text-[#6a6a6a]">Free in every order</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Flagship Marketplace Grid: The 9 Harsh Beniwal Perfumes */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-semibold text-[#222222] tracking-[-0.3px]">
              Explore the 9 Iconic Fragrances
            </h2>
            <p className="text-[14px] text-[#6a6a6a] mt-1">
              Aspect-ratio photo cards with 25%+ French oil concentration and magnetic sillage.
            </p>
          </div>

          <Link
            href="/harsh-beniwal/octopus/perfumes"
            className="text-[14px] font-semibold text-[#222222] hover:text-[#ff385c] underline underline-offset-4 transition-colors"
          >
            View all 9 perfumes &rarr;
          </Link>
        </div>

        {/* Dense Marketplace Grid: 16px Gutters, Photo-First Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {perfumes.map((perfume: any) => {
            const mainImg = perfume.images?.[0]?.src || "/logo.png";

            return (
              <div 
                key={perfume.handle}
                className="group bg-white border border-[#ebebeb] hover:border-[#dddddd] rounded-[14px] p-3.5 shadow-airbnb hover:shadow-airbnb-hover transition-all flex flex-col"
              >
                {/* Photo Plate with 1:1 Aspect Ratio and 14px Corner Clipping */}
                <div className="relative aspect-square bg-[#f7f7f7] rounded-[10px] overflow-hidden mb-3">
                  
                  {/* Floating Guest Favorite Badge */}
                  <div className="guest-favorite-badge">
                    Guest favorite
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    aria-label="Save to wishlist"
                    className="heart-save-btn"
                  >
                    <svg viewBox="0 0 32 32" className="w-4 h-4 fill-black/40 stroke-white stroke-[2]">
                      <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-3.1 0-5.4 1.5-7 3.5C14.4 5.5 12.1 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
                    </svg>
                  </button>

                  <Image 
                    src={mainImg}
                    alt={`${perfume.title} 50ML EDP by Harsh Beniwal`}
                    fill
                    unoptimized
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Meta Content - Clean 4 lines beneath image */}
                <div className="flex flex-col flex-1">
                  
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-semibold text-[#222222] truncate">
                      {perfume.title} 50ML EDP
                    </h3>
                    <div className="flex items-center gap-1 text-[13px] font-semibold text-[#222222] shrink-0">
                      <span>★</span>
                      <span>{perfume.rating?.value || "4.92"}</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#6a6a6a] truncate mt-0.5">
                    {perfume.inspiredBy ? `Inspired by ${perfume.inspiredBy}` : "25%+ French Essence Oils"}
                  </p>

                  <p className="text-[13px] text-[#6a6a6a] truncate">
                    {perfume.gender || "Unisex"} · 12H+ Longevity · Free 7ML Tester
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#ebebeb] flex items-center justify-between">
                    <div>
                      <span className="text-[12px] text-[#6a6a6a] line-through mr-1.5">
                        ₹{perfume.compareAtPrice || 2099}
                      </span>
                      <span className="text-[15px] font-semibold text-[#222222]">
                        ₹{perfume.price || 1299}
                      </span>
                      <span className="text-[12px] text-[#6a6a6a] font-normal"> / bottle</span>
                    </div>

                    <Link
                      href={`/harsh-beniwal/octopus/perfumes/${perfume.handle}`}
                      className="px-3.5 py-1.5 bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Reserve
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Scent Finder: Choosing Your Scent by Occasion (Airbnb Editorial 4-Card Grid) */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="mb-8">
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-[#222222] tracking-[-0.3px]">
            Curated by Occasion
          </h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">
            Pick your signature projection based on your daily lifestyle and schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Daily Office & Fresh Wear",
              scents: "Overlord & Somersault",
              notes: "Calabrian Bergamot, Ambroxan, Black Tea, Crisp Citrus",
              tag: "Fresh All-Day",
              link: "/products/overlord",
              price: "From ₹1,299"
            },
            {
              title: "Date Nights & Intimate Moments",
              scents: "Promised & Darling",
              notes: "Warm Amberwood, Saffron, Centifolia Rose, Madagascar Vanilla",
              tag: "Magnetic Romance",
              link: "/products/promised",
              price: "From ₹1,299"
            },
            {
              title: "Parties, Clubbing & Evenings",
              scents: "Rhapsody & Outlaw",
              notes: "Cuban Tobacco, Smoky Rum, Black Leather, Cardamom",
              tag: "Beast Mode",
              link: "/products/rhapsody",
              price: "From ₹1,299"
            },
            {
              title: "Royal Occasions & High Status",
              scents: "Mirage, Paradox & Your Move",
              notes: "Precious Agarwood, Cambodian Oud, Bulgarian Rose",
              tag: "Regal Authority",
              link: "/products/mirage",
              price: "From ₹1,299"
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="bg-white border border-[#ebebeb] hover:border-[#dddddd] rounded-[14px] p-5 shadow-airbnb hover:shadow-airbnb-hover transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff385c] bg-[#fff0f3] px-2.5 py-1 rounded-full inline-block mb-3">
                  {cat.tag}
                </span>
                <h3 className="text-[16px] font-semibold text-[#222222] mb-1 group-hover:text-[#ff385c] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[13px] font-medium text-[#222222] mb-2">
                  Featuring: <span className="underline decoration-[#dddddd]">{cat.scents}</span>
                </p>
                <p className="text-[12px] text-[#6a6a6a] leading-relaxed mb-4">
                  {cat.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ebebeb] flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#222222]">{cat.price}</span>
                <span className="text-[13px] font-medium text-[#ff385c] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Why Octopus EDP Dominates (Performance Benchmark) */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="mb-8">
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-[#222222] tracking-[-0.3px]">
            Performance Comparison
          </h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">
            See how Harsh Beniwal&apos;s 25%+ French oil concentration compares to retail department store fragrances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Standard Retail EDT */}
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
                <li>• Requires 4-5 re-sprays throughout the day</li>
              </ul>
            </div>
            <div className="border-t border-[#ebebeb] pt-3">
              <span className="text-[13px] text-[#6a6a6a]">Typical Price: ₹1,500 - ₹3,000</span>
            </div>
          </div>

          {/* OCTOPUS EDP - HIGHLIGHTED WITH RAUSCH */}
          <div className="bg-white border-2 border-[#ff385c] rounded-[14px] p-6 shadow-airbnb-hover flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-[#ff385c] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Official Choice
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase bg-[#fff0f3] text-[#ff385c] px-2.5 py-1 rounded-full">
                Harsh Beniwal Collection
              </span>
              <h3 className="text-[18px] font-bold text-[#222222] mt-3 mb-2">
                Octopus 50ML Eau De Parfum
              </h3>
              <ul className="space-y-2.5 text-[13px] font-medium text-[#222222] mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#ff385c] shrink-0" />
                  <span>25%+ Pure Imported French Oils</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#ff385c] shrink-0" />
                  <span>12+ Hours Proven All-Day Longevity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#ff385c] shrink-0" />
                  <span>Beast-Mode Sillage in Indian Weather</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#ff385c] shrink-0" />
                  <span>Free 7ML Paradox Tester Pack (₹399)</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-[#ebebeb] pt-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6a6a6a] line-through mr-1 block">MRP ₹2,099</span>
                <span className="text-[18px] font-bold text-[#222222]">₹1,299 Only</span>
              </div>
              <Link
                href="/harsh-beniwal/octopus/perfumes"
                className="bg-[#ff385c] hover:bg-[#e00b41] text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                Reserve Now
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
                <li>• Prohibitive for everyday casual wear</li>
              </ul>
            </div>
            <div className="border-t border-[#ebebeb] pt-3">
              <span className="text-[13px] text-[#6a6a6a]">Typical Price: ₹12,000 - ₹35,000</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Creator Story: Harsh Beniwal's Vision (Clean Editorial Airbnb Band) */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-[14px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-airbnb">
          
          <div className="lg:col-span-5 relative aspect-square bg-white rounded-[10px] overflow-hidden border border-[#dddddd] shadow-sm">
            <Image 
              src="/harsh-beniwal/octopus/perfumes/images/overlord_lifestyle.png"
              alt="Harsh Beniwal Octopus Perfume Collection"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col items-start space-y-4">
            <div className="inline-flex items-center gap-2 bg-white border border-[#dddddd] px-3 py-1 rounded-full text-[11px] font-semibold text-[#222222]">
              <span>Creator Note</span>
            </div>

            <h2 className="text-[22px] sm:text-[28px] font-bold text-[#222222] leading-tight tracking-[-0.4px]">
              &quot;I Wanted To Create Scents That Turn Heads The Moment You Enter The Room.&quot;
            </h2>

            <p className="text-[14px] text-[#3f3f3f] leading-relaxed">
              &quot;For years, I looked for perfumes in India that actually lasted throughout the day without fading after 2 hours. The international niche brands charged ₹15,000 to ₹30,000, which made no sense. So we partnered with top French master blenders to craft <strong>Octopus Perfumes</strong> with 25%+ imported perfume oils, formulated specifically to project in our climate.&quot;
            </p>

            <p className="text-[14px] text-[#3f3f3f] leading-relaxed">
              &quot;Whether you spray <strong>Overlord</strong> for daily versatility or <strong>Promised</strong> for an unforgettable date night, each scent represents confidence, charisma, and individuality. I wear these every single day.&quot;
            </p>

            <div className="pt-3 border-t border-[#dddddd] w-full flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-[#222222]">Harsh Beniwal</p>
                <p className="text-[12px] text-[#6a6a6a]">Creator & Co-Founder</p>
              </div>

              <Link
                href="/harsh-beniwal/octopus/perfumes"
                className="bg-[#ff385c] hover:bg-[#e00b41] text-white px-5 py-2.5 rounded-lg text-xs font-medium transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Customer Reviews: Airbnb 3-Column Reviews Card Grid */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto border-t border-[#ebebeb]">
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-[22px] sm:text-[26px] font-semibold text-[#222222]">
            ★ 4.92 · 50,000+ Verified Customer Reviews
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Aman Sharma",
              city: "Delhi",
              date: "October 2026",
              perfume: "Overlord (50ML EDP)",
              review: "Overlord smells identical to Sauvage but lasts even longer! I applied it at 9 AM before office, and even at 9 PM my colleagues were asking what fragrance I was wearing. Beast mode projection."
            },
            {
              name: "Rohan Varma",
              city: "Mumbai",
              date: "October 2026",
              perfume: "Promised & Rhapsody",
              review: "The presentation packaging is pure luxury. Promised has that sweet cotton candy and saffron airiness of BR540 that gets insane compliments. Highly recommended!"
            },
            {
              name: "Pooja Malhotra",
              city: "Bengaluru",
              date: "October 2026",
              perfume: "Darling & Somersault",
              review: "Ordered Darling for myself and Somersault for my partner. Both smell heavenly, completely non-irritating on the skin, and delivery took just 2 days. Harsh really delivered quality!"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#ebebeb] rounded-[14px] p-6 shadow-airbnb flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#f7f7f7] border border-[#ebebeb] flex items-center justify-center font-bold text-[#222222] text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#222222]">{item.name}</h4>
                    <p className="text-[12px] text-[#6a6a6a]">{item.city} · {item.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[12px] text-[#222222] font-semibold mb-2">
                  <span>★★★★★</span>
                  <span className="text-[#6a6a6a] font-normal">· {item.perfume}</span>
                </div>

                <p className="text-[14px] text-[#3f3f3f] leading-relaxed">
                  &quot;{item.review}&quot;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebebeb]">
                <span className="text-[11px] font-semibold text-[#6a6a6a] uppercase">Verified Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ Accordion Section (Airbnb Clean Dividers) */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-4xl mx-auto border-t border-[#ebebeb]">
        <div className="mb-8">
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-[#222222] tracking-[-0.3px]">
            Frequently Asked Questions
          </h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">
            Everything you need to know about purchasing Harsh Beniwal&apos;s Octopus Perfumes online.
          </p>
        </div>

        <div className="divide-y divide-[#ebebeb] border-y border-[#ebebeb]">
          {faqSchema.mainEntity.map((faq, idx) => (
            <details 
              key={idx} 
              className="group py-5 cursor-pointer"
            >
              <summary className="flex items-center justify-between text-[16px] font-medium text-[#222222] list-none">
                <span>{faq.name}</span>
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
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#ff385c] hover:underline"
          >
            <MessageSquare size={15} /> Still have questions? Our fragrance concierge is available 24/7
          </Link>
        </div>
      </section>

      {/* 10. SEO Brand Manifesto Block (Airbnb Editorial Clean Surface) */}
      <section className="bg-[#f7f7f7] border-t border-[#ebebeb] text-[#222222] px-6 md:px-12 py-12">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white border border-[#ebebeb] px-3 py-1 rounded-full text-[11px] font-semibold text-[#222222]">
            <span>Official Harsh Beniwal Fragrance Destination</span>
          </div>

          <h2 className="text-[18px] sm:text-[22px] font-semibold text-[#222222]">
            Buy Octopus Perfume Online • Official Octopus Perfume Website India
          </h2>

          <p className="text-[13px] text-[#6a6a6a] leading-relaxed">
            Welcome to the <strong>Octopus perfume official website</strong> (<strong>BuyOctopus</strong>), the exclusive home to buy authentic <strong>Octopus perfume by Harsh Beniwal</strong>. Designed to dismantle overpriced designer retail markups, our collection delivers the pinnacle of olfactory craftsmanship: 100% original 50ML Eau De Parfum fragrances formulated with 25%+ pure imported French perfume oils.
          </p>

          <p className="text-[13px] text-[#6a6a6a] leading-relaxed">
            Looking for the true <strong>Octopus perfumes price</strong> and <strong>Harsh Beniwal perfume price</strong>? Every 50ML EDP bottle is available at an accessible direct-to-consumer price of ₹1,299 (MRP ₹2,099), complete with an extra 20% discount using code <strong>OCTOPUS20</strong> and a complimentary 7ML Paradox tester pack.
          </p>

          <p className="text-[13px] text-[#6a6a6a] leading-relaxed">
            Rated 4.9/5 across thousands of verified <strong>Octopus perfume reviews</strong>, scents like <strong>Overlord</strong>, <strong>Promised</strong>, <strong>Somersault</strong>, and <strong>Mirage</strong> deliver 12+ hours of magnetic sillage. Experience <strong>Octopus perfume India</strong> with 100% secure online prepaid checkout and free express delivery to all serviceable pin codes nationwide.
          </p>
        </div>
      </section>

    </div>
  );
}
