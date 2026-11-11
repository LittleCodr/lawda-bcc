"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import SearchModal from "@/components/SearchModal";
import type { BrandTier } from "@/lib/catalog";

export interface NavBrandItem {
  name: string;
  slug: string;
  tier: BrandTier;
  count: number;
}

interface NavbarProps {
  topBrands?: NavBrandItem[];
}

type MegaKey = "shop" | "brands" | null;

const SHOP_BY_CATEGORY = [
  { label: "All Perfumes (1,700+)", href: "/collections/all" },
  { label: "Perfumes for Men", href: "/collections/men" },
  { label: "Perfumes for Women", href: "/collections/women" },
  { label: "Unisex Fragrances", href: "/collections/unisex" },
  { label: "Middle Eastern Houses", href: "/collections/middle-eastern-perfumes" },
  { label: "Designer Houses", href: "/collections/designer-perfumes" },
  { label: "Niche & Haute Parfumerie", href: "/collections/niche-perfumes" },
  { label: "Miniatures & Discovery Sets", href: "/collections/miniatures" },
  { label: "Gift Sets & Coffrets", href: "/collections/gift-sets" },
];

const SHOP_BY_FAMILY_OCCASION = [
  { label: "Amber, Oud & Resins", href: "/collections/amber-oud" },
  { label: "Woody & Vetiver", href: "/collections/woody" },
  { label: "Citrus & Fresh", href: "/collections/citrus-fresh" },
  { label: "Floral & White Blossom", href: "/collections/floral" },
  { label: "Gourmand & Vanilla", href: "/collections/gourmand" },
  { label: "Office & Daily Wear", href: "/collections/office" },
  { label: "Date Night & Evening", href: "/collections/date-night" },
  { label: "Wedding & Festive", href: "/collections/wedding-festive" },
];

const SHOP_BY_BUDGET_SIZE = [
  { label: "Under ₹1,500", href: "/collections/under-1500" },
  { label: "₹1,500 – ₹3,000", href: "/collections/1500-to-3000" },
  { label: "₹3,000 – ₹5,000", href: "/collections/3000-to-5000" },
  { label: "₹5,000 – ₹9,000", href: "/collections/5000-to-9000" },
  { label: "Collector & Niche ₹9,000+", href: "/collections/premium" },
  { label: "30ml & Travel Sizes", href: "/collections/size-30ml" },
  { label: "50ml Signature Bottles", href: "/collections/size-50ml" },
  { label: "100ml Full Bottles", href: "/collections/size-100ml" },
];

const FALLBACK_BRANDS: NavBrandItem[] = [
  { name: "Lattafa", slug: "lattafa", tier: "middle-eastern", count: 116 },
  { name: "Rasasi", slug: "rasasi", tier: "middle-eastern", count: 51 },
  { name: "French Avenue", slug: "french-avenue", tier: "middle-eastern", count: 45 },
  { name: "Afnan", slug: "afnan", tier: "middle-eastern", count: 37 },
  { name: "Armaf", slug: "armaf", tier: "middle-eastern", count: 28 },
  { name: "Christian Dior", slug: "christian-dior", tier: "designer", count: 39 },
  { name: "Hermes", slug: "hermes", tier: "designer", count: 47 },
  { name: "Tom Ford", slug: "tom-ford", tier: "designer", count: 36 },
  { name: "Hugo Boss", slug: "hugo-boss", tier: "designer", count: 38 },
  { name: "Paco Rabanne", slug: "paco-rabanne", tier: "designer", count: 34 },
  { name: "Creed", slug: "creed", tier: "niche", count: 18 },
  { name: "Guerlain", slug: "guerlain", tier: "niche", count: 32 },
  { name: "Xerjoff", slug: "xerjoff", tier: "niche", count: 28 },
  { name: "Memo Paris", slug: "memo-paris", tier: "niche", count: 27 },
  { name: "Parfums de Marly", slug: "parfums-de-marly", tier: "niche", count: 21 },
];

