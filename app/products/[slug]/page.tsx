import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllPerfumeSummaries,
  getAllProducts,
  getProductByHandle,
  getSimilarProducts,
  toGridSummary,
  toProductSummary,
} from "@/lib/catalog";
import ProductUI from "@/app/products/[slug]/ProductUI";

export async function generateStaticParams() {
  return getAllProducts(true)
    .slice(0, 200)
    .map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductByHandle(slug);
  if (!product) {
    return { title: "Product Not Found | Octopus Perfumes" };
  }

  const primaryImg = product.images[0]?.src || "/placeholder.svg";
  const imageUrl = primaryImg.startsWith("http")
    ? primaryImg
    : `https://www.octopusperfume.in${primaryImg}`;

  const desc =
    product.tagline ||
    (product.plainDescription
      ? product.plainDescription.slice(0, 155)
      : `Buy original ${product.title} by ${product.brand} online in India at Octopus Perfumes.`);

  return {
    title: `${product.title} | Buy Original at ₹${Math.round(product.price)} | Octopus Perfumes`,
    description: desc,
    alternates: {
      canonical: `https://www.octopusperfume.in/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.title} — ${product.brand}`,
      description: desc,
      url: `https://www.octopusperfume.in/products/${product.handle}`,
      images: [{ url: imageUrl, alt: product.title }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  const summary = toGridSummary(toProductSummary(product));
  const similarProducts = getSimilarProducts(product, 10).map(toGridSummary);
  const sameBrandProducts = getAllPerfumeSummaries()
    .filter((p) => p.brandSlug === product.brandSlug && p.handle !== product.handle && p.available)
    .slice(0, 10)
    .map(toGridSummary);

  const primaryImg = product.images[0]?.src || "/placeholder.svg";
  const schemaImage = primaryImg.startsWith("http")
    ? primaryImg
    : `https://www.octopusperfume.in${primaryImg}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [schemaImage],
    description: product.tagline || product.plainDescription.slice(0, 300),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `https://www.octopusperfume.in/products/${product.handle}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.octopusperfume.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.brand,
        item: `https://www.octopusperfume.in/brands/${product.brandSlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `https://www.octopusperfume.in/products/${product.handle}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProductUI
        product={product}
        summary={summary}
        similarProducts={similarProducts}
        sameBrandProducts={sameBrandProducts}
      />
    </>
  );
}
