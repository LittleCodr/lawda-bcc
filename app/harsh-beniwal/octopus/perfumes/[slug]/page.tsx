import { notFound } from "next/navigation";
import ProductUI from "@/app/products/[slug]/ProductUI";
import scrapedPerfumes from "@/harsh-beniwal/octopus/perfumes/scraped_products.json";

export function generateStaticParams() {
  return (scrapedPerfumes as any[]).map((p) => ({
    slug: p.handle,
  }));
}

function getProduct(slug: string) {
  const perfumes = scrapedPerfumes as any[];
  const found = perfumes.find((p: any) => p.handle === slug || p.id?.toString() === slug);
  if (found) return found;
  return null;
}

function getHarshPerfumeSEO(slug: string, rawTitle: string) {
  const cleanTitle = rawTitle.replace(/\s*-\s*50ML\s+EDP.*$/gi, "").trim();

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
        "buyoctopus"
      ],
      alternateName: [
        "Octopus Overlord",
        "Octopus Overlord Perfume",
        "Overlord Perfume",
        "Octopus Overload Perfume",
        "Octopus Overload",
        "Harsh Beniwal Overlord Perfume",
        "Buy Octopus Overlord"
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    };
  }

  return {
    title: `Octopus ${cleanTitle} Perfume by Harsh Beniwal | 50ML EDP Official Store`,
    description: `Buy 100% original Octopus ${cleanTitle} perfume by Harsh Beniwal on the official store. 25%+ French oils, 12H+ longevity. Use code LUXURY25 for 25% OFF + Free 7ML tester & pan-India delivery.`,
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
      `Octopus ${cleanTitle}`,
      `Octopus ${cleanTitle} Perfume`,
      `Harsh Beniwal ${cleanTitle}`,
      `Buy Octopus ${cleanTitle}`
    ]
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Perfume Not Found | Octopus Perfumes by Harsh Beniwal" };
  }

  const seo = getHarshPerfumeSEO(slug, product.title);
  const imageUrl = product.images && product.images.length > 0 
    ? (product.images[0].localPath || product.images[0].local_src || product.images[0].url || product.images[0].src) 
    : "/logo.png";
  const absoluteImageUrl = imageUrl.startsWith("http") ? imageUrl : `https://www.octopusperfume.in${imageUrl}`;
  const canonicalUrl = `https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: "Octopus Perfumes by Harsh Beniwal",
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

export default async function HarshBeniwalProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const seo = getHarshPerfumeSEO(slug, product.title);

  // Format product object for ProductUI component if coming from scraped JSON format
  const formattedProduct = {
    ...product,
    title: product.title.includes("Octopus") ? product.title : `${product.title} - 50ML EDP Octopus Perfumes By Harsh Beniwal`,
    product_type: "Perfume",
    vendor: "Octopus Perfumes by Harsh Beniwal",
    variants: product.variants || [
      {
        id: product.id + 1,
        product_id: product.id,
        title: "50ML - Eau De Parfum",
        price: product.price ? product.price.toString() : "999.00",
        compare_at_price: product.compareAtPrice ? product.compareAtPrice.toString() : "1799.00",
        sku: product.sku || `OCT-${product.id}`,
        available: true,
      }
    ],
    images: (product.images || []).map((img: any, i: number) => ({
      src: img.local_src || img.localPath || img.src || img.url,
      alt: img.alt || `${product.title} - 50ML EDP by Harsh Beniwal`,
      id: img.id || `${product.id}-${i}`
    }))
  };

  const minPrice = formattedProduct.variants[0]?.price || "999";
  const allImageUrls = formattedProduct.images.map((img: any) =>
    img.src.startsWith("http") ? img.src : `https://www.octopusperfume.in${img.src}`
  );

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `Octopus ${product.title.replace(/\s*-\s*50ML\s+EDP.*$/gi, "").trim()} Perfume by Harsh Beniwal (50ML EDP)`,
    "alternateName": seo.alternateName,
    "category": "Beauty > Fragrances > Eau De Parfum",
    "image": allImageUrls.length > 0 ? allImageUrls : ["https://www.octopusperfume.in/logo.png"],
    "description": seo.description,
    "sku": product.sku || `OCT-${product.id}`,
    "mpn": product.sku || `OCT-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Octopus Perfumes by Harsh Beniwal"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes/${slug}`,
      "priceCurrency": "INR",
      "price": minPrice,
      "priceValidUntil": nextYear.toISOString().split("T")[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Octopus Perfumes by Harsh Beniwal"
      },
      "shippingDetails": {
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
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": 312,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
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
        "reviewBody": "Loved the 7ML Paradox tester pack that came free with the box! Best purchase."
      }
    ]
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.octopusperfume.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Harsh Beniwal Octopus Perfumes",
        "item": "https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes/${slug}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How long does Octopus ${product.title} perfume last?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Octopus Eau De Parfum (EDP) is crafted with 25%+ French fragrance oil concentration, providing 12+ hours of beast-mode projection and sillage on both skin and clothes."
        }
      },
      {
        "@type": "Question",
        "name": "Is this the official authentic Octopus Perfume by Harsh Beniwal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% original and official creation by Harsh Beniwal x Octopus. Every bottle is sealed, IFRA compliant, cruelty-free, and safe for daily use."
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
          "text": "We provide free express shipping across India. Orders placed before 5 PM are dispatched same-day and delivered within 2 to 4 business days."
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
          <ProductUI product={formattedProduct} />
        </div>
      </div>
    </>
  );
}
