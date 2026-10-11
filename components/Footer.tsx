"use client";

import Link from "next/link";
import { Sparkles, Gift, Truck, ShieldCheck } from "lucide-react";

const GIFTS_BY_RELATIONSHIP = [
  { href: "/collections/gifts-for-her", label: "Gifts for Her" },
  { href: "/collections/gifts-for-him", label: "Gifts for Him" },
  { href: "/collections/gifts-for-girlfriend", label: "Gifts for Girlfriend" },
  { href: "/collections/gifts-for-wife", label: "Gifts for Wife" },
  { href: "/collections/gifts-for-boyfriend", label: "Gifts for Boyfriend" },
  { href: "/collections/gifts-for-husband", label: "Gifts for Husband" },
];

const FRAGRANCES_AND_GIFTS = [
  { href: "/harsh-beniwal/octopus/perfumes", label: "Harsh Beniwal Perfumes" },
  { href: "/products/overlord", label: "Overlord (Dior Sauvage DNA)" },
  { href: "/products/paradox", label: "Paradox (Les Sables Roses)" },
  { href: "/products/promised", label: "Promised (Baccarat Rouge 540)" },
  { href: "/products/rhapsody", label: "Rhapsody (Jazz Club)" },
  { href: "/collections/all", label: "Diwali Festive Gift Sets" },
  { href: "/collections/gifts-under-499", label: "Gifts Under ₹499" },
  { href: "/collections/gifts-under-999", label: "Gifts Under ₹999" },
];

const SUPPORT_LINKS = [
  { href: "/pages/about-us", label: "About Us" },
  { href: "/pages/shipping-policy", label: "Shipping Policy" },
  { href: "/pages/privacy-policy", label: "Privacy Policy" },
  { href: "/pages/returns-refund-policy", label: "Returns & Refunds" },
  { href: "/pages/terms-conditions", label: "Terms of Service" },
  { href: "/pages/contact", label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="bg-[#FFFDF9] text-black relative overflow-hidden border-t-3 border-black mt-20">
      
      {/* Top Neubrutalist Trust Strip */}
      <div className="border-b-2 border-black bg-amber-200 py-6 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-xl">🪔</span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Diwali Festive Ready</p>
              <p className="text-[10px] text-stone-700 font-bold">Signature Gift Hampers</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Sparkles size={20} className="text-black stroke-[2.5]" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">25%+ French Oils</p>
              <p className="text-[10px] text-stone-700 font-bold">12+ Hours High Projection</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Truck size={20} className="text-black stroke-[2.5]" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Pan-India Express</p>
              <p className="text-[10px] text-stone-700 font-bold">Free Shipping on Prepaid</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <ShieldCheck size={20} className="text-black stroke-[2.5]" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">100% Authentic</p>
              <p className="text-[10px] text-stone-700 font-bold">Official Harsh Beniwal Collab</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase font-black text-black">
                OCTOPUS
              </h2>
              <span className="text-xl">🪔</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 mb-4">
              Luxury Perfumes & Everlasting Keepsakes
            </p>
            <p className="text-sm text-stone-700 leading-relaxed max-w-sm mb-6 font-medium">
              India&apos;s premier destination for high-concentration Eau De Parfum fragrances crafted by Harsh Beniwal and bespoke anti-tarnish jewelry.
            </p>

            {/* Promo Pill Box */}
            <div className="bg-amber-100 border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000] w-full max-w-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block mb-1">
                🪔 Festive Coupon:
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-black">DIWALI20</span>
                <span className="text-[10px] bg-black text-amber-300 px-2 py-0.5 rounded font-black">20% OFF</span>
              </div>
            </div>
          </div>

          {/* Perfumes & Festive */}
          <div className="md:col-span-3">
            <p className="text-xs tracking-widest uppercase text-black mb-6 font-black border-b-2 border-black pb-2 inline-block">
              Fragrances & Gifts
            </p>
            <ul className="space-y-3">
              {FRAGRANCES_AND_GIFTS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-bold text-stone-800 hover:text-black hover:translate-x-1 transition-all inline-block"
                  >
                    • {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Relationships */}
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-black mb-6 font-black border-b-2 border-black pb-2 inline-block">
              Recipients
            </p>
            <ul className="space-y-3">
              {GIFTS_BY_RELATIONSHIP.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-bold text-stone-800 hover:text-black hover:translate-x-1 transition-all inline-block"
                  >
                    • {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-black mb-6 font-black border-b-2 border-black pb-2 inline-block">
              Support
            </p>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-bold text-stone-800 hover:text-black hover:translate-x-1 transition-all inline-block"
                  >
                    • {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t-2 border-black flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-bold text-stone-700 tracking-wider uppercase">
          <span>© {new Date().getFullYear()} OCTOPUS LUXURY PERFUMES & EVERLASTING GIFTS. ALL RIGHTS RESERVED.</span>
          <span className="flex items-center gap-2">
            <span>PAN-INDIA DELIVERY</span>
            <span>•</span>
            <span>CASH ON DELIVERY</span>
            <span>•</span>
            <span>100% SECURE CHECKOUT</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
