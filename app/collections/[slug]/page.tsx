import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Gift, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { rakhiConfig } from "./rakhi-config";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formattedSlug = slug === 'all' ? 'All Gifts' : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const title = rakhiConfig[slug] ? `${rakhiConfig[slug].title} | Octopus Gifts` : `${formattedSlug} | Octopus Gifts`;
  const description = rakhiConfig[slug]?.description || `Shop ${formattedSlug.toLowerCase()} at Octopus Gifts. Personalized gifts for every relationship and budget.`;
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
      siteName: "Octopus Gifts",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: "Octopus Gifts Collections",
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
  
  let products: any[] = [];
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      products = JSON.parse(fileContent);
    }
  } catch (e) {
    console.error("Error loading products:", e);
  }

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
        const tagsStr = (Array.isArray(p.tags) ? p.tags.join(" ") : (p.tags || "")).toLowerCase();
        
        // Intent mappings
        if (slug === 'rakhi-name-necklaces') {
          return titleStr.includes('name necklace') || typeStr.includes('necklace') || tagsStr.includes('name necklace') || tagsStr.includes('rakhi-name-necklaces');
        }

        if (slug.includes('gifts-for-her') || slug.includes('girlfriend') || slug.includes('wife') || slug.includes('women') || slug.includes('sister')) {
          return ['necklace', 'earring', 'ring', 'anklet', 'bracelet'].some(t => 
            typeStr.includes(t) || titleStr.includes(t)
          );
        }
        if (slug.includes('gifts-for-him') || slug.includes('boyfriend') || slug.includes('husband') || slug.includes('men') || slug.includes('brother')) {
          return ['cufflink', 'wallet', 'men', 'bracelet', 'keychain'].some(t => 
            typeStr.includes(t) || titleStr.includes(t)
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

        if (slug === 'rakhi-for-him') {
          return tagsStr.includes('rakhi-for-him');
        }

        // Rakhi fallback (return all personalized items if no specific match)
        if (slug.includes('rakhi')) {
           return true; 
        }

        // Default word-based matching (ignore generic words)
        const ignoreWords = ['gift', 'gifts', 'for', 'custom', 'personalised', 'personalized', 'online', 'india'];
        const words = searchStr.split(' ').filter(w => !ignoreWords.includes(w) && w.length > 2);
        
        if (words.length > 0) {
          return words.some(w => titleStr.includes(w) || typeStr.includes(w) || tagsStr.includes(w));
        }

        return titleStr.includes(searchStr) || typeStr.includes(searchStr) || tagsStr.includes(searchStr);
      });
    }
  }

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
  const description = rakhiConfig[slug] ? rakhiConfig[slug].description : `Shop ${formattedTitle.toLowerCase()} at Octopus Gifts. Personalized gifts for every relationship and budget.`;
  const rakhiData = rakhiConfig[slug];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${formattedTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Octopus Gifts`,
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

        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-12 border-b border-[#E5B8B7]/30 pb-4">
            <p className="text-xs uppercase tracking-widest text-[#2d2d2d] font-bold">
              Showing {displayProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)} of {totalProducts} Products
            </p>
          </div>

          {slug === 'rakhi-name-necklaces' && (
            <>

              <div className="mb-12 bg-gradient-to-br from-[#800020] to-[#c00030] rounded-2xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="absolute top-0 right-0 opacity-10 scale-150 -translate-y-1/4 translate-x-1/4">
                  <Gift size={200} />
                </div>
                <div className="z-10 text-center md:text-left flex-1">
                  <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/30 backdrop-blur-sm">
                    <Flame size={12} className="inline-block mr-1 text-orange-500" /> Selling Out Fast
                  </div>
                  <h2 className="font-serif text-3xl md:text-5xl mb-4 leading-tight font-bold">
                    Make Her Smile<br />This Rakhi.
                  </h2>
                  <p className="text-white/90 mb-6 text-lg">
                    The ultimate personalized gift for your sister. Limited stock available at just ₹349.
                  </p>
                </div>
                <div className="z-10 bg-white text-center p-6 md:p-8 rounded-xl shadow-xl w-full md:w-auto min-w-[280px]">
                  <p className="text-[#800020] text-sm uppercase tracking-widest font-bold mb-2">Secret Brother Code</p>
                  <p className="text-3xl font-black text-gray-900 tracking-widest select-all bg-[#FDF8F5] py-3 rounded-lg border-2 border-dashed border-[#800020] mb-4">
                    ILYBEHENA
                  </p>
                  <p className="text-gray-600 text-sm font-bold">Use at checkout for extra ₹150 OFF!</p>
                </div>
              </div>

              {/* Fairy Name Necklace Highlight Section */}
              <div className="mb-12 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-[2px] rounded-2xl shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="bg-white rounded-[14px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 opacity-5 scale-150 pointer-events-none">
                    <Flame size={400} />
                  </div>
                  
                  <div className="z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
                    <div className="inline-block bg-red-100 text-red-700 px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.1em] mb-4 border border-red-200 shadow-sm animate-pulse flex items-center gap-1.5 md:gap-2">
                      <Flame size={14} className="fill-current text-red-600 shrink-0" /> 
                      <span className="whitespace-normal md:whitespace-nowrap leading-tight">Bestselling Necklace - Sold over 2000 pieces in last 28 hours!</span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-5xl mb-3 md:mb-4 leading-tight font-black text-gray-900 uppercase tracking-widest">
                      Independence Day<br /><span className="text-red-600">Mega Sale</span>
                    </h2>
                    <p className="text-gray-600 mb-5 md:mb-6 text-sm md:text-lg font-medium leading-relaxed max-w-xl">
                      Get the exclusive <strong className="text-gray-900 font-black">Fairy Name Necklace</strong> at a mind-blowing price. Our biggest drop of the year.
                    </p>
                    <Link href="/products/fairy-name-necklace" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-red-500/20 w-full md:w-auto text-xs md:text-sm">
                      Claim Yours For ₹199 Now <ChevronRight size={18} />
                    </Link>
                  </div>
                  
                  <div className="z-10 relative w-[80%] max-w-[240px] md:w-1/3 aspect-[4/5] md:max-w-[300px] bg-stone-100 rounded-xl overflow-hidden border-4 border-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 mx-auto md:mx-0 mt-6 md:mt-0 shrink-0">
                    <img src="https://cdn.shopify.com/s/files/1/0885/8763/2921/files/Picsart_24-05-18_10-53-40-621.jpg?v=1716010078" alt="Fairy Name Necklace" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-red-600 text-white w-16 h-16 rounded-full flex flex-col items-center justify-center text-center shadow-xl rotate-12 font-black leading-none border-2 border-white">
                      <span className="text-[10px] uppercase tracking-widest opacity-90">Only</span>
                      <span className="text-lg">₹199</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-8 md:gap-y-12">
                {displayProducts.map((product: any) => (
                  <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col h-full bg-white border border-[#E5B8B7]/30 hover:border-[#E5B8B7] transition-all duration-300 shadow-sm hover:shadow-xl rounded-lg md:rounded-sm overflow-hidden">
                    <div className="relative aspect-[4/5] bg-[#FDF8F5] overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image 
                          src={product.images[0].local_src || product.images[0].src} 
                          alt={product.title} 
                          fill 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#E5B8B7]">No Image</div>
                      )}
                      
                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-[#800020]/0 group-hover:bg-[#800020]/5 transition-colors duration-300 flex items-end justify-center p-6">
                        <span className="bg-white/90 backdrop-blur-sm text-[#800020] px-8 py-3 text-xs uppercase tracking-widest font-bold translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-[#E5B8B7]/30">
                          Personalize It
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 md:p-6 flex flex-col flex-1 text-center bg-white">
                      <h3 className="font-serif text-sm md:text-lg text-[#2d2d2d] group-hover:text-[#800020] transition-colors leading-tight mb-2 md:mb-3 font-bold line-clamp-2 md:line-clamp-none h-10 md:h-auto">
                        {product.title}
                      </h3>
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-2">
                  {validPage > 1 && (
                    <Link href={`/collections/${slug}?page=${validPage - 1}`} className="px-6 py-3 border border-[#E5B8B7] text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#E5B8B7]/20 transition-colors">
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
                <h2 className="font-serif text-3xl text-[#800020] mb-6 text-center">Related Rakhi Collections</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/collections/rakhi-gifts-for-sister" className="border border-[#E5B8B7] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#800020] hover:bg-[#800020] hover:text-white transition-colors shadow-sm">Rakhi Gifts for Sister</Link>
                  <Link href="/collections/rakhi-gifts-for-brother" className="border border-[#E5B8B7] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#800020] hover:bg-[#800020] hover:text-white transition-colors shadow-sm">Rakhi Gifts for Brother</Link>
                  <Link href="/collections/rakhi-gifts-under-499" className="border border-[#E5B8B7] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#800020] hover:bg-[#800020] hover:text-white transition-colors shadow-sm">Gifts Under ₹499</Link>
                  <Link href="/collections/personalized-rakhi-gifts" className="border border-[#E5B8B7] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#800020] hover:bg-[#800020] hover:text-white transition-colors shadow-sm">Personalized Rakhi</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
