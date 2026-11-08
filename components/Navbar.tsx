"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { 
  Gift, 
  Sparkles, 
  Menu, 
  Search, 
  ShoppingBag, 
  X, 
  ChevronDown, 
  User, 
  ArrowRight
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import SearchModal from "./SearchModal";
import Marquee from "./Marquee";

interface SubLink {
  label: string;
  href: string;
  tag?: string;
  desc?: string;
}

interface NavSection {
  title: string;
  links: SubLink[];
}

interface NavPromo {
  badge: string;
  title: string;
  desc: string;
  code?: string;
  ctaText: string;
  ctaHref: string;
}

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  dropdownWidth: string;
  dropdownAlign: "center" | "left" | "right";
  sections: NavSection[];
  promo: NavPromo;
}

const NAV_MENU: NavItem[] = [
  {
    label: "All Perfumes",
    href: "/collections/all",
    badge: "2,300+ Bottles",
    dropdownWidth: "w-[880px] xl:w-[960px]",
    dropdownAlign: "center",
    sections: [
      {
        title: "Curated Collections",
        links: [
          { label: "Explore Entire Vault", href: "/collections/all", tag: "2,300+", desc: "All designer, Middle Eastern & niche EDPs" },
          { label: "Best-Selling Compliment Pullers", href: "/collections/all?sort=price-desc", tag: "Top Rated", desc: "Most sought-after luxury fragrances" },
          { label: "Budget Beasts Under ₹1,999", href: "/collections/all?sort=price-asc", tag: "Best Value", desc: "High-sillage everyday signatures" },
          { label: "High-Concentration Extraits", href: "/collections/all", tag: "30%+ Oil", desc: "Beast-mode 14+ hour longevity" },
          { label: "New UAE & Paris Restocks", href: "/collections/all", tag: "Just Landed", desc: "Fresh authentic imports from Dubai" },
        ],
      },
      {
        title: "By Olfactory Family",
        links: [
          { label: "Warm Amber & Vanilla Orientals", href: "/collections/all?q=amber", desc: "Rich, decadent & comforting sweetness" },
          { label: "Smoky Oud, Leather & Dark Woods", href: "/collections/all?q=oud", desc: "Majestic Middle Eastern royal sillage" },
          { label: "Crisp Citrus & Fresh Aquatics", href: "/collections/all?q=fresh", desc: "Energizing daytime & boardroom staples" },
          { label: "Seductive Rose & White Musks", href: "/collections/all?q=floral", desc: "Romantic, velvety floral drydowns" },
          { label: "Boozy Tobacco & Spices", href: "/collections/all?q=wood", desc: "Intoxicating evening & clubbing kings" },
        ],
      },
    ],
    promo: {
      badge: "COMPLIMENTARY DISCOVERY TESTER",
      title: "Free 7ML Paradox Tester in Every Box",
      desc: "Every order placed today automatically includes a free 7ML Paradox luxury EDP tester in our crush-resistant presentation packaging.",
      code: "LUXURY25",
      ctaText: "Shop Entire Catalog",
      ctaHref: "/collections/all",
    },
  },
  {
    label: "Fragrance Brands",
    href: "/brands",
    badge: "136 Houses",
    dropdownWidth: "w-[880px] xl:w-[980px]",
    dropdownAlign: "center",
    sections: [
      {
        title: "Trending Arabian & Dubai Royals",
        links: [
          { label: "Lattafa Perfumes", href: "/brands/lattafa", tag: "Dubai Viral", desc: "Khamrah, Yara, Asad & Velvet Oud" },
          { label: "Armaf & Club De Nuit", href: "/brands/armaf", tag: "Iconic", desc: "CDNIM Pure Parfum & Sillage Series" },
          { label: "Afnan Perfumery", href: "/brands/afnan", tag: "Beast-Mode", desc: "9PM Eau De Parfum & Supremacy" },
          { label: "Rasasi Perfumes", href: "/brands/rasasi", tag: "Dubai Royalty", desc: "Hawas for Him & Daarej Classics" },
          { label: "French Avenue (Paris Corner)", href: "/brands/french-avenue", tag: "Trending", desc: "Amber Empire, Liquid Brun & More" },
        ],
      },
      {
        title: "Iconic Designer & Niche Parfumerie",
        links: [
          { label: "Christian Dior", href: "/brands/christian-dior", tag: "French Haute", desc: "Sauvage, Fahrenheit & Dior Homme" },
          { label: "Tom Ford Private Blend", href: "/brands/tom-ford", tag: "Ultra Luxury", desc: "Ombré Leather & Tobacco Vanille" },
          { label: "Yves Saint Laurent", href: "/brands/yves-saint-laurent", tag: "Designer King", desc: "Y Eau de Parfum & La Nuit" },
          { label: "Versace Parfums", href: "/brands/versace", tag: "Classics", desc: "Eros Flame, Dylan Blue & Pour Homme" },
          { label: "Browse All 136 Perfume Houses →", href: "/brands", tag: "Full Index", desc: "Complete A-Z brand directory" },
        ],
      },
    ],
    promo: {
      badge: "100% ORIGINAL GUARANTEE",
      title: "Authentic Sourced Packaging",
      desc: "Direct authorized distribution with authentic batch codes, verified serial numbers, and tamper-evident seals.",
      code: "LUXURY25",
      ctaText: "Explore 136 Brands",
      ctaHref: "/brands",
    },
  },
  {
    label: "Harsh Beniwal EDPs",
    href: "/harsh-beniwal/octopus/perfumes",
    badge: "🔥 In-House",
    dropdownWidth: "w-[900px] xl:w-[1000px]",
    dropdownAlign: "center",
    sections: [
      {
        title: "Bold & Beast-Mode (Men & Unisex)",
        links: [
          { label: "Overlord 50ML EDP", href: "/products/overlord", tag: "Dior Sauvage DNA", desc: "Calabrian Bergamot, Sichuan Pepper & Ambroxan" },
          { label: "Outlaw 50ML EDP", href: "/products/outlaw", tag: "TF Ombré Leather", desc: "Smoky Black Leather, Cardamom & Dark Amber" },
          { label: "Somersault 50ML EDP", href: "/products/somersault", tag: "LV Imagination", desc: "Sparkling Citrus, Black Tea & Clean Ambrox" },
          { label: "Your Move 50ML EDP", href: "/products/your-move", tag: "TF Oud Wood", desc: "Precious Oud, Sandalwood & Tonka Bean" },
          { label: "Rhapsody 50ML EDP", href: "/products/rhapsody", tag: "Jazz Club DNA", desc: "Aged Boozy Rum, Pink Pepper & Tobacco Leaf" },
        ],
      },
      {
        title: "Seductive Unisex & Feminine",
        links: [
          { label: "Paradox 50ML EDP", href: "/products/paradox", tag: "LV Les Sables Roses", desc: "Grasse Centifolia Rose, Amber & Smoky Oud" },
          { label: "Promised 50ML EDP", href: "/products/promised", tag: "Baccarat Rouge 540", desc: "Sweet Jasmine, Saffron, Ambergris & Cedar" },
          { label: "Mirage 50ML EDP", href: "/products/mirage", tag: "LV Ombre Nomade", desc: "Wild Raspberry, Benzoin Tears & Dark Woods" },
          { label: "Darling Women 50ML EDP", href: "/products/darling-women", tag: "Miss Dior DNA", desc: "Grasse Rose, Peony & Velvety White Musks" },
        ],
      },
    ],
    promo: {
      badge: "25%+ FRENCH CONCENTRATION",
      title: "12+ Hours Proven Longevity",
      desc: "Formulated with imported French perfume oils specifically engineered for Indian heat and maximum magnetic sillage.",
      code: "LUXURY25",
      ctaText: "Shop Harsh Beniwal Store",
      ctaHref: "/harsh-beniwal/octopus/perfumes",
    },
  },
  {
    label: "Perfumes For Him",
    href: "/collections/all",
    dropdownWidth: "w-[760px] xl:w-[840px]",
    dropdownAlign: "center",
    sections: [
      {
        title: "Signatures by Occasion",
        links: [
          { label: "Everyday Office & Casual Clean", href: "/collections/all?q=fresh", desc: "Crisp bergamot, sea minerals & vetiver" },
          { label: "Date Night & Evening Charmers", href: "/collections/all?q=amber", desc: "Warm vanilla, boozy spices & amber" },
          { label: "Party & Clubbing Projection Kings", href: "/collections/all?q=beast", desc: "High-projection compliment magnets" },
          { label: "Executive Boardroom Woods", href: "/collections/all?q=wood", desc: "Refined dry cedar, tobacco & dark leather" },
        ],
      },
      {
        title: "Curated Flagship Picks",
        links: [
          { label: "Overlord 50ML EDP (₹1,299)", href: "/products/overlord", tag: "Bestseller", desc: "The ultimate beast-mode fresh signature" },
          { label: "Armaf Club De Nuit Intense", href: "/brands/armaf", tag: "Aventus DNA", desc: "Smoky birch, blackcurrant & musk" },
          { label: "Afnan 9PM Eau De Parfum", href: "/brands/afnan", tag: "Party King", desc: "Sweet vanilla apple, lavender & cinnamon" },
          { label: "Rasasi Hawas for Him", href: "/brands/rasasi", tag: "Aquatic", desc: "Plum, aquatic notes & ambergris" },
        ],
      },
    ],
    promo: {
      badge: "MASCULINE ESSENTIALS",
      title: "Beast-Mode Projection",
      desc: "Handpicked masculine scents that cut through the day with exceptional projection and compliments.",
      code: "LUXURY25",
      ctaText: "Shop Men's Fragrances",
      ctaHref: "/collections/all",
    },
  },
  {
    label: "Perfumes For Her",
    href: "/products/darling-women",
    dropdownWidth: "w-[760px] xl:w-[840px]",
    dropdownAlign: "right",
    sections: [
      {
        title: "Fragrance Aesthetics",
        links: [
          { label: "Floral Bloom & Grasse Roses", href: "/collections/all?q=floral", desc: "Fresh cut roses, peony & radiant blossoms" },
          { label: "Sweet Gourmand, Vanilla & Berries", href: "/collections/all?q=vanilla", desc: "Creamy caramel, vanilla pods & fruit nectar" },
          { label: "Sensual Amber & Evening Luxury", href: "/collections/all?q=amber", desc: "Warm resinous amber & silky skin musks" },
          { label: "Breezy Daytime & Clean Linen", href: "/collections/all?q=fresh", desc: "Subtle, feminine and upliftingly fresh" },
        ],
      },
      {
        title: "Most Loved Selections",
        links: [
          { label: "Darling Women 50ML EDP", href: "/products/darling-women", tag: "Most Loved", desc: "Floral romance with Grasse rose & peony" },
          { label: "Paradox 50ML EDP", href: "/products/paradox", tag: "Evening Rose", desc: "Opulent Centifolia rose & smoky amber" },
          { label: "Promised 50ML EDP", href: "/products/promised", tag: "Sweet Amber", desc: "Sweet Baccarat Rouge 540 floral DNA" },
          { label: "Lattafa Yara Eau De Parfum", href: "/brands/lattafa", tag: "Viral Dubai", desc: "Fluffy tropical vanilla & heliotrope" },
        ],
      },
    ],
    promo: {
      badge: "DELUXE PRESENTATION",
      title: "Free Paradox Tester Included",
      desc: "Every bottle arrives in luxury presentation packaging with a free 7ML discovery tester included.",
      code: "LUXURY25",
      ctaText: "Shop Women's Scents",
      ctaHref: "/collections/all",
    },
  },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>("All Perfumes");
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 140);
  };

  const toggleMobileItem = (label: string) => {
    setExpandedMobileItem(prev => (prev === label ? null : label));
  };

  return (
    <>
      {/* Top Brand Notification Hairline - Luxury Fragrance House */}
      <div className="w-full bg-stone-900 text-stone-200 py-2 px-4 flex items-center justify-center gap-3 sm:gap-6 text-[12px] font-medium shadow-xs border-b border-stone-800 relative z-50">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span className="font-bold tracking-wide text-white">Flat 25% OFF on 130+ Luxury Fragrance Houses</span>
          <span className="hidden md:inline text-stone-600">·</span>
          <span className="hidden md:inline text-stone-300">Harsh Beniwal & Designer Brands</span>
        </div>
        <span className="text-stone-600 hidden sm:inline">•</span>
        <Link href="/octopus-perfume-coupon-code" className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <span className="text-stone-300">Use code</span>
          <strong className="font-mono bg-amber-400 text-stone-950 px-2 py-0.5 rounded text-[11px] font-bold shadow-xs">
            LUXURY25
          </strong>
          <span className="text-stone-300 hidden sm:inline">for Flat 25% OFF</span>
        </Link>
        <span className="text-stone-600 hidden lg:inline">•</span>
        <div className="text-stone-300 hidden lg:flex items-center gap-1">
          <Gift size={13} className="text-amber-400" />
          <span>Free 7ML Paradox Tester Included</span>
        </div>
      </div>
      
      {/* Mobile Marquee Strip */}
      <div className="block md:hidden relative z-40">
        <Link href="/collections/all">
          <Marquee />
        </Link>
      </div>

      {/* Full-Page Background Hover Overlay Scrim */}
      <div 
        className={`fixed inset-0 top-[116px] bg-stone-950/35 backdrop-blur-[3px] z-30 transition-all duration-300 pointer-events-none ${
          activeDropdown ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        aria-hidden="true"
      />
      
      {/* Main Top Navigation (80px height, pure white, 1px bottom hairline) */}
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-stone-200/80 ${
          scrolled ? "shadow-sm" : ""
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between relative">
          
          {/* Flush Left: Brand Wordmark */}
          <Link
            href="/"
            className="flex flex-col items-start group shrink-0 select-none"
            onClick={() => setActiveDropdown(null)}
          >
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-[0.22em] text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a] group-hover:text-stone-900 transition-colors">
                OCTOPUS
              </span>
              <span className="text-[9px] bg-amber-50 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-200/80 uppercase tracking-widest hidden sm:inline-block">
                Luxury
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8a8178] -mt-0.5 group-hover:text-amber-700 transition-colors">
              HAUTE PARFUMERIE
            </span>
          </Link>

          {/* Desktop Center Navigation with Hover Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 h-full">
            {NAV_MENU.map((item) => {
              const isActive = activeDropdown === item.label;

              return (
                <div 
                  key={item.label} 
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                >
                  {/* Nav Item Trigger Button */}
                  <Link
                    href={item.href}
                    className={`text-[13px] font-semibold tracking-wide px-3.5 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                      isActive
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-800 hover:text-stone-950 hover:bg-stone-100/90"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                        isActive 
                          ? "bg-amber-400 text-stone-950" 
                          : "bg-amber-100/90 text-amber-900 border border-amber-200/80"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown 
                      size={13} 
                      className={`transition-transform duration-200 ${
                        isActive 
                          ? "rotate-180 text-amber-400" 
                          : "text-stone-400 group-hover:text-stone-700"
                      }`} 
                    />
                  </Link>

                  {/* Mega Menu Dropdown Panel */}
                  <div 
                    className={`absolute top-full pt-2 transition-all duration-200 z-50 ${
                      item.dropdownAlign === "center"
                        ? "left-1/2 -translate-x-1/2"
                        : item.dropdownAlign === "right"
                        ? "right-0"
                        : "left-0"
                    } ${
                      isActive 
                        ? "opacity-100 translate-y-0 pointer-events-auto visible" 
                        : "opacity-0 translate-y-2 pointer-events-none invisible"
                    }`}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`${item.dropdownWidth} max-w-[calc(100vw-32px)] bg-white/98 backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] border border-stone-200/90 p-6 overflow-hidden`}>
                      
                      <div className="grid grid-cols-12 gap-6">
                        
                        {/* Left & Middle: Category Link Columns */}
                        <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {item.sections.map((section, idx) => (
                            <div key={idx} className="space-y-3">
                              <div className="flex items-center gap-2 pb-1.5 border-b border-stone-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                  {section.title}
                                </h4>
                              </div>
                              <div className="space-y-1">
                                {section.links.map((sub, sIdx) => (
                                  <Link
                                    key={sIdx}
                                    href={sub.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className="group/link flex items-start justify-between p-2 rounded-xl hover:bg-stone-50 hover:shadow-2xs transition-all"
                                  >
                                    <div className="min-w-0 pr-2">
                                      <span className="text-[13px] font-semibold text-stone-800 group-hover/link:text-amber-800 transition-colors block leading-snug">
                                        {sub.label}
                                      </span>
                                      {sub.desc && (
                                        <span className="text-[11px] text-stone-500 leading-tight block mt-0.5 truncate">
                                          {sub.desc}
                                        </span>
                                      )}
                                    </div>
                                    {sub.tag && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 group-hover/link:bg-amber-100 group-hover/link:text-amber-900 shrink-0 mt-0.5">
                                        {sub.tag}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Right: Featured Luxury Promo Showcase Tile */}
                        <div className="col-span-12 md:col-span-4">
                          <div className="h-full bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-xl p-5 flex flex-col justify-between border border-stone-800 shadow-md relative overflow-hidden group/tile">
                            
                            {/* Subtle Ambient Glow */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover/tile:bg-amber-500/25 transition-all"></div>
                            
                            <div className="relative z-10">
                              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                                <Sparkles size={11} className="text-amber-400" />
                                {item.promo.badge}
                              </span>
                              <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                                {item.promo.title}
                              </h3>
                              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                                {item.promo.desc}
                              </p>
                              
                              {item.promo.code && (
                                <div className="bg-stone-800/80 border border-stone-700 rounded-lg p-2.5 mb-4 flex items-center justify-between">
                                  <span className="text-[11px] text-stone-400 font-medium">Coupon Code:</span>
                                  <strong className="font-mono text-amber-300 text-xs tracking-wider bg-stone-900 px-2 py-0.5 rounded border border-amber-400/30">
                                    {item.promo.code}
                                  </strong>
                                </div>
                              )}
                            </div>

                            <div className="relative z-10 pt-2 border-t border-stone-800/80">
                              <Link
                                href={item.promo.ctaHref}
                                onClick={() => setActiveDropdown(null)}
                                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs rounded-lg transition-all shadow-xs active:scale-95"
                              >
                                <span>{item.promo.ctaText}</span>
                                <ArrowRight size={13} />
                              </Link>
                            </div>

                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </nav>

          {/* Right Area: Search Pill, Account, Cart, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search Pill */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 sm:gap-3 border border-[#dddddd] hover:border-stone-400/80 bg-stone-50/80 hover:bg-white rounded-full py-2 px-3 sm:px-4 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer text-[#222222]"
              aria-label="Search perfumes"
            >
              <Search size={15} className="text-stone-700" strokeWidth={2.2} />
              <span className="text-[13px] font-medium hidden sm:inline text-stone-600">
                Search 2,300+ perfumes...
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 bg-white text-stone-500 text-[10px] px-1.5 py-0.5 rounded font-mono border border-stone-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Account & Cart Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link 
                href="/account" 
                aria-label="Account"
                className="text-stone-700 hover:text-stone-950 text-[13px] font-medium p-2 rounded-full hover:bg-stone-100 transition-colors"
                title="Your Account"
              >
                <User size={18} strokeWidth={2} />
              </Link>
              <span className="h-4 w-px bg-stone-200"></span>
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-black text-white px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={14} strokeWidth={2.2} />
                <span>Cart</span>
                {totalItems() > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] flex items-center justify-center -mr-1 shadow-xs">
                    {totalItems()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              className="lg:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-full transition-colors -mr-1 cursor-pointer"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex lg:hidden animate-in fade-in duration-200">
            <div className="w-[88%] max-w-sm bg-white border-r border-[#ebebeb] h-full flex flex-col shadow-2xl overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#ebebeb] bg-stone-900 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-bold uppercase tracking-wider text-white">OCTOPUS</span>
                  <span className="text-amber-400 text-xs uppercase tracking-widest font-mono font-bold bg-white/10 px-2 py-0.5 rounded">Luxury</span>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  aria-label="Close menu" 
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white active:scale-95 cursor-pointer transition-colors"
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>

              {/* Mobile Promo Box */}
              <div className="p-4 bg-gradient-to-r from-stone-50 via-amber-50/40 to-yellow-50/30 border-b border-stone-200">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wide mb-1">
                  <Sparkles size={13} className="text-amber-600" />
                  <span>Flat 25% OFF Code</span>
                </div>
                <p className="text-[12px] text-stone-600 leading-snug mb-2">
                  Use coupon <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-stone-900">LUXURY25</strong> for 25% OFF + Free 7ML Paradox tester!
                </p>
                <Link
                  href="/collections/all"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-full py-2 bg-stone-900 hover:bg-black text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Shop Entire Catalog &rarr;
                </Link>
              </div>

              {/* Drawer Links Accordion */}
              <div className="p-4 space-y-2.5 flex-1">
                {NAV_MENU.map((item) => {
                  const isExpanded = expandedMobileItem === item.label;

                  return (
                    <div key={item.label} className="bg-stone-50/90 border border-stone-200/80 rounded-xl overflow-hidden transition-all">
                      <button
                        onClick={() => toggleMobileItem(item.label)}
                        className="w-full text-left p-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-100/60 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider font-bold text-stone-900">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] bg-stone-900 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <ChevronDown 
                          size={15} 
                          className={`text-stone-500 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-amber-700" : ""
                          }`} 
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-stone-200/60 bg-white space-y-3">
                          {item.sections.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                                {section.title}
                              </span>
                              <div className="space-y-1 pl-1">
                                {section.links.map((sub, subIdx) => (
                                  <Link
                                    key={subIdx}
                                    href={sub.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors"
                                  >
                                    <span>{sub.label}</span>
                                    {sub.tag && (
                                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                                        {sub.tag}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Drawer Footer Account Link */}
              <div className="p-4 border-t border-stone-200 bg-stone-50 shrink-0">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors shadow-2xs"
                >
                  <User size={15} />
                  <span>My Account & Orders</span>
                </Link>
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
