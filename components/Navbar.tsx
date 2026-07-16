"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { products } from "@/lib/products";
import { formatINR } from "@/lib/products";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections/all", label: "Collection" },
  { href: "/pages/about-us", label: "Heritage" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

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
            className="md:hidden p-2 -ml-2 text-stone-800 hover:text-gold transition-colors"
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
                className={`text-xs tracking-[0.2em] uppercase font-medium transition-colors ${
                  scrolled ? "text-stone-600 hover:text-gold" : "text-stone-800 hover:text-gold"
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
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
             <Image src="/logo.png" alt="Octopus" fill className="object-cover" />
          </div>
          <span className={`font-serif-display text-2xl sm:text-3xl tracking-[0.15em] uppercase transition-colors ${
            scrolled ? "text-stone-900" : "text-stone-900"
          }`}>
            Octopus
          </span>
        </Link>

        <div className={`flex items-center gap-5 sm:gap-6 flex-1 justify-end relative z-10 transition-colors ${
          scrolled ? "text-stone-700" : "text-stone-800"
        }`}>
          <button
            aria-label="Search"
            className="p-2 hover:text-gold transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <div className="relative group hidden sm:block">
            <Link
              href={user ? "/account" : "/auth"}
              aria-label={user ? "Account" : "Sign In"}
              className="p-2 flex items-center gap-2 hover:text-gold transition-colors"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
            
            {user && (
              <div className="absolute right-0 top-full pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-white/90 backdrop-blur-xl border border-stone-200 overflow-hidden shadow-xl rounded-2xl">
                  <div className="p-5 border-b border-stone-100 bg-stone-50/50">
                    <p className="text-sm font-medium text-stone-900 truncate">{user.displayName || "My Account"}</p>
                    <p className="text-xs text-stone-500 truncate mt-1">{user.email}</p>
                  </div>
                  <div className="flex flex-col py-2">
                    <Link href="/account" className="px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors flex justify-between items-center group/link">
                      <span>View Profile</span>
                      <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-gold">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            aria-label="Cart"
            className="relative p-2 hover:text-gold transition-colors"
            onClick={openCart}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-900 text-white font-bold text-[9px] flex items-center justify-center shadow-md">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl flex flex-col md:hidden">
          <div className="h-[76px] flex items-center justify-between px-6 border-b border-stone-200/50">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Octopus" width={32} height={32} className="rounded-full shadow-sm" />
              <span className="font-serif-display text-2xl uppercase text-stone-900 tracking-[0.1em]">Octopus</span>
            </div>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-stone-800 hover:text-gold transition-colors">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-8">
            {NAV_LINKS.map((l) => (
               <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-6 text-2xl font-serif-display text-stone-800 hover:text-gold border-b border-stone-100 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={user ? "/account" : "/auth"}
              onClick={() => setMobileOpen(false)}
              className="py-6 text-2xl font-serif-display text-stone-800 hover:text-gold border-b border-stone-100 transition-colors"
            >
              {user ? "My Account" : "Sign In"}
            </Link>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
              <Search size={22} strokeWidth={1.5} className="text-stone-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the collection..."
                className="w-full bg-transparent outline-none text-stone-900 text-lg font-medium placeholder:text-stone-400 placeholder:font-normal"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="text-stone-400 hover:text-stone-900 transition-colors">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            {results.length > 0 && (
              <ul className="mt-4 max-h-[60vh] overflow-y-auto no-scrollbar divide-y divide-stone-50">
                {results.map((p) => (
                  <li key={p.slug}>
                     <Link
                      href={`/products/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between py-4 group hover:bg-stone-50 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <span className="text-stone-700 group-hover:text-stone-900 font-medium">{p.name}</span>
                      <span className="text-stone-500 text-sm tracking-widest">{formatINR(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {query.trim() && results.length === 0 && (
              <p className="mt-8 text-center text-stone-400 tracking-widest text-sm uppercase">No fragrances found.</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
