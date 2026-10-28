import fs from 'fs';
import path from 'path';

const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'lib', 'data', 'products.json');
const VALIDATED_CATALOG_PATH = path.join(process.cwd(), 'data', 'migration', 'validated_catalog.json');
const CATALOG_CSV_PATH = path.join(process.cwd(), 'data', 'migration', 'catalog_export.csv');

function computeDiscountedPrice(originalPrice) {
  if (!originalPrice || originalPrice <= 0) return 0;
  const discounted = Math.round(originalPrice * 0.75);
  const d = discounted % 10;
  // If d is 0 or 9, keep it. If d <= 4, round down to 0. If d >= 5, round to 9.
  const finalPrice = d <= 4 ? (discounted - d) : (discounted + (9 - d));
  return Math.max(finalPrice, 9);
}

export function apply25PctDiscount() {
  console.log('=== APPLYING 25% DISCOUNT WITH 0 OR 9 ENDING RULE ===');

  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
  const hbHandles = new Set(['overlord', 'paradox', 'rhapsody', 'your-move', 'somersault', 'promised', 'outlaw', 'mirage', 'darling-women']);
  
  let discountedProductsCount = 0;
  let discountedVariantsCount = 0;
  const priceChangesSample = [];

  for (const prod of products) {
    // Only apply to newly added perfumes (i.e. not the 9 HB signature perfumes and not older non-perfume gifts)
    const isPerfumeNetwork = prod.source_metadata?.source_url || 
      (prod.vendor && prod.vendor !== 'Octopus Perfumes by Harsh Beniwal' && prod.vendor !== 'EVERLASTING' && prod.vendor !== 'Everlasting' && prod.vendor !== 'Buy 1 Get 1 Free' && !hbHandles.has(prod.handle));

    if (!isPerfumeNetwork) continue;

    discountedProductsCount++;

    for (const v of (prod.variants || [])) {
      const orig = parseFloat(v.price);
      if (orig > 0) {
        discountedVariantsCount++;
        const newPriceNum = computeDiscountedPrice(orig);
        
        // Preserve original pre-discount price in compare_at_price so customer sees real discount
        const originalCompare = v.compare_at_price ? parseFloat(v.compare_at_price) : orig;
        v.compare_at_price = Math.max(originalCompare, orig).toFixed(2);
        v.price = newPriceNum.toFixed(2);

        if (priceChangesSample.length < 8) {
          priceChangesSample.push({
            product: prod.handle,
            title: prod.title,
            variant: v.title,
            originalPrice: orig.toFixed(2),
            newPrice: v.price,
            compareAtPrice: v.compare_at_price,
            lastDigit: newPriceNum % 10
          });
        }
      }
    }

    if (prod.source_metadata) {
      prod.source_metadata.discount_applied = "25%";
      prod.source_metadata.pricing_rule = "ends_in_0_or_9";
      prod.source_metadata.discount_applied_at = new Date().toISOString();
    }
  }

  // 1. Write updated products.json
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2));
  console.log(`Updated ${discountedProductsCount} products (${discountedVariantsCount} variants) in ${PRODUCTS_JSON_PATH}`);

  // 2. Update validated_catalog.json
  if (fs.existsSync(VALIDATED_CATALOG_PATH)) {
    const validated = JSON.parse(fs.readFileSync(VALIDATED_CATALOG_PATH, 'utf-8'));
    for (const prod of validated) {
      for (const v of (prod.variants || [])) {
        const orig = parseFloat(v.price);
        if (orig > 0) {
          const newPriceNum = computeDiscountedPrice(orig);
          const originalCompare = v.compare_at_price ? parseFloat(v.compare_at_price) : orig;
          v.compare_at_price = Math.max(originalCompare, orig).toFixed(2);
          v.price = newPriceNum.toFixed(2);
        }
      }
    }
    fs.writeFileSync(VALIDATED_CATALOG_PATH, JSON.stringify(validated, null, 2));
    console.log(`Updated ${validated.length} products in ${VALIDATED_CATALOG_PATH}`);
  }

  // 3. Update catalog_export.csv
  const validatedProducts = JSON.parse(fs.readFileSync(VALIDATED_CATALOG_PATH, 'utf-8'));
  const headers = [
    'id', 'handle', 'title', 'vendor', 'product_type', 'variant_id', 'variant_title',
    'price', 'compare_at_price', 'sku', 'barcode', 'available', 'grams',
    'featured_image', 'images_count', 'source_url'
  ];

  function escapeCsv(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('\"') || str.includes('\n')) {
      return '\"' + str.replace(/\"/g, '\"\"') + '\"';
    }
    return str;
  }

  const rows = [headers.join(',')];
  for (const p of validatedProducts) {
    for (const v of (p.variants || [])) {
      const row = [
        p.id,
        p.handle,
        p.title,
        p.vendor,
        p.product_type,
        v.id,
        v.title,
        v.price,
        v.compare_at_price,
        v.sku,
        v.barcode,
        v.available,
        v.grams,
        v.featured_image ? v.featured_image.src : (p.images[0]?.src || ''),
        p.images.length,
        p.source_metadata?.source_url || ''
      ];
      rows.push(row.map(escapeCsv).join(','));
    }
  }
  fs.writeFileSync(CATALOG_CSV_PATH, rows.join('\n'));
  console.log(`Updated CSV export at ${CATALOG_CSV_PATH}`);

  console.log('\n=== SAMPLE DISCOUNTED PRICES (VERIFIED 0 OR 9 ENDING) ===');
  priceChangesSample.forEach((s, i) => {
    console.log(`  ${i + 1}. [${s.product}] ${s.originalPrice} INR -> ${s.newPrice} INR (Ends in: ${s.lastDigit}, MRP: ${s.compareAtPrice})`);
  });

  return { discountedProductsCount, discountedVariantsCount, priceChangesSample };
}

if (process.argv[1]?.endsWith('apply_25pct_discount.mjs')) {
  apply25PctDiscount();
}
