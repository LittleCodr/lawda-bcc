import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const CACHE_OUT = path.join(
  rootDir,
  "scripts",
  "catalog-enrichment",
  ".cache_all_3_sources.json"
);

const USER_AGENT = "OctopusPerfumesCatalogSync/2.0 (+https://www.octopusperfume.in)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJsonWithRetry(url, attempts = 5) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(25000),
      });
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("retry-after") || "2");
        await sleep(Math.max(2000, retryAfter * 1000) * i);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      await sleep(i * 1000);
    }
  }
  throw lastErr;
}

async function scrapeShopifySite(siteKey, baseUrl) {
  const seenIds = new Set();
  const products = [];
  const failedUrls = [];

  for (let page = 1; page <= 120; page++) {
    const url = `${baseUrl}/products.json?limit=250&page=${page}`;
    try {
      const json = await fetchJsonWithRetry(url, 5);
      const list = Array.isArray(json.products) ? json.products : [];
      if (list.length === 0) break;

      for (const p of list) {
        if (!p || !p.handle || seenIds.has(p.id)) continue;
        seenIds.add(p.id);
        products.push({
          id: p.id,
          title: p.title,
          handle: p.handle,
          vendor: p.vendor || "",
          product_type: p.product_type || "",
          tags: Array.isArray(p.tags)
            ? p.tags
            : typeof p.tags === "string"
              ? p.tags.split(",").map((t) => t.trim()).filter(Boolean)
              : [],
          body_html: p.body_html || "",
          published_at: p.published_at || null,
          created_at: p.created_at || null,
          updated_at: p.updated_at || null,
          options: Array.isArray(p.options) ? p.options : [],
          variants: (p.variants || []).map((v, idx) => ({
            id: v.id,
            title: v.title,
            option1: v.option1,
            sku: v.sku || null,
            price: v.price,
            compare_at_price: v.compare_at_price || null,
            position: v.position ?? idx + 1,
            available: v.available,
            featured_image: v.featured_image?.src ? { src: v.featured_image.src } : null,
          })),
          images: (p.images || [])
            .filter((im) => im && im.src)
            .map((im) => ({
              id: im.id,
              src: im.src,
              alt: im.alt || null,
            })),
          source_url: `${baseUrl}/products/${p.handle}`,
        });
      }

      if (page % 5 === 0 || list.length < 250) {
        console.log(`[${siteKey}] page ${page}: +${list.length} (total ${products.length})`);
      }
      if (list.length < 250) break;
      await sleep(250);
    } catch (err) {
      failedUrls.push({ url, error: String(err) });
      console.error(`[${siteKey}] failed on page ${page}:`, String(err));
      break;
    }
  }

  return {
    source: siteKey,
    baseUrl,
    count: products.length,
    failedUrls,
    products,
  };
}

async function main() {
  console.log("Fetching all products + images from FridayCharm, Perfume Palace & Belvish...");
  const [fc, pp, bv] = await Promise.all([
    scrapeShopifySite("fridaycharm", "https://www.fridaycharm.com"),
    scrapeShopifySite("perfumepalace", "https://perfumepalace.in"),
    scrapeShopifySite("belvish", "https://belvish.com"),
  ]);

  const payload = {
    extractedAt: new Date().toISOString(),
    fridaycharm: fc,
    perfumepalace: pp,
    belvish: bv,
  };

  fs.mkdirSync(path.dirname(CACHE_OUT), { recursive: true });
  fs.writeFileSync(CACHE_OUT, JSON.stringify(payload));
  console.log("Saved full cache to", CACHE_OUT);
  console.log("Summary:", {
    fridaycharm: fc.count,
    fcFailed: fc.failedUrls.length,
    perfumepalace: pp.count,
    ppFailed: pp.failedUrls.length,
    belvish: bv.count,
    bvFailed: bv.failedUrls.length,
  });
}

main();

