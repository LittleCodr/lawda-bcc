import productsData from "@/lib/data/products.json";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  const DOMAIN = host ? `${proto}://${host}` : "https://www.octopusperfume.in";

  // Filter out any invalid items
  const validProducts = (productsData as any[]).filter(
    (p) => p && p.title && p.handle && p.variants && p.variants.length > 0 && Number(p.variants[0].price) > 0
  );

  const itemsXml = validProducts
    .map((product) => {
      const isMultiVariant = product.variants && product.variants.length > 1;

      return product.variants
        .map((variant: any) => {
          const currentPrice = Number(variant.price || 0);
          const comparePrice = Number(variant.compare_at_price || 0);
          const hasDiscount = comparePrice > currentPrice;

          const variantTitle =
            variant.title && variant.title !== "Default Title"
              ? `${product.title} - ${variant.title}`
              : product.title;

          const cleanDesc = (product.body_html || "")
            .replace(/<[^>]*>?/gm, " ")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 1500) || `${product.title} 100% authentic fragrance with free shipping across India.`;

          const allImages = (product.images || [])
            .map((img: any) => {
              const src = img.local_src || img.localPath || img.src || "";
              return src.startsWith("http") ? src : `${DOMAIN}${src}`;
            })
            .filter(Boolean);

          const mainImage = allImages.length > 0 ? allImages[0] : `${DOMAIN}/logo.png`;
          const additionalImages = allImages.slice(1, 10);

          const variantUrl = isMultiVariant
            ? `${DOMAIN}/products/${product.handle}?variant=${variant.id}`
            : `${DOMAIN}/products/${product.handle}`;

          const isHarshBeniwal =
            product.vendor === "Octopus Perfumes by Harsh Beniwal" ||
            ["overlord", "paradox", "rhapsody", "your-move", "somersault", "promised", "outlaw", "mirage", "darling-women"].includes(product.handle);

          const brand = product.vendor || (isHarshBeniwal ? "Octopus Perfumes by Harsh Beniwal" : "Octopus Perfumes");

          return `
    <item>
      <g:id>${isMultiVariant ? `${product.id}_${variant.id}` : product.id}</g:id>
      <g:title><![CDATA[${variantTitle}]]></g:title>
      <g:description><![CDATA[${cleanDesc}]]></g:description>
      <g:link>${variantUrl}</g:link>
      <g:image_link>${mainImage}</g:image_link>
      ${additionalImages.map((img: string) => `<g:additional_image_link>${img}</g:additional_image_link>`).join("\n      ")}
      <g:condition>new</g:condition>
      <g:availability>${variant.available !== false ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${hasDiscount ? comparePrice.toFixed(2) : currentPrice.toFixed(2)} INR</g:price>
      ${hasDiscount ? `<g:sale_price>${currentPrice.toFixed(2)} INR</g:sale_price>` : ""}
      <g:brand><![CDATA[${brand}]]></g:brand>
      <g:google_product_category>479</g:google_product_category>
      <g:product_type><![CDATA[Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne]]></g:product_type>
      ${isMultiVariant ? `<g:item_group_id>${product.id}</g:item_group_id>` : ""}
      ${variant.title && variant.title !== "Default Title" ? `<g:size><![CDATA[${variant.title}]]></g:size>` : ""}
      <g:identifier_exists>${variant.barcode ? "yes" : "no"}</g:identifier_exists>
      ${variant.barcode ? `<g:gtin>${variant.barcode}</g:gtin>` : ""}
      ${variant.sku ? `<g:mpn>${variant.sku}</g:mpn>` : ""}
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`;
        })
        .join("");
    })
    .join("");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Octopus Luxury Perfumes India</title>
    <link>${DOMAIN}</link>
    <description>100% authentic luxury perfumes, designer fragrances, and Harsh Beniwal signature collection with express pan-India shipping.</description>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xmlContent, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
