import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const SCRATCH_RAW_CACHE =
  process.env.PP_BELVISH_CACHE ||
  path.join(rootDir, "scripts", "catalog-enrichment", ".cache_raw_sources.json");

const PROVENANCE_OUT = path.join(rootDir, "lib", "data", "enrichment_provenance.json");
const REPORT_OUT = path.join(rootDir, "lib", "data", "enrichment_report.json");
const COMPETITOR_RESEARCH_OUT = path.join(
  rootDir,
  "scripts",
  "catalog-enrichment",
  "competitor_research_staging.json"
);

const REUSE_CACHE = process.argv.includes("--reuse-cache");
const USER_AGENT = "OctopusPerfumesCatalogSync/1.0 (+https://www.octopusperfume.in)";
const SLEEP_MS = 280;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const KNOWN_HOUSES = [
  "Octopus Perfumes by Harsh Beniwal",
  "Parfums de Marly",
  "Jean Paul Gaultier",
  "Giorgio Armani",
  "Emporio Armani",
  "Yves Saint Laurent",
  "Carolina Herrera",
  "Dolce & Gabbana",
  "Acqua di Parma",
  "Christian Dior",
  "Maison Alhambra",
  "French Avenue",
  "Ahmed Al Maghribi",
  "Swiss Arabian",
  "Al Haramain",
  "Fragrance World",
  "Ibraheem al Qurashi",
  "Arabiyat Prestige",
  "Thomas Kosmala",
  "Narciso Rodriguez",
  "Salvatore Ferragamo",
  "Mercedes Benz",
  "Paco Rabanne",
  "Calvin Klein",
  "Hugo Boss",
  "Tom Ford",
  "Paris Corner",
  "BDK Parfums",
  "Maison Crivelli",
  "Maison Margiela",
  "Etat Libre d'Orange",
  "Memo Paris",
  "Orto Parisi",
  "Goutal Paris",
  "Ralph Lauren",
  "Marc Jacobs",
  "Viktor & Rolf",
  "Michael Kors",
  "Jimmy Choo",
  "Estee Lauder",
  "Elizabeth Arden",
  "Issey Miyake",
  "John Varvatos",
  "Kenneth Cole",
  "Roberto Cavalli",
  "Tommy Hilfiger",
  "United Colors of Benetton",
  "Sarah Jessica Parker",
  "Lolita Lempicka",
  "David Beckham",
  "Thierry Mugler",
  "Franck Boclet",
  "Franck Olivier",
  "Dumont Paris",
  "Reyane Tradition",
  "Jacques Bogart",
  "Costume National",
  "Lattafa",
  "Rasasi",
  "Afnan",
  "Armaf",
  "Ajmal",
  "Arabiyat",
  "Khadlaj",
  "Rayhaan",
  "Zimaya",
  "RiiFFS",
  "Nusuk",
  "Rue Broca",
  "Maison Asrar",
  "Al Wataniah",
  "Dior",
  "Chanel",
  "Versace",
  "Guerlain",
  "Hermes",
  "Burberry",
  "Bvlgari",
  "Creed",
  "Xerjoff",
  "Amouage",
  "Nishane",
  "Initio",
  "Mancera",
  "Montale",
  "Byredo",
  "Kilian",
  "Prada",
  "Gucci",
  "Givenchy",
  "Cartier",
  "Chopard",
  "Azzaro",
  "Davidoff",
  "Bentley",
  "Boucheron",
  "Lacoste",
  "Lalique",
  "Lancome",
  "Montblanc",
  "Mont Blanc",
  "Moschino",
  "Miu Miu",
  "Missoni",
  "Nasomatto",
  "Nautica",
  "Valentino",
  "Kenzo",
  "Clinique",
  "Coach",
  "Dunhill",
  "Jaguar",
  "Police",
  "Rochas",
  "Titan",
  "DKNY",
  "Elie Saab",
  "Ex Nihilo",
  "Casamorati",
  "Mykonos",
];

