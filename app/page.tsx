import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { 
  Gift, 
  ShieldCheck, 
  Truck, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Gem, 
  Plus, 
  Minus, 
  MessageSquare, 
  CheckCircle2, 
  Flame, 
  Clock 
} from "lucide-react";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";

export const metadata: Metadata = {
  title: "Octopus | Luxury Perfumes by Harsh Beniwal & Diwali Festive Gifting (2026)",
  description: "Experience 100% original 50ML EDP perfumes by Harsh Beniwal with 25%+ French essence oil, and bespoke 22K gold-plated keepsakes. Free express delivery across India. Use code DIWALI20 for 20% OFF.",
  keywords: [
    "harsh beniwal perfume",
    "octopus perfume",
    "diwali gift hampers",
    "diwali perfumes",
    "50ml edp perfume",
    "overlord perfume",
    "personalized jewelry india",
    "custom name necklace",
    "gifts for him",
    "gifts for her"
  ],
  alternates: {
    canonical: "https://www.octopusperfume.in",
  },
  openGraph: {
    title: "Octopus | Luxury Perfumes by Harsh Beniwal & Diwali Festive Gifting",
    description: "Shop original 50ML EDP perfumes by Harsh Beniwal and bespoke personalized jewelry in signature gift boxes with fast Pan-India delivery.",
    url: "https://www.octopusperfume.in",
    siteName: "Octopus Everlasting Gifts",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 630,
        alt: "Octopus Luxury Perfumes by Harsh Beniwal",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octopus | Luxury Perfumes by Harsh Beniwal & Diwali Festive Gifting",
    description: "Shop original 50ML EDP perfumes by Harsh Beniwal and personalized keepsakes with code DIWALI20 for 20% OFF.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
};

export default async function Home() {
  let jewelryProducts: any[] = [];
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const allProducts = JSON.parse(fileContent);
      // Filter out perfumes to get jewelry and personalized gifts
      jewelryProducts = allProducts.filter((p: any) => {
        const typeStr = (p.product_type || "").toLowerCase();
        const vendorStr = (p.vendor || "").toLowerCase();
        return !typeStr.includes("perfume") && !vendorStr.includes("harsh beniwal");
      }).slice(0, 8);
    }
  } catch (e) {
    console.error("Error loading products:", e);
  }

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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Octopus",
    "url": "https://www.octopusperfume.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.octopusperfume.in/collections/all?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes Octopus perfumes by Harsh Beniwal special?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every perfume is formulated in collaboration with Harsh Beniwal as an Eau De Parfum (EDP) with 25%+ imported French fragrance oil concentration. They deliver 12+ hours longevity and projection."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Diwali festive discount code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use code DIWALI20 at checkout to receive flat 20% OFF on all orders above ₹499 with free express shipping across India."
        }
      },
      {
        "@type": "Question",
        "name": "How fast is delivery across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery typically takes 2-4 business days across India. All prepaid orders ship free, and Cash on Delivery is available."
        }
      },
      {
        "@type": "Question",
        "name": "Are the jewelry pieces anti-tarnish and waterproof?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our personalized jewelry pieces are crafted from high-grade stainless steel with 22K gold plating that is completely anti-tarnish, waterproof, and hypoallergenic."
        }
      },
      {
        "@type": "Question",
        "name": "Is deluxe gift packaging included for Diwali?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, every product comes nestled in our signature luxury presentation box with festive touches, ready for Diwali gifting."
        }
      }
    ]
  };

  return (
    <div className="bg-[#FFFDF9] text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* 1. Hero Section - Neubrutalism UI with Festive Diwali Glow */}
      <section className="px-4 sm:px-6 md:px-12 pt-6 pb-16 max-w-[1440px] mx-auto">
        <div className="relative bg-amber-100 border-3 border-black rounded-3xl p-6 sm:p-10 md:p-16 shadow-[8px_8px_0px_0px_#000] overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute -top-12 -right-12 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-yellow-300/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Diwali Festive Pill */}
              <div className="inline-flex items-center gap-2 bg-black text-amber-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#f59e0b] mb-6">
                <span>🪔</span>
                <span>DIWALI FESTIVE CELEBRATION 2026</span>
                <span>✨</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-black leading-[1.1] mb-6">
                THE SIGNATURE ESSENCE OF LUXURY
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg font-semibold text-stone-800 leading-relaxed mb-6 max-w-xl">
                Experience original <strong className="text-black">50ML Eau De Parfum</strong> fragrances by <strong className="text-black">Harsh Beniwal</strong> crafted with 25%+ French fragrance oils, alongside bespoke 22K gold-plated keepsakes.
              </p>

              {/* Promo Coupon Chip */}
              <div className="inline-flex items-center gap-3 bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] mb-8">
                <span className="text-xs font-black uppercase text-stone-700">Diwali Offer:</span>
                <span className="font-mono text-sm font-black bg-amber-300 text-black px-2 py-0.5 rounded border border-black">
                  DIWALI20
                </span>
                <span className="text-xs font-bold text-amber-900">✦ Flat 20% OFF At Checkout</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/harsh-beniwal/octopus/perfumes" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-amber-300 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_0px_#f59e0b] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#f59e0b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>EXPLORE ALL 9 PERFUMES</span>
                  <span>🪔</span>
                </Link>

                <Link 
                  href="/collections/all" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-amber-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>DIWALI GIFT SETS</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-black text-stone-900 uppercase tracking-wide">
                  4.9 / 5.0 (50,000+ Happy Customers Across India)
                </span>
              </div>

            </div>

            {/* Right Column: Hero Visual Card (Featuring Box & Bottle) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white border-3 border-black rounded-2xl p-5 shadow-[8px_8px_0px_0px_#000]">
                
                {/* Floating Sticker Top */}
                <div className="absolute -top-4 -right-3 z-20 bg-yellow-300 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] rotate-3">
                  🔥 25%+ FRENCH OILS
                </div>

                {/* Image Frame */}
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

                {/* Card Meta */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-black px-2 py-0.5 rounded border border-black">
                      50ML EAU DE PARFUM
                    </span>
                    <h3 className="font-serif text-2xl font-black text-black mt-1">
                      {heroPerfume.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 line-through font-bold block">₹{heroPerfume.compareAtPrice}</span>
                    <span className="text-xl font-black text-black">₹{heroPerfume.price}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 font-semibold mb-4 leading-relaxed line-clamp-2">
                  {heroPerfume.tagline}
                </p>

                <Link
                  href={`/harsh-beniwal/octopus/perfumes/${heroPerfume.handle}`}
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 text-black py-3 rounded-lg font-black uppercase tracking-wider text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <span>VIEW FLAGSHIP FRAGRANCE</span>
                  <ArrowRight size={14} />
                </Link>

              </div>
            </div>

          </div>

          {/* Perks Bar Inside Hero Container */}
          <div className="mt-12 pt-8 border-t-2 border-black grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <span className="text-xl">🪔</span>
              <div>
                <p className="text-xs font-black uppercase">Deluxe Diwali Box</p>
                <p className="text-[10px] text-stone-700 font-bold">Festive Gifting Ready</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-black stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase">12+ Hours Longevity</p>
                <p className="text-[10px] text-stone-700 font-bold">High Projection EDP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-black stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase">Express Shipping</p>
                <p className="text-[10px] text-stone-700 font-bold">2-4 Days All India</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-black stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase">100% Authentic</p>
                <p className="text-[10px] text-stone-700 font-bold">IFRA & Cruelty Free</p>
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
              <span>👑 HARSH BENIWAL x OCTOPUS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-black">
              The 9 Iconic Eau De Parfums
            </h2>
            <p className="text-sm font-semibold text-stone-700 mt-2 max-w-xl">
              Each 50ML fragrance is formulated with 25%+ imported French perfume essence for remarkable projection, sillage, and all-day longevity.
            </p>
          </div>

          <Link
            href="/harsh-beniwal/octopus/perfumes"
            className="flex items-center gap-2 bg-black text-amber-300 px-6 py-3 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#f59e0b] hover:bg-stone-900 transition-all w-fit cursor-pointer"
          >
            <span>View All Perfumes</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Perfume Grid - 9 Neubrutalist Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {perfumes.map((perfume: any) => {
            const mainImg = perfume.images?.[0]?.src || "/logo.png";
            const bottleImg = perfume.images?.[3]?.src || perfume.images?.[1]?.src || mainImg;

            return (
              <div 
                key={perfume.handle}
                className="group bg-white border-3 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all flex flex-col"
              >
                {/* Image Header Container with Hover Switch */}
                <div className="relative aspect-square bg-[#FAF7F2] border-b-2 border-black overflow-hidden p-6 flex items-center justify-center">
                  
                  {/* Inspired By Badge */}
                  {perfume.inspiredBy && (
                    <div className="absolute top-3 left-3 z-10 bg-amber-200 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_0px_#000]">
                      Inspired by {perfume.inspiredBy}
                    </div>
                  )}

                  {/* Gender / Volume Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-white text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                    50ML EDP
                  </div>

                  {/* Main Product Image (1st Image = Presentation Box) */}
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
                      {perfume.gender || "Unisex"} • 25%+ Oil
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

      {/* 3. Diwali Festive Gift Hampers & Categories */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-300 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-3">
            <span>🪔 CURATED FESTIVE CATEGORIES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-black">
            Diwali Gifting For Everyone You Cherish
          </h2>
          <p className="text-sm font-semibold text-stone-700 mt-2 max-w-xl mx-auto">
            Choose from bespoke personalized jewelry, luxury fragrance sets, and elegant accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Diwali Fragrance Hampers",
              desc: "Harsh Beniwal 50ML EDPs in Royal Gift Packaging",
              link: "/harsh-beniwal/octopus/perfumes",
              bg: "bg-amber-100",
              tag: "Bestseller 🪔"
            },
            {
              title: "22K Gold Name Necklaces",
              desc: "Waterproof, Anti-Tarnish & Laser Engraved",
              link: "/collections/name-necklaces",
              bg: "bg-yellow-100",
              tag: "Evergreen ✦"
            },
            {
              title: "Luxury Gifts For Him",
              desc: "Oud Perfumes, Engraved Wallets & Cuff Bracelets",
              link: "/collections/gifts-for-him",
              bg: "bg-emerald-100",
              tag: "For Men 🎩"
            },
            {
              title: "Bespoke Gifts For Her",
              desc: "Personalized Rings, Pendants & Darling EDP",
              link: "/collections/gifts-for-her",
              bg: "bg-rose-100",
              tag: "For Her 💎"
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
                <h3 className="font-serif text-2xl font-black text-black mb-2 group-hover:text-amber-800 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs font-semibold text-stone-700 leading-relaxed mb-6">
                  {cat.desc}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black group-hover:gap-3 transition-all">
                <span>Explore Category</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Evergreen Personalized Keepsakes (Jewelry Showcase) */}
      {jewelryProducts.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-200 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-3">
                <span>✨ BESPOKE PERSONALIZATION</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-black text-black">
                Everlasting Keepsakes & Jewelry
              </h2>
              <p className="text-sm font-semibold text-stone-700 mt-2 max-w-xl">
                Personalized with any name, initial, or message in 22K gold plated anti-tarnish stainless steel.
              </p>
            </div>

            <Link
              href="/collections/all"
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-stone-50 transition-all w-fit cursor-pointer"
            >
              <span>View All Keepsakes</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {jewelryProducts.slice(0, 4).map((product: any) => (
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

      {/* 5. Shop By Budget Blocks (Neubrutalism Grid) */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-black">
            Shop By Budget
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-600 mt-2">
            Meaningful luxury for every pocket
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Under ₹499", href: "/collections/gifts-under-499", color: "bg-emerald-200" },
            { label: "Under ₹999", href: "/collections/gifts-under-999", color: "bg-amber-200" },
            { label: "Under ₹1499", href: "/collections/gifts-under-1499", color: "bg-rose-200" },
            { label: "50ML EDPs (₹1299)", href: "/harsh-beniwal/octopus/perfumes", color: "bg-yellow-300" }
          ].map((budget, idx) => (
            <Link
              key={idx}
              href={budget.href}
              className={`${budget.color} border-3 border-black rounded-2xl p-6 text-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all`}
            >
              <span className="font-serif text-xl sm:text-2xl font-black text-black block mb-1">
                {budget.label}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-800">
                Explore Items →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Diwali Packaging & Unboxing Delight */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto border-t-2 border-black">
        <div className="bg-[#FAF7F2] border-3 border-black rounded-3xl p-8 md:p-14 shadow-[8px_8px_0px_0px_#000] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          <div className="relative aspect-[4/3] bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
            <Image 
              src="/harsh-beniwal/octopus/perfumes/images/overlord_lifestyle.png"
              alt="Deluxe Diwali Gift Packaging"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-black text-amber-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-black mb-4">
              <span>🪔 UNBOXING PERFECTION</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-black mb-4 leading-tight">
              Crafted To Make First Impressions Unforgettable
            </h2>
            <p className="text-sm font-semibold text-stone-700 leading-relaxed mb-6">
              Every order from Octopus arrives nestled in a rigid luxury presentation box with satin ribbon bows and a personalized festive message card. Whether gifting yourself or sending love across state lines, the unboxing feels like pure magic.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-xs font-black text-stone-900 uppercase">
                <CheckCircle2 size={18} className="text-black shrink-0" /> Deluxe Rigid Monocarton Presentation Box
              </li>
              <li className="flex items-center gap-3 text-xs font-black text-stone-900 uppercase">
                <CheckCircle2 size={18} className="text-black shrink-0" /> Handwritten Festive Greeting Message Card
              </li>
              <li className="flex items-center gap-3 text-xs font-black text-stone-900 uppercase">
                <CheckCircle2 size={18} className="text-black shrink-0" /> Sealed Authentic Quality Guarantee
              </li>
            </ul>

            <Link
              href="/harsh-beniwal/octopus/perfumes"
              className="inline-flex items-center gap-2 bg-black text-amber-300 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#f59e0b] hover:bg-stone-900 transition-all cursor-pointer"
            >
              <span>Choose Your Festive Fragrance</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-4xl mx-auto border-t-2 border-black">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-600 mt-2">
            Everything you need to know about our perfumes & keepsakes
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
            <MessageSquare size={16} /> Have a question? Reach out to our 24/7 support team
          </Link>
        </div>
      </section>

      {/* 8. SEO Brand Manifesto Block */}
      <section className="bg-stone-950 text-white px-6 md:px-12 py-16 border-t-3 border-black text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4">
            <span>🪔 DIWALI LUXURY FESTIVE DESTINATION 2026</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black mb-4">
            India&apos;s Premier House of Luxury Fragrances & Bespoke Gifting
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium mb-4">
            At Octopus, we celebrate life&apos;s most meaningful relationships through the art of olfactory luxury and timeless craftsmanship. Formulated in direct partnership with Harsh Beniwal, our 9 signature Eau De Parfums feature 25%+ imported French perfume oil concentrations, offering unmatched 12+ hour longevity.
          </p>
          <p className="text-xs text-stone-400 leading-relaxed">
            From iconic fragrances like Overlord, Paradox, and Promised to personalized 22K gold-plated name necklaces and laser-engraved keepsakes, every piece is made to last a lifetime. Enjoy seamless Cash on Delivery, pan-India express shipping, and exclusive festive savings with coupon code <strong>DIWALI20</strong>.
          </p>
        </div>
      </section>

    </div>
  );
}
