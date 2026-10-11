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

  const isPerfume = product.product_type?.toLowerCase() === 'perfume' || (product.tags || []).some((t: string) => typeof t === 'string' && t.toLowerCase() === 'perfume');
  const title = isPerfume 
    ? `${product.title} | Harsh Beniwal Octopus Perfumes (50ML EDP)`
    : `${product.title} | Personalized Gift | Octopus Everlasting Gifts`;
  const cleanDescription = product.body_html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160) || "Buy 100% original Octopus perfumes by Harsh Beniwal at best price in India.";
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
      siteName: isPerfume ? "Octopus Perfumes by Harsh Beniwal" : "Octopus Everlasting Gifts",
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      locale: "en_IN",
      type: "product",
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

  const isPerfume = product.product_type?.toLowerCase() === 'perfume' || (product.tags || []).some((t: string) => typeof t === 'string' && t.toLowerCase() === 'perfume');

  // Derive price for schema
  let minPrice = "0";
  if (product.variants && product.variants.length > 0) {
    minPrice = product.variants[0].price;
  }

  // Ensure absolute image URL
  let imageUrl = "";
  if (product.images && product.images.length > 0) {
    const src = product.images[0].local_src || product.images[0].src;
    imageUrl = src.startsWith("http") ? src : `https://www.octopusperfume.in${src}`;
  } else {
    imageUrl = "https://www.octopusperfume.in/logo.png"; // Fallback
  }

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  // Generate robust Product JSON-LD Schema for Google Shopping
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [imageUrl],
    "description": product.body_html?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 300) || "Original fragrance collection",
    "sku": product.variants?.[0]?.sku || `OCT-${product.id}`,
    "mpn": product.variants?.[0]?.sku || `OCT-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": isPerfume ? "Octopus Perfumes by Harsh Beniwal" : "Octopus Everlasting Gifts"
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
        "name": isPerfume ? "Octopus Perfumes by Harsh Beniwal" : "Octopus Everlasting Gifts"
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
      "ratingValue": "4.8",
      "reviewCount": 185
    }
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
      <div className="bg-white min-h-screen pt-12 pb-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <ProductUI product={product} />
        </div>
      </div>
    </>
  );
}
