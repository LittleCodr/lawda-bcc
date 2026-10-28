import { GET as handler } from "../sitemap_perfumes.xml/route";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handler();
}