const HOUSE_ALIASES = {
  "christian dior": "dior",
  "im rasasi": "rasasi",
  "rasasi perfumes": "rasasi",
  "lattafa perfumes": "lattafa",
  "mont blanc": "montblanc",
  "bvlagri": "bvlgari",
  "yves saint laurent": "ysl",
  "dolce & gabbana": "d&g",
  "dolce and gabbana": "d&g",
  "jean paul gaultier": "jpg",
  "calvin klein": "ck",
  "giorgio armani": "armani",
  "emporio armani": "armani",
  "carolina herrera": "carolina herrera",
  "parfums de marly": "pdm",
  "paco rabanne": "rabanne",
};

async function fetchWithRetry(url, expectJson = true, attempts = 3) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return expectJson ? await res.json() : await res.text();
    } catch (err) {
      lastErr = err;
      await sleep(i * 600);
    }
  }
  throw lastErr;
}

function decodeHtml(str = "") {
  return String(str)
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&rsquo;/gi, "’")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNoteTokens(raw) {
  const txt = decodeHtml(raw)
    .replace(/[\[\]()]/g, "")
    .trim();
  if (!txt) return [];
  return Array.from(
    new Set(
      txt
        .split(/,|•|&|\band\b|\|/i)
        .map((s) => s.replace(/^[\s\-:;]+|[\s\-:;.]+$/g, "").trim())
        .filter((s) => s.length >= 2 && s.length <= 40)
    )
  ).slice(0, 10);
}

function extractStructuredNotes(bodyHtml = "") {
  if (!bodyHtml) return null;
  const top = [];
  const heart = [];
  const base = [];

  // Pattern A: Belvish / PerfumePalace <p>/<strong>/<td> lines ("Top Notes:", "Top Notes -", "Middle Notes:", "Heart Notes:", "Base Notes:")
  const cleanLines = String(bodyHtml)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .split(/\n+/);

  for (const line of cleanLines) {
    const t = line.trim();
    const mTop = t.match(/^(?:top|head|opening)\s*notes?\s*[:\-–—]\s*(.+)$/i);
    if (mTop) top.push(...parseNoteTokens(mTop[1]));

    const mHeart = t.match(/^(?:heart|middle)\s*notes?\s*[:\-–—]\s*(.+)$/i);
    if (mHeart) heart.push(...parseNoteTokens(mHeart[1]));

    const mBase = t.match(/^(?:base|dry\s*down)\s*notes?\s*[:\-–—]\s*(.+)$/i);
    if (mBase) base.push(...parseNoteTokens(mBase[1]));
  }

  // Pattern B: Notino-style table headings <h4>Top notes</h4> ... <td>...</td>
  const headingTableRegex =
    /<h[1-6][^>]*>[\s\S]*?(Top|Middle|Heart|Base)\s*notes?[\s\S]*?<\/h[1-6]>[\s\S]{0,400}?<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = headingTableRegex.exec(bodyHtml)) !== null) {
    const k = m[1].toLowerCase();
    const list = parseNoteTokens(m[2]);
    if (k === "top") top.push(...list);
    else if (k === "middle" || k === "heart") heart.push(...list);
    else base.push(...list);
  }

  const dedup = (a) => Array.from(new Set(a)).slice(0, 10);
  const fTop = dedup(top);
  const fHeart = dedup(heart);
  const fBase = dedup(base);

  if (fTop.length === 0 && fHeart.length === 0 && fBase.length === 0) return null;
  return { top: fTop, heart: fHeart, base: fBase };
}

function resolveHouseBrand(vendor = "", title = "") {
  const cleanVendor = String(vendor || "").trim();
  const titleLower = String(title || "").toLowerCase();
  const genericStoreVendors = new Set([
    "",
    "belvish",
    "perfumepalace",
    "perfume palace",
    "perfume network india",
    "octopus",
    "unknown",
  ]);

  if (!genericStoreVendors.has(cleanVendor.toLowerCase())) {
    const alias = HOUSE_ALIASES[cleanVendor.toLowerCase()];
    return alias || cleanVendor.toLowerCase();
  }

  for (const h of KNOWN_HOUSES) {
    const low = h.toLowerCase();
    if (titleLower.includes(low)) {
      return HOUSE_ALIASES[low] || low;
    }
  }
  return cleanVendor.toLowerCase();
}

