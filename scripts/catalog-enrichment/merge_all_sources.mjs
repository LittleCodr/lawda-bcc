import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const APPLY = process.argv.includes("--apply");
const CACHE_PATH = path.join(rootDir, "scripts", "catalog-enrichment", ".cache_all_3_sources.json");
const PRODUCTS_PATH = path.join(rootDir, "lib", "data", "products.json");
const PROVENANCE_PATH = path.join(rootDir, "lib", "data", "enrichment_provenance.json");
const REPORT_PATH = path.join(rootDir, "lib", "data", "enrichment_report.json");

const STORE_VENDORS = new Set([
  "",
  "belvish",
  "belvis",
  "seema mehra",
  "perfume palace",
  "perfumepalace",
  "perfumepalace.in",
  "fridaycharm",
  "fridaycharm.com",
  "friday charm",
  "perfume network india",
  "miniature",
  "high end",
  "london",
  "room",
  "royal",
  "unknown",
  "generic",
  "n/a",
  "test",
]);

const BRAND_ALIASES = {
  dior: "Christian Dior",
  "christian dior": "Christian Dior",
  "j'adore l'or": "Christian Dior",
  "im rasasi": "Rasasi",
  "rasasi perfumes": "Rasasi",
  rasasi: "Rasasi",
  "lattafa perfumes": "Lattafa",
  "lattafa pride": "Lattafa",
  lattafa: "Lattafa",
  montblanc: "Mont Blanc",
  "mont blan": "Mont Blanc",
  montblan: "Mont Blanc",
  "mont blanc": "Mont Blanc",
  bvlagri: "Bvlgari",
  bvlgari: "Bvlgari",
  riiffs: "RiiFFS",
  "ibraheem al qurashi": "Ibraheem al Qurashi",
  "ibraheem al-qurashi": "Ibraheem al Qurashi",
  "ibrahim al qureshi": "Ibraheem al Qurashi",
  ibraq: "Ibraheem al Qurashi",
  "maison fragrance world": "Fragrance World",
  "fragrance world": "Fragrance World",
  "maison alhambra": "Maison Alhambra",
  "maision alhambra": "Maison Alhambra",
  "maison alhmabra": "Maison Alhambra",
  "masion alhambra": "Maison Alhambra",
  rabanne: "Paco Rabanne",
  "paco rabanne": "Paco Rabanne",
  ysl: "Yves Saint Laurent",
  "yves saint laurent": "Yves Saint Laurent",
  "yves saint-laurent": "Yves Saint Laurent",
  "d&g": "Dolce & Gabbana",
  "dolce and gabbana": "Dolce & Gabbana",
  "dolce & gabbana": "Dolce & Gabbana",
  "dolce & gabana": "Dolce & Gabbana",
  "dolce&gabbana": "Dolce & Gabbana",
  jpg: "Jean Paul Gaultier",
  "jean paul gaultier": "Jean Paul Gaultier",
  "jean paul": "Jean Paul Gaultier",
  armani: "Giorgio Armani",
  "giorgio armani": "Giorgio Armani",
  "emporio armani": "Emporio Armani",
  ck: "Calvin Klein",
  "calvin klein": "Calvin Klein",
  "calvin klien": "Calvin Klein",
  ch: "Carolina Herrera",
  "carolina herrera": "Carolina Herrera",
  pdm: "Parfums de Marly",
  "parfums de marly": "Parfums de Marly",
  "parfums de marly oajan": "Parfums de Marly",
  hermes: "Hermes",
  hermès: "Hermes",
  lancome: "Lancome",
  lancôme: "Lancome",
  "estee lauder": "Estee Lauder",
  "estée lauder": "Estee Lauder",
  mugler: "Thierry Mugler",
  "thierry mugler": "Thierry Mugler",
  "alien muggler": "Thierry Mugler",
  "etat libre d'orange": "Etat Libre d’Orange",
  "etat libre d’orange": "Etat Libre d’Orange",
  "etat libre d orange": "Etat Libre d’Orange",
  "etat libre": "Etat Libre d’Orange",
  "etat licre d'orange": "Etat Libre d’Orange",
  "perfumer's workshop": "Perfumer’s Workshop",
  "perfumer’s workshop": "Perfumer’s Workshop",
  "the perfumer's workshop": "Perfumer’s Workshop",
  "acqua di parma": "Acqua di Parma",
  "adp": "Acqua di Parma",
  "viktor & rolf": "Viktor & Rolf",
  "victor & rolf": "Viktor & Rolf",
  "viktor&rolf": "Viktor & Rolf",
  "narciso rodriguez": "Narciso Rodriguez",
  "narciso rodrigues": "Narciso Rodriguez",
  "mercedes benz": "Mercedes Benz",
  "mercedes-benz": "Mercedes Benz",
  mercedes: "Mercedes Benz",
  "maison francis kurkdjian": "Maison Francis Kurkdjian",
  mfk: "Maison Francis Kurkdjian",
  "bdk parfums": "BDK Parfums",
  bdk: "BDK Parfums",
  kilian: "Kilian",
  "by kilian": "Kilian",
  "kilian perfume": "Kilian",
  "kilian paris": "Kilian",
  "jo malone": "Jo Malone London",
  "jo malone london": "Jo Malone London",
  "penhaligon's": "Penhaligon's",
  penhaligons: "Penhaligon's",
  "abdul samad al qurashi": "Abdul Samad Al Qurashi",
  "abdul samadal": "Abdul Samad Al Qurashi",
  asaq: "Abdul Samad Al Qurashi",
  "al haramain": "Al Haramain",
  "ahmed al maghribi": "Ahmed Al Maghribi",
  "swiss arabian": "Swiss Arabian",
  "paris corner": "Paris Corner",
  "french avenue": "French Avenue",
  "arabiyat prestige": "Arabiyat Prestige",
  arabiyat: "Arabiyat",
  "gift set of arabiyat": "Arabiyat",
  "united colors of benetton": "United Colors of Benetton",
  ucb: "United Colors of Benetton",
  benetton: "United Colors of Benetton",
  "salvatore ferragamo": "Salvatore Ferragamo",
  "hugo boss": "Hugo Boss",
  boss: "Hugo Boss",
  "tommy hilfiger": "Tommy Hilfiger",
  "tom ford": "Tom Ford",
  tomford: "Tom Ford",
  "michael kors": "Michael Kors",
  "elizabeth arden": "Elizabeth Arden",
  "ralph lauren": "Ralph Lauren",
  "ralph lauren polo": "Ralph Lauren",
  ralph: "Ralph Lauren",
  "marc jacobs": "Marc Jacobs",
  "daisy wild": "Marc Jacobs",
  "issey miyake": "Issey Miyake",
  "jimmy choo": "Jimmy Choo",
  "john varvatos": "John Varvatos",
  "kenneth cole": "Kenneth Cole",
  "roberto cavalli": "Roberto Cavalli",
  "david beckham": "David Beckham",
  "sarah jessica parker": "Sarah Jessica Parker",
  "jennifer lopez": "Jennifer Lopez",
  "jennifer lopez glow": "Jennifer Lopez",
  "lolita lempicka": "Lolita Lempicka",
  "elie saab": "Elie Saab",
  "franck boclet": "Franck Boclet",
  "franck olivier": "Franck Olivier",
  "dumont paris": "Dumont Paris",
  dumont: "Dumont Paris",
  "reyane tradition": "Reyane Tradition",
  "jacques bogart": "Jacques Bogart",
  "costume national": "Costume National",
  "thomas kosmala": "Thomas Kosmala",
  "rosendo mateu": "Rosendo Mateu",
  "goutal paris": "Goutal Paris",
  goutal: "Goutal Paris",
  "annick goutal": "Goutal Paris",
  "eight&bob": "Eight&Bob",
  "eight & bob": "Eight&Bob",
  "maison margiela": "Maison Margiela",
  "maison margiela replica": "Maison Margiela",
  "maison crivelli": "Maison Crivelli",
  "memo paris": "Memo Paris",
  memo: "Memo Paris",
  "orto parisi": "Orto Parisi",
  "ex nihilo": "Ex Nihilo",
  "guy laroche": "Guy Laroche",
  "nina ricci": "Nina Ricci",
  "ermenegildo zegna": "Ermenegildo Zegna",
  "albait aldimashqi": "Albait Aldimashqi",
  "albait aldimashq": "Albait Aldimashqi",
  "taif al emarat": "Taif Al Emarat",
  "louis vuitton": "Louis Vuitton",
  chanel: "Chanel",
  "tiziana terenzi": "Tiziana Terenzi",
  "parfums de nicolai": "Parfums de Nicolai",
  nicolai: "Parfums de Nicolai",
  "atelier cologne": "Atelier Cologne",
  "atelier des ors": "Atelier des Ors",
  "telier des ors": "Atelier des Ors",
  "escentric molecules": "Escentric Molecules",
  diptyque: "Diptyque",
  "le labo": "Le Labo",
  "frederic malle": "Frederic Malle",
  "fredric malle": "Frederic Malle",
  gueralian: "Guerlain",
  "guerlain absolus": "Guerlain",
  guerlain: "Guerlain",
  havex: "Havex",
  cosmo: "Cosmo",
  "antonio puig": "Antonio Puig",
  "7 scents": "7 Scents",
  "paloma picasso": "Paloma Picasso",
  "anna sui": "Anna Sui",
  "al fares": "Al Fares",
  "boadicea the victorious": "Boadicea the Victorious",
  bodaciea: "Boadicea the Victorious",
  "m. micallef": "M. Micallef",
  "m.micallef": "M. Micallef",
  "goldfield & banks": "Goldfield & Banks",
  "goldfield & banks australia": "Goldfield & Banks",
  "state of mind": "State of Mind",
  tocca: "Tocca",
  "d.s. & durga": "D.S. & Durga",
  "ds durga": "D.S. & Durga",
  "imaginary authors": "Imaginary Authors",
  "bottega veneta": "Bottega Veneta",
  "gars parfums": "Gars Parfums",
  "unique'e luxury": "Unique'e Luxury",
  "unique’e luxury": "Unique'e Luxury",
  "uniquee luxury": "Unique'e Luxury",
  "v canto": "V Canto",
  "the woods collection": "The Woods Collection",
  "the wood collection": "The Woods Collection",
  moresque: "Moresque",
  baldessarini: "Baldessarini",
  "karl lagerfeld": "Karl Lagerfeld",
  "perry ellis": "Perry Ellis",
  "philipp plein": "Philipp Plein",
  nikos: "Nikos",
  coty: "Coty",
  "histoires de parfums": "Histoires de Parfums",
  "ted lapidus": "Ted Lapidus",
  balenciaga: "Balenciaga",
  aquolina: "Aquolina",
  "mandarina duck": "Mandarina Duck",
  rihanna: "Rihanna",
  kajal: "Kajal",
  damishq: "Damishq",
  grandeur: "Grandeur",
  gres: "Gres",
  "robert graham": "Robert Graham",
  amouage: "Amouage",
  initio: "Initio",
  "initio parfum": "Initio",
  creed: "Creed",
  xerjoff: "Xerjoff",
  nishane: "Nishane",
  hacivat: "Nishane",
  mancera: "Mancera",
  montale: "Montale",
  byredo: "Byredo",
  prada: "Prada",
  gucci: "Gucci",
  givenchy: "Givenchy",
  "givenchy gentleman": "Givenchy",
  cartier: "Cartier",
  chopard: "Chopard",
  azzaro: "Azzaro",
  davidoff: "Davidoff",
  "davi doff": "Davidoff",
  bentley: "Bentley",
  boucheron: "Boucheron",
  lacoste: "Lacoste",
  lalique: "Lalique",
  moschino: "Moschino",
  "miu miu": "Miu Miu",
  missoni: "Missoni",
  nasomatto: "Nasomatto",
  nautica: "Nautica",
  valentino: "Valentino",
  kenzo: "Kenzo",
  clinique: "Clinique",
  coach: "Coach",
  dunhill: "Dunhill",
  "dunhill london": "Dunhill",
  jaguar: "Jaguar",
  police: "Police",
  rochas: "Rochas",
  titan: "Titan",
  dkny: "DKNY",
  burberry: "Burberry",
  "my burberry": "Burberry",
  versace: "Versace",
  casamorati: "Casamorati",
  trussardi: "Trussardi",
  cerruti: "Cerruti",
  tabac: "Tabac",
  halloween: "Halloween",
  guess: "Guess",
  "joop!": "JOOP!",
  joop: "JOOP!",
  armaf: "Armaf",
  afnan: "Afnan",
  ajmal: "Ajmal",
  ajma: "Ajmal",
  flavia: "Flavia",
  khadlaj: "Khadlaj",
  rayhaan: "Rayhaan",
  rahyaan: "Rayhaan",
  zimaya: "Zimaya",
  nusuk: "Nusuk",
  "rue broca": "Rue Broca",
  "maison asrar": "Maison Asrar",
  "al wataniah": "Al Wataniah",
  hamidi: "Hamidi",
  hamdi: "Hamidi",
  naseem: "Naseem",
  khalis: "Khalis",
  birra: "Birra",
  bira: "Birra",
  bujairami: "Bujairami",
  mykonos: "Mykonos",
  jawhara: "Jawhara",
  "colour me": "Colour Me",
  "colors me": "Colour Me",
  carrera: "Carrera",
  bourjois: "Bourjois",
  "ard al zaffaran": "Ard Al Zaafaran",
  "ard al zaafaran": "Ard Al Zaafaran",
  "ard al zaafran": "Ard Al Zaafaran",
  fendi: "Fendi",
  "remy latour": "Remy Latour",
  "bond no 9": "Bond No. 9",
  "bond no. 9": "Bond No. 9",
  "bond no.9": "Bond No. 9",
  majestic: "Majestic",
  "roja parfums": "Roja Parfums",
  roja: "Roja Parfums",
  "banana republic": "Banana Republic",
  "s.t. dupont": "S.T. Dupont",
  "st dupont": "S.T. Dupont",
  parisbelle: "ParisBelle",
  "paris belle": "ParisBelle",
  "rp paris": "RP Paris",
  rpparis: "RP Paris",
  "tad angel": "Tad Angel",
  tadangel: "Tad Angel",
  "alezz oud": "Alezz Oud",
  "al ezz oud": "Alezz Oud",
  "nobile 1942": "Nobile 1942",
  "noble 1942": "Nobile 1942",
  "nylaa by rasasi": "Nylaa By Rasasi",
  "rasasi nylaa": "Nylaa By Rasasi",
  chloe: "Chloe",
  chloé: "Chloe",
  "victoria's secret": "Victoria's Secret",
  "victoria secret": "Victoria's Secret",
  "serge lutens": "Serge Lutens",
  "sergee lutens": "Serge Lutens",
  "liquides imaginaires": "Liquides Imaginaires",
  "liquides imaginaire": "Liquides Imaginaires",
  "atkinson 1799": "Atkinson 1799",
  atkinson: "Atkinson 1799",
  "scentstory": "Scentstory",
  "24 scentstory": "Scentstory",
  "thameen": "Thameen",
  "thameen london": "Thameen",
  surrati: "Surrati",
  suraati: "Surrati",
  "just jack": "Just Jack",
  justjack: "Just Jack",
};

