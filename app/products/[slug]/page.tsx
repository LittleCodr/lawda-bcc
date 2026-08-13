import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductForm from "./ProductForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const products = JSON.parse(fileContent);
      product = products.find((p: any) => p.handle === slug);
    }
  } catch (e) {}

  if (!product) {
    return { title: "Product Not Found | Everlasting" };
  }

  return {
    title: `${product.title} | Everlasting`,
    description: product.body_html?.replace(/<[^>]+>/g, "").substring(0, 160) || "Buy personalized jewelry at Everlasting.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const products = JSON.parse(fileContent);
      product = products.find((p: any) => p.handle === slug);
    }
  } catch (e) {}

  if (!product) {
    notFound();
  }

  // Use local images if downloaded, otherwise fallback to remote
  const images = product.images?.map((img: any) => ({
    src: img.local_src || img.src,
    alt: product.title
  })) || [];

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4 sticky top-32">
          {images.length > 0 ? (
            <div className="relative aspect-[4/5] bg-stone-50 w-full rounded-md overflow-hidden border border-stone-100">
              <Image 
                src={images[0].src} 
                alt={images[0].alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" 
              />
            </div>
          ) : (
            <div className="aspect-[4/5] bg-stone-50 w-full flex items-center justify-center rounded-md border border-stone-100">
              <span className="text-stone-400">No Image</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1, 5).map((img: any, idx: number) => (
                <div key={idx} className="relative aspect-[4/5] bg-stone-50 rounded-md overflow-hidden border border-stone-100">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Form */}
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-4">{product.title}</h1>
          <p className="text-xl text-stone-600 mb-8 font-medium">
            ₹{product.variants && product.variants.length > 0 ? product.variants[0].price : "0"}
          </p>

          <div 
            className="prose prose-stone prose-sm mb-10 max-w-none text-stone-600"
            dangerouslySetInnerHTML={{ __html: product.body_html || "" }} 
          />

          <ProductForm product={product} />

          {/* Accordions / Features */}
          <div className="mt-16 border-t border-stone-200 pt-8 space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm uppercase tracking-widest font-bold text-stone-900">Shipping</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Free standard shipping on all orders. Personalized items take 3-5 business days to craft before shipping.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm uppercase tracking-widest font-bold text-stone-900">Materials</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Made with high quality stainless steel and plated in 18k gold. Hypoallergenic and tarnish resistant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
