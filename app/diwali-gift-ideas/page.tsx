import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { 
  Gift, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Star,
  Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ultimate Diwali Fragrance Gift Guide 2026 | Luxury Perfumes by Harsh Beniwal",
  description: "Discover why 50ML Eau De Parfums by Harsh Beniwal are 2026's #1 luxury Diwali gifts. French oil concentrations, sillage breakdown, couple pairings, and corporate hampers with code DIWALI20 for 20% OFF.",
  keywords: [
    "diwali fragrance gift guide 2026",
    "diwali perfume gifts",
    "best diwali gift for boyfriend",
    "best diwali gift for husband",
    "diwali gift for girlfriend",
    "diwali gift for wife",
    "diwali gifts for men",
    "corporate diwali gifts perfumes",
    "harsh beniwal diwali gifts",
    "diwali gifts under 1500",
    "luxury diwali gifts india 2026"
  ],
  alternates: {
    canonical: "https://www.octopusperfume.in/diwali-gift-ideas",
  },
  openGraph: {
    title: "Ultimate Diwali Fragrance Gift Guide 2026 | Luxury Perfumes by Harsh Beniwal",
    description: "Discover the top luxury perfume gifts and hampers for Diwali 2026 by Harsh Beniwal. Free 7ML Paradox tester + 20% OFF with code DIWALI20.",
    url: "https://www.octopusperfume.in/diwali-gift-ideas",
    siteName: "Octopus Perfumes by Harsh Beniwal",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 630,
        alt: "Diwali Fragrance Gifting Guide 2026",
      },
    ],
    locale: "en_IN",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Diwali Fragrance Gift Guide 2026 | Octopus Perfumes",
    description: "Top luxury fragrance gifts and hampers for Diwali 2026 by Harsh Beniwal. Code DIWALI20 for 20% OFF.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
};

export default function DiwaliGiftIdeasPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Ultimate 2026 Diwali Luxury Fragrance Gift Guide",
    "description": "Why luxury Eau De Parfum perfumes formulated with 25%+ French oils are replacing perishable sweet boxes as India's top Diwali gift in 2026.",
    "image": "https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
    "author": {
      "@type": "Person",
      "name": "Harsh Beniwal",
      "jobTitle": "Creator & Founder"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Octopus Perfumes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.octopusperfume.in/logo.png"
      }
    },
    "datePublished": "2026-10-15T09:00:00+05:30",
    "dateModified": "2026-10-26T18:00:00+05:30"
  };

  return (
    <div className="bg-white text-[#222222] min-h-screen pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-amber-50 via-yellow-50/40 to-white border-b border-amber-200/80 pt-12 pb-14 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-[13px] text-[#6a6a6a] mb-4">
            <Link href="/" className="hover:text-[#222222] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/diwali-gifts" className="hover:text-[#222222] transition-colors">Diwali Gifts</Link>
            <span>/</span>
            <span className="text-amber-900 font-bold truncate">2026 Gift Guide</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-3.5 py-1 rounded-full mb-4 shadow-2xs">
            <span>🪔</span>
            <span>Diwali 2026 Festive Gifting Guide</span>
          </div>

          <h1 className="text-[30px] sm:text-[42px] text-[#222222] leading-tight mb-4 font-extrabold tracking-tight">
            The Ultimate Diwali Fragrance Gift Guide (2026)
          </h1>

          <p className="text-[#3f3f3f] text-base sm:text-lg leading-relaxed mb-4">
            Skip the generic, sugary sweet boxes this Deepavali. From 50ML Eau De Parfums by Harsh Beniwal to luxury fragrance discovery boxes, here are the most thoughtful festive presents that radiate status, elegance, and 12+ hour sillage.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#6a6a6a] pt-2 border-t border-amber-200/60">
            <span className="font-semibold text-[#222222]">By Harsh Beniwal & Octopus Olfactory Blenders</span>
            <span>·</span>
            <span>Updated for Diwali 2026</span>
            <span>·</span>
            <span className="text-amber-800 font-bold">Use Code DIWALI20</span>
          </div>
        </div>
      </div>

      {/* Guide Body */}
      <div className="max-w-3xl mx-auto px-6 mt-10 space-y-12 text-[#222222]">
        
        {/* Intro Manifesto */}
        <section className="prose prose-stone max-w-none text-[15px] leading-relaxed text-[#3f3f3f] space-y-4">
          <p>
            The festival of lights is a time for heartfelt gratitude, auspicious new beginnings, and bringing joy to those who matter most. Yet, every year, millions of Indian homes receive identical boxes of commercial sweets (mithai) that quickly spoil, contribute to sugar overload, or simply get passed forward from house to house.
          </p>
          <p>
            In 2026, thoughtful gift-givers are turning to authentic high-concentration Eau De Parfum fragrances. A signature scent crafted with imported French oils is not just a luxury item; it is an intimate, everlasting memory that greets the recipient every single morning for 365+ days.
          </p>
        </section>

        {/* Category 1: For Him */}
        <section className="bg-white border-2 border-amber-300/80 rounded-[18px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Best for Boyfriend / Husband / Brother
            </span>
            <span className="text-sm font-bold text-amber-700">Under ₹1,100</span>
          </div>

          <h2 className="text-[22px] font-bold text-[#222222] mb-2">
            1. Overlord 50ML EDP (Dior Sauvage DNA)
          </h2>
          <p className="text-[#6a6a6a] text-sm leading-relaxed mb-4">
            If you want a versatile, electrifying scent that works universally for Indian men across all age groups, <strong>Overlord</strong> is the uncontested champion. Opening with explosive Calabrian bergamot and crisp lemon zest, it quickly develops into warm French lavender and Sichuan pepper before setting into a magnetic mineral ambroxan base.
          </p>

          <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded-xl text-xs mb-5">
            <div>
              <p className="font-bold text-[#222222]">Longevity:</p>
              <p className="text-[#6a6a6a]">12+ Hours (Beast Mode)</p>
            </div>
            <div>
              <p className="font-bold text-[#222222]">Best For:</p>
              <p className="text-[#6a6a6a]">Diwali Puja, Daily Office, Parties</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#ebebeb]">
            <span className="text-base font-bold text-[#222222]">
              ₹1,039 <span className="text-xs text-[#6a6a6a] line-through font-normal">₹2,099</span> (Code: DIWALI20)
            </span>
            <Link
              href="/products/overlord"
              className="px-5 py-2.5 bg-[#ff385c] hover:bg-[#e00b41] text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Shop Overlord
            </Link>
          </div>
        </section>

        {/* Category 2: For Her */}
        <section className="bg-white border-2 border-amber-300/80 rounded-[18px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 bg-rose-100 px-3 py-1 rounded-full">
              Best for Girlfriend / Wife / Sister
            </span>
            <span className="text-sm font-bold text-amber-700">Under ₹1,100</span>
          </div>

          <h2 className="text-[22px] font-bold text-[#222222] mb-2">
            2. Promised 50ML EDP (Baccarat Rouge 540 DNA) & Darling (Miss Dior DNA)
          </h2>
          <p className="text-[#6a6a6a] text-sm leading-relaxed mb-4">
            For the women who command grace and sophistication, <strong>Promised</strong> delivers the intoxicating celestial warmth of golden saffron threads, radiant jasmine petals, and burnt amberwood sugar. Alternatively, <strong>Darling</strong> captures romantic morning peony and damask rose draped in velvety sandalwood.
          </p>

          <div className="grid grid-cols-2 gap-3 p-3 bg-rose-50/60 rounded-xl text-xs mb-5">
            <div>
              <p className="font-bold text-[#222222]">Scent Profile:</p>
              <p className="text-[#6a6a6a]">Sweet Amber, Saffron, Floral Elegance</p>
            </div>
            <div>
              <p className="font-bold text-[#222222]">Complimentary Gift:</p>
              <p className="text-[#6a6a6a]">Free 7ML Paradox Tester (₹399)</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#ebebeb]">
            <span className="text-base font-bold text-[#222222]">
              ₹1,039 <span className="text-xs text-[#6a6a6a] line-through font-normal">₹2,099</span> (Code: DIWALI20)
            </span>
            <Link
              href="/products/promised"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Shop Promised
            </Link>
          </div>
        </section>

        {/* Category 3: Couple Gifting */}
        <section className="bg-white border-2 border-amber-400 rounded-[18px] p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Couple & Host Gifting
            </span>
            <span className="text-sm font-bold text-amber-700">Save 60%</span>
          </div>

          <h2 className="text-[22px] font-bold text-[#222222] mb-2">
            3. Royal Couple Festive Hamper (Overlord + Darling)
          </h2>
          <p className="text-[#6a6a6a] text-sm leading-relaxed mb-4">
            Visiting family, newlyweds, or festive hosts this Diwali? The <strong>Royal Couple Festive Hamper</strong> pairs India&apos;s favorite masculine citrus-ambroxan fragrance with our most beloved feminine floral-rose EDP. Packaged together with gold festive accents and 2x complimentary 7ML testers.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-[#ebebeb]">
            <div>
              <span className="text-base font-bold text-[#222222]">
                ₹1,718 Total <span className="text-xs text-[#6a6a6a] line-through font-normal">₹4,298</span>
              </span>
              <span className="text-[11px] text-amber-800 font-bold block">with Code DIWALI20</span>
            </div>
            <Link
              href="/diwali-gifts"
              className="px-5 py-2.5 bg-[#ff385c] hover:bg-[#e00b41] text-white text-xs font-bold rounded-lg shadow-xs"
            >
              View Hamper
            </Link>
          </div>
        </section>

        {/* Gifting Etiquette Tips */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-[18px] p-6 sm:p-8">
          <h3 className="text-[20px] font-bold text-[#222222] mb-3 flex items-center gap-2">
            <span>✨</span> 3 Essential Rules for Diwali Perfume Gifting
          </h3>
          <ul className="space-y-3 text-sm text-[#3f3f3f]">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span><strong>Choose Eau De Parfum (EDP) over diluted EDT:</strong> Indian festive parties involve heavy silks, festive attire, and extended evenings. EDTs vanish in 2 hours; our 25%+ French oil EDPs persist effortlessly for 12+ hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span><strong>Deluxe Presentation Matters:</strong> Every Octopus fragrance arrives in a rigid, crush-resistant gift carton sealed with tamper-evident labels suitable for high-status gifting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span><strong>Order Early for Pre-Diwali Arrival:</strong> Express air courier deliveries take 2 to 4 business days. Secure your orders with code <strong>DIWALI20</strong> to guarantee delivery before Diwali day.</span>
            </li>
          </ul>
        </section>

        {/* CTA Strip */}
        <div className="text-center pt-6">
          <Link
            href="/diwali-gifts"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-xl text-[15px] shadow-sm transition-all"
          >
            <span>🪔</span>
            <span>Shop All Diwali Perfume Gifts (Code: DIWALI20)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
