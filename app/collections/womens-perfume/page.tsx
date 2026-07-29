import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Women's Collection | Octopus Perfume by Harsh Beniwal",
  description: "Shop luxury perfumes for women by Octopus Perfume.",
  alternates: {
    canonical: "https://octopusperfume.in/collections/womens-perfume",
  },
};

export default function CollectionPage() {
  const collectionProducts = products.filter(p => p.gender.includes("Her"));

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Women's Collection | Octopus Perfume",
    description: "Shop luxury perfumes for women by Octopus Perfume.",
    url: "https://octopusperfume.in/collections/womens-perfume",
    numberOfItems: collectionProducts.length,
    itemListElement: collectionProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `https://octopusperfume.in/products/${p.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="flex flex-col items-center text-center mb-14">
        <p className="text-[11px] tracking-[0.3em] uppercase text-muted mb-3">Shop</p>
        <h1 className="font-serif-display text-4xl md:text-6xl">Women's Collection</h1>
      </div>
      {collectionProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14 md:gap-x-8 md:gap-y-20">
          {collectionProducts.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-stone-500 tracking-widest uppercase text-sm">No products found in this collection.</p>
        </div>
      )}
    </div>
  );
}
