import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const productsPath = path.join(rootDir, "lib", "data", "products.json");
const outputPath = path.join(rootDir, "public", "feed.csv");

const DOMAIN = "https://www.octopusperfume.in";

function escapeCsvField(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  }
  return str;
}

function cleanDescription(html, fallbackTitle) {
  if (!html) {
    return `${fallbackTitle} 100% authentic luxury perfume with free pan-India express shipping.`;
  }
  let text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>|<\/div>|<\/li>|<\/tr>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/\s+/g, " ")
    .trim();

  // Strip competitor URLs
  text = text.replace(/https?:\/\/[^\s]+/gi, "");
  text = text.replace(/Perfume Network\s*India|Perfume\s*Palace|Friday\s*Charm|Belvish/gi, "Octopus Perfumes");

  if (text.length > 900) {
    text = text.substring(0, 897) + "...";
  }
  return text || `${fallbackTitle} 100% authentic luxury perfume with free pan-India express shipping.`;
}

function detectGender(title, tags) {
  const t = `${title} ${Array.isArray(tags) ? tags.join(" ") : ""}`.toLowerCase();
  if (/\bunisex\b|\bfor women and men\b|\bfor men and women\b/.test(t)) return "unisex";
  if (/\bfor women\b|\bwomen\b|\bfemme\b|\bpour femme\b|\bher\b|\bwoman\b/.test(t)) return "female";
  if (/\bfor men\b|\bmen\b|\bhomme\b|\bpour homme\b|\bhim\b|\bman\b/.test(t)) return "male";
  return "unisex";
}

function normalizeBrand(rawVendor, handle) {
  const vendor = (rawVendor || "").trim();
  const HB_HANDLES = new Set([
    "overlord", "paradox", "rhapsody", "your-move", "somersault",
    "promised", "outlaw", "mirage", "darling-women"
  ]);

  if (vendor === "Octopus Perfumes by Harsh Beniwal" || HB_HANDLES.has(handle)) {
    return "Octopus Perfumes by Harsh Beniwal";
  }

  const BRAND_MAP = {
    Bvlagri: "Bvlgari",
    Dior: "Christian Dior",
    Montblanc: "Mont Blanc",
    "Im Rasasi": "Rasasi",
    Riiffs: "RiiFFS",
    "Ibraheem Al Qurashi": "Ibraheem al Qurashi",
    "Maison Fragrance World": "Fragrance World",
    Memo: "Memo Paris",
    Roja: "Roja Parfums",
    Eze: "Eze Perfume",
    "EZE Perfume": "Eze Perfume",
    "IncredibleIndriya Beauty Essentials PVT LTD.": "Eze Perfume",
  };

  return BRAND_MAP[vendor] || vendor || "Octopus Perfumes";
}

function isPerfume(p) {
  const pType = (p.product_type || "").trim();
  const isGiftCardOrBlotter = /\bgift card\b|\bblotter\b|\bstrips\b/i.test(p.title || "");
  const isPerf = /^(Perfume|Perfume & Cologne|perf)$/i.test(pType);
  return isPerf && !isGiftCardOrBlotter;
}

async function main() {
  console.log("🚀 Generating full Google Merchant Center feed.csv for ALL perfumes...");
  const rawProducts = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  console.log(`📦 Loaded ${rawProducts.length} total catalog products from products.json`);

  const perfumes = rawProducts.filter(isPerfume);
  console.log(`✨ Filtered to ${perfumes.length} valid perfume products`);

  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "additional_image_link",
    "availability",
    "price",
    "sale_price",
    "brand",
    "gtin",
    "mpn",
    "identifier_exists",
    "condition",
    "google_product_category",
    "product_type",
    "shipping",
    "item_group_id",
    "size",
    "gender",
    "age_group",
  ];

  const rows = [headers.join(",")];
  let totalRows = 0;

  for (const product of perfumes) {
    if (!product.title || !product.handle || !product.variants || product.variants.length === 0) {
      continue;
    }

    const brand = normalizeBrand(product.vendor, product.handle);
    const gender = detectGender(product.title, product.tags);
    const desc = cleanDescription(product.body_html, product.title);

    const allImages = (product.images || [])
      .map((img) => {
        const src = img.local_src || img.localPath || img.src || "";
        if (!src) return "";
        return src.startsWith("http") ? src : `${DOMAIN}${src}`;
      })
      .filter(Boolean);

    const mainImage = allImages[0] || `${DOMAIN}/placeholder.svg`;
    const additionalImages = allImages.slice(1, 10).join(",");

    const variants = product.variants;
    const isMultiVariant = variants.length > 1;

    for (const variant of variants) {
      const curPrice = Number(variant.price || 0);
      if (curPrice <= 0) continue; // Skip zero/invalid price

      const compPrice = Number(variant.compare_at_price || 0);
      const hasDiscount = compPrice > curPrice;

      const variantTitle = variant.title && variant.title !== "Default Title" ? variant.title : "";
      const fullTitle = variantTitle ? `${product.title} - ${variantTitle}` : product.title;

      const itemId = isMultiVariant ? `${product.id}_${variant.id}` : String(product.id);
      const variantUrl = isMultiVariant
        ? `${DOMAIN}/products/${product.handle}?variant=${variant.id}`
        : `${DOMAIN}/products/${product.handle}`;

      const availability = variant.available !== false ? "in_stock" : "out_of_stock";
      const priceStr = `${(hasDiscount ? compPrice : curPrice).toFixed(2)} INR`;
      const salePriceStr = hasDiscount ? `${curPrice.toFixed(2)} INR` : "";

      const gtin = variant.barcode ? String(variant.barcode).trim() : "";
      const mpn = variant.sku ? String(variant.sku).trim() : String(variant.id || product.id);
      const identifierExists = gtin ? "yes" : "no";

      const row = [
        escapeCsvField(itemId),
        escapeCsvField(fullTitle),
        escapeCsvField(desc),
        escapeCsvField(variantUrl),
        escapeCsvField(mainImage),
        escapeCsvField(additionalImages),
        escapeCsvField(availability),
        escapeCsvField(priceStr),
        escapeCsvField(salePriceStr),
        escapeCsvField(brand),
        escapeCsvField(gtin),
        escapeCsvField(mpn),
        escapeCsvField(identifierExists),
        "new",
        "479",
        escapeCsvField("Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne"),
        escapeCsvField("IN::Standard:0.00 INR"),
        escapeCsvField(String(product.id)),
        escapeCsvField(variantTitle || "100ml"),
        escapeCsvField(gender),
        "adult",
      ];

      rows.push(row.join(","));
      totalRows++;
    }
  }

  console.log(`Writing ${totalRows} perfume items to ${outputPath}...`);
  fs.writeFileSync(outputPath, rows.join("\n"), "utf8");

  const stat = fs.statSync(outputPath);
  const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Successfully generated public/feed.csv!`);
  console.log(`📊 Total Items in Feed: ${totalRows} (from ${perfumes.length} perfume products)`);
  console.log(`📁 File Size: ${sizeMb} MB`);
}

main().catch(console.error);
