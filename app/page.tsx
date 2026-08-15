import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Gift, ShieldCheck, Truck, Award, Star, ArrowRight, Heart, Users, Gem, Wallet, RefreshCcw, CalendarClock, ChevronRight, Package, MessageSquare, Plus, Minus, Search, Edit3, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Personalized Rakhi Gifts for Sister & Brother | Gifts Under ₹499 | Octopus Everlasting Gifts",
  description: "Surprise your sister or brother with personalized Raksha Bandhan gifts, custom jewelry and gift boxes under ₹499 with fast delivery worldwide.",
  keywords: ["rakhi gifts", "raksha bandhan gifts", "everlasting gifts", "custom jewelry", "gifts for sister", "gifts for brother", "gifts under 499", "octopus gifts"],
  alternates: {
    canonical: "https://www.octopusperfume.in",
  },
  openGraph: {
    title: "Personalized Rakhi Gifts for Sister & Brother | Octopus Everlasting Gifts",
    description: "Surprise your sister or brother with personalized Raksha Bandhan gifts, custom jewelry and gift boxes under ₹499 with fast delivery worldwide.",
    url: "https://www.octopusperfume.in",
    siteName: "Octopus Everlasting Gifts",
    images: [
      {
        url: "/images/products/name-necklace-rakhi-gift-11.jpg",
        width: 1200,
        height: 630,
        alt: "Personalized Rakhi Gifts",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalized Rakhi Gifts | Octopus Everlasting Gifts",
    description: "Surprise your sister or brother with personalized Raksha Bandhan gifts under ₹499.",
    images: ["/images/products/name-necklace-rakhi-gift-11.jpg"],
  },
};

export default async function Home() {
  let products = [];
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      products = JSON.parse(fileContent);
      
      // Default Sort: Price Low to High
      products.sort((a: any, b: any) => {
        const priceA = a.variants && a.variants.length > 0 ? parseFloat(a.variants[0].price) : 0;
        const priceB = b.variants && b.variants.length > 0 ? parseFloat(b.variants[0].price) : 0;
        return priceA - priceB;
      });
    }
  } catch (e) {
    console.error("Error loading products:", e);
  }

  // Use only first 8 products for featured sections
  const featuredProducts = products.slice(0, 8);
  const trendingProducts = products.slice(8, 12);

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
          "text": "Yes, we provide fast and reliable delivery to all pin codes across India, as well as International delivery worldwide within 7 days."
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
      
      {/* 1. Hero Section */}
      <section className="bg-white px-3 md:px-8 pt-4 pb-16 md:pb-24">
        <div className="relative w-full h-auto min-h-[85vh] md:min-h-[650px] bg-[#f9f2ed] rounded-[24px] md:rounded-[40px] overflow-visible flex items-center justify-center md:justify-start shadow-sm">
          <div className="absolute inset-0 w-full h-full rounded-[24px] md:rounded-[40px] overflow-hidden z-0">
             <Image 
                src="/images/products/name-necklace-rakhi-gift-11.jpg" 
                alt="Everlasting Gifts" 
                fill 
                className="object-cover object-right md:object-[60%_center]"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#f9f2ed] via-[#f9f2ed]/80 to-transparent md:w-2/3"></div>
          </div>
          <div className="hidden md:flex absolute top-24 right-24 z-20 w-36 h-36 bg-white/80 backdrop-blur-md rounded-full items-center justify-center border border-[#800020]/10 shadow-xl rotate-12 hover:rotate-0 transition-transform duration-500 flex-col gap-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d2d2d]">Make It</span>
             <span className="font-serif text-xl italic text-[#800020]">Truly Yours</span>
             <Heart size={14} className="text-[#800020] mt-1" strokeWidth={2} />
          </div>
          <div className="relative z-10 px-6 md:px-0 md:pl-16 lg:pl-24 max-w-2xl py-12 flex flex-col items-center text-center md:items-start md:text-left w-full mt-20 md:mt-0">
            <div className="inline-block bg-[#800020] text-white text-[10px] md:text-xs px-5 py-2 rounded-full uppercase font-bold tracking-[0.15em] mb-6 shadow-sm">
              Raksha Bandhan Collection 2026
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-[#800020] leading-[1.1] tracking-wide drop-shadow-sm">
              <span className="block mb-2">Everlasting Gifts</span>
              <span className="italic font-light text-[#9e7662]">That Lasts Forever</span>
            </h1>
            <p className="text-[#b8860b] mt-4 font-bold tracking-widest uppercase text-xs md:text-sm flex items-center gap-2">
              <Gem size={16} /> Premium 22K Gold Plated
            </p>
            <p className="text-gray-700 mt-6 max-w-md text-sm md:text-base leading-relaxed font-medium">
              Because they're more than family—they're your first best friend. Surprise your sibling with a personalized keepsake they'll cherish for a lifetime.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8 w-full">
              <div className="flex items-start gap-2 justify-center lg:justify-start">
                 <Gift size={20} className="text-[#800020] shrink-0 mt-0.5" strokeWidth={1.5} />
                 <span className="text-[10px] md:text-[11px] font-bold uppercase leading-tight tracking-wider text-gray-800">Personalized<br/>Just For You</span>
              </div>
              <div className="flex items-start gap-2 justify-center lg:justify-start">
                 <Gem size={20} className="text-[#800020] shrink-0 mt-0.5" strokeWidth={1.5} />
                 <span className="text-[10px] md:text-[11px] font-bold uppercase leading-tight tracking-wider text-gray-800">22K Gold<br/>Plated</span>
              </div>
              <div className="flex items-start gap-2 justify-center lg:justify-start">
                 <Truck size={20} className="text-[#800020] shrink-0 mt-0.5" strokeWidth={1.5} />
                 <span className="text-[10px] md:text-[11px] font-bold uppercase leading-tight tracking-wider text-gray-800">Delivered Safely<br/>With Love</span>
              </div>
              <div className="flex items-start gap-2 justify-center lg:justify-start">
                 <ShieldCheck size={20} className="text-[#800020] shrink-0 mt-0.5" strokeWidth={1.5} />
                 <span className="text-[10px] md:text-[11px] font-bold uppercase leading-tight tracking-wider text-gray-800">Anti-Tarnish<br/>Waterproof</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link href="/collections/rakhi-gifts" className="flex items-center justify-center gap-3 bg-[#800020] text-white px-8 py-4 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#600018] transition-colors shadow-lg">
                Find Their Perfect Gift <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[#800020] font-bold text-sm bg-[#ffeaea] w-fit px-4 py-2 rounded-full border border-[#E5B8B7]">
              <CalendarClock size={16} /> Order in the next 48 hours for delivery before Rakhi.
            </div>
            <div className="flex items-center gap-4 mt-10 bg-white/60 backdrop-blur-sm p-3 pr-6 rounded-full inline-flex border border-white/40 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden relative">
                   <Image src="/images/products/name-necklace-rakhi-gift-1.webp" alt="Customer" fill className="object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white overflow-hidden relative">
                   <Image src="/images/products/18k-cuff-bracelet-rakhi-gift-1.png" alt="Customer" fill className="object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white overflow-hidden relative">
                   <Image src="/images/products/customized-bar-necklace-rakhi-gift-1.jpg" alt="Customer" fill className="object-cover" />
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
        </div>
      </section>

      {/* 2. Shop by Occasion */}
      <section className="bg-stone-50 py-20 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-[#800020] mb-4">Shop By Occasion</h2>
            <p className="text-gray-600 text-sm md:text-base uppercase tracking-widest font-bold">Find the perfect gift for every moment</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Birthdays", desc: "Make Their Day Magical", img: "/images/products/customized-bar-necklace-rakhi-gift-1.jpg", link: "/collections/birthday-gifts" },
              { title: "Anniversaries", desc: "Celebrate Forever", img: "/images/products/eternal-heart-necklace-1-rakhi-gift-4.jpg", link: "/collections/anniversary-gifts" },
              { title: "Raksha Bandhan", desc: "Honor Your Bond", img: "/images/products/customized-butterfly-name-ring-rakhi-gift-1.jpg", link: "/collections/rakhi-gifts" },
              { title: "Weddings", desc: "A Gift For The Couple", img: "/images/products/18k-cuff-bracelet-rakhi-gift-11.jpg", link: "/collections/wedding-gifts" }
            ].map((occ, idx) => (
              <Link href={occ.link} key={idx} className="group block relative aspect-square overflow-hidden rounded-lg shadow-sm">
                <Image src={occ.img} alt={occ.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-white font-serif text-xl md:text-3xl font-bold tracking-wide drop-shadow-md mb-2">{occ.title}</h3>
                  <p className="text-white/90 text-xs md:text-sm font-bold uppercase tracking-widest drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">{occ.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Relationship */}
      <section className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-[#800020] mb-4">Shop By Recipient</h2>
            <p className="text-gray-600 text-sm md:text-base uppercase tracking-widest font-bold">Curated Rakhi selections for your siblings</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Sister", desc: "Make her smile with a gift just for her.", icon: <Heart className="text-[#800020]" size={40} />, link: "/collections/rakhi-gifts-for-sister" },
              { title: "Brother", desc: "Show him how much he means to you.", icon: <Users className="text-[#800020]" size={40} />, link: "/collections/rakhi-gifts-for-brother" },
              { title: "Younger Sister", desc: "A cute keepsake she'll never take off.", icon: <Gift className="text-[#800020]" size={40} />, link: "/collections/rakhi-gifts-for-sister" },
              { title: "Elder Brother", desc: "Sophisticated gifts for your protector.", icon: <Gem className="text-[#800020]" size={40} />, link: "/collections/rakhi-gifts-for-brother" }
            ].map((rel, idx) => (
              <Link href={rel.link} key={idx} className="group flex flex-col items-center text-center p-8 border border-stone-200 rounded-xl hover:border-[#800020] hover:shadow-xl transition-all duration-300 bg-stone-50 hover:bg-white">
                <div className="w-20 h-20 rounded-full bg-white border border-[#E5B8B7] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  {rel.icon}
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-2">{rel.title}</h3>
                <p className="text-stone-500 text-sm mb-6">{rel.desc}</p>
                <span className="text-[#800020] text-xs uppercase tracking-widest font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Shop Now <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers */}
      <section className="bg-stone-50 mx-auto w-full px-6 md:px-12 py-20 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div className="text-left">
              <h2 className="font-serif text-3xl md:text-4xl text-[#800020] mb-3">Best Rakhi Picks</h2>
              <p className="text-[#2d2d2d] text-sm tracking-widest uppercase opacity-80 font-bold">The most loved everlasting gifts for siblings</p>
            </div>
            <Link href="/collections/rakhi-gifts" className="text-[#800020] text-xs uppercase tracking-widest font-bold border-b border-[#800020] hover:text-[#E5B8B7] hover:border-[#E5B8B7] transition-colors pb-1">
              View All Rakhi Gifts
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-12">
              {featuredProducts.map((product: any) => (
                <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col h-full bg-white border border-[#E5B8B7]/40 hover:border-[#E5B8B7] transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden rounded-lg md:rounded-md">
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
                        Customize Now
                      </span>
                    </div>
                  </div>
                  <div className="p-3 md:p-6 flex flex-col flex-1 text-center bg-white">
                    <h3 className="font-serif text-sm md:text-lg text-[#2d2d2d] group-hover:text-[#800020] transition-colors leading-tight mb-1 md:mb-2 font-bold line-clamp-2 md:line-clamp-none h-10 md:h-auto">
                      {product.title}
                    </h3>
                    {(product.title || "").toLowerCase().includes("name necklace") && (
                      <p className="text-[8px] uppercase tracking-widest text-[#b8860b] font-bold mb-2 md:mb-3">22k Gold Plated • Anti Tarnish</p>
                    )}
                    <p className="text-sm font-bold text-[#800020] tracking-wide mb-3 md:mt-auto">
                      ₹{product.variants && product.variants.length > 0 ? product.variants[0].price : "0"}
                    </p>

                    <button className="w-full bg-[#FDF8F5] text-[#800020] border border-[#E5B8B7] py-2 md:py-3 text-[9px] md:text-[10px] uppercase tracking-widest font-bold group-hover:bg-[#800020] group-hover:text-white transition-all duration-300 rounded-sm mt-auto shadow-sm group-hover:shadow-md">
                      Customize
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#E5B8B7]">Products are currently syncing.</div>
          )}
        </div>
      </section>

      {/* 5. Personalization Process */}
      <section className="bg-[#800020] py-24 px-6 md:px-12 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <h2 className="font-serif text-3xl md:text-5xl mb-6">How It Works</h2>
          <p className="text-sm uppercase tracking-widest font-bold text-white/80 mb-20">Creating your custom piece is simple</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-white/20 -translate-y-1/2 z-0"></div>
            {[
              { icon: <Search size={40} className="text-[#800020]" />, step: "01", title: "Select Your Gift", desc: "Choose from our wide range of premium jewelry, wallets, and keepsakes." },
              { icon: <Edit3 size={40} className="text-[#800020]" />, step: "02", title: "Add Personal Touch", desc: "Provide names, dates, or photos to be expertly engraved or printed." },
              { icon: <Truck size={40} className="text-[#800020]" />, step: "03", title: "Fast Delivery", desc: "We craft it with love and deliver it securely to your doorstep." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-8">
                  {step.icon}
                </div>
                <span className="text-white/50 font-serif text-6xl absolute -top-8 -left-4 z-[-1] font-bold opacity-30">{step.step}</span>
                <h3 className="font-serif text-2xl mb-4 font-bold">{step.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trust Bar */}
      <section className="bg-white py-12 px-6 border-b border-stone-200">
        <div className="mx-auto max-w-[1440px] flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 md:gap-4">
          {[
            { icon: <Truck size={32} className="text-[#800020]" strokeWidth={1.5} />, title: "FREE SHIPPING", sub: "On all prepaid orders" },
            { icon: <CalendarClock size={32} className="text-[#800020]" strokeWidth={1.5} />, title: "DELIVERED WITH LOVE", sub: "Fast Delivery in 2-5 days" },
            { icon: <Package size={32} className="text-[#800020]" strokeWidth={1.5} />, title: "PREMIUM GIFT WRAP", sub: "Make it extra special" },
            { icon: <RefreshCcw size={32} className="text-[#800020]" strokeWidth={1.5} />, title: "SECURE PAYMENTS", sub: "100% safe transactions" }
          ].map((trust, idx) => (
            <div key={idx} className="flex items-center gap-4 flex-1 min-w-[240px] justify-center md:justify-start lg:justify-center p-4">
               {trust.icon}
               <div>
                 <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900">{trust.title}</p>
                 <p className="text-xs text-gray-500 mt-1">{trust.sub}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Gifts under Budget */}
      <section className="bg-stone-50 py-20 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-[#800020] mb-4">Shop By Budget</h2>
          <p className="text-gray-600 text-sm uppercase tracking-widest font-bold mb-12">Premium gifting for every pocket</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Under ₹299", link: "/collections/rakhi-gifts-under-299" },
              { label: "Under ₹499", link: "/collections/rakhi-gifts-under-499" },
              { label: "Under ₹999", link: "/collections/rakhi-gifts-under-999" },
              { label: "Luxury Gifts", link: "/collections/premium" }
            ].map((budget, idx) => (
              <Link key={idx} href={budget.link} className="bg-white border-2 border-[#E5B8B7] text-[#800020] px-8 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#800020] hover:text-white transition-colors min-w-[200px] shadow-sm">
                {budget.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trending Now */}
      {trendingProducts.length > 0 && (
        <section className="bg-white py-24 px-6 md:px-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-stone-200 pb-8">
              <div>
                <h2 className="font-serif text-3xl md:text-5xl text-stone-900 mb-4">Trending Now</h2>
                <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">What everyone is buying right now</p>
              </div>
              <Link href="/collections/trending" className="flex items-center gap-2 text-[#800020] font-bold uppercase tracking-widest text-xs group">
                Shop Trending <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {trendingProducts.slice(0, 2).map((product: any) => (
                <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col md:flex-row bg-stone-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-stone-100">
                  <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                    <Image src={product.images?.[0]?.src || "/logo.png"} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center w-full md:w-1/2 bg-white">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#800020] font-bold mb-4">Hot Demand</span>
                    <h3 className="font-serif text-2xl text-stone-900 mb-4 leading-tight">{product.title}</h3>
                    <p className="text-[#800020] font-bold text-xl mb-8">₹{product.variants?.[0]?.price || "0"}</p>
                    <span className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#800020] transition-colors mt-auto w-fit">
                      Customize <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Customer Stories */}
      <section className="bg-[#f9f2ed] py-24 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-[#800020] mb-4">Real Love Stories</h2>
            <p className="text-stone-600 text-sm uppercase tracking-widest font-bold">Hear from our happy customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya S.", product: "Custom Name Necklace", text: "I ordered this for my sister and she cried tears of joy when she saw it. It's more than a necklace, it's a piece of my heart she can wear forever." },
              { name: "Rahul K.", product: "Engraved Wallet", text: "Got an engraved wallet for my dad. Seeing his reaction when he read the personal message was priceless. Highly recommend for special moments." },
              { name: "Anjali M.", product: "Couple Bracelets", text: "We never take them off! It constantly reminds us of our bond no matter the distance. They haven't lost their shine at all." }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#E5B8B7]/30 flex flex-col items-center text-center">
                <div className="flex text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-stone-700 italic leading-relaxed mb-8 font-serif">&quot;{review.text}&quot;</p>
                <div className="mt-auto border-t border-stone-100 pt-6 w-full">
                  <p className="font-bold text-stone-900 uppercase tracking-widest text-xs mb-1">{review.name}</p>
                  <p className="text-stone-500 text-[10px] uppercase tracking-widest">{review.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Gift Finder CTA */}
      <section className="bg-stone-900 py-24 px-6 md:px-12 text-center text-white">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <Gift size={64} className="text-[#E5B8B7] mb-8" strokeWidth={1} />
          <h2 className="font-serif text-4xl md:text-6xl mb-6">Can't Decide?</h2>
          <p className="text-stone-400 text-lg mb-10 font-serif italic">Let us help you find a gift that perfectly captures your feelings, in under 60 seconds.</p>
          <Link href="/collections/all" className="bg-[#800020] text-white px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-stone-900 transition-colors shadow-xl inline-flex items-center gap-3">
            Find Their Gift Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 11. Premium Gift Wrapping */}
      <section className="bg-white py-24 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/images/products/Mirage_Hero_Octopus.webp" alt="Premium Gift Wrapping" fill className="object-cover" />
          </div>
          <div className="max-w-lg">
            <span className="text-[#800020] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">The Perfect Presentation</span>
            <h2 className="font-serif text-3xl md:text-5xl text-stone-900 mb-6 leading-tight">Unboxing <br/>Happiness</h2>
            <p className="text-stone-600 leading-relaxed mb-8 font-medium">First impressions matter. Every personalized gift from Octopus comes beautifully nestled in our signature premium box, complete with a heartfelt custom message card. Make them feel truly special before they even see the gift.</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm font-bold text-stone-700 uppercase tracking-widest"><CheckCircle2 className="text-[#800020]" size={20} /> Signature Luxury Box</li>
              <li className="flex items-center gap-3 text-sm font-bold text-stone-700 uppercase tracking-widest"><CheckCircle2 className="text-[#800020]" size={20} /> Custom Message Card</li>
              <li className="flex items-center gap-3 text-sm font-bold text-stone-700 uppercase tracking-widest"><CheckCircle2 className="text-[#800020]" size={20} /> Ribbon Bow Tie</li>
            </ul>
            <Link href="/collections/all" className="inline-block border-b-2 border-[#800020] text-[#800020] font-bold uppercase tracking-widest text-xs pb-1 hover:text-stone-900 hover:border-stone-900 transition-colors">
              Discover Our Gifts
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Social Proof Wall */}
      <section className="bg-stone-50 py-24 border-t border-stone-200">
        <div className="text-center mb-12 px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Join The Octopus Family</h2>
          <p className="text-stone-500 text-xs uppercase tracking-[0.2em] font-bold">Tag @OctopusPerfume to be featured</p>
        </div>
        <div className="flex overflow-hidden">
          <div className="flex w-full min-w-max animate-[scroll_40s_linear_infinite] gap-4 px-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative w-64 h-64 bg-stone-200 shrink-0 rounded-xl overflow-hidden group cursor-pointer">
                <Image src={featuredProducts[i % featuredProducts.length]?.images?.[0]?.src || "/logo.png"} alt="Social" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Heart className="text-white fill-white" size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQ Section */}
      <section className="bg-white py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-stone-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Everything you need to know</p>
        </div>
        <div className="space-y-6">
          {faqSchema.mainEntity.map((faq, idx) => (
            <details key={idx} className="group border-b border-stone-200 pb-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-lg font-serif font-bold text-stone-900">
                {faq.name}
                <span className="relative flex-shrink-0 ml-1.5 w-5 h-5">
                  <Plus className="absolute inset-0 w-5 h-5 opacity-100 group-open:opacity-0 transition-opacity" />
                  <Minus className="absolute inset-0 w-5 h-5 opacity-0 group-open:opacity-100 transition-opacity" />
                </span>
              </summary>
              <p className="mt-4 text-stone-600 leading-relaxed pl-2 border-l-2 border-[#800020]">{faq.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/pages/contact" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#800020] hover:text-stone-900 transition-colors">
            <MessageSquare size={16} /> Have more questions? Contact Us
          </Link>
        </div>
      </section>

      {/* 14. SEO Content Block */}
      <section className="bg-stone-900 px-6 md:px-12 py-20 text-center text-white/80">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl text-white mb-6">India's Premier Personalized Gifting Destination</h2>
          <div className="text-sm md:text-base leading-relaxed text-justify md:text-center space-y-4 font-serif">
            <p>
              At Octopus, we believe every relationship deserves to be celebrated with meaning. Whether you are searching for thoughtful <strong className="text-white">birthday gifts</strong>, romantic <strong className="text-white">anniversary gifts</strong>, or festive <strong className="text-white">Rakhi gifts</strong>, our collection of <strong className="text-white">personalized jewelry</strong> is crafted to turn memories into tangible keepsakes.
            </p>
            <p>
              From delicate 925 silver name necklaces for your girlfriend to engraved stainless steel couple gifts for your husband, we curate the perfect everlasting gifts worldwide. Shop our highly affordable gifts under ₹999 or discover our premium custom keepsakes—all backed by our promise of fast international delivery and premium anti-tarnish quality. Experience the joy of gifting with Octopus today.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
