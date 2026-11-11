import Link from "next/link";
import { ShieldCheck, Truck, Gift, Lock } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    heading: "Shop Catalog",
    links: [
      { label: "All Perfumes", href: "/collections/all" },
      { label: "Bestsellers", href: "/collections/bestsellers" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Perfumes for Men", href: "/collections/men" },
      { label: "Perfumes for Women", href: "/collections/women" },
      { label: "Unisex Signatures", href: "/collections/unisex" },
      { label: "Miniatures & Vials", href: "/collections/miniatures" },
      { label: "Gift Sets & Coffrets", href: "/collections/gift-sets" },
    ],
  },
  {
    heading: "Fragrance Houses",
    links: [
      { label: "Brands Directory A–Z", href: "/brands" },
      { label: "Harsh Beniwal × Octopus", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Middle Eastern Houses", href: "/collections/middle-eastern-perfumes" },
      { label: "Designer Classics", href: "/collections/designer-perfumes" },
      { label: "Niche Perfumery", href: "/collections/niche-perfumes" },
      { label: "Lattafa", href: "/brands/lattafa" },
      { label: "Rasasi", href: "/brands/rasasi" },
      { label: "Christian Dior", href: "/brands/christian-dior" },
    ],
  },
  {
    heading: "Notes & Occasions",
    links: [
      { label: "Amber, Oud & Resin", href: "/collections/amber-oud" },
      { label: "Woody & Vetiver", href: "/collections/woody" },
      { label: "Citrus & Fresh", href: "/collections/citrus-fresh" },
      { label: "Office & Daily Wear", href: "/collections/office" },
      { label: "Date Night & Evening", href: "/collections/date-night" },
      { label: "Under ₹1,500", href: "/collections/under-1500" },
      { label: "₹1,500 – ₹3,000", href: "/collections/1500-to-3000" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { label: "Fragrance Journal", href: "/journal" },
      { label: "About Octopus", href: "/pages/about-us" },
      { label: "My Account & Orders", href: "/account" },
      { label: "Shopping Bag", href: "/cart" },
      { label: "Search Perfumes", href: "/search" },
      { label: "Shipping Policy", href: "/pages/shipping-policy" },
      { label: "Returns & Refunds", href: "/pages/returns-refund-policy" },
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
      { label: "Terms & Conditions", href: "/pages/terms-conditions" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E8E6E1] bg-white">
      {/* Restraint Service Pillars Above Dark Footer */}
      <div className="bg-[#F7F6F3] border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "100% Original Sealed",
              desc: "Verified batch codes across every designer, niche, and UAE house",
            },
            {
              icon: Truck,
              title: "Free India Express",
              desc: "Complimentary pan-India shipping with honeycombed transit wrap",
            },
            {
              icon: Gift,
              title: "Free 7ML Paradox Tester",
              desc: "Complimentary French-oil pocket spray included on every order",
            },
            {
              icon: Lock,
              title: "Encrypted Prepaid PayU",
              desc: "UPI, Credit/Debit Cards, NetBanking & tiered bundle pricing",
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center shrink-0 text-[#9A7953]">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#242424]">
                    {pillar.title}
                  </p>
                  <p className="text-xs text-[#777777] mt-0.5 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Dark Luxury Footer */}
      <div className="bg-[#1F1D1B] text-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
            {/* Editorial Brand Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <p className="font-serif text-2xl font-semibold tracking-[0.18em] text-white">
                  OCTOPUS
                </p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9A7953] mt-0.5">
                  Fine Fragrances India
                </p>
              </div>
              <p className="text-xs text-[#B5B0A8] leading-relaxed max-w-sm">
                India&apos;s destination for factory-sealed Designer, Haute Niche, and Middle Eastern Extraits alongside the 25%+ French oil Harsh Beniwal × Octopus signature series.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-[6px] border border-[#35312D] bg-[#282522] text-xs">
                <span className="text-[#B5B0A8]">Prepaid Code:</span>
                <strong className="text-white tracking-wider">LUXURY25</strong>
                <span className="text-[#9A7953]">(25% OFF &gt; ₹499)</span>
              </div>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-4">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-xs text-[#D4CFC7] hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-[#35312D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#96928B]">
            <p>© {new Date().getFullYear()} Octopus Perfumes India. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/pages/contact" className="hover:text-white transition-colors">
                Contact &amp; Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
