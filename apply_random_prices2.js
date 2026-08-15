const fs = require('fs');

const dataPath = 'lib/data/products.json';
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const targetPrices = [249, 259, 269, 279, 299];

let updatedCount = 0;

products.forEach(product => {
  if (product.variants) {
    product.variants.forEach(variant => {
      const originalPrice = parseFloat(variant.price);
      if (isNaN(originalPrice) || originalPrice <= 0) return;

      if (originalPrice > 399) {
        const randomPrice = targetPrices[Math.floor(Math.random() * targetPrices.length)];
        
        if (!variant.compare_at_price || variant.compare_at_price === "") {
          variant.compare_at_price = variant.price;
        }
        variant.price = randomPrice.toFixed(2);
        updatedCount++;
      }
    });
  }
});

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log(`Prices updated successfully for ${updatedCount} variants.`);
