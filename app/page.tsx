import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personalized Gifts for Her & Him in India | Octopus",
  description: "Shop personalized gifts, custom jewelry, name necklaces, and couple gifts. Perfect for birthdays, anniversaries, and weddings.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Octopus",
            "url": "https://www.octopusperfume.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.octopusperfume.in/collections/all?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-[#FDF8F5]">
        <div className="absolute inset-0 z-0 bg-[#E5B8B7]/20">
          <Image 
            src="/images/products/DSC07516copy.jpg" 
            alt="Personalized gifts background" 
            fill 
            className="object-cover opacity-70 mix-blend-multiply"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#800020] font-bold bg-white/60 backdrop-blur-md px-6 py-2 mb-8 inline-block shadow-sm">
            Octopus Gifting
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-[#800020] leading-tight drop-shadow-sm">
            Personalized Gifts <br />
            <span className="italic text-[#E5B8B7] drop-shadow-md brightness-75">for every relationship</span>
          </h1>
          <p className="text-sm md:text-base text-[#2d2d2d] mb-12 uppercase tracking-widest max-w-lg mx-auto font-bold bg-white/40 backdrop-blur-md py-2 px-4 inline-block">
            Name Necklaces, Rings, and Custom Keepsakes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/collections/gifts-for-her" 
              className="bg-[#800020] text-white px-10 py-5 text-xs tracking-widest uppercase font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors duration-300 shadow-xl"
            >
              Gifts for Her
            </Link>
            <Link 
              href="/collections/gifts-for-him" 
              className="bg-white text-[#800020] border border-[#800020] px-10 py-5 text-xs tracking-widest uppercase font-bold hover:bg-[#800020] hover:text-white transition-colors duration-300 shadow-xl"
            >
              Gifts for Him
            </Link>
          </div>
        </div>
      </section>

      {/* The Perfect Gift Categories */}
      <section className="bg-[#FDF8F5] py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#800020] mb-4">
            Shop by Intention
          </h2>
          <p className="text-[#2d2d2d] text-sm tracking-widest uppercase mb-16 opacity-80 font-bold">
            Find exactly what they'll love
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { name: "Gifts for Her", slug: "gifts-for-her", img: "/images/products/Necklace2_3Variants_gold1.png" },
              { name: "Gifts for Him", slug: "gifts-for-him", img: "/images/products/gold2_67d409be-fa53-4c55-9bc1-e33b18f28e0f.jpg" },
              { name: "Under ₹999", slug: "gifts-under-999", img: "/images/products/Necklace3_3Variants_gold1.png" },
              { name: "Anniversary", slug: "anniversary-gifts-for-wife", img: "/images/products/DSC07516copy.jpg" }
            ].map((cat) => (
              <Link href={`/collections/${cat.slug}`} key={cat.slug} className="group flex flex-col items-center">
                <div className="w-full aspect-[4/5] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 mb-6 relative border border-[#E5B8B7]/30 rounded-t-full">
                  <Image 
                    src={cat.img} 
                    alt={cat.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  <div className="absolute inset-0 bg-[#800020]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="font-serif text-xl text-[#2d2d2d] group-hover:text-[#800020] transition-colors font-bold">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Grid */}
      <section className="bg-white py-24 border-t border-[#E5B8B7]/30">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#800020] mb-12">
            Premium Gifts, Any Budget
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Under ₹499", href: "/collections/gifts-under-499" },
              { name: "Under ₹999", href: "/collections/gifts-under-999" },
              { name: "Under ₹1499", href: "/collections/gifts-under-1499" }
            ].map((budget) => (
              <Link 
                key={budget.name} 
                href={budget.href}
                className="group border border-[#E5B8B7] p-12 hover:bg-[#FDF8F5] transition-colors flex flex-col items-center justify-center"
              >
                <span className="font-serif text-3xl text-stone-800 group-hover:text-[#800020] transition-colors">{budget.name}</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 mt-4 font-bold group-hover:text-[#800020]/70">Shop Now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Preview */}
      <section className="bg-[#FDF8F5] mx-auto max-w-[1440px] px-6 md:px-12 py-32 border-t border-[#E5B8B7]/30">
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
              <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col h-full bg-white border border-[#E5B8B7]/40 hover:border-[#E5B8B7] transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
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
                  
                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-[#800020]/0 group-hover:bg-[#800020]/5 transition-colors duration-300 flex items-end justify-center p-6">
                    <span className="bg-white/90 backdrop-blur-sm text-[#800020] px-8 py-3 text-xs uppercase tracking-widest font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-[#E5B8B7]/30">
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

      <section className="bg-white py-32 border-t border-[#E5B8B7]/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-serif text-3xl md:text-5xl leading-relaxed text-[#800020]">
            "A personalized gift is not just an item, it's a memory you can hold forever."
          </p>
          <div className="mt-10 text-xs uppercase tracking-widest font-bold text-[#2d2d2d]">
            — Octopus
          </div>
        </div>
      </section>
    </>
  );
}
