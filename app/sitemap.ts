import { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { EDITORIAL_ARTICLES } from "@/lib/editorial";
import { getAllCollectionSlugs } from "@/lib/catalog";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.octopusperfume.in";

  // Static core & programmatic collection routes
  const corePaths = [
    "",
    "/harsh-beniwal/octopus/perfumes",
    "/octopus-perfume-coupon-code",
    "/brands",
    "/journal",
    "/diwali-gifts",
    "/diwali-gift-ideas",
    "/rakhi-gift-ideas",
    "/pages/about-us",
    "/pages/contact",
    "/pages/privacy-policy",
    "/pages/returns-refund-policy",
    "/pages/shipping-policy",
    "/pages/terms-conditions",
    ...getAllCollectionSlugs().map((slug) => `/collections/${slug}`),
    ...EDITORIAL_ARTICLES.map((a) => `/journal/${a.slug}`),
  ];

  const routes = Array.from(new Set(corePaths)).map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" ||
      route === "/harsh-beniwal/octopus/perfumes" ||
      route === "/octopus-perfume-coupon-code"
        ? ("daily" as const)
        : ("weekly" as const),
    priority:
      route === "" ||
      route === "/harsh-beniwal/octopus/perfumes" ||
      route === "/octopus-perfume-coupon-code"
        ? 1.0
        : route.startsWith("/collections/") || route === "/brands"
          ? 0.85
          : 0.75,
  }));

  // Dynamic product routes from legacy products.ts
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Dynamic product routes from JSON
  let jsonProducts: Array<{ handle?: string }> = [];
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      jsonProducts = JSON.parse(fileContent) as Array<{ handle?: string }>;
    }
  } catch (e) {
    console.error("Error loading products for sitemap:", e);
  }

  const jsonProductRoutes = jsonProducts
    .filter((product) => Boolean(product.handle))
    .map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Dynamic Harsh Beniwal Perfumes dedicated routes
  let harshBeniwalRoutes: MetadataRoute.Sitemap = [];
  try {
    const hbPath = path.join(
      process.cwd(),
      "harsh-beniwal",
      "octopus",
      "perfumes",
      "scraped_products.json"
    );
    if (fs.existsSync(hbPath)) {
      const hbPerfumes = JSON.parse(
        fs.readFileSync(hbPath, "utf-8")
      ) as Array<{ handle: string }>;
      harshBeniwalRoutes = hbPerfumes.map((p) => ({
        url: `${baseUrl}/harsh-beniwal/octopus/perfumes/${p.handle}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.95,
      }));
    }
  } catch (e) {
    console.error("Error loading harsh beniwal perfumes for sitemap:", e);
  }

  return [...routes, ...harshBeniwalRoutes, ...productRoutes, ...jsonProductRoutes]
}
