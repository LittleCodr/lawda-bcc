import { MetadataRoute } from "next";
import { EDITORIAL_ARTICLES } from "@/lib/editorial";
import {
  SITE_URL,
  getHarshBeniwalPerfumeHandles,
  getValidCollectionSlugs,
  getVerifiedBrandEntries,
  getVerifiedCatalogProducts,
  toAbsoluteSiteUrl,
  toSafeDate,
} from "@/lib/sitemap-helpers";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entryMap = new Map<string, MetadataRoute.Sitemap[number]>();

  const upsert = (entry: MetadataRoute.Sitemap[number]) => {
    if (!entryMap.has(entry.url)) {
      entryMap.set(entry.url, entry);
    }
  };

  // 1. Homepage (high priority + new architectural hero visuals)
  upsert({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
    images: [
      `${SITE_URL}/images/fragrance-hero-bg.png`,
      `${SITE_URL}/harsh-beniwal/octopus/perfumes/images/overlord_hero.png`,
    ],
  });

  // 2. Core flagship hubs & seasonal / landing pages
  const corePages: Array<{
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly";
  }> = [
    { path: "/harsh-beniwal/octopus/perfumes", priority: 1.0, changeFrequency: "daily" },
    { path: "/octopus-perfume-coupon-code", priority: 0.95, changeFrequency: "daily" },
    { path: "/brands", priority: 0.9, changeFrequency: "daily" },
    { path: "/journal", priority: 0.85, changeFrequency: "weekly" },
    { path: "/diwali-gifts", priority: 0.75, changeFrequency: "weekly" },
    { path: "/diwali-gift-ideas", priority: 0.75, changeFrequency: "weekly" },
    { path: "/rakhi-gift-ideas", priority: 0.75, changeFrequency: "weekly" },
    { path: "/pages/about-us", priority: 0.6, changeFrequency: "weekly" },
    { path: "/pages/contact", priority: 0.6, changeFrequency: "weekly" },
    { path: "/pages/privacy-policy", priority: 0.5, changeFrequency: "weekly" },
    { path: "/pages/returns-refund-policy", priority: 0.6, changeFrequency: "weekly" },
    { path: "/pages/shipping-policy", priority: 0.6, changeFrequency: "weekly" },
    { path: "/pages/terms-conditions", priority: 0.5, changeFrequency: "weekly" },
  ];

  for (const page of corePages) {
    upsert({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // 3. Dedicated Harsh Beniwal x Octopus product landing pages
  for (const handle of getHarshBeniwalPerfumeHandles()) {
    upsert({
      url: `${SITE_URL}/harsh-beniwal/octopus/perfumes/${handle}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    });
  }

  // 4. All verified collection pages
  const highPriorityCollections = new Set([
    "all",
    "designer-perfumes",
    "middle-eastern-perfumes",
    "niche-perfumes",
    "bestsellers",
    "new-arrivals",
    "gift-sets",
    "harsh-beniwal",
    "octopus-perfumes",
  ]);

  for (const slug of getValidCollectionSlugs()) {
    upsert({
      url: `${SITE_URL}/collections/${slug}`,
      lastModified: now,
      changeFrequency: highPriorityCollections.has(slug) ? "daily" : "weekly",
      priority: highPriorityCollections.has(slug) ? 0.9 : 0.8,
    });
  }

  // 5. All verified perfume brand pages (/brands/[slug])
  for (const brand of getVerifiedBrandEntries()) {
    upsert({
      url: `${SITE_URL}/brands/${brand.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  // 6. Editorial guides
  for (const article of EDITORIAL_ARTICLES) {
    upsert({
      url: `${SITE_URL}/journal/${article.slug}`,
      lastModified: toSafeDate(article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  // 7. Deduplicated catalog product pages (/products/[slug])
  for (const product of getVerifiedCatalogProducts(true)) {
    const firstImage = product.images[0]?.src || product.image;
    upsert({
      url: `${SITE_URL}/products/${product.handle}`,
      lastModified: toSafeDate(product.createdAt),
      changeFrequency: product.isFlagship ? "daily" : "weekly",
      priority: product.isFlagship ? 0.95 : 0.85,
      images: firstImage && !firstImage.includes("/placeholder.svg")
        ? [toAbsoluteSiteUrl(firstImage)]
        : undefined,
    });
  }

  return Array.from(entryMap.values());
}
