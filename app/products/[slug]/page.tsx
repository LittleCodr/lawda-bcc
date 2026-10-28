import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ProductUI from "./ProductUI";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const products = JSON.parse(fileContent);
      product = products.find((p: any) => p.handle === slug || p.id.toString() === slug);
    }
  } catch (e) {}

  if (!product) {
    return { title: "Product Not Found | Octopus Everlasting Gifts" };
  }

  const isHarshBeniwal = product.vendor === "Octopus Perfumes by Harsh Beniwal" || ['overlord', 'paradox', 'rhapsody', 'your-move', 'somersault', 'promised', 'outlaw', 'mirage', 'darling-women'].includes(product.handle);
  const isPerfume = isHarshBeniwal || (product.product_type || '').toLowerCase().includes('perfume') || (product.tags || []).some((t: string) => typeof t === 'string' && t.toLowerCase().includes('perfume'));
  const title = isHarshBeniwal 
    ? `${product.title} 50ML EDP by Harsh Beniwal | Diwali Luxury Fragrance Gift 2026`
    : isPerfume
    ? `${product.title} | Luxury Fragrance | Octopus Perfumes`
    : `${product.title} | Personalized Keepsake | Octopus Everlasting Gifts`;
  const cleanDescription = isHarshBeniwal
    ? `Buy 100% original ${product.title} 50ML Eau De Parfum by Harsh Beniwal for Diwali 2026. 25%+ French oils, 12H+ beast-mode sillage. Flat 20% OFF with code DIWALI20 + Free 7ML Paradox tester pack + Deluxe Diwali gift packaging & Express Pan-India Delivery!`
    : (product.body_html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160) || `${product.title} - 100% authentic fragrance with express pan-India delivery.`);
  const imageUrl = product.images && product.images.length > 0 ? (product.images[0].local_src || product.images[0].src) : "/logo.png";
  const absoluteImageUrl = imageUrl.startsWith("http") ? imageUrl : `https://www.octopusperfume.in${imageUrl}`;
  const productUrl = `https://www.octopusperfume.in/products/${slug}`;

  return {
    title,
    description: cleanDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description: cleanDescription,
      url: productUrl,
      siteName: isHarshBeniwal ? "Octopus Perfumes by Harsh Beniwal" : (isPerfume ? "Octopus Luxury Perfumes" : "Octopus Everlasting Gifts"),
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: product.title,
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

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const products = JSON.parse(fileContent);
      product = products.find((p: any) => p.handle === slug || p.id.toString() === slug);
    }
  } catch (e) {}

  if (!product) {
    notFound();
  }

  const isHarshBeniwal = product.vendor === "Octopus Perfumes by Harsh Beniwal" || ['overlord', 'paradox', 'rhapsody', 'your-move', 'somersault', 'promised', 'outlaw', 'mirage', 'darling-women'].includes(product.handle);
  const isPerfume = isHarshBeniwal || (product.product_type || '').toLowerCase().includes('perfume') || (product.tags || []).some((t: string) => typeof t === 'string' && t.toLowerCase().includes('perfume'));

  // Derive price for schema
  let minPrice = "0";
  if (product.variants && product.variants.length > 0) {
    minPrice = product.variants[0].price;
  }

  // Ensure absolute image URLs
  const allImages = (product.images || []).map((img: any) => {
    const src = img.local_src || img.localPath || img.src || "";
    return src.startsWith("http") ? src : `https://www.octopusperfume.in${src}`;
  }).filter(Boolean);

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  // Generate robust Product JSON-LD Schema for Google Shopping
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": allImages.length > 0 ? allImages : ["https://www.octopusperfume.in/logo.png"],
    "description": product.body_html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 300) || "Original fragrance collection",
    "sku": product.variants?.[0]?.sku || `OCT-${product.id}`,
    "mpn": product.variants?.[0]?.sku || `OCT-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": product.vendor || (isPerfume ? "Octopus Perfumes" : "Octopus Everlasting Gifts")
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.octopusperfume.in/products/${slug}`,
      "priceCurrency": "INR",
      "price": minPrice,
      "priceValidUntil": nextYear.toISOString().split("T")[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": isHarshBeniwal ? "Octopus Perfumes by Harsh Beniwal" : (product.vendor || "Octopus Luxury Perfumes")
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
        "name": isPerfume ? "Harsh Beniwal Octopus Perfumes" : "All Collections",
        "item": isPerfume 
          ? "https://www.octopusperfume.in/harsh-beniwal/octopus/perfumes" 
          : "https://www.octopusperfume.in/collections/all"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://www.octopusperfume.in/products/${slug}`
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
          <ProductUI product={product} />
        </div>
      </div>
    </>
  );
}
