import { MetadataRoute } from 'next'
import { products } from '@/lib/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.octopusperfumes.in'
  
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
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...routes, ...productRoutes]
}
