import { EDITORIAL_ARTICLES } from "@/lib/editorial";

export const revalidate = 86400;

export async function GET() {
  const DOMAIN = "https://www.octopusperfume.in";
  const now = new Date().toISOString().split("T")[0];

  const urls = [
    `  <url>
    <loc>${DOMAIN}/journal</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    ...EDITORIAL_ARTICLES.map(
      (a) => `  <url>
    <loc>${DOMAIN}/journal/${a.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}

