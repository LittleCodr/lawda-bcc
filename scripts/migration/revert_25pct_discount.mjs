import fs from 'fs';
import path from 'path';

const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'lib', 'data', 'products.json');
const VALIDATED_CATALOG_PATH = path.join(process.cwd(), 'data', 'migration', 'validated_catalog.json');
const EXTRACTED_RAW_PATH = path.join(process.cwd(), 'data', 'migration', 'extracted_catalog_raw.json');
const CATALOG_CSV_PATH = path.join(process.cwd(), 'data', 'migration', 'catalog_export.csv');

export function revertPricesToOriginal() {
  console.log('=== REVERTING 25% DISCOUNT BACK TO ORIGINAL PRE-DISCOUNT PRICES ===\n');

  if (!fs.existsSync(EXTRACTED_RAW_PATH)) {
    throw new Error(`Raw catalog not found at ${EXTRACTED_RAW_PATH}`);
  }

  const raw = JSON.parse(fs.readFileSync(EXTRACTED_RAW_PATH, 'utf-8'));
  const rawByHandle = new Map();
  for (const p of raw) {
    rawByHandle.set(p.handle, p);
    if (p.id) rawByHandle.set(p.id.toString(), p);
  }

  // 1. Revert in lib/data/products.json
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
  let revertedProductsCount = 0;
  let revertedVariantsCount = 0;
  const sampleReversions = [];

  for (const prod of products) {
    const isMigrated = prod.source_metadata?.source_url || 
      (prod.source_url && prod.source_url.includes("perfumenetwork.in")) ||
      (prod.source_metadata && prod.source_metadata.discount_applied === "25%");

    if (!isMigrated) continue;

    const rawProd = rawByHandle.get(prod.handle) || (prod.id && rawByHandle.get(prod.id.toString()));
    if (!rawProd) {
      console.warn(`Warning: No raw item found for ${prod.handle}`);
      continue;
    }

    const rawVariantMap = new Map((rawProd.variants || []).map(v => [v.id.toString(), v]));
    revertedProductsCount++;

    for (const v of (prod.variants || [])) {
      const rawV = rawVariantMap.get(v.id.toString()) || 
        (rawProd.variants && rawProd.variants.length === 1 ? rawProd.variants[0] : null);

      if (!rawV) {
        console.warn(`Warning: No raw variant found for ${prod.handle} (${v.id})`);
        continue;
      }

      revertedVariantsCount++;
      const oldPrice = v.price;
      const oldCompare = v.compare_at_price;

      // Restore original price
      v.price = rawV.price;

      // Restore original compare_at_price (ensure compare_at >= price if set)
      if (rawV.compare_at_price && Number(rawV.compare_at_price) > 0) {
        if (Number(rawV.compare_at_price) < Number(rawV.price)) {
          v.compare_at_price = rawV.price;
        } else {
          v.compare_at_price = rawV.compare_at_price;
        }
      } else {
        v.compare_at_price = null;
      }

      if (sampleReversions.length < 8) {
        sampleReversions.push({
          handle: prod.handle,
          variant: v.title,
          discountedPrice: oldPrice,
          originalRestoredPrice: v.price,
          compareAtPrice: v.compare_at_price
        });
      }
    }

    if (prod.source_metadata) {
      delete prod.source_metadata.discount_applied;
      delete prod.source_metadata.pricing_rule;
      prod.source_metadata.price_reverted_to_original_at = new Date().toISOString();
    }
  }

  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2));
  console.log(`✅ Successfully reverted ${revertedProductsCount} products (${revertedVariantsCount} variants) in ${PRODUCTS_JSON_PATH}`);

  // 2. Revert in data/migration/validated_catalog.json
  if (fs.existsSync(VALIDATED_CATALOG_PATH)) {
    const validated = JSON.parse(fs.readFileSync(VALIDATED_CATALOG_PATH, 'utf-8'));
    let valRevertedCount = 0;

    for (const prod of validated) {
      const rawProd = rawByHandle.get(prod.handle) || (prod.id && rawByHandle.get(prod.id.toString()));
      if (!rawProd) continue;

      const rawVariantMap = new Map((rawProd.variants || []).map(v => [v.id.toString(), v]));
      valRevertedCount++;

      for (const v of (prod.variants || [])) {
        const rawV = rawVariantMap.get(v.id.toString()) || 
          (rawProd.variants && rawProd.variants.length === 1 ? rawProd.variants[0] : null);

        if (!rawV) continue;

        v.price = rawV.price;
        if (rawV.compare_at_price && Number(rawV.compare_at_price) > 0) {
          if (Number(rawV.compare_at_price) < Number(rawV.price)) {
            v.compare_at_price = rawV.price;
          } else {
            v.compare_at_price = rawV.compare_at_price;
          }
        } else {
          v.compare_at_price = null;
        }
      }

      if (prod.source_metadata) {
        delete prod.source_metadata.discount_applied;
        delete prod.source_metadata.pricing_rule;
        prod.source_metadata.price_reverted_to_original_at = new Date().toISOString();
      }
    }

    fs.writeFileSync(VALIDATED_CATALOG_PATH, JSON.stringify(validated, null, 2));
    console.log(`✅ Successfully reverted ${valRevertedCount} products in ${VALIDATED_CATALOG_PATH}`);
  }

  // 3. Update data/migration/catalog_export.csv if present
  if (fs.existsSync(VALIDATED_CATALOG_PATH)) {
    const validated = JSON.parse(fs.readFileSync(VALIDATED_CATALOG_PATH, 'utf-8'));
    const headers = [
      'id', 'handle', 'title', 'vendor', 'product_type', 'variant_id', 'variant_title',
      'price', 'compare_at_price', 'sku', 'barcode', 'available', 'grams',
      'featured_image', 'images_count', 'source_url'
    ];

    function escapeCsv(val) {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    const rows = [headers.join(',')];
    for (const p of validated) {
      for (const v of (p.variants || [])) {
        rows.push([
          escapeCsv(p.id),
          escapeCsv(p.handle),
          escapeCsv(p.title),
          escapeCsv(p.vendor),
          escapeCsv(p.product_type),
          escapeCsv(v.id),
          escapeCsv(v.title),
          escapeCsv(v.price),
          escapeCsv(v.compare_at_price),
          escapeCsv(v.sku),
          escapeCsv(v.barcode),
          escapeCsv(v.available !== false ? 'true' : 'false'),
          escapeCsv(v.grams || 0),
          escapeCsv(p.images?.[0]?.src || ''),
          escapeCsv(p.images?.length || 0),
          escapeCsv(p.source_metadata?.source_url || '')
        ].join(','));
      }
    }

    fs.writeFileSync(CATALOG_CSV_PATH, rows.join('\n'));
    console.log(`✅ Regenerated ${CATALOG_CSV_PATH} with original prices.`);
  }

  console.log('\n--- SAMPLE REVERSIONS ---');
  console.log(JSON.stringify(sampleReversions, null, 2));
  console.log('\nAll prices have been reverted back to original successfully!\n');
}

revertPricesToOriginal();

