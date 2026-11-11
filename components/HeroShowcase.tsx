"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface HeroChapter {
  id: string;
  index: string;
  tabLabel: string;
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  copy: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  featuredCard: {
    name: string;
    subtitle: string;
    notesLine: string;
    image: string;
    href: string;
  };
  companionBottles: {
    name: string;
    image: string;
    href: string;
  }[];
}

const CHAPTERS: HeroChapter[] = [
  {
    id: "flagship",
    index: "01",
    tabLabel: "Harsh Beniwal × Octopus",
    eyebrow: "25%+ Imported French Oils · Signature Atelier",
    headlineTop: "Not Just a Fragrance.",
    headlineAccent: "An Impression.",
    copy: "Command attention with Overlord, Paradox, and Rhapsody—9 signature 50ML Eau de Parfums engineered alongside Harsh Beniwal for relentless projection and 12-hour skin presence in Indian weather.",
    primaryCta: { label: "Shop Octopus Signature", href: "/harsh-beniwal/octopus/perfumes" },
    secondaryCta: { label: "Explore Harsh Beniwal Edit", href: "/collections/harsh-beniwal" },
    featuredCard: {
      name: "Overlord 50ML EDP",
      subtitle: "Harsh Beniwal Flagship · Bergamot & Ambroxan",
      notesLine: "Top: Bergamot, Lemon · Heart: Lavender, Sichuan Pepper · Base: Amber, Vanilla",
      image: "/harsh-beniwal/octopus/perfumes/images/overlord_bottle.png",
      href: "/products/overlord",
    },
    companionBottles: [
      {
        name: "Paradox 50ML",
        image: "/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png",
        href: "/products/paradox",
      },
      {
        name: "Rhapsody 50ML",
        image: "/harsh-beniwal/octopus/perfumes/images/rhapsody_bottle.png",
        href: "/products/rhapsody",
      },
    ],
  },
  {
    id: "middle-east",
    index: "02",
    tabLabel: "Middle Eastern Extraits",
    eyebrow: "UAE Heritage & High-Density Oils",
    headlineTop: "Gulf Opulence,",
    headlineAccent: "Sealed & Verified.",
    copy: "Discover concentrated Extraits and cult-classic Eau de Parfums from Lattafa, Rasasi, Afnan, Armaf, French Avenue, and Paris Corner—crafted around dark agarwood, golden amber, and spiced praline.",
    primaryCta: { label: "Explore Middle East", href: "/collections/middle-eastern-perfumes" },
    secondaryCta: { label: "Browse Oud & Amber", href: "/collections/oud" },
    featuredCard: {
      name: "Outlaw 50ML EDP",
      subtitle: "Smoky Spices, Dark Suede & Resin",
      notesLine: "Top: Cardamom, Clove · Heart: Jasmine, Leather · Base: Oud, Sandalwood",
      image: "/harsh-beniwal/octopus/perfumes/images/outlaw_bottle.png",
      href: "/products/outlaw",
    },
    companionBottles: [
      {
        name: "Mirage 50ML",
        image: "/harsh-beniwal/octopus/perfumes/images/mirage_bottle.png",
        href: "/products/mirage",
      },
      {
        name: "Your Move 50ML",
        image: "/harsh-beniwal/octopus/perfumes/images/your_move_bottle.png",
        href: "/products/your-move",
      },
    ],
  },
  {
    id: "niche-designer",
    index: "03",
    tabLabel: "Designer & Niche Vault",
    eyebrow: "1,700+ Factory-Sealed Global Editions",
    headlineTop: "Curated Houses,",
    headlineAccent: "Batch-Code Verified.",
    copy: "From Creed, Parfums de Marly, and Xerjoff to Christian Dior, Tom Ford, Hermès, and YSL—shop original runway classics, discovery sampling kits, and gift coffrets with complimentary express India delivery.",
    primaryCta: { label: "Browse All 1,700+ Scents", href: "/collections/all" },
    secondaryCta: { label: "View Haute Niche", href: "/collections/niche-perfumes" },
    featuredCard: {
      name: "Somersault 50ML EDP",
      subtitle: "Crisp Citrus, Neroli & White Musk",
      notesLine: "Top: Mandarin, Petitgrain · Heart: Orange Blossom · Base: Clean Cedar & Musk",
      image: "/harsh-beniwal/octopus/perfumes/images/somersault_bottle.png",
      href: "/products/somersault",
    },
    companionBottles: [
      {
        name: "Promised 50ML",
        image: "/harsh-beniwal/octopus/perfumes/images/promised_bottle.png",
        href: "/products/promised",
      },
      {
        name: "Darling 50ML",
        image: "/harsh-beniwal/octopus/perfumes/images/darling_bottle.webp",
        href: "/products/darling-women",
      },
    ],
  },
];

