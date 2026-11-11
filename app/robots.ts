import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/checkout/", "/account/", "/auth/", "/cart", "/search"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow },
      { userAgent: "CCBot", allow: "/", disallow },
    ],
    sitemap: [
      "https://www.octopusperfume.in/sitemap.xml",
      "https://www.octopusperfume.in/sitemap_perfumes.xml",
      "https://www.octopusperfume.in/sitemap_brands.xml",
      "https://www.octopusperfume.in/sitemap_collections.xml",
      "https://www.octopusperfume.in/sitemap_editorial.xml",
    ],
    host: "https://www.octopusperfume.in",
  };
}
