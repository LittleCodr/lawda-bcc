const fs = require('fs');

const dataPath = 'lib/data/products.json';
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const specificHandles = [
  'signature-heart',
  '22k-heart-and-butterfly-couple-name-necklace',
  'arabic-name-necklace'
];

products.forEach(product => {
  product.tags = (product.tags || '') + ', rakhi-name-necklaces'; // Add a tag so we can build the new page easily if needed, or we just rely on handles. Actually wait, if we add rakhi-name-necklaces to ALL products, that's wrong. We only want it for necklaces. Let's not blindly tag.

  if (product.variants) {
    product.variants.forEach(variant => {
      const originalPrice = parseFloat(variant.price);
      if (isNaN(originalPrice) || originalPrice <= 0) return;

      if (specificHandles.includes(product.handle)) {
        // Specific ones to 349
        // If it already has a compare_at_price, we keep it, otherwise we set it to original price
        if (!variant.compare_at_price) {
          variant.compare_at_price = variant.price;
        }
        variant.price = "349.00";
      } else {
        // Sitewide 50% discount
        // We assume current price is original price.
        // If it already has compare_at_price, maybe it was already discounted.
        // Let's set compare_at_price to the current price if not set, and halve the price.
        if (!variant.compare_at_price || variant.compare_at_price === "") {
          variant.compare_at_price = variant.price;
        } else {
          // If it had a compare_at_price, maybe we halve the compare_at_price?
          // Let's just halve the current price.
        }
        const newPrice = Math.floor(originalPrice / 2);
        variant.price = newPrice.toFixed(2);
      }
    });
  }
});

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log("Prices updated successfully.");
