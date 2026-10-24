import Link from "next/link";
import { ChevronRight, Gift, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Luxury Diwali & Festive Fragrance Gift Guide (2026) | Octopus Perfumes",
  description: "Discover why 50ML Eau De Parfums by Harsh Beniwal are 2026's top Diwali luxury gifts. Formulated with 25%+ French fragrance oils with a free 7ML Paradox tester pack.",
};

export default function FestiveGiftIdeasPage() {
  return (
    <div className="bg-[#FFFDF9] min-h-screen pb-32">
      {/* Header */}
      <div className="bg-amber-100 border-b-2 border-black pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-stone-600 mb-6">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/harsh-beniwal/octopus/perfumes" className="hover:text-black transition-colors">Perfumes</Link>
            <ChevronRight size={12} />
            <span className="text-black font-black truncate">Diwali Fragrance Guide</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 backdrop-blur-md text-amber-800 text-[10px] uppercase tracking-widest font-bold px-3.5 py-1.5 rounded-full mb-6 border border-amber-400/30 shadow-sm">
            <span>🪔 DIWALI FESTIVE PERFUME GUIDE 2026</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stone-950 leading-tight mb-6 font-black tracking-tight">
            The Ultimate Festive Perfume Gift Guide
          </h1>
          <p className="text-stone-800 text-base md:text-lg font-medium leading-relaxed mb-6">
            Skip the generic sweet boxes this Diwali. From 50ML Eau De Parfums by Harsh Beniwal to luxury fragrance discovery boxes, here are the most thoughtful festive presents that radiate status, elegance, and 12+ hour sillage.
          </p>
          <div className="flex items-center gap-3 text-xs font-bold text-stone-600">
            <span>By Octopus Perfumery Team</span>
            <span>•</span>
            <span>Diwali Luxury Fragrance Guide</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 mt-12 space-y-12 text-stone-900">
        <div className="prose prose-stone max-w-none text-justify">
          <p className="leading-relaxed">
            The festival of lights is a time for celebration, warmth, and meaningful gifting. High-concentration Eau De Parfum fragrances crafted with imported French oils leave a memorable olfactory signature that lingers long after festivities end.
          </p>
          <p className="leading-relaxed">
            Whether you are curating gifts for family, loved ones, or colleagues, Octopus Perfumes offers deluxe festive packaging, 25%+ French oil formulations, a complimentary 7ML Paradox tester pack, and express pan-India shipping.
          </p>
        </div>

        {/* Perfumes Highlight Section */}
        <div className="backdrop-blur-2xl bg-gradient-to-br from-amber-400/20 via-white/80 to-amber-100/30 border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-500/5">
          <h2 className="font-serif text-2xl text-stone-950 font-black pb-2 mb-4 flex items-center gap-2">
            <span>👑</span> Flagship Pick: Harsh Beniwal 50ML EDP Perfumes
          </h2>
          <p className="text-stone-700 mb-6 text-sm leading-relaxed">
            Crafted with 25%+ imported French perfume oil concentration, these luxury fragrances provide 12+ hours of long-lasting sillage. Featured scents include Overlord (Dior Sauvage inspired), Paradox (Louis Vuitton Les Sables Roses inspired), and Promised (Baccarat Rouge 540 inspired).
          </p>
          <Link 
            href="/harsh-beniwal/octopus/perfumes" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-amber-300 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-black/15 hover:scale-105 transition-all cursor-pointer border border-stone-800"
          >
            Explore All 9 Fragrances <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bestseller Fragrance Picks */}
        <div>
          <h2 className="font-serif text-2xl text-stone-900 font-bold border-b border-amber-900/10 pb-2 mb-6">
            Festive Bestseller Fragrance Duos
          </h2>
          <ul className="space-y-4">
            <li className="backdrop-blur-xl bg-white/80 p-6 sm:p-7 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-bold text-lg mb-2 text-stone-900">1. Overlord 50ML EDP (Daytime Seduction)</h3>
              <p className="text-stone-600 mb-4 text-sm leading-relaxed">Zesty Calabrian bergamot, spicy Sichuan pepper, and warm ambroxan. The ultimate crowd-pleasing signature fragrance.</p>
              <Link href="/products/overlord" className="text-amber-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-amber-600 transition-colors">
                Order Overlord @ ₹1,299 <ArrowRight size={14} />
              </Link>
            </li>
            <li className="backdrop-blur-xl bg-white/80 p-6 sm:p-7 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-bold text-lg mb-2 text-stone-900">2. Paradox 50ML EDP (Evening Mystery)</h3>
              <p className="text-stone-600 mb-4 text-sm leading-relaxed">Damascena Rose blended with rare agarwood oud and rich amber. Intoxicating and magnetic for celebratory festive evenings.</p>
              <Link href="/products/paradox" className="text-amber-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-amber-600 transition-colors">
                Order Paradox @ ₹1,299 <ArrowRight size={14} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Free Tester Perk */}
        <div>
          <h2 className="font-serif text-2xl text-stone-900 font-bold border-b border-amber-900/10 pb-2 mb-6">
            Complimentary Festive Gift With Every Order
          </h2>
          <div className="backdrop-blur-xl bg-white/80 p-6 sm:p-7 rounded-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="font-bold text-lg mb-2 text-stone-900">3. Free 7ML Paradox EDP Tester Pack (₹399 Value)</h3>
            <p className="text-stone-600 mb-4 text-sm leading-relaxed">Every order automatically comes with a complimentary 7ML Paradox pocket tester. Perfect for travel, touchups, and gifting.</p>
            <Link href="/harsh-beniwal/octopus/perfumes" className="text-amber-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-amber-600 transition-colors">
              Claim Your Free Tester Pack <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="backdrop-blur-2xl bg-gradient-to-br from-amber-400/30 via-amber-300/40 to-yellow-400/30 border border-amber-400/60 p-8 sm:p-12 rounded-3xl text-stone-950 text-center shadow-2xl shadow-amber-500/20 relative overflow-hidden">
          <Gift size={40} className="mx-auto mb-4 text-amber-800 stroke-[2.2]" />
          <h2 className="font-serif text-3xl font-black mb-2 tracking-tight">Ready For Diwali Celebrations?</h2>
          <p className="mb-6 font-medium text-stone-800 text-sm">
            Use code <strong className="font-mono bg-stone-900 text-amber-300 px-2.5 py-1 rounded-lg border border-stone-800 shadow-sm">DIWALI20</strong> at checkout for flat 20% OFF and free express delivery across India!
          </p>
          <Link href="/harsh-beniwal/octopus/perfumes" className="inline-block bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-amber-300 px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-xl shadow-black/25 hover:scale-105 transition-all cursor-pointer border border-stone-800">
            Explore All 9 Harsh Beniwal EDPs 🪔
          </Link>
        </div>

      </div>
    </div>
  );
}
