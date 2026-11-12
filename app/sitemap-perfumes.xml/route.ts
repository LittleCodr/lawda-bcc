import { GET as handler } from "../sitemap_perfumes.xml/route";

export async function GET(request: Request) {
  return handler(request);
}
