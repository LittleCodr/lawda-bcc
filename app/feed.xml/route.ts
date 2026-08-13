import { products } from "@/lib/products";

export async function GET() {
  const DOMAIN = "https://octopusperfume.in";

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Octopus Perfume</title>
    <link>${DOMAIN}</link>
    <description>Bespoke personalized gifting and premium perfumes in India.</description>
    ${products.map((product) => `
    <item>
      <g:id>${product.sku || product.slug}</g:id>
      <g:title><![CDATA[${product.name} | Octopus Perfume]]></g:title>
      <g:description><![CDATA[${product.scentStory || product.tagline}]]></g:description>
      <g:link>${DOMAIN}/collections/${product.slug}</g:link>
      <g:image_link>${DOMAIN}${product.images.hero}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${product.price}.00 INR</g:price>
      <g:brand>Octopus Perfume</g:brand>
      <g:gender>${product.gender.includes('Her') && product.gender.includes('Him') ? 'unisex' : product.gender.includes('Her') ? 'female' : 'male'}</g:gender>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
