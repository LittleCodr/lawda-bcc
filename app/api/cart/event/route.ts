import { NextResponse } from "next/server";
import { parseRequestDevice } from "@/lib/device-info";
import { saveCartSessionQuotaOptimized } from "@/lib/cart-session";
import { sendTelegramMessage, formatISTDate } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, sessionId, item, cartSummary, clientInfo } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // 1. Parse client device and geolocation from request headers
    const deviceInfo = parseRequestDevice(req, clientInfo);

    // 2. Persist to Firestore with quota-minimizing throttle
    const items = cartSummary?.items || (item ? [item] : []);
    const totalItems = Number(cartSummary?.totalItems || item?.quantity || 1);
    const subtotal = Number(cartSummary?.totalPrice || (item ? item.price * item.quantity : 0));

    await saveCartSessionQuotaOptimized({
      sessionId,
      items,
      totalItems,
      subtotal,
      lastAddedItem: item ? {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        variantTitle: item.variantTitle,
      } : undefined,
      deviceInfo,
      status: "active",
    });

    // 3. Send Telegram Alert for Cart Initiation / Item Added
    if (type === "add_to_cart" && item) {
      const itemTitle = item.variantTitle && item.variantTitle !== "Default Title"
        ? `${item.title} (${item.variantTitle})`
        : item.title;

      const timeIST = formatISTDate();

      const message = `🟡 *Item Added to Cart!*\n\n` +
        `🛍 *Product:* ${itemTitle}\n` +
        `💰 *Price:* ₹${item.price.toLocaleString("en-IN")} (Qty: ${item.quantity})\n` +
        `🛒 *Cart Total:* ₹${subtotal.toLocaleString("en-IN")} (${totalItems} ${totalItems === 1 ? "item" : "items"})\n\n` +
        `📱 *Device:* ${deviceInfo.deviceDisplay}\n` +
        `📐 *Screen:* ${deviceInfo.screen || "N/A"}\n` +
        `🌐 *IP:* \`${deviceInfo.ip}\`\n` +
        `📍 *Location:* ${deviceInfo.locationDisplay}\n` +
        `🔗 *Source:* ${deviceInfo.referrer || "Direct"}\n` +
        `⏱ *Time:* ${timeIST}`;

      // Fire and don't block response
      sendTelegramMessage(message).catch((err) =>
        console.error("Failed to send cart Telegram message:", err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cart event error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
