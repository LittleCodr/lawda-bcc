import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: "Products not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(dataPath, "utf-8");
    const products = JSON.parse(fileContent);

    if (!query) {
      return NextResponse.json(products.slice(0, 20)); // Return some defaults if no query
    }

    const results = products.filter((p: any) => 
      (p.title || "").toLowerCase().includes(query) || 
      (Array.isArray(p.tags) ? p.tags.join(" ") : (p.tags || "")).toLowerCase().includes(query) ||
      (p.product_type || "").toLowerCase().includes(query)
    ).slice(0, 10); // Limit to top 10 results for live search

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
