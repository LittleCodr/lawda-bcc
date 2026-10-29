import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://www.octopusperfume.in';
  const dataPath = path.join(process.cwd(), 'lib', 'data', 'products.json');
  let products: any[] = [];
  try {
    if (fs.existsSync(dataPath)) {
      products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading products for perfumes sitemap:', e);
  }

  // Filter for all perfumes (migrated + core brand)
  const perfumeHandles = ['overlord', 'paradox', 'rhapsody', 'your-move', 'somersault', 'promised', 'outlaw', 'mirage', 'darling-women'];
  const perfumes = products.filter(p => 
    perfumeHandles.includes(p.handle) ||
    p.vendor === 'Octopus Perfumes by Harsh Beniwal' ||
    (p.product_type || '').toLowerCase().includes('perfume') ||
    (Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '')).toLowerCase().includes('perfume') ||
    p.source_metadata?.source_url
  );

  function escapeXml(unsafe: string) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  const xmlEntries = perfumes.map(p => {
    const imagesXml = (p.images || []).map((img: any) => {
      const src = img.local_src || img.localPath || img.src || '';
      const absoluteSrc = src.startsWith('http') ? src : `${baseUrl}${src}`;
      return `    <image:image>
      <image:loc>${escapeXml(absoluteSrc)}</image:loc>
      <image:title>${escapeXml(img.alt || p.title)}</image:title>
    </image:image>`;
    }).join('\n');

    let lastmod = p.updated_at || p.published_at || new Date().toISOString();
    try {
      lastmod = new Date(lastmod).toISOString();
    } catch {
      lastmod = new Date().toISOString();
    }

    return `  <url>
    <loc>${baseUrl}/products/${escapeXml(p.handle)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
${imagesXml ? imagesXml + '\n' : ''}  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
