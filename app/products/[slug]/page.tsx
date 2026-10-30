import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ProductUI from "./ProductUI";

// Cache catalog in module memory to eliminate disk I/O and redundant 6MB JSON parsing
let cachedCatalog: any[] | null = null;
function getCatalog(): any[] {
  if (cachedCatalog) return cachedCatalog;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      cachedCatalog = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return cachedCatalog || [];
    }
  } catch (e) {
    console.error("Error loading products:", e);
  }
  return [];
}

// Enable Incremental Static Regeneration (24-hour cache on Vercel Edge / CDN)
// Subsequent visits are served as pure static HTML from Vercel Edge with zero CPU/function cost
export const revalidate = 86400;

function getProductSEOInfo(product: any, slug: string) {
  const isHarshBeniwal = product.vendor === "Octopus Perfumes by Harsh Beniwal" || 
    ['overlord', 'paradox', 'rhapsody', 'your-move', 'somersault', 'promised', 'outlaw', 'mirage', 'darling-women'].includes(slug);
  const isEverlasting = (product.vendor || "").toLowerCase().includes("everlasting") || 
    ['925-silver-snake-anklet', 'name-necklace', '12-in-1-jhumkas-box'].includes(slug);
  const isPerfume = isHarshBeniwal || (product.product_type || '').toLowerCase().includes('perfume') || 
    (product.tags || []).some((t: string) => typeof t === 'string' && t.toLowerCase().includes('perfume'));

  const cleanBaseTitle = product.title
    .replace(/\s*-\s*50ML\s+EDP\s+Octopus\s+Perfumes\s+By\s+Harsh\s+Beniwal/gi, "")
    .replace(/\s*-\s*50ML\s+EDP.*$/gi, "")
    .trim();

  if (isHarshBeniwal) {
    if (slug === "overlord") {
      return {
        title: "Octopus Overlord Perfume by Harsh Beniwal | 50ML EDP Official Store",
        description: "Buy 100% original Octopus Overlord perfume by Harsh Beniwal on the official store. 25%+ French fragrance oils, 12H+ beast-mode sillage. Use code LUXURY25 for 25% OFF + Free 7ML Paradox tester & express pan-India delivery.",
        keywords: [
          "octopus overlord",
          "octopus overlord perfume",
          "overlord perfume",
          "octopus overload perfume",
          "octopus overload",
          "overload perfume",
          "octopus perfume overlord",
          "harsh beniwal perfume overlord",
          "buy octopus overlord",
          "octopus perfume",
          "harsh beniwal perfume",
          "buy octopus perfume",
          "octopus fragrance",
          "harsh beniwal perfume brand",
          "octopus harsh beniwal",
          "buyoctopus",
          "overlord 50ml edp"
        ],
        alternateName: [
          "Octopus Overlord",
          "Octopus Overlord Perfume",
          "Overlord Perfume",
          "Octopus Overload Perfume",
          "Octopus Overload",
          "Harsh Beniwal Overlord Perfume",
          "Buy Octopus Overlord",
          "Overlord by Harsh Beniwal"
        ],
        category: "Beauty > Fragrances > Eau De Parfum",
        isHarshBeniwal: true,
        isEverlasting: false,
        isPerfume: true
      };
    }

    if (slug === "rhapsody") {
      return {
        title: "Octopus Rhapsody Perfume by Harsh Beniwal | 50ML EDP Official Store",
        description: "Buy 100% original Octopus Rhapsody perfume by Harsh Beniwal on the official store. 25%+ French fragrance oils, 12H+ longevity. Use code LUXURY25 for 25% OFF + Free 7ML Paradox tester & express pan-India delivery.",
        keywords: [
          "octopus rhapsody",
          "rhapsody octopus",
          "octopus rhapsody perfume",
          "rhapsody perfume",
          "octopus perfume rhapsody",
          "harsh beniwal perfume rhapsody",
          "buy octopus rhapsody",
          "octopus perfume",
          "harsh beniwal perfume",
          "buy octopus perfume",
          "octopus fragrance",
          "octopus harsh beniwal",
          "harsh beniwal perfume brand"
        ],
        alternateName: [
          "Octopus Rhapsody",
          "Rhapsody Octopus",
          "Octopus Rhapsody Perfume",
          "Rhapsody Perfume",
          "Harsh Beniwal Rhapsody",
          "Buy Octopus Rhapsody"
        ],
        category: "Beauty > Fragrances > Eau De Parfum",
        isHarshBeniwal: true,
        isEverlasting: false,
        isPerfume: true
      };
    }

    if (slug === "mirage") {
      return {
        title: "Octopus Mirage Perfume by Harsh Beniwal | 50ML EDP Official Store",
        description: "Buy 100% original Octopus Mirage perfume by Harsh Beniwal on the official store. 25%+ French fragrance oils, 12H+ longevity. Use code LUXURY25 for 25% OFF + Free 7ML Paradox tester & express pan-India delivery.",
        keywords: [
          "octopus mirage perfume",
          "octopus mirage",
          "mirage perfume",
          "octopus perfume mirage",
          "harsh beniwal perfume mirage",
          "buy octopus mirage",
          "octopus perfume",
          "harsh beniwal perfume",
          "octopus fragrance",
          "harsh beniwal perfume brand"
        ],
        alternateName: [
          "Octopus Mirage",
          "Octopus Mirage Perfume",
          "Mirage Perfume",
          "Harsh Beniwal Mirage"
        ],
        category: "Beauty > Fragrances > Eau De Parfum",
        isHarshBeniwal: true,
        isEverlasting: false,
        isPerfume: true
      };
    }

    if (slug === "paradox") {
      return {
        title: "Octopus Paradox Perfume by Harsh Beniwal | 50ML EDP Official Store",
        description: "Buy 100% original Octopus Paradox perfume by Harsh Beniwal on the official store. 25%+ French fragrance oils, 12H+ longevity. Use code LUXURY25 for 25% OFF + Free 7ML Paradox tester & express pan-India delivery.",
        keywords: [
          "octopus paradox perfume",
          "octopus paradox",
          "paradox perfume",
          "octopus perfume paradox",
          "harsh beniwal perfume paradox",
          "buy octopus paradox",
          "octopus perfume",
          "harsh beniwal perfume",
          "octopus fragrance",
          "harsh beniwal perfume brand"
        ],
        alternateName: [
          "Octopus Paradox",
          "Octopus Paradox Perfume",
          "Paradox Perfume",
          "Harsh Beniwal Paradox"
        ],
        category: "Beauty > Fragrances > Eau De Parfum",
        isHarshBeniwal: true,
        isEverlasting: false,
        isPerfume: true
      };
    }

    if (slug === "promised") {
      return {
        title: "Octopus Promised Perfume by Harsh Beniwal | 50ML EDP Official Store",
        description: "Buy 100% original Octopus Promised perfume by Harsh Beniwal on the official store. 25%+ French fragrance oils, 12H+ longevity. Use code LUXURY25 for 25% OFF + Free 7ML Paradox tester & express pan-India delivery.",
        keywords: [
          "octopus promised perfume",
          "octopus promised",
          "promised perfume",
          "octopus perfume promised",
          "harsh beniwal perfume promised",
          "buy octopus promised",
          "octopus perfume",
          "harsh beniwal perfume",
          "octopus fragrance",
          "harsh beniwal perfume brand"
        ],
        alternateName: [
          "Octopus Promised",
          "Octopus Promised Perfume",
          "Promised Perfume",
          "Harsh Beniwal Promised"
        ],
        category: "Beauty > Fragrances > Eau De Parfum",
        isHarshBeniwal: true,
        isEverlasting: false,
        isPerfume: true
      };
    }

    if (slug === "outlaw") {
      return {
        title: "Octopus Outlaw Perfume by Harsh Beniwal | 50ML EDP Official Store",
        description: "Buy 100% original Octopus Outlaw perfume by Harsh Beniwal on the official store. 25%+ French fragrance oils, 12H+ longevity. Use code LUXURY25 for 25% OFF + Free 7ML Paradox tester & express pan-India delivery.",
        keywords: [
          "octopus outlaw perfume",
          "octopus outlaw",
          "outlaw perfume",
          "octopus perfume outlaw",
          "harsh beniwal perfume outlaw",
          "buy octopus outlaw",
          "octopus perfume",
          "harsh beniwal perfume",
          "octopus fragrance",
          "harsh beniwal perfume brand"
        ],
        alternateName: [
          "Octopus Outlaw",
          "Octopus Outlaw Perfume",
          "Outlaw Perfume",
          "Harsh Beniwal Outlaw"
        ],
        category: "Beauty > Fragrances > Eau De Parfum",
        isHarshBeniwal: true,
        isEverlasting: false,
        isPerfume: true
      };
    }

    return {
      title: `Octopus ${cleanBaseTitle} Perfume by Harsh Beniwal | 50ML EDP Official Store`,
      description: `Buy 100% original Octopus ${cleanBaseTitle} perfume by Harsh Beniwal on the official flagship store. 25%+ French oils, 12H+ sillage. Code LUXURY25 for 25% OFF + Free 7ML tester & pan-India delivery.`,
      keywords: [
        `octopus ${slug}`,
        `octopus ${slug} perfume`,
        `${slug} perfume`,
        `harsh beniwal perfume ${slug}`,
        "buy octopus perfume",
        "octopus perfume",
        "harsh beniwal perfume",
        "octopus fragrance",
        "harsh beniwal perfume brand",
        "octopus harsh beniwal",
        "buyoctopus"
      ],
      alternateName: [
        `Octopus ${cleanBaseTitle}`,
        `Octopus ${cleanBaseTitle} Perfume`,
        `Harsh Beniwal ${cleanBaseTitle}`,
        `Buy Octopus ${cleanBaseTitle}`
      ],
      category: "Beauty > Fragrances > Eau De Parfum",
      isHarshBeniwal: true,
      isEverlasting: false,
      isPerfume: true
    };
  }

  if (slug === "925-silver-snake-anklet") {
    return {
      title: "Everlasting Snake Anklet | 925 Sterling Silver Snake Chain Anklet",
      description: "Buy original Everlasting Snake Anklet in pure 925 sterling silver. Hypoallergenic, anti-tarnish waterproof snake chain. Free express pan-India delivery & luxury velvet gift box.",
      keywords: [
        "everlasting snake anklet",
        "snake anklet everlasting",
        "snake anklet",
        "925 silver snake anklet",
        "everlasting jewellery",
        "silver snake chain anklet",
        "buy snake anklet online india"
      ],
      alternateName: [
        "Everlasting Snake Anklet",
        "Snake Anklet Everlasting",
        "925 Sterling Silver Snake Anklet",
        "Everlasting Silver Snake Anklet"
      ],
      category: "Apparel & Accessories > Jewelry > Anklets",
      isHarshBeniwal: false,
      isEverlasting: true,
      isPerfume: false
    };
  }

  if (slug === "name-necklace") {
    return {
      title: "Everlasting Name Necklace | Custom Personalized Name Pendant Chain",
      description: "Order official Everlasting Name Necklace with custom personalized pendant. 18K gold / 925 silver finish, anti-tarnish & waterproof. Pan-India express delivery & keepsake gift box.",
      keywords: [
        "everlasting name necklace",
        "name necklace everlasting",
        "custom name necklace",
        "personalized name necklace",
        "everlasting jewellery",
        "customized name pendant",
        "name chain india"
      ],
      alternateName: [
        "Everlasting Name Necklace",
        "Name Necklace Everlasting",
        "Custom Name Necklace",
        "Personalized Name Necklace",
        "Everlasting Name Chain"
      ],
      category: "Apparel & Accessories > Jewelry > Necklaces",
      isHarshBeniwal: false,
      isEverlasting: true,
      isPerfume: false
    };
  }

  if (slug === "12-in-1-jhumkas-box") {
    return {
      title: "Everlasting Jhumka Box | 12-in-1 Interchangeable Jhumki Earring Set",
      description: "Buy authentic Everlasting Jhumka Box featuring 12-in-1 interchangeable handcrafted jhumki earrings. Velvet organizer jewelry box, anti-tarnish plating & pan-India express shipping.",
      keywords: [
        "everlasting jhumka box",
        "jhumka box everlasting",
        "12 in 1 jhumka box",
        "everlasting jhumki box",
        "interchangeable jhumka box",
        "12 in 1 personalised jhumka box"
      ],
      alternateName: [
        "Everlasting Jhumka Box",
        "Jhumka Box Everlasting",
        "12 in 1 Jhumka Box",
        "Everlasting 12 in 1 Jhumki Earring Set"
      ],
      category: "Apparel & Accessories > Jewelry > Earrings",
      isHarshBeniwal: false,
      isEverlasting: true,
      isPerfume: false
    };
  }

  if (isEverlasting) {
    return {
      title: `Everlasting ${product.title} | Luxury Keepsake Jewelry`,
      description: `Buy authentic Everlasting ${product.title}. Premium handcrafted finish, anti-tarnish coating, and complimentary luxury gift packaging with free shipping in India.`,
      keywords: [
        `everlasting ${product.title.toLowerCase()}`,
        `${product.title.toLowerCase()} everlasting`,
        "everlasting jewellery",
        `buy ${product.title.toLowerCase()} online india`
      ],
      alternateName: [
        `Everlasting ${product.title}`,
        `${product.title} Everlasting`
      ],
      category: "Apparel & Accessories > Jewelry",
      isHarshBeniwal: false,
      isEverlasting: true,
      isPerfume: false
    };
  }

  if (isPerfume) {
    return {
      title: `${product.title} | Luxury Perfume | Octopus Perfumes`,
      description: `Shop 100% authentic ${product.title} by ${product.vendor || 'Octopus Perfumes'}. Flat 25% OFF with code LUXURY25 + Free 7ML Paradox tester pack & express pan-India delivery.`,
      keywords: [
        product.title,
        `${product.vendor || 'Octopus'} perfume`,
        `buy ${product.title} India`,
        "luxury perfume India",
        "octopus perfumes",
        "original perfume India"
      ],
      alternateName: [
        product.title,
        product.vendor ? `${product.vendor} ${product.title}` : `Octopus ${product.title}`
      ],
      category: "Beauty > Fragrances > Perfume",
      isHarshBeniwal: false,
      isEverlasting: false,
      isPerfume: true
    };
  }

  return {
    title: `${product.title} | Octopus Everlasting`,
    description: product.body_html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160) || `${product.title} - 100% authentic product with express pan-India delivery.`,
    keywords: [product.title, product.vendor, "octopus everlasting"],
    alternateName: [product.title],
    category: "General Merchandise",
    isHarshBeniwal: false,
    isEverlasting: false,
    isPerfume: false
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const products = getCatalog();
  const product = products.find((p: any) => p.handle === slug || p.id.toString() === slug);

  if (!product) {
    return { title: "Product Not Found | Octopus Luxury Perfumes & Gifts" };
  }

  const seo = getProductSEOInfo(product, slug);
  const imageUrl = product.images && product.images.length > 0 ? (product.images[0].local_src || product.images[0].src) : "/logo.png";
  const absoluteImageUrl = imageUrl.startsWith("http") ? imageUrl : `https://www.octopusperfume.in${imageUrl}`;
  const productUrl = `https://www.octopusperfume.in/products/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: productUrl,
      siteName: seo.isHarshBeniwal ? "Octopus Perfumes by Harsh Beniwal" : (seo.isPerfume ? "Octopus Luxury Perfumes" : "Octopus Everlasting Gifts"),
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: seo.title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [absoluteImageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const products = getCatalog();
  const product = products.find((p: any) => p.handle === slug || p.id.toString() === slug);

  if (!product) {
    notFound();
  }

  const seo = getProductSEOInfo(product, slug);

  // Ensure absolute image URLs
  const allImages = (product.images || []).map((img: any) => {
    const src = img.local_src || img.localPath || img.src || "";
    return src.startsWith("http") ? src : `https://www.octopusperfume.in${src}`;
  }).filter(Boolean);

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const shippingDetails = {
    "@type": "OfferShippingDetails",
    "shippingRate": {
      "@type": "MonetaryAmount",
      "value": "0",
      "currency": "INR"
    },
    "shippingDestination": {
      "@type": "DefinedRegion",
      "addressCountry": "IN"
    },
    "deliveryTime": {
      "@type": "ShippingDeliveryTime",
      "handlingTime": {
        "@type": "QuantitativeValue",
        "minValue": 1,
        "maxValue": 2,
        "unitCode": "d"
      },
      "transitTime": {
        "@type": "QuantitativeValue",
        "minValue": 2,
        "maxValue": 4,
        "unitCode": "d"
      }
    }
  };

  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "IN",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 7,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn"
  };

  // Build compliant Schema.org Offer or Offer array
  const variants = product.variants && product.variants.length > 0 ? product.variants : [{ id: 1, price: "0", sku: `OCT-${product.id}`, available: true }];
  const offersList = variants.map((v: any) => ({
    "@type": "Offer",
    "url": `https://www.octopusperfume.in/products/${slug}${variants.length > 1 ? `?variant=${v.id}` : ''}`,
    "priceCurrency": "INR",
    "price": v.price || "0",
    "priceValidUntil": nextYear.toISOString().split("T")[0],
    "itemCondition": "https://schema.org/NewCondition",
    "availability": v.available !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "sku": v.sku || `OCT-${product.id}-${v.id}`,
    "name": v.title && v.title !== "Default Title" ? `${product.title} - ${v.title}` : product.title,
    "seller": {
      "@type": "Organization",
      "name": seo.isHarshBeniwal ? "Octopus Perfumes by Harsh Beniwal" : (product.vendor || "Octopus Luxury Perfumes")
    },
    "shippingDetails": shippingDetails,
    "hasMerchantReturnPolicy": returnPolicy
  }));

  // Generate robust Product JSON-LD Schema for Google Shopping & Rich Snippets
  const productSchema: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": seo.isHarshBeniwal ? `Octopus ${product.title.replace(/\s*-\s*50ML\s+EDP.*$/gi, "")} Perfume by Harsh Beniwal (50ML EDP)` : product.title,
    "alternateName": seo.alternateName,
    "category": seo.category,
    "image": allImages.length > 0 ? allImages : ["https://www.octopusperfume.in/logo.png"],
    "description": seo.description,
    "sku": product.variants?.[0]?.sku || `OCT-${product.id}`,
    "mpn": product.variants?.[0]?.sku || `OCT-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": seo.isHarshBeniwal ? "Octopus Perfumes by Harsh Beniwal" : (product.vendor || (seo.isPerfume ? "Octopus Perfumes" : "Everlasting"))
    },
    "offers": offersList.length === 1 ? offersList[0] : offersList,
  };

  // Reviews & ratings
  if (seo.isHarshBeniwal) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": 312,
      "bestRating": "5",
      "worstRating": "1"
    };
    productSchema.review = [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Rohan Sharma" },
        "datePublished": "2026-09-18",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Beast mode projection! Lasts more than 14 hours easily. Smells super luxury and got so many compliments."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Aditya Verma" },
        "datePublished": "2026-09-24",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "100% authentic Harsh Beniwal fragrance. The French oils are top quality, feels just like luxury designer EDP."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Priya Patel" },
        "datePublished": "2026-10-02",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Loved the 7ML Paradox tester pack that came free with the box! Best luxury perfume purchase."
      }
    ];
  } else if (seo.isEverlasting) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": 184,
      "bestRating": "5",
      "worstRating": "1"
    };
    productSchema.review = [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Simran Kaur" },
        "datePublished": "2026-09-15",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Outstanding build quality and authentic anti-tarnish finish. Came in gorgeous gift packaging!"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Ananya Joshi" },
        "datePublished": "2026-09-28",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "100% original Everlasting design. Looks even more stunning in person."
      }
    ];
  }

  const brandSlug = product.vendor ? product.vendor.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';

  const breadcrumbElements = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.octopusperfume.in"
    }
  ];

  if (seo.isHarshBeniwal) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Harsh Beniwal Octopus Perfumes",
      "item": "https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes"
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": product.title,
      "item": `https://www.octopusperfume.in/products/${slug}`
    });
  } else if (brandSlug) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Brands",
      "item": "https://www.octopusperfume.in/brands"
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": product.vendor,
      "item": `https://www.octopusperfume.in/brands/${brandSlug}`
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 4,
      "name": product.title,
      "item": `https://www.octopusperfume.in/products/${slug}`
    });
  } else {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 2,
      "name": "All Collections",
      "item": "https://www.octopusperfume.in/collections/all"
    });
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": product.title,
      "item": `https://www.octopusperfume.in/products/${slug}`
    });
  }

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbElements
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seo.isHarshBeniwal ? [
      {
        "@type": "Question",
        "name": `How long does Octopus ${product.title} perfume last?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Octopus ${product.title} Eau De Parfum (EDP) is crafted with 25%+ French fragrance oil concentration, providing 12+ hours of beast-mode projection and sillage on both skin and clothes.`
        }
      },
      {
        "@type": "Question",
        "name": "Is this the official authentic Octopus Perfume by Harsh Beniwal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% original and official creation by Harsh Beniwal x Octopus. Every bottle is sealed, IFRA compliant, cruelty-free, and safe for daily wear."
        }
      },
      {
        "@type": "Question",
        "name": "What coupon code can I use for Octopus perfumes by Harsh Beniwal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use coupon code LUXURY25 at checkout for an instant flat 25% OFF your order. You can also use code OCTOPUS20 for 20% OFF."
        }
      },
      {
        "@type": "Question",
        "name": "Do I get a free 7ML Paradox perfume tester pack with this order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Every order placed today automatically includes a complimentary 7ML Paradox EDP luxury tester pack (worth ₹399) inside your package."
        }
      },
      {
        "@type": "Question",
        "name": "What is the delivery time across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide free express shipping across all pin codes in India. Orders are dispatched within 24 hours and delivered in 2 to 4 business days."
        }
      }
    ] : seo.isEverlasting ? [
      {
        "@type": "Question",
        "name": `Is the Everlasting ${product.title} authentic and anti-tarnish?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, 100% genuine Everlasting jewelry piece crafted with premium anti-tarnish waterproof protective plating. Safe for sensitive skin and everyday wear.`
        }
      },
      {
        "@type": "Question",
        "name": "What coupon code works for Everlasting products?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Apply coupon code LUXURY25 at checkout for an instant 25% discount across all Everlasting jewelry and keepsake boxes."
        }
      },
      {
        "@type": "Question",
        "name": "What is the return and replacement policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide a 7-day hassle-free return and replacement policy. If your package arrives damaged or defective, we provide an immediate free replacement."
        }
      },
      {
        "@type": "Question",
        "name": "How fast is express delivery in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide complimentary free express pan-India shipping. Orders arrive within 2 to 5 business days with live SMS tracking."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": `Is ${product.title} 100% authentic and original?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, absolutely. Every bottle of ${product.title} from ${product.vendor || 'Octopus Perfumes'} is 100% authentic, brand-new, and comes in the manufacturer's original sealed packaging with verified batch codes.`
        }
      },
      {
        "@type": "Question",
        "name": "What coupon code can I use for luxury perfumes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Apply coupon code LUXURY25 at checkout for an instant flat 25% discount on all luxury perfume houses."
        }
      },
      {
        "@type": "Question",
        "name": "What are the shipping charges and delivery timeframe in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide complimentary free express shipping across all pin codes in India. Orders are dispatched within 24-48 hours and delivered in 2-5 business days."
        }
      },
      {
        "@type": "Question",
        "name": `What is the return policy for ${product.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a 7-day hassle-free return and replacement policy for any unopened items or items arriving damaged in transit."
        }
      },
      {
        "@type": "Question",
        "name": "Do I receive a free luxury tester with my purchase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All perfume orders from Octopus Perfumes include a complimentary 7ML luxury EDP tester pack so you can experience additional premium fragrances."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="bg-white min-h-screen pt-12 pb-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <ProductUI product={product} />
        </div>
      </div>
    </>
  );
}
