import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { ParsedDeviceInfo } from "./device-info";

// In-memory cache to prevent excessive Firestore writes (staying well within 20,000 free writes/day)
// Key: sessionId, Value: timestamp of last write
const lastWriteMap = new Map<string, number>();

// Minimum interval between writes to Firestore for the same session (20 seconds)
const MIN_WRITE_INTERVAL_MS = 20_000;

export interface CartSessionData {
  sessionId: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    variantTitle?: string;
    image?: string;
  }>;
  totalItems: number;
  subtotal: number;
  lastAddedItem?: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    variantTitle?: string;
  };
  deviceInfo: ParsedDeviceInfo;
  status: "active" | "payment_initiated" | "completed" | "abandoned";
  orderId?: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Saves or updates cart session in Firestore with strict rate-limiting
 * to avoid exceeding free-tier write quotas.
 */
export async function saveCartSessionQuotaOptimized(
  session: CartSessionData,
  forceWrite = false
): Promise<boolean> {
  if (!session.sessionId) return false;

  const now = Date.now();
  const lastWrite = lastWriteMap.get(session.sessionId) || 0;

  // Unless forceWrite is true (e.g. payment_initiated), throttle writes within MIN_WRITE_INTERVAL_MS
  if (!forceWrite && now - lastWrite < MIN_WRITE_INTERVAL_MS) {
    return false; // Skipped write to save Firestore quota
  }

  try {
    const docRef = doc(db, "cart_sessions", session.sessionId);
    const payload = {
      sessionId: session.sessionId,
      items: session.items,
      totalItems: session.totalItems,
      subtotal: session.subtotal,
      lastAddedItem: session.lastAddedItem || null,
      deviceInfo: session.deviceInfo,
      status: session.status,
      ...(session.orderId ? { orderId: session.orderId } : {}),
      ...(session.customer ? { customer: session.customer } : {}),
      updatedAt: new Date().toISOString(),
      ...(lastWrite === 0 ? { createdAt: new Date().toISOString() } : {}),
    };

    await setDoc(docRef, payload, { merge: true });
    lastWriteMap.set(session.sessionId, now);

    // Clean up memory cache if it grows too large (> 5,000 entries)
    if (lastWriteMap.size > 5000) {
      const cutoff = now - 3600_000; // 1 hour old
      for (const [key, ts] of lastWriteMap.entries()) {
        if (ts < cutoff) lastWriteMap.delete(key);
      }
    }

    return true;
  } catch (err) {
    console.error("Firestore cart session write error:", err);
    return false;
  }
}
