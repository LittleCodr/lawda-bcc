import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Gift, ChevronDown, Flame, Sparkles } from "lucide-react";
import { rakhiConfig } from "./rakhi-config";
import SortSelect from "@/components/SortSelect";
import FeaturedProductCarousel from "@/components/FeaturedProductCarousel";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formattedSlug = slug === 'all' ? 'All Gifts' : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const title = rakhiConfig[slug] ? `${rakhiConfig[slug].title} | Octopus Everlasting Gifts` : `${formattedSlug} | Octopus Everlasting Gifts`;
  const description = rakhiConfig[slug]?.description || `Shop ${formattedSlug.toLowerCase()} at Octopus Everlasting Gifts. Everlasting gifts for every relationship and budget.`;
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
      siteName: "Octopus Everlasting Gifts",
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
          if (titleStr.includes('hair') || typeStr.includes('hair') || tagsStr.includes('hair')) return false;
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

        if (slug === 'rakhi-name-necklaces') {
          const allowedWords = ['necklace', 'rakhi', 'anklet', 'bracelet', 'earrings'];
          return allowedWords.some(w => titleStr.includes(w));
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
        {slug === 'rakhi-name-necklaces' ? (
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
                <span className="truncate">Starting from ₹199</span>
              </nav>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#6b1625] mb-2 uppercase tracking-[0.05em] font-medium leading-tight">
                RAKHI NAME NECKLACES
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[#800020]"></div>
                <h2 className="font-serif text-xl md:text-3xl text-[#6b1625] uppercase tracking-widest font-medium">
                  STARTING FROM ₹199
                </h2>
                <div className="h-[1px] w-12 bg-[#800020]"></div>
              </div>
              
              <p className="text-[#2d2d2d] max-w-lg text-xs md:text-sm tracking-wide leading-relaxed font-medium">
                Shop our exclusive Rakshabandhan special: Personalized Name Necklaces starting from just ₹199. Beautifully crafted, anti-tarnish custom jewelry for your sister.
              </p>
            </div>

            <div className="relative z-10 md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 w-full">
              <FeaturedProductCarousel />
              {/* Decorative floating badge */}
              <div className="absolute -bottom-6 -right-6 md:right-4 bg-[#800020] text-white w-24 h-24 rounded-full flex flex-col items-center justify-center text-center shadow-xl border-4 border-[#f3efe9] rotate-[-15deg] z-20 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Only</span>
                <span className="text-xl font-serif leading-none">₹199</span>
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 border-b border-[#E5B8B7]/30 pb-4">
            <p className="text-xs uppercase tracking-widest text-[#2d2d2d] font-bold">
              Showing {displayProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)} of {totalProducts} Products
            </p>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
              <label htmlFor="sort" className="text-gray-500">Sort By:</label>
              <SortSelect slug={slug} queryParam={queryParam || undefined} defaultSort={sortParam} />
            </div>
          </div>

          {slug === 'rakhi-name-necklaces' && (
            <>

              <div className="mb-12 bg-[#801b34] rounded-[16px] p-6 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 border border-[#9a2845]">
                {/* Decorative Box Outline */}
                <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 opacity-[0.03] scale-[2] pointer-events-none">
                  <Gift size={200} strokeWidth={1} />
                </div>
                
                <div className="z-10 text-center md:text-left flex-1 pl-4 md:pl-12">
                  <div className="inline-flex bg-[#a73447]/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4 border border-[#a73447] backdrop-blur-sm items-center gap-1.5">
                    <Flame size={12} className="fill-current text-orange-400" /> HURRY! SELLING FAST
                  </div>
                  <h2 className="font-serif text-3xl md:text-5xl mb-2 leading-tight font-medium tracking-wide">
                    Make Her Smile<br /><span className="font-['Dancing_Script'] font-normal text-4xl md:text-6xl text-[#f3efe9]">This Rakhi</span>
                  </h2>
                  <p className="text-white/80 text-xs md:text-sm max-w-xs md:max-w-md mx-auto md:mx-0 mt-4 font-medium tracking-wide leading-relaxed">
                    The ultimate personalized gift for your sister.<br/> Limited stock available at just ₹349.
                  </p>
                </div>
                
                {/* Ticket Style Promo Box */}
                <div className="z-10 bg-[#fefdfa] text-center p-6 md:p-8 rounded-xl shadow-2xl w-[90%] md:w-auto min-w-[280px] md:min-w-[340px] relative">
                  {/* Ticket cutouts */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#801b34] rounded-full"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#801b34] rounded-full"></div>
                  
                  <p className="text-[#800020] text-[10px] uppercase tracking-widest font-black mb-3">SECRET BROTHER CODE</p>
                  <div className="border border-dashed border-[#800020] py-4 px-6 mb-4 bg-white mx-2">
                    <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-[0.2em] select-all">
                      ILYBEHENA
                    </p>
                  </div>
                  <p className="text-gray-800 text-[10px] md:text-xs font-bold px-4 leading-relaxed">
                    Use at checkout for extra <br/><span className="text-[#800020]">15% OFF</span> on orders above ₹499!
                  </p>
                </div>
              </div>

              {/* Highlight Sections */}
              <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fairy Name Necklace Highlight Section */}
                <div className="bg-gradient-to-br from-[#fcf0ee] to-[#fae6de] border border-[#f1dacd] rounded-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 flex flex-col justify-between h-full group p-8">
                  {/* Watermark/Background texture */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Fairynamenecklace3.webp')] bg-cover bg-center mix-blend-multiply pointer-events-none blur-sm grayscale"></div>
                  
                  <div className="z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full mb-6">
                    <div className="inline-flex bg-[#fedcdc]/80 text-[#a03030] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 shadow-sm items-center gap-1.5 backdrop-blur-sm border border-[#fca5a5]">
                      <Flame size={12} className="fill-current text-[#dc2626] shrink-0" /> 
                      <span className="whitespace-nowrap leading-tight">SOLD OVER 2000 PIECES!</span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl mb-3 leading-none font-bold text-gray-900 tracking-wide flex gap-2 items-center">
                      Mega <span className="font-['Dancing_Script'] text-5xl md:text-6xl text-[#d75454] font-normal transform -rotate-2 -translate-y-2">Sale</span>
                    </h2>
                    <p className="text-gray-800 mb-6 text-xs md:text-sm font-medium tracking-wide">
                      Get the exclusive <strong>Fairy Name Necklace</strong>.
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 z-10">
                    <Link href="/products/fairy-name-necklace" className="inline-flex items-center justify-center gap-2 bg-[#801b34] text-white px-6 py-3 rounded-md font-black uppercase tracking-widest hover:bg-[#6b162b] transition-colors shadow-lg w-full md:w-auto text-[10px]">
                      SHOP FOR ₹199 <ChevronRight size={14} />
                    </Link>
                    <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white rounded-xl overflow-hidden border-4 border-white shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img src="https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Fairynamenecklace3.webp?v=1745910455" alt="Fairy Name Necklace" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-[#801b34] text-white w-14 h-14 rounded-full flex flex-col items-center justify-center text-center shadow-lg font-black leading-none border-2 border-white">
                        <span className="text-[8px] uppercase tracking-widest opacity-90 mb-0.5">ONLY</span>
                        <span className="text-sm">₹199</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ethereal Hollow Necklace Highlight Section */}
                <div className="bg-gradient-to-br from-[#f6f0fd] to-[#ede1fb] border border-[#e5d0f6] rounded-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 flex flex-col justify-between h-full group p-8">
                  {/* Watermark/Background texture */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Ethereal_Hollow_Necklace_-_Silver_G.webp')] bg-cover bg-center mix-blend-multiply pointer-events-none blur-sm grayscale"></div>
                  
                  <div className="z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full mb-6">
                    <div className="inline-flex bg-[#e8d5f9]/80 text-[#7e3eaf] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 shadow-sm items-center gap-1.5 backdrop-blur-sm border border-[#d8b4fe]">
                      <Sparkles size={12} className="fill-current text-[#9333ea] shrink-0" /> 
                      <span className="whitespace-nowrap leading-tight">TRENDING DESIGN!</span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl mb-3 leading-none font-bold text-gray-900 tracking-wide flex gap-2 items-center">
                      Steal <span className="font-['Dancing_Script'] text-5xl md:text-6xl text-[#a855f7] font-normal transform -rotate-2 -translate-y-2">Deal</span>
                    </h2>
                    <p className="text-gray-800 mb-6 text-xs md:text-sm font-medium tracking-wide">
                      Get the elegant <strong>Ethereal Hollow Necklace</strong>.
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 z-10">
                    <Link href="/products/ethereal-hollow-necklace" className="inline-flex items-center justify-center gap-2 bg-[#7e3eaf] text-white px-6 py-3 rounded-md font-black uppercase tracking-widest hover:bg-[#6b2c99] transition-colors shadow-lg w-full md:w-auto text-[10px]">
                      CLAIM FOR ₹99 <ChevronRight size={14} />
                    </Link>
                    <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white rounded-xl overflow-hidden border-4 border-white shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img src="https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Ethereal_Hollow_Necklace_-_Silver_G.webp?v=1764585187" alt="Ethereal Hollow Necklace" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-[#7e3eaf] text-white w-14 h-14 rounded-full flex flex-col items-center justify-center text-center shadow-lg font-black leading-none border-2 border-white">
                        <span className="text-[8px] uppercase tracking-widest opacity-90 mb-0.5">ONLY</span>
                        <span className="text-sm">₹99</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Free Ring Highlight Section */}
                <div className="bg-gradient-to-br from-[#fff7f0] to-[#fce3ce] border border-[#f5d0b5] rounded-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 flex flex-col justify-between h-full group p-8">
                  {/* Watermark/Background texture */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://cdn.shopify.com/s/files/1/0277/7019/2008/products/fpetnb-127-adjustable-paw-print-and-name-ring-1-1631952212-975255350.jpg')] bg-cover bg-center mix-blend-multiply pointer-events-none blur-sm grayscale"></div>
                  
                  <div className="z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full mb-6">
                    <div className="inline-flex bg-[#f59e0b]/20 text-[#b45309] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 shadow-sm items-center gap-1.5 backdrop-blur-sm border border-[#fcd34d]">
                      <Gift size={12} className="shrink-0" /> 
                      <span className="whitespace-nowrap leading-tight">FREE GIFT INCLUDED</span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl mb-3 leading-none font-bold text-gray-900 tracking-wide flex gap-2 items-center">
                      Free <span className="font-['Dancing_Script'] text-5xl md:text-6xl text-[#d97706] font-normal transform -rotate-2 -translate-y-2">Ring</span>
                    </h2>
                    <p className="text-gray-800 mb-6 text-xs md:text-sm font-medium tracking-wide">
                      Get a free <strong>18K Paw Name Ring</strong> with every personalized name necklace!
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 z-10">
                    <div className="inline-flex items-center justify-center gap-2 bg-[#d97706] text-white px-6 py-3 rounded-md font-black uppercase tracking-widest shadow-lg w-full md:w-auto text-[10px]">
                      AUTO ADDED IN CART
                    </div>
                    <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white rounded-xl overflow-hidden border-4 border-white shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img src="https://cdn.shopify.com/s/files/1/0277/7019/2008/products/fpetnb-127-adjustable-paw-print-and-name-ring-1-1631952212-975255350.jpg?v=1667301766" alt="Free Ring" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-[#d97706] text-white w-14 h-14 rounded-full flex flex-col items-center justify-center text-center shadow-lg font-black leading-none border-2 border-white">
                        <span className="text-[8px] uppercase tracking-widest opacity-90 mb-0.5">VALUE</span>
                        <span className="text-sm">₹499</span>
                      </div>
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
                          unoptimized
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
                      <h3 className="font-serif text-sm md:text-lg text-[#2d2d2d] group-hover:text-[#800020] transition-colors leading-tight mb-1 md:mb-2 font-bold line-clamp-2 md:line-clamp-none h-10 md:h-auto">
                        {product.title}
                      </h3>
                      {(product.title || "").toLowerCase().includes("name necklace") && (
                        <p className="text-[8px] uppercase tracking-widest text-[#b8860b] font-bold mb-2">22k Gold Plated • Anti Tarnish</p>
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
