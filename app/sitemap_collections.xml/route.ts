import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const DOMAIN = "https://www.octopusperfume.in";
  const now = new Date().toISOString().split("T")[0];

  let collections: any[] = [];
  try {
    const colPath = path.join(process.cwd(), "lib", "data", "collections.json");
    if (fs.existsSync(colPath)) {
      collections = JSON.parse(fs.readFileSync(colPath, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading collections for sitemap:", e);
  }

  // Also include core collections
  const coreHandles = ["all", "diwali-gifts", "festive-gifts", "luxury-perfumes"];
  const allHandles = Array.from(
    new Set([...coreHandles, ...collections.map((c) => c.handle).filter(Boolean)])
  );

  const xmlUrls = allHandles.map(
    (handle) => `  <url>
    <loc>${DOMAIN}/collections/${handle}</loc>
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
