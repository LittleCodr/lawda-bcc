import { SITE_URL, escapeXml, getValidCollectionSlugs } from "@/lib/sitemap-helpers";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString().split("T")[0];
  const allHandles = getValidCollectionSlugs();

  const xmlUrls = allHandles.map(
    (handle) => `  <url>
    <loc>${SITE_URL}/collections/${escapeXml(handle)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
