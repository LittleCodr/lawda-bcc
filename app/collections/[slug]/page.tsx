import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (slug === 'all') {
    return { title: "All Personalized Gifts | Octopus" };
  }

  const formattedSlug = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return { title: `${formattedSlug} | Octopus Gifts` };
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

  // Filter products based on slug
  let filteredProducts = products;
  if (slug !== 'all') {
    const searchStr = slug.toLowerCase().replace(/-/g, ' ');
    
    // Check if it's a budget query (e.g. gifts-under-999)
    const budgetMatch = slug.match(/under-(\d+)/);
    
    if (budgetMatch) {
      const maxPrice = parseInt(budgetMatch[1], 10);
      filteredProducts = products.filter(p => {
        if (!p.variants || p.variants.length === 0) return false;
        const price = parseFloat(p.variants[0].price);
        return price <= maxPrice;
      });
    } else {
      // Intent/Keyword query
      filteredProducts = products.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(searchStr);
        const typeMatch = p.product_type?.toLowerCase().includes(searchStr);
        const tagsMatch = p.tags?.toLowerCase().includes(searchStr);
        
        // Intent mappings
        if (slug.includes('gifts-for-her') || slug.includes('girlfriend') || slug.includes('wife') || slug.includes('women')) {
          return ['necklace', 'earring', 'ring', 'anklet', 'bracelet'].some(t => 
            p.product_type?.toLowerCase().includes(t) || p.title.toLowerCase().includes(t)
          );
        }
        if (slug.includes('gifts-for-him') || slug.includes('boyfriend') || slug.includes('husband') || slug.includes('men')) {
          return ['cufflink', 'wallet', 'men', 'bracelet', 'keychain'].some(t => 
            p.product_type?.toLowerCase().includes(t) || p.title.toLowerCase().includes(t)
          );
        }

        return titleMatch || typeMatch || tagsMatch;
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

  const formattedTitle = slug === 'all' ? 'All Gifts' : slug.replace(/-/g, ' ');

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${formattedTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Octopus Gifts`,
    "description": `Shop ${formattedTitle.toLowerCase()} at Octopus Gifts. Personalized gifts for every relationship and budget.`,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="bg-[#FDF8F5] min-h-screen">
        {/* Category Banner */}
        <div className="bg-[#E5B8B7]/20 py-24 px-6 text-center border-b border-[#E5B8B7]/30">
          <h1 className="font-serif text-4xl md:text-5xl text-[#800020] mb-4 uppercase tracking-widest">
            {formattedTitle}
          </h1>
          <p className="text-[#2d2d2d] max-w-2xl mx-auto text-sm tracking-wide leading-relaxed font-bold">
            Discover our curated collection of {formattedTitle.toLowerCase()}. Crafted with love and designed to create unforgettable moments for you and your loved ones.
          </p>
        </div>

        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-12 border-b border-[#E5B8B7]/30 pb-4">
            <p className="text-xs uppercase tracking-widest text-[#2d2d2d] font-bold">
              Showing {displayProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)} of {totalProducts} Products
            </p>
          </div>

          {displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {displayProducts.map((product: any) => (
                  <Link href={`/products/${product.handle}`} key={product.id} className="group flex flex-col h-full bg-white border border-[#E5B8B7]/30 hover:border-[#E5B8B7] transition-all duration-300 shadow-sm hover:shadow-xl rounded-sm overflow-hidden">
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
      </div>
    </>
  );
}
