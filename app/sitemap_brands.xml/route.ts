import { getAllBrands } from "@/lib/brands";

export const dynamic = "force-dynamic";

export async function GET() {
  const DOMAIN = "https://www.octopusperfume.in";
  const brands = getAllBrands();
  const now = new Date().toISOString().split("T")[0];

  const brandUrls = [
    `  <url>
    <loc>${DOMAIN}/brands</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
    ...brands.map((b) => `  <url>
    <loc>${DOMAIN}/brands/${b.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${brandUrls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