// Known iconic Belvish signature lines (when brand omitted from title)
const SIGNATURE_LINE_TO_BRAND = [
  [/\b(bleu de chanel|bdc\b|allure homme|coco mademoiselle|no\.?\s*5|n°\s*5|sycomore|coromandel|le lion|egoiste|antaeus|gabrielle|chance\s+(eau|edp|edt)|jersey\s+(edp|\d)|bel respiro|1957\s+(edp|\d))\b/i, "Chanel"],
  [/\b(oud silk mood|oud satin mood|baccarat rouge|grand soir|gentle fluidity|amyris homme|petit matin|oud extrait)\b/i, "Maison Francis Kurkdjian"],
  [/\b(naxos|erba pura|zefiro|renaissance|kobe)\b/i, "Xerjoff"],
  [/\b(irish leather|african leather|italian leather|russian leather|moroccan leather|sicilian leather|ocean leather|french leather|oriental leather|iberian leather|winter palace|sintra|marfa|ilha do mel|flam\s+edp|madurai|tamarindo|corfu|argentina\s+edp|vaadhoo)\b/i, "Memo Paris"],
  [/\b(oud for greatness|musk therapy|oud\s+for\s+greatness)\b/i, "Initio"],
  [/\b(galloway)\b/i, "Parfums de Marly"],
  [/\b(overture man|overture women|honour man|dia man|jubilation xxv|opus\s+[ivx]+|gold man|lineage)\b/i, "Amouage"],
  [/\b(fan your flames|ambra calabria|nanshe\s+extrait)\b/i, "Nishane"],
  [/\b(cedrat boise|black to black|intense black aoud|rose omeyyade|jannat\s+edp|Cherry Oud)\b/i, "Mancera"],
  [/\b(le gemme)\b/i, "Bvlgari"],
  [/\b(l'homme ideal|aqua allegoria|cuir intense)\b/i, "Guerlain"],
  [/\b(amber oud\s+(aqua|tobacco))\b/i, "Al Haramain"],
  [/\b(dioriviera|oud ispahan|gris dior)\b/i, "Christian Dior"],
  [/\b(l'interdit)\b/i, "Givenchy"],
  [/\b(musc noir rose)\b/i, "Narciso Rodriguez"],
  [/\b(ambre sultan)\b/i, "Serge Lutens"],
  [/\b(tk\s*no\.?\s*3)\b/i, "Thomas Kosmala"],
  [/\b(hugo extreme)\b/i, "Hugo Boss"],
  [/\b(noir absolu|musc essence|oud essence)\b/i, "Valentino"],
  [/\b(patchouli intense|iris fauve|musc immortel)\b/i, "Nicolai Parfumeur Createur"],
  [/\b(tiger's nest|pomelo riviera)\b/i, "Memo Paris"],
  [/\b(im nectar d'issey)\b/i, "Issey Miyake"],
  [/\b(aspen\s+pour\s+homme|aspen\s+cologne)\b/i, "Coty"],
];

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
  const txt = decodeHtml(raw).replace(/[\[\]()]/g, "").trim();
  if (!txt) return [];
  return Array.from(
    new Set(
      txt
        .split(/,|•|&|\band\b|\|/i)
        .map((s) => s.replace(/^[\s\-:;]+|[\s\-:;.]+$/g, "").trim())
        .filter((s) => s.length >= 2 && s.length <= 42)
    )
  ).slice(0, 10);
}

function extractStructuredNotes(bodyHtml = "") {
  if (!bodyHtml) return null;
  const top = [];
  const heart = [];
  const base = [];

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

function sanitizeUtf16(str = "") {
  return String(str).replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );
}

function scrubBodyHtml(html = "") {
  if (!html) return "";
  let cleaned = sanitizeUtf16(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<a\b[^>]*href=["']https?:\/\/(?:www\.)?(?:perfumepalace\.in|belvish\.com|fridaycharm\.com|perfumenetwork\.in)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/\b(?:perfume\s*palace|belvish|friday\s*charm|fridaycharm\.com|perfume\s*network\s*india)\b/gi, "Octopus Perfumes")
    .replace(/<p[^>]*>\s*<strong>Please Note:<\/strong>[\s\S]*?<\/p>/gi, "")
    .replace(/\s+(?:style|class|width|height|dir|id|data-[a-z0-9-]+)=["'][^"']*["']/gi, "")
    .replace(/<\/?span>/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length > 2200) {
    // Codepoint-safe trim so emojis / UTF-16 surrogate pairs are never split mid-pair
    const plainChars = Array.from(sanitizeUtf16(decodeHtml(cleaned)));
    const sliced = plainChars.slice(0, 1400).join("").trim();
    cleaned = `<p>${sliced}${plainChars.length > 1400 ? "..." : ""}</p>`;
  }
  return sanitizeUtf16(cleaned);
}

const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
const existingRaw = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
const prevProvenance = fs.existsSync(PROVENANCE_PATH)
  ? JSON.parse(fs.readFileSync(PROVENANCE_PATH, "utf8"))
  : {};

// Build complete canonical house map
const knownBrandMap = new Map(Object.entries(BRAND_ALIASES));
for (const p of existingRaw) {
  if (/^(Perfume|Perfume & Cologne|perf)$/i.test(p.product_type || "")) {
    const v = (p.vendor || "").trim();
    if (v && !STORE_VENDORS.has(v.toLowerCase())) {
      const k = v.toLowerCase();
      if (!knownBrandMap.has(k)) knownBrandMap.set(k, v);
    }
  }
}
for (const srcKey of ["fridaycharm", "perfumepalace"]) {
  for (const p of cache[srcKey].products) {
    const v = (p.vendor || "").trim();
    if (v && !STORE_VENDORS.has(v.toLowerCase()) && v.length >= 2) {
      const k = v.toLowerCase();
      if (!knownBrandMap.has(k)) {
        knownBrandMap.set(k, BRAND_ALIASES[k] || v);
      }
    }
  }
}

const sortedBrandKeys = Array.from(knownBrandMap.keys())
  .filter((k) => k.length >= 3)
  .sort((a, b) => b.length - a.length);

function resolveCanonicalBrand(vendor, title, tags = [], bodyHtml = "") {
  const vTrim = String(vendor || "").trim();
  const vLow = vTrim.toLowerCase();
  if (vTrim && !STORE_VENDORS.has(vLow)) {
    return BRAND_ALIASES[vLow] || knownBrandMap.get(vLow) || vTrim;
  }

  const tNorm = String(title || "")
    .replace(/^(decant\s*\/?\s*sample|decant|sample|miniature|vial|of)\s*[-:|]?\s*/gi, "")
    .toLowerCase();

  for (const bk of sortedBrandKeys) {
    const esc = bk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`^${esc}(?:\\b|\\s|$|-)`, "i").test(tNorm)) {
      return knownBrandMap.get(bk);
    }
  }

  const hay = `${title} ${(tags || []).join(" ")}`.toLowerCase();
  for (const bk of sortedBrandKeys) {
    const esc = bk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?:^|\\b)${esc}(?:\\b|$)`, "i").test(hay)) {
      return knownBrandMap.get(bk);
    }
  }

  for (const [rx, brandName] of SIGNATURE_LINE_TO_BRAND) {
    if (rx.test(title)) return brandName;
  }

  const plainBody = decodeHtml(bodyHtml).slice(0, 600).toLowerCase();
  for (const bk of sortedBrandKeys) {
    if (bk.length < 5) continue;
    const esc = bk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?:by|from|house of)\\s+${esc}\\b`, "i").test(plainBody)) {
      return knownBrandMap.get(bk);
    }
  }

  return "Designer Fragrance House";
}

function detectConcentration(text = "") {
  const t = text.toLowerCase();
  if (/\bextrait de parfum\b|\bextrait\b/.test(t)) return "extrait";
  if (/\beau de parfum\b|\bedp\b/.test(t)) return "edp";
  if (/\beau de toilette\b|\bedt\b/.test(t)) return "edt";
  if (/\beau de cologne\b|\bedc\b/.test(t)) return "edc";
  if (/\belixir\b/.test(t)) return "elixir";
  if (/\ble parfum\b|\bparfum\b/.test(t)) return "parfum";
  if (/\battar\b|\bconcentrated perfume oil\b|\bperfume oil\b/.test(t)) return "attar";
  if (/\bdeodorant\b|\bdeo\b/.test(t)) return "deo";
  if (/\bbody mist\b|\bmist\b/.test(t)) return "mist";
  if (/\baftershave\b|\bafter shave\b/.test(t)) return "aftershave";
  return "";
}

function detectFormat(title = "", pType = "", variants = []) {
  const t = `${title} ${pType} ${variants.map((v) => v.title || "").join(" ")}`.toLowerCase();
  if (/\bdecant\b/.test(t)) return "decant";
  if (/\bsample\b|\bvial\b|\btesting\b/.test(t)) return "sample";
  if (/\bminiature\b|\bmini\b|\bdab\b/.test(t)) return "miniature";
  if (/\bgift set\b|\bcoffret\b|\bdiscovery set\b|\b3pcs\b|\b2pcs\b|\bduo\b|\bcombo\b|\btrio\b/.test(t)) return "giftset";
  if (/\btravel spray\b|\brefill\b/.test(t)) return "travel";
  if (/\bdeodorant\b|\bdeo\b/.test(t)) return "deo";
  if (/\bshower gel\b|\bbody wash\b|\bbody lotion\b/.test(t)) return "bodycare";
  if (/\bafter\s*shave\b/.test(t)) return "aftershave";
  if (/\bbakhoor\b|\bbukhoor\b/.test(t)) return "bakhoor";
  return "bottle";
}

function detectAllSizesMl(title = "", variants = []) {
  const sizes = new Set();
  const strs = [title, ...variants.map((v) => `${v.title || ""} ${v.option1 || ""}`)];
  for (const s of strs) {
    const matches = String(s).matchAll(/(\d+(?:\.\d+)?)\s*ml\b/gi);
    for (const m of matches) {
      sizes.add(Math.round(parseFloat(m[1]) * 10) / 10);
    }
  }
  return Array.from(sizes).sort((a, b) => a - b);
}

function detectGender(text = "") {
  const t = text.toLowerCase();
  if (/\bmen & women\b|\bmen and women\b|\bfor women and men\b|\bfor him \+ her\b|\bunisex\b/.test(t)) return "unisex";
  if (/\bfor women\b|\bfor her\b|\bpour femme\b|\bwomen\b|\bfemme\b/.test(t)) return "women";
  if (/\bfor men\b|\bfor him\b|\bpour homme\b|\bmen\b|\bhomme\b/.test(t)) return "men";
  return "";
}

function canonicalCoreName(title = "", resolvedBrand = "") {
  let s = String(title || "").toLowerCase();
  if (resolvedBrand) {
    s = s.replace(new RegExp(`\\b${resolvedBrand.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), " ");
  }
  for (const alias of Object.keys(BRAND_ALIASES)) {
    if (alias.length >= 4) {
      s = s.replace(new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), " ");
    }
  }
  s = s
    .replace(/\beau de parfum\b|\beau de toilette\b|\beau de cologne\b|\bextrait de parfum\b|\ble parfum\b|\bparfum\b|\bedp\b|\bedt\b|\bedc\b|\bextrait\b/g, " ")
    .replace(/\bfor men & women\b|\bfor men and women\b|\bfor women and men\b|\bfor men\b|\bfor women\b|\bfor him\b|\bfor her\b|\bunisex\b|\bpour homme\b|\bpour femme\b/g, " ")
    .replace(/\b\d+(?:\.\d+)?\s*ml\b/g, " ")
    .replace(/\b(perfume|cologne|fragrance|spray|original|authentic|tester|decant|vial|sample|miniature|mini|dab|by|the|in|india|pure|with|pouch)\b/g, " ")
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
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  return (2 * inter) / (setA.size + setB.size);
}

function buildFeatureProfile(raw, resolvedBrand) {
  const brandLow = (resolvedBrand || "").toLowerCase();
  const conc = detectConcentration(raw.title) || detectConcentration(raw.product_type || "");
  const format = detectFormat(raw.title, raw.product_type || "", raw.variants || []);
  const sizesMl = detectAllSizesMl(raw.title, raw.variants || []);
  const primarySizeMl = sizesMl.length > 0 ? sizesMl[sizesMl.length - 1] : null;
  const gender = detectGender(`${raw.title} ${(Array.isArray(raw.tags) ? raw.tags.join(" ") : raw.tags || "")}`);
  const core = canonicalCoreName(raw.title, resolvedBrand);
  const skus = (raw.variants || [])
    .map((v) => String(v.sku || "").trim().toLowerCase())
    .filter((s) => s.length >= 3);
  return { brand: resolvedBrand, brandLow, conc, format, sizesMl, primarySizeMl, gender, core, skus };
}

function computeMatchScore(profA, profB, rawA, rawB) {
  if (
    String(rawA.id) === String(rawB.id) ||
    (rawA.source_metadata?.source_product_id &&
      String(rawA.source_metadata.source_product_id) === String(rawB.id))
  ) {
    return { confidence: 100, reason: "Exact product ID / source ID" };
  }
  if (profB.skus.some((s) => profA.skus.includes(s))) {
    return { confidence: 100, reason: "Exact SKU" };
  }
  if (rawA.handle === rawB.handle && rawB.handle.length > 5) {
    return { confidence: 99, reason: "Exact handle" };
  }
  if (profA.brandLow && profB.brandLow && profA.brandLow !== profB.brandLow) {
    return { confidence: 0, reason: "Brand mismatch" };
  }
  if (profA.format !== profB.format) {
    return { confidence: 18, reason: `Format mismatch (${profA.format} vs ${profB.format})` };
  }
  if (profA.conc && profB.conc && profA.conc !== profB.conc) {
    return { confidence: 65, reason: `Conc mismatch (${profA.conc} vs ${profB.conc})` };
  }
  if (profA.gender && profB.gender && profA.gender !== profB.gender) {
    return { confidence: 68, reason: `Gender mismatch (${profA.gender} vs ${profB.gender})` };
  }

  const sim = tokenSimilarity(profA.core, profB.core);
  if (sim < 0.72) return { confidence: Math.round(sim * 60), reason: "Low core similarity" };

  let score = Math.round(sim * 78);
  if (profA.brandLow && profB.brandLow && profA.brandLow === profB.brandLow) score += 12;
  if (profA.conc && profB.conc && profA.conc === profB.conc) score += 7;
  else score += 2;

  if (profA.sizesMl.length > 0 && profB.sizesMl.length > 0) {
    const overlaps = profB.sizesMl.some((sb) => profA.sizesMl.some((sa) => Math.abs(sa - sb) <= 1));
    if (overlaps) score += 5;
    else {
      return { confidence: Math.min(82, score), reason: "Different bottle size" };
    }
  }

  return { confidence: Math.max(0, Math.min(100, score)), reason: "Multi-attribute match" };
}

function isExcludedItem(p, sourceKey) {
  const title = (p.title || "").trim();
  const pType = (p.product_type || "").trim();
  const vendorLow = (p.vendor || "").trim().toLowerCase();

  if (!title || !p.handle) return "missing_title_or_handle";
  if (!Array.isArray(p.images) || p.images.length === 0 || !p.images[0]?.src) return "missing_image";
  const vars = Array.isArray(p.variants) ? p.variants : [];
  if (vars.length === 0 || vars.every((v) => !Number(v.price) || Number(v.price) <= 0)) return "zero_price";

  if (/\b(gift\s*card|e-?gift|blotter|t(?:e|a)ster\s*strips|carry\s*bag|empty\s*bottle|atomizer\s*bottle|rain\s*poncho|rain\s*coat|incense\s*stick|fragrance\s*sticks|bakhoor\s+burner|scented\s*candle|candle\s*bougie|liquid\s*hand\s*&?\s*body\s*soap)\b/i.test(`${title} ${pType}`)) {
    return "non_perfume_merch";
  }
  if (/^(Burner|Bakhoor Burner|Soap|Bath Soap|Hand Sanitizer|Sanitizer Spray|Medicated Oil|Atomizer Bottle|Shaving Foam|Fragrance Candle|Fragrance Sticks)$/i.test(pType)) {
    return "non_perfume_type";
  }
  if ((sourceKey === "fridaycharm" && /^friday\s*charm/i.test(title)) || (sourceKey === "perfumepalace" && /^perfume\s*palace|^decant\/sample\s+perfume\s*palace/i.test(title)) || vendorLow === "fridaycharm.com") {
    if (/fridaycharm|perfume palace|burner|sticks|poncho/i.test(`${title} ${pType}`)) {
      return "competitor_house_merch";
    }
  }
  return null;
}

// 1. Index existing perfumes (keep ALL 2,333 existing untouched except ensuring 100% in-stock)
const localPerfumes = existingRaw.filter((p) => /^(Perfume|Perfume & Cologne|perf)$/i.test(p.product_type || ""));
const existingHandleSet = new Set(existingRaw.map((p) => p.handle));
const existingIdSet = new Set(existingRaw.map((p) => String(p.id)));
let maxExistingId = 0;
for (const p of existingRaw) {
  const num = Number(p.id);
  if (Number.isFinite(num) && num > maxExistingId) maxExistingId = num;
}

const byBrandIndex = new Map();
for (const p of localPerfumes) {
  const b = BRAND_ALIASES[(p.vendor || "").trim().toLowerCase()] || (p.vendor || "").trim();
  const prof = buildFeatureProfile(p, b);
  const item = { raw: p, prof, hasNotes: extractStructuredNotes(p.body_html) !== null };
  const bucketKey = prof.brandLow || "_unknown";
  if (!byBrandIndex.has(bucketKey)) byBrandIndex.set(bucketKey, []);
  byBrandIndex.get(bucketKey).push(item);
}

// 2. Collect candidates across Perfume Palace, Belvish, FridayCharm
// Priority when merging cross-source duplicates: FridayCharm & Perfume Palace often have cleaner multi-variant/vendor data, Belvish often has rich note tables
const excludedStats = { perfumepalace: {}, belvish: {}, fridaycharm: {} };
const crossSourceMap = new Map();
let totalValidAcrossAll3 = 0;

for (const sourceKey of ["fridaycharm", "perfumepalace", "belvish"]) {
  const sourceDomain =
    sourceKey === "perfumepalace"
      ? "perfumepalace.in"
      : sourceKey === "belvish"
        ? "belvish.com"
        : "fridaycharm.com";

  for (const raw of cache[sourceKey].products) {
    const excl = isExcludedItem(raw, sourceKey);
    if (excl) {
      excludedStats[sourceKey][excl] = (excludedStats[sourceKey][excl] || 0) + 1;
      continue;
    }
    totalValidAcrossAll3++;

    const brand = resolveCanonicalBrand(raw.vendor, raw.title, raw.tags, raw.body_html);
    const prof = buildFeatureProfile(raw, brand);
    const notes = extractStructuredNotes(raw.body_html);
    const sizeKey = prof.sizesMl.join(",");
    const dedupKey = `${prof.brandLow}|${prof.core}|${prof.conc}|${prof.format}|${sizeKey}`;

    const candidateObj = { ...raw, sourceKey, sourceDomain, brand, prof, notes };
    const existingCand = crossSourceMap.get(dedupKey);
    if (!existingCand) {
      crossSourceMap.set(dedupKey, candidateObj);
    } else {
      // Merge helpful metadata without duplicating listing:
      // Upgrade if candidate has structured notes and current does not, or more images/variants
      if (!existingCand.notes && notes) existingCand.notes = notes;
      if (notes && (!existingCand.body_html || !extractStructuredNotes(existingCand.body_html))) {
        existingCand.body_html = raw.body_html;
      }
      if ((raw.images?.length || 0) > (existingCand.images?.length || 0)) {
        existingCand.images = raw.images;
      }
    }
  }
}

console.log("Total valid across 3 stores (after excluding junk/hardware/zero-price):", totalValidAcrossAll3);
console.log("Exclusions per source:", JSON.stringify(excludedStats));
console.log("Unique cross-source candidates after cross-store dedup:", crossSourceMap.size);

// 3. Deduplicate against existing live catalog + also secondary same-brand similarity dedup across the new candidates themselves!
const existingSourceIds = new Set(
  existingRaw
    .map((p) => String(p.source_metadata?.source_product_id || ""))
    .filter(Boolean)
);
const nextProvenance = { ...prevProvenance };
let matchedExistingCount = 0;
let newlyEnrichedExistingCount = 0;
const newToImport = [];
const addedByBrandBucket = new Map();
let crossStoreFuzzyDupesRemoved = 0;

for (const cand of crossSourceMap.values()) {
  if (existingSourceIds.has(String(cand.id)) || existingIdSet.has(String(cand.id))) {
    matchedExistingCount++;
    continue;
  }
  const bucket = byBrandIndex.get(cand.prof.brandLow) || [];
  let bestLocal = null;
  let bestScore = { confidence: 0 };

  for (const local of bucket) {
    const res = computeMatchScore(local.prof, cand.prof, local.raw, cand);
    if (res.confidence > bestScore.confidence) {
      bestScore = res;
      bestLocal = local;
    }
  }

  if (bestLocal && bestScore.confidence >= 90) {
    matchedExistingCount++;
    const h = bestLocal.raw.handle;
    if (!bestLocal.hasNotes && cand.notes && !nextProvenance[h]) {
      newlyEnrichedExistingCount++;
      nextProvenance[h] = {
        source_name: cand.sourceDomain,
        source_url: cand.source_url,
        source_product_id: String(cand.id),
        extracted_at: cache.extractedAt,
        matching_confidence: bestScore.confidence,
        notes: cand.notes,
        inferred_concentration: cand.prof.conc || undefined,
        inferred_gender: cand.prof.gender || undefined,
      };
    }
    continue;
  }

  // Secondary fuzzy dedup against ALREADY accepted new imports in same brand (catches punctuation/spacing wording diffs across 3 stores!)
  const newBucket = addedByBrandBucket.get(cand.prof.brandLow) || [];
  let dupOfNew = false;
  for (const acc of newBucket) {
    const res = computeMatchScore(acc.prof, cand.prof, acc, cand);
    if (res.confidence >= 92) {
      dupOfNew = true;
      if (!acc.notes && cand.notes) acc.notes = cand.notes;
      break;
    }
  }
  if (dupOfNew) {
    crossStoreFuzzyDupesRemoved++;
    continue;
  }

  addedByBrandBucket.set(cand.prof.brandLow, [...newBucket, cand]);
  newToImport.push(cand);
}

const bySourceFinal = {};
let designerCount = 0;
let sourceOutOfStockCount = 0;
for (const item of newToImport) {
  bySourceFinal[item.sourceDomain] = (bySourceFinal[item.sourceDomain] || 0) + 1;
  if (item.brand === "Designer Fragrance House") designerCount++;
  if ((item.variants || []).every((v) => v.available === false)) sourceOutOfStockCount++;
}

console.log({
  matchedExistingSkipped: matchedExistingCount,
  newlyEnrichedExisting: newlyEnrichedExistingCount,
  crossStoreFuzzyDupesRemoved,
  newUniqueToImport: newToImport.length,
  bySourceFinal,
  fallbackUnresolvedBrandCount: designerCount,
  sourceOutOfStockBeingRestocked: sourceOutOfStockCount,
  projectedTotalProductsInJson: existingRaw.length + newToImport.length,
  projectedTotalPerfumesActive: localPerfumes.length + newToImport.length,
});

if (!APPLY) {
  console.log("\nDRY RUN complete. Pass --apply to write lib/data/products.json & enrichment files.");
  process.exit(0);
}

// 4. Restock ALL existing items too (safety pass) and format newly imported items cleanly + compactly
let nextVarId = 9000000000000;
const usedVarIds = new Set();
for (const p of existingRaw) {
  if (p.available === false) p.available = true;
  for (const v of p.variants || []) {
    if (v.available === false) v.available = true;
    usedVarIds.add(String(v.id));
  }
}

const nowIso = new Date().toISOString();
const formattedNewProducts = [];

for (const cand of newToImport) {
  let newId = String(cand.id);
  while (existingIdSet.has(newId)) {
    maxExistingId += 1;
    newId = String(maxExistingId);
  }
  existingIdSet.add(newId);

  let handle = String(cand.handle)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!handle) handle = `fragrance-${newId}`;
  if (existingHandleSet.has(handle)) {
    const suffix = cand.sourceKey === "perfumepalace" ? "pp" : cand.sourceKey === "belvish" ? "bv" : "fc";
    let candidateHandle = `${handle}-${suffix}`;
    let counter = 2;
    while (existingHandleSet.has(candidateHandle)) {
      candidateHandle = `${handle}-${suffix}-${counter++}`;
    }
    handle = candidateHandle;
  }
  existingHandleSet.add(handle);

  const validVariants = (cand.variants || [])
    .filter((v) => Number(v.price) > 0)
    .map((v) => {
      let vid = v.id ? String(v.id) : String(++nextVarId);
      while (usedVarIds.has(vid)) {
        vid = String(++nextVarId);
      }
      usedVarIds.add(vid);

      const priceNum = Number(v.price);
      const compareNum = v.compare_at_price ? Number(v.compare_at_price) : null;
      const validCompare = compareNum && compareNum > priceNum ? compareNum.toFixed(2) : null;

      return {
        id: Number(vid) || vid,
        product_id: Number(newId) || newId,
        title: (v.title || "Default Title").trim(),
        option1: v.option1 || v.title || "Default Title",
        sku: v.sku || null,
        price: priceNum.toFixed(2),
        compare_at_price: validCompare,
        available: true, // RESTOCKED TO 100% IN-STOCK
        ...(v.featured_image?.src ? { featured_image: { src: v.featured_image.src } } : {}),
      };
    });

  if (validVariants.length === 0) continue;

  const cleanImages = (cand.images || [])
    .filter((im) => im && im.src)
    .slice(0, 3)
    .map((im, idx) => ({
      id: im.id || Number(`${newId}${idx}`),
      src: im.src,
      alt: im.alt ? scrubBodyHtml(im.alt).replace(/<[^>]+>/g, "").trim() : `${cand.title} by ${cand.brand}`,
    }));

  if (cleanImages.length === 0) continue;

  const cleanHtml = scrubBodyHtml(cand.body_html || "");
  if (cand.notes && !nextProvenance[handle]) {
    nextProvenance[handle] = {
      source_name: cand.sourceDomain,
      source_url: cand.source_url,
      source_product_id: String(cand.id),
      extracted_at: cache.extractedAt,
      matching_confidence: 100,
      notes: cand.notes,
      inferred_concentration: cand.prof.conc || undefined,
      inferred_gender: cand.prof.gender || undefined,
    };
  }

  formattedNewProducts.push({
    id: Number(newId) || newId,
    title: cand.title.trim(),
    handle,
    body_html: cleanHtml,
    published_at: cand.published_at || cache.extractedAt || nowIso,
    created_at: cand.created_at || cache.extractedAt || nowIso,
    vendor: cand.brand,
    product_type: "Perfume & Cologne",
    tags: (cand.tags || [])
      .filter((t) => !/belvish|perfume\s*palace|friday\s*charm/i.test(t))
      .slice(0, 6),
    variants: validVariants,
    images: cleanImages,
    source_metadata: {
      source: cand.sourceDomain,
      source_url: cand.source_url,
      source_product_id: String(cand.id),
      originally_available: (cand.variants || []).some((v) => v.available !== false),
      restocked_at: nowIso,
      in_stock: true,
    },
  });
}

function deepSanitizeUtf16(val) {
  if (typeof val === "string") return sanitizeUtf16(val);
  if (Array.isArray(val)) return val.map(deepSanitizeUtf16);
  if (val && typeof val === "object") {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = deepSanitizeUtf16(v);
    return out;
  }
  return val;
}

const finalCatalog = deepSanitizeUtf16([...existingRaw, ...formattedNewProducts]);
const cleanProv = deepSanitizeUtf16(nextProvenance);
fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(finalCatalog));
fs.writeFileSync(PROVENANCE_PATH, JSON.stringify(cleanProv));

const report = {
  stats: {
    runAt: nowIso,
    discoveredFromFridayCharm: cache.fridaycharm.count,
    discoveredFromPerfumePalace: cache.perfumepalace.count,
    discoveredFromBelvish: cache.belvish.count,
    totalDiscoveredRaw: cache.fridaycharm.count + cache.perfumepalace.count + cache.belvish.count,
    excludedPerSource: excludedStats,
    uniqueAcrossAllThreeSources: crossSourceMap.size,
    existingMatchedSkippedDuplicate: matchedExistingCount,
    crossStoreFuzzyDupesRemoved,
    existingProductsEnrichedTotal: Object.keys(nextProvenance).length,
    newlyEnrichedExistingCount,
    newlyImportedUniquePerfumes: formattedNewProducts.length,
    newlyImportedBySource: bySourceFinal,
    restockedOutOfStockSourceItems: sourceOutOfStockCount,
    finalTotalCatalogEntries: finalCatalog.length,
    failedUrls: [
      ...cache.fridaycharm.failedUrls,
      ...cache.perfumepalace.failedUrls,
      ...cache.belvish.failedUrls,
    ],
  },
};
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
console.log("\n=== APPLIED MERGE SUCCESSFULLY ===");
console.log(JSON.stringify(report.stats, null, 2));
