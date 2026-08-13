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
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-stone-100">
        <div className="absolute inset-0 z-0 bg-stone-200">
          <Image 
            src="/images/products/DSC07516copy.jpg" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-40 blur-sm mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl text-stone-900 mb-6 tracking-widest uppercase">
            Timeless Elegance
          </h1>
          <p className="text-stone-700 max-w-lg mx-auto mb-10 text-lg">
            Discover our collection of personalized jewelry crafted to capture your most cherished moments.
          </p>
          <Link 
            href="/collections/all"
            className="inline-block bg-stone-900 text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      <section className="bg-white mx-auto max-w-[1440px] px-6 md:px-12 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 uppercase tracking-widest">
            Featured Pieces
          </h2>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden mb-4">
                  {product.images && product.images.length > 0 ? (
                    <Image 
                      src={product.images[0].local_src || product.images[0].src} 
                      alt={product.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                  )}
                </div>
                <h3 className="font-serif text-lg text-stone-900 group-hover:text-stone-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  ₹{product.variants && product.variants.length > 0 ? product.variants[0].price : "0"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-500">
            <p>Products are currently syncing. Please refresh in a moment.</p>
          </div>
        )}
      </section>

      <section className="bg-stone-100 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-serif text-2xl md:text-4xl leading-relaxed text-stone-800">
            "Jewelry is like the perfect spice – it always complements what’s already there."
          </p>
          <div className="mt-8 text-sm uppercase tracking-widest font-bold text-stone-500">
            — Everlasting Promise
          </div>
        </div>
      </section>
    </>
  );
}
