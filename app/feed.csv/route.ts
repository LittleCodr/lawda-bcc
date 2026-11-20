import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Revalidate once every 24 hours to cache on Vercel Edge CDN
export const revalidate = 86400;

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "feed.csv");

  if (!fs.existsSync(filePath)) {
    return new Response("Feed file not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream);

  return new Response(webStream as ReadableStream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Length": String(stat.size),
      "Content-Disposition": "inline; filename=\"feed.csv\"",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
