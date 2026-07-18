import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <>
      <Hero />

      <section id="shop" className="bg-stone-50/50">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4 font-semibold">The Complete Edit</p>
            <h2 className="font-serif-display text-4xl md:text-6xl text-stone-900 text-balance leading-tight">
              Nine Signature Scents,<br className="md:hidden" /> One Uncompromising Standard
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-900 text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-8 font-semibold">From the Desk of Harsh Beniwal</p>
          <p className="font-serif-display text-3xl md:text-5xl leading-tight text-balance mb-12 text-white/90">
            "I set out to create luxury-grade fragrances at honest prices — built specifically for
            India, cutting out every unnecessary middleman. octopusperfume.in is the only official place to buy them."
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-[1px] bg-gold" />
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-gold">— Harsh Beniwal</p>
          </div>
        </div>
      </section>

      <section className="bg-white mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
          {[
            { title: "Powerful Projection", body: "Engineered to be noticed — these fragrances fill a room, not just your collar." },
            { title: "All-Day Longevity", body: "50ML Eau de Parfum concentration designed to carry you from morning meetings to midnight plans." },
            { title: "Crafted in India, for India", body: "Manufactured in Sonipat, Haryana — premium ingredients, zero middleman markups. Shop only at octopusperfume.in" },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-4 pt-12 md:pt-0 md:px-8 first:pt-0">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <h3 className="font-serif-display text-2xl md:text-3xl text-stone-900">{f.title}</h3>
              <p className="text-sm text-stone-500 max-w-xs leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
