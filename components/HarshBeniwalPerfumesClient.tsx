"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star, ShieldCheck, Flame, ShoppingBag, ArrowRight, Heart, CheckCircle2, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

interface Perfume {
  id: number;
  title: string;
  handle: string;
  brand: string;
  collaborator: string;
  volume: string;
  concentration: string;
  inspiredBy: string;
  gender: string;
  tagline: string;
  scentStory: string;
  price: number;
  compareAtPrice: number;
  discountPercent: number;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  goodToKnow: string[];
  images: {
    url?: string;
    localPath?: string;
    local_src?: string;
    src?: string;
    alt?: string;
    type?: string;
  }[];
  sku: string;
  rating: {
    value: number;
    count: number;
  };
}

interface HarshBeniwalPerfumesClientProps {
  perfumes: Perfume[];
}

export default function HarshBeniwalPerfumesClient({ perfumes }: HarshBeniwalPerfumesClientProps) {
  const [filter, setFilter] = useState<string>("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { addItem } = useCartStore();

  const filteredPerfumes = perfumes.filter((p) => {
    if (filter === "all") return true;
    if (filter === "him") return p.gender.toLowerCase().includes("him");
    if (filter === "her") return p.gender.toLowerCase().includes("her");
    if (filter === "unisex") return p.gender.toLowerCase().includes("unisex");
    return true;
  });

  const handleAddToCart = (perfume: Perfume) => {
    const primaryImg = perfume.images?.[0]?.localPath || perfume.images?.[0]?.url || "/logo.png";
    addItem({
      id: perfume.id.toString(),
      title: `${perfume.title} - 50ML EDP`,
      price: perfume.price,
      image: primaryImg,
      quantity: 1,
      variantId: `${perfume.id}-edp`,
      variantTitle: "50ML - Eau De Parfum",
    });
    toast.success(`Added ${perfume.title} (50ML EDP) to cart!`, {
      icon: "✨",
      style: {
        background: "#1c1917",
        color: "#fef3c7",
        border: "1px solid #78350f",
      },
    });
  };

  const faqs = [
    {
      q: "What is Harsh Beniwal's association with Octopus Perfumes?",
      a: "Harsh Beniwal is the official brand partner and creative ambassador for the Octopus Perfumes collection. Each 50ml EDP fragrance has been specially formulated to deliver luxury niche accords crafted for Indian weather conditions with supreme longevity.",
    },
    {
      q: "What is the concentration and oil percentage of these perfumes?",
      a: "All Octopus Perfumes are formulated as Eau De Parfum (EDP) with 25%+ high fragrance oil concentration, providing 12+ hours of consistent projection and refined sillage.",
    },
    {
      q: "What luxury fragrances are these perfumes inspired by?",
      a: "The collection includes accords inspired by the world's most sought-after niche fragrances: Overlord (Sauvage), Promised (Baccarat Rouge 540), Somersault (Louis Vuitton Imagination), Mirage (Louis Vuitton Ombre Nomade), Outlaw (Tom Ford Ombre Leather), Your Move (Tom Ford Oud Wood), Rhapsody (Maison Margiela Jazz Club), Paradox (LV Les Sables Roses), and Darling (Miss Dior).",
    },
    {
      q: "Are Octopus Perfumes safe on sensitive skin?",
      a: "Yes. All formulations are IFRA compliant, dermatologically tested, non-staining, cruelty-free, and blended with premium imported fragrance oils.",
    },
    {
      q: "What is the shipping time and is Cash on Delivery (COD) available?",
      a: "We provide Free Express Delivery across India within 2 to 5 business days. Both online prepaid payment and Cash on Delivery (COD) options are fully supported.",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            The Complete 50ML EDP Lineup
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Showing all {filteredPerfumes.length} official fragrances by Harsh Beniwal
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Perfumes" },
            { id: "him", label: "For Him" },
            { id: "her", label: "For Her" },
            { id: "unisex", label: "Unisex Favorites" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                filter === tab.id
                  ? "bg-stone-950 text-amber-300 shadow-md scale-105"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPerfumes.map((perfume) => {
          const primaryImg = perfume.images?.[0]?.local_src || perfume.images?.[0]?.localPath || perfume.images?.[0]?.url || "/logo.png";
          const secondaryImg = perfume.images?.[1]?.local_src || perfume.images?.[1]?.localPath || perfume.images?.[1]?.url || primaryImg;
          return (
            <article
              key={perfume.handle}
              className="group bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gradient-to-b from-stone-50 to-stone-100 overflow-hidden p-4 sm:p-6 flex items-center justify-center">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-stone-950/90 text-amber-300 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    <Sparkles size={11} /> 50ML EDP
                  </span>
                  <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                    Save {perfume.discountPercent}%
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-20">
                  <span className="text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-stone-800 px-2.5 py-1 rounded-full shadow-sm">
                    {perfume.gender}
                  </span>
                </div>

                <Link
                  href={`/products/${perfume.handle}`}
                  className="w-full h-full relative flex items-center justify-center"
                >
                  {/* Primary Bottle Image */}
                  <Image
                    src={primaryImg}
                    alt={`${perfume.title} - 100% Original Bottle by Harsh Beniwal`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:opacity-0 group-hover:scale-105 transition-all duration-500 z-10"
                  />

                  {/* Secondary Lifestyle / Hero Image on Hover */}
                  {secondaryImg !== primaryImg && (
                    <Image
                      src={secondaryImg}
                      alt={`${perfume.title} - Lifestyle Edition`}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 z-10"
                    />
                  )}
                </Link>

                {/* Multi-image indicator badge */}
                {perfume.images && perfume.images.length > 1 && (
                  <div className="absolute bottom-2.5 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/60 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full">
                    +{perfume.images.length - 1} photos
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-6 flex flex-col flex-1">
                {/* Accord Inspiration */}
                <div className="mb-2">
                  <span className="text-[11px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200/60 px-2.5 py-0.5 rounded-md inline-block">
                    Inspired by: <strong>{perfume.inspiredBy}</strong>
                  </span>
                </div>

                {/* Title & Tagline */}
                <Link href={`/products/${perfume.handle}`}>
                  <h3 className="font-serif text-2xl font-bold text-stone-950 hover:text-amber-700 transition-colors">
                    {perfume.title}
                  </h3>
                </Link>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {perfume.tagline}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3 text-xs text-stone-600">
                  <div className="flex items-center text-amber-500">
                    <Star size={13} fill="currentColor" />
                    <span className="ml-1 font-bold text-stone-900">{perfume.rating.value}</span>
                  </div>
                  <span className="text-stone-300">|</span>
                  <span className="text-stone-500">({perfume.rating.count} verified reviews)</span>
                </div>

                {/* Olfactory Notes Mini Preview */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-stone-800 w-12 shrink-0">Top:</span>
                    <span className="text-stone-600 truncate">{perfume.notes.top}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-stone-800 w-12 shrink-0">Heart:</span>
                    <span className="text-stone-600 truncate">{perfume.notes.heart}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-stone-800 w-12 shrink-0">Base:</span>
                    <span className="text-stone-600 truncate">{perfume.notes.base}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto pt-6 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-stone-950">
                        ₹{perfume.price}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{perfume.compareAtPrice}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Free Express Delivery
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(perfume)}
                      className="px-4 py-2.5 bg-stone-950 hover:bg-stone-800 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 active:scale-95"
                    >
                      <ShoppingBag size={14} /> Buy Now
                    </button>
                    <Link
                      href={`/products/${perfume.handle}`}
                      className="p-2.5 rounded-xl border border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-950 transition-colors"
                      title="View Details"
                    >
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Brand & Quality Highlights Section */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/60 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-amber-500/20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Crafted Without Compromise
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Why Harsh Beniwal Chose Octopus Perfumes
          </h2>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed">
            Every bottle is an ode to high-performance artisanal perfumery. Sourced with natural absolute oils, matured for optimal maceration, and packaged in weighted luxury monocartons designed to turn heads everywhere you go.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-10 border-t border-stone-800 text-center">
          <div className="space-y-1">
            <div className="font-serif text-3xl font-bold text-amber-400">25%+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">Oil Concentration</div>
            <div className="text-[11px] text-stone-400">True Eau De Parfum strength</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-3xl font-bold text-amber-400">12+ Hrs</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">Wear Longevity</div>
            <div className="text-[11px] text-stone-400">Tested in humid climate</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-3xl font-bold text-amber-400">IFRA</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">Certified Safe</div>
            <div className="text-[11px] text-stone-400">Non-irritating & clean</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-3xl font-bold text-amber-400">0% Gas</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">Pure Perfume</div>
            <div className="text-[11px] text-stone-400">100% liquid fine fragrance</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-600">
            Everything you need to know about Octopus Perfumes by Harsh Beniwal
          </p>
        </div>

        <div className="space-y-3 mt-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-stone-200 rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-stone-900 hover:text-amber-800 transition-colors"
              >
                <span className="text-base">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-stone-400 transition-transform duration-300 ${
                    activeFaq === idx ? "rotate-180 text-amber-700" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
