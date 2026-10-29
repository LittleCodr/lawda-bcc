import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

console.log("==========================================");
console.log("📦 RESTOCKING CATALOG: MAKING ALL PRODUCTS IN-STOCK");
console.log("==========================================\n");

// 1. Process lib/data/products.json
const productsPath = path.join(rootDir, "lib", "data", "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

let restockedVariants = 0;
let restockedProducts = 0;

for (const p of products) {
  let productWasRestocked = false;
  
  if (p.available === false) {
    p.available = true;
    productWasRestocked = true;
  }

  if (p.source_metadata) {
    p.source_metadata.verified_for_sale = true;
    p.source_metadata.in_stock = true;
    p.source_metadata.restocked_at = new Date().toISOString();
  }

  for (const v of p.variants || []) {
    if (v.available === false) {
      v.available = true;
      restockedVariants++;
      productWasRestocked = true;
    }
  }

  if (productWasRestocked) {
    restockedProducts++;
  }
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf-8");
console.log(`✅ [lib/data/products.json] Restocked ${restockedVariants} variants across ${restockedProducts} products.`);

// 2. Process data/migration/validated_catalog.json if exists
const validatedPath = path.join(rootDir, "data", "migration", "validated_catalog.json");
if (fs.existsSync(validatedPath)) {
  const validated = JSON.parse(fs.readFileSync(validatedPath, "utf-8"));
  let valRestockedVariants = 0;
  
  for (const p of validated) {
    if (p.available === false) p.available = true;
    if (p.source_metadata) {
      p.source_metadata.verified_for_sale = true;
      p.source_metadata.in_stock = true;
    }
    for (const v of p.variants || []) {
      if (v.available === false) {
        v.available = true;
        valRestockedVariants++;
      }
    }
  }
  
  fs.writeFileSync(validatedPath, JSON.stringify(validated, null, 2), "utf-8");
  console.log(`✅ [data/migration/validated_catalog.json] Restocked ${valRestockedVariants} variants.`);
}

// 3. Process harsh-beniwal/octopus/perfumes/scraped_products.json if exists
const hbPath = path.join(rootDir, "harsh-beniwal", "octopus", "perfumes", "scraped_products.json");
if (fs.existsSync(hbPath)) {
  const hb = JSON.parse(fs.readFileSync(hbPath, "utf-8"));
  for (const p of hb) {
    if (p.available === false) p.available = true;
    for (const v of p.variants || []) {
      if (v.available === false) v.available = true;
    }
  }
  fs.writeFileSync(hbPath, JSON.stringify(hb, null, 2), "utf-8");
  console.log(`✅ [harsh-beniwal/octopus/perfumes/scraped_products.json] Verified all HB perfumes in-stock.`);
}

console.log("\n🎉 ALL CATALOG PERFUMES AND PRODUCTS ARE NOW 100% IN-STOCK!");

