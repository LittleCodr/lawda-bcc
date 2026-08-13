import { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.octopusperfume.in'
  
  // Static routes
  const routes = [
    '',
    '/pages/about-us',
    '/pages/contact',
    '/pages/privacy-policy',
    '/pages/returns-refund-policy',
    '/pages/shipping-policy',
    '/pages/terms-conditions',
    '/collections/all',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/collections/all' ? 0.9 : 0.6,
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

  return [...routes, ...productRoutes, ...jsonProductRoutes]
}
