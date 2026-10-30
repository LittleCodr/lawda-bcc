import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Sparkles, ShieldCheck, Truck, ShoppingBag, ArrowLeft } from "lucide-react";
import { getBrandBySlug, getAllBrands, slugifyBrand } from "@/lib/brands";
import SortSelect from "@/components/SortSelect";

export const revalidate = 86400;

let cachedProducts: any[] | null = null;
function getProducts(): any[] {
  if (cachedProducts) return cachedProducts;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      cachedProducts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return cachedProducts || [];
    }
  } catch (e) {
    console.error("Error reading products:", e);
  }
  return [];
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand Not Found | Octopus Perfumes" };
  }

  const title = `Buy ${brand.name} Perfumes Online India | Flat 25% OFF | 100% Authentic | Octopus Perfumes`;
  const description = `${brand.description.substring(0, 155)} Buy 100% original ${brand.name} with free tester & express Pan-India delivery.`;
  const canonicalUrl = `https://www.octopusperfume.in/brands/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Octopus Perfumes India",
      images: [
        {
          url: "https://www.octopusperfume.in/logo.png",
          width: 800,
          height: 800,
          alt: `${brand.name} Perfumes India`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.octopusperfume.in/logo.png"],
    },
  };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  // Load products from in-memory cache
  const allProducts = getProducts();

  // Filter products by this brand
  const brandSlugNorm = slugifyBrand(brand.name);
  let brandProducts = allProducts.filter((p: any) => {
    const v = (p.vendor || "").trim();
    return v === brand.name || slugifyBrand(v) === brandSlugNorm;
  });

  // Sorting
  const sortParam = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "price-asc";
  brandProducts.sort((a, b) => {
    const priceA = a.variants && a.variants.length > 0 ? parseFloat(a.variants[0].price) : 0;
    const priceB = b.variants && b.variants.length > 0 ? parseFloat(b.variants[0].price) : 0;
    if (sortParam === "price-asc") return priceA - priceB;
    if (sortParam === "price-desc") return priceB - priceA;
    if (sortParam === "title-asc") return a.title.localeCompare(b.title);
    if (sortParam === "title-desc") return b.title.localeCompare(a.title);
    return 0;
  });

  // Schema.org CollectionPage + ItemList + Brand JSON-LD
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${brand.name} Perfumes Collection`,
    "description": brand.description,
    "url": `https://www.octopusperfume.in/brands/${slug}`,
    "about": {
      "@type": "Brand",
      "name": brand.name,
      "description": brand.description,
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": brandProducts.length,
      "itemListElement": brandProducts.slice(0, 30).map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": p.title,
        "url": `https://www.octopusperfume.in/products/${p.handle}`,
      })),
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.octopusperfume.in",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Brands",
        "item": "https://www.octopusperfume.in/brands",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": brand.name,
        "item": `https://www.octopusperfume.in/brands/${slug}`,
      },
    ],
  };

  const otherTopBrands = getAllBrands()
    .filter((b) => b.slug !== slug && b.productCount >= 10)
    .slice(0, 8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="bg-[#FDF8F5] min-h-screen">
        {/* Brand Banner */}
        <section className="bg-[#f3efe9] py-12 px-6 md:px-16 lg:px-24 border-b border-[#E5B8B7]/30">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb Path */}
            <nav className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#6a6a6a] mb-6">
              <Link href="/" className="hover:text-[#222222] transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link href="/brands" className="hover:text-[#222222] transition-colors">Brands</Link>
              <ChevronRight size={13} />
              <span className="text-[#222222] font-bold truncate">{brand.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  <ShieldCheck size={14} /> 100% Original Authentic Batch Guaranteed
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-black text-stone-950 uppercase tracking-wide mb-3">
                  {brand.name} <span className="font-sans text-xl md:text-2xl text-[#ff385c] font-bold">Fragrances</span>
                </h1>
                <p className="text-stone-700 text-sm md:text-base leading-relaxed mb-4">
                  {brand.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-stone-600 font-medium">
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg border border-stone-200">
                    🔥 Flat 25% Instant OFF Applied
                  </span>
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg border border-stone-200">
                    🎁 Free 7ML Paradox Tester Pack
                  </span>
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg border border-stone-200">
                    🚀 Free Express Pan-India Delivery
                  </span>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm text-center shrink-0 min-w-[200px]">
                <span className="text-3xl font-extrabold text-stone-900 block">{brandProducts.length}</span>
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Available Perfumes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
            <div>
              <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                Showing {brandProducts.length} authentic {brand.name} bottles
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600 font-medium">Sort by:</span>
              <SortSelect defaultSort={sortParam} basePath={`/brands/${slug}`} />
            </div>
          </div>

          {/* Product Grid with Multi-Image Carousel */}
          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {brandProducts.map((product: any) => {
                const variant = product.variants?.[0];
                const price = variant?.price || "0";
                const comparePrice = variant?.compare_at_price;
                const discountPct = comparePrice ? Math.round(((parseFloat(comparePrice) - parseFloat(price)) / parseFloat(comparePrice)) * 100) : 25;

                return (
                  <Link
                    href={`/products/${product.handle}`}
                    key={product.id}
                    className="group flex flex-col h-full bg-white border border-[#ebebeb] hover:border-[#dddddd] transition-all duration-300 shadow-airbnb hover:shadow-airbnb-hover rounded-[14px] overflow-hidden"
                  >
                    <div className="relative aspect-square bg-[#f7f7f7] overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].local_src || product.images[0].localPath || product.images[0].src}
                          alt={product.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-contain p-4 group-hover:scale-105 transition-all duration-300 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6a6a6a]">No Image</div>
                      )}
                    </div>

                    <div className="p-3.5 md:p-5 flex flex-col flex-1 text-left bg-white">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                        {product.vendor || brand.name}
                      </div>
                      <h2 className="text-sm md:text-base font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors leading-snug mb-1.5 line-clamp-2">
                        {product.title}
                      </h2>
                      <p className="text-[11px] text-[#6a6a6a] mb-2">25%+ French Oils • 12H Longevity</p>

                      <div className="flex items-baseline gap-2 mt-auto mb-3">
                        <span className="text-base md:text-lg font-bold text-[#222222]">
                          ₹{price}
                        </span>
                        {comparePrice && parseFloat(comparePrice) > parseFloat(price) && (
                          <>
                            <span className="text-xs text-[#6a6a6a] line-through">₹{comparePrice}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {discountPct}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      <button className="w-full bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                        <ShoppingBag size={14} /> Buy Now
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-600 font-medium mb-4">No products currently available for {brand.name}.</p>
              <Link href="/brands" className="inline-flex items-center gap-2 bg-[#ff385c] text-white px-5 py-2.5 rounded-lg text-xs font-bold">
                <ArrowLeft size={14} /> Browse All Brands
              </Link>
            </div>
          )}

          {/* Internal Linking: Explore Other Popular Fragrance Houses */}
          {otherTopBrands.length > 0 && (
            <section className="mt-16 pt-10 border-t border-stone-200">
              <h2 className="text-lg md:text-xl font-bold text-stone-900 mb-4">
                Explore Other Iconic Fragrance Houses
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {otherTopBrands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/brands/${b.slug}`}
                    className="p-3.5 bg-white border border-stone-200 rounded-xl hover:border-stone-900 hover:shadow-xs transition-all group"
                  >
                    <span className="text-xs md:text-sm font-bold text-stone-900 group-hover:text-[#ff385c] transition-colors block truncate">
                      {b.name}
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      {b.productCount} Fragrances
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
