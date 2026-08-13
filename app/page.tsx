import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Everlasting Shop | Personalized Jewelry",
  description: "Shop personalized jewelry, custom necklaces, rings, and more at Everlasting Shop.",
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
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-[#FDF8F5]">
        <div className="absolute inset-0 z-0 bg-[#E5B8B7]/30">
          <Image 
            src="/images/products/DSC07516copy.jpg" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-60 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#800020] font-bold bg-white/50 backdrop-blur-md px-6 py-2 mb-8 inline-block shadow-sm">
            Curated with Love
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-[#800020] leading-tight drop-shadow-sm">
            Gifts That Speak <br />
            <span className="italic text-[#E5B8B7] drop-shadow-md brightness-75">from the heart</span>
          </h1>
          <p className="text-sm md:text-base text-[#2d2d2d] mb-12 uppercase tracking-widest max-w-lg mx-auto font-medium">
            Discover personalised jewellery and timeless pieces crafted for unforgettable moments.
          </p>
          <Link 
            href="/collections/all" 
            className="bg-[#800020] text-white px-10 py-5 text-xs tracking-widest uppercase hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors duration-300 shadow-xl"
          >
            Find the Perfect Gift
          </Link>
        </div>
      </section>

      {/* The Perfect Gift Categories */}
      <section className="bg-[#FDF8F5] py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#800020] mb-4">
            Shop by Category
          </h2>
          <p className="text-[#2d2d2d] text-sm tracking-widest uppercase mb-16 opacity-80">
            Find exactly what they'll love
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { name: "Personalised", slug: "personalised-jewellery", img: "/images/products/DSC07516copy.jpg" },
              { name: "For Her", slug: "gifts-for-her", img: "/images/products/Necklace2_3Variants_gold1.png" },
              { name: "For Him", slug: "gifts-for-him", img: "/images/products/gold2_67d409be-fa53-4c55-9bc1-e33b18f28e0f.jpg" },
              { name: "Occasions", slug: "all", img: "/images/products/Necklace3_3Variants_gold1.png" }
            ].map((cat) => (
              <Link href={`/collections/${cat.slug}`} key={cat.slug} className="group flex flex-col items-center">
                <div className="w-full aspect-[4/5] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 mb-6 relative border border-[#E5B8B7]/20 rounded-t-full">
                  <Image 
                    src={cat.img} 
                    alt={cat.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  <div className="absolute inset-0 bg-[#800020]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="font-serif text-xl text-[#2d2d2d] group-hover:text-[#800020] transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Preview */}
      <section className="bg-white mx-auto max-w-[1440px] px-6 md:px-12 py-32 border-t border-[#E5B8B7]/30">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="font-serif text-3xl md:text-4xl text-[#800020] mb-3">
              Trending Gifts
            </h2>
            <p className="text-[#2d2d2d] text-sm tracking-widest uppercase opacity-80">
              The most loved pieces this season
            </p>
          </div>
          <Link href="/collections/all" className="text-[#800020] text-xs uppercase tracking-widest font-medium border-b border-[#800020] hover:text-[#E5B8B7] hover:border-[#E5B8B7] transition-colors pb-1">
            View All Gifts
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.map((product: any) => (
              <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col h-full bg-white border border-[#E5B8B7]/20 hover:border-[#E5B8B7] transition-all duration-300 shadow-sm hover:shadow-xl rounded-sm overflow-hidden">
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
                  <div className="absolute inset-0 bg-[#800020]/0 group-hover:bg-[#800020]/10 transition-colors duration-300 flex items-end justify-center p-6">
                    <span className="bg-white/90 backdrop-blur-sm text-[#800020] px-8 py-3 text-xs uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                      View Gift
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1 text-center bg-white">
                  <h3 className="font-serif text-lg text-[#2d2d2d] group-hover:text-[#800020] transition-colors leading-tight mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm font-medium text-[#800020] mt-auto">
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

      <section className="bg-[#E5B8B7]/10 py-32 border-t border-[#E5B8B7]/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-serif text-3xl md:text-5xl leading-relaxed text-[#800020]">
            "A gift is not just an item, it's a memory you can hold forever."
          </p>
          <div className="mt-10 text-xs uppercase tracking-widest font-bold text-[#2d2d2d]">
            — The Everlasting Promise
          </div>
        </div>
      </section>
    </>
  );
}
