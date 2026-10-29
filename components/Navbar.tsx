"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gift, ShieldCheck, Truck, Sparkles, Menu, Search, ShoppingBag, X, ChevronDown, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import SearchModal from "./SearchModal";
import Marquee from "./Marquee";

const NAV_MENU = [
  { 
    label: "All Perfumes",
    href: "/collections/all",
    badge: "2,300+ Bottles",
    subLinks: [
      { label: "Explore Entire Catalog", href: "/collections/all" },
      { label: "Best-Selling Fragrances", href: "/collections/all?sort=price-desc" },
      { label: "Men's Beast-Mode Scents", href: "/collections/all" },
      { label: "Women's Luxury Florals", href: "/collections/all" },
      { label: "Under ₹1,999 Budget Beasts", href: "/collections/all?sort=price-asc" },
      { label: "High-Concentration Extraits", href: "/collections/all" },
    ]
  },
  { 
    label: "Fragrance Brands",
    href: "/brands",
    badge: "130+ Houses",
    subLinks: [
      { label: "Browse All 136 Perfume Brands", href: "/brands" },
      { label: "Lattafa Perfumes (Dubai)", href: "/brands/lattafa" },
      { label: "Armaf & Club De Nuit", href: "/brands/armaf" },
      { label: "Afnan & 9PM Collection", href: "/brands/afnan" },
      { label: "Rasasi (Hawas & Dubai Royalty)", href: "/brands/rasasi" },
      { label: "French Avenue (Paris Corner)", href: "/brands/french-avenue" },
      { label: "Christian Dior Haute Parfumerie", href: "/brands/christian-dior" },
      { label: "Tom Ford Private Blend", href: "/brands/tom-ford" },
    ]
  },
  { 
    label: "Harsh Beniwal EDPs",
    href: "/harsh-beniwal/octopus/perfumes",
    badge: "🔥 In-House",
    subLinks: [
      { label: "All 9 Flagship Fragrances (50ML)", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Overlord (Dior Sauvage DNA)", href: "/products/overlord" },
      { label: "Paradox (LV Les Sables Roses)", href: "/products/paradox" },
      { label: "Promised (Baccarat Rouge 540 DNA)", href: "/products/promised" },
      { label: "Outlaw (Tom Ford Ombré Leather DNA)", href: "/products/outlaw" },
      { label: "Mirage (LV Ombre Nomade DNA)", href: "/products/mirage" },
      { label: "Somersault (LV Imagination DNA)", href: "/products/somersault" },
      { label: "Rhapsody (Maison Margiela Jazz Club)", href: "/products/rhapsody" },
      { label: "Your Move (Tom Ford Oud Wood)", href: "/products/your-move" },
      { label: "Darling Women (Miss Dior DNA)", href: "/products/darling-women" }
    ]
  },
  { 
    label: "Perfumes For Him",
    href: "/collections/all",
    subLinks: [
      { label: "Overlord 50ML EDP (Beast-Mode Sauvage)", href: "/products/overlord" },
      { label: "Armaf Club De Nuit Collection", href: "/brands/armaf" },
      { label: "Afnan 9PM Eau De Parfum", href: "/brands/afnan" },
      { label: "Rasasi Hawas for Him", href: "/brands/rasasi" },
      { label: "Outlaw 50ML EDP (Bold Leather)", href: "/products/outlaw" },
    ]
  },
  { 
    label: "Perfumes For Her",
    href: "/products/darling-women",
    subLinks: [
      { label: "Darling 50ML EDP (Floral & Seductive)", href: "/products/darling-women" },
      { label: "Promised 50ML EDP (Sweet Amber & Jasmine)", href: "/products/promised" },
      { label: "Paradox 50ML EDP (Luxury Rose & Amber)", href: "/products/paradox" },
      { label: "Lattafa Yara & Floral Delights", href: "/brands/lattafa" },
      { label: "Complimentary 7ML Paradox Tester Included", href: "/products/darling-women" }
    ]
  }
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top Brand Notification Hairline - Luxury Fragrance House */}
      <div className="w-full bg-stone-900 text-stone-200 py-2 px-4 flex items-center justify-center gap-3 sm:gap-6 text-[12px] font-medium shadow-xs border-b border-stone-800">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span className="font-bold tracking-wide text-white">Flat 25% OFF on 130+ Luxury Fragrance Houses</span>
          <span className="hidden md:inline text-stone-600">·</span>
          <span className="hidden md:inline text-stone-300">Harsh Beniwal & Designer Brands</span>
        </div>
        <span className="text-stone-600 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span className="text-stone-300">Use code</span>
          <strong className="font-mono bg-amber-400 text-stone-950 px-2 py-0.5 rounded text-[11px] font-bold shadow-xs">
            LUXURY25
          </strong>
          <span className="text-stone-300 hidden sm:inline">for Flat 25% OFF</span>
        </div>
        <span className="text-stone-600 hidden lg:inline">•</span>
        <div className="text-stone-300 hidden lg:flex items-center gap-1">
          <Gift size={13} className="text-amber-400" />
          <span>Free 7ML Paradox Tester Included</span>
        </div>
      </div>
      
      {/* Mobile Marquee Strip */}
      <div className="block md:hidden">
        <Link href="/collections/all">
          <Marquee />
        </Link>
      </div>
      
      {/* Main Top Navigation (80px height, pure white, 1px bottom hairline) */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-200 bg-white border-b border-[#ebebeb] ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 h-20 flex items-center justify-between">
          
          {/* Flush Left: Brand Wordmark */}
          <Link
            href="/"
            className="flex flex-col items-start group shrink-0"
          >
            <span className="font-serif tracking-[0.2em] text-xl sm:text-2xl font-bold uppercase text-[#222222] group-hover:text-stone-900 transition-colors">
              OCTOPUS
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#6a6a6a] -mt-1 group-hover:text-amber-600 transition-colors">
              HAUTE PARFUMERIE
            </span>
          </Link>

          {/* Desktop Center Navigation with Hover Dropdowns */}
          <nav className="hidden xl:flex items-center gap-7">
            {NAV_MENU.map((item) => (
              <div key={item.label} className="relative group py-6">
                <Link
                  href={item.href}
                  className="text-[13px] font-medium text-[#222222] hover:text-amber-700 transition-colors tracking-wide flex items-center gap-1 cursor-pointer"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-stone-900 text-amber-400 px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                      {item.badge}
                    </span>
                  )}
                  <ChevronDown size={13} className="text-[#6a6a6a] group-hover:rotate-180 group-hover:text-amber-700 transition-transform duration-200" />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-[#ebebeb] p-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="flex flex-col gap-1">
                    {item.subLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="text-xs font-medium text-[#222222] hover:bg-stone-50 hover:text-amber-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Right Area: Search Pill, Account, Cart, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search Pill */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 border border-[#dddddd] hover:border-stone-400/80 bg-white hover:bg-stone-50 rounded-full py-2 px-3.5 sm:px-4 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer text-[#222222]"
              aria-label="Search perfumes"
            >
              <Search size={15} className="text-[#222222]" strokeWidth={2.2} />
              <span className="text-[13px] font-medium hidden sm:inline text-[#222222]">
                Search 2,300+ perfumes...
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 bg-[#f7f7f7] text-[#6a6a6a] text-[10px] px-2 py-0.5 rounded-md font-mono border border-[#ebebeb]">
                ⌘K
              </kbd>
            </button>

            {/* Account & Cart Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link 
                href="/account" 
                aria-label="Account"
                className="text-[#222222] hover:text-amber-700 text-[13px] font-medium p-2 rounded-full hover:bg-stone-50 transition-colors"
              >
                <User size={18} strokeWidth={2} />
              </Link>
              <span className="h-4 w-px bg-[#dddddd]"></span>
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-black text-white px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={14} strokeWidth={2.2} />
                <span>Cart</span>
                {totalItems() > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center -mr-1">
                    {totalItems()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              className="xl:hidden p-2 text-[#222222] hover:bg-[#f7f7f7] rounded-full transition-colors -mr-1"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex xl:hidden animate-in fade-in duration-200">
            <div className="w-[85%] max-w-sm bg-white border-r border-[#ebebeb] h-full flex flex-col shadow-2xl overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#ebebeb] bg-stone-900 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-bold uppercase tracking-wider text-white">OCTOPUS</span>
                  <span className="text-amber-400">✨</span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  aria-label="Close menu" 
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white active:scale-95 cursor-pointer"
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>

              {/* Mobile Promo Box */}
              <div className="p-4 bg-stone-50 border-b border-stone-200">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wide mb-1">
                  <Sparkles size={13} className="text-amber-600" />
                  <span>Flat 25% OFF Code</span>
                </div>
                <p className="text-[12px] text-stone-600 leading-snug mb-2">
                  Use coupon <strong className="font-mono bg-white px-2 py-0.5 rounded border border-stone-300 text-stone-900">LUXURY25</strong> for 25% OFF on all brands!
                </p>
                <Link
                  href="/collections/all"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-full py-2 bg-stone-900 hover:bg-black text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Shop Entire Catalog &rarr;
                </Link>
              </div>

              {/* Drawer Links */}
              <div className="p-5 space-y-3 flex-1">
                {NAV_MENU.map((item) => (
                  <div key={item.label} className="bg-[#f7f7f7] border border-[#ebebeb] rounded-xl p-3.5">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs uppercase tracking-wider font-bold text-[#222222] flex items-center justify-between mb-2.5"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-stone-900 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-col gap-1.5 pl-2 border-l border-stone-300">
                      {item.subLinks.map(sub => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs tracking-wide font-medium text-[#6a6a6a] hover:text-stone-900 py-0.5"
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
            <div className="flex-1" onClick={() => setMobileOpen(false)}></div>
          </div>
        )}

        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
    </>
  );
}
