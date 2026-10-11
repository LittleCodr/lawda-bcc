import fs from "fs";
import path from "path";

const OFFICIAL_DATA = {
  "overlord": {
    "title": "Overlord",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Overlord_30.png", "filename": "overlord_bottle.png", "alt": "Overlord 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/01_Overlord_Hero_Octopus_127fd1b2-8940-4934-bfce-b3179fd6f130.png", "filename": "overlord_hero.png", "alt": "Overlord - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/02_Overlord_Lifestyle_Image_Octopus_7eaffaae-8554-4394-8c38-3296186552e0.png", "filename": "overlord_lifestyle.png", "alt": "Overlord - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Overlord_Monocarton-Image_Octopus_4650f56d-4875-41d3-974d-6e3173f87ee5.png", "filename": "overlord_box.png", "alt": "Overlord - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Overlord_Mood_Image_Octopus_2_d817cbb6-7717-4384-87ba-c0f5af66cdad.png", "filename": "overlord_mood.png", "alt": "Overlord - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "paradox": {
    "title": "Paradox",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Paradox_Product_Image.png", "filename": "paradox_bottle.png", "alt": "Paradox 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/Paradox_Hero_Octopus.png", "filename": "paradox_hero.png", "alt": "Paradox - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/02_Paradox_Lifestyle_Image_Octopus_e03c7686-59bf-4230-9d95-3822eff13e81.png", "filename": "paradox_lifestyle.png", "alt": "Paradox - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Paradox_Monocarton_Octopus_b3ed0bcc-2ef9-47b2-9bcb-d1969a102358.png", "filename": "paradox_box.png", "alt": "Paradox - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Paradox_Mood_Image_Octopus_7c9ab062-a546-4fe6-b811-b3cb2fc3d3a4.png", "filename": "paradox_mood.png", "alt": "Paradox - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "rhapsody": {
    "title": "Rhapsody",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Rhapsody_Product_Image.png", "filename": "rhapsody_bottle.png", "alt": "Rhapsody 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/Rhapsody_Hero_Octopus.png", "filename": "rhapsody_hero.png", "alt": "Rhapsody - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/02_Rhapsody_Lifestyle_Image_Octopus_0b9eef8e-63ce-4553-a1da-c88defdf924f.png", "filename": "rhapsody_lifestyle.png", "alt": "Rhapsody - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Rhapsody_Monocarton_Octopus_a7fdcc22-8759-4cf6-87f3-fc1d09d73b7e.png", "filename": "rhapsody_box.png", "alt": "Rhapsody - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Rhapsody_Mood_Image_Octopus.png", "filename": "rhapsody_mood.png", "alt": "Rhapsody - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "your-move": {
    "title": "Your Move",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Yourmove_Product_Image.png", "filename": "your_move_bottle.png", "alt": "Your Move 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/Your_Move_Hero_Octopus.png", "filename": "your_move_hero.png", "alt": "Your Move - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/02_Your_Move_Lifestyle_Image_Octopus.jpg", "filename": "your_move_lifestyle.jpg", "alt": "Your Move - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Your_Move_Monocarton_Octopus.png", "filename": "your_move_box.png", "alt": "Your Move - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Your_Move_Mood_Image_Octopus.png", "filename": "your_move_mood.png", "alt": "Your Move - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "somersault": {
    "title": "Somersault",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Somersault_Product_Image.png", "filename": "somersault_bottle.png", "alt": "Somersault 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/Somersault_Hero_Octopus.png", "filename": "somersault_hero.png", "alt": "Somersault - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/Frame_15GJKENGK_f6accbb9-85cb-4417-b695-89714934e3b4.png", "filename": "somersault_lifestyle.png", "alt": "Somersault - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Somersault_Monocarton-Image_Octopus.png", "filename": "somersault_box.png", "alt": "Somersault - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/04_Somersault_Mood_Image_Octopus.jpg", "filename": "somersault_mood.jpg", "alt": "Somersault - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "promised": {
    "title": "Promised",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Promised_Product_Image.png", "filename": "promised_bottle.png", "alt": "Promised 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/01_Promised_Hero_Octopus_1d69e39a-e1ce-4da4-9e80-dd5985789ea8.png", "filename": "promised_hero.png", "alt": "Promised - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/02_Promised_Lifestyle_Image_Octopus_e1d23f33-d071-4b8c-ad58-32ae632fac19.png", "filename": "promised_lifestyle.png", "alt": "Promised - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Promised_Monocarton-Image_Octopus.png", "filename": "promised_box.png", "alt": "Promised - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Promised_Mood_Image_Octopus.png", "filename": "promised_mood.png", "alt": "Promised - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "outlaw": {
    "title": "Outlaw",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Outlaw_Product_Image.png", "filename": "outlaw_bottle.png", "alt": "Outlaw 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/Outlaw_Hero_Octopus.png", "filename": "outlaw_hero.png", "alt": "Outlaw - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/Frame_18cjkdsncjkdsn.png", "filename": "outlaw_lifestyle.png", "alt": "Outlaw - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Outlaw_Monocarton_Octopus.png", "filename": "outlaw_box.png", "alt": "Outlaw - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Outlaw_Mood_Image_Octopus.png", "filename": "outlaw_mood.png", "alt": "Outlaw - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "mirage": {
    "title": "Mirage",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Mirage_Product_Image.png", "filename": "mirage_bottle.png", "alt": "Mirage 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/Frame_23cdsc.png", "filename": "mirage_hero.png", "alt": "Mirage - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/02_Mirage_Lifestyle_Image_Octopus_2144ad2d-351f-41bf-b798-1a5800a91613.png", "filename": "mirage_lifestyle.png", "alt": "Mirage - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Mirage_Monocarton_Octopus.png", "filename": "mirage_box.png", "alt": "Mirage - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Mirage_Mood_Image_Octopus.png", "filename": "mirage_mood.png", "alt": "Mirage - Fragrance Notes and Aesthetic Mood" }
    ]
  },
  "darling-women": {
    "title": "Darling",
    "images": [
      { "type": "bottle", "url": "https://buyoctopus.com/cdn/shop/files/Darling_Product_Image.webp", "filename": "darling_bottle.webp", "alt": "Darling 50ML EDP - Luxury Fragrance Bottle" },
      { "type": "hero", "url": "https://buyoctopus.com/cdn/shop/files/01_Darling_Hero_Octopus.png", "filename": "darling_hero.png", "alt": "Darling - Flagship Presentation by Harsh Beniwal" },
      { "type": "lifestyle", "url": "https://buyoctopus.com/cdn/shop/files/Frame_16.png", "filename": "darling_lifestyle.png", "alt": "Darling - In-Hand Lifestyle Luxury Shot" },
      { "type": "box", "url": "https://buyoctopus.com/cdn/shop/files/06_Darling_Monocarton_Octopus.png", "filename": "darling_box.png", "alt": "Darling - Premium Monocarton Packaging Box" },
      { "type": "mood", "url": "https://buyoctopus.com/cdn/shop/files/05_Darling_Mood_Image_Octopus.png", "filename": "darling_mood.png", "alt": "Darling - Fragrance Notes and Aesthetic Mood" }
    ]
  }
};

const DEST_DIR = path.join(process.cwd(), "public", "harsh-beniwal", "octopus", "perfumes", "images");
const BACKUP_DIR = path.join(process.cwd(), "harsh-beniwal", "octopus", "perfumes", "images");
fs.mkdirSync(DEST_DIR, { recursive: true });
fs.mkdirSync(BACKUP_DIR, { recursive: true });

async function downloadFile(url, dest) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  ✓ Saved ${path.basename(dest)} (${buf.length} bytes)`);
    return true;
  } catch (e) {
    console.error(`  ✗ Error downloading ${url}:`, e.message);
    return false;
  }
}

async function main() {
  console.log("=== DOWNLOADING REAL OFFICIAL IMAGES FOR ALL 9 PERFUMES ===");
  
  for (const [handle, data] of Object.entries(OFFICIAL_DATA)) {
    console.log(`\nProcessing ${data.title} (${handle})...`);
    for (const item of data.images) {
      const dest1 = path.join(DEST_DIR, item.filename);
      const dest2 = path.join(BACKUP_DIR, item.filename);
      const ok = await downloadFile(item.url, dest1);
      if (ok) {
        fs.copyFileSync(dest1, dest2);
      }
    }
  }

  console.log("\nAll official perfume images successfully downloaded!");
}

main().catch(console.error);
