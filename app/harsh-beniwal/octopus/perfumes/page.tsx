import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Flame, Star, Award, CheckCircle2 } from "lucide-react";
import HarshBeniwalPerfumesClient from "@/components/HarshBeniwalPerfumesClient";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";

const PAGE_URL = "https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Octopus Perfume by Harsh Beniwal | Official Brand Store & Prices (50ML EDP)",
  description:
    "Buy 100% original Octopus perfume by Harsh Beniwal on the official flagship store (BuyOctopus). 50ML EDPs formulated with 25%+ French fragrance oils, 12H+ beast-mode sillage. Use code LUXURY25 for 25% OFF + Free 7ML Paradox tester & express pan-India delivery.",
  keywords: [
    "octopus perfume",
    "octopus perfume coupon code",
    "harsh beniwal perfume",
    "octopus rhapsody",
    "octopus overlord",
    "octopus overload perfume",
    "buy octopus perfume",
    "octopus harsh beniwal",
    "octopus overlord perfume",
    "overlord perfume",
    "octopus mirage perfume",
    "octopus fragrance",
    "rhapsody octopus",
    "harsh beniwal perfume brand",
    "octopus paradox perfume",
    "octopus promised perfume",
    "octopus outlaw perfume",
    "harsh beniwal perfume coupon code",
    "octopus coupon code",
    "Octopus perfume by Harsh Beniwal",
    "Octopus perfume official website",
    "BuyOctopus",
    "Octopus perfumes price",
    "Harsh Beniwal perfume price",
    "Octopus perfume review",
    "Octopus perfume India",
    "overlord",
    "rhapsody",
    "mirage",
    "paradox",
    "promised",
    "outlaw",
    "somersault perfume",
    "your move perfume",
    "darling perfume",
    "coupon code LUXURY25"
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Octopus Perfume by Harsh Beniwal | Official 50ML EDP Flagship Store",
    description:
      "Buy 100% original Octopus Perfumes by Harsh Beniwal. 25%+ French fragrance oils, 12+ hour beast-mode longevity. 25% OFF with code LUXURY25 + Free 7ML tester.",
    url: PAGE_URL,
    siteName: "Octopus Perfumes by Harsh Beniwal",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 1200,
        alt: "Octopus Perfumes by Harsh Beniwal",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octopus Perfume by Harsh Beniwal | Official 50ML EDP Flagship Store",
    description:
      "Buy 100% original Octopus Perfumes by Harsh Beniwal. 25%+ French oils, 12+ hour sillage. Code LUXURY25 for 25% OFF.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
};

export default function HarshBeniwalPerfumesPage() {
  const perfumes = scrapedPerfumes;

  // Structured Data Schema for Google #1 Ranking
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Octopus Perfumes Collection by Harsh Beniwal",
    "description": "The full lineup of 50ML Eau De Parfum luxury fragrances from Harsh Beniwal and Octopus.",
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
        "sku": perfume.sku,
        "mpn": perfume.sku,
        "brand": {
          "@type": "Brand",
          "name": "Octopus Perfumes by Harsh Beniwal"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.octopusperfume.in/products/${perfume.handle}`,
          "priceCurrency": "INR",
          "price": perfume.price.toString(),
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Octopus Perfumes"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": perfume.rating?.value?.toString() || "4.8",
          "reviewCount": perfume.rating?.count || 120
        }
      }
    }))
  };

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
        "name": "Harsh Beniwal Octopus Perfumes",
        "item": PAGE_URL
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best Octopus perfume coupon code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The highest-value official Octopus perfume coupon code is LUXURY25, which gives an instant flat 25% OFF on all 50ML EDP perfumes by Harsh Beniwal (bringing price down to ₹974). You can also use code OCTOPUS20 for 20% OFF. Both include a free 7ML Paradox tester pack and free pan-India delivery."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I buy authentic Octopus perfume online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can buy Octopus perfume directly on the Octopus perfume official website (https://www.octopusperfume.in / BuyOctopus). Buying through the official website guarantees genuine 50ML EDP bottles crafted by Harsh Beniwal, a free 7ML Paradox tester pack, and free express shipping across India."
        }
      },
      {
        "@type": "Question",
        "name": "What are the most popular Octopus perfumes by Harsh Beniwal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The top-selling Octopus fragrances created with Harsh Beniwal are Overlord (smoky leather & dark woods), Rhapsody (spicy citrus & amber), Mirage (refreshing aquatic & mineral notes), Paradox (amber vanilla & tonka bean), Promised (aromatic lavender & cedarwood), and Outlaw (bold tobacco & oud)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Octopus perfumes price and Harsh Beniwal perfume price?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The official Octopus perfumes price is ₹1,299 for a 50ML Eau De Parfum (discounted from MRP ₹2,099). When you apply coupon code LUXURY25, the price drops to ₹974 with free express shipping across India."
        }
      },
      {
        "@type": "Question",
        "name": "What do customer reviews say about Octopus perfume by Harsh Beniwal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Verified Octopus perfume reviews give the brand 4.9/5 stars. Customers across India commend its beast-mode 12+ hour longevity, skin-safe IFRA certified French oils, and presentation quality matching ₹15,000+ luxury niche fragrances."
        }
      },
      {
        "@type": "Question",
        "name": "Is this the Octopus perfume official website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, https://www.octopusperfume.in (BuyOctopus) is the only official website for authentic Octopus Perfumes created in collaboration with Harsh Beniwal."
        }
      },
      {
        "@type": "Question",
        "name": "What is Harsh Beniwal's association with Octopus Perfumes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Harsh Beniwal is the official brand partner and creative ambassador for the Octopus Perfumes collection. Each 50ml EDP fragrance has been specially formulated to deliver luxury niche accords crafted for Indian weather conditions with supreme longevity."
        }
      },
      {
        "@type": "Question",
        "name": "How fast is Octopus perfume India shipping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Octopus perfume India offers Free Pan-India Express Delivery within 2 to 4 business days with 100% secure online prepaid payments (UPI, Cards, NetBanking)."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-[#fafaf9] text-stone-900 pt-6 pb-24">
        {/* Luxury Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#141210] via-[#1a1714] to-[#25201b] text-white py-16 md:py-24 px-6 md:px-12 border-b border-amber-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" />
              Official Collaboration
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-50 max-w-4xl mx-auto leading-tight">
              Octopus Perfumes <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">By Harsh Beniwal</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
              Uncompromising luxury bottled in 50ML Eau De Parfum. High oil concentration, 12+ hour sillage, and world-class luxury accords created to define your presence.
            </p>

            {/* Quick Stats Pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-semibold uppercase tracking-wider text-amber-200/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" /> 25%+ Pure EDP Oil
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" /> 12+ Hours Longevity
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" /> Free Shipping in India
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-400" /> 100% Secure Prepaid
              </span>
            </div>
          </div>
        </section>

        {/* Catalog and Client Interactions Container */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-8">
            <Link href="/" className="hover:text-amber-800 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Harsh Beniwal Octopus Perfumes</span>
          </nav>

          <HarshBeniwalPerfumesClient perfumes={perfumes} />
        </div>
      </main>
    </>
  );
}
