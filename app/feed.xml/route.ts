import productsData from "@/lib/data/products.json";

export async function GET() {
  const DOMAIN = "https://octopusperfume.in";

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Octopus Everlasting Gifts</title>
    <link>${DOMAIN}</link>
    <description>Bespoke personalized gifting and premium perfumes in India.</description>
    ${(productsData as any[]).map((product) => {
      const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
      return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.title} | Octopus Everlasting Gifts]]></g:title>
      <g:description><![CDATA[${product.body_html ? product.body_html.replace(/<[^>]*>?/gm, '').substring(0, 500) : product.title}]]></g:description>
      <g:link>${DOMAIN}/collections/${product.handle}</g:link>
      <g:image_link>${product.images && product.images.length > 0 ? product.images[0].src : ''}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${variant ? variant.price : 0} INR</g:price>
      <g:brand>${product.vendor || 'Octopus Everlasting Gifts'}</g:brand>
      <g:product_type><![CDATA[${product.product_type || 'Personalised Gifts'}]]></g:product_type>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
