import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'lib', 'data', 'products.json');
const COLLECTIONS_JSON_PATH = path.join(process.cwd(), 'lib', 'data', 'collections.json');
const MIGRATION_DIR = path.join(process.cwd(), 'data', 'migration');
const VALIDATED_CATALOG_PATH = path.join(MIGRATION_DIR, 'validated_catalog.json');
const UNVERIFIED_CATALOG_PATH = path.join(MIGRATION_DIR, 'unverified_catalog.json');
const EXTRACTED_COLLECTIONS_PATH = path.join(MIGRATION_DIR, 'extracted_collections_raw.json');
const IMPORT_CHANGELOG_PATH = path.join(MIGRATION_DIR, 'import_changelog.json');

export function runImport() {
  console.log('=== PHASE E: PRODUCTION-GRADE CATALOG IMPORT ===');

  if (!fs.existsSync(VALIDATED_CATALOG_PATH)) {
    throw new Error(`Validated catalog missing at ${VALIDATED_CATALOG_PATH}. Run validation first.`);
  }

  // 1. Create a safe timestamped backup of existing products.json
  const timestamp = Date.now();
  const backupPath = path.join(process.cwd(), 'lib', 'data', `products.backup.${timestamp}.json`);
  const rawExisting = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
  fs.writeFileSync(backupPath, rawExisting);
  console.log(`Created safe pre-import backup at ${backupPath}`);

  const existingProducts = JSON.parse(rawExisting);
  const validatedProducts = JSON.parse(fs.readFileSync(VALIDATED_CATALOG_PATH, 'utf-8'));
  const unverifiedProducts = fs.existsSync(UNVERIFIED_CATALOG_PATH)
    ? JSON.parse(fs.readFileSync(UNVERIFIED_CATALOG_PATH, 'utf-8'))
    : [];
  const rawCollections = fs.existsSync(EXTRACTED_COLLECTIONS_PATH)
    ? JSON.parse(fs.readFileSync(EXTRACTED_COLLECTIONS_PATH, 'utf-8'))
    : [];

  const existingHandleMap = new Map(existingProducts.map(p => [p.handle, p]));
  const existingIdMap = new Map(existingProducts.map(p => [p.id, p]));

  const changelog = {
    importedAt: new Date().toISOString(),
    preImportCatalogSize: existingProducts.length,
    postImportCatalogSize: 0,
    createdProducts: [],
    updatedProducts: [],
    skippedProducts: [],
    preservedLocalProducts: existingProducts.length,
    collectionsImported: 0,
    checksums: {}
  };

  const finalProducts = [...existingProducts];
  const newInsertedProducts = [];

  for (const prod of validatedProducts) {
    if (existingHandleMap.has(prod.handle) || existingIdMap.has(prod.id)) {
      changelog.updatedProducts.push({
        id: prod.id,
        handle: prod.handle,
        title: prod.title,
        action: 'SKIPPED_EXISTING_LOCAL_PRIORITY'
      });
      continue;
    }

    finalProducts.push(prod);
    newInsertedProducts.push(prod);
    changelog.createdProducts.push({
      id: prod.id,
      handle: prod.handle,
      title: prod.title,
      vendor: prod.vendor,
      variantsCount: prod.variants.length,
      imagesCount: prod.images.length,
      minPrice: prod.variants[0]?.price
    });
  }

  for (const prod of unverifiedProducts) {
    changelog.skippedProducts.push({
      id: prod.id,
      handle: prod.handle,
      title: prod.title,
      reasons: prod.quarantineReasons || ['Unverified price']
    });
  }

  changelog.postImportCatalogSize = finalProducts.length;

  // 2. Write updated products.json
  const finalJsonString = JSON.stringify(finalProducts, null, 2);
  fs.writeFileSync(PRODUCTS_JSON_PATH, finalJsonString);
  console.log(`Successfully wrote ${finalProducts.length} total products to ${PRODUCTS_JSON_PATH}`);

  // 3. Write collections.json
  if (rawCollections.length > 0) {
    fs.writeFileSync(COLLECTIONS_JSON_PATH, JSON.stringify(rawCollections, null, 2));
    changelog.collectionsImported = rawCollections.length;
    console.log(`Saved ${rawCollections.length} collections to ${COLLECTIONS_JSON_PATH}`);
  }

  // 4. Compute Checksums
  changelog.checksums = {
    productsJsonSha256: crypto.createHash('sha256').update(finalJsonString).digest('hex'),
    backupSha256: crypto.createHash('sha256').update(rawExisting).digest('hex')
  };

  fs.writeFileSync(IMPORT_CHANGELOG_PATH, JSON.stringify(changelog, null, 2));
  console.log(`Saved detailed changelog to ${IMPORT_CHANGELOG_PATH}`);

  console.log('\n=== IMPORT SUMMARY ===');
  console.log(`- Pre-Import Catalog Products: ${changelog.preImportCatalogSize}`);
  console.log(`- New Products Inserted: ${changelog.createdProducts.length}`);
  console.log(`- Products Skipped (0.00 Prices): ${changelog.skippedProducts.length}`);
  console.log(`- Post-Import Total Catalog Products: ${changelog.postImportCatalogSize}`);
  console.log(`- Total Collections Migrated: ${changelog.collectionsImported}`);
  console.log(`- SHA-256 Checksum: ${changelog.checksums.productsJsonSha256}`);

  return changelog;
}

if (process.argv[1]?.endsWith('import_catalog.mjs')) {
  runImport();
}
