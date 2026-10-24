import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
      // Allow & optimize for AI Answer Engines (AEO)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/'],
      },
    ],
    sitemap: 'https://www.octopusperfume.in/sitemap.xml',
    host: 'https://www.octopusperfume.in',
  }
}
