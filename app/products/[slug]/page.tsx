import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ProductUI from "./ProductUI";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const products = JSON.parse(fileContent);
      product = products.find((p: any) => p.handle === slug);
    }
  } catch (e) {}

  if (!product) {
    return { title: "Product Not Found | Everlasting" };
  }

  return {
    title: `${product.title} | Everlasting Gifts`,
    description: product.body_html?.replace(/<[^>]+>/g, "").substring(0, 160) || "Buy personalized jewelry at Everlasting.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product = null;
  try {
    const dataPath = path.join(process.cwd(), "lib", "data", "products.json");
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, "utf-8");
      const products = JSON.parse(fileContent);
      product = products.find((p: any) => p.handle === slug);
    }
  } catch (e) {}

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pt-12 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <ProductUI product={product} />
      </div>
    </div>
  );
}
