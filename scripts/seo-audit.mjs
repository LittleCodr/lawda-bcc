import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=================================================");
console.log("🔍 RUNNING AUTOMATED E-COMMERCE SEO QUALITY AUDIT");
console.log("=================================================\n");

let passedChecks = 0;
let totalChecks = 0;

function check(name, pass, details = "") {
  totalChecks++;
  if (pass) {
    passedChecks++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    console.error(`❌ [FAIL] ${name}: ${details}`);
  }
}

// 1. Audit Products Data
const productsPath = path.join(rootDir, "lib", "data", "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

console.log(`📊 Total Products in Catalog: ${products.length}`);

// Test 1: Quarantined / Zero price check
const zeroPriceProducts = products.filter(p => {
  const price = p.variants?.[0]?.price;
  return !price || Number(price) <= 0;
});
check(
  "No Zero-Price Products in Active Catalog",
  zeroPriceProducts.length === 0,
  `Found ${zeroPriceProducts.length} items with price <= 0`
);

// Test 2: Price Ending Rule (0 or 9) for migrated catalog
const migratedProducts = products.filter(p => p.source_url && p.source_url.includes("perfumenetwork.in"));
let badPriceEndings = 0;
for (const p of migratedProducts) {
  for (const v of p.variants || []) {
    const num = Math.round(Number(v.price));
    const lastDigit = Math.abs(num % 10);
    if (lastDigit !== 0 && lastDigit !== 9) {
      badPriceEndings++;
    }
  }
}
check(
  "25% Discount Price Rule: All Migrated Variants End in 0 or 9",
  badPriceEndings === 0,
  `Found ${badPriceEndings} variants not ending in 0 or 9`
);

// Test 3: Compare-at Price Integrity
let missingComparePrice = 0;
for (const p of migratedProducts) {
  for (const v of p.variants || []) {
    if (!v.compare_at_price || Number(v.compare_at_price) < Number(v.price)) {
      missingComparePrice++;
    }
  }
}
check(
  "Compare-At Price Exists and is >= Selling Price for All Migrated Variants",
  missingComparePrice === 0,
  `Found ${missingComparePrice} variants with invalid compare-at price`
);

// Test 4: Image Availability
let missingImages = 0;
for (const p of products) {
  if (!p.images || p.images.length === 0 || !p.images[0].src) {
    missingImages++;
  }
}
check(
  "All Products Have at Least One High-Res Image",
  missingImages === 0,
  `Found ${missingImages} products without images`
);

// Test 5: Unique Product Handles
const handleSet = new Set();
let duplicateHandles = 0;
for (const p of products) {
  if (handleSet.has(p.handle)) {
    duplicateHandles++;
  }
  handleSet.add(p.handle);
}
check(
  "Canonical Product Handles are 100% Unique",
  duplicateHandles === 0,
  `Found ${duplicateHandles} duplicate handles`
);

// Test 6: In-Stock Availability for All Products & Variants
let outOfStockVariants = 0;
for (const p of products) {
  for (const v of p.variants || []) {
    if (v.available === false) {
      outOfStockVariants++;
    }
  }
}
check(
  "Restock Audit: 100% of Catalog Variants are In-Stock",
  outOfStockVariants === 0,
  `Found ${outOfStockVariants} out-of-stock variants`
);

// 2. Audit Brand Data
import { getAllBrands } from "../lib/brands.ts";
const brands = getAllBrands();
check(
  "Brand Architecture: Extracted Active Brands",
  brands.length >= 100,
  `Extracted ${brands.length} brands (expected >= 100)`
);

// 3. Audit Sitemaps
const sitemaps = [
  "app/sitemap_perfumes.xml/route.ts",
  "app/sitemap_brands.xml/route.ts",
  "app/sitemap_collections.xml/route.ts",
  "app/robots.ts",
  "app/feed.xml/route.ts",
];

for (const s of sitemaps) {
  const fullPath = path.join(rootDir, s);
  check(
    `SEO Endpoint Exists: ${s}`,
    fs.existsSync(fullPath),
    `File missing at ${fullPath}`
  );
}

console.log("\n=================================================");
console.log(`🏁 AUDIT RESULTS: ${passedChecks}/${totalChecks} CHECKS PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log("=================================================");

if (passedChecks !== totalChecks) {
  process.exit(1);
} else {
  console.log("🎉 All SEO and data integrity quality gates passed!\n");
}

