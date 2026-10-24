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
      q: "What is the shipping time and payment options?",
      a: "We provide Free Pan-India Express Delivery within 2 to 5 business days. All orders are processed with 100% secure online prepaid payments (UPI, Cards, NetBanking).",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Category Filter Pills (Airbnb Category Strip) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#222222] tracking-tight">
            The Complete 50ML EDP Lineup
          </h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">
            Showing all {filteredPerfumes.length} official niche fragrances by Harsh Beniwal
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
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-[#222222] text-white border border-[#222222]"
                  : "bg-white text-[#222222] border border-[#dddddd] hover:border-[#222222]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid (Airbnb 3-Column / 4-Column Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPerfumes.map((perfume) => {
          const primaryImg = perfume.images?.[0]?.local_src || perfume.images?.[0]?.localPath || perfume.images?.[0]?.url || "/logo.png";
          const secondaryImg = perfume.images?.[1]?.local_src || perfume.images?.[1]?.localPath || perfume.images?.[1]?.url || primaryImg;
          return (
            <article
              key={perfume.handle}
              className="group flex flex-col relative"
            >
              {/* Photo Plate (14px Corner Clipping) */}
              <div className="relative aspect-square rounded-[14px] overflow-hidden bg-[#f7f7f7] group-hover:shadow-airbnb-hover transition-shadow duration-300">
                {/* Floating "Guest favorite" Badge */}
                <div className="guest-favorite-badge">
                  <span>Guest favorite</span>
                </div>

                <div className="absolute top-3 right-3 z-20">
                  <span className="text-[11px] font-medium bg-white text-[#222222] px-2.5 py-0.5 rounded-full shadow-xs">
                    {perfume.gender}
                  </span>
                </div>

                <Link
                  href={`/products/${perfume.handle}`}
                  className="w-full h-full relative flex items-center justify-center p-6"
                >
                  <Image
                    src={primaryImg}
                    alt={`${perfume.title} - Harsh Beniwal EDP`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-all duration-400"
                  />
                </Link>

                {/* Quick Add CTA Bar */}
                <div className="absolute inset-x-3 bottom-3 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-200 z-20">
                  <button
                    onClick={() => handleAddToCart(perfume)}
                    className="w-full bg-[#ff385c] hover:bg-[#e00b41] text-white py-2.5 rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingBag size={14} /> Quick Reserve
                  </button>
                </div>
              </div>

              {/* Meta Content */}
              <div className="mt-3 flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <Link href={`/products/${perfume.handle}`} className="flex-1 truncate">
                    <h3 className="text-[15px] font-semibold text-[#222222] hover:text-[#ff385c] transition-colors truncate">
                      {perfume.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-[13px] font-semibold text-[#222222] shrink-0">
                    <span className="text-[11px]">★</span>
                    <span>{perfume.rating.value}</span>
                  </div>
                </div>

                <p className="text-[13px] text-[#6a6a6a] truncate">
                  Inspired by {perfume.inspiredBy}
                </p>

                <p className="text-[13px] text-[#6a6a6a] truncate">
                  25%+ French Oils • 12H Longevity
                </p>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-[15px] font-semibold text-[#222222]">
                    ₹{perfume.price}
                  </span>
                  <span className="text-[13px] text-[#6a6a6a]">total</span>
                  <span className="text-[12px] text-[#ff385c] font-medium ml-auto">
                    Save {perfume.discountPercent}%
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Brand & Quality Highlights Section (Airbnb Host Card / Editorial Band) */}
      <section className="bg-[#f7f7f7] border border-[#ebebeb] rounded-[16px] p-8 md:p-12 text-[#222222]">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#ff385c]">
            Formulation Standard
          </span>
          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#222222]">
            Why Harsh Beniwal Formulated Octopus
          </h2>
          <p className="text-[15px] text-[#6a6a6a] leading-relaxed">
            Every bottle is blended with imported French absolute perfume oils, macerated for maximum depth, and bottled at 25%+ Eau De Parfum concentration to withstand humid Indian conditions with 12+ hours of consistent sillage.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-10 border-t border-[#dddddd] text-center">
          <div className="space-y-1">
            <div className="text-[28px] font-bold text-[#222222]">25%+</div>
            <div className="text-[13px] font-semibold text-[#222222]">Oil Concentration</div>
            <div className="text-[12px] text-[#6a6a6a]">Eau De Parfum grade</div>
          </div>
          <div className="space-y-1">
            <div className="text-[28px] font-bold text-[#222222]">12+ Hrs</div>
            <div className="text-[13px] font-semibold text-[#222222]">Projection & Sillage</div>
            <div className="text-[12px] text-[#6a6a6a]">All-day wear guarantee</div>
          </div>
          <div className="space-y-1">
            <div className="text-[28px] font-bold text-[#222222]">IFRA</div>
            <div className="text-[13px] font-semibold text-[#222222]">Certified Safe</div>
            <div className="text-[12px] text-[#6a6a6a]">Dermatologically clean</div>
          </div>
          <div className="space-y-1">
            <div className="text-[28px] font-bold text-[#222222]">100% Free</div>
            <div className="text-[13px] font-semibold text-[#222222]">7ML Paradox Tester</div>
            <div className="text-[12px] text-[#6a6a6a]">Included with every order</div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Airbnb Clean Accordion Style) */}
      <section className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-left space-y-1 pb-4 border-b border-[#ebebeb]">
          <h2 className="text-[22px] font-semibold text-[#222222]">
            Frequently Asked Questions
          </h2>
          <p className="text-[14px] text-[#6a6a6a]">
            Everything you need to know about ordering Harsh Beniwal perfumes
          </p>
        </div>

        <div className="divide-y divide-[#ebebeb]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 font-medium text-[16px] text-[#222222] hover:text-[#ff385c] transition-colors cursor-pointer py-1"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#6a6a6a] transition-transform duration-200 shrink-0 ${
                    activeFaq === idx ? "rotate-180 text-[#222222]" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="pt-3 pb-2 text-[14px] text-[#6a6a6a] leading-relaxed">
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