function detectConcentration(text = "") {
  const t = text.toLowerCase();
  if (/\bextrait de parfum\b|\bextrait\b/.test(t)) return "extrait";
  if (/\beau de parfum\b|\bedp\b/.test(t)) return "edp";
  if (/\beau de toilette\b|\bedt\b/.test(t)) return "edt";
  if (/\beau de cologne\b|\bedc\b/.test(t)) return "edc";
  if (/\belixir\b/.test(t)) return "elixir";
  if (/\ble parfum\b|\bparfum\b/.test(t)) return "parfum";
  if (/\battar\b|\boil\b/.test(t)) return "attar";
  if (/\bdeodorant\b|\bdeo\b/.test(t)) return "deo";
  if (/\bbody mist\b|\bmist\b/.test(t)) return "mist";
  if (/\baftershave\b|\bafter shave\b/.test(t)) return "aftershave";
  return "";
}

function detectFormat(title = "", variants = []) {
  const t = `${title} ${variants.map((v) => v.title || "").join(" ")}`.toLowerCase();
  if (/\bdecant\b/.test(t)) return "decant";
  if (/\bsample\b|\bvial\b|\btesting\b/.test(t)) return "sample";
  if (/\bminiature\b|\bmini\b|\bdab\b/.test(t)) return "miniature";
  if (/\bgift set\b|\bcoffret\b|\b3pcs\b|\b2pcs\b|\bduo\b|\bcombo\b/.test(t)) return "giftset";
  if (/\btravel spray\b|\brefill\b/.test(t)) return "travel";
  if (/\bdeodorant\b|\bdeo\b/.test(t)) return "deo";
  return "bottle";
}

function detectPrimarySizeMl(title = "", variants = []) {
  const strs = [title, ...variants.map((v) => `${v.title || ""} ${v.option1 || ""}`)];
  const mls = [];
  for (const s of strs) {
    const m = String(s).match(/(\d+(?:\.\d+)?)\s*ml\b/i);
    if (m) mls.push(parseFloat(m[1]));
  }
  return mls.length > 0 ? Math.max(...mls) : null;
}

function detectGender(text = "") {
  const t = text.toLowerCase();
  if (/\bmen & women\b|\bunisex\b|\bfor women and men\b/.test(t)) return "unisex";
  if (/\bfor women\b|\bpour femme\b|\bwomen\b|\bfemme\b/.test(t)) return "women";
  if (/\bfor men\b|\bpour homme\b|\bmen\b|\bhomme\b/.test(t)) return "men";
  return "";
}

