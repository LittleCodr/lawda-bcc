import Link from "next/link";
import { ChevronRight, Gift, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "31 Luxury Diwali & Festive Personalized Gift Ideas (2026) | Octopus",
  description: "Discover the best luxury Diwali gifts, 50ML EDP perfumes by Harsh Beniwal, custom jewelry, and festive hampers under ₹499, ₹999, and ₹1299 with fast delivery across India.",
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
            <Link href="/collections/all" className="hover:text-black transition-colors">Gifting Guide</Link>
            <ChevronRight size={12} />
            <span className="text-black font-black truncate">Diwali Festive Gift Ideas</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 bg-black text-amber-300 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full mb-6 border border-black shadow-[2px_2px_0px_0px_#000]">
            <span>🪔 DIWALI FESTIVE EDITION 2026</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-black leading-tight mb-6 font-black">
            31 Luxury Diwali & Festive Gift Ideas That Truly Impress
          </h1>
          <p className="text-stone-800 text-base md:text-lg font-medium leading-relaxed mb-6">
            Skip the generic sweet boxes this Diwali. From 50ML Eau De Parfums by Harsh Beniwal to bespoke 22K gold-plated jewelry, here are the most thoughtful festive presents that look like a million bucks.
          </p>
          <div className="flex items-center gap-3 text-xs font-bold text-stone-600">
            <span>By Octopus Editorial Team</span>
            <span>•</span>
            <span>Diwali Festive Guide</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 mt-12 space-y-12 text-stone-900">
        <div className="prose prose-stone max-w-none text-justify">
          <p className="leading-relaxed">
            The festival of lights is a time for celebration, warmth, and heartfelt gifting. Moving beyond mass-produced items by choosing personalized keepsakes and high-oil Eau De Parfum fragrances leaves an unforgettable impression.
          </p>
          <p className="leading-relaxed">
            Whether you are curating gifts for family, loved ones, or corporate colleagues, Octopus offers deluxe festive gift packaging, authentic French formulations, and express pan-India shipping.
          </p>
        </div>

        {/* Perfumes Highlight Section */}
        <div className="border-2 border-black rounded-xl p-6 bg-amber-50 shadow-[4px_4px_0px_0px_#000]">
          <h2 className="font-serif text-2xl text-black font-black pb-2 mb-4 flex items-center gap-2">
            <span>👑</span> Flagship Pick: Harsh Beniwal 50ML EDP Perfumes
          </h2>
          <p className="text-stone-700 mb-4 text-sm leading-relaxed">
            Crafted with 25%+ imported French perfume oil concentration, these luxury fragrances provide 12+ hours of long-lasting sillage. Featured scents include Overlord (Dior Sauvage inspired), Paradox (Louis Vuitton Les Sables Roses inspired), and Promised (Baccarat Rouge 540 inspired).
          </p>
          <Link 
            href="/harsh-beniwal/octopus/perfumes" 
            className="inline-flex items-center gap-2 bg-black text-amber-300 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-stone-900 transition-all cursor-pointer"
          >
            Explore All 9 Fragrances <ArrowRight size={14} />
          </Link>
        </div>

        {/* Under 499 Section */}
        <div>
          <h2 className="font-serif text-2xl text-black font-black border-b-2 border-black pb-2 mb-6">
            Bespoke Gifts Under ₹499
          </h2>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <h3 className="font-black text-lg mb-2">1. Personalized 22K Gold Plated Name Necklace</h3>
              <p className="text-stone-600 mb-4 text-sm">Our signature bestseller. Waterproof, anti-tarnish, and bespoke with any custom name.</p>
              <Link href="/collections/name-necklaces" className="text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-amber-600">
                Shop Name Necklaces <ArrowRight size={14} />
              </Link>
            </li>
            <li className="bg-white p-6 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <h3 className="font-black text-lg mb-2">2. Custom Laser Engraved Keychain</h3>
              <p className="text-stone-600 text-sm">Solid stainless steel with initials or auspicious dates. Ideal everyday keepsake.</p>
            </li>
          </ul>
        </div>

        {/* Under 999 Section */}
        <div>
          <h2 className="font-serif text-2xl text-black font-black border-b-2 border-black pb-2 mb-6">
            Luxury Gifts Under ₹999
          </h2>
          <ul className="space-y-4">
            <li className="bg-white p-6 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <h3 className="font-black text-lg mb-2">3. Engraved Vegan Leather Wallet</h3>
              <p className="text-stone-600 mb-4 text-sm">Sophisticated, practical wallet customized with precision laser engraving.</p>
              <Link href="/collections/gifts-under-999" className="text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-amber-600">
                Shop Luxury Gifts Under ₹999 <ArrowRight size={14} />
              </Link>
            </li>
          </ul>
        </div>

        {/* CTA Banner */}
        <div className="bg-amber-400 border-3 border-black p-8 rounded-2xl text-black text-center shadow-[6px_6px_0px_0px_#000]">
          <Gift size={40} className="mx-auto mb-4 text-black stroke-[2.5]" />
          <h2 className="font-serif text-3xl font-black mb-2">Ready For Diwali Celebrations?</h2>
          <p className="mb-6 font-bold text-stone-900 text-sm">
            Use code <strong className="font-mono bg-black text-amber-300 px-2 py-0.5 rounded border border-black">DIWALI20</strong> at checkout for flat 20% OFF and free express delivery across India!
          </p>
          <Link href="/collections/all" className="inline-block bg-black text-amber-300 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-stone-900 transition-all cursor-pointer">
            Explore Full Festive Collection 🪔
          </Link>
        </div>

      </div>
    </div>
  );
}
