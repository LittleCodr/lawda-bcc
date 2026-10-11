import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Flame, Star, Award, CheckCircle2 } from "lucide-react";
import HarshBeniwalPerfumesClient from "@/components/HarshBeniwalPerfumesClient";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";

const PAGE_URL = "https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes";

export const metadata: Metadata = {
  title: "Harsh Beniwal Octopus Perfumes | 100% Original 50ML EDP Collection",
  description:
    "Explore the official Octopus Perfumes collection curated by Harsh Beniwal. 50ML Eau De Parfum luxury formulations inspired by Sauvage, Baccarat Rouge 540, Ombre Nomade, Imagination & more. Free express delivery in India.",
  keywords: [
    "harsh beniwal octopus perfumes",
    "harsh beniwal perfume",
    "octopus perfumes",
    "octopus perfume by harsh beniwal",
    "overlord perfume",
    "promised perfume harsh beniwal",
    "somersault perfume",
    "rhapsody perfume",
    "mirage perfume",
    "outlaw perfume",
    "your move perfume",
    "paradox perfume",
    "darling perfume",
    "harsh beniwal cologne",
    "buy octopus perfume online"
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Harsh Beniwal Octopus Perfumes | 100% Original 50ML EDP Collection",
    description:
      "Official Octopus Perfumes by Harsh Beniwal. Formulated with 25%+ French fragrance oils, 12+ hour longevity. Best prices across India.",
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
    title: "Harsh Beniwal Octopus Perfumes | 100% Original 50ML EDP",
    description:
      "Official Octopus Perfumes by Harsh Beniwal. Formulated with 25%+ French fragrance oils, 12+ hour longevity. Best prices across India.",
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
        "name": "What is Harsh Beniwal's association with Octopus Perfumes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Harsh Beniwal is the official brand partner and creative ambassador for the Octopus Perfumes collection. Each 50ml EDP fragrance has been specially formulated to deliver luxury niche accords crafted for Indian weather conditions with supreme longevity."
        }
      },
      {
        "@type": "Question",
        "name": "What is the concentration and oil percentage of these perfumes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All Octopus Perfumes are formulated as Eau De Parfum (EDP) with 25%+ high fragrance oil concentration, providing 12+ hours of consistent projection and refined sillage."
        }
      },
      {
        "@type": "Question",
        "name": "What luxury fragrances are these perfumes inspired by?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The collection includes accords inspired by the world's most sought-after niche fragrances: Overlord (Sauvage), Promised (Baccarat Rouge 540), Somersault (Louis Vuitton Imagination), Mirage (Louis Vuitton Ombre Nomade), Outlaw (Tom Ford Ombre Leather), Your Move (Tom Ford Oud Wood), Rhapsody (Maison Margiela Jazz Club), Paradox (LV Les Sables Roses), and Darling (Miss Dior)."
        }
      },
      {
        "@type": "Question",
        "name": "Are Octopus Perfumes safe on sensitive skin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All formulations are IFRA compliant, dermatologically tested, non-irritating, cruelty-free, and blended with premium imported fragrance oils."
        }
      },
      {
        "@type": "Question",
        "name": "What is the shipping time and is Cash on Delivery (COD) available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide Free Express Delivery across India within 2 to 5 business days. Both online prepaid payment and Cash on Delivery (COD) options are fully supported."
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
                <CheckCircle2 size={14} className="text-amber-400" /> Cash on Delivery
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
