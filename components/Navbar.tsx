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
      className={`sticky top-0 w-full z-40 transition-all duration-500 ${
        scrolled ? "glass-nav py-2 shadow-sm" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 flex items-center justify-between">
        <div className="flex-1 relative z-10">
          <button
            className="md:hidden p-2 -ml-2 text-ink/80 hover:text-ink"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[10px] tracking-[0.25em] uppercase text-ink/70 hover:text-gold transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 group z-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-ink/10 group-hover:border-gold/50 transition-colors">
             <Image src="/logo.png" alt="Octopus" fill className="object-cover" />
          </div>
          <span className="font-serif-display text-xl sm:text-2xl md:text-3xl tracking-[0.15em] sm:tracking-[0.2em] uppercase text-ink">
            Octopus
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-5 flex-1 justify-end text-ink/80 relative z-10">
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
                <div className="glass-panel overflow-hidden shadow-lg rounded-xl">
                  <div className="p-5 border-b border-ink/5 bg-ink/5">
                    <p className="text-sm font-medium text-ink truncate">{user.displayName || "My Account"}</p>
                    <p className="text-xs text-ink/60 truncate mt-1">{user.email}</p>
                  </div>
                  <div className="flex flex-col py-2">
                    <Link href="/account" className="px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink/5 text-ink/80 hover:text-ink transition-colors flex justify-between items-center group/link">
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
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-white font-bold text-[9px] flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-paper/95 backdrop-blur-xl flex flex-col md:hidden">
          <div className="h-[76px] flex items-center justify-between px-5 border-b border-ink/10">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Octopus" width={32} height={32} className="rounded-full border border-ink/10" />
              <span className="font-serif-display text-2xl uppercase text-ink tracking-[0.1em]">Octopus</span>
            </div>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-ink hover:text-gold transition-colors">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-5 text-xl font-serif-display text-ink/80 hover:text-gold border-b border-ink/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={user ? "/account" : "/auth"}
              onClick={() => setMobileOpen(false)}
              className="py-5 text-xl font-serif-display text-ink/80 hover:text-gold border-b border-ink/5 transition-colors"
            >
              {user ? "My Account" : "Sign In"}
            </Link>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
          <div
            className="w-full max-w-2xl glass-panel rounded-2xl p-6 shadow-xl border border-ink/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
              <Search size={22} strokeWidth={1.5} className="text-gold" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the collection..."
                className="w-full bg-transparent outline-none text-ink text-lg tracking-wide placeholder:text-ink/30"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="text-ink/50 hover:text-ink transition-colors">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            {results.length > 0 && (
              <ul className="mt-4 max-h-[60vh] overflow-y-auto no-scrollbar divide-y divide-ink/5">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between py-4 group hover:bg-ink/5 -mx-4 px-4 rounded-lg transition-colors"
                    >
                      <span className="text-ink/90 group-hover:text-gold font-medium tracking-wider">{p.name}</span>
                      <span className="text-ink/50 text-sm tracking-widest">{formatINR(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {query.trim() && results.length === 0 && (
              <p className="mt-8 text-center text-ink/40 tracking-widest text-sm uppercase">No fragrances found.</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
