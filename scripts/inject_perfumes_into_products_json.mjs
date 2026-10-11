import fs from "fs";
import path from "path";

const scrapedPath = path.join(process.cwd(), "harsh-beniwal", "octopus", "perfumes", "scraped_products.json");
const productsJsonPath = path.join(process.cwd(), "lib", "data", "products.json");

const scrapedProducts = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));
const existingProducts = JSON.parse(fs.readFileSync(productsJsonPath, "utf-8"));

// Filter out any previous entries of these perfume handles to avoid duplicate ids/handles
const perfumeHandles = new Set(scrapedProducts.map(p => p.handle));
const filteredExisting = existingProducts.filter(p => !perfumeHandles.has(p.handle));

const newPerfumeEntries = scrapedProducts.map((p, idx) => {
  const images = (p.images || []).map((img, imgIdx) => ({
    id: p.id * 10 + imgIdx,
    product_id: p.id,
    position: imgIdx + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    alt: `${p.title} - Octopus Perfumes by Harsh Beniwal (50ML EDP)`,
    width: 1200,
    height: 1200,
    src: img.url,
    local_src: img.localPath
  }));

  const descriptionHtml = `
<div class="octopus-perfume-description">
  <p class="tagline text-lg font-medium text-gray-800 mb-4">${p.tagline}</p>
  <div class="luxury-inspiration mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
    <span class="font-bold text-amber-900">Luxury Accord:</span>
    <span class="text-amber-800"> Inspired by the iconic DNA of <strong>${p.inspiredBy}</strong>.</span>
  </div>
  <p class="scent-story mb-4 text-gray-700 leading-relaxed">${p.scentStory}</p>
  <div class="olfactory-pyramid my-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
    <h4 class="font-bold text-gray-900 mb-2 uppercase text-xs tracking-wider">Fragrance Notes Breakdown:</h4>
    <ul class="space-y-1 text-sm text-gray-700">
      <li><strong>Top Notes:</strong> ${p.notes.top}</li>
      <li><strong>Heart Notes:</strong> ${p.notes.heart}</li>
      <li><strong>Base Notes:</strong> ${p.notes.base}</li>
    </ul>
  </div>
  <div class="specs-grid grid grid-cols-2 gap-2 text-xs text-gray-600 my-4">
    <div class="p-2 bg-gray-50 rounded"><strong>Concentration:</strong> 25%+ Eau De Parfum (EDP)</div>
    <div class="p-2 bg-gray-50 rounded"><strong>Volume:</strong> 50ML / 1.7 FL. OZ</div>
    <div class="p-2 bg-gray-50 rounded"><strong>Longevity:</strong> 12+ Hours High Projection</div>
    <div class="p-2 bg-gray-50 rounded"><strong>Gender:</strong> ${p.gender}</div>
  </div>
  <div class="authenticity-badge text-xs text-emerald-700 font-semibold mt-3">
    ✓ 100% Original Authentic Harsh Beniwal x Octopus Creation. IFRA Compliant & Cruelty-Free.
  </div>
</div>
`.trim();

  return {
    id: p.id,
    title: `${p.title} - 50ML EDP Octopus Perfumes By Harsh Beniwal`,
    handle: p.handle,
    body_html: descriptionHtml,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vendor: "Octopus Perfumes by Harsh Beniwal",
    product_type: "Perfume",
    tags: [
      "Perfume",
      "Harsh Beniwal",
      "Octopus Perfumes",
      "EDP",
      "50ML",
      "Eau De Parfum",
      "Luxury Fragrance",
      p.gender,
      p.title,
      ...(p.tags || [])
    ],
    variants: [
      {
        id: p.id + 1,
        product_id: p.id,
        title: "50ML - Eau De Parfum",
        price: p.price.toFixed(2),
        compare_at_price: p.compareAtPrice.toString(),
        sku: p.sku,
        position: 1,
        grams: 50,
        available: true,
        option1: "50ML EDP",
        option2: null,
        option3: null,
        requires_shipping: true,
        taxable: true,
        featured_image: images[0] ? { src: images[0].local_src || images[0].src } : null
      }
    ],
    images,
    options: [
      {
        id: p.id + 2,
        product_id: p.id,
        name: "Size",
        position: 1,
        values: ["50ML EDP"]
      }
    ]
  };
});

// Put new perfumes right at the beginning
const updatedProducts = [...newPerfumeEntries, ...filteredExisting];

fs.writeFileSync(productsJsonPath, JSON.stringify(updatedProducts, null, 2), "utf-8");
console.log(`Successfully injected ${newPerfumeEntries.length} perfumes into lib/data/products.json! Total catalog size: ${updatedProducts.length}`);
