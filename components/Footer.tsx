"use client";

import Link from "next/link";
import { Sparkles, Gift, Truck, ShieldCheck, Droplets } from "lucide-react";

const TOP_FRAGRANCE_BRANDS = [
  { href: "/brands", label: "All 136 Perfume Brands" },
  { href: "/brands/lattafa", label: "Lattafa Perfumes (Dubai)" },
  { href: "/brands/armaf", label: "Armaf & Club De Nuit" },
  { href: "/brands/afnan", label: "Afnan (9PM & Supremacy)" },
  { href: "/brands/rasasi", label: "Rasasi (Hawas Collection)" },
  { href: "/brands/french-avenue", label: "French Avenue (Paris Corner)" },
  { href: "/brands/christian-dior", label: "Christian Dior" },
  { href: "/brands/tom-ford", label: "Tom Ford Private Blend" },
];

const SIGNATURE_FRAGRANCES = [
  { href: "/collections/all", label: "Explore 2,300+ Perfumes" },
  { href: "/harsh-beniwal/octopus/perfumes", label: "Harsh Beniwal 9 Flagship EDPs" },
  { href: "/products/overlord", label: "Overlord (Dior Sauvage DNA)" },
  { href: "/products/rhapsody", label: "Rhapsody (Spicy Citrus & Amber)" },
  { href: "/products/paradox", label: "Paradox (LV Les Sables Roses)" },
  { href: "/products/promised", label: "Promised (Baccarat Rouge 540)" },
  { href: "/products/outlaw", label: "Outlaw (Tom Ford Ombré Leather)" },
  { href: "/products/mirage", label: "Mirage (LV Ombre Nomade)" },
  { href: "/octopus-perfume-coupon-code", label: "Octopus Coupon Codes (25% OFF)" },
];

const SUPPORT_LINKS = [
  { href: "/pages/about-us", label: "About Us" },
  { href: "/pages/shipping-policy", label: "Shipping Policy" },
  { href: "/pages/privacy-policy", label: "Privacy Policy" },
  { href: "/pages/returns-refund-policy", label: "Returns & Refunds (7-Day)" },
  { href: "/pages/terms-conditions", label: "Terms of Service" },
  { href: "/pages/contact", label: "Contact Us" },
  { href: "/sitemap.xml", label: "HTML Sitemap Index" },
];

export default function Footer() {
  return (
    <footer className="bg-white text-[#222222] border-t border-[#ebebeb] mt-20">
      
      {/* Top Subtle Value Proposition Strip */}
      <div className="border-b border-[#ebebeb] bg-[#f7f7f7] py-6 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3">
            <Droplets size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">25%+ French Oils</p>
              <p className="text-[13px] text-[#6a6a6a]">High-concentration Eau De Parfum</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">12+ Hours Longevity</p>
              <p className="text-[13px] text-[#6a6a6a]">Beast-mode projection for Indian weather</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck size={18} className="text-stone-800 mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">Free Pan-India Delivery</p>
              <p className="text-[13px] text-[#6a6a6a]">Dispatched via express priority air</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">100% Original & Sealed</p>
              <p className="text-[13px] text-[#6a6a6a]">Verified batch codes & authenticity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 flex flex-col items-start pr-4">
            <Link href="/" className="mb-2">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#222222]">
                OCTOPUS
              </span>
            </Link>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6a6a6a] mb-3">
              HAUTE PARFUMERIE & LUXURY FRAGRANCE HOUSE
            </p>
            <p className="text-[14px] text-[#6a6a6a] leading-relaxed max-w-sm mb-6">
              India&apos;s premier online luxury perfumery. Sourcing 2,300+ authentic fragrances from 136 world-class perfume houses alongside the official Harsh Beniwal signature collection.
            </p>

            <Link href="/octopus-perfume-coupon-code" className="bg-[#f7f7f7] hover:bg-[#efefef] transition-colors border border-[#dddddd] rounded-xl p-3.5 max-w-xs w-full flex items-center justify-between group">
              <div>
                <span className="text-[11px] font-semibold text-[#6a6a6a] block group-hover:text-amber-800 transition-colors">Octopus Perfume Coupon Code</span>
                <span className="font-mono text-[14px] font-bold text-[#222222]">LUXURY25</span>
              </div>
              <span className="bg-stone-900 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                25% OFF
              </span>
            </Link>
          </div>

          {/* Fragrance Brands */}
          <div className="md:col-span-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#222222] mb-4">
              Iconic Brands
            </h4>
            <ul className="space-y-2.5">
              {TOP_FRAGRANCE_BRANDS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-[#6a6a6a] hover:text-[#222222] hover:underline transition-colors block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Signatures & Collections */}
          <div className="md:col-span-2">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#222222] mb-4">
              Signatures
            </h4>
            <ul className="space-y-2.5">
              {SIGNATURE_FRAGRANCES.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-[#6a6a6a] hover:text-[#222222] hover:underline transition-colors block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#222222] mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-[#6a6a6a] hover:text-[#222222] hover:underline transition-colors block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Legal Band */}
        <div className="mt-14 pt-6 border-t border-[#ebebeb] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#6a6a6a]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} OCTOPUS Luxury Perfumes, Inc. All rights reserved.</span>
            <span>•</span>
            <Link href="/pages/privacy-policy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/pages/terms-conditions" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
          </div>
          
          <div className="flex items-center gap-4 text-[#222222] font-semibold text-[13px]">
            <span className="flex items-center gap-1.5">
              <span>English (IN)</span>
            </span>
            <span>•</span>
            <span>₹ INR</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
              <ShieldCheck size={14} /> 100% Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
