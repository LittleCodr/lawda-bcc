import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop All Perfumes | Octopus Perfume by Harsh Beniwal | Buy Online (Official)",
  description: "Buy the complete Octopus Perfume collection by Harsh Beniwal. 9 luxury Eau de Parfums — Darling, Mirage, Outlaw, Overlord, Paradox, Promised, Rhapsody, Somersault & Your Move. Free shipping across India. Shop only at the official store octopusperfume.in.",
  keywords: ["octopus perfume", "buy octopus perfume", "harsh beniwal perfume", "octopus all perfumes", "octopusperfume.in", "octopus collection", "buy octopus online", "harsh beniwal real website"],
  alternates: {
    canonical: "https://octopusperfume.in/collections/all",
  },
};

export default function CollectionsAllPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Octopus Perfume",
    description: "The complete collection of Eau de Parfums by Octopus Perfume (Harsh Beniwal)",
    url: "https://octopusperfume.in/collections/all",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
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
        <p className="text-[11px] tracking-[0.3em] uppercase text-muted mb-3">Shop All</p>
        <h1 className="font-serif-display text-4xl md:text-6xl">The Complete Collection</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14 md:gap-x-8 md:gap-y-20">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
