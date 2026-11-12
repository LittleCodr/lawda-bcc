import {
  SITE_URL,
  escapeXml,
  getVerifiedCatalogProducts,
  toAbsoluteSiteUrl,
  toSafeDate,
} from "@/lib/sitemap-helpers";

const SHARD_SIZE = 3000;

export async function GET(request: Request) {
  const perfumes = getVerifiedCatalogProducts(false);
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const totalShards = Math.max(1, Math.ceil(perfumes.length / SHARD_SIZE));

  // When catalog exceeds 3,000 perfumes and no shard page is requested, serve a <sitemapindex>
  // linking cleanly to /sitemap_perfumes.xml?page=1..N so every response stays well under 4.5 MB.
  if (perfumes.length > SHARD_SIZE && !pageParam) {
    const nowIso = new Date().toISOString();
    const indexXml = Array.from({ length: totalShards }, (_, idx) => {
      const shardNum = idx + 1;
      return `  <sitemap>
    <loc>${SITE_URL}/sitemap_perfumes.xml?page=${shardNum}</loc>
    <lastmod>${nowIso}</lastmod>
  </sitemap>`;
    }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexXml}
</sitemapindex>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  }

  const pageNum = Math.min(totalShards, Math.max(1, Number(pageParam || "1") || 1));
  const start = (pageNum - 1) * SHARD_SIZE;
  const slice = perfumes.slice(start, start + SHARD_SIZE);

  const xmlEntries = slice
    .map((p) => {
      const firstImg = p.images?.[0];
      const imagesXml = firstImg
        ? `    <image:image>
      <image:loc>${escapeXml(toAbsoluteSiteUrl(firstImg.src))}</image:loc>
      <image:title>${escapeXml(firstImg.alt || p.title)}</image:title>
    </image:image>`
        : "";

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
