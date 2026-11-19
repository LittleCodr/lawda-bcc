/**
 * Client-side cart tracking helper.
 * Generates/maintains a persistent cart session ID and reports cart additions
 * with client-side screen, referrer, and page metrics.
 */

import type { CartItem } from "./store";

function getOrCreateCartSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sessId = localStorage.getItem("octopus_cart_session_id");
    if (!sessId) {
      sessId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("octopus_cart_session_id", sessId);
    }
    return sessId;
  } catch {
    return `sess_${Date.now()}_temp`;
  }
}

export function getCartSessionId(): string {
  return getOrCreateCartSessionId();
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function trackAddToCart(
  item: CartItem,
  cartSummary: { items: CartItem[]; totalItems: number; totalPrice: number }
) {
  if (typeof window === "undefined") return;

  const sessionId = getOrCreateCartSessionId();

  const clientInfo = {
    screen: `${window.screen.width}x${window.screen.height}`,
    referrer: document.referrer || "Direct",
    page: window.location.pathname,
  };

  const payload = {
    type: "add_to_cart",
    sessionId,
    item: {
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      variantTitle: item.variantTitle,
      image: item.image,
    },
    cartSummary: {
      items: cartSummary.items.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        variantTitle: i.variantTitle,
      })),
      totalItems: cartSummary.totalItems,
      totalPrice: cartSummary.totalPrice,
    },
    clientInfo,
  };

  // Debounce slightly (300ms) to bundle rapid clicks
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      fetch("/api/cart/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((e) => console.warn("Cart track error:", e));
    } catch (e) {
      // Ignore background tracking failure
    }
  }, 300);
}
