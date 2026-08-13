"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { logAppEvent } from "@/lib/firebase";

export default function AnalyticsTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Log page_view on path or search param change
    logAppEvent("page_view", {
      page_location: window.location.href,
      page_path: pathname,
    });

    // Check for UTM parameters (for Meta Ads tracking etc.)
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");
    const content = searchParams.get("utm_content");
    const term = searchParams.get("utm_term");

    if (source || medium || campaign) {
      logAppEvent("campaign_details", {
        source: source || undefined,
        medium: medium || undefined,
        campaign: campaign || undefined,
        content: content || undefined,
        term: term || undefined,
      });
    }
  }, [pathname, searchParams]);

  return null; // Headless component
}
