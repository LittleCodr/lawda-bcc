import fs from 'fs';
import path from 'path';

const PARENT_SITEMAP = 'https://www.perfumenetwork.in/sitemap.xml';
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'migration');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/xml,text/xml,*/*'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`[Retry ${attempt}/${retries}] Failed to fetch ${url}: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay * attempt));
    }
  }
}

function parseXmlUrls(xmlContent) {
  const urlEntries = [];
  const urlRegex = /<url>([\s\S]*?)<\/url>/g;
  let match;
  while ((match = urlRegex.exec(xmlContent)) !== null) {
    const block = match[1];
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    const changefreqMatch = block.match(/<changefreq>([^<]+)<\/changefreq>/);

    const images = [];
    const imgRegex = /<image:image>([\s\S]*?)<\/image:image>/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(block)) !== null) {
      const imgBlock = imgMatch[1];
      const imgLoc = imgBlock.match(/<image:loc>([^<]+)<\/image:loc>/);
      const imgTitle = imgBlock.match(/<image:title>([\s\S]*?)<\/image:title>/);
      const imgCaption = imgBlock.match(/<image:caption>([\s\S]*?)<\/image:caption>/);
      if (imgLoc) {
        images.push({
          loc: imgLoc[1].trim(),
          title: imgTitle ? imgTitle[1].trim() : null,
          caption: imgCaption ? imgCaption[1].trim() : null,
        });
      }
    }

    if (locMatch) {
      urlEntries.push({
        loc: locMatch[1].trim(),
        lastmod: lastmodMatch ? lastmodMatch[1].trim() : null,
        changefreq: changefreqMatch ? changefreqMatch[1].trim() : null,
        images
      });
    }
  }
  return urlEntries;
}

function parseSitemapIndex(indexXml) {
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const sitemaps = [];
  let match;
  while ((match = locRegex.exec(indexXml)) !== null) {
    sitemaps.push(match[1].trim().replace(/&amp;/g, '&'));
  }
  return sitemaps;
}

export async function runDiscovery() {
  console.log('=== PHASE A: DISCOVERY & SITEMAP INVENTORY ===');
  console.log(`Fetching parent sitemap index: ${PARENT_SITEMAP}`);
  const parentXml = await fetchWithRetry(PARENT_SITEMAP);
  const childSitemaps = parseSitemapIndex(parentXml);
  console.log(`Discovered ${childSitemaps.length} child sitemaps in index:`);
  childSitemaps.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));

  const inventory = {
    discoveredAt: new Date().toISOString(),
    parentSitemap: PARENT_SITEMAP,
    sitemaps: [],
    categories: {
      products: [],
      collections: [],
      pages: [],
      blogs: [],
      articles: [],
      agentic_discovery: [],
      other: []
    },
    uniqueCounts: {}
  };

  const allProductUrlsMap = new Map();
  const allImagesMap = new Map();

  for (const sitemapUrl of childSitemaps) {
    console.log(`\nProcessing sitemap: ${sitemapUrl}`);
    try {
      const xml = await fetchWithRetry(sitemapUrl);
      const entries = parseXmlUrls(xml);
      console.log(`  Found ${entries.length} URL entries in ${sitemapUrl.split('/').pop()}`);

      const sitemapRecord = {
        url: sitemapUrl,
        status: 200,
        entriesCount: entries.length,
        imagesCount: entries.reduce((acc, e) => acc + e.images.length, 0),
      };
      inventory.sitemaps.push(sitemapRecord);

      for (const entry of entries) {
        const u = entry.loc;
        if (u.includes('/products/')) {
          inventory.categories.products.push(entry);
          if (!allProductUrlsMap.has(u)) {
            allProductUrlsMap.set(u, entry);
          }
          entry.images.forEach(img => {
            if (!allImagesMap.has(img.loc)) {
              allImagesMap.set(img.loc, { ...img, productUrl: u });
            }
          });
        } else if (u.includes('/collections/')) {
          inventory.categories.collections.push(entry);
        } else if (u.includes('/pages/')) {
          inventory.categories.pages.push(entry);
        } else if (u.includes('/blogs/') && !u.match(/\/blogs\/[^\/]+\/.+/)) {
          inventory.categories.blogs.push(entry);
        } else if (u.includes('/blogs/') && u.match(/\/blogs\/[^\/]+\/.+/)) {
          inventory.categories.articles.push(entry);
        } else if (u.endsWith('agents.md') || sitemapUrl.includes('agentic')) {
          inventory.categories.agentic_discovery.push(entry);
        } else {
          inventory.categories.other.push(entry);
        }
      }
    } catch (err) {
      console.error(`  Error processing sitemap ${sitemapUrl}: ${err.message}`);
      inventory.sitemaps.push({
        url: sitemapUrl,
        status: 'ERROR',
        error: err.message,
        entriesCount: 0,
        imagesCount: 0
      });
    }
  }

  inventory.uniqueCounts = {
    products: allProductUrlsMap.size,
    productImages: allImagesMap.size,
    collections: new Set(inventory.categories.collections.map(e => e.loc)).size,
    pages: new Set(inventory.categories.pages.map(e => e.loc)).size,
    blogs: new Set(inventory.categories.blogs.map(e => e.loc)).size,
    articles: new Set(inventory.categories.articles.map(e => e.loc)).size,
    agentic_discovery: new Set(inventory.categories.agentic_discovery.map(e => e.loc)).size,
  };

  const inventoryPath = path.join(OUTPUT_DIR, 'sitemaps_inventory.json');
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
  console.log(`\nSaved complete sitemap inventory to ${inventoryPath}`);
  console.log('=== DISCOVERY SUMMARY ===');
  console.log(`- Unique Product URLs: ${inventory.uniqueCounts.products}`);
  console.log(`- Unique Product Images (from sitemaps): ${inventory.uniqueCounts.productImages}`);
  console.log(`- Unique Collection URLs: ${inventory.uniqueCounts.collections}`);
  console.log(`- Unique Content Pages: ${inventory.uniqueCounts.pages}`);
  console.log(`- Unique Blogs: ${inventory.uniqueCounts.blogs}`);
  console.log(`- Unique Blog Articles: ${inventory.uniqueCounts.articles}`);
  console.log(`- Unique Agentic Discovery endpoints: ${inventory.uniqueCounts.agentic_discovery}`);

  return inventory;
}

if (process.argv[1]?.endsWith('discovery.mjs')) {
  runDiscovery().catch(err => {
    console.error('Discovery failed:', err);
    process.exit(1);
  });
}
