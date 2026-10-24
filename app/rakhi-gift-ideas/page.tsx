import Link from "next/link";
import { ChevronRight, Gift, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Luxury Diwali & Festive Fragrance Gift Guide (2026) | Octopus Perfumes",
  description: "Discover why 50ML Eau De Parfums by Harsh Beniwal are 2026's top Diwali luxury gifts. Formulated with 25%+ French fragrance oils with a free 7ML Paradox tester pack.",
};

export default function FestiveGiftIdeasPage() {
  return (
    <div className="bg-white text-[#222222] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#f7f7f7] border-b border-[#ebebeb] pt-12 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-[13px] text-[#6a6a6a] mb-4">
            <Link href="/" className="hover:text-[#222222] hover:underline transition-colors">Home</Link>
            <span>/</span>
            <Link href="/harsh-beniwal/octopus/perfumes" className="hover:text-[#222222] hover:underline transition-colors">Perfumes</Link>
            <span>/</span>
            <span className="text-[#222222] font-medium truncate">Diwali Fragrance Guide</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 bg-white text-[#222222] text-[11px] font-semibold px-3 py-1 rounded-full mb-4 border border-[#dddddd]">
            <span>Festive Gifting Guide</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] text-[#222222] leading-tight mb-4 font-bold tracking-tight">
            The Ultimate Festive Perfume Gift Guide
          </h1>
          <p className="text-[#3f3f3f] text-base leading-relaxed mb-4">
            Skip the generic sweet boxes this Diwali. From 50ML Eau De Parfums by Harsh Beniwal to luxury fragrance discovery boxes, here are the most thoughtful festive presents that radiate status, elegance, and 12+ hour sillage.
          </p>
          <div className="flex items-center gap-2 text-[13px] text-[#6a6a6a]">
            <span>By Octopus Perfumery Team</span>
            <span>·</span>
            <span>Verified Festive Fragrance Guide</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 mt-10 space-y-10 text-[#222222]">
        <div className="prose prose-stone max-w-none text-justify text-[15px] leading-relaxed text-[#3f3f3f]">
          <p>
            The festival of lights is a time for celebration, warmth, and meaningful gifting. High-concentration Eau De Parfum fragrances crafted with imported French oils leave a memorable olfactory signature that lingers long after festivities end.
          </p>
          <p>
            Whether you are curating gifts for family, loved ones, or colleagues, Octopus Perfumes offers deluxe festive packaging, 25%+ French oil formulations, a complimentary 7ML Paradox tester pack, and express pan-India shipping.
          </p>
        </div>

        {/* Perfumes Highlight Section */}
        <div className="bg-white border border-[#ebebeb] hover:border-[#dddddd] rounded-[14px] p-6 sm:p-8 shadow-airbnb">
          <h2 className="text-[20px] text-[#222222] font-bold pb-2 mb-2 flex items-center gap-2">
            <span>👑</span> Flagship Pick: Harsh Beniwal 50ML EDP Perfumes
          </h2>
          <p className="text-[#6a6a6a] mb-6 text-sm leading-relaxed">
            Crafted with 25%+ imported French perfume oil concentration, these luxury fragrances provide 12+ hours of long-lasting sillage. Featured scents include Overlord (Dior Sauvage inspired), Paradox (Louis Vuitton Les Sables Roses inspired), and Promised (Baccarat Rouge 540 inspired).
          </p>
          <Link 
            href="/harsh-beniwal/octopus/perfumes" 
            className="inline-flex items-center gap-2 bg-[#ff385c] hover:bg-[#e00b41] text-white px-6 py-3 rounded-lg text-xs font-medium transition-colors"
          >
            Explore All 9 Fragrances <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bestseller Fragrance Picks */}
        <div>
          <h2 className="text-[20px] text-[#222222] font-semibold border-b border-[#ebebeb] pb-3 mb-6">
            Festive Bestseller Fragrance Duos
          </h2>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-[14px] border border-[#ebebeb] shadow-airbnb flex flex-col justify-between">
              <h3 className="font-semibold text-base mb-1 text-[#222222]">1. Overlord 50ML EDP (Daytime Seduction)</h3>
              <p className="text-[#6a6a6a] mb-4 text-sm leading-relaxed">Zesty Calabrian bergamot, spicy Sichuan pepper, and warm ambroxan. The ultimate crowd-pleasing signature fragrance.</p>
              <Link href="/products/overlord" className="text-[#ff385c] hover:underline font-medium text-xs flex items-center gap-1.5 transition-colors">
                Order Overlord @ ₹1,299 <ArrowRight size={14} />
              </Link>
            </li>
            <li className="bg-white p-6 rounded-[14px] border border-[#ebebeb] shadow-airbnb flex flex-col justify-between">
              <h3 className="font-semibold text-base mb-1 text-[#222222]">2. Paradox 50ML EDP (Evening Mystery)</h3>
              <p className="text-[#6a6a6a] mb-4 text-sm leading-relaxed">Damascena Rose blended with rare agarwood oud and rich amber. Intoxicating and magnetic for celebratory festive evenings.</p>
              <Link href="/products/paradox" className="text-[#ff385c] hover:underline font-medium text-xs flex items-center gap-1.5 transition-colors">
                Order Paradox @ ₹1,299 <ArrowRight size={14} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Free Tester Perk */}
        <div>
          <h2 className="text-[20px] text-[#222222] font-semibold border-b border-[#ebebeb] pb-3 mb-6">
            Complimentary Gift With Every Order
          </h2>
          <div className="bg-white p-6 rounded-[14px] border border-[#ebebeb] shadow-airbnb">
            <h3 className="font-semibold text-base mb-1 text-[#222222]">3. Free 7ML Paradox EDP Tester Pack (₹399 Value)</h3>
            <p className="text-[#6a6a6a] mb-4 text-sm leading-relaxed">Every order automatically comes with a complimentary 7ML Paradox pocket tester. Perfect for travel, touchups, and gifting.</p>
            <Link href="/harsh-beniwal/octopus/perfumes" className="text-[#ff385c] hover:underline font-medium text-xs flex items-center gap-1.5 transition-colors">
              Claim Your Free Tester Pack <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#f7f7f7] border border-[#ebebeb] p-8 sm:p-10 rounded-[14px] text-center shadow-airbnb">
          <Gift size={36} className="mx-auto mb-3 text-[#ff385c]" />
          <h2 className="text-[22px] font-bold mb-2 text-[#222222]">Ready For Diwali Celebrations?</h2>
          <p className="mb-6 text-[#6a6a6a] text-sm">
            Use code <strong className="font-mono bg-white text-[#222222] px-2 py-0.5 rounded border border-[#dddddd]">DIWALI20</strong> at checkout for flat 20% OFF and free express delivery across India!
          </p>
          <Link href="/harsh-beniwal/octopus/perfumes" className="inline-block bg-[#ff385c] hover:bg-[#e00b41] text-white px-7 py-3.5 rounded-lg font-medium text-sm transition-colors">
            Explore All 9 Harsh Beniwal EDPs
          </Link>
        </div>

      </div>
    </div>
  );
}
