"use client";

import { logAppEvent } from "@/lib/firebase";

export type EcommerceEventName =
  | "view_item"
  | "view_item_list"
  | "select_item"
  | "search"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "add_shipping_info"
  | "add_payment_info";

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
}

export function trackEcommerceEvent(
  eventName: EcommerceEventName,
  payload: {
    currency?: string;
    value?: number;
    items?: AnalyticsItem[];
    item_list_name?: string;
    search_term?: string;
    shipping_tier?: string;
    payment_type?: string;
  }
) {
  if (typeof window === "undefined") return;

  const data = {
    currency: "INR",
    ...payload,
  };

  try {
    logAppEvent(eventName, data);

    const w = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };

    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: eventName, ecommerce: data });
    }
    if (typeof w.gtag === "function") {
      w.gtag("event", eventName, data);
    }

    if (typeof w.fbq === "function") {
      if (eventName === "view_item") {
        w.fbq("track", "ViewContent", {
          content_ids: (data.items || []).map((i) => i.item_id),
          content_name: data.items?.[0]?.item_name,
          value: data.value,
          currency: "INR",
        });
      } else if (eventName === "add_to_cart") {
        w.fbq("track", "AddToCart", {
          content_ids: (data.items || []).map((i) => i.item_id),
          content_name: data.items?.[0]?.item_name,
          value: data.value,
          currency: "INR",
        });
      } else if (eventName === "begin_checkout") {
        w.fbq("track", "InitiateCheckout", {
          value: data.value,
          currency: "INR",
          num_items: (data.items || []).reduce((s, i) => s + (i.quantity || 1), 0),
        });
      } else if (eventName === "search" && data.search_term) {
        w.fbq("track", "Search", { search_string: data.search_term });
      }
    }
  } catch {
    // Non-blocking analytics
  }
}

