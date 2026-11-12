import rawProductsData from "./data/products.json";
import rawEnrichmentProvenance from "./data/enrichment_provenance.json";
import { products as flagshipCatalog, type Product as FlagshipProduct } from "./products";
import {
  formatPriceINR,
  normalizeVendorName,
  slugifyBrandName,
  type BrandSummary,
  type BrandTier,
  type CatalogFilters,
  type CollectionMeta,
  type Concentration,
  type EnrichedProduct,
  type FacetCounts,
  type FacetOption,
  type FragranceGender,
  type FragranceNotes,
  type ProductImageItem,
  type ProductSummary,
  type ProductVariantSummary,
  type SizeBucket,
  type SortKey,
} from "./catalog-types";

export {
  formatPriceINR,
  normalizeVendorName,
  slugifyBrandName,
  type BrandSummary,
  type BrandTier,
  type CatalogFilters,
  type CollectionMeta,
  type Concentration,
  type EnrichedProduct,
  type FacetCounts,
  type FacetOption,
  type FragranceGender,
  type FragranceNotes,
  type ProductImageItem,
  type ProductSummary,
  type ProductVariantSummary,
  type SizeBucket,
  type SortKey,
};

interface RawVariant {
  id?: string | number;
  title?: string | null;
  option1?: string | null;
  price?: string | number | null;
  compare_at_price?: string | number | null;
  available?: boolean;
  featured_image?: { src?: string | null } | null;
}

interface RawImage {
  id?: string | number;
  src?: string | null;
  local_src?: string | null;
  localPath?: string | null;
  alt?: string | null;
  type?: string | null;
}

interface RawProduct {
  id: string | number;
  title: string;
  handle: string;
  body_html?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  vendor?: string | null;
  product_type?: string | null;
  tags?: string[] | string | null;
  variants?: RawVariant[];
  images?: RawImage[];
}

const MIDDLE_EASTERN_BRANDS = new Set([
  "Lattafa",
  "Rasasi",
  "Afnan",
  "Armaf",
  "French Avenue",
  "Paris Corner",
  "Ahmed Al Maghribi",
  "Ajmal",
  "Swiss Arabian",
  "Al Haramain",
  "Khadlaj",
  "Arabiyat",
  "Arabiyat Prestige",
  "Rayhaan",
  "Zimaya",
  "RiiFFS",
  "Nusuk",
  "Rue Broca",
  "Maison Asrar",
  "Ibraheem al Qurashi",
  "Abdul Samad Al Qurashi",
  "Taif Al Emarat",
  "Al Wataniah",
  "Fragrance World",
  "Maison Alhambra",
  "Hamidi",
  "Khalis",
  "Naseem",
  "Albait Aldimashqi",
  "Bujairami",
  "Ard Al Zaafaran",
  "Jawhara",
  "Reef",
  "Laverne",
  "Gissah",
  "Gulf Orchid",
  "Asdaaf",
  "Anfar",
  "Al Majed Oud",
  "Arabian Oud",
  "Sapil",
  "Rave",
  "Le Chameau",
  "Emper",
  "Dumont Paris",
  "Reyane Tradition",
  "Flavia",
  "Just Jack",
  "My Perfumes",
  "Vurv",
  "Al Rehab",
  "Ministry Of Oud",
  "Nylaa By Rasasi",
]);

const NICHE_BRANDS = new Set([
  "Creed",
  "Parfums de Marly",
  "Xerjoff",
  "Memo Paris",
  "Kilian",
  "Guerlain",
  "Mancera",
  "Montale",
  "Initio",
  "Nishane",
  "Byredo",
  "BDK Parfums",
  "Casamorati",
  "Ex Nihilo",
  "Maison Crivelli",
  "Maison Francis Kurkdjian",
  "Amouage",
  "Roja Parfums",
  "Clive Christian",
  "Diptyque",
  "Le Labo",
  "Frederic Malle",
  "Tiziana Terenzi",
  "Penhaligon's",
  "Jo Malone London",
  "Boadicea the Victorious",
  "M. Micallef",
  "D.S. & Durga",
  "Goldfield & Banks",
  "Imaginary Authors",
  "Unique'e Luxury",
  "V Canto",
  "Moresque",
  "Serge Lutens",
  "Bond No. 9",
  "Histoires de Parfums",
  "Kajal",
  "State of Mind",
  "Parfums de Nicolai",
  "Atelier des Ors",
  "Essential Parfums",
  "Ormonde Jayne",
  "Juliette Has A Gun",
  "Thameen",
  "Electimuss",
  "Floris London",
  "Laurent Mazzone",
  "Giardini Di Toscana",
  "Sospiro",
  "Vertus",
  "Stephane Humbert Lucas",
  "Profumum Roma",
  "Jovoy",
  "Escentric Molecules",
  "Alexandre J",
  "Liquides Imaginaires",
  "Nasomatto",
  "Orto Parisi",
  "Thomas Kosmala",
  "Rosendo Mateu",
  "Etat Libre d’Orange",
  "Franck Boclet",
  "Goutal Paris",
  "Eight&Bob",
]);

const IN_HOUSE_BRAND = "Octopus Perfumes by Harsh Beniwal";

const BESTSELLER_TERMS = [
  "overlord",
  "paradox",
  "rhapsody",
  "your move",
  "hawas",
  "khamrah",
  "club de nuit intense",
  "9 pm",
  "9pm",
  "sauvage",
  "bleu de chanel",
  "ombre leather",
  "good girl",
  "eros",
  "le male",
  "acqua di gio",
  "aventus",
  "baccarat",
  "oud wood",
  "black orchid",
  "libre",
  "y eau de parfum",
  "bad boy",
  "light blue",
  "dylan blue",
  "cdnim",
  "modest une",
  "fattan",
  "theoreme",
  "liquid brun",
];

