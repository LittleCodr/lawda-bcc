import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = { title: "Shop All - Octopus" };

export default function CollectionsAllPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10 py-16 md:py-24">
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
