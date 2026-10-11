import fs from "fs";
import path from "path";

const PERFUME_IMAGES_MAP = {
  "overlord": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/overlord_img_1.png",
    "hero": "/images/products/01_Overlord_Hero_Octopus_127fd1b2-8940-4934-bfce-b3179fd6f130.webp",
    "lifestyle": "/images/products/02_Overlord_Lifestyle_Image_Octopus_7eaffaae-8554-4394-8c38-3296186552e0.webp",
    "mood": "/images/products/05_Overlord_Mood_Image_Octopus_2_d817cbb6-7717-4384-87ba-c0f5af66cdad.webp",
    "box": "/images/products/06_Overlord_Monocarton-Image_Octopus_4650f56d-4875-41d3-974d-6e3173f87ee5.webp",
    "grid": "/images/products/6Overlord_300x300_crop_center.webp"
  },
  "paradox": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/paradox_img_1.png",
    "hero": "/images/products/Paradox_Hero_Octopus.webp",
    "lifestyle": "/images/products/02_Paradox_Lifestyle_Image_Octopus_e03c7686-59bf-4230-9d95-3822eff13e81.webp",
    "mood": "/images/products/05_Paradox_Mood_Image_Octopus_7c9ab062-a546-4fe6-b811-b3cb2fc3d3a4.webp",
    "box": "/images/products/06_Paradox_Monocarton_Octopus_b3ed0bcc-2ef9-47b2-9bcb-d1969a102358.webp",
    "grid": "/images/products/7Paradox_300x300_crop_center.webp"
  },
  "rhapsody": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/rhapsody_img_1.png",
    "hero": "/images/products/Rhapsody_Hero_Octopus.webp",
    "lifestyle": "/images/products/02_Rhapsody_Lifestyle_Image_Octopus_0b9eef8e-63ce-4553-a1da-c88defdf924f.webp",
    "mood": "/images/products/05_Rhapsody_Mood_Image_Octopus.webp",
    "box": "/images/products/06_Rhapsody_Monocarton_Octopus_a7fdcc22-8759-4cf6-87f3-fc1d09d73b7e.webp",
    "grid": "/images/products/10Rhapsody_300x300_crop_center.webp"
  },
  "your-move": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/your-move_img_1.png",
    "hero": "/images/products/Your_Move_Hero_Octopus.webp",
    "lifestyle": "/images/products/02_Your_Move_Lifestyle_Image_Octopus.webp",
    "mood": "/images/products/05_Your_Move_Mood_Image_Octopus.webp",
    "box": "/images/products/06_Your_Move_Monocarton_Octopus.webp",
    "grid": "/images/products/9YourMove_300x300_crop_center.webp"
  },
  "somersault": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/somersault_img_1.png",
    "hero": "/images/products/Somersault_Hero_Octopus.webp",
    "mood": "/images/products/04_Somersault_Mood_Image_Octopus.webp",
    "box": "/images/products/06_Somersault_Monocarton-Image_Octopus.webp",
    "grid": "/images/products/8Somersault_300x300_crop_center.webp"
  },
  "promised": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/promised_img_1.png",
    "hero": "/images/products/01_Promised_Hero_Octopus_1d69e39a-e1ce-4da4-9e80-dd5985789ea8.webp",
    "lifestyle": "/images/products/02_Promised_Lifestyle_Image_Octopus_e1d23f33-d071-4b8c-ad58-32ae632fac19.webp",
    "mood": "/images/products/05_Promised_Mood_Image_Octopus.webp",
    "box": "/images/products/06_Promised_Monocarton-Image_Octopus.webp",
    "grid": "/images/products/5Promised_300x300_crop_center.webp"
  },
  "outlaw": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/outlaw_img_1.png",
    "hero": "/images/products/Outlaw_Hero_Octopus.webp",
    "mood": "/images/products/05_Outlaw_Mood_Image_Octopus.webp",
    "box": "/images/products/06_Outlaw_Monocarton_Octopus.webp",
    "grid": "/images/products/4Outlaw_300x300_crop_center.webp"
  },
  "mirage": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/mirage_img_1.png",
    "hero": "/images/products/Mirage_Hero_Octopus.webp",
    "lifestyle": "/images/products/02_Mirage_Lifestyle_Image_Octopus_2144ad2d-351f-41bf-b798-1a5800a91613.webp",
    "mood": "/images/products/05_Mirage_Mood_Image_Octopus.webp",
    "box": "/images/products/06_Mirage_Monocarton_Octopus.webp",
    "grid": "/images/products/3Mirage_300x300_crop_center.webp"
  },
  "darling-women": {
    "bottle": "/harsh-beniwal/octopus/perfumes/images/darling-women_img_1.webp",
    "hero": "/images/products/01_Darling_Hero_Octopus.webp",
    "mood": "/images/products/05_Darling_Mood_Image_Octopus.webp",
    "box": "/images/products/06_Darling_Monocarton_Octopus.webp",
    "grid": "/images/products/1Darling_300x300_crop_center.webp"
  }
};