export function resolveImageUrl(img?: RawImage | null): string {
  if (!img) return "/placeholder.svg";
  return img.local_src || img.localPath || img.src || "/placeholder.svg";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&rsquo;/gi, "’")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rdquo;/gi, "”")
    .replace(/&ldquo;/gi, "“")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeProductHtml(html?: string | null): string {
  if (!html) return "";
  let out = html
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // Strip external competitor URLs while keeping visible anchor text cleanly
    .replace(
      /<a\b[^>]*href=["']https?:\/\/(?:www\.)?(?:perfumenetwork\.in|perfumepalace\.in|belvish\.com|fridaycharm\.com)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
      "<span>$1</span>"
    )
    // Remove generic Shopify SEO anchor noise to external sites
    .replace(/Perfume Network\s*India|Perfume\s*Palace|Friday\s*Charm|Belvish/gi, "Octopus Perfumes");

  // Drop "Please Note:" promo footer lines referencing external offers
  out = out.replace(/<p[^>]*>\s*<strong>Please Note:<\/strong>[\s\S]*?<\/p>/gi, "");
  return out.trim();
}

function parseNoteList(raw: string): string[] {
  const cleaned = decodeHtmlEntities(raw.replace(/<[^>]+>/g, " "))
    .replace(/[\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return [];
  const items = cleaned
    .split(/,|•|\band\b|\|/i)
    .map((s) => s.replace(/^[\s\-:;]+|[\s\-:;.]+$/g, "").trim())
    .filter((s) => s.length >= 2 && s.length <= 42);
  return Array.from(new Set(items)).slice(0, 10);
}

function extractNotesFromHtml(html?: string | null): FragranceNotes | null {
  if (!html) return null;

  const top: string[] = [];
  const heart: string[] = [];
  const base: string[] = [];

  // Pattern 1: Structured table headings (Top notes -> next <td>, Middle notes -> next <td>, Base notes -> next <td>)
  const headingTableRegex =
    /<h[1-6][^>]*>[\s\S]*?(Top|Middle|Heart|Base)\s*notes?[\s\S]*?<\/h[1-6]>[\s\S]{0,400}?<td[^>]*>([\s\S]*?)<\/td>/gi;
  let match: RegExpExecArray | null;
  while ((match = headingTableRegex.exec(html)) !== null) {
    const bucket = match[1].toLowerCase();
    const list = parseNoteList(match[2]);
    if (bucket === "top") top.push(...list);
    else if (bucket === "middle" || bucket === "heart") heart.push(...list);
    else if (bucket === "base") base.push(...list);
  }

  // Pattern 2: Bullet list items like <li><strong>Top Notes:</strong> ...</li> or plain "Top Notes: ..."
  const textLines = stripTags(html).split(/\n+/);
  for (const line of textLines) {
    const mTop = line.match(/^(?:top|head|opening)\s*notes?\s*[:\-–]\s*(.+)$/i);
    if (mTop && top.length === 0) top.push(...parseNoteList(mTop[1]));

    const mHeart = line.match(/^(?:heart|middle)\s*notes?\s*[:\-–]\s*(.+)$/i);
    if (mHeart && heart.length === 0) heart.push(...parseNoteList(mHeart[1]));

    const mBase = line.match(/^(?:base|dry\s*down)\s*notes?\s*[:\-–]\s*(.+)$/i);
    if (mBase && base.length === 0) base.push(...parseNoteList(mBase[1]));
  }

  const dedup = (arr: string[]) => Array.from(new Set(arr)).slice(0, 10);
  const finalTop = dedup(top);
  const finalHeart = dedup(heart);
  const finalBase = dedup(base);

  if (finalTop.length === 0 && finalHeart.length === 0 && finalBase.length === 0) {
    return null;
  }

  return {
    top: finalTop,
    heart: finalHeart,
    base: finalBase,
  };
}

function extractRegulatoryMetadata(plainText: string): {
  origin?: string;
  importer?: string;
  manufacturer?: string;
  marketedBy?: string;
} {
  const originMatch = plainText.match(/Country of Origin\s*:\s*([^\n\r]+)/i);
  const importerMatch = plainText.match(/Imported By\s*:\s*([^\n\r]+)/i);
  const manufacturerMatch = plainText.match(/Manufactured By\s*:\s*([^\n\r]+)/i);
  const marketedMatch = plainText.match(/Marketed By\s*:\s*([^\n\r]+)/i);

  return {
    origin: originMatch?.[1]?.trim(),
    importer: importerMatch?.[1]?.trim(),
    manufacturer: manufacturerMatch?.[1]?.trim(),
    marketedBy: marketedMatch?.[1]?.trim(),
  };
}

function classifyBrandTier(vendor: string, isPerfume: boolean): BrandTier {
  if (!isPerfume) return "keepsakes";
  if (vendor === IN_HOUSE_BRAND) return "in-house";
  if (vendor === "Perfume Network India") return "miniatures";
  if (MIDDLE_EASTERN_BRANDS.has(vendor)) return "middle-eastern";
  if (NICHE_BRANDS.has(vendor)) return "niche";
  return "designer";
}

function detectGender(title: string, tags: string[], plainText: string): FragranceGender {
  const t = `${title} ${tags.join(" ")}`.toLowerCase();
  if (/\bunisex\b|\bfor women and men\b|\bfor men and women\b/.test(t)) return "Unisex";
  if (/\bfor women\b|\bwomen\b|\bfemme\b|\bpour femme\b|\bmiss\b|\bgood girl\b|\bher\b/.test(t)) {
    return "Women";
  }
  if (/\bfor men\b|\bmen\b|\bhomme\b|\bpour homme\b|\badonis\b|\bhim\b/.test(t)) {
    return "Men";
  }
  if (/\bunisex\b/i.test(plainText)) return "Unisex";
  if (/\bfor women\b/i.test(plainText)) return "Women";
  if (/\bfor men\b/i.test(plainText)) return "Men";
  return "Unisex";
}

function detectConcentration(
  title: string,
  plainText: string,
  isGiftSet: boolean
): { concentration: Concentration; short: string } {
  if (isGiftSet) return { concentration: "Gift Set", short: "Gift Set" };
  const hay = `${title} ${plainText.slice(0, 400)}`.toLowerCase();
  if (/\bextrait de parfum\b|\bextrait\b/.test(hay)) {
    return { concentration: "Extrait de Parfum", short: "Extrait" };
  }
  if (/\beau de parfum\b|\bedp\b|\beu de parfum\b/.test(hay)) {
    return { concentration: "Eau de Parfum", short: "EDP" };
  }
  if (/\beau de toilette\b|\bedt\b/.test(hay)) {
    return { concentration: "Eau de Toilette", short: "EDT" };
  }
  if (/\beau de cologne\b|\bedc\b|\bcologne\b/.test(hay)) {
    return { concentration: "Eau de Cologne", short: "EDC" };
  }
  if (/\battar\b|\boil\b|\bperfume oil\b/.test(hay)) {
    return { concentration: "Attar / Oil", short: "Perfume Oil" };
  }
  if (/\bbody mist\b|\bmist\b/.test(hay)) {
    return { concentration: "Body Mist", short: "Mist" };
  }
  if (/\bparfum\b|\belixir\b|\babsolu\b|\ble parfum\b/.test(hay)) {
    return { concentration: "Parfum", short: "Parfum" };
  }
  return { concentration: "Perfume", short: "Perfume" };
}

function detectSizes(
  title: string,
  variants: RawVariant[],
  isGiftSet: boolean,
  isMiniatureTitle: boolean
): { primarySize: string; buckets: SizeBucket[]; isMiniature: boolean } {
  const buckets = new Set<SizeBucket>();
  const variantMls: number[] = [];
  const rawLabels: string[] = [];

  for (const v of variants) {
    const label = `${v.title || ""} ${v.option1 || ""}`.trim();
    if (label && label.toLowerCase() !== "default title") rawLabels.push(label);
    const m = label.match(/(\d+(?:\.\d+)?)\s*ml/i);
    if (m) variantMls.push(parseFloat(m[1]));
  }

  const titleMatch = title.match(/(\d+(?:\.\d+)?)\s*ml/i);
  if (titleMatch) variantMls.push(parseFloat(titleMatch[1]));

  const minMl = variantMls.length > 0 ? Math.min(...variantMls) : null;
  const maxMl = variantMls.length > 0 ? Math.max(...variantMls) : null;

  for (const ml of variantMls) {
    if (ml < 30) buckets.add("Miniature (<30ml)");
    else if (ml >= 28 && ml <= 35) buckets.add("30ml");
    else if (ml >= 45 && ml <= 65) buckets.add("50ml");
    else if (ml >= 70 && ml <= 90) buckets.add("75ml");
    else if (ml >= 95 && ml <= 110) buckets.add("100ml");
    else if (ml >= 115) buckets.add("125ml+");
  }

  if (isGiftSet) buckets.add("Gift Set");
  if (isMiniatureTitle) buckets.add("Miniature (<30ml)");

  let primarySize = "100ml";
  if (isGiftSet) primarySize = "Gift Set";
  else if (isMiniatureTitle && !titleMatch) primarySize = minMl ? `${minMl}ml` : "Discovery Vial";
  else if (rawLabels[0] && /\d+\s*ml/i.test(rawLabels[0])) primarySize = rawLabels[0];
  else if (titleMatch) primarySize = `${titleMatch[1]}ml`;
  else if (maxMl) primarySize = `${maxMl}ml`;

  const isMiniature =
    isMiniatureTitle ||
    (minMl !== null && minMl < 30 && !isGiftSet) ||
    /\bvial\b|\bsample\b|\bmini\b|\bminiature\b|\bsampling\b/i.test(title);

  if (isMiniature) buckets.add("Miniature (<30ml)");

  return {
    primarySize,
    buckets: Array.from(buckets),
    isMiniature,
  };
}

function detectFamilies(
  title: string,
  plainText: string,
  notes: FragranceNotes | null
): string[] {
  const hay = `${title} ${plainText} ${
    notes ? [...notes.top, ...notes.heart, ...notes.base].join(" ") : ""
  }`.toLowerCase();

  const fams: string[] = [];
  if (/\boud\b|\bamber\b|\bresin\b|\bincense\b|\blabdanum\b|\bbenzoin\b|\boriental\b/.test(hay)) {
    fams.push("Amber & Oud");
  }
  if (/\bwood\b|\bsandalwood\b|\bcedar\b|\bvetiver\b|\bpatchouli\b|\boakmoss\b|\bwoody\b/.test(hay)) {
    fams.push("Woody");
  }
  if (/\bfloral\b|\brose\b|\bjasmine\b|\bneroli\b|\btuberose\b|\blavender\b|\biris\b|\bpeony\b|\blily\b|\bylang\b/.test(hay)) {
    fams.push("Floral");
  }
  if (/\bcitrus\b|\bbergamot\b|\blemon\b|\bmandarin\b|\borange\b|\bgrapefruit\b|\blime\b|\bfresh\b|\byuzu\b/.test(hay)) {
    fams.push("Citrus & Fresh");
  }
  if (/\bspic(?:y|e)\b|\bpepper\b|\bcinnamon\b|\bcardamom\b|\bnutmeg\b|\bsaffron\b|\bginger\b|\baromatic\b/.test(hay)) {
    fams.push("Spicy & Aromatic");
  }
  if (/\bvanilla\b|\bgourmand\b|\bcaramel\b|\bpraline\b|\bhoney\b|\btonka\b|\bcacao\b|\bpistachio\b|\bcoffee\b|\bcoconut\b/.test(hay)) {
    fams.push("Gourmand & Vanilla");
  }
  if (/\bleather\b|\bsmoke\b|\bsmoky\b|\btobacco\b|\bsuede\b|\bbirch\b/.test(hay)) {
    fams.push("Leather & Smoky");
  }
  if (/\baquatic\b|\bmarine\b|\bsea salt\b|\bocean\b|\bwater\b|\bice\b|\bblue\b/.test(hay)) {
    fams.push("Aquatic & Marine");
  }
  if (/\bmusk\b|\bambroxan\b|\bcashmeran\b/.test(hay)) {
    fams.push("Musk");
  }

  if (fams.length === 0) fams.push("Aromatic Signature");
  return fams.slice(0, 4);
}

function detectSeasonsAndOccasions(
  families: string[],
  concentration: Concentration,
  isGiftSet: boolean,
  plainText: string
): { seasons: string[]; occasions: string[] } {
  const seasons = new Set<string>();
  const occasions = new Set<string>();

  const hasWarm =
    families.includes("Amber & Oud") ||
    families.includes("Leather & Smoky") ||
    families.includes("Gourmand & Vanilla") ||
    concentration === "Extrait de Parfum" ||
    concentration === "Parfum";

  const hasFresh =
    families.includes("Citrus & Fresh") ||
    families.includes("Aquatic & Marine") ||
    concentration === "Eau de Toilette" ||
    concentration === "Eau de Cologne";

  if (hasWarm) {
    seasons.add("Winter");
    occasions.add("Evening & Date Night");
    occasions.add("Wedding & Festive");
    occasions.add("Party & Clubbing");
  }
  if (hasFresh) {
    seasons.add("Summer");
    occasions.add("Daily & Office");
  }
  if (families.includes("Floral") || families.includes("Woody") || families.includes("Musk")) {
    seasons.add("Monsoon & Spring");
    occasions.add("Daily & Office");
    occasions.add("Evening & Date Night");
  }
  if (isGiftSet) occasions.add("Gifting");
  if (/office|everyday|daily|versatile/i.test(plainText)) occasions.add("Daily & Office");
  if (/evening|night|date|intimate|seductive/i.test(plainText)) occasions.add("Evening & Date Night");
  if (/party|club|bold|statement/i.test(plainText)) occasions.add("Party & Clubbing");

  if (seasons.size === 0 || (hasWarm && hasFresh)) seasons.add("All-Season");
  if (occasions.size === 0) occasions.add("Daily & Office");

  return {
    seasons: Array.from(seasons),
    occasions: Array.from(occasions),
  };
}

let cachedAllProducts: EnrichedProduct[] | null = null;
let cachedPerfumes: EnrichedProduct[] | null = null;
let cachedSummaries: ProductSummary[] | null = null;
let cachedBrands: BrandSummary[] | null = null;
const byHandleMap = new Map<string, EnrichedProduct>();

function buildCatalog(): EnrichedProduct[] {
  if (cachedAllProducts) return cachedAllProducts;

  const flagshipBySlug = new Map<string, FlagshipProduct>();
  for (const item of flagshipCatalog) {
    flagshipBySlug.set(item.slug, item);
  }

  const rawList = rawProductsData as RawProduct[];
  const enriched: EnrichedProduct[] = [];

  for (let i = 0; i < rawList.length; i++) {
    const raw = rawList[i];
    const pType = (raw.product_type || "").trim();
    const isGiftCardOrBlotter = /\bgift card\b|\bblotter\b|\bstrips\b/i.test(raw.title || "");
    const isPerfumeType = /^(Perfume|Perfume & Cologne|perf)$/i.test(pType);
    const isPerfume = isPerfumeType && !isGiftCardOrBlotter;

    const rawVendor = (raw.vendor || "").trim();
    const brand = normalizeVendorName(rawVendor);
    const brandSlug = slugifyBrandName(brand);
    const brandTier = classifyBrandTier(brand, isPerfume);
    const isFlagship = brand === IN_HOUSE_BRAND;

    const tags = Array.isArray(raw.tags)
      ? raw.tags
      : typeof raw.tags === "string"
        ? raw.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const flagship = flagshipBySlug.get(raw.handle);

    const rawVariants = Array.isArray(raw.variants) && raw.variants.length > 0 ? raw.variants : [];
    const variants: ProductVariantSummary[] = rawVariants.map((v, idx) => {
      const priceNum = Number(v.price) || (flagship ? flagship.price : 0);
      const compareNumRaw = v.compare_at_price ? Number(v.compare_at_price) : null;
      const compareAtPrice = compareNumRaw && compareNumRaw > priceNum ? compareNumRaw : null;
      return {
        id: String(v.id ?? `${raw.id}-${idx}`),
        title: (v.title || v.option1 || "100ml").trim(),
        option1: v.option1 ?? null,
        price: priceNum,
        compareAtPrice,
        available: v.available !== false,
        featuredImage: v.featured_image?.src || undefined,
      };
    });

    if (variants.length === 0 && flagship) {
      variants.push({
        id: String(raw.id),
        title: "50ml",
        option1: "50ml",
        price: flagship.price,
        compareAtPrice:
          flagship.compareAtPrice && flagship.compareAtPrice > flagship.price
            ? flagship.compareAtPrice
            : null,
        available: true,
      });
    }

    const availableVariants = variants.filter((v) => v.available);
    const leadVariant =
      (availableVariants.length > 0
        ? availableVariants.reduce((min, v) => (v.price < min.price ? v : min), availableVariants[0])
        : variants[0]) || { price: 0, compareAtPrice: null, available: false };

    const price = leadVariant.price;
    const compareAtPrice = leadVariant.compareAtPrice;
    const discountPct =
      compareAtPrice && compareAtPrice > price
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

    const rawImages = Array.isArray(raw.images) ? raw.images : [];
    const images: ProductImageItem[] = rawImages.map((im) => ({
      id: im.id,
      src: resolveImageUrl(im),
      alt: (im.alt || `${raw.title} by ${brand}`).trim(),
      type: im.type || undefined,
    }));

    // Prefer bottle studio render as primary grid thumbnail on in-house flagships, keep all photos in gallery
    const bottleImg = images.find((im) => im.type === "bottle" || /_bottle\./i.test(im.src));
    const heroImg = images.find((im) => im.type === "hero" || /_hero\./i.test(im.src));
    const primaryImage = (bottleImg || images[0])?.src || "/placeholder.svg";
    const secondaryImage =
      (bottleImg ? (heroImg || images.find((im) => im.src !== primaryImage)) : images[1])?.src ||
      null;

    const cleanHtml = sanitizeProductHtml(raw.body_html);
    const plainDescription = stripTags(cleanHtml);
    const extractedLocalNotes = flagship?.notes
      ? {
          top: Array.isArray(flagship.notes.top)
            ? flagship.notes.top
            : parseNoteList(flagship.notes.top),
          heart: Array.isArray(flagship.notes.heart)
            ? flagship.notes.heart
            : parseNoteList(flagship.notes.heart),
          base: Array.isArray(flagship.notes.base)
            ? flagship.notes.base
            : parseNoteList(flagship.notes.base),
        }
      : extractNotesFromHtml(raw.body_html);

    const provenanceRecord = (
      rawEnrichmentProvenance as Record<
        string,
        { notes?: FragranceNotes; inferred_concentration?: string; inferred_gender?: string }
      >
    )[raw.handle];

    const notes = extractedLocalNotes || provenanceRecord?.notes || null;

    const isGiftSet = /\bgift set\b|\bdiscovery set\b|\bsampling set\b|\bcombo\b|\btrio\b|\bduo\b/i.test(
      raw.title || ""
    );
    const isMiniatureTitle = /\bvial\b|\bsample\b|\bmini\b|\bminiature\b|\bsampling\b/i.test(
      raw.title || ""
    );

    const gender: FragranceGender =
      flagship?.gender === "Men" || flagship?.gender === "Women" || flagship?.gender === "Unisex"
        ? flagship.gender
        : detectGender(raw.title || "", tags, plainDescription);

    const { concentration, short: concentrationShort } = detectConcentration(
      raw.title || "",
      plainDescription,
      isGiftSet
    );

    const { primarySize, buckets: sizeBuckets, isMiniature } = detectSizes(
      raw.title || "",
      rawVariants,
      isGiftSet,
      isMiniatureTitle
    );

    const families = detectFamilies(raw.title || "", plainDescription, notes);
    const { seasons, occasions } = detectSeasonsAndOccasions(
      families,
      concentration,
      isGiftSet,
      plainDescription
    );

    const reg = extractRegulatoryMetadata(plainDescription);
    const titleLower = (raw.title || "").toLowerCase();
    const isBestseller =
      isPerfume &&
      (isFlagship ||
        BESTSELLER_TERMS.some((term) => titleLower.includes(term)) ||
        (brandTier === "middle-eastern" && discountPct >= 35));

    const createdAt = raw.created_at || raw.published_at || "2026-01-01T00:00:00Z";
    const isNewArrival =
      isPerfume &&
      !isFlagship &&
      (createdAt.startsWith("2026-10") ||
        createdAt.startsWith("2026-11") ||
        i < 160);

    const item: EnrichedProduct = {
      id: String(raw.id),
      handle: raw.handle,
      title: raw.title,
      brand,
      brandSlug,
      brandTier,
      isPerfume,
      isFlagship,
      gender,
      concentration,
      concentrationShort,
      primarySize,
      sizeBuckets,
      families,
      seasons,
      occasions,
      price,
      compareAtPrice,
      discountPct,
      available: availableVariants.length > 0,
      isGiftSet,
      isMiniature,
      isBestseller,
      isNewArrival,
      image: primaryImage,
      secondaryImage,
      variants,
      notes,
      tagline: flagship?.tagline,
      inspiredBy: flagship?.inspiredBy,
      origin: reg.origin || (isFlagship ? "Crafted in India with Imported French Oils" : undefined),
      createdAt,
      rawVendor,
      productType: pType,
      tags,
      images,
      cleanHtml,
      plainDescription,
      scentStory: flagship?.scentStory,
      goodToKnow: flagship?.goodToKnow,
      importer: reg.importer,
      manufacturer: reg.manufacturer,
      marketedBy: reg.marketedBy,
    };

    enriched.push(item);
    byHandleMap.set(item.handle, item);
  }

  cachedAllProducts = enriched;
  return enriched;
}

export function getAllProducts(includeNonPerfumes = false): EnrichedProduct[] {
  const all = buildCatalog();
  if (includeNonPerfumes) return all;
  if (!cachedPerfumes) {
    cachedPerfumes = all.filter((p) => p.isPerfume);
  }
  return cachedPerfumes;
}

export function getProductByHandle(handle: string): EnrichedProduct | null {
  buildCatalog();
  return byHandleMap.get(handle) || null;
}

export function toProductSummary(p: EnrichedProduct): ProductSummary {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    brand: p.brand,
    brandSlug: p.brandSlug,
    brandTier: p.brandTier,
    isPerfume: p.isPerfume,
    isFlagship: p.isFlagship,
    gender: p.gender,
    concentration: p.concentration,
    concentrationShort: p.concentrationShort,
    primarySize: p.primarySize,
    sizeBuckets: p.sizeBuckets,
    families: p.families,
    seasons: p.seasons,
    occasions: p.occasions,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    discountPct: p.discountPct,
    available: p.available,
    isGiftSet: p.isGiftSet,
    isMiniature: p.isMiniature,
    isBestseller: p.isBestseller,
    isNewArrival: p.isNewArrival,
    image: p.image,
    secondaryImage: p.secondaryImage,
    variants: p.variants,
    notes: p.notes,
    tagline: p.tagline,
    inspiredBy: p.inspiredBy,
    origin: p.origin,
    createdAt: p.createdAt,
  };
}

/**
 * Strips heavy PDP fields (notes arrays, extra variants, taglines) before
 * serializing large lists into client grid/carousel Server Component payloads.
 */
export function toGridSummary(p: ProductSummary): ProductSummary {
  const leadVariant =
    p.variants.find((v) => v.available) || p.variants[0] || null;
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    brand: p.brand,
    brandSlug: p.brandSlug,
    brandTier: p.brandTier,
    isPerfume: p.isPerfume,
    isFlagship: p.isFlagship,
    gender: p.gender,
    concentration: p.concentration,
    concentrationShort: p.concentrationShort,
    primarySize: p.primarySize,
    sizeBuckets: p.sizeBuckets,
    families: p.families,
    seasons: [],
    occasions: p.occasions,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    discountPct: p.discountPct,
    available: p.available,
    isGiftSet: p.isGiftSet,
    isMiniature: p.isMiniature,
    isBestseller: p.isBestseller,
    isNewArrival: p.isNewArrival,
    image: p.image,
    secondaryImage: p.secondaryImage,
    variants: leadVariant
      ? [
          {
            id: leadVariant.id,
            title: leadVariant.title,
            option1: null,
            price: leadVariant.price,
            compareAtPrice: leadVariant.compareAtPrice,
            available: leadVariant.available,
          },
        ]
      : [],
    notes: null,
    createdAt: p.createdAt.slice(0, 10),
  };
}

export function getAllPerfumeSummaries(): ProductSummary[] {
  if (!cachedSummaries) {
    cachedSummaries = getAllProducts(false).map(toProductSummary);
  }
  return cachedSummaries;
}

export function getBrandSummaries(): BrandSummary[] {
  if (cachedBrands) return cachedBrands;
  const perfumes = getAllPerfumeSummaries();
  const map = new Map<string, BrandSummary>();

  for (const p of perfumes) {
    if (p.brand === "Perfume Network India" || p.brand === "Buy 1 Get 1 Free") continue;
    const existing = map.get(p.brandSlug);
    if (!existing) {
      map.set(p.brandSlug, {
        name: p.brand,
        slug: p.brandSlug,
        tier: p.brandTier,
        count: 1,
        minPrice: p.price,
        maxPrice: p.price,
        sampleImage: p.image,
      });
    } else {
      existing.count += 1;
      if (p.price < existing.minPrice) existing.minPrice = p.price;
      if (p.price > existing.maxPrice) existing.maxPrice = p.price;
      if (existing.sampleImage === "/placeholder.svg" && p.image !== "/placeholder.svg") {
        existing.sampleImage = p.image;
      }
    }
  }

  cachedBrands = Array.from(map.values()).sort((a, b) => b.count - a.count);
  return cachedBrands;
}

export function filterProducts(
  items: ProductSummary[],
  filters: CatalogFilters
): ProductSummary[] {
  const q = (filters.query || "").trim().toLowerCase();
  const brandSet = filters.brands?.length ? new Set(filters.brands) : null;
  const tierSet = filters.tiers?.length ? new Set(filters.tiers) : null;
  const genderSet = filters.genders?.length ? new Set(filters.genders) : null;
  const concSet = filters.concentrations?.length ? new Set(filters.concentrations) : null;
  const sizeSet = filters.sizes?.length ? new Set(filters.sizes) : null;
  const familySet = filters.families?.length ? new Set(filters.families) : null;
  const occasionSet = filters.occasions?.length ? new Set(filters.occasions) : null;
  const seasonSet = filters.seasons?.length ? new Set(filters.seasons) : null;

  return items.filter((p) => {
    if (brandSet && !brandSet.has(p.brandSlug) && !brandSet.has(p.brand)) return false;
    if (tierSet && !tierSet.has(p.brandTier)) return false;
    if (genderSet && !genderSet.has(p.gender)) return false;
    if (concSet && !concSet.has(p.concentration) && !concSet.has(p.concentrationShort)) {
      return false;
    }
    if (sizeSet && !p.sizeBuckets.some((b) => sizeSet.has(b))) return false;
    if (familySet && !p.families.some((f) => familySet.has(f))) return false;
    if (occasionSet && !p.occasions.some((o) => occasionSet.has(o))) return false;
    if (seasonSet && !p.seasons.some((s) => seasonSet.has(s))) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    if (filters.inStockOnly && !p.available) return false;
    if (filters.discountedOnly && p.discountPct <= 0) return false;
    if (filters.giftSetsOnly && !p.isGiftSet) return false;
    if (filters.miniaturesOnly && !p.isMiniature) return false;

    if (q) {
      const noteText = p.notes
        ? [...p.notes.top, ...p.notes.heart, ...p.notes.base].join(" ")
        : "";
      const hay = `${p.title} ${p.brand} ${p.concentration} ${p.gender} ${p.families.join(" ")} ${noteText} ${p.inspiredBy || ""}`.toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      if (!tokens.every((tok) => hay.includes(tok))) return false;
    }

    return true;
  });
}

export function sortProducts(items: ProductSummary[], sort: SortKey = "featured"): ProductSummary[] {
  const list = [...items];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "discount":
      return list.sort((a, b) => b.discountPct - a.discountPct || a.price - b.price);
    case "title-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "featured":
    default:
      return list.sort((a, b) => {
        if (a.available !== b.available) return a.available ? -1 : 1;
        if (a.isFlagship !== b.isFlagship) return a.isFlagship ? -1 : 1;
        if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
        return b.discountPct - a.discountPct;
      });
  }
}

