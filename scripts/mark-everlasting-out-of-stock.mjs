import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const productsPath = path.join(rootDir, "lib", "data", "products.json");
console.log("Reading products from:", productsPath);

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
console.log("Total products loaded:", products.length);

const isEverlastingOrJewelry = (p) => {
  const v = (p.vendor || "").toLowerCase().trim();
  const pt = (p.product_type || "").toLowerCase().trim();
  const title = (p.title || "").toLowerCase();
  const handle = (p.handle || "").toLowerCase();

  // Explicit Everlasting vendors
  if (v === "everlasting") return true;
  if (v === "buy 1 get 1 free") return true;

  // Non-perfume jewelry product types
  if (["personalised", "non personalised", "hair accessories", "earrings"].includes(pt)) return true;

  // Jewelry keywords in title or handle
  const jewelTerms = [
    "necklace",
    "bracelet",
    "chain",
    "mangalsutra",
    "ring (adjustable)",
    "anklet",
    "earring",
    "bangle",
    "cuff bracelet",
    "pendant",
    "jewel",
  ];
  const hasJewelTerm = jewelTerms.some((term) => title.includes(term) || handle.includes(term));

  // Guard: Never touch perfumes
  const isPerfume =
    /perfume|cologne|eau de parfum|extrait|edp|edt|attar|fragrance/i.test(pt) ||
    /perfume|cologne|eau de parfum|extrait|edp|edt|attar/i.test(title);

  if (hasJewelTerm && !isPerfume) return true;

  return false;
};

let modifiedProducts = 0;
let modifiedVariants = 0;

for (const p of products) {
  if (isEverlastingOrJewelry(p)) {
    modifiedProducts++;

    if (Array.isArray(p.variants)) {
      for (const v of p.variants) {
        v.available = false;
        modifiedVariants++;
      }
    }

    if (p.source_metadata) {
      p.source_metadata.in_stock = false;
    }

    p.available = false;
  }
}

console.log(`✅ Successfully marked ${modifiedProducts} Everlasting / Jewelry products as OUT OF STOCK.`);
console.log(`✅ Set available=false across ${modifiedVariants} total variants.`);

// Write back to lib/data/products.json
fs.writeFileSync(productsPath, JSON.stringify(products));
console.log("💾 Updated lib/data/products.json successfully.");
