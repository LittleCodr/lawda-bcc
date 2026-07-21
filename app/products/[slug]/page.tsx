import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/lib/products";
import AddToCartPanel from "@/components/AddToCartPanel";
import { Accordion } from "@/components/Accordion";
import ProductCard from "@/components/ProductCard";
import { ShieldCheck, RefreshCw, Banknote, Tag, Flame } from "lucide-react";
import LiveViewerCount from "@/components/LiveViewerCount";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const priceString = `₹${product.price.toLocaleString("en-IN")}`;
  const notesString = `Top: ${product.notes.top} | Heart: ${product.notes.heart} | Base: ${product.notes.base}`;
  const goodToKnowString = product.goodToKnow.join(" • ");

  return {
    title: `Octopus ${product.name} Perfume – Buy Online | Harsh Beniwal Official`,
    description: `${priceString} ; Good to know: ${goodToKnowString} ; Key Notes: ${notesString}. Shop ${product.name} Eau de Parfum by Harsh Beniwal, inspired by ${product.inspiredBy}.`,
    keywords: [
      `octopus ${product.name.toLowerCase()} perfume`,
      `${product.name} octopus perfume`,
      `${product.name} perfume`,
      "octopus perfume",
      "octopus perfume by harsh beniwal",
      "harsh beniwal perfume website",
      "octopusperfume.in",
      `buy octopus ${product.name.toLowerCase()} perfume`,
      `buy ${product.name} perfume`,
      `octopus ${product.name.toLowerCase()}`,
      product.inspiredBy,
    ],
    alternates: {
      canonical: `https://octopusperfume.in/products/${slug}`,
    },
    openGraph: {
      title: `Octopus ${product.name} Perfume – Buy Online | Harsh Beniwal Official`,
      description: `${priceString} ; Good to know: ${goodToKnowString} ; Key Notes: ${notesString}. Shop ${product.name} Eau de Parfum by Harsh Beniwal, inspired by ${product.inspiredBy}.`,
      images: [product.images.hero],
      url: `https://octopusperfume.in/products/${slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const gallery = [product.images.hero, product.images.lifestyle, product.images.mood, product.images.box].filter(
    Boolean
  ) as string[];

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} - Octopus Perfume`,
    image: `https://octopusperfume.in${product.images.hero}`,
    description: `${product.tagline} Inspired by ${product.inspiredBy}. ${product.gender}. 50ML Eau de Parfum by Octopus Perfume (Harsh Beniwal).`,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Octopus Perfume by Harsh Beniwal",
    },
    offers: {
      "@type": "Offer",
      url: `https://octopusperfume.in/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Octopus Lifestyle Private Limited",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "120",
    },
    category: "Eau de Parfum",
    additionalProperty: [
      { "@type": "PropertyValue", name: "Inspired By", value: product.inspiredBy },
      { "@type": "PropertyValue", name: "Gender", value: product.gender },
      { "@type": "PropertyValue", name: "Size", value: "50ML" },
      { "@type": "PropertyValue", name: "Top Notes", value: product.notes.top },
      { "@type": "PropertyValue", name: "Heart Notes", value: product.notes.heart },
      { "@type": "PropertyValue", name: "Base Notes", value: product.notes.base },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://octopusperfume.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://octopusperfume.in/collections/all"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://octopusperfume.in/products/${product.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="grid grid-cols-2 gap-3 md:gap-4 h-fit">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={`relative bg-white overflow-hidden ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}
              >
                <Image
                  src={src}
                  alt={`${product.name} Octopus Perfume by Harsh Beniwal - Image ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-2">
              Inspired by {product.inspiredBy} - {product.gender}
            </p>
            <h1 className="font-serif-display text-5xl md:text-6xl mb-1">{product.name}</h1>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-4">50 ML - Eau de Parfum</p>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <LiveViewerCount />
              <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 w-fit rounded-sm">
                <Flame size={14} className="animate-pulse text-red-500" />
                <p className="text-[11px] font-bold tracking-wide uppercase text-red-600">Selling Fast - Limited Stock!</p>
              </div>
            </div>

            <p className="text-sm text-ink/70 leading-relaxed mb-8 max-w-md">{product.tagline}</p>

            <AddToCartPanel product={product} />

            <div className="mt-6 bg-emerald-50 border border-emerald-200 p-4 rounded-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-3 flex items-center gap-2">
                <Tag size={14} /> Available Offers
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start text-sm text-emerald-900">
                  <div className="bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px] mt-0.5 shrink-0">HARSH10</div>
                  <p>Get <strong>10% OFF</strong> on your entire order. Use code at checkout.</p>
                </li>
                <li className="flex gap-3 items-start text-sm text-emerald-900">
                  <div className="bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px] mt-0.5 shrink-0">GIFT</div>
                  <p>Spend ₹1499+ and get a <strong>FREE 10ml Travel Spray</strong> instantly added to your bag!</p>
                </li>
                <li className="flex gap-3 items-start text-sm text-emerald-900">
                  <div className="bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px] mt-0.5 shrink-0">HARSH15</div>
                  <p>Buy 3+ bottles (Spend ₹2499+) and unlock <strong>15% OFF</strong>.</p>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between gap-2 mt-6 py-4 border-y border-ink/10">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <ShieldCheck size={18} className="text-ink/60" />
                <span className="text-[9px] uppercase tracking-wider text-ink/60 text-center font-medium">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 border-x border-ink/10">
                <RefreshCw size={18} className="text-ink/60" />
                <span className="text-[9px] uppercase tracking-wider text-ink/60 text-center font-medium">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <Banknote size={18} className="text-ink/60" />
                <span className="text-[9px] uppercase tracking-wider text-ink/60 text-center font-medium">COD Available</span>
              </div>
            </div>

            <div className="mt-8">
              <Accordion
                items={[
                  { title: "Scent Story", content: <p>{product.scentStory}</p> },
                  {
                    title: "Good to Know",
                    content: (
                      <ul className="space-y-1.5">
                        {product.goodToKnow.map((g) => (
                          <li key={g}>{g}</li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    title: "Key Notes",
                    content: (
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">Top</p>
                          <p>{product.notes.top}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">Heart</p>
                          <p>{product.notes.heart}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">Base</p>
                          <p>{product.notes.base}</p>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <section className="mt-24 md:mt-32">
          <h2 className="font-serif-display text-3xl md:text-4xl text-center mb-12">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-14 md:gap-x-8">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
