import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Gift, ShieldCheck, Truck, Award, Star, ArrowRight, Heart, Users, Gem, Watch, Wallet, Box, RefreshCcw, CalendarClock } from "lucide-react";

export const metadata: Metadata = {
  title: "Personalized Gifts for Every Relationship in India | Octopus",
  description: "Shop personalized gifts, custom jewelry, couple gifts, birthday gifts, anniversary gifts and Raksha Bandhan gifts with fast delivery across India.",
};

export default async function Home() {
  let products = [];
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      products = JSON.parse(fileContent);
    }
  } catch (e) {
    console.error("Error loading products:", e);
  }

  // Use only first 8 products for featured section
  const featuredProducts = products.slice(0, 8);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Octopus",
    "url": "https://www.octopusperfume.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.octopusperfume.in/collections/all?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does delivery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery typically takes 2-5 days across India."
        }
      },
      {
        "@type": "Question",
        "name": "Is gift wrapping available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer premium gift wrapping to make your present extra special."
        }
      },
      {
        "@type": "Question",
        "name": "Can I personalize products?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can customize our jewelry and gifts with names, initials, dates, or special messages."
        }
      },
      {
        "@type": "Question",
        "name": "Do you deliver across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide fast and reliable delivery to all pin codes across India."
        }
      },
      {
        "@type": "Question",
        "name": "Are your jewelry products anti tarnish?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our personalized jewelry pieces are made from high-quality materials including gold-plated and stainless steel that are anti-tarnish and waterproof."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* Hero Section Container */}
      <section className="bg-white px-4 md:px-8 pt-4 pb-24">
        <div className="relative w-full h-auto min-h-[600px] md:h-[650px] bg-[#f9f2ed] rounded-[40px] overflow-visible flex items-center shadow-sm">
          
          {/* Background Image Area */}
          <div className="absolute inset-0 w-full h-full rounded-[40px] overflow-hidden z-0">
             <Image 
                src="/images/products/DSC07516copy.jpg" 
                alt="Personalized Gifts" 
                fill 
                className="object-cover object-right md:object-[60%_center] opacity-40 md:opacity-100"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#f9f2ed] via-[#f9f2ed]/90 to-transparent md:w-2/3"></div>
          </div>

          {/* "Make it Truly Yours" Badge */}
          <div className="hidden md:flex absolute top-24 right-24 z-20 w-36 h-36 bg-white/80 backdrop-blur-md rounded-full items-center justify-center border border-[#800020]/10 shadow-xl rotate-12 hover:rotate-0 transition-transform duration-500 flex-col gap-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d2d2d]">Make It</span>
             <span className="font-serif text-xl italic text-[#800020]">Truly Yours</span>
             <Heart size={14} className="text-[#800020] mt-1" strokeWidth={2} />
          </div>

          {/* Left Content Area */}
          <div className="relative z-10 pl-8 md:pl-16 lg:pl-24 max-w-2xl py-12">
            
            <div className="inline-block bg-[#800020] text-white text-[10px] md:text-xs px-5 py-2 rounded-full uppercase font-bold tracking-[0.15em] mb-6 shadow-sm">
              Octopus Gifting
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#800020] leading-[1.1] mb-2 tracking-tight drop-shadow-sm">
              Personalized Gifts <br />
              <span className="italic font-light text-[#9e7662]">for every relationship in India</span>
            </h1>

            <p className="text-gray-700 mt-6 max-w-md text-sm md:text-base leading-relaxed font-medium">
              Discover personalized name necklaces, engraved bracelets, couple gifts and custom keepsakes for birthdays, anniversaries, Raksha Bandhan and every special occasion.
            </p>

            {/* Feature Icons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-lg">
              <div className="flex items-center gap-2">
                 <Gift size={20} className="text-[#800020]" strokeWidth={1.5} />
                 <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-gray-800">Personalized<br/>Just For You</span>
              </div>
              <div className="flex items-center gap-2">
                 <Award size={20} className="text-[#800020]" strokeWidth={1.5} />
                 <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-gray-800">Premium<br/>Quality</span>
              </div>
              <div className="flex items-center gap-2">
                 <Truck size={20} className="text-[#800020]" strokeWidth={1.5} />
                 <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-gray-800">Fast & Reliable<br/>Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                 <ShieldCheck size={20} className="text-[#800020]" strokeWidth={1.5} />
                 <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-gray-800">Secure<br/>Payments</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link 
                href="/collections/gifts-for-her" 
                className="flex items-center justify-center gap-3 bg-[#800020] text-white px-8 py-4 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#600018] transition-colors shadow-lg"
              >
                Shop Gifts For Her <ArrowRight size={16} />
              </Link>
              <Link 
                href="/collections/gifts-for-him" 
                className="flex items-center justify-center gap-3 bg-white text-[#800020] border border-[#800020] px-8 py-4 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#800020] hover:text-white transition-colors shadow-sm"
              >
                Shop Gifts For Him <ArrowRight size={16} />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 mt-10 bg-white/60 backdrop-blur-sm p-3 pr-6 rounded-full inline-flex border border-white/40 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden relative">
                   <Image src="/images/products/DSC07516copy.jpg" alt="Customer" fill className="object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white overflow-hidden relative">
                   <Image src="/images/products/gold2_67d409be-fa53-4c55-9bc1-e33b18f28e0f.jpg" alt="Customer" fill className="object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white overflow-hidden relative">
                   <Image src="/images/products/Necklace3_3Variants_gold1.png" alt="Customer" fill className="object-cover" />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-800 font-medium">Loved by 50,000+ customers</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] font-bold text-gray-800">4.8</span>
                  <div className="flex text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                  <span className="text-[10px] text-gray-500 ml-1">(12,500+ Reviews)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Floating Categories Bar */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 py-6 px-4 hidden lg:block border border-gray-50">
            <div className="flex items-center justify-between divide-x divide-gray-100">
              {[
                { icon: <Gift size={28} className="text-[#800020]" strokeWidth={1} />, title: "Birthday Gifts", href: "/collections/birthday-gift-for-girlfriend" },
                { icon: <Heart size={28} className="text-[#800020]" strokeWidth={1} />, title: "Anniversary Gifts", href: "/collections/anniversary-gifts-for-wife" },
                { icon: <CalendarClock size={28} className="text-[#800020]" strokeWidth={1} />, title: "Raksha Bandhan", href: "/collections/rakhi-gifts", badge: "NEW" },
                { icon: <Users size={28} className="text-[#800020]" strokeWidth={1} />, title: "Couple Gifts", href: "/collections/couple-gifts" },
                { icon: <Gem size={28} className="text-[#800020]" strokeWidth={1} />, title: "Personalized Jewelry", href: "/collections/personalized-gifts" },
                { icon: <Wallet size={28} className="text-[#800020]" strokeWidth={1} />, title: "Gifts Under ₹999", href: "/collections/gifts-under-999" }
              ].map((cat, idx) => (
                <Link key={idx} href={cat.href} className="flex flex-col items-center flex-1 group px-2 relative">
                  {cat.badge && (
                    <span className="absolute -top-4 right-1/4 bg-[#ffeaea] text-[#800020] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase">
                      {cat.badge}
                    </span>
                  )}
                  <div className="mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800 text-center mb-1">{cat.title}</span>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#800020] transition-colors">Shop Now ›</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Trust Bar */}
        <div className="mx-auto max-w-6xl mt-24 mb-8 bg-[#fdfaf8] rounded-xl py-6 px-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 border border-orange-900/5">
          {[
            { icon: <Truck size={24} className="text-[#2d2d2d]" strokeWidth={1} />, title: "FREE SHIPPING", sub: "On all prepaid orders" },
            { icon: <CalendarClock size={24} className="text-[#2d2d2d]" strokeWidth={1} />, title: "DELIVERED WITH LOVE", sub: "2-5 days across India" },
            { icon: <Gift size={24} className="text-[#2d2d2d]" strokeWidth={1} />, title: "PREMIUM GIFT WRAP", sub: "Make it extra special" },
            { icon: <RefreshCcw size={24} className="text-[#2d2d2d]" strokeWidth={1} />, title: "EASY RETURNS", sub: "Hassle-free returns" }
          ].map((trust, idx) => (
            <div key={idx} className="flex items-center gap-4 min-w-[200px]">
               {trust.icon}
               <div>
                 <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900">{trust.title}</p>
                 <p className="text-[11px] text-gray-500 mt-0.5">{trust.sub}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hidden SEO Text Block (Improves NLP intent mapping) */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-16 text-center text-[#2d2d2d]">
        <h2 className="font-serif text-2xl text-[#800020] mb-4">Personalized Gifts for Every Occasion in India</h2>
        <div className="text-sm md:text-base leading-relaxed opacity-80 text-justify">
          At Octopus, we believe every relationship deserves to be celebrated with meaning. Whether you are searching for thoughtful <strong className="font-medium text-[#800020]">birthday gifts</strong>, romantic <strong className="font-medium text-[#800020]">anniversary gifts</strong>, or festive <strong className="font-medium text-[#800020]">Rakhi gifts</strong>, our collection of <strong className="font-medium text-[#800020]">personalized jewelry</strong> is crafted to turn memories into tangible keepsakes. From delicate 925 silver name necklaces for your girlfriend to engraved stainless steel couple gifts for your husband, we curate the perfect personalized gifts across India. Shop our highly affordable gifts under ₹999 or discover our premium custom keepsakes—all backed by our promise of fast delivery and premium anti-tarnish quality.
        </div>
      </section>

      {/* New Arrivals / Best Sellers Preview */}
      <section className="bg-white mx-auto max-w-[1440px] px-6 md:px-12 py-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="font-serif text-3xl md:text-4xl text-[#800020] mb-3">
              Best Sellers
            </h2>
            <p className="text-[#2d2d2d] text-sm tracking-widest uppercase opacity-80 font-bold">
              The most loved personalized gifts
            </p>
          </div>
          <Link href="/collections/all" className="text-[#800020] text-xs uppercase tracking-widest font-bold border-b border-[#800020] hover:text-[#E5B8B7] hover:border-[#E5B8B7] transition-colors pb-1">
            View All Gifts
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.map((product: any) => (
              <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col h-full bg-white border border-[#E5B8B7]/40 hover:border-[#E5B8B7] transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden rounded-md">
                <div className="relative aspect-[4/5] bg-[#FDF8F5] overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image 
                      src={product.images[0].local_src || product.images[0].src} 
                      alt={product.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#E5B8B7]">No Image</div>
                  )}
                  
                  <div className="absolute inset-0 bg-[#800020]/0 group-hover:bg-[#800020]/5 transition-colors duration-300 flex items-end justify-center p-6">
                    <span className="bg-white/90 backdrop-blur-sm text-[#800020] px-8 py-3 text-xs uppercase tracking-widest font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg rounded-sm">
                      View Gift
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1 text-center bg-white">
                  <h3 className="font-serif text-lg text-[#2d2d2d] group-hover:text-[#800020] transition-colors leading-tight mb-3 font-bold">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-[#800020] mt-auto tracking-wide">
                    ₹{product.variants && product.variants.length > 0 ? product.variants[0].price : "0"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#E5B8B7]">
            <p>Products are currently syncing. Please refresh in a moment.</p>
          </div>
        )}
      </section>
    </>
  );
}
