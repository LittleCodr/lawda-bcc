import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'migration');
const RAW_CATALOG_FILE = path.join(OUTPUT_DIR, 'extracted_catalog_raw.json');
const VALIDATED_CATALOG_FILE = path.join(OUTPUT_DIR, 'validated_catalog.json');
const UNVERIFIED_CATALOG_FILE = path.join(OUTPUT_DIR, 'unverified_catalog.json');
const VALIDATION_REPORT_FILE = path.join(OUTPUT_DIR, 'validation_report.json');

function sanitizeHtml(html) {
  if (!html) return '';
  // Strip out any harmful script, iframe, object, or embed tags
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .trim();
}

export function runValidation() {
  console.log('=== PHASE C: DATA QUALITY & VALIDATION ===');
  if (!fs.existsSync(RAW_CATALOG_FILE)) {
    throw new Error(`Raw catalog missing at ${RAW_CATALOG_FILE}`);
  }

  const rawProducts = JSON.parse(fs.readFileSync(RAW_CATALOG_FILE, 'utf-8'));
  console.log(`Loaded ${rawProducts.length} raw products for validation.`);

  const report = {
    validatedAt: new Date().toISOString(),
    totalRawProducts: rawProducts.length,
    totalApprovedProducts: 0,
    totalQuarantinedProducts: 0,
    metrics: {
      totalVariants: 0,
      totalImages: 0,
      inStockVariants: 0,
      outOfStockVariants: 0,
      zeroOrNegativePriceVariants: 0,
      missingCompareAtPrice: 0,
      sanitizedDescriptions: 0,
      duplicateHandles: 0,
      duplicateIds: 0,
      duplicateSkus: 0,
      imagesWithoutAlt: 0,
    },
    quarantinedProducts: [],
    anomalies: [],
    skuDistribution: {},
    vendorCounts: {},
    typeCounts: {}
  };

  const seenHandles = new Set();
  const seenIds = new Set();
  const seenSkus = new Set();

  const approvedProducts = [];
  const quarantinedProducts = [];

  for (const prod of rawProducts) {
    let isQuarantined = false;
    const quarantineReasons = [];

    // 1. Check ID and Handle uniqueness
    if (seenIds.has(prod.id)) {
      report.metrics.duplicateIds++;
      quarantineReasons.push(`Duplicate product ID: ${prod.id}`);
      isQuarantined = true;
    }
    seenIds.add(prod.id);

    if (seenHandles.has(prod.handle)) {
      report.metrics.duplicateHandles++;
      quarantineReasons.push(`Duplicate handle: ${prod.handle}`);
      isQuarantined = true;
    }
    seenHandles.add(prod.handle);

    // 2. Validate Title & Vendor
    if (!prod.title || typeof prod.title !== 'string' || prod.title.trim().length === 0) {
      quarantineReasons.push('Missing or empty product title');
      isQuarantined = true;
    }

    const vendor = prod.vendor ? prod.vendor.trim() : 'Perfume Network India';
    report.vendorCounts[vendor] = (report.vendorCounts[vendor] || 0) + 1;

    const prodType = prod.product_type ? prod.product_type.trim() : 'Perfume & Cologne';
    report.typeCounts[prodType] = (report.typeCounts[prodType] || 0) + 1;

    // 3. Sanitize HTML
    const sanitizedHtml = sanitizeHtml(prod.body_html);
    if (sanitizedHtml !== prod.body_html) {
      report.metrics.sanitizedDescriptions++;
    }

    // 4. Validate Variants & Pricing
    const validatedVariants = [];
    let hasValidPrice = false;

    if (!prod.variants || prod.variants.length === 0) {
      quarantineReasons.push('Product has 0 variants');
      isQuarantined = true;
    } else {
      for (const [vIdx, v] of prod.variants.entries()) {
        report.metrics.totalVariants++;
        const priceNum = parseFloat(v.price);

        if (isNaN(priceNum) || priceNum <= 0) {
          report.metrics.zeroOrNegativePriceVariants++;
          quarantineReasons.push(`Variant ${v.id} (${v.title}) has invalid price: ${v.price}`);
        } else {
          hasValidPrice = true;
        }

        if (v.available) report.metrics.inStockVariants++;
        else report.metrics.outOfStockVariants++;

        if (!v.compare_at_price) {
          report.metrics.missingCompareAtPrice++;
        }

        if (v.sku) {
          if (seenSkus.has(v.sku)) {
            report.metrics.duplicateSkus++;
          }
          seenSkus.add(v.sku);
        }

        validatedVariants.push({
          id: v.id,
          product_id: prod.id,
          title: v.title || 'Default Title',
          price: isNaN(priceNum) ? '0.00' : priceNum.toFixed(2),
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price).toFixed(2) : null,
          sku: v.sku || null,
          position: v.position || vIdx + 1,
          grams: typeof v.grams === 'number' ? v.grams : 0,
          available: Boolean(v.available) && priceNum > 0, // Never offer zero-priced items for sale
          option1: v.option1 || null,
          option2: v.option2 || null,
          option3: v.option3 || null,
          requires_shipping: v.requires_shipping !== false,
          taxable: v.taxable !== false,
          barcode: v.barcode || null,
          featured_image: v.featured_image || null
        });
      }
    }

    // If no variant has a valid positive price, quarantine product from active sale
    if (!hasValidPrice) {
      isQuarantined = true;
    }

    // 5. Validate Images
    const validatedImages = [];
    const seenImageUrls = new Set();
    for (const [imgIdx, img] of (prod.images || []).entries()) {
      if (!img.src) continue;
      if (seenImageUrls.has(img.src)) continue; // deduplicate duplicate URLs within gallery
      seenImageUrls.add(img.src);

      report.metrics.totalImages++;
      if (!img.alt) report.metrics.imagesWithoutAlt++;

      validatedImages.push({
        id: img.id,
        product_id: prod.id,
        position: imgIdx + 1,
        created_at: img.created_at || new Date().toISOString(),
        updated_at: img.updated_at || new Date().toISOString(),
        width: img.width || 800,
        height: img.height || 800,
        src: img.src,
        alt: img.alt || `${prod.title} - View ${imgIdx + 1}`,
        variant_ids: img.variant_ids || []
      });
    }

    // Ensure first image is attached to variant featured_image if none set
    if (validatedImages.length > 0) {
      validatedVariants.forEach(v => {
        if (!v.featured_image) {
          v.featured_image = { src: validatedImages[0].src };
        }
      });
    }

    const normalizedProduct = {
      id: prod.id,
      title: prod.title.trim(),
      handle: prod.handle.trim(),
      body_html: sanitizedHtml,
      published_at: prod.published_at || new Date().toISOString(),
      created_at: prod.created_at || new Date().toISOString(),
      updated_at: prod.updated_at || new Date().toISOString(),
      vendor: vendor,
      product_type: prodType,
      tags: prod.tags || [],
      variants: validatedVariants,
      images: validatedImages,
      options: prod.options || [],
      source_metadata: {
        source_url: prod.source_url,
        source_lastmod: prod.source_lastmod,
        source_id: prod.id,
        imported_currency: 'INR',
        validation_status: isQuarantined ? 'QUARANTINED_UNVERIFIED' : 'PASSED',
        verified_for_sale: !isQuarantined && validatedVariants.some(v => v.available)
      }
    };

    if (isQuarantined) {
      quarantinedProducts.push({
        ...normalizedProduct,
        quarantineReasons
      });
      report.quarantinedProducts.push({
        id: prod.id,
        handle: prod.handle,
        title: prod.title,
        reasons: quarantineReasons
      });
    } else {
      approvedProducts.push(normalizedProduct);
    }
  }

  report.totalApprovedProducts = approvedProducts.length;
  report.totalQuarantinedProducts = quarantinedProducts.length;

  fs.writeFileSync(VALIDATED_CATALOG_FILE, JSON.stringify(approvedProducts, null, 2));
  fs.writeFileSync(UNVERIFIED_CATALOG_FILE, JSON.stringify(quarantinedProducts, null, 2));
  fs.writeFileSync(VALIDATION_REPORT_FILE, JSON.stringify(report, null, 2));

  console.log('\n=== VALIDATION RESULTS ===');
  console.log(`- Approved Products for Import: ${report.totalApprovedProducts}`);
  console.log(`- Quarantined / Unverified Products: ${report.totalQuarantinedProducts}`);
  console.log(`- Total Variants: ${report.metrics.totalVariants} (${report.metrics.inStockVariants} In Stock, ${report.metrics.outOfStockVariants} Out of Stock)`);
  console.log(`- Zero or Negative Prices: ${report.metrics.zeroOrNegativePriceVariants}`);
  console.log(`- Total Valid Images: ${report.metrics.totalImages}`);
  console.log(`- Unique Vendors: ${Object.keys(report.vendorCounts).length}`);
  console.log(`- Saved validated catalog to ${VALIDATED_CATALOG_FILE}`);
  console.log(`- Saved unverified catalog to ${UNVERIFIED_CATALOG_FILE}`);
  console.log(`- Saved validation report to ${VALIDATION_REPORT_FILE}`);

  if (report.quarantinedProducts.length > 0) {
    console.log('\nQuarantined Products Details:');
    report.quarantinedProducts.forEach((qp, idx) => {
      console.log(`  ${idx + 1}. [${qp.id}] ${qp.title} (${qp.handle}): ${qp.reasons.join(', ')}`);
    });
  }

  return { approvedProducts, quarantinedProducts, report };
}

if (process.argv[1]?.endsWith('validate_catalog.mjs')) {
  runValidation();
}

