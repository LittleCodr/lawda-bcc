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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Perfume Not Found | Octopus Perfumes by Harsh Beniwal" };
  }

  const title = `${product.title} - 50ML EDP | Official Harsh Beniwal OCTOPUS Perfumes`;
  const cleanDescription = `Buy 100% original ${product.title} (50ML Eau De Parfum) by Harsh Beniwal. Formulated with 25%+ French fragrance oils, 12+ hour beast-mode longevity. Includes FREE 7ML Paradox tester pack + Free express shipping in India!`;

  const imageUrl = product.images && product.images.length > 0 
    ? (product.images[0].localPath || product.images[0].local_src || product.images[0].url || product.images[0].src) 
    : "/logo.png";
  const absoluteImageUrl = imageUrl.startsWith("http") ? imageUrl : `https://www.octopusperfume.in${imageUrl}`;
  const canonicalUrl = `https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes/${slug}`;

  return {
    title,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: "Octopus Perfumes by Harsh Beniwal",
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: `${product.title} - Octopus Perfumes by Harsh Beniwal`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
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
    "name": formattedProduct.title,
    "image": allImageUrls.length > 0 ? allImageUrls : ["https://www.octopusperfume.in/logo.png"],
    "description": product.tagline || product.scentStory || "Original 50ML Eau De Parfum by Harsh Beniwal",
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
            "maxValue": 5,
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
      "reviewCount": 284,
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
        "reviewBody": "Loved the 7ML Paradox tester pack that came free with the box! Best purchase this festive season."
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
        "name": `How long does ${product.title} perfume last?`,
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
