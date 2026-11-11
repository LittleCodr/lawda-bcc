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
  ArrowRight,
  Tag,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import SearchModal from "@/components/SearchModal";
import type { BrandTier } from "@/lib/catalog-types";
import { useBlackFridayActive } from "@/lib/black-friday";

export interface NavBrandItem {
  name: string;
  slug: string;
  tier: BrandTier;
  count: number;
}

interface NavbarProps {
  topBrands?: NavBrandItem[];
}

type MegaKey =
  | "shop"
  | "brands"
  | "fragrance"
  | "middle-east"
  | "niche"
  | "highlights"
  | "discover"
  | null;

const SHOP_COLLECTIONS = [
  { label: "All Perfumes (1,700+)", href: "/collections/all" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Bestsellers", href: "/collections/bestsellers" },
  { label: "Trending Scents", href: "/collections/trending" },
  { label: "Octopus Exclusive", href: "/collections/exclusive" },
  { label: "Gift Sets & Coffrets", href: "/collections/gift-sets" },
  { label: "Miniatures", href: "/collections/miniatures" },
  { label: "Discovery Kits", href: "/collections/discovery-sets" },
];

const SHOP_BY_GENDER = [
  { label: "Men's Perfumes", href: "/collections/men" },
  { label: "Women's Perfumes", href: "/collections/women" },
  { label: "Unisex Signatures", href: "/collections/unisex" },
];

const SHOP_BY_PRICE = [
  { label: "Under ₹999", href: "/collections/under-999" },
  { label: "₹1,000 – ₹1,999", href: "/collections/1000-to-1999" },
  { label: "₹2,000 – ₹2,999", href: "/collections/2000-to-2999" },
  { label: "₹3,000 – ₹4,999", href: "/collections/3000-to-4999" },
  { label: "₹5,000 – ₹9,999", href: "/collections/5000-to-9999" },
  { label: "Above ₹10,000", href: "/collections/above-10000" },
];

const FRAGRANCE_FAMILIES = [
  { label: "Woody", href: "/collections/woody" },
  { label: "Oud & Agarwood", href: "/collections/oud" },
  { label: "Amber", href: "/collections/amber" },
  { label: "Oriental", href: "/collections/oriental" },
  { label: "Floral", href: "/collections/floral" },
  { label: "Citrus", href: "/collections/citrus-fresh" },
  { label: "Fresh", href: "/collections/citrus-fresh" },
  { label: "Aquatic", href: "/collections/aquatic" },
  { label: "Aromatic", href: "/collections/aromatic" },
  { label: "Spicy", href: "/collections/spicy" },
  { label: "Gourmand", href: "/collections/gourmand" },
  { label: "Fruity", href: "/collections/fruity" },
  { label: "Musky", href: "/collections/musky" },
  { label: "Leather", href: "/collections/leather" },
];

const OCCASIONS_LIST = [
  { label: "Office & Work", href: "/collections/office" },
  { label: "Everyday Wear", href: "/collections/everyday" },
  { label: "Date Night", href: "/collections/date-night" },
  { label: "Weddings & Festive", href: "/collections/weddings" },
  { label: "Parties & Clubbing", href: "/collections/parties" },
  { label: "Special Occasions", href: "/collections/special-occasions" },
  { label: "Evening Wear", href: "/collections/evening" },
  { label: "Travel & Pocket", href: "/collections/travel" },
  { label: "Gifting", href: "/collections/gifting" },
];

const SEASONS_LIST = [
  { label: "Summer Perfumes", href: "/collections/summer" },
  { label: "Winter Perfumes", href: "/collections/winter" },
  { label: "Monsoon Fragrances", href: "/collections/monsoon" },
  { label: "Spring Blossoms", href: "/collections/spring" },
  { label: "All-Season Signatures", href: "/collections/all-season" },
];

const FEATURED_ME_BRANDS = [
  "lattafa",
  "rasasi",
  "afnan",
  "armaf",
  "french-avenue",
  "paris-corner",
  "ahmed-al-maghribi",
  "ajmal",
  "al-haramain",
  "swiss-arabian",
  "khadlaj",
  "fragrance-world",
];

const FEATURED_POPULAR_SLUGS = [
  "christian-dior",
  "versace",
  "giorgio-armani",
  "tom-ford",
  "yves-saint-laurent",
  "lattafa",
  "rasasi",
  "afnan",
  "armaf",
  "ajmal",
  "paris-corner",
  "mancera",
  "montale",
  "xerjoff",
  "nishane",
  "creed",
  "hermes",
  "prada",
  "carolina-herrera",
  "paco-rabanne",
];

const DISCOVER_LINKS = [
  { label: "Fragrance Journal Hub", href: "/journal" },
  {
    label: "Concentration Guide (EDP vs EDT vs Extrait)",
    href: "/journal/edp-vs-edt-vs-extrait-concentration-explained",
  },
  {
    label: "Middle Eastern Extraits & Performance",
    href: "/journal/middle-eastern-extrait-and-edp-guide",
  },
  {
    label: "3-Bottle Signature Wardrobe Guide",
    href: "/journal/office-to-evening-signature-wardrobe",
  },
  {
    label: "Batch Code & Sealed Authenticity Guide",
    href: "/journal/how-to-verify-sealed-authentic-bottles",
  },
  { label: "Verified Markdowns & Bundle Offers", href: "/collections/deals" },
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

export default function Navbar({ topBrands = [] }: NavbarProps) {
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
  const isBlackFriday = useBlackFridayActive();

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveMega(null);
    setMobileOpen(false);
  }

  const navWrapRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Popular highlighted houses first, followed by clean alphabetical catalog houses
  const brandBySlug = new Map(topBrands.map((b) => [b.slug, b]));
  const popularBrands = FEATURED_POPULAR_SLUGS.map((s) => brandBySlug.get(s)).filter(
    (b): b is NavBrandItem => Boolean(b)
  );
  const alphabeticalBrands = [...topBrands]
    .filter((b) => !b.slug.includes("octopus"))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 24);
  const meBrands = FEATURED_ME_BRANDS.map((s) => brandBySlug.get(s)).filter(
    (b): b is NavBrandItem => Boolean(b)
  );

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    if (mobileOpen && !dialog.open) dialog.showModal();
    else if (!mobileOpen && dialog.open) dialog.close();
  }, [mobileOpen]);

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

  const isRouteActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const handleDrawerBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const panel = drawerRef.current?.firstElementChild;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    if (
      e.clientX > rect.right ||
      e.clientX < rect.left ||
      e.clientY > rect.bottom ||
      e.clientY < rect.top
    ) {
      setMobileOpen(false);
    }
  };

  const triggerClass = (isActive: boolean) =>
    `inline-flex items-center gap-1 py-2 text-[12px] xl:text-[13px] whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
      isActive
        ? "border-[#1F1D1B] text-[#1F1D1B] font-semibold"
        : "border-transparent font-medium text-[#3E3C38] hover:text-[#1F1D1B]"
    }`;

  return (
    <div ref={navWrapRef} onMouseLeave={scheduleCloseMega}>
      {/* Top Announcement Bar */}
      <div
        className={`${
          isBlackFriday
            ? "bf-shimmer-strip border-b border-[#9A7953]/45"
            : "bg-[#141210] border-b border-[#2C2722]"
        } text-[#F7F4EE] text-[11px] sm:text-xs`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center sm:justify-between gap-4">
          <p className="truncate font-medium tracking-[0.04em] flex items-center gap-2">
            {isBlackFriday && (
              <span className="bf-badge-glow inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#1F1B16] border text-[10px] font-bold uppercase tracking-[0.12em] text-[#D4AF7A] shrink-0">
                Black Friday Edit
              </span>
            )}
            <span className="truncate">
              100% Authentic Sealed Fragrances · Free Express India Shipping
            </span>
          </p>
          <p className="hidden md:flex items-center gap-2 shrink-0 text-[#D4CFC7]">
            <Sparkles size={12} className="text-[#D4AF7A]" />
            <span>
              Complimentary 7ML Paradox EDP Tester · 5% OFF ₹5,000+ Code:{" "}
              <strong className="text-white font-semibold tracking-wider">OCTOPUS5</strong>
            </span>
          </p>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E6E1]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[66px] sm:h-[72px] flex items-center justify-between gap-3">
          {/* Left: Mobile Menu Trigger + Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-2 rounded-[6px] text-[#242424] hover:bg-[#F7F6F3] cursor-pointer"
            >
              <Menu size={21} />
            </button>

            <Link
              href="/"
              onClick={closeAllDesktop}
              className="flex flex-col leading-none group py-1"
            >
              <span className="font-serif text-[22px] sm:text-[25px] font-semibold tracking-[0.14em] text-[#242424] group-hover:text-[#9A7953] transition-colors">
                OCTOPUS
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#777777] font-medium mt-0.5 hidden sm:block">
                Fine Fragrances
              </span>
            </Link>
          </div>

          {/* Center: Rich Desktop Mega Menu Triggers & Prominent Flagships */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5"
          >
            <div onMouseEnter={() => openMegaHover("shop")}>
              <button
                type="button"
                aria-expanded={activeMega === "shop"}
                aria-controls="mega-shop"
                onClick={() => setActiveMega((m) => (m === "shop" ? null : "shop"))}
                className={triggerClass(activeMega === "shop")}
              >
                Shop All
                <ChevronDown
                  size={13}
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
                aria-controls="mega-brands"
                onClick={() => setActiveMega((m) => (m === "brands" ? null : "brands"))}
                className={triggerClass(activeMega === "brands" || isRouteActive("/brands"))}
              >
                Brands A–Z
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-150 ${
                    activeMega === "brands" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div onMouseEnter={() => openMegaHover("fragrance")}>
              <button
                type="button"
                aria-expanded={activeMega === "fragrance"}
                aria-controls="mega-fragrance"
                onClick={() => setActiveMega((m) => (m === "fragrance" ? null : "fragrance"))}
                className={triggerClass(activeMega === "fragrance")}
              >
                Notes &amp; Occasions
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-150 ${
                    activeMega === "fragrance" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div onMouseEnter={() => openMegaHover("middle-east")}>
              <button
                type="button"
                aria-expanded={activeMega === "middle-east"}
                aria-controls="mega-middle-east"
                onClick={() =>
                  setActiveMega((m) => (m === "middle-east" ? null : "middle-east"))
                }
                className={triggerClass(
                  activeMega === "middle-east" ||
                    isRouteActive("/collections/middle-eastern-perfumes")
                )}
              >
                Middle East
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-150 ${
                    activeMega === "middle-east" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div onMouseEnter={() => openMegaHover("niche")}>
              <button
                type="button"
                aria-expanded={activeMega === "niche"}
                aria-controls="mega-niche"
                onClick={() => setActiveMega((m) => (m === "niche" ? null : "niche"))}
                className={triggerClass(
                  activeMega === "niche" || isRouteActive("/collections/niche-perfumes")
                )}
              >
                Niche &amp; Luxury
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-150 ${
                    activeMega === "niche" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Dedicated Highlight Items for Core Business Identity */}
            <div onMouseEnter={() => openMegaHover("highlights")} className="flex items-center gap-1.5 pl-1">
              <Link
                href="/collections/harsh-beniwal"
                onClick={closeAllDesktop}
                aria-current={isRouteActive("/collections/harsh-beniwal") ? "page" : undefined}
                className={`px-2.5 py-1 rounded-full text-[11px] xl:text-xs font-semibold border transition-colors whitespace-nowrap ${
                  isRouteActive("/collections/harsh-beniwal")
                    ? "bg-[#9A7953] text-white border-[#9A7953]"
                    : "bg-[#F5EFE6] text-[#242424] border-[#D4CFC7] hover:border-[#9A7953]"
                }`}
              >
                Harsh Beniwal
              </Link>
              <Link
                href="/harsh-beniwal/octopus/perfumes"
                onClick={closeAllDesktop}
                aria-current={
                  isRouteActive("/harsh-beniwal/octopus/perfumes") ? "page" : undefined
                }
                className={`px-2.5 py-1 rounded-full text-[11px] xl:text-xs font-semibold border transition-colors whitespace-nowrap ${
                  isRouteActive("/harsh-beniwal/octopus/perfumes")
                    ? "bg-[#1F1D1B] text-[#D4AF7A] border-[#1F1D1B]"
                    : "bg-[#1F1D1B] text-white border-[#1F1D1B] hover:bg-[#35312D]"
                }`}
              >
                Octopus Perfumes
              </Link>
            </div>

            <div onMouseEnter={() => openMegaHover("discover")}>
              <button
                type="button"
                aria-expanded={activeMega === "discover"}
                aria-controls="mega-discover"
                onClick={() => setActiveMega((m) => (m === "discover" ? null : "discover"))}
                className={triggerClass(
                  activeMega === "discover" ||
                    isRouteActive("/journal") ||
                    isRouteActive("/collections/deals")
                )}
              >
                Discover &amp; Offers
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-150 ${
                    activeMega === "discover" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open product search"
              className="inline-flex items-center gap-2 px-2.5 py-2 rounded-[6px] border border-[#E8E6E1] bg-[#F7F6F3] hover:border-[#D4CFC7] text-[#3E3C38] hover:text-[#242424] transition-colors cursor-pointer"
            >
              <Search size={16} />
              <span className="hidden 2xl:inline text-xs text-[#777777] pr-2">
                Search scents...
              </span>
            </button>

            <Link
              href="/account?tab=favourites"
              aria-label="Wishlist"
              className="relative hidden sm:inline-flex items-center justify-center p-2 rounded-[6px] text-[#3E3C38] hover:bg-[#F7F6F3] hover:text-[#242424] transition-colors"
            >
              <Heart size={18} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#9A7953] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label={user ? "My account" : "Sign in"}
              className="inline-flex items-center gap-1 p-2 rounded-[6px] text-[#3E3C38] hover:bg-[#F7F6F3] hover:text-[#242424] transition-colors"
            >
              <User size={18} />
              <span className="hidden xl:inline text-xs font-medium">
                {user ? "Account" : "Sign in"}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open shopping cart"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-[6px] bg-[#1F1D1B] hover:bg-[#35312D] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShoppingBag size={15} />
              <span className="tabular-nums">{mounted ? totalItems() : 0}</span>
            </button>
          </div>
        </div>

        {/* MEGA PANEL 1: SHOP ALL / GENDER / PRICE */}
        {activeMega === "shop" && (
          <div
            id="mega-shop"
            onMouseEnter={() => openMegaHover("shop")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Shop Collections
                </p>
                <ul className="space-y-2">
                  {SHOP_COLLECTIONS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAllDesktop}
                        className="text-sm text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-3 space-y-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                    Shop by Gender
                  </p>
                  <ul className="space-y-2">
                    {SHOP_BY_GENDER.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={closeAllDesktop}
                          className="text-sm font-medium text-[#242424] hover:text-[#9A7953] block"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                    By Bottle Size
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "30ml", href: "/collections/size-30ml" },
                      { label: "50ml", href: "/collections/size-50ml" },
                      { label: "75ml", href: "/collections/size-75ml" },
                      { label: "100ml", href: "/collections/size-100ml" },
                    ].map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={closeAllDesktop}
                        className="px-3 py-1 rounded-[4px] bg-[#F7F6F3] border border-[#E8E6E1] hover:border-[#242424] text-xs font-semibold text-[#242424]"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Shop by Price (INR)
                </p>
                <ul className="space-y-2">
                  {SHOP_BY_PRICE.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAllDesktop}
                        className="text-sm text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-3 bg-[#141210] text-white rounded-[10px] p-5 flex flex-col justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/harsh-beniwal/octopus/perfumes/images/overlord_bottle.png"
                    alt="Overlord 50ML EDP"
                    className="w-16 h-20 object-contain shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[#D4AF7A] font-semibold">
                      Featured Signature
                    </span>
                    <h3 className="font-serif text-xl font-semibold mt-0.5">
                      Harsh Beniwal × Octopus
                    </h3>
                    <p className="text-[11px] text-[#B8B2A9] mt-1">
                      9 signature 50ML Eau de Parfums crafted with 25%+ French oils.
                    </p>
                  </div>
                </div>
                <Link
                  href="/harsh-beniwal/octopus/perfumes"
                  onClick={closeAllDesktop}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-[#D4AF7A] text-[#141210] text-xs font-semibold uppercase tracking-wider py-2.5 rounded-[6px] hover:bg-white transition-colors"
                >
                  Shop Signature Line <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MEGA PANEL 2: BRANDS A-Z */}
        {activeMega === "brands" && (
          <div
            id="mega-brands"
            onMouseEnter={() => openMegaHover("brands")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Popular &amp; Most Searched Houses
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  {popularBrands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      onClick={closeAllDesktop}
                      className="text-[13px] font-medium text-[#242424] hover:text-[#9A7953] truncate"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Alphabetical House Directory
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 max-h-56 overflow-y-auto pr-2">
                  {alphabeticalBrands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      onClick={closeAllDesktop}
                      className="text-xs text-[#5C5954] hover:text-[#242424] hover:underline truncate"
                    >
                      {b.name} ({b.count})
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-3 bg-[#F7F6F3] border border-[#E8E6E1] rounded-[10px] p-5 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953]">
                    Complete Index
                  </p>
                  <h3 className="font-serif text-2xl font-semibold text-[#242424] mt-1">
                    {topBrands.length}+ Houses A–Z
                  </h3>
                  <p className="text-xs text-[#5C5954] mt-2 leading-relaxed">
                    Browse every stocked designer, UAE, niche, and signature collaboration house with jump filters.
                  </p>
                </div>
                <Link
                  href="/brands"
                  onClick={closeAllDesktop}
                  className="mt-4 btn-luxury-primary py-2.5 text-xs w-full"
                >
                  View All Brands A–Z
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MEGA PANEL 3: FRAGRANCE FAMILIES, OCCASIONS & SEASONS */}
        {activeMega === "fragrance" && (
          <div
            id="mega-fragrance"
            onMouseEnter={() => openMegaHover("fragrance")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Shop by Fragrance Family
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  {FRAGRANCE_FAMILIES.map((fam) => (
                    <Link
                      key={fam.label}
                      href={fam.href}
                      onClick={closeAllDesktop}
                      className="text-[13px] text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4"
                    >
                      {fam.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Shop by Occasion
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {OCCASIONS_LIST.map((occ) => (
                    <Link
                      key={occ.href}
                      href={occ.href}
                      onClick={closeAllDesktop}
                      className="text-[13px] text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4"
                    >
                      {occ.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Shop by Season
                </p>
                <ul className="space-y-2">
                  {SEASONS_LIST.map((sea) => (
                    <li key={sea.href}>
                      <Link
                        href={sea.href}
                        onClick={closeAllDesktop}
                        className="text-[13px] font-medium text-[#242424] hover:text-[#9A7953] block"
                      >
                        {sea.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* MEGA PANEL 4: MIDDLE EASTERN PERFUMES */}
        {activeMega === "middle-east" && (
          <div
            id="mega-middle-east"
            onMouseEnter={() => openMegaHover("middle-east")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Premier Gulf &amp; Arabian Houses
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {meBrands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/brands/${b.slug}`}
                      onClick={closeAllDesktop}
                      className="text-[13px] font-medium text-[#242424] hover:text-[#9A7953]"
                    >
                      {b.name} ({b.count})
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Curated Arabian Collections
                </p>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/collections/middle-eastern-perfumes"
                      onClick={closeAllDesktop}
                      className="font-semibold text-[#242424] hover:text-[#9A7953]"
                    >
                      All Middle Eastern Perfumes →
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/collections/oud"
                      onClick={closeAllDesktop}
                      className="text-[#5C5954] hover:text-[#242424]"
                    >
                      Oud, Saffron &amp; Agarwood
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/collections/long-lasting"
                      onClick={closeAllDesktop}
                      className="text-[#5C5954] hover:text-[#242424]"
                    >
                      High-Oil EDPs &amp; Extraits
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/collections/2000-to-2999"
                      onClick={closeAllDesktop}
                      className="text-[#5C5954] hover:text-[#242424]"
                    >
                      Best Gulf Gems ₹2,000 – ₹2,999
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-span-3 bg-[#F7F6F3] border border-[#E8E6E1] rounded-[10px] p-5 flex items-center gap-4">
                <img
                  src="/harsh-beniwal/octopus/perfumes/images/outlaw_bottle.png"
                  alt="Spiced Woods & Resin Showcase"
                  className="w-16 h-20 object-contain shrink-0"
                />
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7953]">
                    High Projection
                  </span>
                  <p className="font-serif text-lg font-semibold text-[#242424] mt-0.5">
                    Built for Heat &amp; Night
                  </p>
                  <Link
                    href="/journal/middle-eastern-extrait-and-edp-guide"
                    onClick={closeAllDesktop}
                    className="text-xs font-semibold text-[#9A7953] hover:text-[#242424] mt-2 inline-block underline"
                  >
                    Read Gulf Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEGA PANEL 5: NICHE & LUXURY */}
        {activeMega === "niche" && (
          <div
            id="mega-niche"
            onMouseEnter={() => openMegaHover("niche")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-4 space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Haute Parfumerie &amp; Designer Tiers
                </p>
                {[
                  { label: "All Niche Perfumes", href: "/collections/niche-perfumes" },
                  { label: "Designer Classics", href: "/collections/designer-perfumes" },
                  { label: "Extrait de Parfum & Pure Parfum", href: "/collections/extrait-de-parfum" },
                  { label: "Luxury Collector Vault ₹10,000+", href: "/collections/above-10000" },
                  { label: "Official Discovery Kits", href: "/collections/discovery-sets" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAllDesktop}
                    className="block text-sm text-[#242424] hover:text-[#9A7953] font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="col-span-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Iconic Houses
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "creed",
                    "parfums-de-marly",
                    "xerjoff",
                    "memo-paris",
                    "mancera",
                    "initio",
                    "nishane",
                    "christian-dior",
                    "tom-ford",
                    "guerlain",
                  ]
                    .map((s) => brandBySlug.get(s))
                    .filter((b): b is NavBrandItem => Boolean(b))
                    .map((b) => (
                      <Link
                        key={b.slug}
                        href={`/brands/${b.slug}`}
                        onClick={closeAllDesktop}
                        className="text-[13px] text-[#3E3C38] hover:text-[#242424] hover:underline"
                      >
                        {b.name}
                      </Link>
                    ))}
                </div>
              </div>

              <div className="col-span-3 bg-[#F7F6F3] border border-[#E8E6E1] rounded-[10px] p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7953]">
                    Batch Code Promise
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#242424] mt-1">
                    Sealed Authenticity
                  </h3>
                  <p className="text-xs text-[#5C5954] mt-1.5 leading-relaxed">
                    Every niche &amp; designer edition ships sealed with verified batch traceability.
                  </p>
                </div>
                <Link
                  href="/collections/luxury-perfumes"
                  onClick={closeAllDesktop}
                  className="mt-4 btn-luxury-secondary py-2 text-xs text-center"
                >
                  Open Luxury Vault
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MEGA PANEL 6: HARSH BENIWAL & OCTOPUS PERFUMES HIGHLIGHTS */}
        {activeMega === "highlights" && (
          <div
            id="mega-highlights"
            onMouseEnter={() => openMegaHover("highlights")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-[#141210] text-white border-b border-[#2C2722] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-4 space-y-3 border-r border-white/10 pr-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D4AF7A]">
                  Flagship Collaboration
                </span>
                <h3 className="font-serif text-2xl font-semibold text-white">
                  Harsh Beniwal × Octopus Perfumes
                </h3>
                <p className="text-xs text-[#C7C1B8] leading-relaxed">
                  Crafted with 25%+ imported French fragrance oils across nine 50ML Eau de Parfums—engineered for 12-hour trail and IFRA skin safety.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Link
                    href="/collections/harsh-beniwal"
                    onClick={closeAllDesktop}
                    className="px-4 py-2 rounded-[6px] bg-[#D4AF7A] text-[#141210] text-xs font-semibold"
                  >
                    Harsh Beniwal Edit
                  </Link>
                  <Link
                    href="/harsh-beniwal/octopus/perfumes"
                    onClick={closeAllDesktop}
                    className="px-4 py-2 rounded-[6px] border border-white/25 text-white hover:border-[#D4AF7A] text-xs font-semibold"
                  >
                    Official Brand Hub
                  </Link>
                </div>
              </div>

              <div className="col-span-8 grid grid-cols-4 gap-4">
                {[
                  {
                    name: "Overlord EDP",
                    note: "Bergamot · Ambroxan",
                    href: "/products/overlord",
                    img: "/harsh-beniwal/octopus/perfumes/images/overlord_bottle.png",
                  },
                  {
                    name: "Paradox EDP",
                    note: "Spiced Apple · Vanilla",
                    href: "/products/paradox",
                    img: "/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png",
                  },
                  {
                    name: "Rhapsody EDP",
                    note: "Saffron · Jasmine Woods",
                    href: "/products/rhapsody",
                    img: "/harsh-beniwal/octopus/perfumes/images/rhapsody_bottle.png",
                  },
                  {
                    name: "Outlaw EDP",
                    note: "Cardamom · Leather Oud",
                    href: "/products/outlaw",
                    img: "/harsh-beniwal/octopus/perfumes/images/outlaw_bottle.png",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAllDesktop}
                    className="group p-3.5 rounded-[8px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF7A]/60 transition-colors"
                  >
                    <div className="aspect-square bg-black/40 rounded-[6px] p-2 mb-2.5 flex items-center justify-center">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs font-semibold text-white group-hover:text-[#D4AF7A]">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#B8B2A9]">{item.note}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MEGA PANEL 7: DISCOVER & OFFERS */}
        {activeMega === "discover" && (
          <div
            id="mega-discover"
            onMouseEnter={() => openMegaHover("discover")}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#E8E6E1] shadow-[var(--shadow-mega)] z-40"
          >
            <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-12 gap-8">
              <div className="col-span-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7953] mb-3">
                  Fragrance Knowledge &amp; Guides
                </p>
                <ul className="space-y-2">
                  {DISCOVER_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeAllDesktop}
                        className="text-sm text-[#3E3C38] hover:text-[#1F1D1B] hover:underline underline-offset-4 block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-6 bg-[#F5EFE6] border border-[#E8E6E1] rounded-[10px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7953]">
                    <Tag size={12} /> Active Prepaid Savings
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-[#242424] mt-1">
                    Verified Markdowns &amp; Code OCTOPUS5
                  </h3>
                  <p className="text-xs text-[#5C5954] mt-1.5 leading-relaxed max-w-md">
                    Save 3% automatically on 2 perfumes or 5% on 3+, plus apply code{" "}
                    <strong>OCTOPUS5</strong> at checkout for 5% OFF on orders of ₹5,000+.
                  </p>
                </div>
                <Link
                  href="/collections/deals"
                  onClick={closeAllDesktop}
                  className="btn-luxury-primary px-5 py-3 text-xs shrink-0"
                >
                  View Genuine Offers
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Independent Mobile Navigation Drawer (<dialog> modal) */}
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
        <div className="fc-drawer-panel w-[min(90vw,390px)] h-full bg-white flex flex-col border-r border-[#E8E6E1] shadow-2xl">
          <div className="px-5 py-4 border-b border-[#E8E6E1] flex items-center justify-between bg-[#141210] text-white">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="font-serif text-xl font-semibold tracking-[0.14em]"
            >
              OCTOPUS
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 rounded-full hover:bg-white/10 text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {/* Search Quick Bar */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[6px] bg-[#F7F6F3] border border-[#E8E6E1] text-xs font-medium text-[#5C5954] cursor-pointer"
            >
              <Search size={15} />
              <span>Search 1,700+ scents, notes, brands...</span>
            </button>

            {/* Prominent Business Identity Shortcuts */}
            <div className="grid grid-cols-2 gap-2.5 pb-3 border-b border-[#E8E6E1]">
              <Link
                href="/collections/harsh-beniwal"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-[8px] bg-[#F5EFE6] border border-[#D4CFC7] flex flex-col justify-between"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7953]">
                  Signature Edit
                </span>
                <span className="text-xs font-bold text-[#242424] mt-1">
                  Harsh Beniwal →
                </span>
              </Link>
              <Link
                href="/harsh-beniwal/octopus/perfumes"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-[8px] bg-[#141210] text-white flex flex-col justify-between"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF7A]">
                  25%+ French Oil
                </span>
                <span className="text-xs font-bold mt-1">Octopus Perfumes →</span>
              </Link>
            </div>

            {/* Direct Core Destinations */}
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#E8E6E1] text-center">
              <Link
                href="/collections/all"
                onClick={() => setMobileOpen(false)}
                className="px-2 py-2 rounded-[6px] bg-[#F7F6F3] text-xs font-semibold text-[#242424]"
              >
                Shop All
              </Link>
              <Link
                href="/collections/bestsellers"
                onClick={() => setMobileOpen(false)}
                className="px-2 py-2 rounded-[6px] bg-[#F7F6F3] text-xs font-semibold text-[#242424]"
              >
                Bestsellers
              </Link>
              <Link
                href="/collections/new-arrivals"
                onClick={() => setMobileOpen(false)}
                className="px-2 py-2 rounded-[6px] bg-[#F7F6F3] text-xs font-semibold text-[#242424]"
              >
                New Drops
              </Link>
            </div>

            {/* Expandable Accordion Groups */}
            {[
              { id: "shop", label: "Collections & Genders", links: [...SHOP_BY_GENDER, ...SHOP_COLLECTIONS] },
              { id: "brands", label: "Brands A–Z & Middle East", links: popularBrands.map((b) => ({ label: b.name, href: `/brands/${b.slug}` })) },
              { id: "families", label: "Fragrance Families", links: FRAGRANCE_FAMILIES },
              { id: "occasions", label: "Occasions & Seasons", links: [...OCCASIONS_LIST, ...SEASONS_LIST] },
              { id: "price", label: "Shop by Price Band", links: SHOP_BY_PRICE },
              { id: "discover", label: "Guides, Journal & Offers", links: DISCOVER_LINKS },
            ].map((group) => {
              const expanded = mobileSection === group.id;
              return (
                <div key={group.id} className="border-b border-[#E8E6E1] pb-1.5">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`mob-sec-${group.id}`}
                    onClick={() => setMobileSection(expanded ? null : group.id)}
                    className="w-full py-2.5 flex items-center justify-between text-left text-sm font-semibold text-[#242424] cursor-pointer"
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
                    <ul id={`mob-sec-${group.id}`} className="grid grid-cols-1 gap-1 pb-2.5 pl-2">
                      {group.links.map((item) => (
                        <li key={item.href + item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1 text-[13px] text-[#5C5954] hover:text-[#242424]"
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

            <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs font-medium text-[#242424]">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-[6px] border border-[#E8E6E1]"
              >
                Account
              </Link>
              <Link
                href="/account?tab=favourites"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-[6px] border border-[#E8E6E1]"
              >
                Wishlist ({mounted ? wishlistCount : 0})
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-[6px] border border-[#E8E6E1]"
              >
                Cart ({mounted ? totalItems() : 0})
              </Link>
            </div>
          </div>
        </div>
      </dialog>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
