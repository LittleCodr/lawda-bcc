import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ProductUI from "@/app/products/[slug]/ProductUI";

function getProduct(slug: string) {
  try {
    const dataPath = path.join(process.cwd(), "harsh-beniwal", "octopus", "perfumes", "scraped_products.json");
    if (fs.existsSync(dataPath)) {
      const perfumes = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      const found = perfumes.find((p: any) => p.handle === slug || p.id.toString() === slug);
      if (found) return found;
    }
  } catch (e) {}

  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const products = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      return products.find((p: any) => p.handle === slug || p.id.toString() === slug);
    }
  } catch (e) {}

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Perfume Not Found | Octopus Perfumes by Harsh Beniwal" };
  }

  const title = `${product.title} - 50ML EDP | Octopus Perfumes By Harsh Beniwal`;
  const cleanDescription = (product.tagline || product.scentStory || product.descriptionText || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160) || `Buy original ${product.title} 50ML Eau De Parfum by Harsh Beniwal at best price in India.`;

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
    images: (product.images || []).map((img: any) => ({
      src: img.localPath || img.local_src || img.url || img.src,
      alt: `${product.title} - Octopus Perfumes by Harsh Beniwal`,
      id: img.id || product.id
    }))
  };

  const minPrice = formattedProduct.variants[0]?.price || "999";
  const primaryImg = formattedProduct.images[0]?.src || "/logo.png";
  const absoluteImageUrl = primaryImg.startsWith("http") ? primaryImg : `https://www.octopusperfume.in${primaryImg}`;

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": formattedProduct.title,
    "image": [absoluteImageUrl],
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
      "ratingValue": product.rating?.value?.toString() || "4.8",
      "reviewCount": product.rating?.count || 145
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
          <ProductUI product={formattedProduct} />
        </div>
      </div>
    </>
  );
}
