import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, BookOpen } from "lucide-react";
import {
  getAllCollectionSlugs,
  getAllPerfumeSummaries,
  getAllProducts,
  getCollectionDefinition,
  filterProducts,
  toGridSummary,
  toProductSummary,
} from "@/lib/catalog";
import { EDITORIAL_ARTICLES } from "@/lib/editorial";
import collectionsRaw from "@/lib/data/collections.json";
import { rakhiConfig } from "@/app/collections/[slug]/rakhi-config";
import CatalogExplorer from "@/components/CatalogExplorer";

interface RawCollection {
  handle: string;
  title: string;
  description?: string;
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const def = getCollectionDefinition(slug);
  if (def) {
    return {
      title: `${def.title} | Octopus Perfumes India`,
      description: def.seoDescription,
      alternates: { canonical: `https://www.octopusperfume.in/collections/${slug}` },
      openGraph: {
        title: `${def.title} | Octopus Perfumes India`,
        description: def.seoDescription,
        url: `https://www.octopusperfume.in/collections/${slug}`,
      },
    };
  }
  const rk = rakhiConfig[slug];
  if (rk) {
    return {
      title: rk.title,
      description: rk.description,
      alternates: { canonical: `https://www.octopusperfume.in/collections/${slug}` },
    };
  }
  const legacyCol = (collectionsRaw as RawCollection[]).find((c) => c.handle === slug);
  if (legacyCol) {
    return {
      title: `${legacyCol.title} | Octopus Perfumes India`,
      description: legacyCol.description || `Browse authentic ${legacyCol.title} at Octopus Perfumes.`,
      alternates: { canonical: `https://www.octopusperfume.in/collections/${slug}` },
    };
  }
  return { title: "Collection Not Found | Octopus Perfumes" };
}

