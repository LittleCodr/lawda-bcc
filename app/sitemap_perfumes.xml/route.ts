import {
  SITE_URL,
  escapeXml,
  getVerifiedCatalogProducts,
  toAbsoluteSiteUrl,
  toSafeDate,
} from "@/lib/sitemap-helpers";

export const revalidate = 86400;

export async function GET() {
  const perfumes = getVerifiedCatalogProducts(false);

  const xmlEntries = perfumes
    .map((p) => {
      const imagesXml = (p.images || [])
        .map((img) => {
          const absoluteSrc = toAbsoluteSiteUrl(img.src);
          return `    <image:image>
      <image:loc>${escapeXml(absoluteSrc)}</image:loc>
      <image:title>${escapeXml(img.alt || p.title)}</image:title>
    </image:image>`;
        })
        .join("\n");

      const lastmod = toSafeDate(p.createdAt).toISOString();

      return `  <url>
    <loc>${SITE_URL}/products/${escapeXml(p.handle)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.isFlagship ? "daily" : "weekly"}</changefreq>
    <priority>${p.isFlagship ? "0.95" : "0.9"}</priority>
${imagesXml ? imagesXml + "\n" : ""}  </url>`;
    })
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
