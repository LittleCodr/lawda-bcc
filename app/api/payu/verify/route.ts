import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendOrderConfirmation } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawOrderId = body.orderId || body.txnid;

    if (!rawOrderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    const baseOrderIdMatch = rawOrderId.match(/(ORD-\d{13})/);
    const orderId = baseOrderIdMatch ? baseOrderIdMatch[1] : rawOrderId;

    const key = process.env.PAYU_MERCHANT_KEY || "BfDKZe";
    const salt = process.env.PAYU_MERCHANT_SALT || "iQ7BOSg394ZQQKY2Mu5evsBnwobF4shg";

    if (!key || !salt) {
      return NextResponse.json(
        { success: false, error: "PayU credentials not configured" },
        { status: 500 }
      );
    }

    const command = "verify_payment";
    // Hash for verify_payment: key|command|var1|salt
    const hashString = `${key}|${command}|${rawOrderId}|${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const params = new URLSearchParams();
    params.append("key", key);
    params.append("command", command);
    params.append("var1", rawOrderId);
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
      const transaction = payuData.transaction_details?.[rawOrderId] || payuData.transaction_details?.[orderId];
      if (
        transaction &&
        transaction.status === "success" &&
        (transaction.unmappedstatus === "captured" || transaction.unmappedstatus === "success" || transaction.field9?.includes("SUCCESS"))
      ) {
        const amount = transaction.amt || transaction.transaction_amount || "1.00";
        const customerName = transaction.firstname || "Customer";
        const customerEmail = transaction.email || (transaction.udf1 && transaction.udf1 !== "octopusperfumes" ? transaction.udf1 : "") || "N/A";
        const customerPhone = transaction.phone || transaction.udf2 || "N/A";
        const productInfo = transaction.productinfo || transaction.udf3 || "Octopus Perfume 50ML EDP";
        const paymentMode = transaction.mode || "UPI";

        // Update Order in Firestore Server-Side
        const paymentUpdate = {
          orderId,
          status: "Paid",
          paymentMethod: "payu",
          payuTxnId: rawOrderId,
          mihpayid: transaction.mihpayid,
          bankRefNum: transaction.bank_ref_num || null,
          paymentMode,
          amountPaid: Number(amount) || 1,
          paidAt: new Date(),
          updatedAt: new Date(),
        };

        let orderData: any = { ...paymentUpdate };

        try {
          // 1. Update root orders collection
          await setDoc(doc(db, "orders", orderId), paymentUpdate, { merge: true });

          // 2. Fetch full root order details to return to client
          const rootSnap = await getDoc(doc(db, "orders", orderId));
          if (rootSnap.exists()) {
            orderData = { ...rootSnap.data(), ...paymentUpdate };
            const userId = rootSnap.data().userId;
            if (userId) {
              await setDoc(doc(db, "users", userId, "orders", orderId), paymentUpdate, { merge: true });
            }
          }
        } catch (dbErr) {
          console.error("Error updating Firestore in verify route:", dbErr);
        }

        // Send Telegram Notification
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
          try {
            const message = `✅ *New Order Paid & Verified!*\n\n` +
              `*Order ID:* \`${orderId}\`\n` +
              `*Amount:* ₹${amount}\n` +
              `*Payment ID:* \`${transaction.mihpayid}\`\n` +
              `*Mode:* ${paymentMode}\n\n` +
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
        }

        // Send Brevo Email Confirmation
        if (customerEmail && customerEmail.includes("@")) {
          try {
            await sendOrderConfirmation(orderId, customerName, customerEmail, amount, productInfo);
          } catch (emailErr) {
            console.error("Brevo email notification error:", emailErr);
          }
        }

        return NextResponse.json({ success: true, transaction, order: orderData });
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
