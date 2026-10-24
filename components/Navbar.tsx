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
      {/* Top Glassmorphic Announcement Bar */}
      <Link 
        href="/harsh-beniwal/octopus/perfumes" 
        className="group w-full bg-gradient-to-r from-amber-500/90 via-amber-400/95 to-yellow-400/90 backdrop-blur-md text-stone-950 py-2.5 px-4 hidden md:flex items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-wider border-b border-amber-500/20 shadow-sm hover:opacity-95 transition-all"
      >
        <div className="flex items-center gap-2">
          <span>🪔</span>
          <span>DIWALI FESTIVE SALE: 20% OFF ALL PERFUMES</span>
        </div>
        <div className="flex items-center gap-2 bg-stone-950/90 text-amber-300 px-3 py-0.5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">
          USE CODE <strong className="font-mono text-yellow-300 underline">DIWALI20</strong>
        </div>
        <div className="flex items-center gap-2 text-stone-900 font-semibold">
          <Truck size={14} className="stroke-[2.5]" /> FREE PAN-INDIA EXPRESS SHIPPING • 100% PREPAID SECURE
        </div>
        <div className="flex items-center gap-1 font-extrabold text-stone-950 group-hover:translate-x-1 transition-transform">
          EXPLORE 9 EDP SCENTS →
        </div>
      </Link>
      
      {/* Mobile Marquee Strip */}
      <div className="block md:hidden">
        <Link href="/harsh-beniwal/octopus/perfumes">
          <Marquee />
        </Link>
      </div>
      
      {/* Main Glass Navbar */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-300 backdrop-blur-xl bg-white/75 border-b border-white/60 ${
          scrolled ? "shadow-[0_10px_30px_rgba(0,0,0,0.06)] bg-white/85" : ""
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left Side: Mobile Menu Button & Desktop Navigation */}
          <div className="flex-1 relative z-10 flex items-center">
            <button
              className="xl:hidden p-2.5 -ml-2 text-stone-900 bg-white/80 backdrop-blur-md border border-stone-200/70 rounded-xl shadow-sm hover:shadow-md hover:bg-white active:scale-95 transition-all"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>

            <nav className="hidden xl:flex items-center gap-6">
              {NAV_MENU.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-amber-600 py-3 transition-colors"
                  >
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300/60 font-bold backdrop-blur-sm">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 opacity-60 ${activeMenu === item.label ? 'rotate-180 opacity-100' : ''}`} />
                  </Link>
                  
                  {/* Glassmorphic Dropdown Menu */}
                  <div className={`absolute top-full left-0 w-72 backdrop-blur-2xl bg-white/90 border border-white/80 shadow-[0_20px_45px_rgba(0,0,0,0.08)] rounded-2xl transition-all duration-300 origin-top overflow-hidden p-2 ${
                    activeMenu === item.label ? 'opacity-100 scale-100 pointer-events-auto translate-y-1' : 'opacity-0 scale-95 pointer-events-none translate-y-0'
                  }`}>
                    <div className="py-1">
                      {item.subLinks.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-stone-700 hover:text-amber-900 hover:bg-amber-50/80 rounded-xl transition-all"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <Link
            href="/"
            className="flex flex-col items-center group z-20 w-fit whitespace-nowrap px-2"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-widest uppercase bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 bg-clip-text text-transparent">
                OCTOPUS
              </span>
              <span className="text-base animate-soft-pulse">🪔</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-amber-700 -mt-1">
              BY HARSH BENIWAL • LUXURY EDP
            </span>
          </Link>

          {/* Right Side: Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end relative z-10 text-stone-800">
            <button 
              aria-label="Search" 
              onClick={() => setSearchOpen(true)} 
              className="p-2 sm:px-3.5 sm:py-2 bg-white/80 backdrop-blur-md border border-stone-200/70 rounded-xl shadow-sm hover:shadow-md hover:bg-white active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search size={17} strokeWidth={2.2} className="text-stone-700" />
              <span className="hidden sm:inline text-[11px] uppercase font-bold tracking-wider text-stone-700">Search</span>
            </button>

            <Link 
              href="/account" 
              aria-label="Account" 
              className="p-2 sm:px-3.5 sm:py-2 bg-white/80 backdrop-blur-md border border-stone-200/70 rounded-xl shadow-sm hover:shadow-md hover:bg-white active:scale-95 transition-all flex items-center gap-2"
            >
              <User size={17} strokeWidth={2.2} className="text-stone-700" />
              <span className="hidden sm:inline text-[11px] uppercase font-bold tracking-wider text-stone-700">Account</span>
            </Link>

            <button
              aria-label="Cart"
              className="p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-stone-950 to-stone-900 text-amber-300 border border-stone-800 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.25)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 relative cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag size={17} strokeWidth={2.2} />
              <span className="hidden sm:inline text-[11px] uppercase font-bold tracking-wider">Cart</span>
              {totalItems() > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-[10px] rounded-full shadow-sm">
                  {totalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Glassmorphism */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex xl:hidden animate-in fade-in duration-200">
            <div className="w-[85%] max-w-sm backdrop-blur-2xl bg-white/90 border-r border-white/60 h-full flex flex-col shadow-2xl overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-amber-300/40 bg-gradient-to-r from-amber-400 to-yellow-400 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-black uppercase text-stone-950 tracking-wider">OCTOPUS</span>
                  <span>🪔</span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  aria-label="Close menu" 
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
                >
                  <X size={18} strokeWidth={2.2} className="text-stone-900" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-6 space-y-4 flex-1">
                {NAV_MENU.map((item) => (
                  <div key={item.label} className="backdrop-blur-md bg-white/70 border border-stone-200/60 rounded-2xl p-4 shadow-sm">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm uppercase tracking-wider font-bold text-stone-900 flex items-center justify-between mb-3"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-col gap-2 pl-2 border-l border-amber-300">
                      {item.subLinks.map(sub => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs uppercase tracking-wide font-medium text-stone-700 hover:text-amber-700 py-1"
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Mobile Promo Box */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50/80 backdrop-blur-md border border-amber-200/80 rounded-2xl p-4 text-center shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                    🪔 DIWALI CELEBRATION OFFER
                  </p>
                  <p className="text-xs text-stone-800 font-medium mb-2">
                    Use code <strong className="font-mono bg-stone-900 text-amber-300 px-2 py-0.5 rounded-full text-xs">DIWALI20</strong> for 20% OFF!
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