const subscribeClient = () => () => {};
function subscribeWishlist(cb: () => void) {
  window.addEventListener("octopus-wishlist-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("octopus-wishlist-change", cb);
    window.removeEventListener("storage", cb);
  };
}
function getWishlistSnapshot() {
  try {
    const raw = window.localStorage.getItem("octopus_wishlist");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function Navbar({ topBrands }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCartStore();
  const { user } = useAuth();

  const mounted = useSyncExternalStore(subscribeClient, () => true, () => false);
  const wishlistCount = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    () => 0
  );

  const [prevPathname, setPrevPathname] = useState(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>("shop");

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveMega(null);
    setMobileOpen(false);
  }

  const navWrapRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const brandSource = topBrands && topBrands.length > 0 ? topBrands : FALLBACK_BRANDS;
  const designerBrands = brandSource.filter((b) => b.tier === "designer").slice(0, 14);
  const meBrands = brandSource.filter((b) => b.tier === "middle-eastern").slice(0, 14);
  const nicheBrands = brandSource.filter((b) => b.tier === "niche").slice(0, 14);

  // Sync mobile native drawer <dialog>
  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    if (mobileOpen && !dialog.open) {
      dialog.showModal();
    } else if (!mobileOpen && dialog.open) {
      dialog.close();
    }
  }, [mobileOpen]);

  // Esc & outside pointer close for desktop Mega Menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMega(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navWrapRef.current && !navWrapRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const openMegaHover = (key: MegaKey) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMega(key);
  };

  const scheduleCloseMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setActiveMega(null), 160);
  };

  const closeAllDesktop = () => setActiveMega(null);

  const isRouteActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleDrawerBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const panel = drawerRef.current?.firstElementChild;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    if (e.clientX > rect.right || e.clientX < rect.left || e.clientY > rect.bottom || e.clientY < rect.top) {
      setMobileOpen(false);
    }
  };

  return (
    <div ref={navWrapRef} onMouseLeave={scheduleCloseMega}>
      {/* Compact Announcement Bar (Real Store Policies Only) */}
      <div className="bg-[#1F1D1B] text-[#F7F6F3] text-[11px] sm:text-xs border-b border-[#35312D]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center sm:justify-between gap-4">
          <p className="truncate font-medium tracking-[0.04em]">
            100% Authentic Sealed Fragrances · Free Express Shipping Across India
          </p>
          <p className="hidden sm:flex items-center gap-2 shrink-0 text-[#D4CFC7]">
            <Sparkles size={12} className="text-[#9A7953]" />
            <span>
              Free 7ML Paradox EDP Tester on All Orders · Extra 25% OFF Code:{" "}
              <strong className="text-white font-semibold tracking-wider">LUXURY25</strong>
            </span>
          </p>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E6E1]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[66px] sm:h-[72px] flex items-center justify-between gap-3 sm:gap-5">
          {/* Left: Mobile Drawer Button + Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-2 rounded-[6px] text-[#242424] hover:bg-[#F7F6F3] transition-colors cursor-pointer"
            >
              <Menu size={21} />
            </button>

            <Link
              href="/"
              className="flex flex-col leading-none group py-1"
              onClick={closeAllDesktop}
            >
              <span className="font-serif text-[22px] sm:text-[26px] font-semibold tracking-[0.14em] text-[#242424] group-hover:text-[#9A7953] transition-colors">
                OCTOPUS
              </span>
              <span className="text-[9px] uppercase tracking-[0.26em] text-[#777777] font-medium mt-0.5 hidden sm:block">
                Fine Fragrances
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links & Mega Menu Triggers */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center justify-center gap-5 xl:gap-7"
          >
            <div onMouseEnter={() => openMegaHover("shop")}>
              <button
                type="button"
                aria-expanded={activeMega === "shop"}
                aria-controls="mega-menu-shop"
                onClick={() => setActiveMega((m) => (m === "shop" ? null : "shop"))}
                className={`inline-flex items-center gap-1 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeMega === "shop"
                    ? "border-[#1F1D1B] text-[#1F1D1B] font-semibold"
                    : "border-transparent text-[#3E3C38] hover:text-[#1F1D1B]"
                }`}
              >
                Shop Perfumes
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-150 ${
                    activeMega === "shop" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div onMouseEnter={() => openMegaHover("brands")}>
              <button
                type="button"
                aria-expanded={activeMega === "brands"}
                aria-controls="mega-menu-brands"
                onClick={() => setActiveMega((m) => (m === "brands" ? null : "brands"))}
                className={`inline-flex items-center gap-1 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeMega === "brands" || isRouteActive("/brands")
                    ? "border-[#1F1D1B] text-[#1F1D1B] font-semibold"
                    : "border-transparent text-[#3E3C38] hover:text-[#1F1D1B]"
                }`}
              >
                Brands A–Z
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-150 ${
                    activeMega === "brands" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {[
              { label: "Middle East", href: "/collections/middle-eastern-perfumes" },
              { label: "Designer", href: "/collections/designer-perfumes" },
              { label: "Niche", href: "/collections/niche-perfumes" },
              { label: "Miniatures", href: "/collections/miniatures" },
              { label: "Bestsellers", href: "/collections/bestsellers" },
              { label: "Journal", href: "/journal" },
            ].map((item) => {
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={closeAllDesktop}
                  onClick={closeAllDesktop}
                  aria-current={active ? "page" : undefined}
                  className={`py-2 text-[13px] whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-[#1F1D1B] text-[#1F1D1B] font-semibold"
                      : "border-transparent font-medium text-[#3E3C38] hover:text-[#1F1D1B]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Utility Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open product search"
              className="inline-flex items-center gap-2 px-2.5 xl:px-3.5 py-2 rounded-[6px] border border-[#E8E6E1] bg-[#F7F6F3] hover:border-[#D4CFC7] text-[#3E3C38] hover:text-[#242424] transition-colors cursor-pointer"
            >
              <Search size={16} />
              <span className="hidden xl:inline text-xs text-[#777777] pr-3">
                Search scents &amp; houses...
              </span>
            </button>

            <Link
              href="/account?tab=favourites"
              aria-label="Wishlist"
              className="relative hidden sm:inline-flex items-center justify-center p-2 rounded-[6px] text-[#3E3C38] hover:bg-[#F7F6F3] hover:text-[#242424] transition-colors"
            >
              <Heart size={19} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#9A7953] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label={user ? "My account" : "Sign in"}
              className="inline-flex items-center gap-1.5 p-2 rounded-[6px] text-[#3E3C38] hover:bg-[#F7F6F3] hover:text-[#242424] transition-colors"
            >
              <User size={19} />
              <span className="hidden xl:inline text-xs font-medium">
                {user ? "Account" : "Sign in"}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open shopping cart"
              className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-[6px] bg-[#1F1D1B] hover:bg-[#35312D] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span className="tabular-nums">{mounted ? totalItems() : 0}</span>
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Panels */}
        {activeMega === "shop" && (
          <div
            id="mega-menu-shop"
            onMouseEnter={() => openMegaHover("shop")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1400px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  By Category &amp; Tier
                </p>
                <ul className="space-y-2">
                  {SHOP_BY_CATEGORY.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAllDesktop}
                        className="text-sm text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 transition-colors block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  By Family &amp; Occasion
                </p>
                <ul className="space-y-2">
                  {SHOP_BY_FAMILY_OCCASION.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAllDesktop}
                        className="text-sm text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 transition-colors block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  By Budget &amp; Bottle Size
                </p>
                <ul className="space-y-2">
                  {SHOP_BY_BUDGET_SIZE.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAllDesktop}
                        className="text-sm text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 transition-colors block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-3 bg-[#F7F6F3] border border-[#E8E6E1] rounded-[8px] p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A7953]">
                    Signature Series
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#242424] mt-1 mb-2">
                    Harsh Beniwal × Octopus
                  </h3>
                  <p className="text-xs text-[#5C5954] leading-relaxed">
                    Nine 50ML Eau de Parfums formulated with 25%+ imported French oils for lasting sillage.
                  </p>
                </div>
                <Link
                  href="/harsh-beniwal/octopus/perfumes"
                  onClick={closeAllDesktop}
                  className="mt-5 btn-luxury-primary py-2.5 px-4 text-[11px] w-full"
                >
                  Explore Flagship Line
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeMega === "brands" && (
          <div
            id="mega-menu-brands"
            onMouseEnter={() => openMegaHover("brands")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1400px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Middle Eastern Powerhouses
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {meBrands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      onClick={closeAllDesktop}
                      className="text-[13px] text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 truncate py-0.5"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Designer Fragrance Houses
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {designerBrands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      onClick={closeAllDesktop}
                      className="text-[13px] text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 truncate py-0.5"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Niche &amp; Haute Parfumerie
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5">
                  {nicheBrands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      onClick={closeAllDesktop}
                      className="text-[13px] text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 truncate py-0.5"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/brands"
                  onClick={closeAllDesktop}
                  className="btn-luxury-secondary w-full py-2.5 text-xs"
                >
                  Browse Full A–Z Directory ({brandSource.length}+ Houses) →
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer (<dialog> modal per modern-web-guidance) */}
      <dialog
        ref={drawerRef}
        closedby="any"
        data-side="left"
        onCancel={(e) => {
          e.preventDefault();
          setMobileOpen(false);
        }}
        onClick={handleDrawerBackdropClick}
        aria-label="Mobile menu"
        className="fc-drawer"
      >
        <div className="fc-drawer-panel w-[min(88vw,380px)] h-full bg-white flex flex-col border-r border-[#E8E6E1] shadow-2xl">
          <div className="px-5 py-4 border-b border-[#E8E6E1] flex items-center justify-between bg-[#F7F6F3]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="font-serif text-xl font-semibold tracking-[0.14em] text-[#242424]">
              OCTOPUS
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 rounded-full hover:bg-white text-[#242424] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {/* Direct Quick Links */}
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-[#E8E6E1]">
              <Link
                href="/collections/bestsellers"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-[6px] bg-[#F7F6F3] text-xs font-semibold text-[#242424] text-center"
              >
                Bestsellers
              </Link>
              <Link
                href="/collections/new-arrivals"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-[6px] bg-[#F7F6F3] text-xs font-semibold text-[#242424] text-center"
              >
                New Arrivals
              </Link>
              <Link
                href="/collections/middle-eastern-perfumes"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-[6px] bg-[#F7F6F3] text-xs font-semibold text-[#242424] text-center"
              >
                Middle East
              </Link>
              <Link
                href="/brands"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-[6px] bg-[#F7F6F3] text-xs font-semibold text-[#242424] text-center"
              >
                Brands A–Z
              </Link>
            </div>

            {/* Accordion Groups using <button aria-expanded> (no <details> inside navbar!) */}
            {[
              { id: "shop", label: "Shop by Category", links: SHOP_BY_CATEGORY },
              { id: "families", label: "Notes, Family & Occasion", links: SHOP_BY_FAMILY_OCCASION },
              { id: "budget", label: "Shop by Budget & Size", links: SHOP_BY_BUDGET_SIZE },
            ].map((group) => {
              const expanded = mobileSection === group.id;
              return (
                <div key={group.id} className="border-b border-[#E8E6E1] pb-2">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`mob-sec-${group.id}`}
                    onClick={() => setMobileSection(expanded ? null : group.id)}
                    className="w-full py-3 flex items-center justify-between text-left text-sm font-semibold text-[#242424] cursor-pointer"
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      size={16}
                      className={`text-[#777777] transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded && (
                    <ul id={`mob-sec-${group.id}`} className="space-y-1.5 pb-3 pl-2">
                      {group.links.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1.5 text-[13px] text-[#5C5954] hover:text-[#242424]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <div className="pt-2 space-y-2">
              <Link
                href="/harsh-beniwal/octopus/perfumes"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-[#9A7953]"
              >
                Harsh Beniwal × Octopus Signature
              </Link>
              <Link
                href="/journal"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#242424]"
              >
                Fragrance Journal &amp; Guides
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#242424]"
              >
                Shopping Bag
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#242424]"
              >
                Account &amp; Orders
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-[#E8E6E1] bg-[#F7F6F3]">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              className="w-full btn-luxury-primary py-3 text-xs"
            >
              <Search size={14} /> Search Catalog
            </button>
          </div>
        </div>
      </dialog>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
