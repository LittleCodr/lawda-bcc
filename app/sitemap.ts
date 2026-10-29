import { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.octopusperfume.in'
  
  // Static routes
  const routes = [
    '',
    '/diwali-gifts',
    '/diwali-gift-ideas',
    '/collections/diwali-gifts',
    '/collections/festive-gifts',
    '/harsh-beniwal/octopus/perfumes',
    '/collections/all',
    '/brands',
    '/pages/about-us',
    '/pages/contact',
    '/pages/privacy-policy',
    '/pages/returns-refund-policy',
    '/pages/shipping-policy',
    '/pages/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' || route === '/diwali-gifts' || route === '/harsh-beniwal/octopus/perfumes' || route === '/collections/diwali-gifts') ? ('daily' as const) : ('weekly' as const),
    priority: (route === '' || route === '/diwali-gifts') ? 1.0 : (route === '/harsh-beniwal/octopus/perfumes' || route === '/collections/diwali-gifts' || route === '/diwali-gift-ideas') ? 0.95 : route === '/collections/all' ? 0.9 : 0.6,
  }))

  // Dynamic product routes from legacy products.ts
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Dynamic product routes from JSON
  let jsonProducts: any[] = [];
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      jsonProducts = JSON.parse(fileContent);
    }
  } catch (e) {
    console.error("Error loading products for sitemap:", e);
  }

  const jsonProductRoutes = jsonProducts.map((product) => ({
    url: `${baseUrl}/products/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic Harsh Beniwal Perfumes dedicated routes
  let harshBeniwalRoutes: any[] = [];
  try {
    const hbPath = path.join(process.cwd(), "harsh-beniwal", "octopus", "perfumes", "scraped_products.json");
    if (fs.existsSync(hbPath)) {
      const hbPerfumes = JSON.parse(fs.readFileSync(hbPath, "utf-8"));
      harshBeniwalRoutes = hbPerfumes.map((p: any) => ({
        url: `${baseUrl}/harsh-beniwal/octopus/perfumes/${p.handle}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.95,
      }));
    }
  } catch (e) {
    console.error("Error loading harsh beniwal perfumes for sitemap:", e);
  }

  return [...routes, ...harshBeniwalRoutes, ...productRoutes, ...jsonProductRoutes]
}
