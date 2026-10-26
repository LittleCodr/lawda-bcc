import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { 
  ShieldCheck, 
  Truck, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronRight,
  Package,
  Heart,
  Plus,
  Minus
} from "lucide-react";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";

export const metadata: Metadata = {
  title: "Diwali Perfume Gifts 2026 | Luxury Festive Fragrance Hampers | Octopus",
  description: "Explore 2026's top Diwali perfume gifts and luxury fragrance hampers by Harsh Beniwal. 100% original 50ML EDPs (25%+ French oils, 12H+ sillage). Use code DIWALI20 for 20% OFF + Free 7ML Paradox tester + Deluxe festive gift box.",
  keywords: [
    "diwali perfume gifts",
    "diwali gift hampers 2026",
    "luxury diwali gifts india",
    "diwali perfume gift box",
    "harsh beniwal diwali gifts",
    "best diwali gift for boyfriend",
    "best diwali gift for girlfriend",
    "diwali gift for husband",
    "diwali gift for wife",
    "diwali gifts for men",
    "corporate diwali gifts perfumes",
    "diwali discount luxury perfumes",
    "coupon code DIWALI20",
    "octopus perfumes diwali sale"
  ],
  alternates: {
    canonical: "https://www.octopusperfume.in/diwali-gifts",
  },
  openGraph: {
    title: "Diwali Perfume Gifts 2026 | Luxury Festive Fragrance Hampers",
    description: "Shop authentic 50ML EDP Diwali perfume gift sets by Harsh Beniwal. Free 7ML Paradox tester + 20% OFF with code DIWALI20.",
    url: "https://www.octopusperfume.in/diwali-gifts",
    siteName: "Octopus Perfumes by Harsh Beniwal",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 630,
        alt: "Diwali Perfume Gifts 2026 by Harsh Beniwal",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diwali Perfume Gifts 2026 | Luxury Festive Fragrance Hampers",
    description: "Shop authentic 50ML EDP Diwali perfume gift sets by Harsh Beniwal. Code DIWALI20 for 20% OFF.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
};

export default function DiwaliGiftsPage() {
  const perfumes = scrapedPerfumes as any[];

  const diwaliHampers = [
    {
      title: "Royal Couple Festive Hamper",
      subtitle: "Overlord 50ML (Sauvage DNA) + Darling 50ML (Miss Dior DNA)",
      forWhom: "For Couples & Hosts",
      tag: "His & Her Luxury",
      price: 1718,
      mrp: 4298,
      link: "/products/darling-women",
      image: "/harsh-beniwal/octopus/perfumes/images/darling_box.png",
      features: [
        "2x Full 50ML EDP Bottles",
        "2x Free 7ML Paradox Testers (₹798 Value)",
        "Deluxe Dual Festive Gift Packaging",
        "12+ Hours Longevity in Festive Parties"
      ]
    },
    {
      title: "The Emperor's Connoisseur Trio",
      subtitle: "Overlord (Sauvage) + Promised (BR540) + Mirage (Ombre Nomade)",
      forWhom: "The Grand Power Gift",
      tag: "VIP Bestseller",
      price: 2717,
      mrp: 7397,
      link: "/products/promised",
      image: "/harsh-beniwal/octopus/perfumes/images/promised_box.png",
      features: [
        "3x Full 50ML EDP Fragrances",
        "Covers Citrus, Sweet Amber & Royal Oud",
        "Free 7ML Paradox Tester Included",
        "Signature Festive Master Box"
      ]
    },
    {
      title: "Signature Solo Gift Box: Overlord",
      subtitle: "Calabrian Bergamot, Ambroxan, Sichuan Pepper (Dior Sauvage DNA)",
      forWhom: "For Him / Brothers / Husband",
      tag: "Under ₹1,100",
      price: 1039,
      mrp: 2099,
      link: "/products/overlord",
      image: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
      features: [
        "50ML High-Grade Eau De Parfum",
        "25%+ Imported French Fragrance Oils",
        "Free 7ML Paradox Tester Pack (₹399)",
        "Heavy Crush-Proof Presentation Box"
      ]
    },
    {
      title: "Signature Solo Gift Box: Promised",
      subtitle: "Saffron, Jasmine, Amberwood, Cedar Resin (Baccarat Rouge 540 DNA)",
      forWhom: "For Her / Wife / Girlfriend",
      tag: "Magnetic Romance",
      price: 1039,
      mrp: 2099,
      link: "/products/promised",
      image: "/harsh-beniwal/octopus/perfumes/images/promised_box.png",
      features: [
        "Sweet Saffron & Golden Amber Accord",
        "Compliment Magnet for Evening Gatherings",
        "Free 7ML Paradox Tester Included",
        "Deluxe Festive Gold Packaging"
      ]
    }
  ];

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.octopusperfume.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Diwali Gifts 2026",
        "item": "https://www.octopusperfume.in/diwali-gifts"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best Diwali perfume gifts for 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The top-rated Diwali perfume gifts include the Royal Couple Festive Hamper (Overlord + Darling), the Emperor's Connoisseur Trio (Overlord + Promised + Mirage), and individual 50ML EDP bestsellers like Overlord and Promised, each packaged in deluxe gift boxes with free 7ML Paradox discovery testers."
        }
      },
      {
        "@type": "Question",
        "name": "How does the DIWALI20 coupon code work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enter code DIWALI20 at checkout for an instant flat 20% discount on all perfume bottles and hampers. In addition, every order includes a complimentary 7ML Paradox tester pack (worth ₹399) and free express pan-India delivery."
        }
      },
      {
        "@type": "Question",
        "name": "Can you deliver before Diwali Day across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we dispatch via priority air couriers (BlueDart and Delhivery) to guarantee delivery in 2 to 4 business days to all serviceable pin codes across India."
        }
      }
    ]
  };

  return (
    <div className="bg-white text-[#222222] min-h-screen pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-amber-50 via-yellow-50/50 to-white border-b border-amber-200/80 pt-10 pb-12 px-4 sm:px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Breadcrumb Nav */}
          <nav className="flex items-center justify-center gap-2 text-[12px] text-[#6a6a6a] mb-4">
            <Link href="/" className="hover:text-[#222222] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-900 font-bold">Diwali Gifts 2026</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 shadow-xs">
            <span>🪔</span>
            <span>Shubh Deepavali 2026 Special</span>
            <span>✨</span>
          </div>

          <h1 className="text-[28px] sm:text-[40px] md:text-[46px] font-extrabold text-[#222222] leading-tight tracking-tight mb-4">
            Diwali Perfume Gifts & Festive Fragrance Hampers
          </h1>

          <p className="text-[15px] sm:text-[17px] text-[#3f3f3f] leading-relaxed max-w-2xl mx-auto mb-6">
            Replace boring sweet boxes with high-status French Eau De Parfums (25%+ oils) crafted by Harsh Beniwal. Engineered for 12+ hour beast-mode sillage in festive gatherings.
          </p>

          {/* Coupon Callout Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white border-2 border-amber-300 rounded-2xl px-6 py-3 shadow-sm">
            <span className="text-sm text-amber-900 font-bold">Diwali Code:</span>
            <span className="font-mono text-base font-extrabold text-[#222222] bg-amber-100 px-3 py-1 rounded-md border border-amber-300">
              DIWALI20
            </span>
            <span className="text-sm font-bold text-[#ff385c]">Flat 20% OFF + Free 7ML Paradox Tester + Deluxe Gift Box</span>
          </div>

        </div>
      </div>

      {/* Curated Hampers Showcase */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            Featured Bundles
          </span>
          <h2 className="text-[24px] sm:text-[30px] font-bold text-[#222222] mt-2 tracking-tight">
            Curated Diwali Gift Hampers & Pairings
          </h2>
          <p className="text-sm text-[#6a6a6a]">
            Handcrafted sets assembled in luxury festive packaging with complimentary discovery testers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diwaliHampers.map((hamper, idx) => (
            <div 
              key={idx}
              className="bg-white border-2 border-amber-300 rounded-[18px] p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-square bg-[#f7f7f7] rounded-[14px] overflow-hidden mb-4">
                  <span className="absolute top-2 left-2 z-10 bg-amber-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {hamper.tag}
                  </span>
                  <Image 
                    src={hamper.image}
                    alt={hamper.title}
                    fill
                    unoptimized
                    className="object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                </div>

                <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">
                  {hamper.forWhom}
                </span>
                <h3 className="text-[17px] font-bold text-[#222222] leading-snug">
                  {hamper.title}
                </h3>
                <p className="text-[12px] text-[#6a6a6a] mt-1 mb-3">
                  {hamper.subtitle}
                </p>

                <div className="space-y-1 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-[11px] text-[#222222]">
                  {hamper.features.map((f, i) => (
                    <p key={i} className="flex items-center gap-1.5">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span>{f}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6a6a6a] line-through block">MRP ₹{hamper.mrp}</span>
                  <span className="text-[18px] font-bold text-[#222222]">₹{hamper.price}</span>
                  <span className="text-[10px] text-amber-800 font-bold block">with DIWALI20</span>
                </div>
                <Link
                  href={hamper.link}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  Buy Hamper
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full 9 Perfumes Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-10 border-t border-[#ebebeb]">
        <div className="mb-8">
          <h2 className="text-[22px] sm:text-[28px] font-bold text-[#222222] tracking-tight">
            Individual 50ML Eau De Parfums (₹1,039 with Code DIWALI20)
          </h2>
          <p className="text-sm text-[#6a6a6a]">
            Every single 50ML EDP bottle purchase includes a complimentary 7ML Paradox discovery tester pack (₹399 value).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfumes.map((perfume) => (
            <div 
              key={perfume.handle}
              className="bg-white border border-[#ebebeb] hover:border-amber-300 rounded-[16px] p-4 shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-square bg-[#f7f7f7] rounded-[12px] overflow-hidden mb-3">
                <span className="absolute top-2 left-2 z-10 bg-amber-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  🪔 Diwali Special
                </span>
                <Image 
                  src={perfume.images?.[0]?.src || "/logo.png"}
                  alt={`${perfume.title} Diwali Perfume Gift`}
                  fill
                  unoptimized
                  className="object-contain p-6 hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-[#222222]">{perfume.title} 50ML EDP</h3>
                    <span className="text-[13px] font-bold text-amber-600">★ 4.92</span>
                  </div>
                  <p className="text-[12px] text-[#6a6a6a] mt-0.5">
                    {perfume.inspiredBy ? `Inspired by ${perfume.inspiredBy}` : "25%+ French Oils"}
                  </p>
                  <p className="text-[12px] text-amber-800 font-semibold mt-1">
                    🎁 Free 7ML Paradox Tester + Gift Packaging
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ebebeb] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#6a6a6a] line-through mr-1">₹2,099</span>
                    <span className="text-[16px] font-bold text-[#222222]">₹{perfume.price}</span>
                    <span className="text-[10px] text-amber-800 block font-semibold">₹1,039 with DIWALI20</span>
                  </div>

                  <Link
                    href={`/harsh-beniwal/octopus/perfumes/${perfume.handle}`}
                    className="px-4 py-2 bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-lg text-xs font-bold shadow-xs active:scale-95"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diwali Gifting Guide Articles & Links */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[#ebebeb]">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-[20px] p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-white border border-amber-300 px-3 py-1 rounded-full">
              Editorial Guide
            </span>
            <h3 className="text-[20px] sm:text-[24px] font-bold text-[#222222] mt-2">
              The 2026 Diwali Luxury Fragrance Gifting Guide
            </h3>
            <p className="text-[14px] text-[#6a6a6a] mt-1 max-w-xl">
              Read our fragrance concierges&apos; comprehensive tips on matching notes with personalities, corporate gifting etiquette, and packaging guides.
            </p>
          </div>
          <Link
            href="/diwali-gift-ideas"
            className="shrink-0 bg-[#222222] hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all"
          >
            Read Gift Guide &rarr;
          </Link>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 border-t border-[#ebebeb]">
        <h2 className="text-[22px] sm:text-[26px] font-bold text-[#222222] mb-6 text-center">
          Frequently Asked Questions About Diwali Gifting
        </h2>

        <div className="divide-y divide-[#ebebeb] border-y border-[#ebebeb]">
          {faqSchema.mainEntity.map((faq, idx) => (
            <details key={idx} className="group py-4 cursor-pointer">
              <summary className="flex items-center justify-between text-[15px] font-semibold text-[#222222] list-none">
                <span>{faq.name}</span>
                <span className="text-amber-700 font-bold group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-[14px] text-[#6a6a6a] leading-relaxed">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
