import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const LIVE_HOST = "octopusperfume.in";
const LIVE_BASE = `https://${LIVE_HOST}`;
const INDEXNOW_KEY = "1429157ab1748d9881d1cf65c013c380";
const KEY_LOCATION = `${LIVE_BASE}/${INDEXNOW_KEY}.txt`;
const BATCH_SIZE = 9500; // IndexNow max is 10,000 URLs per POST

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForKeyVerification(maxAttempts = 40) {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await fetch(KEY_LOCATION, {
        headers: { "User-Agent": "OctopusIndexNowBot/1.0" },
        redirect: "manual",
        signal: AbortSignal.timeout(10000),
      });
      const body = (await res.text()).trim();
      if (res.status === 200 && body === INDEXNOW_KEY) {
        console.log(`✅ Live key verified at ${KEY_LOCATION} (attempt ${i})`);
        return true;
      }
      console.log(`[Attempt ${i}/${maxAttempts}] Key check status=${res.status}`);
    } catch (err) {
      console.log(`[Attempt ${i}/${maxAttempts}] Key check error: ${String(err)}`);
    }
    await sleep(5000);
  }
  return false;
}

async function fetchLiveSitemapUrls() {
  const res = await fetch(`${LIVE_BASE}/sitemap.xml`, {
    headers: { "User-Agent": "OctopusIndexNowBot/1.0" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: HTTP ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1]
      .trim()
      .replace(/^https?:\/\/www\.octopusperfume\.in/i, LIVE_BASE)
  );
  return Array.from(new Set(locs));
}

async function submitIndexNowBatch(endpoint, urls, batchIdx, totalBatches) {
  const payload = {
    host: LIVE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  });
  const text = (await res.text()).trim();
  console.log(
    `[IndexNow ${batchIdx}/${totalBatches}] ${endpoint} -> HTTP ${res.status}${text ? ` | ${text.slice(0, 140)}` : ""}`
  );
  return { endpoint, status: res.status, count: urls.length, body: text.slice(0, 200) };
}

async function main() {
  const localKeyFile = path.join(rootDir, "public", `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(localKeyFile)) {
    throw new Error(`Missing local IndexNow key file: ${localKeyFile}`);
  }

  // 1. Ensure production Vercel deployment is serving the key file
  const verified = await waitForKeyVerification();
  if (!verified) {
    throw new Error(`Timed out waiting for ${KEY_LOCATION} to return HTTP 200`);
  }

  // 2. Collect all canonical URLs from live production sitemap.xml
  const allUrls = await fetchLiveSitemapUrls();
  console.log(`📦 Collected ${allUrls.length} unique URLs from ${LIVE_BASE}/sitemap.xml`);

  // 3. Submit to IndexNow in <=9,500-URL batches
  const batches = [];
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    batches.push(allUrls.slice(i, i + BATCH_SIZE));
  }

  const indexNowResults = [];
  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    // Official shared IndexNow API + direct Bing & Yandex endpoints
    for (const ep of [
      "https://api.indexnow.org/indexnow",
      "https://www.bing.com/indexnow",
      "https://yandex.com/indexnow",
    ]) {
      try {
        indexNowResults.push(await submitIndexNowBatch(ep, batch, b + 1, batches.length));
      } catch (err) {
        indexNowResults.push({ endpoint: ep, status: "ERR", count: batch.length, body: String(err) });
      }
      await sleep(400);
    }
  }

  // 4. Warm sitemaps & feed endpoints on Vercel CDN
  const warmEndpoints = [
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap_perfumes.xml",
    "/sitemap_perfumes.xml?page=1",
    "/sitemap_perfumes.xml?page=2",
    "/sitemap_perfumes.xml?page=3",
    "/sitemap_perfumes.xml?page=4",
    "/sitemap_perfumes.xml?page=5",
    "/sitemap_perfumes.xml?page=6",
    "/sitemap_brands.xml",
    "/sitemap_collections.xml",
    "/sitemap_editorial.xml",
    "/feed.xml",
  ];
  console.log("\n🔥 Warming sitemap & feed caches...");
  const warmResults = [];
  for (const p of warmEndpoints) {
    const res = await fetch(`${LIVE_BASE}${p}`, {
      headers: { "User-Agent": "OctopusIndexNowBot/1.0" },
      signal: AbortSignal.timeout(25000),
    });
    const bytes = (await res.arrayBuffer()).byteLength;
    warmResults.push({ path: p, status: res.status, bytes });
    console.log(`  ${p} -> HTTP ${res.status} (${bytes} bytes)`);
  }

  // 5. Ping WebSub / PubSubHubbub & check legacy sitemap ping endpoints transparently
  console.log("\n📡 Pinging WebSub hub & checking legacy ping endpoints...");
  try {
    const wsRes = await fetch("https://pubsubhubbub.appspot.com/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "hub.mode": "publish",
        "hub.url": `${LIVE_BASE}/feed.xml`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    console.log(`  PubSubHubbub/WebSub -> HTTP ${wsRes.status}`);
  } catch (err) {
    console.log(`  PubSubHubbub/WebSub -> ERROR: ${String(err)}`);
  }

  for (const legacyUrl of [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(`${LIVE_BASE}/sitemap.xml`)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(`${LIVE_BASE}/sitemap.xml`)}`,
  ]) {
    try {
      const r = await fetch(legacyUrl, { signal: AbortSignal.timeout(10000) });
      console.log(`  Legacy ping ${legacyUrl.split("?")[0]} -> HTTP ${r.status} (expected deprecated 404/410)`);
    } catch (err) {
      console.log(`  Legacy ping ${legacyUrl.split("?")[0]} -> ERROR: ${String(err)}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