export default function HeroShowcase({
  totalPerfumesCount,
  brandsCount,
}: {
  totalPerfumesCount: number;
  brandsCount: number;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = CHAPTERS[activeIdx] || CHAPTERS[0];

  return (
    <section
      aria-label="Featured fragrance campaigns"
      className="relative bg-[#12100E] text-[#F7F4EE] overflow-hidden border-b border-[#2C2722]"
    >
      {/* Bespoke Obsidian & Amber Studio Campaign Backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src="/images/hero-obsidian-campaign.jpg"
          alt=""
          fetchPriority="high"
          className="w-full h-full object-cover object-center opacity-60 sm:opacity-68"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0C0B]/95 via-[#12100E]/78 to-[#12100E]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0B] via-transparent to-[#0E0C0B]/40" />
      </div>

      {/* Main Responsive Campaign Frame */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-10 sm:py-14 lg:py-16">
        {/* Chapter Selector Strip (Desktop & Mobile Horizontal Scroll) */}
        <div
          role="tablist"
          aria-label="Campaign highlights"
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-6 sm:pb-8"
        >
          {CHAPTERS.map((chap, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={chap.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveIdx(idx)}
                className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] border transition-colors cursor-pointer ${
                  active
                    ? "bg-[#D4AF7A] text-[#141210] border-[#D4AF7A]"
                    : "bg-black/35 text-[#D4CFC7] border-[#3B342C] hover:border-[#9A7953] hover:text-white"
                }`}
              >
                <span className="opacity-75 mr-1.5">{chap.index}</span>
                {chap.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Asymmetric Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Typography Column */}
          <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-[#9A7953]/40 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF7A]">
              <Sparkles size={12} />
              <span>{current.eyebrow}</span>
            </div>

            <h1 className="font-serif text-[38px] min-[420px]:text-[44px] sm:text-[54px] lg:text-[64px] font-semibold text-white leading-[1.04] tracking-[-0.02em]">
              {current.headlineTop}{" "}
              <span className="block text-[#D4AF7A] font-normal italic">
                {current.headlineAccent}
              </span>
            </h1>

            <p className="text-[14px] sm:text-[16px] text-[#D4CFC7] leading-[1.65] max-w-xl">
              {current.copy}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
              <Link
                href={current.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 bg-[#F7F4EE] hover:bg-[#D4AF7A] text-[#141210] font-semibold text-xs uppercase tracking-[0.12em] px-6 py-4 rounded-[6px] transition-colors"
              >
                <span>{current.primaryCta.label}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href={current.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 text-white border border-[#9A7953]/60 font-semibold text-xs uppercase tracking-[0.12em] px-6 py-4 rounded-[6px] transition-colors"
              >
                <span>{current.secondaryCta.label}</span>
              </Link>
            </div>

            {/* Grounded Storefront Commitments */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5 border-t border-white/12 text-xs text-[#C7C1B8]">
              <div>
                <strong className="block text-white font-semibold">
                  {totalPerfumesCount.toLocaleString("en-IN")}+ Bottles
                </strong>
                <span>Verified Stocked Vault</span>
              </div>
              <div>
                <strong className="block text-white font-semibold">
                  {brandsCount}+ Houses
                </strong>
                <span>Designer, Niche &amp; Gulf</span>
              </div>
              <div>
                <strong className="block text-white font-semibold">
                  Free 7ML Tester
                </strong>
                <span>Paradox EDP Included</span>
              </div>
              <div>
                <strong className="block text-white font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} className="text-[#D4AF7A]" /> Batch Verified
                </strong>
                <span>Code LUXURY25 Active</span>
              </div>
            </div>
          </div>

          {/* Spotlight Sculpture / Studio Product Composition */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-black/45 backdrop-blur-sm border border-[#9A7953]/35 rounded-[12px] p-4 sm:p-6 space-y-4">
              {/* Main Spotlight Flacon */}
              <Link
                href={current.featuredCard.href}
                className="group block relative rounded-[10px] bg-gradient-to-b from-white/8 to-black/40 border border-white/10 p-5 sm:p-6 overflow-hidden"
              >
                <div className="aspect-[16/11] sm:aspect-[4/3] flex items-center justify-center">
                  <img
                    src={current.featuredCard.image}
                    alt={current.featuredCard.name}
                    fetchPriority="high"
                    className="w-full h-full object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,0.85)] group-hover:scale-[1.04] transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D4AF7A]">
                      {current.featuredCard.subtitle}
                    </p>
                    <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white truncate">
                      {current.featuredCard.name}
                    </h2>
                    <p className="text-[11px] text-[#B8B2A9] mt-0.5 line-clamp-1">
                      {current.featuredCard.notesLine}
                    </p>
                  </div>
                  <span className="shrink-0 w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#D4AF7A] group-hover:text-[#141210] flex items-center justify-center text-white transition-colors">
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>

              {/* Companion Pedestals Row */}
              <div className="grid grid-cols-2 gap-3">
                {current.companionBottles.map((bot) => (
                  <Link
                    key={bot.href}
                    href={bot.href}
                    className="group flex items-center gap-3 p-2.5 sm:p-3 rounded-[8px] bg-white/6 hover:bg-white/12 border border-white/10 hover:border-[#D4AF7A]/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-[6px] bg-black/45 p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={bot.image}
                        alt={bot.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white group-hover:text-[#D4AF7A] transition-colors truncate">
                        {bot.name}
                      </p>
                      <p className="text-[10px] text-[#B8B2A9]">View Flacon →</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

