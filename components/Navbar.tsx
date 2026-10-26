"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gift, ShieldCheck, Truck, Sparkles, Menu, Search, ShoppingBag, X, ChevronDown, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import SearchModal from "./SearchModal";
import Marquee from "./Marquee";

const NAV_MENU = [
  { 
    label: "Diwali Gift Sets",
    href: "/diwali-gifts",
    badge: "🪔 20% OFF",
    subLinks: [
      { label: "Diwali Fragrance Hampers 2026", href: "/diwali-gifts" },
      { label: "Royal Couple Hamper (Overlord + Darling)", href: "/diwali-gifts" },
      { label: "Emperor's Connoisseur Trio (Sauvage + BR540 + Ombre)", href: "/diwali-gifts" },
      { label: "Corporate Diwali Gifting Boxes", href: "/diwali-gifts" },
      { label: "Diwali Fragrance Gifting Guide 2026", href: "/diwali-gift-ideas" },
    ]
  },
  { 
    label: "Harsh Beniwal EDPs",
    href: "/harsh-beniwal/octopus/perfumes",
    badge: "🔥 Flagship",
    subLinks: [
      { label: "All 9 EDP Fragrances (50ML)", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Overlord (Dior Sauvage DNA)", href: "/products/overlord" },
      { label: "Paradox (Louis Vuitton Les Sables Roses)", href: "/products/paradox" },
      { label: "Promised (Baccarat Rouge 540 DNA)", href: "/products/promised" },
      { label: "Outlaw (Tom Ford Ombré Leather DNA)", href: "/products/outlaw" },
      { label: "Mirage (Louis Vuitton Ombre Nomade)", href: "/products/mirage" },
      { label: "Somersault (Louis Vuitton Imagination)", href: "/products/somersault" },
      { label: "Rhapsody (Maison Margiela Jazz Club)", href: "/products/rhapsody" },
      { label: "Your Move (Tom Ford Oud Wood)", href: "/products/your-move" },
      { label: "Darling Women (Miss Dior DNA)", href: "/products/darling-women" }
    ]
  },
  { 
    label: "Fragrance Notes",
    href: "/harsh-beniwal/octopus/perfumes",
    badge: "✨ Sillage",
    subLinks: [
      { label: "Fresh & Citrus (Overlord, Somersault)", href: "/products/overlord" },
      { label: "Rich Amber & Smoky Oud (Paradox, Mirage)", href: "/products/paradox" },
      { label: "Warm Spice & Saffron (Promised)", href: "/products/promised" },
      { label: "Sensual Leather (Outlaw)", href: "/products/outlaw" },
      { label: "Floral & Elegant (Darling Women)", href: "/products/darling-women" }
    ]
  },
  { 
    label: "Perfumes For Her",
    href: "/products/darling-women",
    subLinks: [
      { label: "Darling 50ML EDP (Floral & Seductive)", href: "/products/darling-women" },
      { label: "Promised 50ML EDP (Sweet Amber & Jasmine)", href: "/products/promised" },
      { label: "Paradox 50ML EDP (Luxury Rose & Amber)", href: "/products/paradox" },
      { label: "Complimentary 7ML Paradox Tester", href: "/products/darling-women" }
    ]
  },
  { 
    label: "Perfumes For Him",
    href: "/harsh-beniwal/octopus/perfumes",
    subLinks: [
      { label: "Overlord 50ML EDP (Beast-Mode Sauvage DNA)", href: "/products/overlord" },
      { label: "Outlaw 50ML EDP (Bold Ombre Leather)", href: "/products/outlaw" },
      { label: "Your Move 50ML EDP (Smoky Oud Wood)", href: "/products/your-move" },
      { label: "Mirage 50ML EDP (Desert Ombre Nomade)", href: "/products/mirage" }
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
      {/* Top Festive Brand Notification Hairline - Diwali Themed */}
      <div className="w-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white py-2 px-4 flex items-center justify-center gap-3 sm:gap-6 text-[12px] font-medium shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🪔</span>
          <span className="font-bold tracking-wide">Shubh Deepavali 2026 Sale</span>
          <span className="hidden md:inline text-amber-200">·</span>
          <span className="hidden md:inline">Harsh Beniwal Fragrances</span>
        </div>
        <span className="text-amber-300/60 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span>Use code</span>
          <strong className="font-mono bg-white text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs">
            DIWALI20
          </strong>
          <span>for Flat 20% OFF</span>
        </div>
        <span className="text-amber-300/60 hidden lg:inline">•</span>
        <div className="text-amber-100 hidden lg:flex items-center gap-1">
          <Gift size={13} className="text-amber-200" />
          <span>Free 7ML Paradox Tester + Deluxe Festive Box Included</span>
        </div>
      </div>
      
      {/* Mobile Marquee Strip */}
      <div className="block md:hidden">
        <Link href="/diwali-gifts">
          <Marquee />
        </Link>
      </div>
      
      {/* Main Top Navigation (80px height, pure white, 1px bottom hairline) */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-200 bg-white border-b border-[#ebebeb] ${
          scrolled ? "shadow-airbnb" : ""
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 h-20 flex items-center justify-between">
          
          {/* Flush Left: Brand Wordmark */}
          <Link
            href="/"
            className="flex flex-col items-start group shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#ff385c] group-hover:text-[#e00b41] transition-colors">
                OCTOPUS
              </span>
              <span className="text-xs">🪔</span>
            </div>
            <span className="text-[10px] font-semibold tracking-wide text-[#6a6a6a] -mt-1">
              by Harsh Beniwal
            </span>
          </Link>

          {/* Dead Center: Search Bar */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="search-bar-pill flex items-center h-12 pl-6 pr-2 py-2 gap-4 text-left cursor-pointer"
            >
              <div className="flex flex-col pr-3 border-r border-[#ebebeb]">
                <span className="text-[12px] font-semibold text-[#222222]">Diwali Gifts</span>
                <span className="text-[12px] text-[#6a6a6a] truncate max-w-[100px]">9 Niche EDPs</span>
              </div>
              <div className="flex flex-col pr-3 border-r border-[#ebebeb]">
                <span className="text-[12px] font-semibold text-[#222222]">Longevity</span>
                <span className="text-[12px] text-[#6a6a6a]">12+ Hours</span>
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-[12px] font-semibold text-[#222222]">Offer Code</span>
                <span className="text-[12px] text-amber-700 font-bold">DIWALI20</span>
              </div>
              <div className="search-orb shrink-0 w-8 h-8 rounded-full bg-[#ff385c] text-white flex items-center justify-center ml-2">
                <Search size={14} strokeWidth={2.5} />
              </div>
            </button>
          </div>

          {/* Flush Right: Product Navigation & Festive Links */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Diwali Festive Highlights Button */}
            <Link
              href="/diwali-gifts"
              className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 text-amber-900 hover:border-amber-400 text-[13px] font-bold px-3.5 py-2 rounded-full shadow-2xs transition-all hover:scale-102"
            >
              <span>🪔</span>
              <span>Diwali Gift Sets</span>
              <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                20% OFF
              </span>
            </Link>

            <Link
              href="/harsh-beniwal/octopus/perfumes"
              className="hidden md:inline-block text-[14px] font-medium text-[#222222] hover:bg-[#f7f7f7] px-3 py-2 rounded-full transition-colors"
            >
              Explore 9 EDPs
            </Link>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 text-[#222222] hover:bg-[#f7f7f7] rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2} />
            </button>

            {/* Combined User & Cart Pill */}
            <div className="flex items-center border border-[#dddddd] rounded-full p-1 pl-3 shadow-airbnb hover:shadow-airbnb-hover transition-all bg-white gap-2">
              <Link 
                href="/account" 
                aria-label="Account"
                className="text-[#222222] hover:text-[#ff385c] text-[13px] font-medium pr-1"
              >
                <User size={18} strokeWidth={2} />
              </Link>
              <span className="h-4 w-px bg-[#dddddd]"></span>
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 bg-[#222222] hover:bg-[#000000] text-white px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={14} strokeWidth={2.2} />
                <span>Cart</span>
                {totalItems() > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ff385c] text-white font-bold text-[10px] flex items-center justify-center -mr-1">
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
              
              {/* Drawer Header with Festive Touch */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#ebebeb] bg-gradient-to-r from-amber-600 to-amber-700 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-bold uppercase tracking-wider text-white">OCTOPUS</span>
                  <span>🪔</span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  aria-label="Close menu" 
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white active:scale-95 cursor-pointer"
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>

              {/* Mobile Promo Box */}
              <div className="p-4 bg-amber-50 border-b border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide mb-1">
                  <span>🪔</span>
                  <span>Diwali Festive Sale Active</span>
                </div>
                <p className="text-[12px] text-[#3f3f3f] leading-snug mb-2">
                  Use coupon <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">DIWALI20</strong> for 20% OFF!
                </p>
                <Link
                  href="/diwali-gifts"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Shop Diwali Gift Sets &rarr;
                </Link>
              </div>

              {/* Drawer Links */}
              <div className="p-5 space-y-3.5 flex-1">
                {NAV_MENU.map((item) => (
                  <div key={item.label} className="bg-[#f7f7f7] border border-[#ebebeb] rounded-xl p-3.5">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs uppercase tracking-wider font-bold text-[#222222] flex items-center justify-between mb-2.5"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-col gap-1.5 pl-2 border-l border-amber-300/80">
                      {item.subLinks.map(sub => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs tracking-wide font-medium text-[#6a6a6a] hover:text-[#ff385c] py-0.5"
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
