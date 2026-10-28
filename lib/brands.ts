import fs from 'fs';
import path from 'path';

export interface BrandInfo {
  name: string;
  slug: string;
  productCount: number;
  origin?: string;
  description: string;
  topNotes?: string;
  popularSellers?: string[];
}

export function slugifyBrand(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAllBrands(): BrandInfo[] {
  const dataPath = path.join(process.cwd(), 'lib', 'data', 'products.json');
  if (!fs.existsSync(dataPath)) return [];

  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const brandMap = new Map<string, { count: number; sampleTitles: string[] }>();

  for (const p of products) {
    const vendor = (p.vendor || '').trim();
    if (!vendor || vendor === 'EVERLASTING' || vendor === 'Everlasting' || vendor === 'Buy 1 Get 1 Free') continue;
    
    if (!brandMap.has(vendor)) {
      brandMap.set(vendor, { count: 0, sampleTitles: [] });
    }
    const entry = brandMap.get(vendor)!;
    entry.count++;
    if (entry.sampleTitles.length < 3) {
      entry.sampleTitles.push(p.title);
    }
  }

  const brandDescriptions: Record<string, string> = {
    'lattafa': 'Lattafa Perfumes is Dubai’s premier luxury fragrance house, celebrated worldwide for opulent oriental, spicy amber, and oud masterpieces that offer magnetic sillage and 14+ hour longevity.',
    'armaf': 'Armaf is an internationally acclaimed perfumery powerhouse known for couture, long-lasting fragrances including the iconic Club De Nuit line crafted with rich French fragrance oils.',
    'afnan': 'Afnan Perfumes crafts innovative, sophisticated compositions bridging European artistry with rich Middle Eastern heritage, famed for modern classics like the 9PM collection.',
    'christian-dior': 'Christian Dior represents the pinnacle of French Haute Parfumerie, formulating timeless icons including Sauvage, Miss Dior, and Fahrenheit with unmatched elegance.',
    'rasasi': 'Rasasi Perfumes is an iconic Dubai luxury house renowned for prestigious creations like Hawas, blending fresh aquatic zest with warm woods and amber.',
    'french-avenue': 'French Avenue is an artisanal fragrance line by Paris Corner, crafting extrait-de-parfum formulations inspired by rare Parisian private reserves.',
    'tom-ford': 'Tom Ford Private Blend reimagines modern luxury with provocative, complex fragrances featuring rich oud, Tuscan leather, black orchid, and sun-drenched amber.',
    'versace': 'Versace embodies bold Italian glamour, vibrant Mediterranean citrus zest, and seductive woody trails across legendary lines like Eros, Dylan Blue, and Oud Noir.',
    'guerlain': 'Guerlain is one of the world’s oldest and most revered French perfume houses, renowned for the legendary Guerlinade accord, Shalimar, Mon Guerlain, and Vetiver.',
    'creed': 'The House of Creed is celebrated for royal heritage and millesime hand-blended perfume extractions, including the timeless Aventus and Green Irish Tweed.',
    'octopus-perfumes-by-harsh-beniwal': 'Octopus Perfumes by Harsh Beniwal is the official luxury Indian fragrance label formulated with 25%+ imported French perfume oils engineered for beast-mode 12+ hour sillage.',
  };

  const list: BrandInfo[] = [];
  for (const [vendor, data] of brandMap.entries()) {
    const slug = slugifyBrand(vendor);
    const desc = brandDescriptions[slug] || 
      `Discover 100% authentic ${vendor} luxury fragrances with flat 25% OFF. Authentic imported formulations, beast-mode projection, and express Pan-India shipping at Octopus Perfumes.`;

    list.push({
      name: vendor,
      slug,
      productCount: data.count,
      description: desc,
      popularSellers: data.sampleTitles
    });
  }

  return list.sort((a, b) => b.productCount - a.productCount);
}

export function getBrandBySlug(slug: string): BrandInfo | null {
  const brands = getAllBrands();
  return brands.find(b => b.slug === slug || slugifyBrand(b.name) === slug) || null;
}