const RELATED_DISCOVERY_LINKS = [
  { label: "All Perfumes", href: "/collections/all" },
  { label: "Bestsellers", href: "/collections/bestsellers" },
  { label: "Middle Eastern", href: "/collections/middle-eastern-perfumes" },
  { label: "Designer Houses", href: "/collections/designer-perfumes" },
  { label: "Haute Niche", href: "/collections/niche-perfumes" },
  { label: "For Men", href: "/collections/men" },
  { label: "For Women", href: "/collections/women" },
  { label: "Unisex", href: "/collections/unisex" },
  { label: "Miniatures & Vials", href: "/collections/miniatures" },
  { label: "Gift Sets", href: "/collections/gift-sets" },
];

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const def = getCollectionDefinition(slug);

  if (def) {
    const allPerfumes = getAllPerfumeSummaries();
    let scoped = filterProducts(allPerfumes, def.filters);
    if (slug === "bestsellers") {
      scoped = scoped.filter((p) => p.isBestseller || p.isFlagship || p.discountPct >= 30);
    }

    const baseUrl = "https://www.octopusperfume.in";

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: def.title,
      description: def.seoDescription,
      url: `${baseUrl}/collections/${slug}`,
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Collections",
          item: `${baseUrl}/collections/all`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: def.title,
          item: `${baseUrl}/collections/${slug}`,
        },
      ],
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: scoped.slice(0, 12).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${baseUrl}/products/${p.handle}`,
        name: p.title,
      })),
    };

    const faqSchema =
      def.faqs && def.faqs.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: def.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }
        : null;

    return (
      <div className="bg-white min-h-screen py-8 sm:py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-[#777777] mb-5 flex flex-wrap items-center gap-2"
          >
            <Link href="/" className="hover:text-[#242424]">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections/all" className="hover:text-[#242424]">
              Collections
            </Link>
            <span>/</span>
            <span className="text-[#242424] font-medium">{def.title}</span>
          </nav>

          <header className="bg-[#F7F6F3] border border-[#E8E6E1] rounded-[12px] p-6 sm:p-8 mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1.5">
              {def.eyebrow}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#242424] leading-tight mb-3">
              {def.title}
            </h1>
            <p className="text-sm sm:text-base text-[#5C5954] max-w-3xl leading-relaxed">
              {def.description}
            </p>

            {/* Quick Collection Discovery Strip */}
            <div className="mt-5 pt-4 border-t border-[#E8E6E1] flex flex-wrap gap-2">
              {RELATED_DISCOVERY_LINKS.map((item) => {
                const isCurrent = item.href === `/collections/${slug}`;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isCurrent
                        ? "bg-[#1F1D1B] text-white"
                        : "bg-white border border-[#E8E6E1] text-[#3E3C38] hover:border-[#242424]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <CatalogExplorer
            products={scoped.map(toGridSummary)}
            initialFilters={def.filters.sort ? { sort: def.filters.sort } : {}}
          />

          {/* Editorial SEO & Collection FAQs */}
          <section className="mt-14 pt-10 border-t border-[#E8E6E1] grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953]">
                Collector Notes &amp; Authenticity
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424]">
                Shopping {def.title} in India
              </h2>
              <p className="text-sm text-[#5C5954] leading-relaxed">
                {def.seoDescription} Every listing reflects live stocked bottles with original cellophane packaging and matching batch numbers. Combine 2 bottles for an automatic 3% multi-item discount, 3+ items for 5% OFF, or apply prepaid checkout code <strong>OCTOPUS5</strong> for 5% OFF on orders of ₹5,000+.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                {EDITORIAL_ARTICLES.slice(0, 2).map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/journal/${guide.slug}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] border border-[#E8E6E1] bg-[#F7F6F3] hover:border-[#9A7953] text-xs font-semibold text-[#242424]"
                  >
                    <BookOpen size={13} className="text-[#9A7953]" />
                    <span>{guide.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {def.faqs && def.faqs.length > 0 && (
              <div className="lg:col-span-5">
                <h3 className="font-serif text-xl font-semibold text-[#242424] mb-3">
                  Collection FAQs
                </h3>
                <div className="fc-accordion border-t border-[#E8E6E1]">
                  {def.faqs.map((faq, idx) => (
                    <details key={idx} className="py-3">
                      <summary className="flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#242424] py-1">
                        <span>{faq.q}</span>
                        <ChevronDown size={14} className="text-[#777777] shrink-0" />
                      </summary>
                      <p className="pt-2 text-xs text-[#5C5954] leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // Fallback for preserved legacy collections.json / Rakhi keepsake SEO routes
  const rk = rakhiConfig[slug];
  const legacyCol = (collectionsRaw as RawCollection[]).find((c) => c.handle === slug);
  if (!rk && !legacyCol) {
    notFound();
  }

  const allRaw = getAllProducts(true);
  const title = rk?.title || legacyCol?.title || slug.replace(/-/g, " ");
  const description =
    rk?.description ||
    legacyCol?.description ||
    `Curated items in ${title}.`;

  const cleanSlugTokens = slug
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const legacyMatches = allRaw
    .filter((p) => {
      if (rk) return !p.isPerfume;
      const hay = `${p.title} ${p.brand} ${p.tags.join(" ")} ${p.productType}`.toLowerCase();
      return cleanSlugTokens.some((t) => hay.includes(t));
    })
    .slice(0, 120)
    .map(toProductSummary);

  const fallbackList =
    legacyMatches.length > 0 ? legacyMatches : getAllPerfumeSummaries().slice(0, 48);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#777777] mb-5 flex items-center gap-2">
          <Link href="/" className="hover:text-[#242424]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#242424] font-medium capitalize">{title}</span>
        </nav>

        <header className="bg-[#F7F6F3] border border-[#E8E6E1] rounded-[12px] p-6 sm:p-8 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1.5">
            Curated Edit
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#242424] leading-tight mb-3">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#5C5954] max-w-3xl leading-relaxed">
            {description}
          </p>
        </header>

        <CatalogExplorer products={fallbackList} />
      </div>
    </div>
  );
}
