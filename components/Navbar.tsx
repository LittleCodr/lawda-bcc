"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gift, ShieldCheck, Truck, Star } from "lucide-react";
import { Menu, Search, ShoppingBag, X, ChevronDown, User } from "lucide-react";
import { useCartStore } from "@/lib/store";

const NAV_MENU = [
  { 
    label: "Gifts For Her",
    href: "/collections/gifts-for-her",
    subLinks: [
      { label: "Birthday Gifts", href: "/collections/birthday-gift-for-girlfriend" },
      { label: "Anniversary Gifts", href: "/collections/anniversary-gifts-for-wife" },
      { label: "Personalized Jewelry", href: "/collections/personalized-gifts-for-women" },
      { label: "Name Necklaces", href: "/collections/name-necklaces" }
    ]
  },
  { 
    label: "Gifts For Him",
    href: "/collections/gifts-for-him",
    subLinks: [
      { label: "Gifts for Boyfriend", href: "/collections/gifts-for-boyfriend" },
      { label: "Gifts for Husband", href: "/collections/gifts-for-husband" },
      { label: "Custom Keychains", href: "/collections/custom-keychain" },
      { label: "Engraved Bracelets", href: "/collections/personalized-gifts-for-men" },
    ]
  },
  {
    label: "Occasions",
    href: "/collections/all",
    subLinks: [
      { label: "Rakhi Gifts", href: "/collections/rakhi-gifts" },
      { label: "Valentine's Day", href: "/collections/valentine-gift" },
      { label: "Wedding Gifts", href: "/collections/wedding-gift" }
    ]
  },
  {
    label: "Budget",
    href: "/collections/all",
    subLinks: [
      { label: "Under ₹499", href: "/collections/gifts-under-499" },
      { label: "Under ₹999", href: "/collections/gifts-under-999" },
      { label: "Under ₹1499", href: "/collections/gifts-under-1499" }
    ]
  }
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top Notification Bar */}
      <div className="w-full bg-[#ffeaea] text-[#800020] py-2 hidden md:flex items-center justify-center gap-12 text-[10px] font-bold uppercase tracking-widest border-b border-[#E5B8B7]/30">
        <div className="flex items-center gap-2"><Gift size={12} strokeWidth={2} /> Personalized Just for You</div>
        <div className="flex items-center gap-2"><Truck size={12} strokeWidth={2} /> Fast Delivery Across India</div>
        <div className="flex items-center gap-2"><ShieldCheck size={12} strokeWidth={2} /> Secure & Safe Payments</div>
        <div className="flex items-center gap-2"><Star size={12} strokeWidth={2} /> 4.8/5 from 12,500+ Happy Customers</div>
      </div>
      
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-300 bg-white ${
          scrolled ? "shadow-md py-3" : "py-4 border-b border-gray-100"
        }`}
      >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 flex items-center justify-between">
        
        {/* Left Side: Navigation Links */}
        <div className="flex-1 relative z-10 flex items-center">
          <button
            className="xl:hidden p-2 -ml-2 text-[#2d2d2d] hover:text-[#800020] transition-colors"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <nav className="hidden xl:flex items-center gap-8">
            {NAV_MENU.map((item) => (
               <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors text-[#2d2d2d] hover:text-[#800020] py-4"
                >
                  {item.label}
                  <ChevronDown size={12} className={`transition-transform duration-300 ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                </Link>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-sm transition-all duration-300 origin-top ${
                  activeMenu === item.label ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="py-2">
                    {item.subLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-6 py-3 text-xs uppercase tracking-widest text-[#2d2d2d] hover:bg-[#FDF8F5] hover:text-[#800020] transition-colors"
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

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group z-0"
        >
          <span className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-[#800020]">
            Octopus
          </span>
          <span className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.3em] text-[#2d2d2d] mt-1">
            Personalized Gifts
          </span>
        </Link>

        {/* Right Side: Icons */}
        <div className="flex items-center gap-6 sm:gap-8 flex-1 justify-end relative z-10 text-[#2d2d2d]">
          <button aria-label="Search" className="flex flex-col items-center gap-1 hover:text-[#800020] transition-colors group">
             <Search size={20} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
             <span className="text-[10px] uppercase font-bold tracking-widest">Search</span>
          </button>
          <Link href="/account" aria-label="Account" className="flex flex-col items-center gap-1 hover:text-[#800020] transition-colors group">
             <User size={20} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
             <span className="text-[10px] uppercase font-bold tracking-widest">Account</span>
          </Link>
          <button
            aria-label="Cart"
            className="flex flex-col items-center gap-1 hover:text-[#800020] transition-colors relative group"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
              {totalItems() > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-[18px] h-[18px] rounded-full bg-[#800020] text-white font-bold text-[9px] flex items-center justify-center shadow-md">
                  {totalItems()}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest">Cart</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#FDF8F5] flex flex-col xl:hidden overflow-y-auto">
          <div className="h-[76px] flex items-center justify-between px-6 border-b border-[#E5B8B7]/30 shrink-0 sticky top-0 bg-[#FDF8F5]/90 backdrop-blur-md">
            <span className="font-serif text-2xl uppercase text-[#800020] tracking-widest">Octopus</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-[#2d2d2d] hover:text-[#800020] transition-colors">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex flex-col p-6 space-y-8">
            {NAV_MENU.map((item) => (
               <div key={item.label} className="border-b border-[#E5B8B7]/30 pb-6">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg uppercase tracking-widest font-medium text-[#800020] block mb-4"
                >
                  {item.label}
                </Link>
                <div className="flex flex-col gap-4 pl-4">
                  {item.subLinks.map(sub => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm uppercase tracking-widest text-[#2d2d2d] hover:text-[#800020]"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
    </>
  );
}
