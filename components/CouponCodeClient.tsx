"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Copy, Tag, Sparkles, ShieldCheck, Truck, Gift, ArrowRight } from "lucide-react";

interface Coupon {
  code: string;
  discount: string;
  title: string;
  description: string;
  validUntil: string;
  isPopular?: boolean;
  minSpend?: string;
}

const COUPONS: Coupon[] = [
  {
    code: "LUXURY25",
    discount: "25% OFF",
    title: "Sitewide Luxury Discount",
    description: "Flat 25% instant discount on all Octopus perfumes by Harsh Beniwal and 130+ designer fragrance houses.",
    validUntil: "Verified Active Today",
    isPopular: true,
    minSpend: "Orders over ₹499"
  },
  {
    code: "OCTOPUS20",
    discount: "20% OFF",
    title: "Harsh Beniwal Signature Offer",
    description: "Flat 20% OFF on all 50ML Eau De Parfum bottles (Overlord, Rhapsody, Mirage, Paradox, Promised, Outlaw).",
    validUntil: "Verified Active Today",
    isPopular: false,
    minSpend: "No minimum spend"
  },
  {
    code: "FREEDELIVERY",
    discount: "FREE SHIPPING",
    title: "Complimentary Air Express Shipping",
    description: "Free express pan-India air delivery across all 28 states and union territories.",
    validUntil: "Auto-applied at checkout",
    isPopular: false,
    minSpend: "All orders"
  },
  {
    code: "PARADOXFREE",
    discount: "FREE TESTER PACK",
    title: "Complimentary 7ML Paradox Tester",
    description: "Every 50ML Eau De Parfum bottle automatically includes a complimentary 7ML Paradox EDP luxury tester pack (worth ₹399).",
    validUntil: "Auto-included with every order",
    isPopular: false,
    minSpend: "Included with any 50ML EDP"
  }
];

const BEST_SELLERS = [
  {
    name: "Octopus Overlord",
    slug: "overlord",
    subtitle: "Smoky Leather & Royal Amber Oud",
    originalPrice: "₹2,099",
    salePrice: "₹1,299",
    couponPrice: "₹974",
    image: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png"
  },
  {
    name: "Octopus Rhapsody",
    slug: "rhapsody",
    subtitle: "Spicy Bergamot & Warm Cashmere",
    originalPrice: "₹2,099",
    salePrice: "₹1,299",
    couponPrice: "₹974",
    image: "/harsh-beniwal/octopus/perfumes/images/rhapsody_box.png"
  },
  {
    name: "Octopus Mirage",
    slug: "mirage",
    subtitle: "Aquatic Mineral & Fresh Marine",
    originalPrice: "₹2,099",
    salePrice: "₹1,299",
    couponPrice: "₹974",
    image: "/harsh-beniwal/octopus/perfumes/images/mirage_box.png"
  },
  {
    name: "Octopus Paradox",
    slug: "paradox",
    subtitle: "Bourbon Vanilla & Roasted Tonka",
    originalPrice: "₹2,099",
    salePrice: "₹1,299",
    couponPrice: "₹974",
    image: "/harsh-beniwal/octopus/perfumes/images/paradox_box.png"
  }
];

export default function CouponCodeClient() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="space-y-16">
      {/* Active Coupons Grid */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Tag size={13} className="text-amber-700" />
            Verified Active Today
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Latest Octopus Perfume Coupon Codes & Deals
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Click &quot;Copy Code&quot; and paste at checkout to receive immediate discounts on original Harsh Beniwal fragrances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COUPONS.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            return (
              <div
                key={coupon.code}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all ${
                  coupon.isPopular
                    ? "bg-gradient-to-br from-amber-50 via-white to-stone-50 border-amber-300 shadow-md ring-1 ring-amber-400/40"
                    : "bg-white border-stone-200 shadow-xs hover:shadow-sm"
                }`}
              >
                {coupon.isPopular && (
                  <span className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                    Most Popular · 25% OFF
                  </span>
                )}

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-800">
                      {coupon.discount}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
                      {coupon.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                    <Sparkles size={18} className="text-amber-600" />
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  {coupon.description}
                </p>

                {/* Coupon Code Strip */}
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-100/80 border border-stone-200 mb-4">
                  <div className="px-3 py-1 bg-white rounded-lg border border-stone-300">
                    <span className="font-mono text-base font-extrabold tracking-wider text-stone-900">
                      {coupon.code}
                    </span>
                  </div>
                  <button
                    onClick={() => copyCode(coupon.code)}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCopied
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-stone-900 hover:bg-black text-white"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>✓ {coupon.validUntil}</span>
                  <span>{coupon.minSpend}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Best Sellers Price with Coupon Applied */}
      <section className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-2xl mb-8">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Instant Savings Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Popular Octopus Perfumes with Code LUXURY25 Applied
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Apply code <span className="font-mono text-amber-300 font-bold">LUXURY25</span> at checkout and grab original 50ML Eau De Parfum by Harsh Beniwal for just ₹974!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BEST_SELLERS.map((perfume) => (
              <div
                key={perfume.slug}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400/40 transition-colors"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-stone-950">
                    <Image
                      src={perfume.image}
                      alt={perfume.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-base text-white">
                    {perfume.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                    {perfume.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-bold text-amber-400 font-serif">
                      {perfume.couponPrice}
                    </span>
                    <span className="text-xs text-stone-500 line-through">
                      {perfume.originalPrice}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold ml-auto">
                      Save ₹1,125
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mb-3">
                    Price with code <strong className="text-white font-mono">LUXURY25</strong>
                  </span>
                  <Link
                    href={`/products/${perfume.slug}`}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg text-center block transition-all"
                  >
                    Buy with 25% OFF
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">100% Original Bottles</h3>
          <p className="text-xs text-stone-600">
            Guaranteed authentic Harsh Beniwal Octopus perfumes directly from the official flagship warehouse.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <Truck size={22} />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">Free Express Air Shipping</h3>
          <p className="text-xs text-stone-600">
            Complimentary express pan-India delivery dispatched within 24 hours with real-time tracking.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <Gift size={22} />
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">Free 7ML Paradox Tester</h3>
          <p className="text-xs text-stone-600">
            Every 50ML order includes an authentic 7ML Paradox EDP luxury tester pack completely free.
          </p>
        </div>
      </section>

      {/* How to Apply Guide */}
      <section className="bg-stone-50 border border-stone-200 rounded-3xl p-8 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-6 text-center">
          How to Redeem Octopus Perfume Coupon Code in 3 Simple Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="font-serif font-bold text-base text-stone-900">Select Your Fragrance</h3>
            <p className="text-xs text-stone-600">
              Browse our collection of 50ML Eau De Parfums (Overlord, Rhapsody, Mirage, Paradox, Promised, Outlaw) and click &quot;Buy Now&quot;.
            </p>
          </div>
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="font-serif font-bold text-base text-stone-900">Paste Coupon at Checkout</h3>
            <p className="text-xs text-stone-600">
              In the order summary section, paste <strong className="font-mono text-stone-900">LUXURY25</strong> or <strong className="font-mono text-stone-900">OCTOPUS20</strong> and click &quot;Apply&quot;.
            </p>
          </div>
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="font-serif font-bold text-base text-stone-900">Enjoy Instant Savings</h3>
            <p className="text-xs text-stone-600">
              Watch your total reduce instantly. Complete payment via UPI, Debit/Credit Card, or NetBanking with zero shipping fee!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

