import fs from 'fs';
import path from 'path';

const scrapedPath = path.resolve('harsh-beniwal/octopus/perfumes/scraped_products.json');
const productsPath = path.resolve('lib/data/products.json');

const perfumeHandles = [
  'overlord',
  'paradox',
  'rhapsody',
  'illusion',
  'after-hours',
  'crave',
  'rebel',
  'solace',
  'wanderer'
];

// 1. Update scraped_products.json
if (fs.existsSync(scrapedPath)) {
  const perfumes = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));
  for (const p of perfumes) {
    if (p.images && p.images.length >= 4) {
      console.log(`[scraped_products] Swapping 1st & 4th image for ${p.handle}:`);
      console.log(`  Before: 1st=${p.images[0].src}, 4th=${p.images[3].src}`);
      const temp = p.images[0];
      p.images[0] = p.images[3];
      p.images[3] = temp;
      p.images.forEach((img, idx) => {
        img.position = idx + 1;
      });
      console.log(`  After:  1st=${p.images[0].src}, 4th=${p.images[3].src}`);
    }
  }
  fs.writeFileSync(scrapedPath, JSON.stringify(perfumes, null, 2), 'utf8');
  console.log('Successfully updated scraped_products.json!');
}

// 2. Update lib/data/products.json
if (fs.existsSync(productsPath)) {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  let updatedCount = 0;
  for (const p of products) {
    if (perfumeHandles.includes(p.handle)) {
      if (p.images && p.images.length >= 4) {
        console.log(`[products.json] Swapping 1st & 4th image for ${p.handle}:`);
        console.log(`  Before: 1st=${p.images[0].src}, 4th=${p.images[3].src}`);
        const temp = p.images[0];
        p.images[0] = p.images[3];
        p.images[3] = temp;
        p.images.forEach((img, idx) => {
          img.position = idx + 1;
        });
        if (p.variants && p.variants[0] && p.variants[0].featured_image) {
          p.variants[0].featured_image.src = p.images[0].src;
        }
        if (p.image) {
          p.image.src = p.images[0].src;
        }
        console.log(`  After:  1st=${p.images[0].src}, 4th=${p.images[3].src}`);
        updatedCount++;
      }
    }
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Successfully updated ${updatedCount} perfumes in lib/data/products.json!`);
}
