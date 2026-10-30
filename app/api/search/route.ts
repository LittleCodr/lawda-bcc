import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

let cachedProducts: any[] | null = null;

function getProducts() {
  if (cachedProducts) return cachedProducts;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      cachedProducts = JSON.parse(fileContent);
      return cachedProducts;
    }
  } catch (e) {
    console.error("Error reading products for search:", e);
  }
  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  try {
    const products = getProducts();
    if (!products || products.length === 0) {
      return NextResponse.json({ error: "Products not found" }, { status: 404 });
    }

    if (!query) {
      return NextResponse.json(products.slice(0, 20), {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    const results = products.filter((p: any) => 
      (p.title || "").toLowerCase().includes(query) || 
      (p.vendor || "").toLowerCase().includes(query) ||
      (Array.isArray(p.tags) ? p.tags.join(" ") : (p.tags || "")).toLowerCase().includes(query) ||
      (p.product_type || "").toLowerCase().includes(query)
    ).slice(0, 10);

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
