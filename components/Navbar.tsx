"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gift, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Menu, Search, ShoppingBag, X, ChevronDown, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import SearchModal from "./SearchModal";
import Marquee from "./Marquee";

const NAV_MENU = [
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
  },
  {
    label: "Festive Offers",
    href: "/harsh-beniwal/octopus/perfumes",
    badge: "🪔 20% OFF",
    subLinks: [
      { label: "Free 7ML Paradox Tester Pack (₹399 Value)", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Single 50ML EDP @ ₹1,299", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Code DIWALI20 for Extra 20% OFF", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Free Express Pan-India Delivery", href: "/harsh-beniwal/octopus/perfumes" }
    ]
  }
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top Subtle Brand Notification Hairline */}
      <div className="w-full bg-[#f7f7f7] border-b border-[#ebebeb] text-[#222222] py-2 px-4 hidden md:flex items-center justify-center gap-6 text-[12px] font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff385c]"></span>
          <span>100% Original 50ML Eau De Parfums by Harsh Beniwal</span>
        </div>
        <span className="text-[#dddddd]">•</span>
        <div className="flex items-center gap-1.5 text-[#222222]">
          <span>Use code</span>
          <strong className="font-mono bg-[#ffffff] border border-[#dddddd] text-[#ff385c] px-2 py-0.5 rounded-md text-[11px] font-bold">DIWALI20</strong>
          <span>for 20% OFF</span>
        </div>
        <span className="text-[#dddddd]">•</span>
        <div className="text-[#6a6a6a]">Free Pan-India Express Shipping on all prepaid orders</div>
      </div>
      
      {/* Mobile Marquee Strip */}
      <div className="block md:hidden">
        <Link href="/harsh-beniwal/octopus/perfumes">
          <Marquee />
        </Link>
      </div>
      
      {/* Main Airbnb Top Navigation (80px height, pure white, 1px bottom hairline) */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-200 bg-white border-b border-[#ebebeb] ${
          scrolled ? "shadow-airbnb" : ""
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-20 flex items-center justify-between">
          
          {/* Flush Left: Brand Wordmark */}
          <Link
            href="/"
            className="flex flex-col items-start group shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#ff385c] group-hover:text-[#e00b41] transition-colors">
                OCTOPUS
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-wide text-[#6a6a6a] -mt-1">
              by Harsh Beniwal
            </span>
          </Link>

          {/* Dead Center: Signature Airbnb Pill-Shaped Search Bar */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="search-bar-pill flex items-center h-12 pl-6 pr-2 py-2 gap-4 text-left cursor-pointer"
            >
              <div className="flex flex-col pr-3 border-r border-[#ebebeb]">
                <span className="text-[12px] font-semibold text-[#222222]">Any Scent</span>
                <span className="text-[12px] text-[#6a6a6a] truncate max-w-[100px]">9 Niche EDPs</span>
              </div>
              <div className="flex flex-col pr-3 border-r border-[#ebebeb]">
                <span className="text-[12px] font-semibold text-[#222222]">Longevity</span>
                <span className="text-[12px] text-[#6a6a6a]">12+ Hours</span>
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-[12px] font-semibold text-[#222222]">For Whom</span>
                <span className="text-[12px] text-[#6a6a6a]">Him / Her / Unisex</span>
              </div>
              <div className="search-orb shrink-0 w-8 h-8 rounded-full bg-[#ff385c] text-white flex items-center justify-center ml-2">
                <Search size={14} strokeWidth={2.5} />
              </div>
            </button>
          </div>

          {/* Flush Right: Product Navigation & Account/Cart Pills */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/harsh-beniwal/octopus/perfumes"
              className="hidden sm:inline-block text-[14px] font-medium text-[#222222] hover:bg-[#f7f7f7] px-3.5 py-2.5 rounded-full transition-colors"
            >
              Explore 9 EDPs
            </Link>

            <Link
              href="/products/paradox"
              className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-medium text-[#222222] bg-[#f7f7f7] hover:bg-[#ebebeb] px-3 py-1.5 rounded-full transition-colors"
            >
              <Gift size={13} className="text-[#ff385c]" />
              Free 7ML Tester Included
            </Link>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 text-[#222222] hover:bg-[#f7f7f7] rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2} />
            </button>

            {/* Combined User & Cart Pill (Airbnb Account Menu Style) */}
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
              className="xl:hidden p-2 text-[#222222] hover:bg-[#f7f7f7] rounded-full transition-colors -mr-2"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Glassmorphism */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-md flex xl:hidden animate-in fade-in duration-200">
            <div className="w-[85%] max-w-sm backdrop-blur-2xl bg-white/95 border-r border-[#DADCE0] h-full flex flex-col shadow-2xl overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#DADCE0] bg-gradient-to-r from-[#1A73E8] to-[#4285F4] shrink-0 text-white">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-black uppercase tracking-wider text-white">OCTOPUS</span>
                  <span className="w-2 h-2 rounded-full bg-[#FBBC05]"></span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  aria-label="Close menu" 
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center text-white active:scale-95 cursor-pointer"
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-6 space-y-4 flex-1">
                {NAV_MENU.map((item) => (
                  <div key={item.label} className="backdrop-blur-md bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl p-4 shadow-xs">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm uppercase tracking-wider font-bold text-[#202124] flex items-center justify-between mb-3"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-[#E8F0FE] text-[#1A73E8] px-2 py-0.5 rounded-full border border-[#4285F4]/30 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-col gap-2 pl-2 border-l border-[#4285F4]/40">
                      {item.subLinks.map(sub => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs uppercase tracking-wide font-medium text-[#5F6368] hover:text-[#1A73E8] py-1"
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Mobile Promo Box */}
                <div className="bg-[#E8F0FE] backdrop-blur-md border border-[#4285F4]/30 rounded-2xl p-4 text-center shadow-xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#1A73E8] mb-1">
                    FESTIVE CELEBRATION OFFER
                  </p>
                  <p className="text-xs text-[#202124] font-medium mb-2">
                    Use code <strong className="font-mono bg-[#1A73E8] text-white px-2 py-0.5 rounded-full text-xs">DIWALI20</strong> for 20% OFF!
                  </p>
                </div>
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
