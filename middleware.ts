import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_SCRAPERS = [
  /bytespider/i,
  /petalbot/i,
  /megaindex/i,
  /dotbot/i,
  /blexbot/i,
  /dataforseobot/i,
  /mj12bot/i,
];

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";

  // Drop aggressive scrapers and bandwidth leeches with 403 at Edge
  if (BLOCKED_SCRAPERS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-touch-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2)$).*)",
  ],
};
