import { useSyncExternalStore } from "react";

/**
 * Black Friday event automatically expires at midnight IST on 30 November 2026.
 * Dates before 2026-11-30T00:00:00+05:30 render temporary seasonal visual effects
 * without altering catalog prices or discount percentages.
 */
export const BLACK_FRIDAY_END_ISO = "2026-11-30T00:00:00+05:30";
export const BLACK_FRIDAY_END_MS = new Date(BLACK_FRIDAY_END_ISO).getTime();

export function isBlackFridayActive(now: Date | number = Date.now()): boolean {
  const ts = typeof now === "number" ? now : now.getTime();
  return ts < BLACK_FRIDAY_END_MS;
}

const listeners = new Set<() => void>();
let expiryTimer: ReturnType<typeof setTimeout> | null = null;

function ensureExpiryTimer(): void {
  if (typeof window === "undefined" || expiryTimer !== null) return;
  const remainingMs = BLACK_FRIDAY_END_MS - Date.now();
  if (remainingMs <= 0) return;

  // Browser setTimeout clamps above ~24.8 days; chain safely if needed.
  const delay = Math.min(remainingMs, 2_147_483_647);
  expiryTimer = setTimeout(() => {
    expiryTimer = null;
    if (isBlackFridayActive()) {
      ensureExpiryTimer();
    } else {
      listeners.forEach((cb) => cb());
    }
  }, delay);
}

function subscribeBlackFriday(callback: () => void): () => void {
  listeners.add(callback);
  ensureExpiryTimer();
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && expiryTimer !== null) {
      clearTimeout(expiryTimer);
      expiryTimer = null;
    }
  };
}

function getClientSnapshot(): boolean {
  return isBlackFridayActive();
}

function getServerSnapshot(): boolean {
  return isBlackFridayActive();
}

/**
 * Reactive hook that resolves to true before 30 Nov 00:00 IST and automatically
 * flips to false at the cutoff without requiring a page reload or redeploy.
 */
export function useBlackFridayActive(): boolean {
  return useSyncExternalStore(
    subscribeBlackFriday,
    getClientSnapshot,
    getServerSnapshot
  );
}

