import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Gift, ChevronDown, Flame, Sparkles, ShoppingBag } from "lucide-react";
import { rakhiConfig } from "./rakhi-config";
import SortSelect from "@/components/SortSelect";
import FeaturedProductCarousel from "@/components/FeaturedProductCarousel";
import ZoomableImage from "@/components/ZoomableImage";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formattedSlug = slug === 'all' ? 'All Gifts' : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const title = rakhiConfig[slug] ? `${rakhiConfig[slug].title} | Octopus Perfumes by Harsh Beniwal` : `${formattedSlug} | Octopus Perfumes by Harsh Beniwal`;
  const description = rakhiConfig[slug]?.description || `Shop ${formattedSlug.toLowerCase()} at Octopus Perfumes by Harsh Beniwal. 100% original 50ML EDP luxury fragrances with free 7ML Paradox tester pack.`;
  const collectionUrl = `https://www.octopusperfume.in/collections/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: collectionUrl,
    },
    openGraph: {
      title,
      description,
      url: collectionUrl,
      siteName: "Octopus Perfumes by Harsh Beniwal",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: "Octopus Everlasting Gifts Collections",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

export default async function CollectionPage(props: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  
  // Load products from in-memory cache
  const products = getProducts();

  // Filter products based on search param 'q' if present
  let filteredProducts = products;
  const queryParam = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : null;
  
  if (queryParam) {
    filteredProducts = filteredProducts.filter(p => {
      const titleMatch = (p.title || "").toLowerCase().includes(queryParam);
      const typeMatch = (p.product_type || "").toLowerCase().includes(queryParam);
      const tagsMatch = (Array.isArray(p.tags) ? p.tags.join(" ") : (p.tags || "")).toLowerCase().includes(queryParam);
      return titleMatch || typeMatch || tagsMatch;
    });
  }

  // Filter products based on slug
  if (slug !== 'all') {
    const searchStr = slug.toLowerCase().replace(/-/g, ' ');
    
    // Check if it's a budget query (e.g. gifts-under-999)
    const budgetMatch = slug.match(/under-(\d+)/);
    
    if (budgetMatch) {
      const maxPrice = parseInt(budgetMatch[1], 10);
      filteredProducts = filteredProducts.filter(p => {
        if (!p.variants || p.variants.length === 0) return false;
        const price = parseFloat(p.variants[0].price);
        return price <= maxPrice;
      });
    } else {
      // Intent/Keyword query
      filteredProducts = filteredProducts.filter(p => {
        const titleStr = (p.title || "").toLowerCase();
        const typeStr = (p.product_type || "").toLowerCase();
        const vendorStr = (p.vendor || "").toLowerCase();
        const tagsStr = (Array.isArray(p.tags) ? p.tags.join(" ") : (p.tags || "")).toLowerCase();
        
        // Exact vendor match
        if (vendorStr === searchStr || vendorStr.replace(/[^a-z0-9]/g, '') === searchStr.replace(/[^a-z0-9]/g, '')) {
          return true;
        }

        // Intent mappings
        if (slug.includes('festive') || slug.includes('diwali')) {
          return true; // Show all products for festive and diwali collections
        }

        if (slug === 'rakhi-name-necklaces' || slug === 'name-necklaces') {
          if (titleStr.includes('hair') || typeStr.includes('hair') || tagsStr.includes('hair')) return false;
          return titleStr.includes('name necklace') || typeStr.includes('necklace') || tagsStr.includes('name necklace');
        }

        if (slug.includes('gifts-for-her') || slug.includes('girlfriend') || slug.includes('wife') || slug.includes('women') || slug.includes('sister')) {
          return ['necklace', 'earring', 'ring', 'anklet', 'bracelet', 'darling', 'women', 'for her', 'femme'].some(t => 
            typeStr.includes(t) || titleStr.includes(t) || tagsStr.includes(t)
          );
        }
        if (slug.includes('gifts-for-him') || slug.includes('boyfriend') || slug.includes('husband') || slug.includes('men') || slug.includes('brother')) {
          return ['cufflink', 'wallet', 'men', 'bracelet', 'keychain', 'perfume', 'edp', 'for him', 'homme'].some(t => 
            typeStr.includes(t) || titleStr.includes(t) || tagsStr.includes(t)
          );
        }

        if (slug.includes('valentine')) {
          return tagsStr.includes('valentine') || titleStr.includes('valentine');
        }

        if (slug.includes('wedding') || slug.includes('anniversary') || slug.includes('couple')) {
          return ['wedding', 'anniversary', 'couple'].some(w => tagsStr.includes(w) || titleStr.includes(w));
        }

        if (slug.includes('keychain')) {
          return tagsStr.includes('keychain') || titleStr.includes('keychain') || typeStr.includes('keychain');
        }

        // Evergreen fallback
        if (slug.includes('rakhi')) {
           return true; 
        }

        // Default word-based matching (ignore generic words)
        const ignoreWords = ['gift', 'gifts', 'for', 'custom', 'personalised', 'personalized', 'online', 'india'];
        const words = searchStr.split(' ').filter(w => !ignoreWords.includes(w) && w.length > 2);
        
        if (words.length > 0) {
          return words.some(w => titleStr.includes(w) || typeStr.includes(w) || vendorStr.includes(w) || tagsStr.includes(w));
        }

        return titleStr.includes(searchStr) || typeStr.includes(searchStr) || vendorStr.includes(searchStr) || tagsStr.includes(searchStr);
      });
    }
  }

  // Sorting logic
  const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : 'price-asc'; // Default sort is low to high

  filteredProducts.sort((a, b) => {
    const priceA = a.variants && a.variants.length > 0 ? parseFloat(a.variants[0].price) : 0;
    const priceB = b.variants && b.variants.length > 0 ? parseFloat(b.variants[0].price) : 0;
    
    if (sortParam === 'price-asc') return priceA - priceB;
    if (sortParam === 'price-desc') return priceB - priceA;
    if (sortParam === 'title-asc') return a.title.localeCompare(b.title);
    if (sortParam === 'title-desc') return b.title.localeCompare(a.title);
    return 0; // fallback
  });

  // Pagination logic
  const PRODUCTS_PER_PAGE = 24;
  const currentPage = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (validPage - 1) * PRODUCTS_PER_PAGE;
  const displayProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const formattedTitle = rakhiConfig[slug] 
    ? rakhiConfig[slug].title 
    : (slug === 'all' 
        ? (queryParam ? `Search Results for "${searchParams.q}"` : 'All Gifts') 
        : slug.replace(/-/g, ' '));
  const description = rakhiConfig[slug] ? rakhiConfig[slug].description : `Shop ${formattedTitle.toLowerCase()} at Octopus Everlasting Gifts. Everlasting gifts for every relationship and budget.`;
  const rakhiData = rakhiConfig[slug];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${formattedTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Octopus Everlasting Gifts`,
    "description": description,
    "url": `https://www.octopusperfume.in/collections/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": displayProducts.map((p, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.octopusperfume.in/products/${p.handle}`
      }))
    }
  };

  const faqSchema = rakhiData && rakhiData.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": rakhiData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="bg-[#FDF8F5] min-h-screen">
        {/* Category Banner */}
        {(slug === 'all' || slug.includes('festive') || slug.includes('diwali') || slug.includes('perfume') || slug === 'rakhi-name-necklaces' || slug === 'name-necklaces') ? (
          <div className="bg-[#f3efe9] py-16 px-6 md:px-16 lg:px-24 border-b border-[#E5B8B7]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[400px] gap-8">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#e6dfd3] to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl text-left md:w-1/2">
              <nav className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs uppercase font-bold tracking-widest text-[#800020] mb-8">
                <Link href="/" className="hover:text-red-700 transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link href="/collections/all" className="hover:text-red-700 transition-colors">Collections</Link>
                <ChevronRight size={12} />
                <span className="truncate">{formattedTitle}</span>
                <ChevronRight size={12} />
                <span className="truncate">Luxury Perfumes</span>
              </nav>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 backdrop-blur-md text-amber-800 border border-amber-400/30 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">
                <span>🪔</span> DIWALI FESTIVE SPECIAL <span>✨</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-stone-950 mb-2 uppercase tracking-wide font-black leading-tight">
                {formattedTitle}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-0.5 w-12 bg-amber-400/40 rounded-full"></div>
                <h2 className="text-xl md:text-2xl font-black text-amber-800 uppercase tracking-wider">
                  OCTOPUS EAU DE PARFUM
                </h2>
                <div className="h-0.5 w-12 bg-amber-400/40 rounded-full"></div>
              </div>
              
              <p className="text-stone-700 max-w-lg text-xs md:text-sm tracking-wide leading-relaxed font-medium">
                {description || "Explore 100% original 50ML Eau De Parfum fragrances crafted by Harsh Beniwal. Formulated with 25%+ French fragrance oils, 12H+ longevity, and a complimentary 7ML Paradox tester pack with every order."}
              </p>

              {/* Free 7ML Paradox Perfume Tester Promo */}
              <div className="mt-8 backdrop-blur-2xl bg-gradient-to-r from-white/90 via-amber-50/70 to-yellow-50/40 border border-white/90 rounded-3xl relative overflow-hidden p-5 md:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-amber-500/5 max-w-lg">
                <div className="relative w-28 h-28 md:w-32 md:h-32 bg-stone-900 rounded-2xl overflow-hidden border border-amber-400/40 shadow-lg shrink-0 z-10 flex items-center justify-center p-2 backdrop-blur-sm">
                  <img src="/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png" alt="Free 7ML Paradox EDP Tester Pack" className="w-full h-full object-contain" />
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 w-10 h-10 rounded-full flex flex-col items-center justify-center text-center shadow-md font-black leading-none border-2 border-white pointer-events-none transform rotate-12 scale-90">
                    <span className="text-[6px] uppercase tracking-widest font-black">FREE</span>
                  </div>
                </div>

                <div className="relative z-10 flex-1 text-center sm:text-left">
                  <div className="inline-flex bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 shadow-sm items-center gap-1.5">
                    <Gift size={12} className="shrink-0" /> FREE GIFT • WORTH ₹399
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl mb-1 font-bold text-stone-900 leading-tight">
                    7ML Paradox EDP Tester Pack
                  </h3>
                  <p className="text-stone-600 text-xs font-medium leading-relaxed mb-1">
                    Value <span className="line-through opacity-70">₹399</span> — Harsh Beniwal's iconic 12H luxury EDP tester added automatically to your cart for free!
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 w-full">
              <FeaturedProductCarousel />
              {/* Decorative floating badge */}
              <div className="absolute -bottom-6 -right-6 md:right-4 bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-400 text-stone-950 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center shadow-xl shadow-amber-500/25 border-2 border-white/80 rotate-[-15deg] z-20 pointer-events-none">
                <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">EDP</span>
                <span className="text-lg font-serif font-black leading-none">50ML</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#E5B8B7]/20 py-24 px-6 text-center border-b border-[#E5B8B7]/30">
            <nav className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#800020] transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/collections/all" className="hover:text-[#800020] transition-colors">Collections</Link>
              <ChevronRight size={12} />
              <span className="text-[#800020] truncate">{formattedTitle}</span>
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl text-[#800020] mb-4 uppercase tracking-widest">
              {formattedTitle}
            </h1>
            <p className="text-[#2d2d2d] max-w-2xl mx-auto text-sm tracking-wide leading-relaxed font-bold">
              {description}
            </p>
          </div>
        )}

        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 border-b border-amber-900/10 pb-4">
            <p className="text-xs uppercase tracking-widest text-stone-600 font-bold">
              Showing {displayProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)} of {totalProducts} Products
            </p>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
              <label htmlFor="sort" className="text-stone-500">Sort By:</label>
              <SortSelect slug={slug} queryParam={queryParam || undefined} defaultSort={sortParam} />
            </div>
          </div>

          {/* Fragrance Duo Highlight Sections - Airbnb Photo-First Duo */}
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overlord Highlight Section */}
            <div className="bg-white border border-[#ebebeb] hover:border-[#dddddd] rounded-[14px] p-6 sm:p-7 shadow-airbnb flex flex-col justify-between group">
              <div className="flex-1 flex flex-col items-start text-left mb-6">
                <div className="inline-flex bg-[#f7f7f7] text-[#222222] border border-[#ebebeb] px-3 py-1 rounded-full text-[11px] font-semibold mb-4 items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff385c]"></span>
                  <span>Harsh Beniwal Signature Pick</span>
                </div>
                <h2 className="text-[22px] sm:text-[26px] font-bold text-[#222222] mb-2 leading-tight">
                  Overlord <span className="text-[#6a6a6a] text-lg font-normal">50ML EDP</span>
                </h2>
                <p className="text-[#3f3f3f] text-sm leading-relaxed mb-4">
                  Dior Sauvage DNA formulated with 25%+ imported French oils. Electrifying citrus, spicy Sichuan pepper, and ambroxan. Includes free 7ML Paradox tester!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ebebeb]">
                <div>
                  <span className="text-xs text-[#6a6a6a] line-through mr-1.5">₹2,099</span>
                  <span className="text-lg font-bold text-[#222222]">₹1,299</span>
                </div>
                <Link href="/products/overlord" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white px-5 py-2.5 rounded-lg font-semibold text-xs shadow-xs transition-all">
                  Buy Now <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Paradox Highlight Section */}
            <div className="bg-white border border-[#ebebeb] hover:border-[#dddddd] rounded-[14px] p-6 sm:p-7 shadow-airbnb flex flex-col justify-between group">
              <div className="flex-1 flex flex-col items-start text-left mb-6">
                <div className="inline-flex bg-[#fff0f3] text-[#ff385c] border border-[#ffd1da] px-3 py-1 rounded-full text-[11px] font-semibold mb-4 items-center gap-1.5">
                  <span>Guest favorite 🔥</span>
                </div>
                <h2 className="text-[22px] sm:text-[26px] font-bold text-[#222222] mb-2 leading-tight">
                  Paradox <span className="text-[#6a6a6a] text-lg font-normal">50ML EDP</span>
                </h2>
                <p className="text-[#3f3f3f] text-sm leading-relaxed mb-4">
                  LV Les Sables Roses DNA. Centifolia Rose, rare amber, and smoky agarwood oud. Includes free 7ML Paradox tester!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ebebeb]">
                <div>
                  <span className="text-xs text-[#6a6a6a] line-through mr-1.5">₹2,099</span>
                  <span className="text-lg font-bold text-[#222222]">₹1,299</span>
                </div>
                <Link href="/products/paradox" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white px-5 py-2.5 rounded-lg font-semibold text-xs shadow-xs transition-all">
                  Buy Now <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {displayProducts.map((product: any) => (
                  <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col h-full bg-white border border-[#ebebeb] hover:border-[#dddddd] transition-all duration-300 shadow-airbnb hover:shadow-airbnb-hover rounded-[14px] overflow-hidden">
                    <div className="relative aspect-square bg-[#f7f7f7] overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image 
                          src={product.images[0].local_src || product.images[0].localPath || product.images[0].src} 
                          alt={product.title} 
                          fill 
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className={`${
                            Boolean((product.product_type || "").toLowerCase().includes("perfume") || (product.tags || []).some((t: string) => typeof t === "string" && t.toLowerCase().includes("perfume")))
                              ? "object-contain p-4" 
                              : "object-cover"
                          } group-hover:scale-105 transition-all duration-300 ease-out`} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6a6a6a]">No Image</div>
                      )}
                    </div>
                    
                    <div className="p-3.5 md:p-5 flex flex-col flex-1 text-left bg-white">
                      <h3 className="text-sm md:text-base font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors leading-snug mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-[#6a6a6a] mb-2">25%+ French Oils • 12H Longevity</p>
                      <div className="flex items-baseline gap-2 mt-auto mb-3">
                        <span className="text-base font-bold text-[#222222]">
                          ₹{product.variants && product.variants.length > 0 ? product.variants[0].price : "0"}
                        </span>
                        <span className="text-xs text-[#6a6a6a]">total</span>
                      </div>
                      
                      <button className="w-full bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white py-2.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                        <ShoppingBag size={14} /> Buy Now
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                  {validPage > 1 && (
                    <Link href={`/collections/${slug}?page=${validPage - 1}`} className="px-5 py-2.5 border border-[#ebebeb] text-[#222222] font-semibold text-xs rounded-lg hover:border-[#222222] transition-colors">
                      Previous
                    </Link>
                  )}
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      // Simplify pagination for large amounts of pages
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= validPage - 1 && pageNum <= validPage + 1)) {
                        return (
                          <Link 
                            key={pageNum} 
                            href={`/collections/${slug}?page=${pageNum}`}
                            className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-colors ${
                              pageNum === validPage 
                                ? 'bg-[#800020] text-white' 
                                : 'text-[#2d2d2d] hover:bg-[#E5B8B7]/30'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      }
                      if (pageNum === validPage - 2 || pageNum === validPage + 2) {
                        return <span key={pageNum} className="w-10 h-10 flex items-center justify-center text-[#E5B8B7]">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  {validPage < totalPages && (
                    <Link href={`/collections/${slug}?page=${validPage + 1}`} className="px-6 py-3 border border-[#E5B8B7] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#E5B8B7]/20 transition-colors">
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-white border border-[#E5B8B7]/30">
              <h2 className="font-serif text-3xl text-[#800020] mb-4">No Gifts Found</h2>
              <p className="text-[#2d2d2d] mb-8 font-medium">We couldn't find any items in this collection right now.</p>
              <Link href="/collections/all" className="inline-block bg-[#800020] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors">
                Explore All Gifts
              </Link>
            </div>
          )}
        </div>

        {/* SEO Copy & FAQs Section */}
        {rakhiData && (
          <div className="bg-white py-16 px-6 border-t border-[#E5B8B7]/30 mt-12">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-stone max-w-none text-justify mb-16 text-gray-700 leading-relaxed">
                <h2 className="font-serif text-3xl text-[#800020] mb-6">About {rakhiData.title}</h2>
                <p>{rakhiData.copy}</p>
              </div>

              <div className="mb-16">
                <h2 className="font-serif text-3xl text-[#800020] mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {rakhiData.faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-stone-50 border border-stone-200 rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900">
                        {faq.q}
                        <span className="transition group-open:rotate-180">
                          <ChevronDown size={20} className="text-[#800020]" />
                        </span>
                      </summary>
                      <div className="mt-4 text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-6 text-center font-bold">Popular Festive Collections</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/collections/diwali-gifts" className="backdrop-blur-md bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-400/20 text-amber-900 border border-amber-400/40 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-105 hover:shadow-md transition-all">🪔 Diwali Gift Sets</Link>
                  <Link href="/harsh-beniwal/octopus/perfumes" className="backdrop-blur-md bg-white/80 hover:bg-white text-stone-900 border border-white/80 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-105 hover:shadow-md transition-all">🔥 Harsh Beniwal Perfumes</Link>
                  <Link href="/collections/gifts-for-her" className="backdrop-blur-md bg-white/80 hover:bg-white text-stone-900 border border-white/80 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-105 hover:shadow-md transition-all">Gifts for Her</Link>
                  <Link href="/collections/gifts-for-him" className="backdrop-blur-md bg-white/80 hover:bg-white text-stone-900 border border-white/80 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-105 hover:shadow-md transition-all">Gifts for Him</Link>
                  <Link href="/collections/gifts-under-499" className="backdrop-blur-md bg-white/80 hover:bg-white text-stone-900 border border-white/80 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-105 hover:shadow-md transition-all">Gifts Under ₹499</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
