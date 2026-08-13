import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Gift, ArrowRight } from "lucide-react";

export const metadata = {
  title: "31 Personalized Raksha Bandhan Gift Ideas for Sisters & Brothers (2026)",
  description: "Discover the best personalized Rakhi gifts for your sister or brother. Find unique custom jewelry, gift boxes, and meaningful presents under ₹299, ₹499, and ₹999 with fast delivery across India.",
};

export default function RakhiGiftIdeasPage() {
  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Article Header */}
      <div className="bg-[#f9f2ed] pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#800020] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/collections/rakhi-gifts" className="hover:text-[#800020] transition-colors">Rakhi Collection</Link>
            <ChevronRight size={12} />
            <span className="text-[#800020] truncate">31 Personalized Raksha Bandhan Gift Ideas</span>
          </nav>
          
          <span className="bg-[#800020] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-6 inline-block">Gift Guide</span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2d2d2d] leading-tight mb-6">
            31 Personalized Raksha Bandhan Gift Ideas for Sisters & Brothers (2026)
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed mb-8">
            Skip the generic chocolates this year. From custom name necklaces to engraved wallets, here are the most thoughtful and unique gifts that look like a million bucks but start at just ₹299.
          </p>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
            <span>By Octopus Editorial Team</span>
            <span>•</span>
            <span>August 2026</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-6 mt-12 space-y-12 text-[#2d2d2d]">
        <div className="prose prose-lg prose-stone max-w-none text-justify">
          <p>
            Raksha Bandhan is just around the corner (August 28th), and the pressure to find the perfect gift is on. Whether you're shopping for your annoying-but-lovable younger sister or your protective elder brother, finding something that truly says "I care" without breaking the bank can be a challenge.
          </p>
          <p>
            This year, <strong className="text-[#800020]">personalization is everything</strong>. Why give a standard off-the-shelf item when you can gift a custom-engraved piece of jewelry or a bespoke keepsake that they'll cherish forever? We've curated a list of 31 incredible <Link href="/collections/rakhi-gifts" className="text-[#800020] underline font-bold">Rakhi gifts</Link> that fit every budget and relationship dynamic.
          </p>
        </div>

        {/* Under 299 Section */}
        <div>
          <h2 className="font-serif text-3xl text-[#800020] border-b border-stone-200 pb-2 mb-6">Gifts Under ₹299 (Yes, Really!)</h2>
          <p className="mb-6">You don't need to spend a fortune to show you care. These budget-friendly options pack a massive emotional punch.</p>
          
          <ul className="space-y-6">
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">1. The Custom Initial Keychain</h3>
              <p className="text-gray-600 mb-4">A sleek, stainless steel keychain engraved with their initial. Perfect for their new car or house keys. It's practical, personal, and incredibly affordable.</p>
              <Link href="/collections/rakhi-gifts-under-299" className="text-[#800020] font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline">
                Shop Gifts Under ₹299 <ArrowRight size={16} />
              </Link>
            </li>
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">2. Engraved Metal Bookmark</h3>
              <p className="text-gray-600 mb-4">Is your sibling a bookworm? A personalized bookmark with a snarky inside joke is the ultimate budget win.</p>
            </li>
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">3. Mini Photo Magnet</h3>
              <p className="text-gray-600 mb-4">Turn that embarrassing childhood photo into a high-quality fridge magnet.</p>
            </li>
          </ul>
        </div>

        {/* Under 499 Section */}
        <div>
          <h2 className="font-serif text-3xl text-[#800020] border-b border-stone-200 pb-2 mb-6">Best Rakhi Gifts Under ₹499</h2>
          <p className="mb-6">This is the sweet spot for gifting. High-quality, personalized items that look incredibly premium.</p>
          
          <ul className="space-y-6">
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">4. Personalized Name Necklace</h3>
              <p className="text-gray-600 mb-4">Our absolute best-seller. Available in gold and silver finishes, these anti-tarnish necklaces are the <Link href="/collections/rakhi-gifts-for-sister" className="text-[#800020] font-bold underline">perfect Rakhi gift for sisters</Link>. They look like a ₹5000 piece but cost a fraction of that.</p>
              <Link href="/collections/rakhi-gifts-under-499" className="text-[#800020] font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline">
                Shop Name Necklaces <ArrowRight size={16} />
              </Link>
            </li>
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">5. Custom Leather Bracelet</h3>
              <p className="text-gray-600 mb-4">A great option for brothers. A rugged, braided leather bracelet featuring a small metal clasp engraved with his initials or a short message.</p>
              <Link href="/collections/rakhi-gifts-for-brother" className="text-[#800020] font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline">
                Shop Brother Gifts <ArrowRight size={16} />
              </Link>
            </li>
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">6. Coordinate Ring</h3>
              <p className="text-gray-600 mb-4">Engrave the coordinates of your childhood home on a sleek, minimalist ring.</p>
            </li>
          </ul>
        </div>

        {/* Under 999 Section */}
        <div>
          <h2 className="font-serif text-3xl text-[#800020] border-b border-stone-200 pb-2 mb-6">Premium Gifts Under ₹999</h2>
          <p className="mb-6">Want to go all out this year? These gifts offer unparalleled luxury and craftsmanship.</p>
          
          <ul className="space-y-6">
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">7. The Ultimate Engraved Wallet</h3>
              <p className="text-gray-600 mb-4">A premium vegan leather wallet engraved with his name. It's sophisticated, practical, and a massive step up from generic gifts.</p>
              <Link href="/collections/rakhi-gifts-under-999" className="text-[#800020] font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline">
                Shop Premium Gifts <ArrowRight size={16} />
              </Link>
            </li>
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">8. Photo Projection Necklace</h3>
              <p className="text-gray-600 mb-4">A stunning piece of jewelry that hides a secret photo inside the center stone. When you shine a light through it, the photo is projected onto the wall. Mind-blowing and incredibly sentimental.</p>
            </li>
            <li className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <h3 className="font-bold text-xl mb-2">9. Custom Soundwave Art Block</h3>
              <p className="text-gray-600 mb-4">Record yourself saying "I love you" (or "You're adopted") and have the soundwave engraved onto a sleek acrylic block.</p>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-[#800020] p-10 rounded-2xl text-white text-center mt-12">
          <Gift size={48} className="mx-auto mb-6 text-[#E5B8B7]" strokeWidth={1.5} />
          <h2 className="font-serif text-3xl mb-4">Need it before Raksha Bandhan?</h2>
          <p className="mb-8 font-medium text-white/80">Order today and select Premium Delivery at checkout to guarantee arrival before August 28th.</p>
          <Link href="/collections/rakhi-gifts" className="inline-block bg-white text-[#800020] px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#E5B8B7] transition-colors shadow-lg">
            Explore All Rakhi Gifts
          </Link>
        </div>

      </div>
    </div>
  );
}