export function getFacetCounts(items: ProductSummary[]): FacetCounts {
  const brandCounts = new Map<string, { label: string; count: number }>();
  const tierCounts = new Map<string, number>();
  const genderCounts = new Map<string, number>();
  const concCounts = new Map<string, number>();
  const sizeCounts = new Map<string, number>();
  const familyCounts = new Map<string, number>();
  const occasionCounts = new Map<string, number>();
  const seasonCounts = new Map<string, number>();

  let minPrice = Infinity;
  let maxPrice = 0;
  let totalInStock = 0;
  let totalDiscounted = 0;

  for (const p of items) {
    if (p.price < minPrice) minPrice = p.price;
    if (p.price > maxPrice) maxPrice = p.price;
    if (p.available) totalInStock += 1;
    if (p.discountPct > 0) totalDiscounted += 1;

    if (p.brand && p.brand !== "Perfume Network India" && p.brand !== "Buy 1 Get 1 Free") {
      const b = brandCounts.get(p.brandSlug);
      brandCounts.set(p.brandSlug, { label: p.brand, count: (b?.count || 0) + 1 });
    }
    tierCounts.set(p.brandTier, (tierCounts.get(p.brandTier) || 0) + 1);
    genderCounts.set(p.gender, (genderCounts.get(p.gender) || 0) + 1);
    concCounts.set(p.concentration, (concCounts.get(p.concentration) || 0) + 1);

    for (const sb of p.sizeBuckets) sizeCounts.set(sb, (sizeCounts.get(sb) || 0) + 1);
    for (const fam of p.families) familyCounts.set(fam, (familyCounts.get(fam) || 0) + 1);
    for (const occ of p.occasions) occasionCounts.set(occ, (occasionCounts.get(occ) || 0) + 1);
    for (const sea of p.seasons) seasonCounts.set(sea, (seasonCounts.get(sea) || 0) + 1);
  }

  const TIER_LABELS: Record<string, string> = {
    "middle-eastern": "Middle Eastern",
    designer: "Designer",
    niche: "Niche & Haute Parfumerie",
    "in-house": "Octopus by Harsh Beniwal",
    miniatures: "Sampling & Vials",
    keepsakes: "Gifts & Keepsakes",
  };

  const toOptions = (map: Map<string, number>, labelMap?: Record<string, string>): FacetOption[] =>
    Array.from(map.entries())
      .map(([value, count]) => ({ value, label: labelMap?.[value] || value, count }))
      .sort((a, b) => b.count - a.count);

  return {
    brands: Array.from(brandCounts.entries())
      .map(([value, obj]) => ({ value, label: obj.label, count: obj.count }))
      .sort((a, b) => b.count - a.count),
    tiers: toOptions(tierCounts, TIER_LABELS),
    genders: toOptions(genderCounts),
    concentrations: toOptions(concCounts),
    sizes: toOptions(sizeCounts),
    families: toOptions(familyCounts),
    occasions: toOptions(occasionCounts),
    seasons: toOptions(seasonCounts),
    minPrice: Number.isFinite(minPrice) ? minPrice : 0,
    maxPrice,
    totalInStock,
    totalDiscounted,
  };
}