function canonicalCoreName(title = "", house = "") {
  let s = String(title || "").toLowerCase();
  if (house) {
    s = s.replace(new RegExp(`\\b${house.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), " ");
  }
  for (const h of Object.keys(HOUSE_ALIASES)) {
    s = s.replace(new RegExp(`\\b${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), " ");
  }
  s = s
    .replace(/\beau de parfum\b|\beau de toilette\b|\beau de cologne\b|\bextrait de parfum\b|\ble parfum\b|\bparfum\b|\bedp\b|\bedt\b|\bedc\b|\bextrait\b/g, " ")
    .replace(/\bfor men & women\b|\bfor women and men\b|\bfor men\b|\bfor women\b|\bunisex\b|\bpour homme\b|\bpour femme\b/g, " ")
    .replace(/\b\d+(?:\.\d+)?\s*ml\b/g, " ")
    .replace(/\b(perfume|cologne|fragrance|spray|original|authentic|tester|decant|vial|sample|miniature|mini|dab|by|the|in|india)\b/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

function tokenSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const setA = new Set(a.split(" ").filter(Boolean));
  const setB = new Set(b.split(" ").filter(Boolean));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const tok of setA) {
    if (setB.has(tok)) intersection++;
  }
  return (2 * intersection) / (setA.size + setB.size);
}

function buildFeatureProfile(raw) {
  const brand = resolveHouseBrand(raw.vendor, raw.title);
  const conc =
    detectConcentration(raw.title) || detectConcentration(raw.product_type || "");
  const format = detectFormat(raw.title, raw.variants || []);
  const sizeMl = detectPrimarySizeMl(raw.title, raw.variants || []);
  const gender = detectGender(`${raw.title} ${(raw.tags || []).join(" ")}`);
  const core = canonicalCoreName(raw.title, brand);
  const skus = (raw.variants || [])
    .map((v) => String(v.sku || "").trim().toLowerCase())
    .filter((s) => s.length >= 3);
  return { brand, conc, format, sizeMl, gender, core, skus };
}

function computeMatchScore(localProf, candProf, localRaw, candRaw) {
  // Level 1: Exact identifiers (SKU / identical canonical handle)
  if (candProf.skus.some((s) => localProf.skus.includes(s))) {
    return { confidence: 100, reason: "Exact SKU match" };
  }
  if (localRaw.handle === candRaw.handle && candRaw.handle.length > 5) {
    return { confidence: 99, reason: "Exact canonical handle match" };
  }

  // Reject contradictory house brands if both known
  if (localProf.brand && candProf.brand && localProf.brand !== candProf.brand) {
    return { confidence: 0, reason: "Brand mismatch" };
  }

  // Reject format collisions (10ml sample/decant vs 100ml full bottle, or Gift Set vs bottle)
  if (localProf.format !== candProf.format) {
    return { confidence: 18, reason: `Format mismatch (${localProf.format} vs ${candProf.format})` };
  }

  // Contradictory concentration never auto-merges (e.g. EDP vs EDT)
  if (localProf.conc && candProf.conc && localProf.conc !== candProf.conc) {
    return {
      confidence: 65,
      reason: `Contradictory concentration (${localProf.conc} vs ${candProf.conc})`,
    };
  }

  // Contradictory gender target never auto-merges
  if (localProf.gender && candProf.gender && localProf.gender !== candProf.gender) {
    return {
      confidence: 68,
      reason: `Contradictory gender (${localProf.gender} vs ${candProf.gender})`,
    };
  }

  // Level 2 & 3: Normalized core token similarity
  const sim = tokenSimilarity(localProf.core, candProf.core);
  if (sim < 0.72) {
    return { confidence: Math.round(sim * 60), reason: "Low fragrance name similarity" };
  }

  let score = Math.round(sim * 78);

  if (localProf.brand && candProf.brand && localProf.brand === candProf.brand) {
    score += 12;
  }

  if (localProf.conc && candProf.conc && localProf.conc === candProf.conc) {
    score += 7;
  } else {
    score += 2;
  }

  // Variant Size check (do NOT auto-merge e.g. 30ml vs 100ml!)
  if (localProf.sizeMl && candProf.sizeMl) {
    if (Math.abs(localProf.sizeMl - candProf.sizeMl) <= 1) score += 5;
    else {
      return {
        confidence: Math.min(82, score),
        reason: `Different bottle size (${localProf.sizeMl}ml vs ${candProf.sizeMl}ml)`,
      };
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));
  return {
    confidence: finalScore,
    reason:
      finalScore >= 98
        ? "Verified multi-attribute exact match"
        : finalScore >= 90
          ? "Strong fragrance + house + concentration + size match"
          : finalScore >= 75
            ? "Partial name overlap (requires manual verification)"
            : "Insufficient match",
  };
}

async function scrapeSource(siteKey, baseUrl) {
  const result = {
    source: siteKey,
    baseUrl,
    robotsChecked: false,
    sitemapChildren: [],
    collectionsCount: 0,
    products: [],
    failedUrls: [],
  };

  try {
    await fetchWithRetry(`${baseUrl}/robots.txt`, false, 2);
    result.robotsChecked = true;
  } catch (err) {
    result.failedUrls.push({ url: `${baseUrl}/robots.txt`, error: String(err) });
  }

  try {
    const xml = await fetchWithRetry(`${baseUrl}/sitemap.xml`, false, 2);
    result.sitemapChildren = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch (err) {
    result.failedUrls.push({ url: `${baseUrl}/sitemap.xml`, error: String(err) });
  }

  try {
    const colData = await fetchWithRetry(`${baseUrl}/collections.json?limit=250`, true, 2);
    result.collectionsCount = Array.isArray(colData.collections) ? colData.collections.length : 0;
  } catch {
    // Non-fatal
  }

  const seenIds = new Set();
  for (let page = 1; page <= 80; page++) {
    const url = `${baseUrl}/products.json?limit=250&page=${page}`;
    try {
      const json = await fetchWithRetry(url, true, 3);
      const list = Array.isArray(json.products) ? json.products : [];
      if (list.length === 0) break;

      for (const p of list) {
        if (!p || !p.handle || seenIds.has(p.id)) continue;
        seenIds.add(p.id);
        result.products.push({
          id: p.id,
          title: p.title,
          handle: p.handle,
          vendor: p.vendor || "",
          product_type: p.product_type || "",
          tags: Array.isArray(p.tags)
            ? p.tags
            : typeof p.tags === "string"
              ? p.tags.split(",").map((t) => t.trim())
              : [],
          body_html: p.body_html || "",
          variants: (p.variants || []).map((v) => ({
            id: v.id,
            title: v.title,
            option1: v.option1,
            sku: v.sku,
            price: v.price,
            compare_at_price: v.compare_at_price,
            available: v.available,
          })),
          imagesCount: Array.isArray(p.images) ? p.images.length : 0,
          source_url: `${baseUrl}/products/${p.handle}`,
        });
      }

      if (list.length < 250) break;
      await sleep(SLEEP_MS);
    } catch (err) {
      result.failedUrls.push({ url, error: String(err) });
      break;
    }
  }

  return result;
}

async function main() {
  let rawCache = null;

  if (REUSE_CACHE && fs.existsSync(SCRATCH_RAW_CACHE)) {
    rawCache = JSON.parse(fs.readFileSync(SCRATCH_RAW_CACHE, "utf8"));
    console.log("Loaded checkpoint cache:", SCRATCH_RAW_CACHE);
  } else {
    console.log("Fetching Perfume Palace (perfumepalace.in) & Belvish (belvish.com)...");
    const [ppData, bvData] = await Promise.all([
      scrapeSource("perfumepalace", "https://perfumepalace.in"),
      scrapeSource("belvish", "https://belvish.com"),
    ]);
    rawCache = {
      extractedAt: new Date().toISOString(),
      perfumepalace: ppData,
      belvish: bvData,
    };
    fs.mkdirSync(path.dirname(SCRATCH_RAW_CACHE), { recursive: true });
    fs.writeFileSync(SCRATCH_RAW_CACHE, JSON.stringify(rawCache));
    console.log(
      `Extracted Perfume Palace: ${ppData.products.length}, Belvish: ${bvData.products.length}`
    );
  }

  // Audit Local Inventory (strictly read-only on products.json!)
  const localRaw = JSON.parse(
    fs.readFileSync(path.join(rootDir, "lib", "data", "products.json"), "utf8")
  );
  const localPerfumes = localRaw.filter((p) =>
    /^(Perfume|Perfume & Cologne|perf)$/i.test(p.product_type || "")
  );

  // Detect any pre-existing internal catalog overlaps for audit visibility
  const localIndex = localPerfumes.map((p) => ({
    raw: p,
    prof: buildFeatureProfile(p),
    hasLocalNotes: extractStructuredNotes(p.body_html) !== null,
  }));

  // Index by brand to keep matching O(N * brand_bucket) ultra-fast
  const byBrand = new Map();
  for (const item of localIndex) {
    const key = item.prof.brand || "_unknown";
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key).push(item);
  }

  // Load previous enrichment provenance for idempotency check
  const prevProvenance = fs.existsSync(PROVENANCE_OUT)
    ? JSON.parse(fs.readFileSync(PROVENANCE_OUT, "utf8"))
    : {};
  const nextProvenance = { ...prevProvenance };

  const allCandidates = [
    ...rawCache.perfumepalace.products.map((p) => ({ ...p, source_name: "perfumepalace.in" })),
    ...rawCache.belvish.products.map((p) => ({ ...p, source_name: "belvish.com" })),
  ];

  // Deduplicate across both competitor sources by normalized brand+core+conc+format+size
  const uniqueCompetitorMap = new Map();
  let missingImagesCount = 0;
  let incompleteAttributesCount = 0;

  for (const c of allCandidates) {
    if (!c.title || !c.variants?.length) {
      incompleteAttributesCount++;
    }
    if (c.imagesCount === 0) missingImagesCount++;

    const prof = buildFeatureProfile(c);
    const dedupKey = `${prof.brand}|${prof.core}|${prof.conc}|${prof.format}|${prof.sizeMl || ""}`;
    const existing = uniqueCompetitorMap.get(dedupKey);
    const notes = extractStructuredNotes(c.body_html);
    if (!existing) {
      uniqueCompetitorMap.set(dedupKey, { ...c, prof, notes });
    } else if (!existing.notes && notes) {
      // Upgrade note richness across the two competitor records without duplicating
      uniqueCompetitorMap.set(dedupKey, { ...c, prof, notes });
    }
  }

  const stats = {
    runAt: new Date().toISOString(),
    discoveredFromPerfumePalace: rawCache.perfumepalace.products.length,
    discoveredFromBelvish: rawCache.belvish.products.length,
    totalDiscoveredRaw: allCandidates.length,
    totalUniqueAcrossBoth: uniqueCompetitorMap.size,
    localExistingProducts: localRaw.length,
    localExistingPerfumes: localPerfumes.length,
    existingMatchedSkippedDuplicate: 0,
    existingProductsEnrichedTotal: 0,
    newlyEnrichedThisRun: 0,
    existingVariantsDetected: 0,
    possibleDuplicatesForReview: 0,
    newCompetitorProductsResearchedNotAutoSellable: 0,
    invalidProductsSkipped: 0,
    competitorMissingImages: missingImagesCount,
    competitorIncompleteAttributes: incompleteAttributesCount,
    failedUrls: [
      ...rawCache.perfumepalace.failedUrls,
      ...rawCache.belvish.failedUrls,
    ],
  };

  const duplicateReportRows = [];
  const competitorResearchStaging = [];
  const manualReviewQueue = [];

  for (const cand of uniqueCompetitorMap.values()) {
    if (!cand.title || !cand.handle || !cand.variants || cand.variants.length === 0) {
      stats.invalidProductsSkipped++;
      continue;
    }

    // Search same-brand bucket + fallback unknown bucket
    const pool = [
      ...(byBrand.get(cand.prof.brand) || []),
      ...(cand.prof.brand ? [] : localIndex),
    ];

    let bestMatch = null;
    let bestScore = { confidence: 0, reason: "No match" };

    for (const local of pool) {
      const res = computeMatchScore(local.prof, cand.prof, local.raw, cand);
      if (res.confidence > bestScore.confidence) {
        bestScore = res;
        bestMatch = local;
      }
    }

    if (bestMatch && bestScore.confidence >= 90) {
      stats.existingMatchedSkippedDuplicate++;
      const handle = bestMatch.raw.handle;
      let decision = "EXISTING_PRODUCT";

      if (!bestMatch.hasLocalNotes && cand.notes) {
        decision = "EXISTING_PRODUCT_ENRICHMENT";
        if (!nextProvenance[handle]) {
          stats.newlyEnrichedThisRun++;
        }
        nextProvenance[handle] = {
          source_name: cand.source_name,
          source_url: cand.source_url,
          source_product_id: String(cand.id),
          extracted_at: rawCache.extractedAt,
          matching_confidence: bestScore.confidence,
          notes: cand.notes,
          inferred_concentration: cand.prof.conc || undefined,
          inferred_gender: cand.prof.gender || undefined,
        };
      }

      if (duplicateReportRows.length < 150) {
        duplicateReportRows.push({
          existingProduct: bestMatch.raw.title,
          existingHandle: handle,
          sourceProduct: `${cand.title} (${cand.source_name})`,
          confidence: `${bestScore.confidence}%`,
          decision:
            decision === "EXISTING_PRODUCT_ENRICHMENT"
              ? "Existing product, enriched missing notes"
              : "Existing product, skipped duplicate",
        });
      }
    } else if (bestMatch && bestScore.confidence >= 75) {
      // Check if distinct size variant of same perfume name vs ambiguous possible duplicate
      const sameCore = tokenSimilarity(bestMatch.prof.core, cand.prof.core) >= 0.9;
      if (sameCore && bestMatch.prof.sizeMl && cand.prof.sizeMl && bestMatch.prof.sizeMl !== cand.prof.sizeMl) {
        stats.existingVariantsDetected++;
      } else {
        stats.possibleDuplicatesForReview++;
      }
      if (manualReviewQueue.length < 100) {
        manualReviewQueue.push({
          existingProduct: bestMatch.raw.title,
          sourceProduct: `${cand.title} (${cand.source_name})`,
          confidence: `${bestScore.confidence}%`,
          reason: bestScore.reason,
          decision: "Review (not auto-merged)",
        });
      }
      if (duplicateReportRows.length < 200) {
        duplicateReportRows.push({
          existingProduct: bestMatch.raw.title,
          existingHandle: bestMatch.raw.handle,
          sourceProduct: `${cand.title} (${cand.source_name})`,
          confidence: `${bestScore.confidence}%`,
          decision: "Possible duplicate / Review",
        });
      }
    } else {
      stats.newCompetitorProductsResearchedNotAutoSellable++;
      competitorResearchStaging.push({
        source_name: cand.source_name,
        source_url: cand.source_url,
        source_product_id: String(cand.id),
        title: cand.title,
        brand_inferred: cand.prof.brand || cand.vendor,
        concentration: cand.prof.conc || null,
        format: cand.prof.format,
        size_ml: cand.prof.sizeMl,
        gender: cand.prof.gender || null,
        source_price: cand.variants?.[0]?.price || null,
        source_availability: cand.variants?.some((v) => v.available) || false,
        notes: cand.notes,
        extracted_at: rawCache.extractedAt,
        extraction_status: "research_only_not_stocked",
        matching_confidence: bestScore.confidence,
        data_provenance: "competitor_research_separated_from_inventory",
      });

      if (duplicateReportRows.length < 220) {
        duplicateReportRows.push({
          existingProduct: "No match",
          existingHandle: null,
          sourceProduct: `${cand.title} (${cand.source_name})`,
          confidence: "100% distinct",
          decision: "New candidate (research staging only — unstocked)",
        });
      }
    }
  }

  stats.existingProductsEnrichedTotal = Object.keys(nextProvenance).length;

  // Deterministic write for idempotency check
  const nextProvJson = JSON.stringify(nextProvenance, null, 2);
  fs.writeFileSync(PROVENANCE_OUT, nextProvJson);
  fs.writeFileSync(
    COMPETITOR_RESEARCH_OUT,
    JSON.stringify(
      {
        note: "Strictly separated competitor research records. Never auto-published to live storefront checkout.",
        totalCount: competitorResearchStaging.length,
        manualReviewSample: manualReviewQueue,
        items: competitorResearchStaging,
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    REPORT_OUT,
    JSON.stringify(
      {
        stats,
        sampleReportRows: duplicateReportRows.slice(0, 60),
      },
      null,
      2
    )
  );

  console.log("=== IMPORT & DEDUPLICATION COMPLETE ===");
  console.log(JSON.stringify(stats, null, 2));
}

main();

