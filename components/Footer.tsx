"use client";

import Link from "next/link";

const GIFTS_BY_RELATIONSHIP = [
  { href: "/collections/gifts-for-her", label: "Gifts for Her" },
  { href: "/collections/gifts-for-him", label: "Gifts for Him" },
  { href: "/collections/gifts-for-girlfriend", label: "Gifts for Girlfriend" },
  { href: "/collections/gifts-for-wife", label: "Gifts for Wife" },
  { href: "/collections/gifts-for-boyfriend", label: "Gifts for Boyfriend" },
  { href: "/collections/gifts-for-husband", label: "Gifts for Husband" },
];

const GIFTS_BY_BUDGET = [
  { href: "/collections/gifts-under-499", label: "Under ₹499" },
  { href: "/collections/gifts-under-999", label: "Under ₹999" },
  { href: "/collections/gifts-under-1499", label: "Under ₹1499" },
  { href: "/collections/personalized-gifts-for-women", label: "Personalized Jewelry" },
  { href: "/collections/name-necklaces", label: "Name Necklaces" },
];

const SUPPORT_LINKS = [
  { href: "/pages/about-us", label: "About Us" },
  { href: "/pages/shipping-policy", label: "Shipping" },
  { href: "/pages/privacy-policy", label: "Privacy" },
  { href: "/pages/returns-refund-policy", label: "Returns" },
  { href: "/pages/terms-conditions", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="bg-stone-50 text-stone-900 relative overflow-hidden border-t border-stone-200 mt-20">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-4 flex flex-col items-start">
            <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase mb-6 text-[#800020]">
              Octopus
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm mb-8 font-medium tracking-wide">
              Personalized gifts for every relationship, every occasion, and every budget.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-8 font-bold">By Relationship</p>
            <ul className="space-y-4">
              {GIFTS_BY_RELATIONSHIP.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-stone-600 hover:text-[#800020] transition-colors flex items-center gap-2 group"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-8 font-bold">Trending</p>
            <ul className="space-y-4">
              {GIFTS_BY_BUDGET.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-stone-600 hover:text-[#800020] transition-colors flex items-center gap-2 group"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-8 font-bold">Support</p>
            <ul className="space-y-4">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-stone-600 hover:text-[#800020] transition-colors flex items-center gap-2 group"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 tracking-widest uppercase">
          <span>© {new Date().getFullYear()} Octopus Gifts. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