export function getSimilarProducts(target: EnrichedProduct, limit = 8): ProductSummary[] {
  const pool = getAllPerfumeSummaries().filter((p) => p.handle !== target.handle && p.available);
  const targetFams = new Set(target.families);

  const scored = pool.map((p) => {
    let score = 0;
    if (p.brandSlug === target.brandSlug) score += 3;
    if (p.gender === target.gender) score += 3;
    if (p.concentration === target.concentration) score += 2;
    for (const f of p.families) {
      if (targetFams.has(f)) score += 3;
    }
    const priceDiff = Math.abs(p.price - target.price);
    if (priceDiff <= target.price * 0.25) score += 2;
    return { p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

const STATIC_COLLECTIONS: Record<string, Omit<CollectionMeta, "slug">> = {
  all: {
    title: "All Authentic Perfumes",
    eyebrow: "Complete Fragrance Library",
    description:
      "Browse over 16,000 factory-sealed Eau de Parfums, Extraits, designer icons, niche creations, and Middle Eastern powerhouses.",
    seoDescription:
      "Shop 16,000+ 100% original perfumes online in India at Octopus Perfumes. Designer, Niche & Middle Eastern fragrances with pan-India express shipping.",
    filters: {},
  },
  perfumes: {
    title: "All Fine Fragrances",
    eyebrow: "Complete Catalog",
    description:
      "Explore every fragrance across designer houses, artisanal niche perfumers, Middle Eastern bestsellers, and Octopus by Harsh Beniwal.",
    seoDescription:
      "Authentic fine fragrances curated by concentration, family, occasion, and house.",
    filters: {},
  },
  men: {
    title: "Perfumes for Men",
    eyebrow: "Masculine Edit",
    description:
      "From crisp bergamot-ambroxan signatures to intense smoky leather and oud extraits tailored for every hour.",
    seoDescription:
      "Buy original men's perfumes online in India: Dior, Rasasi Hawas, Armaf CDNIM, Tom Ford, Afnan 9PM & Harsh Beniwal Overlord.",
    filters: { genders: ["Men", "Unisex"] },
  },
  women: {
    title: "Perfumes for Women",
    eyebrow: "Feminine Edit",
    description:
      "Radiant white florals, gourmand vanilla praline, sparkling citrus, and warm amber musk built for unforgettable trails.",
    seoDescription:
      "Shop 100% authentic women's perfumes in India: Carolina Herrera Good Girl, Dior, YSL Libre, Lattafa Khamrah & Darling 50ML EDP.",
    filters: { genders: ["Women", "Unisex"] },
  },
  unisex: {
    title: "Unisex & Shared Perfumes",
    eyebrow: "Genderless Alchemy",
    description:
      "Niche extracts, airy woods, spiced tea compositions, and contemporary ambroxan blends worn across boundaries.",
    seoDescription:
      "Shop unisex luxury, niche & Middle Eastern perfumes at Octopus Perfumes India.",
    filters: { genders: ["Unisex"] },
  },
  "middle-eastern-perfumes": {
    title: "Middle Eastern Powerhouses",
    eyebrow: "UAE & Heritage Houses",
    description:
      "High-oil-concentration Extraits and EDPs from Lattafa, Rasasi, Afnan, Armaf, French Avenue, Swiss Arabian, and Ahmed Al Maghribi.",
    seoDescription:
      "Buy authentic Dubai & Arabian perfumes in India: Lattafa, Rasasi, Afnan, Armaf, French Avenue & Paris Corner.",
    filters: { tiers: ["middle-eastern"] },
  },
  "designer-perfumes": {
    title: "Designer Fragrance Houses",
    eyebrow: "Runway & Classic Perfumery",
    description:
      "Timeless signatures and modern icons from Christian Dior, Hermès, Tom Ford, Giorgio Armani, YSL, Versace, and Paco Rabanne.",
    seoDescription:
      "Authentic designer perfumes from Dior, Hermès, Tom Ford, YSL, Versace, and Giorgio Armani with express delivery in India.",
    filters: { tiers: ["designer"] },
  },
  "niche-perfumes": {
    title: "Niche & Haute Parfumerie",
    eyebrow: "Artisanal & Rare Creations",
    description:
      "Small-batch compositions and collector icons from Creed, Parfums de Marly, Xerjoff, Memo Paris, Initio, Nishane, and Guerlain.",
    seoDescription:
      "Shop rare niche perfumes in India: Creed, Parfums de Marly, Xerjoff, Memo Paris, Initio, Byredo & Guerlain.",
    filters: { tiers: ["niche"] },
  },
  bestsellers: {
    title: "Most Loved & Bestselling Scents",
    eyebrow: "Customer Favourites",
    description:
      "Crowd-pleasing icons, compliment magnets, and flagship EDPs from Octopus x Harsh Beniwal, Rasasi, Lattafa, Dior, and Afnan.",
    seoDescription:
      "Top bestselling perfumes in India: Harsh Beniwal Overlord, Rasasi Hawas, Lattafa Khamrah, Dior Sauvage & Afnan 9PM.",
    filters: { sort: "featured" },
  },
  "new-arrivals": {
    title: "New Arrivals & Fresh Drops",
    eyebrow: "Latest Releases",
    description:
      "Newly added editions, flankers, gift sets, and trending Middle Eastern releases freshly stocked in our vault.",
    seoDescription:
      "Discover newly arrived luxury and Arabian perfumes at Octopus Perfumes India.",
    filters: { sort: "newest" },
  },
  miniatures: {
    title: "Miniatures, Travel Vials & Sampling Sets",
    eyebrow: "Try Before the Full Bottle",
    description:
      "Explore curated discovery sets, official vials, and travel sprays from Creed, Xerjoff, Byredo, Carolina Herrera, and Arabian houses.",
    seoDescription:
      "Shop perfume miniatures, vials, and official discovery sampling sets online in India.",
    filters: { miniaturesOnly: true },
  },
  "gift-sets": {
    title: "Perfume Gift Sets & Coffrets",
    eyebrow: "Signature Gifting",
    description:
      "Presentation coffrets paired with matching travel sprays, miniatures, or lotions ready for weddings, anniversaries, and celebrations.",
    seoDescription:
      "Authentic luxury perfume gift sets and boxed coffrets with free pan-India express shipping.",
    filters: { giftSetsOnly: true },
  },
  "size-30ml": {
    title: "30ml Pocket & Travel Bottles",
    eyebrow: "Shop by Volume",
    description: "Compact authentic bottles designed for carry-on luggage, gym bags, and desk drawers.",
    seoDescription: "Buy 30ml original designer and niche perfumes in India.",
    filters: { sizes: ["30ml"] },
  },
  "size-50ml": {
    title: "50ml Signature Editions",
    eyebrow: "Shop by Volume",
    description: "Balanced everyday sizes including all 9 Harsh Beniwal x Octopus Eau de Parfums.",
    seoDescription: "Shop 50ml Eau de Parfum and Extrait bottles across leading fragrance houses.",
    filters: { sizes: ["50ml"] },
  },
  "size-75ml": {
    title: "75ml Collector Bottles",
    eyebrow: "Shop by Volume",
    description: "Generous mid-size flacons frequently chosen by niche houses including Creed, Memo Paris, and Parfums de Marly.",
    seoDescription: "Shop 75ml designer and niche perfume bottles online in India.",
    filters: { sizes: ["75ml"] },
  },
  "size-100ml": {
    title: "100ml Standard Full Bottles",
    eyebrow: "Shop by Volume",
    description: "Full-size collector and daily signature flacons delivering the strongest per-ml value.",
    seoDescription: "Browse 1,000+ original 100ml perfumes online in India.",
    filters: { sizes: ["100ml"] },
  },
  "under-1500": {
    title: "Signature Scents Under ₹1,500",
    eyebrow: "Smart Luxury",
    description: "Discovery sets, miniatures, everyday mists, and our flagship Harsh Beniwal x Octopus collection under ₹1,500.",
    seoDescription: "Shop authentic perfumes and discovery sets under ₹1,500 in India.",
    filters: { maxPrice: 1500, sort: "price-asc" },
  },
  "1500-to-3000": {
    title: "High-Performance Gems ₹1,500 – ₹3,000",
    eyebrow: "Curated Value",
    description: "Dubai cult classics and powerhouse 100ml EDPs from Lattafa, Armaf, French Avenue, Afnan, and Paris Corner.",
    seoDescription: "Best original perfumes between ₹1,500 and ₹3,000 in India.",
    filters: { minPrice: 1500, maxPrice: 3000 },
  },
  "3000-to-5000": {
    title: "Elevated Classics ₹3,000 – ₹5,000",
    eyebrow: "Designer Entry",
    description: "Timeless daily icons and versatile designers from Hugo Boss, Versace, Burberry, Davidoff, and Rasasi.",
    seoDescription: "Original designer perfumes priced ₹3,000 to ₹5,000 in India.",
    filters: { minPrice: 3000, maxPrice: 5000 },
  },
  "5000-to-9000": {
    title: "Luxury Signature Bottles ₹5,000 – ₹9,000",
    eyebrow: "Flagship Designers",
    description: "Prestige releases from Dior, YSL, Giorgio Armani, Chanel, Prada, Caroline Herrera, and Mancera.",
    seoDescription: "Luxury designer perfumes ₹5,000 to ₹9,000 with authenticity guarantee.",
    filters: { minPrice: 5000, maxPrice: 9000 },
  },
  premium: {
    title: "Haute Parfumerie Above ₹9,000",
    eyebrow: "Reserve & Collector Vault",
    description: "Creed, Parfums de Marly, Xerjoff, Tom Ford Private Blend, Initio, and Memo Paris investment flacons.",
    seoDescription: "Shop rare luxury & niche perfumes above ₹9,000 in India.",
    filters: { minPrice: 9000 },
  },
  woody: {
    title: "Woody & Earthy Fragrances",
    eyebrow: "Fragrance Family",
    description: "Dry cedarwood, creamy sandalwood, vetiver roots, and smoky oakmoss compositions.",
    seoDescription: "Explore woody, vetiver, sandalwood, and cedarwood perfumes in India.",
    filters: { families: ["Woody"] },
  },
  "amber-oud": {
    title: "Amber, Oud & Resin Perfumes",
    eyebrow: "Fragrance Family",
    description: "Rich Middle Eastern agarwood, warm golden amber, frankincense, and velvety benzoin.",
    seoDescription: "Shop authentic amber and oud perfumes from Lattafa, French Avenue, Creed & Tom Ford.",
    filters: { families: ["Amber & Oud"] },
  },
  floral: {
    title: "Floral & White Blossom Scents",
    eyebrow: "Fragrance Family",
    description: "Grasse rose, blooming jasmine sambac, iris butter, and orange blossom bouquets.",
    seoDescription: "Shop original floral perfumes for women and men online in India.",
    filters: { families: ["Floral"] },
  },
  "citrus-fresh": {
    title: "Citrus & Crisp Fresh Fragrances",
    eyebrow: "Fragrance Family",
    description: "Calabrian bergamot, blood orange, icy mint, and energetic daytime colognes built for warm weather.",
    seoDescription: "Best citrus and fresh summer perfumes in India.",
    filters: { families: ["Citrus & Fresh"] },
  },
  gourmand: {
    title: "Gourmand & Madagascar Vanilla",
    eyebrow: "Fragrance Family",
    description: "Addictive praline, roasted pistachio, spiced cinnamon, tonka bean, and whipped vanilla trails.",
    seoDescription: "Shop original vanilla and gourmand perfumes in India.",
    filters: { families: ["Gourmand & Vanilla"] },
  },
  leather: {
    title: "Leather, Tobacco & Smoky Scents",
    eyebrow: "Fragrance Family",
    description: "Commanding suede, black leather, dark cacao, and birchwood signatures.",
    seoDescription: "Buy bold leather and smoky fragrances including Ombre Leather & Tuscan accords.",
    filters: { families: ["Leather & Smoky"] },
  },
  office: {
    title: "Office & Daily Signature Scents",
    eyebrow: "Shop by Occasion",
    description: "Clean, composed, non-intrusive fragrances that project quiet competence from 9 AM to evening commute.",
    seoDescription: "Best long-lasting office and daily wear perfumes in India.",
    filters: { occasions: ["Daily & Office"] },
  },
  "date-night": {
    title: "Date Night & Evening Allure",
    eyebrow: "Shop by Occasion",
    description: "Close-quarters magnetism built on warm amber, roasted vanilla, spices, and textured leather.",
    seoDescription: "Romantic evening and date night perfumes for men and women in India.",
    filters: { occasions: ["Evening & Date Night"] },
  },
  "party-clubbing": {
    title: "Party, Night Out & Loud Projection",
    eyebrow: "Shop by Occasion",
    description: "High-sillage Extraits and sweet-spicy clubbing champions engineered to cut through crowded rooms.",
    seoDescription: "Long-lasting high-projection party perfumes including Afnan 9PM, Eros & Overlord.",
    filters: { occasions: ["Party & Clubbing"] },
  },
  "wedding-festive": {
    title: "Wedding & Festive Statement Scents",
    eyebrow: "Shop by Occasion",
    description: "Opulent oud, saffron, rose, and royal amber blends created for celebrations and traditional attire.",
    seoDescription: "Royal wedding and festive luxury perfumes in India.",
    filters: { occasions: ["Wedding & Festive"] },
  },
  summer: {
    title: "Summer & Heat-Proof Fragrances",
    eyebrow: "Shop by Season",
    description: "Aquatics, neroli, iced plum, and sparkling citrus engineered to stay crisp in Indian humidity.",
    seoDescription: "Best long-lasting summer perfumes for Indian weather.",
    filters: { seasons: ["Summer"] },
  },
  winter: {
    title: "Winter & Monsoon Warmers",
    eyebrow: "Shop by Season",
    description: "Spiced boozy vanilla, smoked woods, and dense amber Extraits tailored for cool evenings.",
    seoDescription: "Warm winter and evening luxury perfumes in India.",
    filters: { seasons: ["Winter"] },
  },
  "harsh-beniwal": {
    title: "Harsh Beniwal × Octopus Flagship Collection",
    eyebrow: "Signature French Oil Collaboration",
    description:
      "All 9 flagship 50ML Eau de Parfums formulated with 25%+ imported French fragrance oils for lasting Indian-climate sillage.",
    seoDescription:
      "Shop Harsh Beniwal Octopus Perfumes: Overlord, Paradox, Rhapsody, Outlaw, Mirage, Darling & more.",
    filters: { brands: [slugifyBrandName(IN_HOUSE_BRAND)] },
  },
  deals: {
    title: "Special Value & Collector Offers",
    eyebrow: "Verified Markdowns",
    description: "Authentic sealed bottles currently discounted below retail MRP, eligible for extra bundle and cart discounts.",
    seoDescription: "Shop discounted 100% original luxury and Middle Eastern perfumes in India.",
    filters: { discountedOnly: true, sort: "discount" },
  },
  "eau-de-parfum": {
    title: "Eau de Parfum (EDP) Collection",
    eyebrow: "Shop by Concentration",
    description: "Long-wearing Eau de Parfums balanced with higher fragrance oil content across designer, UAE, and Harsh Beniwal flagship houses.",
    seoDescription: "Shop 1,000+ original Eau de Parfum (EDP) fragrances online in India.",
    filters: { concentrations: ["Eau de Parfum"] },
  },
  "eau-de-toilette": {
    title: "Eau de Toilette (EDT) Collection",
    eyebrow: "Shop by Concentration",
    description: "Airy daytime projection, crisp citrus openings, and refreshing all-season Eau de Toilette signatures.",
    seoDescription: "Buy original Eau de Toilette (EDT) perfumes for men and women in India.",
    filters: { concentrations: ["Eau de Toilette"] },
  },
  "extrait-de-parfum": {
    title: "Extrait de Parfum & Pure Parfum",
    eyebrow: "Maximum Density",
    description: "Our richest extrait and pure parfum formulations engineered for extended warmth and close skin longevity.",
    seoDescription: "Explore Extrait de Parfum and Pure Parfum bottles in India.",
    filters: { concentrations: ["Extrait de Parfum", "Parfum"] },
  },
  "long-lasting": {
    title: "Long-Lasting EDPs & Extraits",
    eyebrow: "High-Oil Formulations",
    description: "Rich Eau de Parfum, Extrait de Parfum, Pure Parfum, and Middle Eastern signatures built for extended wear.",
    seoDescription: "Discover long-lasting EDP and Extrait de Parfum scents in India.",
    filters: { concentrations: ["Eau de Parfum", "Extrait de Parfum", "Parfum"] },
  },
  "luxury-perfumes": {
    title: "Luxury & Designer Collector Bottles",
    eyebrow: "Prestige Vault",
    description: "Signature creations from Christian Dior, Hermès, Tom Ford, Creed, Parfums de Marly, Xerjoff, and Guerlain.",
    seoDescription: "Shop 100% authentic luxury designer and niche perfumes online in India.",
    filters: { tiers: ["designer", "niche"] },
  },
  "festive-gifts": {
    title: "Festive Perfumes & Gifting Vault",
    eyebrow: "Celebration Edit",
    description: "Boxed coffrets, amber-oud showstoppers, and signature EDPs ready for Indian weddings and festivities.",
    seoDescription: "Curated perfume gift sets and festive luxury fragrances in India.",
    filters: { occasions: ["Wedding & Festive", "Gifting"] },
  },
  affordable: {
    title: "Affordable Authentic Perfumes",
    eyebrow: "Everyday Value",
    description: "Original sealed fragrances and official travel formats priced cleanly under ₹3,000.",
    seoDescription: "Buy affordable 100% original perfumes in India under ₹3,000.",
    filters: { maxPrice: 3000, sort: "price-asc" },
  },
  "under-999": {
    title: "Signatures Under ₹999",
    eyebrow: "Price Edit",
    description: "Harsh Beniwal × Octopus Pocket & Signature EDPs, vials, and official travel formats under ₹999.",
    seoDescription: "Shop original perfumes and miniatures under ₹999 in India.",
    filters: { maxPrice: 999, sort: "price-asc" },
  },
  "1000-to-1999": {
    title: "Curated Fragrances ₹1,000 – ₹1,999",
    eyebrow: "Price Edit",
    description: "Accessible Eau de Parfums, daily staples, and Middle Eastern signatures priced ₹1,000 to ₹1,999.",
    seoDescription: "Best original perfumes in India from ₹1,000 to ₹1,999.",
    filters: { minPrice: 1000, maxPrice: 1999 },
  },
  "2000-to-2999": {
    title: "High-Longevity Scents ₹2,000 – ₹2,999",
    eyebrow: "Price Edit",
    description: "Heavy-hitter Middle Eastern bottles from Lattafa, Armaf, French Avenue, Afnan, and Paris Corner.",
    seoDescription: "Shop authentic Dubai & designer fragrances ₹2,000 to ₹2,999 in India.",
    filters: { minPrice: 2000, maxPrice: 2999 },
  },
  "3000-to-4999": {
    title: "Classic Signatures ₹3,000 – ₹4,999",
    eyebrow: "Price Edit",
    description: "Timeless designer EDTs & EDPs from Hugo Boss, Versace, Burberry, Davidoff, and Rasasi.",
    seoDescription: "Original designer perfumes priced ₹3,000 to ₹4,999 in India.",
    filters: { minPrice: 3000, maxPrice: 4999 },
  },
  "5000-to-9999": {
    title: "Luxury Perfumes ₹5,000 – ₹9,999",
    eyebrow: "Price Edit",
    description: "Signature prestige lines from Christian Dior, YSL, Armani, Prada, Carolina Herrera, and Mancera.",
    seoDescription: "Buy original designer luxury perfumes ₹5,000 to ₹9,999 in India.",
    filters: { minPrice: 5000, maxPrice: 9999 },
  },
  "above-10000": {
    title: "Haute Parfumerie Above ₹10,000",
    eyebrow: "Collector Vault",
    description: "Creed, Parfums de Marly, Xerjoff, Tom Ford Private Blend, Initio, and Memo Paris reserve bottles.",
    seoDescription: "Shop rare niche and collector fragrances above ₹10,000 in India.",
    filters: { minPrice: 10000 },
  },
  oud: {
    title: "Oud & Agarwood Fragrances",
    eyebrow: "Fragrance Family",
    description: "Smoky, spiced, and resinous oud creations from Middle Eastern and niche maisons.",
    seoDescription: "Buy original oud perfumes in India from Lattafa, Rasasi, Tom Ford & Creed.",
    filters: { families: ["Amber & Oud"] },
  },
  amber: {
    title: "Amber & Golden Resin Perfumes",
    eyebrow: "Fragrance Family",
    description: "Velvety benzoin, labdanum, warm spice, and glowing amber trails.",
    seoDescription: "Shop original amber and oriental fragrances in India.",
    filters: { families: ["Amber & Oud"] },
  },
  oriental: {
    title: "Oriental & Spiced Amber Scents",
    eyebrow: "Fragrance Family",
    description: "Rich cardamom, saffron, resin, and velvety woods steeped in warm evening elegance.",
    seoDescription: "Explore oriental perfumes for men and women in India.",
    filters: { families: ["Amber & Oud", "Spicy & Aromatic"] },
  },
  aquatic: {
    title: "Aquatic & Marine Perfumes",
    eyebrow: "Fragrance Family",
    description: "Sea salt, cooling mint, watery aldehydes, and crisp Mediterranean blues.",
    seoDescription: "Best aquatic and marine perfumes for Indian heat.",
    filters: { families: ["Aquatic & Marine"] },
  },
  aromatic: {
    title: "Aromatic & Green Fougère",
    eyebrow: "Fragrance Family",
    description: "Crushed lavender, rosemary, sage, and herbaceous green classics.",
    seoDescription: "Shop aromatic and lavender fougère perfumes in India.",
    filters: { families: ["Spicy & Aromatic"] },
  },
  spicy: {
    title: "Spicy & Vibrant Signature Perfumes",
    eyebrow: "Fragrance Family",
    description: "Pink pepper, cinnamon, nutmeg, and cardamom accents with bold presence.",
    seoDescription: "Buy original spicy perfumes for men and women in India.",
    filters: { families: ["Spicy & Aromatic"] },
  },
  fruity: {
    title: "Fruity, Citrus & Bright Blends",
    eyebrow: "Fragrance Family",
    description: "Sunlit bergamot, juicy plum, blackcurrant, pear, and crisp fruit openings.",
    seoDescription: "Shop vibrant citrus and fruity perfumes online in India.",
    filters: { families: ["Citrus & Fresh"] },
  },
  musky: {
    title: "Clean Musk & Ambroxan Skin Scents",
    eyebrow: "Fragrance Family",
    description: "Second-skin white musk, velvety ambroxan, and airy clean dry-downs.",
    seoDescription: "Discover long-lasting musk and ambroxan perfumes in India.",
    filters: { families: ["Musk"] },
  },
  trending: {
    title: "Trending Fragrances Right Now",
    eyebrow: "In High Demand",
    description: "Viral Gulf Extraits, standout designer flankers, and flagship releases across India.",
    seoDescription: "Discover trending designer and Middle Eastern perfumes in India.",
    filters: { discountedOnly: true, sort: "discount" },
  },
  exclusive: {
    title: "Octopus Exclusive & Signature Edits",
    eyebrow: "House Flagship",
    description: "Curated rare niche releases alongside the 25%+ French oil Harsh Beniwal × Octopus collection.",
    seoDescription: "Explore exclusive fine fragrances at Octopus Perfumes India.",
    filters: { tiers: ["in-house", "niche"] },
  },
  "discovery-sets": {
    title: "Discovery Sets & Sampling Kits",
    eyebrow: "Sample Multiple Houses",
    description: "Official curated sampling sets across Creed, Parfums de Marly, Xerjoff, Byredo, Afnan, and Lattafa.",
    seoDescription: "Buy authentic perfume discovery kits and sample sets in India.",
    filters: { miniaturesOnly: true },
  },
  everyday: {
    title: "Everyday Versatile Signatures",
    eyebrow: "Shop by Occasion",
    description: "Effortless all-day reach bottles built for classes, errands, and casual outings.",
    seoDescription: "Best everyday versatile perfumes in India.",
    filters: { occasions: ["Daily & Office"] },
  },
  weddings: {
    title: "Wedding & Grand Celebration Perfumes",
    eyebrow: "Shop by Occasion",
    description: "Rich saffron, Damascus rose, oud, and luxury extraits suited for ethnic wear and receptions.",
    seoDescription: "Shop wedding and bridal/groom luxury perfumes in India.",
    filters: { occasions: ["Wedding & Festive"] },
  },
  parties: {
    title: "Party & Late-Night Clubbing Perfumes",
    eyebrow: "Shop by Occasion",
    description: "High-projection crowd-pleasers crafted to project cleanly in festive venues and night outs.",
    seoDescription: "Top party and clubbing perfumes for men and women in India.",
    filters: { occasions: ["Party & Clubbing"] },
  },
  "special-occasions": {
    title: "Special Occasion & Milestone Editions",
    eyebrow: "Shop by Occasion",
    description: "Unforgettable extraits and signature flacons reserved for milestones and black-tie evenings.",
    seoDescription: "Luxury perfumes for special occasions and milestone celebrations in India.",
    filters: { occasions: ["Evening & Date Night", "Wedding & Festive"] },
  },
  evening: {
    title: "Evening & Sunset Wear",
    eyebrow: "Shop by Occasion",
    description: "Smooth amber, vanilla, iris, and suede compositions balanced for cooler hours.",
    seoDescription: "Shop evening luxury perfumes in India.",
    filters: { occasions: ["Evening & Date Night"] },
  },
  travel: {
    title: "Travel Sprays, Pocket Sizes & 30ml",
    eyebrow: "Shop by Occasion",
    description: "Airline-friendly compact bottles, pocket Extraits, and vials built for transit.",
    seoDescription: "Buy compact travel perfumes and pocket bottles in India.",
    filters: { sizes: ["30ml", "Miniature (<30ml)"] },
  },
  gifting: {
    title: "Luxury Perfume Gifting Edit",
    eyebrow: "Shop by Occasion",
    description: "Boxed coffrets, signature sets, and universally acclaimed crowd-pleasers wrapped for gifting.",
    seoDescription: "Best perfume gifts and presentation sets in India.",
    filters: { giftSetsOnly: true },
  },
  monsoon: {
    title: "Monsoon & Rain-Ready Scents",
    eyebrow: "Shop by Season",
    description: "Vetiver, white floral, petrichor wood, and balanced aromatics that bloom in humid rain.",
    seoDescription: "Best perfumes for Indian monsoon weather.",
    filters: { seasons: ["Monsoon & Spring"] },
  },
  spring: {
    title: "Spring Blossom & Green Scents",
    eyebrow: "Shop by Season",
    description: "Luminous neroli, airy iris, blooming rose, and fresh aromatic woods.",
    seoDescription: "Shop spring floral and fresh perfumes in India.",
    filters: { seasons: ["Monsoon & Spring"] },
  },
  "all-season": {
    title: "All-Season Daily Signatures",
    eyebrow: "Shop by Season",
    description: "Balanced multi-season crowd-pleasers reliable from January through December.",
    seoDescription: "All-season signature perfumes for men and women in India.",
    filters: { seasons: ["All-Season"] },
  },
  "octopus-perfumes": {
    title: "Octopus Perfumes Official Flagship",
    eyebrow: "In-House Craft",
    description: "Our signature 25%+ imported French oil 50ML Eau de Parfum collection crafted with Harsh Beniwal.",
    seoDescription: "Shop Official Octopus Perfumes 50ML EDPs in India.",
    filters: { brands: [slugifyBrandName(IN_HOUSE_BRAND)] },
  },
};

function buildCollectionFaqs(title: string): { q: string; a: string }[] {
  return [
    {
      q: `Are all bottles in ${title} 100% original and factory sealed?`,
      a: `Yes. Every fragrance inside ${title} ships brand new in original sealed packaging with matching factory batch codes printed on box and glass flacon.`,
    },
    {
      q: `Can I filter ${title} by bottle size, concentration, or price?`,
      a: `Yes — use the sidebar filter panel on desktop (or the Filters drawer on mobile) to narrow results by house brand, gender, concentration, volume, scent family, or INR budget.`,
    },
    {
      q: `What shipping benefits apply when ordering from ${title}?`,
      a: `Prepaid Express shipping across India is complimentary on every order, and orders include a complimentary 7ML Paradox EDP pocket spray.`,
    },
  ];
}

export function getCollectionDefinition(slug: string): CollectionMeta | null {
  const clean = slug.toLowerCase().trim();
  if (STATIC_COLLECTIONS[clean]) {
    const def = STATIC_COLLECTIONS[clean];
    return {
      slug: clean,
      ...def,
      faqs: def.faqs || buildCollectionFaqs(def.title),
    };
  }

  // Handle brand aliases e.g. /collections/rasasi-perfumes or /collections/rasasi
  const strippedBrand = clean.replace(/-perfumes$/, "").replace(/^perfumes-/, "");
  const brands = getBrandSummaries();
  const matchedBrand = brands.find(
    (b) => b.slug === clean || b.slug === strippedBrand || (clean === "bvlagri" && b.slug === "bvlgari")
  );
  if (matchedBrand) {
    const title = `${matchedBrand.name} Perfumes`;
    return {
      slug: clean,
      title,
      eyebrow:
        matchedBrand.tier === "middle-eastern"
          ? "Middle Eastern House"
          : matchedBrand.tier === "niche"
            ? "Niche Perfumery"
            : matchedBrand.tier === "in-house"
              ? "In-House Signature"
              : "Designer House",
      description: `Shop 100% authentic ${matchedBrand.name} Eau de Parfums, Extraits, and boxed editions online in India with express pan-India delivery.`,
      seoDescription: `Buy original ${matchedBrand.name} perfumes online in India at Octopus Perfumes.`,
      filters: { brands: [matchedBrand.slug] },
      faqs: buildCollectionFaqs(title),
    };
  }

  return null;
}

export function getAllCollectionSlugs(): string[] {
  return Object.keys(STATIC_COLLECTIONS);
}

