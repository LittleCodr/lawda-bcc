import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Tag, ShieldCheck, HelpCircle } from "lucide-react";
import CouponCodeClient from "@/components/CouponCodeClient";

const PAGE_URL = "https://www.octopusperfume.in/octopus-perfume-coupon-code";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Octopus Perfume Coupon Code & Discounts (2026) | Code OCTOPUS5 (5% OFF ₹5,000+)",
  description:
    "Verified Octopus perfume coupon codes & bundle tiers. Use coupon code OCTOPUS5 for 5% OFF on minimum orders of ₹5,000+ across Harsh Beniwal 50ML EDPs & 130+ luxury houses, plus Free 7ML Paradox tester & express shipping.",
  keywords: [
    "octopus perfume coupon code",
    "harsh beniwal perfume coupon code",
    "octopus coupon code",
    "octopus perfume discount code",
    "octopus perfume promo code",
    "buy octopus perfume coupon",
    "octopus overlord coupon code",
    "harsh beniwal perfume offer",
    "octopus perfume free shipping",
    "octopus perfumes voucher",
    "octopus fragrance coupon",
    "buyoctopus coupon",
    "octopus perfume sale",
    "harsh beniwal perfume price discount"
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Octopus Perfume Coupon Code & Discounts (2026) | 5% OFF ₹5,000+ Code OCTOPUS5",
    description:
      "Save 5% on minimum orders of ₹5,000+ with verified promo code OCTOPUS5. Includes automatic bundle savings up to 5%, free 7ML Paradox tester pack & pan-India delivery.",
    url: PAGE_URL,
    siteName: "Octopus Perfumes by Harsh Beniwal",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 1200,
        alt: "Octopus Perfume Coupon Code - OCTOPUS5",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octopus Perfume Coupon Code & Discounts (2026) | 5% OFF Code OCTOPUS5",
    description:
      "Save 5% on orders of ₹5,000+ with verified promo code OCTOPUS5. Includes free 7ML Paradox tester pack & pan-India delivery.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
};

export default function OctopusPerfumeCouponCodePage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Octopus Perfume Coupon Code & Discounts",
    "url": PAGE_URL,
    "description": "Verified promo codes and discounts for Octopus Perfumes by Harsh Beniwal. Save up to 25% on original 50ML Eau De Parfum bottles.",
    "publisher": {
      "@type": "Organization",
      "name": "Octopus Perfumes by Harsh Beniwal",
      "url": "https://www.octopusperfume.in"
    }
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
        "name": "Octopus Perfumes by Harsh Beniwal",
        "item": "https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Octopus Perfume Coupon Code",
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
        "name": "What is the best working Octopus perfume coupon code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The official prepaid Octopus perfume coupon code is OCTOPUS5, which gives 5% OFF on minimum orders of ₹5,000+. You also unlock automatic 3% OFF on 2 bottles and 5% OFF on 3+ bottles in your bag."
        }
      },
      {
        "@type": "Question",
        "name": "What is the coupon code for Harsh Beniwal perfume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The official coupon code is OCTOPUS5, valid for an extra 5% OFF on orders of ₹5,000 or more across Harsh Beniwal 50ML EDPs (already discounted to ₹1,299 from ₹2,099 MRP) and 130+ luxury houses."
        }
      },
      {
        "@type": "Question",
        "name": "How much can I save on Octopus perfume with a coupon code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Harsh Beniwal 50ML EDPs are already discounted by ₹800 below ₹2,099 MRP at ₹1,299. Adding multi-bottle tiers saves up to 5% automatically, and applying OCTOPUS5 on ₹5,000+ orders unlocks an extra 5% OFF plus a free 7ML Paradox tester."
        }
      },
      {
        "@type": "Question",
        "name": "Do Octopus perfume coupon codes expire?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Coupon code OCTOPUS5 is verified active for qualifying orders of ₹5,000+. Every prepaid order also receives complimentary pan-India air express shipping and a free 7ML Paradox EDP tester."
        }
      },
      {
        "@type": "Question",
        "name": "How do I apply the coupon code at checkout?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Build your bag to ₹5,000 or more, proceed to checkout, enter OCTOPUS5 into the 'Enter code' field, and click 'Apply'. Your 5% prepaid discount will deduct instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Is free shipping included with the coupon code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all orders shipped within India receive 100% free express air delivery with no minimum delivery fee required."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
        <section className="relative overflow-hidden bg-gradient-to-b from-[#141210] via-[#1a1714] to-[#25201b] text-white py-16 md:py-20 px-6 md:px-12 border-b border-amber-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" />
              Official Promo Codes & Deals
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-50 leading-tight">
              Octopus Perfume <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">Coupon Code & Offers</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Get verified, active discount codes for 100% original Octopus Perfumes by Harsh Beniwal and 130+ luxury houses. Save 5% on minimum orders of ₹5,000+ with code <strong className="font-mono text-amber-300">OCTOPUS5</strong> + complimentary 7ML Paradox tester &amp; free pan-India delivery.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-amber-200/90 pt-2">
              <span className="flex items-center gap-1.5">
                <Tag size={13} className="text-amber-400" /> Code OCTOPUS5 (5% OFF ₹5,000+)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-amber-400" /> 100% Verified Authentic
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> Free 7ML Tester Included
              </span>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-10">
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-8">
            <Link href="/" className="hover:text-amber-800 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/harsh-beniwal/octopus/perfumes" className="hover:text-amber-800 transition-colors">Harsh Beniwal Octopus Perfumes</Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Coupon Codes</span>
          </nav>

          <CouponCodeClient />

          {/* Answer Engine Optimization FAQ Section */}
          <section className="mt-20 pt-16 border-t border-stone-200">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <HelpCircle size={14} className="text-amber-700" />
                  Frequently Asked Questions
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  Octopus Perfume Coupon Codes & Discounts FAQ
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2">
                  Everything you need to know about redeeming discount vouchers on authentic Harsh Beniwal perfumes.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs">
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                    What is the best working Octopus perfume coupon code?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    The active official prepaid coupon code is <strong className="font-mono text-stone-900">OCTOPUS5</strong>, providing an instant 5% OFF on minimum orders of ₹5,000+ alongside automatic 3% (2 bottles) and 5% (3+ bottles) bundle tiers.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs">
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                    What is the coupon code for Harsh Beniwal perfume?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    You can apply <strong className="font-mono text-stone-900">OCTOPUS5</strong> at checkout whenever your cart total is ₹5,000 or more. Harsh Beniwal 50ML EDPs are already priced at ₹1,299 (down ₹800 from ₹2,099 MRP).
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs">
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                    How much can I save on Octopus perfume with a coupon code?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    On top of flagship markdowns and automatic bundle tiers (up to 5% OFF), code OCTOPUS5 saves an additional 5% on ₹5,000+ orders, plus every order includes a complimentary 7ML Paradox tester and free pan-India express delivery.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs">
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                    How do I apply the coupon code at checkout?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Add ₹5,000+ of fragrances to your bag, proceed to checkout, enter <strong className="font-mono text-stone-900">OCTOPUS5</strong> into the &apos;Enter code&apos; field, and click &apos;Apply&apos;. The 5% discount deducts automatically.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs">
                  <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                    Is free shipping included with the coupon code?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Yes, all orders shipped within India receive 100% free express air delivery with no minimum delivery fee required.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

