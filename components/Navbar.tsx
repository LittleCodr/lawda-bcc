"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/store";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections/all", label: "Shop All" },
  { href: "/pages/about-us", label: "About Us" },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          ? "bg-white/80 backdrop-blur-lg border-b border-stone-200 py-3 shadow-sm" 
          : "bg-white/50 backdrop-blur-md py-4 border-b border-stone-100"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 flex items-center justify-between">
        <div className="flex-1 relative z-10">
          <button
            className="md:hidden p-2 -ml-2 text-stone-800 hover:text-stone-500 transition-colors"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <nav className="hidden md:flex items-center gap-12">
            {NAV_LINKS.map((l) => (
               <Link
                key={l.href}
                href={l.href}
                className={`text-sm uppercase tracking-widest font-medium transition-colors ${
                  scrolled ? "text-stone-600 hover:text-black" : "text-stone-800 hover:text-black"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 group z-0"
        >
          <span className={`font-serif text-2xl sm:text-3xl tracking-widest uppercase transition-colors ${
            scrolled ? "text-stone-900" : "text-stone-900"
          }`}>
            Everlasting
          </span>
        </Link>

        <div className={`flex items-center gap-5 sm:gap-6 flex-1 justify-end relative z-10 transition-colors ${
          scrolled ? "text-stone-700" : "text-stone-800"
        }`}>
          <button
            aria-label="Cart"
            className="relative p-2 hover:text-stone-500 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stone-900 text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                {totalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl flex flex-col md:hidden">
          <div className="h-[76px] flex items-center justify-between px-6 border-b border-stone-200/50">
            <span className="font-serif text-2xl uppercase text-stone-900 tracking-widest">Everlasting</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-stone-800 hover:text-stone-500 transition-colors">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-8">
            {NAV_LINKS.map((l) => (
               <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-6 text-2xl font-serif text-stone-800 hover:text-stone-500 border-b border-stone-100 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
