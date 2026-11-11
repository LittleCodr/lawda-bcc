import { doc, runTransaction, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendOrderConfirmation, type OrderConfirmationItem } from "@/lib/brevo";

interface StoredShippingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface StoredOrderData {
  userId?: string;
  email?: string;
  name?: string;
  confirmationEmailSent?: boolean;
  items?: OrderConfirmationItem[];
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  shippingDetails?: StoredShippingDetails;
}

export interface DispatchOrderEmailParams {
  orderId: string;
  payuEmail?: string;
  payuName?: string;
  amountPaid: string | number;
  productInfo?: string;
  paymentMode?: string;
  transactionId?: string;
  fallbackUserId?: string;
}

function pickValidEmail(...candidates: Array<string | undefined | null>): string {
  for (const candidate of candidates) {
    const trimmed = String(candidate || "").trim();
    if (trimmed && trimmed.includes("@") && trimmed !== "N/A") {
      return trimmed;
    }
  }
  return "";
}

/**
 * Resolves the customer's email from PayU or Firestore `orders/{orderId}` and
 * sends a transactional Brevo order confirmation email exactly once per order.
 */
export async function dispatchVerifiedOrderConfirmation(
  params: DispatchOrderEmailParams
): Promise<{ sent: boolean; reason?: string; email?: string }> {
  const { orderId, payuEmail, payuName, amountPaid, productInfo, paymentMode, transactionId, fallbackUserId } = params;
  if (!orderId) return { sent: false, reason: "missing_order_id" };

  const orderRef = doc(db, "orders", orderId);

  try {
    const claimResult = await runTransaction(db, async (tx) => {
      const snap = await tx.get(orderRef);
      const data = (snap.exists() ? snap.data() : {}) as StoredOrderData;

      if (data.confirmationEmailSent === true) {
        return { shouldSend: false as const, reason: "already_sent" };
      }

      const resolvedEmail = pickValidEmail(
        payuEmail,
        data.shippingDetails?.email,
        data.email
      );
      if (!resolvedEmail) {
        return { shouldSend: false as const, reason: "missing_email" };
      }

      const resolvedName =
        (payuName && payuName !== "Customer" ? payuName : "") ||
        data.shippingDetails?.name ||
        data.name ||
        "Valued Patron";

      const targetUserId = data.userId || fallbackUserId || "";
      const shipping = data.shippingDetails;
      const addressParts = shipping
        ? [shipping.address, shipping.city, shipping.state, shipping.zip, shipping.country]
            .filter(Boolean)
            .join(", ")
        : "";

      tx.set(
        orderRef,
        {
          confirmationEmailSent: true,
          confirmationEmailSentAt: new Date(),
        },
        { merge: true }
      );

      return {
        shouldSend: true as const,
        resolvedEmail,
        resolvedName,
        targetUserId,
        addressParts,
        storedOrder: data,
      };
    });

    if (!claimResult.shouldSend) {
      return { sent: false, reason: claimResult.reason };
    }

    const emailRes = await sendOrderConfirmation(
      orderId,
      claimResult.resolvedName,
      claimResult.resolvedEmail,
      amountPaid,
      productInfo || "Octopus Perfumes Order",
      {
        items: claimResult.storedOrder.items,
        subtotal: claimResult.storedOrder.subtotal,
        discountAmount: claimResult.storedOrder.discountAmount,
        shippingFee: claimResult.storedOrder.shippingFee,
        promoCode: claimResult.storedOrder.promoCode,
        paymentMode,
        transactionId,
        shippingAddress: claimResult.addressParts || undefined,
      }
    );

    if (!emailRes.success) {
      // Allow retry from verify/retry path if Brevo call transiently failed
      await setDoc(orderRef, { confirmationEmailSent: false }, { merge: true }).catch(() => {});
      return { sent: false, reason: String(emailRes.error || "brevo_failed") };
    }

    if (claimResult.targetUserId) {
      await setDoc(
        doc(db, "users", claimResult.targetUserId, "orders", orderId),
        {
          confirmationEmailSent: true,
          confirmationEmailSentAt: new Date(),
        },
        { merge: true }
      ).catch(() => {});
    }

    return { sent: true, email: claimResult.resolvedEmail };
  } catch (err) {
    console.error("Order confirmation dispatch failure:", err);
    return { sent: false, reason: "transaction_error" };
  }
}

