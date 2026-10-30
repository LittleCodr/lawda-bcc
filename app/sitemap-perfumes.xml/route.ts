import { GET as handler } from "../sitemap_perfumes.xml/route";

export const revalidate = 86400;

export async function GET(request: Request) {
  return handler();
}
