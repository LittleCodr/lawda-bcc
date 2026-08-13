import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (slug === 'all') {
    return { title: "All Products | Everlasting Shop" };
  }

  return { title: "Collection | Everlasting Shop" };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
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

  // TODO: Add logic to filter by collection if slug !== 'all'
  // For now, if 'all', display all products
  const displayProducts = products;

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-12 text-center uppercase tracking-widest">
          {slug === 'all' ? 'All Products' : slug.replace(/-/g, ' ')}
        </h1>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product: any) => (
              <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden mb-4 rounded-md border border-stone-100">
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
      </div>
    </div>
  );
}
