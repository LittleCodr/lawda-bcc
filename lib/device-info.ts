/**
 * Device & Location detection helper.
 * Parses Vercel edge headers, IP headers, and user-agent strings.
 */

export interface ParsedDeviceInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  locationDisplay: string;
  deviceType: "Mobile" | "Tablet" | "Desktop" | "Unknown";
  os: string;
  browser: string;
  deviceDisplay: string;
  screen?: string;
  referrer?: string;
  page?: string;
}

export function parseRequestDevice(req: Request, clientDetails?: { screen?: string; referrer?: string; page?: string }): ParsedDeviceInfo {
  const headers = req.headers;

  // 1. IP resolution
  const forwarded = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const ip = forwarded ? forwarded.split(",")[0].trim() : (realIp || "Unknown IP");

  // 2. Vercel Geo headers
  const rawCity = headers.get("x-vercel-ip-city");
  const city = rawCity ? decodeURIComponent(rawCity) : "";
  const region = headers.get("x-vercel-ip-country-region") || "";
  const country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "IN";

  const locationParts = [city, region, country === "IN" ? "India" : country].filter(Boolean);
  const locationDisplay = locationParts.length > 0 ? locationParts.join(", ") : "India";

  // 3. User-Agent parsing
  const ua = headers.get("user-agent") || "";
  let deviceType: "Mobile" | "Tablet" | "Desktop" | "Unknown" = "Desktop";
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    deviceType = "Tablet";
  } else if (/mobile|iphone|ipod|android/i.test(ua)) {
    deviceType = "Mobile";
  } else {
    deviceType = "Desktop";
  }

  // OS detection
  if (/iphone/i.test(ua)) {
    const m = ua.match(/OS (\d+[_\d]*)/i);
    os = `iOS ${m ? m[1].replace(/_/g, ".") : ""}`.trim();
  } else if (/ipad/i.test(ua)) {
    os = "iPadOS";
  } else if (/android/i.test(ua)) {
    const m = ua.match(/Android\s+([0-9.]+)/i);
    os = `Android ${m ? m[1] : ""}`.trim();
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
  } else if (/windows/i.test(ua)) {
    os = "Windows";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // Browser detection
  if (/instagram/i.test(ua)) {
    browser = "Instagram App";
  } else if (/fban|fbav/i.test(ua)) {
    browser = "Facebook App";
  } else if (/edg/i.test(ua)) {
    browser = "Edge";
  } else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  }

  const deviceDisplay = `${deviceType} · ${os} · ${browser}`;

  return {
    ip,
    city,
    region,
    country,
    locationDisplay,
    deviceType,
    os,
    browser,
    deviceDisplay,
    screen: clientDetails?.screen || "Unknown",
    referrer: clientDetails?.referrer || "Direct",
    page: clientDetails?.page || "/",
  };
}
