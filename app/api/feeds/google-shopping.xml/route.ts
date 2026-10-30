import { GET as getFeed } from "@/app/feed.xml/route";

export const revalidate = 86400;

export async function GET(request: Request) {
  return getFeed(request);
}
