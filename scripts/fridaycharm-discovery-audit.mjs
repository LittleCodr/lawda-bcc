import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const REPORT_PATH =
  process.argv[2] ||
  path.join(rootDir, "scripts", "fridaycharm-discovery-report.json");

const SLEEP_MS = 350;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "OctopusCatalogResearchBot/1.0 (+https://www.octopusperfume.in)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "OctopusCatalogResearchBot/1.0 (+https://www.octopusperfume.in)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.text();
}

async function main() {
  let state = {
    startedAt: new Date().toISOString(),
    completedPages: [],
    discoveredHandles: {},
    vendors: {},
    productTypes: {},
    failedUrls: [],
    missingImagesCount: 0,
    incompleteAttributesCount: 0,
    duplicateRecords: 0,
    sitemapUrls: [],
    collectionsCount: 0,
  };

  if (fs.existsSync(REPORT_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
      if (prev && Array.isArray(prev.completedPages)) {
        state = prev;
        console.log(`Resuming discovery from page ${state.completedPages.length + 1}`);
      }
    } catch {
      // Start fresh on corrupt checkpoint
    }
  }

  // 1. Inspect public sitemap index
  if (state.sitemapUrls.length === 0) {
    try {
      const xml = await fetchText("https://www.fridaycharm.com/sitemap.xml");
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      state.sitemapUrls = locs;
      const colSitemap = locs.find((u) => u.includes("sitemap_collections"));
      if (colSitemap) {
        const colXml = await fetchText(colSitemap);
        const colLocs = [...colXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        state.collectionsCount = colLocs.length;
      }
    } catch (err) {
      state.failedUrls.push({ url: "https://www.fridaycharm.com/sitemap.xml", error: String(err) });
    }
  }

  // 2. Paginate public products.json checkpoint-resumably up to 12 pages (3000 items max safety cap)
  for (let page = 1; page <= 12; page++) {
    if (state.completedPages.includes(page)) continue;
    const url = `https://www.fridaycharm.com/products.json?limit=250&page=${page}`;
    try {
      const data = await fetchJson(url);
      const list = Array.isArray(data.products) ? data.products : [];
      if (list.length === 0) {
        state.completedPages.push(page);
        break;
      }

      for (const item of list) {
        const handle = String(item.handle || "").trim();
        if (!handle) continue;
        if (state.discoveredHandles[handle]) {
          state.duplicateRecords += 1;
          continue;
        }
        const vendor = String(item.vendor || "Unknown").trim();
        const ptype = String(item.product_type || "Uncategorized").trim();
        state.vendors[vendor] = (state.vendors[vendor] || 0) + 1;
        state.productTypes[ptype] = (state.productTypes[ptype] || 0) + 1;

        if (!Array.isArray(item.images) || item.images.length === 0) {
          state.missingImagesCount += 1;
        }
        if (!item.body_html || !Array.isArray(item.variants) || item.variants.length === 0) {
          state.incompleteAttributesCount += 1;
        }

        state.discoveredHandles[handle] = {
          id: item.id,
          vendor,
          product_type: ptype,
          title: item.title,
        };
      }

      state.completedPages.push(page);
      fs.writeFileSync(REPORT_PATH, JSON.stringify(state, null, 2));
      if (list.length < 250) break;
      await sleep(SLEEP_MS);
    } catch (err) {
      state.failedUrls.push({ url, error: String(err) });
      fs.writeFileSync(REPORT_PATH, JSON.stringify(state, null, 2));
      break;
    }
  }

  // 3. Reconcile against Octopus Verified Inventory without mutating stocked products
  const localRaw = JSON.parse(
    fs.readFileSync(path.join(rootDir, "lib", "data", "products.json"), "utf8")
  );
  const localHandles = new Set(localRaw.map((p) => p.handle));
  const localVendors = new Set(
    localRaw
      .filter((p) => /^(Perfume|Perfume & Cologne|perf)$/i.test(p.product_type || ""))
      .map((p) => (p.vendor || "").trim().toLowerCase())
  );

  const fcHandles = Object.keys(state.discoveredHandles);
  const fcVendors = Object.keys(state.vendors);
  const overlapHandles = fcHandles.filter((h) => localHandles.has(h)).length;
  const overlapVendors = fcVendors.filter((v) => localVendors.has(v.toLowerCase())).length;

  const summary = {
    finishedAt: new Date().toISOString(),
    discoveredProductsCount: fcHandles.length,
    discoveredVendorsCount: fcVendors.length,
    discoveredCollectionsCount: state.collectionsCount,
    sitemapChildrenCount: state.sitemapUrls.length,
    missingImagesCount: state.missingImagesCount,
    incompleteAttributesCount: state.incompleteAttributesCount,
    duplicateRecords: state.duplicateRecords,
    failedUrlsCount: state.failedUrls.length,
    localVerifiedTotalProducts: localRaw.length,
    localVerifiedPerfumes: localRaw.filter((p) =>
      /^(Perfume|Perfume & Cologne|perf)$/i.test(p.product_type || "")
    ).length,
    overlapHandles,
    overlapVendors,
    unstockedCompetitorItemsSkipped: fcHandles.length - overlapHandles,
  };

  state.summary = summary;
  fs.writeFileSync(REPORT_PATH, JSON.stringify(state, null, 2));
  console.log("=== CATALOGUE DISCOVERY & INVENTORY RECONCILIATION REPORT ===");
  console.log(JSON.stringify(summary, null, 2));
}

main();

