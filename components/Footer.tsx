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
    <footer className="bg-white text-[#222222] border-t border-[#ebebeb] mt-20">
      
      {/* Top Subtle Value Proposition Strip (Airbnb Amenity Style) */}
      <div className="border-b border-[#ebebeb] bg-[#f7f7f7] py-6 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff385c] mt-1 shrink-0"></span>
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">25%+ French Oils</p>
              <p className="text-[13px] text-[#6a6a6a]">High-concentration Eau De Parfum</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="text-[#222222] mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">12+ Hours Longevity</p>
              <p className="text-[13px] text-[#6a6a6a]">Beast-mode projection for Indian weather</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck size={16} className="text-[#222222] mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">Free Pan-India Delivery</p>
              <p className="text-[13px] text-[#6a6a6a]">Dispatched via express air logistics</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-[#222222] mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#222222]">100% Original</p>
              <p className="text-[13px] text-[#6a6a6a]">Official Harsh Beniwal creation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 flex flex-col items-start pr-4">
            <Link href="/" className="mb-3">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#ff385c]">
                OCTOPUS
              </span>
            </Link>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[#222222] mb-2">
              Octopus Perfumes by Harsh Beniwal
            </p>
            <p className="text-[14px] text-[#6a6a6a] leading-relaxed max-w-sm mb-6">
              Official Indian house for high-concentration 50ML Eau De Parfum fragrances crafted by Harsh Beniwal. Every bottle order includes a complimentary 7ML Paradox discovery tester pack.
            </p>

            <div className="bg-[#f7f7f7] border border-[#dddddd] rounded-[10px] p-3.5 max-w-xs w-full flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#6a6a6a] block">Festive Coupon Code</span>
                <span className="font-mono text-[14px] font-bold text-[#222222]">DIWALI20</span>
              </div>
              <span className="bg-[#ff385c] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                20% OFF
              </span>
            </div>
          </div>

          {/* Fragrances */}
          <div className="md:col-span-3">
            <h4 className="text-[14px] font-semibold text-[#222222] mb-4">
              Fragrances
            </h4>
            <ul className="space-y-3">
              {FRAGRANCES_AND_GIFTS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-[#6a6a6a] hover:text-[#222222] hover:underline transition-colors block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recipient Collections */}
          <div className="md:col-span-2">
            <h4 className="text-[14px] font-semibold text-[#222222] mb-4">
              Gifting
            </h4>
            <ul className="space-y-3">
              {GIFTS_BY_RELATIONSHIP.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-[#6a6a6a] hover:text-[#222222] hover:underline transition-colors block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="text-[14px] font-semibold text-[#222222] mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-[#6a6a6a] hover:text-[#222222] hover:underline transition-colors block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Airbnb Legal Band */}
        <div className="mt-14 pt-6 border-t border-[#ebebeb] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#6a6a6a]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} Octopus Perfumes by Harsh Beniwal, Inc.</span>
            <span>•</span>
            <Link href="/pages/privacy-policy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/pages/terms-conditions" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
          </div>
          
          <div className="flex items-center gap-4 text-[#222222] font-semibold text-[13px]">
            <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <span>English (IN)</span>
            </span>
            <span>•</span>
            <span className="cursor-pointer hover:underline">₹ INR</span>
            <span>•</span>
            <span className="text-[#188038] font-normal text-xs flex items-center gap-1">
              <ShieldCheck size={14} /> 100% Prepaid Secure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
