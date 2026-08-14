"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { logAppEvent, setAppUserProperties } from "@/lib/firebase";

export default function AnalyticsTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const fbclid = searchParams.get("fbclid");
    const source = searchParams.get("utm_source") || (fbclid ? "facebook" : undefined);
    const medium = searchParams.get("utm_medium") || (fbclid ? "cpc" : undefined);
    const campaign = searchParams.get("utm_campaign") || (fbclid ? "meta_ads" : undefined);
    const content = searchParams.get("utm_content");
    const term = searchParams.get("utm_term");

    // Send the augmented data to the page_view to ensure GA4 captures acquisition!
    logAppEvent("page_view", {
      page_location: window.location.href,
      page_path: pathname,
      campaign,
      source,
      medium,
      term,
      content
    });

    if (source || medium || campaign || fbclid) {
      logAppEvent("campaign_details", {
        source,
        medium,
        campaign,
        content: content || undefined,
        term: term || undefined,
        fbclid: fbclid || undefined,
      });

      setAppUserProperties({
        traffic_source: source || "direct",
        traffic_medium: medium || "none",
        traffic_campaign: campaign || "none",
        fbclid: fbclid || "none",
      });
    }
  }, [pathname, searchParams]);

  return null; // Headless component
}
