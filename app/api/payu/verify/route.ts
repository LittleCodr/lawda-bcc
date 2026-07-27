import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    const key = process.env.PAYU_MERCHANT_KEY || "";
    const salt = process.env.PAYU_MERCHANT_SALT || "";

    if (!key || !salt) {
      return NextResponse.json(
        { success: false, error: "PayU credentials not configured" },
        { status: 500 }
      );
    }

    const command = "verify_payment";
    // Hash for verify_payment: key|command|var1|salt
    const hashString = `${key}|${command}|${orderId}|${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const params = new URLSearchParams();
    params.append("key", key);
    params.append("command", command);
    params.append("var1", orderId);
    params.append("hash", hash);

    const payuRes = await fetch(
      "https://info.payu.in/merchant/postservice.php?form=2",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const payuData = await payuRes.json();

    // PayU returns status 1 for successful lookup
    if (payuData.status === 1) {
      const transaction = payuData.transaction_details?.[orderId];
      if (
        transaction &&
        transaction.status === "success" &&
        transaction.unmappedstatus === "captured"
      ) {
        // Send Telegram notification
        try {
          const amount = transaction.amt || transaction.transaction_amount || "Unknown";
          const customerName = transaction.firstname || "Unknown";
          const customerEmail = transaction.udf1 || transaction.email || "N/A";
          const customerPhone = transaction.udf2 || transaction.phone || "N/A";
          const productInfo = transaction.udf3 || transaction.productinfo || "N/A";
          const paymentMode = transaction.mode || "Unknown";
          
          const message = `✅ *New Order Paid!*\n\n` +
            `*Order ID:* \`${orderId}\`\n` +
            `*Amount:* ₹${amount}\n` +
            `*Payment Mode:* ${paymentMode}\n\n` +
            `*Customer Details:*\n` +
            `*Name:* ${customerName}\n` +
            `*Email:* ${customerEmail}\n` +
            `*Phone:* ${customerPhone}\n\n` +
            `*Product Details:*\n` +
            `${productInfo}`;

          await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown",
              }),
            }
          );
        } catch (telegramErr) {
          console.error("Telegram notification error:", telegramErr);
        }

        return NextResponse.json({ success: true, transaction });
      }
    }

    return NextResponse.json({ success: false, data: payuData });
  } catch (error: any) {
    console.error("Error verifying PayU payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
