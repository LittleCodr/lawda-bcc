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
    sitemap: 'https://octopusperfume.in/sitemap.xml',
    host: 'https://octopusperfume.in',
  }
}
