import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EDITORIAL_ARTICLES, getArticleBySlug } from "@/lib/editorial";
import { getProductByHandle, toGridSummary, toProductSummary } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  return EDITORIAL_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | Octopus Perfumes" };

  return {
    title: `${article.title} | Octopus Fragrance Journal`,
    description: article.excerpt,
    alternates: { canonical: `https://www.octopusperfume.in/journal/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://www.octopusperfume.in/journal/${article.slug}`,
    },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const featuredProducts = article.featuredHandles
    .map((h) => getProductByHandle(h))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => toGridSummary(toProductSummary(p)));

  const relatedArticles = EDITORIAL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const baseUrl = "https://www.octopusperfume.in";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage.startsWith("http")
      ? article.heroImage
      : `${baseUrl}${article.heroImage}`,
    author: {
      "@type": "Organization",
      name: "Octopus Fragrance Editorial Desk",
    },
    publisher: {
      "@type": "Organization",
      name: "Octopus Perfumes India",
      url: baseUrl,
    },
    mainEntityOfPage: `${baseUrl}/journal/${article.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${baseUrl}/journal` },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${baseUrl}/journal/${article.slug}`,
      },
    ],
  };

  return (
    <article className="bg-white min-h-screen py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#777777] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#242424]">
            Home
          </Link>
          <span>/</span>
          <Link href="/journal" className="hover:text-[#242424]">
            Journal
          </Link>
          <span>/</span>
          <span className="text-[#242424] font-medium truncate">{article.title}</span>
        </nav>

        <header className="space-y-4 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953]">
            {article.category} · {article.publishedAt} · {article.readTime}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#242424] leading-[1.1]">
            {article.title}
          </h1>
          <p className="text-base sm:text-lg text-[#5C5954] leading-relaxed">
            {article.excerpt}
          </p>
          <p className="text-xs text-[#777777]">
            By <strong className="text-[#242424]">Octopus Fragrance Editorial Desk</strong>
          </p>
        </header>

        <div className="aspect-[16/9] bg-[#F7F6F3] border border-[#E8E6E1] rounded-[12px] p-6 mb-10 flex items-center justify-center">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-8 border-b border-[#E8E6E1] pb-10">
          {article.sections.map((sec) => (
            <section key={sec.heading} className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424]">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] text-[#3E3C38] leading-[1.8]">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <div className="pt-2">
            <Link
              href={article.relatedCollectionHref}
              className="btn-luxury-primary px-6 py-3.5 text-xs"
            >
              <span>{article.relatedCollectionLabel}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {featuredProducts.length > 0 && (
          <section className="pt-10 pb-10 border-b border-[#E8E6E1]">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424] mb-6">
              Mentioned Fragrances
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {featuredProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="pt-10">
            <h2 className="font-serif text-2xl font-semibold text-[#242424] mb-5">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/journal/${rel.slug}`}
                  className="p-4 rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] hover:border-[#9A7953] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A7953]">
                      {rel.category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#242424] mt-1">
                      {rel.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#242424] mt-3 inline-flex items-center gap-1">
                    Read Guide <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