function buildImagesList(handle, title, id = 1000) {
  const meta = PERFUME_IMAGES_MAP[handle];
  if (!meta) return [];

  const list = [];
  let pos = 1;

  // 1. Bottle Clean Cutout (Transparent / Clean)
  if (meta.bottle) {
    list.push({
      id: Number(`${id}01`),
      position: pos++,
      alt: `${title} (50ML EDP) - Luxury Bottle by Harsh Beniwal`,
      width: 2160,
      height: 2160,
      src: meta.bottle,
      local_src: meta.bottle,
      localPath: meta.bottle,
      url: `https://www.octopusperfume.in${meta.bottle}`,
      type: "bottle"
    });
  }

  // 2. Hero Flagship Photo
  if (meta.hero) {
    list.push({
      id: Number(`${id}02`),
      position: pos++,
      alt: `${title} (50ML EDP) - Signature Edition Hero Photo`,
      width: 1600,
      height: 900,
      src: meta.hero,
      local_src: meta.hero,
      localPath: meta.hero,
      url: `https://www.octopusperfume.in${meta.hero}`,
      type: "hero"
    });
  }

  // 3. Lifestyle Photo (if available)
  if (meta.lifestyle) {
    list.push({
      id: Number(`${id}03`),
      position: pos++,
      alt: `${title} (50ML EDP) - Lifestyle Aesthetic`,
      width: 1600,
      height: 900,
      src: meta.lifestyle,
      local_src: meta.lifestyle,
      localPath: meta.lifestyle,
      url: `https://www.octopusperfume.in${meta.lifestyle}`,
      type: "lifestyle"
    });
  }

  // 4. Mood & Fragrance Notes Breakdown
  if (meta.mood) {
    list.push({
      id: Number(`${id}04`),
      position: pos++,
      alt: `${title} (50ML EDP) - Olfactory Notes & Scent Story`,
      width: 1600,
      height: 900,
      src: meta.mood,
      local_src: meta.mood,
      localPath: meta.mood,
      url: `https://www.octopusperfume.in${meta.mood}`,
      type: "mood"
    });
  }

  // 5. Monocarton Luxury Outer Box
  if (meta.box) {
    list.push({
      id: Number(`${id}05`),
      position: pos++,
      alt: `${title} (50ML EDP) - Premium Monocarton Packaging Box`,
      width: 1600,
      height: 900,
      src: meta.box,
      local_src: meta.box,
      localPath: meta.box,
      url: `https://www.octopusperfume.in${meta.box}`,
      type: "box"
    });
  }

  // 6. Grid Thumbnail (Square 300x300)
  if (meta.grid) {
    list.push({
      id: Number(`${id}06`),
      position: pos++,
      alt: `${title} (50ML EDP) - Catalog Card Thumbnail`,
      width: 300,
      height: 300,
      src: meta.grid,
      local_src: meta.grid,
      localPath: meta.grid,
      url: `https://www.octopusperfume.in${meta.grid}`,
      type: "grid"
    });
  }

  return list;
}

// 1. Update scraped_products.json
const scrapedPath = path.resolve("harsh-beniwal/octopus/perfumes/scraped_products.json");
const scrapedData = JSON.parse(fs.readFileSync(scrapedPath, "utf-8"));

scrapedData.forEach(p => {
  p.images = buildImagesList(p.handle, p.title, p.id);
});

fs.writeFileSync(scrapedPath, JSON.stringify(scrapedData, null, 2), "utf-8");
console.log("Updated harsh-beniwal/octopus/perfumes/scraped_products.json with rich images!");

// 2. Update lib/data/products.json
const productsPath = path.resolve("lib/data/products.json");
const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

productsData.forEach(p => {
  if (PERFUME_IMAGES_MAP[p.handle]) {
    const fullImages = buildImagesList(p.handle, p.title, p.id);
    p.images = fullImages;
    if (p.variants && p.variants.length > 0) {
      p.variants[0].featured_image = {
        src: fullImages[0].local_src
      };
    }
  }
});

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2), "utf-8");
console.log("Updated lib/data/products.json with rich perfume images!");
