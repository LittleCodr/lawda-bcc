import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/'],
      },
    ],
    sitemap: 'https://www.octopusperfume.in/sitemap.xml',
    host: 'https://www.octopusperfume.in',
  }
}
