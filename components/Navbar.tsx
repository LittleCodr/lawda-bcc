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
    label: "Harsh Beniwal Perfumes",
    href: "/harsh-beniwal/octopus/perfumes",
    badge: "🔥 Flagship",
    subLinks: [
      { label: "All 50ML EDP Fragrances", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Overlord (Dior Sauvage DNA)", href: "/products/overlord" },
      { label: "Paradox (Louis Vuitton Les Sables Roses)", href: "/products/paradox" },
      { label: "Rhapsody (Maison Margiela Jazz Club)", href: "/products/rhapsody" },
      { label: "Your Move (Tom Ford Oud Wood)", href: "/products/your-move" },
      { label: "Somersault (Louis Vuitton Imagination)", href: "/products/somersault" },
      { label: "Promised (Baccarat Rouge 540)", href: "/products/promised" },
      { label: "Outlaw (Tom Ford Ombré Leather)", href: "/products/outlaw" },
      { label: "Mirage (Louis Vuitton Ombre Nomade)", href: "/products/mirage" },
      { label: "Darling (Dior Miss Dior)", href: "/products/darling-women" }
    ]
  },
  { 
    label: "Diwali Gift Sets",
    href: "/collections/all",
    badge: "🪔 Festive",
    subLinks: [
      { label: "Diwali Royal Fragrance Hampers", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Bespoke Jewelry Gift Boxes", href: "/collections/all" },
      { label: "Anniversary & Couple Keepsakes", href: "/collections/anniversary-gifts-for-wife" },
      { label: "Birthday Surprise Boxes", href: "/collections/birthday-gift-for-girlfriend" },
      { label: "Luxury Gift Sets Under ₹999", href: "/collections/gifts-under-999" }
    ]
  },
  { 
    label: "Gifts For Her",
    href: "/collections/gifts-for-her",
    subLinks: [
      { label: "Custom Name Necklaces", href: "/collections/name-necklaces" },
      { label: "Personalized Rings & Bracelets", href: "/collections/personalized-gifts-for-women" },
      { label: "Romantic Anniversary Gifts", href: "/collections/anniversary-gifts-for-wife" },
      { label: "Darling 50ML EDP Perfume", href: "/products/darling-women" }
    ]
  },
  { 
    label: "Gifts For Him",
    href: "/collections/gifts-for-him",
    subLinks: [
      { label: "Luxury EDP Fragrances", href: "/harsh-beniwal/octopus/perfumes" },
      { label: "Engraved Leather Wallets", href: "/collections/personalized-gifts-for-men" },
      { label: "Custom Stainless Steel Keychains", href: "/collections/custom-keychain" },
      { label: "Bold Cuff Bracelets", href: "/collections/personalized-gifts-for-men" }
    ]
  },
  {
    label: "Budget",
    href: "/collections/all",
    subLinks: [
      { label: "Gifts Under ₹499", href: "/collections/gifts-under-499" },
      { label: "Gifts Under ₹999", href: "/collections/gifts-under-999" },
      { label: "Gifts Under ₹1499", href: "/collections/gifts-under-1499" },
      { label: "Luxury EDPs (₹1299)", href: "/harsh-beniwal/octopus/perfumes" }
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
      {/* Top Neubrutalist Announcement Bar */}
      <Link 
        href="/harsh-beniwal/octopus/perfumes" 
        className="group w-full bg-amber-400 text-black py-2.5 px-4 hidden md:flex items-center justify-center gap-6 text-[11px] font-black uppercase tracking-wider border-b-2 border-black hover:bg-amber-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>🪔</span>
          <span>DIWALI FESTIVE SALE: 20% OFF SITEWIDE</span>
        </div>
        <div className="flex items-center gap-2 bg-black text-amber-300 px-3 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]">
          USE CODE <strong className="font-mono text-yellow-300 underline">DIWALI20</strong>
        </div>
        <div className="flex items-center gap-2 text-stone-900 font-bold">
          <Truck size={14} className="stroke-[2.5]" /> FREE PAN-INDIA EXPRESS SHIPPING & COD
        </div>
        <div className="flex items-center gap-1 font-black group-hover:translate-x-1 transition-transform">
          EXPLORE PERFUMES →
        </div>
      </Link>
      
      {/* Mobile Marquee Strip */}
      <div className="block md:hidden">
        <Link href="/harsh-beniwal/octopus/perfumes">
          <Marquee />
        </Link>
      </div>
      
      {/* Main Navbar */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-200 bg-[#FFFDF9] border-b-2 border-black ${
          scrolled ? "shadow-[0_4px_0_0_#000]" : ""
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-3 flex items-center justify-between">
          
          {/* Left Side: Mobile Menu Button & Desktop Navigation */}
          <div className="flex-1 relative z-10 flex items-center">
            <button
              className="xl:hidden p-2 -ml-2 text-black bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} strokeWidth={2.5} />
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
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:text-amber-600 py-3 transition-colors"
                  >
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] bg-amber-200 text-black px-1.5 py-0.2 rounded border border-black font-black">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform duration-200 ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                  </Link>
                  
                  {/* Neubrutalist Dropdown Menu */}
                  <div className={`absolute top-full left-0 w-72 bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] rounded-xl transition-all duration-200 origin-top overflow-hidden ${
                    activeMenu === item.label ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    <div className="py-2">
                      {item.subLinks.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-stone-800 hover:bg-amber-100 hover:text-black border-b border-stone-100 last:border-b-0 transition-colors"
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
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-widest uppercase text-black">
                OCTOPUS
              </span>
              <span className="text-base">🪔</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-stone-700 -mt-1">
              LUXURY PERFUMES & GIFTS
            </span>
          </Link>

          {/* Right Side: Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end relative z-10 text-black">
            <button 
              aria-label="Search" 
              onClick={() => setSearchOpen(true)} 
              className="p-2 sm:px-3 sm:py-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2"
            >
              <Search size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline text-[11px] uppercase font-black tracking-wider">Search</span>
            </button>

            <Link 
              href="/account" 
              aria-label="Account" 
              className="p-2 sm:px-3 sm:py-2 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2"
            >
              <User size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline text-[11px] uppercase font-black tracking-wider">Account</span>
            </Link>

            <button
              aria-label="Cart"
              className="p-2 sm:px-4 sm:py-2 bg-black text-amber-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#f59e0b] hover:bg-stone-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 relative cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline text-[11px] uppercase font-black tracking-wider">Cart</span>
              {totalItems() > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-black font-black text-[10px] rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                  {totalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex xl:hidden animate-in fade-in duration-200">
            <div className="w-[85%] max-w-sm bg-[#FFFDF9] border-r-3 border-black h-full flex flex-col shadow-[8px_0px_0px_0px_#000] overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b-2 border-black bg-amber-400 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-black uppercase text-black tracking-wider">OCTOPUS</span>
                  <span>🪔</span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  aria-label="Close menu" 
                  className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  <X size={18} strokeWidth={2.5} className="text-black" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-6 space-y-6 flex-1">
                {NAV_MENU.map((item) => (
                  <div key={item.label} className="border-2 border-black rounded-xl p-4 bg-white shadow-[3px_3px_0px_0px_#000]">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm uppercase tracking-wider font-black text-black flex items-center justify-between mb-3"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-amber-200 text-black px-1.5 py-0.5 rounded border border-black font-black">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-col gap-2 pl-2 border-l-2 border-amber-300">
                      {item.subLinks.map(sub => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs uppercase tracking-wide font-bold text-stone-700 hover:text-black py-1"
                        >
                          • {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Mobile Promo Box */}
                <div className="bg-amber-100 border-2 border-black rounded-xl p-4 text-center shadow-[3px_3px_0px_0px_#000]">
                  <p className="text-[11px] font-black uppercase tracking-wider text-black mb-1">
                    🪔 DIWALI CELEBRATION OFFER
                  </p>
                  <p className="text-xs text-stone-800 font-medium mb-2">
                    Use code <strong className="font-mono bg-black text-amber-300 px-1.5 py-0.5 rounded">DIWALI20</strong> for 20% OFF!
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
