"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X, ChevronDown, User } from "lucide-react";
import { useCartStore } from "@/lib/store";

const NAV_MENU = [
  { 
    label: "Gifts For Her",
    href: "/collections/gifts-for-her",
    subLinks: [
      { label: "Necklaces", href: "/collections/name-necklaces" },
      { label: "Earrings", href: "/collections/earrings" },
      { label: "Rings", href: "/collections/name-rings" },
      { label: "Anklets", href: "/collections/anklets" }
    ]
  },
  { 
    label: "Gifts For Him",
    href: "/collections/gifts-for-him",
    subLinks: [
      { label: "Personalised Bracelets", href: "/collections/personalised-jewellery" },
      { label: "Cufflinks", href: "/collections/cufflinks" },
    ]
  },
  {
    label: "Personalised",
    href: "/collections/personalised-jewellery",
    subLinks: [
      { label: "Name Necklaces", href: "/collections/name-necklaces" },
      { label: "Name Rings", href: "/collections/name-rings" },
      { label: "Photo Gifts", href: "/collections/photo-gifts" }
    ]
  },
  {
    label: "Occasions",
    href: "/collections/all",
    subLinks: [
      { label: "Anniversary", href: "/collections/anniversary" },
      { label: "Birthday", href: "/collections/birthday" },
      { label: "Wedding", href: "/collections/wedding" }
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
    <header
      className={`sticky top-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-[#FDF8F5]/90 backdrop-blur-lg border-b border-[#E5B8B7]/30 py-3 shadow-sm" 
          : "bg-[#FDF8F5]/60 backdrop-blur-md py-4 border-b border-[#E5B8B7]/20"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 flex items-center justify-between">
        <div className="flex-1 relative z-10 flex items-center gap-6">
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
                  className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors text-[#2d2d2d] hover:text-[#800020] py-4"
                >
                  {item.label}
                  <ChevronDown size={12} className={`transition-transform duration-300 ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                </Link>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 w-56 bg-white border border-[#E5B8B7]/30 shadow-xl rounded-sm transition-all duration-300 origin-top ${
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

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group z-0"
        >
          <span className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-[#800020]">
            Everlasting
          </span>
          <span className="hidden sm:block text-[9px] uppercase tracking-[0.3em] text-[#2d2d2d] mt-1">Gifts for every moment</span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-6 flex-1 justify-end relative z-10 text-[#2d2d2d]">
          <Link href="/account" aria-label="Account" className="relative p-2 hover:text-[#800020] transition-colors">
             <User size={22} strokeWidth={1.5} />
          </Link>
          <button
            aria-label="Cart"
            className="relative p-2 hover:text-[#800020] transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {totalItems() > 0 && (
              <span className="absolute 0 top-0 -right-1 w-5 h-5 rounded-full bg-[#800020] text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                {totalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#FDF8F5] flex flex-col xl:hidden overflow-y-auto">
          <div className="h-[76px] flex items-center justify-between px-6 border-b border-[#E5B8B7]/30 shrink-0 sticky top-0 bg-[#FDF8F5]/90 backdrop-blur-md">
            <span className="font-serif text-2xl uppercase text-[#800020] tracking-widest">Everlasting</span>
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
  );
}
