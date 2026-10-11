import fs from "fs";
import path from "path";

const PERFUME_IMAGES = {
  "overlord": [
    { type: "bottle", filename: "overlord_bottle.png", alt: "Overlord 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "overlord_hero.png", alt: "Overlord - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "overlord_lifestyle.png", alt: "Overlord - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "overlord_box.png", alt: "Overlord - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "overlord_mood.png", alt: "Overlord - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "paradox": [
    { type: "bottle", filename: "paradox_bottle.png", alt: "Paradox 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "paradox_hero.png", alt: "Paradox - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "paradox_lifestyle.png", alt: "Paradox - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "paradox_box.png", alt: "Paradox - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "paradox_mood.png", alt: "Paradox - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "rhapsody": [
    { type: "bottle", filename: "rhapsody_bottle.png", alt: "Rhapsody 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "rhapsody_hero.png", alt: "Rhapsody - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "rhapsody_lifestyle.png", alt: "Rhapsody - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "rhapsody_box.png", alt: "Rhapsody - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "rhapsody_mood.png", alt: "Rhapsody - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "your-move": [
    { type: "bottle", filename: "your_move_bottle.png", alt: "Your Move 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "your_move_hero.png", alt: "Your Move - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "your_move_lifestyle.jpg", alt: "Your Move - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "your_move_box.png", alt: "Your Move - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "your_move_mood.png", alt: "Your Move - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "somersault": [
    { type: "bottle", filename: "somersault_bottle.png", alt: "Somersault 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "somersault_hero.png", alt: "Somersault - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "somersault_lifestyle.png", alt: "Somersault - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "somersault_box.png", alt: "Somersault - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "somersault_mood.jpg", alt: "Somersault - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "promised": [
    { type: "bottle", filename: "promised_bottle.png", alt: "Promised 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "promised_hero.png", alt: "Promised - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "promised_lifestyle.png", alt: "Promised - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "promised_box.png", alt: "Promised - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "promised_mood.png", alt: "Promised - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "outlaw": [
    { type: "bottle", filename: "outlaw_bottle.png", alt: "Outlaw 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "outlaw_hero.png", alt: "Outlaw - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "outlaw_lifestyle.png", alt: "Outlaw - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "outlaw_box.png", alt: "Outlaw - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "outlaw_mood.png", alt: "Outlaw - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "mirage": [
    { type: "bottle", filename: "mirage_bottle.png", alt: "Mirage 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "mirage_hero.png", alt: "Mirage - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "mirage_lifestyle.png", alt: "Mirage - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "mirage_box.png", alt: "Mirage - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "mirage_mood.png", alt: "Mirage - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ],
  "darling-women": [
    { type: "bottle", filename: "darling_bottle.webp", alt: "Darling 50ML EDP - Luxury Fragrance Bottle", width: 2160, height: 2160 },
    { type: "hero", filename: "darling_hero.png", alt: "Darling - Flagship Presentation by Harsh Beniwal", width: 4096, height: 2304 },
    { type: "lifestyle", filename: "darling_lifestyle.png", alt: "Darling - In-Hand Lifestyle Luxury Shot", width: 4096, height: 2305 },
    { type: "box", filename: "darling_box.png", alt: "Darling - Premium Monocarton Packaging Box", width: 4096, height: 2304 },
    { type: "mood", filename: "darling_mood.png", alt: "Darling - Fragrance Notes and Aesthetic Mood", width: 4096, height: 2305 }
  ]
};

function formatImages(handle, baseId) {
  const list = PERFUME_IMAGES[handle];
  if (!list) return [];
  return list.map((item, idx) => {
    const relPath = `/harsh-beniwal/octopus/perfumes/images/${item.filename}`;
    return {
      id: Number(`${baseId}0${idx + 1}`),
      position: idx + 1,
      alt: item.alt,
      width: item.width,
      height: item.height,
      src: relPath,
      local_src: relPath,
      localPath: relPath,
      url: `https://www.octopusperfume.in${relPath}`,
      type: item.type
    };
  });
}

// 1. Update harsh-beniwal/octopus/perfumes/scraped_products.json
const scrapedPath = path.join(process.cwd(), "harsh-beniwal", "octopus", "perfumes", "scraped_products.json");
if (fs.existsSync(scrapedPath)) {
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));
  for (const p of scraped) {
    if (PERFUME_IMAGES[p.handle]) {
      p.images = formatImages(p.handle, p.id || 1000);
    }
  }
  fs.writeFileSync(scrapedPath, JSON.stringify(scraped, null, 2), "utf-8");
  console.log(`Updated images in ${scrapedPath}!`);
}

// 2. Update lib/data/products.json
const productsPath = path.join(process.cwd(), "lib", "data", "products.json");
if (fs.existsSync(productsPath)) {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  let updatedCount = 0;
  for (const p of products) {
    if (PERFUME_IMAGES[p.handle]) {
      p.images = formatImages(p.handle, p.id || 1000);
      updatedCount++;
    }
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf-8");
  console.log(`Updated ${updatedCount} perfumes in ${productsPath}!`);
}
