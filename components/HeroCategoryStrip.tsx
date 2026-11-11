import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Gem,
  Sparkles,
  Award,
  Star,
  Gift,
} from "lucide-react";

const DISCOVERY_TILES = [
  {
    label: "Designer Fragrances",
    href: "/collections/designer-perfumes",
    icon: Crown,
  },
  {
    label: "Middle Eastern Perfumes",
    href: "/collections/middle-eastern-perfumes",
    icon: Sparkles,
  },
  {
    label: "Niche Fragrances",
    href: "/collections/niche-perfumes",
    icon: Gem,
  },
  {
    label: "Best Sellers",
    href: "/collections/bestsellers",
    icon: Award,
  },
  {
    label: "New Arrivals",
    href: "/collections/new-arrivals",
    icon: Star,
  },
  {
    label: "Gift Sets",
    href: "/collections/gift-sets",
    icon: Gift,
  },
] as const;

export default function HeroCategoryStrip() {
  return (
    <section
      aria-label="Category shortcuts"
      className="bg-[#FAF8F4] border-b border-[#E8E6E1] py-4 sm:py-5"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex lg:grid lg:grid-cols-6 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-proximity touch-pan-x pb-0.5 lg:pb-0">
          {DISCOVERY_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group snap-start shrink-0 min-w-[196px] sm:min-w-[210px] lg:min-w-0 flex items-center justify-between gap-2 px-3 py-2.5 rounded-[10px] bg-white border border-[#E6E0D6] hover:border-[#9A7953] hover:shadow-xs transition-all focus-visible:outline-2 focus-visible:outline-[#1F1D1B] focus-visible:outline-offset-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-8 h-8 rounded-[8px] bg-[#F7F3EC] border border-[#E8E0D4] flex items-center justify-center shrink-0 text-[#8A6B46] group-hover:bg-[#1F1D1B] group-hover:text-[#D4AF7A] group-hover:border-[#1F1D1B] transition-colors">
                    <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-[12px] font-medium text-[#24211E] group-hover:text-[#9A7953] transition-colors leading-[1.25]">
                    {tile.label}
                  </span>
                </div>
                <ArrowRight
                  size={14}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="text-[#8E867B] group-hover:text-[#9A7953] group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

