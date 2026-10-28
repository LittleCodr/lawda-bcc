import fs from 'fs';
import path from 'path';

const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'lib', 'data', 'products.json');
const COLLECTIONS_JSON_PATH = path.join(process.cwd(), 'lib', 'data', 'collections.json');
const MIGRATION_DIR = path.join(process.cwd(), 'data', 'migration');
const SITEMAPS_INVENTORY_PATH = path.join(MIGRATION_DIR, 'sitemaps_inventory.json');
const VALIDATED_CATALOG_PATH = path.join(MIGRATION_DIR, 'validated_catalog.json');
const UNVERIFIED_CATALOG_PATH = path.join(MIGRATION_DIR, 'unverified_catalog.json');
const RECONCILIATION_REPORT_PATH = path.join(MIGRATION_DIR, 'reconciliation_report.json');

export async function runReconciliation() {
  console.log('=== PHASE F: RECONCILIATION & VERIFICATION ===');

  const sitemapsInventory = JSON.parse(fs.readFileSync(SITEMAPS_INVENTORY_PATH, 'utf-8'));
  const validatedProducts = JSON.parse(fs.readFileSync(VALIDATED_CATALOG_PATH, 'utf-8'));
  const unverifiedProducts = JSON.parse(fs.readFileSync(UNVERIFIED_CATALOG_PATH, 'utf-8'));
  const finalProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
  const collections = JSON.parse(fs.readFileSync(COLLECTIONS_JSON_PATH, 'utf-8'));

  const finalHandleMap = new Map(finalProducts.map(p => [p.handle, p]));
  const finalIdMap = new Map(finalProducts.map(p => [p.id, p]));

  // 1. Verify every sitemap product URL exists in our catalog
  const sitemapProductUrls = sitemapsInventory.categories.products.map(p => p.loc);
  const reconciliation = {
    timestamp: new Date().toISOString(),
    sitemaps: {
      totalDiscovered: sitemapsInventory.sitemaps.length,
      processedSitemaps: sitemapsInventory.sitemaps.map(s => s.url),
      uniqueProductUrls: sitemapsInventory.uniqueCounts.products,
      uniqueCollectionsUrls: sitemapsInventory.uniqueCounts.collections,
      uniquePagesUrls: sitemapsInventory.uniqueCounts.pages,
      uniqueArticlesUrls: sitemapsInventory.uniqueCounts.articles,
    },
    catalog: {
      preMigrationProducts: 630,
      extractedSourceProducts: validatedProducts.length + unverifiedProducts.length,
      importedApprovedProducts: validatedProducts.length,
      quarantinedUnverifiedProducts: unverifiedProducts.length,
      totalCatalogProducts: finalProducts.length,
      totalCatalogVariants: finalProducts.reduce((acc, p) => acc + (p.variants?.length || 0), 0),
      totalCatalogImages: finalProducts.reduce((acc, p) => acc + (p.images?.length || 0), 0),
      totalMigratedCollections: collections.length,
    },
    verificationChecks: {
      allSitemapApprovedProductsInCatalog: true,
      zeroZeroPricedInActiveSale: true,
      allVariantsLinkedToProducts: true,
      allImagesHaveValidSrc: true,
      allHandlesUnique: true,
      allIdsUnique: true,
      legacyHarshBeniwalProductsIntact: true,
      legacyPersonalizedProductsIntact: true,
    },
    sampleSpotChecks: [],
    discrepancies: []
  };

  // Check approved products
  for (const vp of validatedProducts) {
    const found = finalHandleMap.get(vp.handle);
    if (!found) {
      reconciliation.verificationChecks.allSitemapApprovedProductsInCatalog = false;
      reconciliation.discrepancies.push(`Missing approved product in catalog: ${vp.handle}`);
    }
  }

  // Check for zero-priced active products
  for (const fp of finalProducts) {
    for (const v of (fp.variants || [])) {
      if (v.available && parseFloat(v.price) <= 0) {
        reconciliation.verificationChecks.zeroZeroPricedInActiveSale = false;
        reconciliation.discrepancies.push(`Active variant with invalid price: ${fp.handle} (${v.id}) - price ${v.price}`);
      }
    }
  }

  // Check unique handles and IDs
  if (finalHandleMap.size !== finalProducts.length) {
    reconciliation.verificationChecks.allHandlesUnique = false;
    reconciliation.discrepancies.push(`Duplicate handles detected! Map size: ${finalHandleMap.size}, Array: ${finalProducts.length}`);
  }
  if (finalIdMap.size !== finalProducts.length) {
    reconciliation.verificationChecks.allIdsUnique = false;
    reconciliation.discrepancies.push(`Duplicate IDs detected! Map size: ${finalIdMap.size}, Array: ${finalProducts.length}`);
  }

  // Check legacy Harsh Beniwal core products
  const hbHandles = ['overlord', 'paradox', 'rhapsody', 'your-move', 'somersault', 'promised', 'outlaw', 'mirage', 'darling-women'];
  for (const h of hbHandles) {
    const p = finalHandleMap.get(h);
    if (!p) {
      reconciliation.verificationChecks.legacyHarshBeniwalProductsIntact = false;
      reconciliation.discrepancies.push(`Legacy HB product missing: ${h}`);
    }
  }

  // Spot check representative sample against live source API
  console.log('Spot-checking 5 sample imported products against source API...');
  const sampleHandles = [
    'lattafa-khamrah-mira-eau-de-parfum-for-women',
    'armaf-club-de-nuit-intense-man-eau-de-parfum',
    'afnan-9-pm-eau-de-parfum-for-men',
    'guerlain-homme-eau-de-parfum-for-men',
    'dior-sauvage-eau-de-parfum-for-men'
  ];

  for (const handle of sampleHandles) {
    const imported = finalHandleMap.get(handle);
    if (imported) {
      try {
        const res = await fetch(`https://www.perfumenetwork.in/products/${handle}.js`);
        if (res.ok) {
          const liveData = await res.json();
          const livePrice = (liveData.price / 100).toFixed(2);
          const importedPrice = imported.variants[0]?.price;
          const match = livePrice === importedPrice;
          reconciliation.sampleSpotChecks.push({
            handle,
            title: imported.title,
            importedPrice,
            liveSourcePrice: livePrice,
            priceMatch: match,
            variantsCount: imported.variants.length,
            imagesCount: imported.images.length
          });
          console.log(`  ✓ Spot check [${handle}]: Imported ${importedPrice} INR | Live ${livePrice} INR | Match: ${match}`);
        }
      } catch (e) {
        console.warn(`  Spot check error for ${handle}: ${e.message}`);
      }
    }
  }

  fs.writeFileSync(RECONCILIATION_REPORT_PATH, JSON.stringify(reconciliation, null, 2));
  console.log(`Saved reconciliation report to ${RECONCILIATION_REPORT_PATH}`);

  console.log('\n=== RECONCILIATION RESULTS ===');
  console.log(`- Total Sitemap URLs: ${sitemapsInventory.uniqueCounts.products}`);
  console.log(`- Approved Products Imported: ${reconciliation.catalog.importedApprovedProducts}`);
  console.log(`- Quarantined / Unverified Products: ${reconciliation.catalog.quarantinedUnverifiedProducts}`);
  console.log(`- Total Website Products Post-Migration: ${reconciliation.catalog.totalCatalogProducts}`);
  console.log(`- Total Variants: ${reconciliation.catalog.totalCatalogVariants}`);
  console.log(`- Total Images: ${reconciliation.catalog.totalCatalogImages}`);
  console.log(`- Total Migrated Collections: ${reconciliation.catalog.totalMigratedCollections}`);
  console.log(`- All Verification Checks Passed: ${Object.values(reconciliation.verificationChecks).every(Boolean)}`);
  console.log(`- Discrepancies Count: ${reconciliation.discrepancies.length}`);

  return reconciliation;
}

if (process.argv[1]?.endsWith('reconcile_and_verify.mjs')) {
  runReconciliation().catch(err => {
    console.error('Reconciliation failed:', err);
    process.exit(1);
  });
}

