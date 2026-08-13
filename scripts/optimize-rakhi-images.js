const fs = require('fs');
const path = require('path');
const URL = require('url');

const productsPath = path.join(__dirname, '..', 'lib', 'data', 'products.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

function run() {
  console.log("Reading products.json...");
  const rawData = fs.readFileSync(productsPath, 'utf8');
  const products = JSON.parse(rawData);
  let renamedCount = 0;

  for (const product of products) {
    if (!product.images || !Array.isArray(product.images)) continue;

    product.images.forEach((img, index) => {
      if (!img.src) return;
      
      const parsedUrl = new URL.URL(img.src);
      let originalFilename = path.basename(parsedUrl.pathname);
      try {
        originalFilename = decodeURIComponent(originalFilename);
      } catch (e) {
        // ignore
      }
      
      const oldPath = path.join(imagesDir, originalFilename);
      
      if (fs.existsSync(oldPath)) {
        const ext = path.extname(originalFilename);
        const newFilename = `${product.handle}-rakhi-gift-${index + 1}${ext}`;
        const newPath = path.join(imagesDir, newFilename);
        
        fs.renameSync(oldPath, newPath);
        
        img.local_src = `/images/products/${newFilename}`;
        img.alt = `${product.title} - Personalized Rakhi Gift`;
        renamedCount++;
      } else {
        // It might already be renamed or missing, just set alt
        img.alt = img.alt || `${product.title} - Personalized Rakhi Gift`;
      }
    });
  }

  console.log(`Renamed ${renamedCount} images.`);
  console.log("Updating products.json...");
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log("Done!");
}

run();
