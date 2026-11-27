import { NextResponse } from "next/server";
import crypto from "crypto";
import { parseRequestDevice } from "@/lib/device-info";
import { saveCartSessionQuotaOptimized } from "@/lib/cart-session";
import { sendTelegramMessage, formatISTDate } from "@/lib/telegram";

// Hardcoded verified PayU credentials to guarantee consistent hash generation across environments
const PAYU_KEY = "BfDKZe";
const PAYU_SALT = "iQ7BOSg394ZQQKY2Mu5evsBnwobF4shg";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const txnid = (body.txnid || body.orderId || `ORD-${Date.now()}`).toString().trim();
    const rawAmount = body.amount;
    const firstname = (body.firstname || body.name || "Customer").toString().replace(/[^a-zA-Z ]/g, "").trim() || "Customer";
    const email = (body.email || "customer@octopusperfume.in").toString().trim();
    const phone = (body.phone || "").toString().replace(/\D/g, "").slice(-10) || "9999999999";
    const rawProductInfo = (body.productinfo || body.cartSummary || "Order Payment").toString();
    const productinfo = rawProductInfo.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Order Payment";

    const udf1 = (body.udf1 || "octopusperfumes").toString().replace(/[^a-zA-Z0-9_-]/g, "").trim();
    const udf2 = (body.userId || body.uid || "").toString().replace(/[^a-zA-Z0-9_-]/g, "").trim();
    const udf3 = (body.udf3 || body.plan || "").toString().replace(/[^a-zA-Z0-9_-]/g, "").trim();
    const udf4 = (body.udf4 || body.from || "").toString().replace(/[^a-zA-Z0-9_-]/g, "").trim();
    const udf5 = "";

    const key = PAYU_KEY;
    const salt = PAYU_SALT;

    if (!txnid || rawAmount === undefined || rawAmount === null || rawAmount === "") {
      return NextResponse.json({ error: "Missing required parameters: txnid or amount" }, { status: 400 });
    }

    const isAdmin = email.toLowerCase().trim() === "littlecodr@gmail.com";
    const numAmount = isAdmin ? 1.00 : Number(rawAmount);
    const amountStr = !isNaN(numAmount) ? numAmount.toFixed(2) : String(rawAmount);

    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = `${key}|${txnid}|${amountStr}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // Dynamically resolve caller origin for surl/furl
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "octopusperfume.in";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${host}`;

    const surl = `${origin}/api/payu/callback`;
    const furl = `${origin}/api/payu/callback`;
    const action = "https://secure.payu.in/_payment";

    // 1. Parse client device & location from request headers
    const deviceInfo = parseRequestDevice(req, body.clientInfo);
    const shipping = body.shipping || {};
    const items = body.items || [];
    const sessionId = body.sessionId;

    // 2. Format Telegram Notification for Payment Initiated (Proceeded to Pay)
    const timeIST = formatISTDate();
    const addressLine = [
      shipping.address,
      shipping.city,
      shipping.state,
      shipping.pincode ? `PIN: ${shipping.pincode}` : ""
    ].filter(Boolean).join(", ");

    const itemsSummary = items.length > 0
      ? items.map((i: any) => `• ${i.title}${i.variantTitle ? ` (${i.variantTitle})` : ""} x ${i.quantity} - ₹${i.price * i.quantity}`).join("\n")
      : `• ${productinfo}`;

    const tgMessage = `🟠 *Payment Initiated! (Proceeded to Pay)*\n\n` +
      `🆔 *Order ID:* \`${txnid}\`\n` +
      `💵 *Payable Amount:* ₹${numAmount.toLocaleString("en-IN")}\n` +
      `💳 *Mode:* PayU Secure Gateway (UPI / Cards / NetBanking)\n\n` +
      `👤 *Customer Details:*\n` +
      `• *Name:* ${firstname}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Email:* ${email}\n` +
      (addressLine ? `• *Destination:* ${addressLine}\n\n` : `\n`) +
      `🛍 *Products:*\n` +
      `${itemsSummary}\n\n` +
      `📱 *Device:* ${deviceInfo.deviceDisplay}\n` +
      `📐 *Screen:* ${deviceInfo.screen || "N/A"}\n` +
      `🌐 *IP:* \`${deviceInfo.ip}\`\n` +
      `📍 *Location:* ${deviceInfo.locationDisplay}\n` +
      `⏱ *Time:* ${timeIST}`;

    const isUnderneat = udf1 === "underneat" || udf1 === "underneatbykusha";
    const isNamoNarayana = udf1 === "namonarayanaghee";
    const isInternshipsHub = udf1 === "internshipshub" || udf1 === "internships-hub" || udf1.startsWith("internship");
    const isMyInternships = udf1 === "myinternships" || udf1 === "myinternships.online" || udf1.startsWith("myinternship");
    if (isUnderneat) {
      const underneatBot = "9151093535:AAGH4WqU_QHGgLaKUvnn_-hFGG81dsQclAI";
      const chatId = "5804733110";
      fetch(`https://api.telegram.org/bot${underneatBot}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🟠 *Payment Initiated on Underneat (PayU Gateway)*\n\n🆔 *Order ID:* \`${txnid}\`\n💵 *Amount:* ₹${numAmount}\n👤 *Customer:* ${firstname} (${phone})\n📧 *Email:* ${email}\n🛍 *Items:* ${productinfo}`,
          parse_mode: "Markdown",
        }),
      }).catch((e) => console.error("Underneat TG alert error:", e));
    } else if (isNamoNarayana) {
      const namoBot = "8816035157:AAHzskP8Jpbtxx0HrVYt-pYc6eviVyt54qs";
      const chatId = "5804733110";
      fetch(`https://api.telegram.org/bot${namoBot}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🟠 *Payment Initiated on Namo Narayana (PayU Gateway)*\n\n🆔 *Order ID:* \`${txnid}\`\n💵 *Amount:* ₹${numAmount}\n👤 *Customer:* ${firstname} (${phone})\n📧 *Email:* ${email}\n🛍 *Items:* ${productinfo}`,
          parse_mode: "Markdown",
        }),
      }).catch((e) => console.error("Namo Narayana TG alert error:", e));
    } else if (isInternshipsHub) {
      const internBot = process.env.TELEGRAM_BOT_TOKEN || "8878473167:AAH0MBRxFDUc7qbged9fMlypBapGu4QBovk";
      const chatId = process.env.TELEGRAM_CHAT_ID || "5804733110";
      fetch(`https://api.telegram.org/bot${internBot}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🎓 *Payment Initiated on InternshipsHub (PayU Gateway)*\n\n🆔 *Order ID:* \`${txnid}\`\n💵 *Payable Amount:* ₹${numAmount}\n🏷️ *Plan:* ${productinfo}\n👤 *Candidate:* ${firstname} (${phone})\n📧 *Email:* ${email}\n⏱ *Time:* ${timeIST}`,
          parse_mode: "Markdown",
        }),
      }).catch((e) => console.error("InternshipsHub TG alert error:", e));
    } else if (isMyInternships) {
      const internBot = process.env.TELEGRAM_BOT_TOKEN || "8878473167:AAH0MBRxFDUc7qbged9fMlypBapGu4QBovk";
      const chatId = process.env.TELEGRAM_CHAT_ID || "5804733110";
      fetch(`https://api.telegram.org/bot${internBot}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🎓 *Payment Initiated on myinternships.online (PayU Gateway)*\n\n🆔 *Order ID:* \`${txnid}\`\n💵 *Payable Amount:* ₹${numAmount}\n🏷️ *Plan:* ${udf3 || "Lifetime Pass"}\n👤 *Candidate:* ${firstname} (${phone})\n📧 *Email:* ${email}\n💼 *Slug:* ${udf4 || "Direct"}\n⏱ *Time:* ${timeIST}`,
          parse_mode: "Markdown",
        }),
      }).catch((e) => console.error("MyInternships TG alert error:", e));
    } else {
      // Fire Telegram message asynchronously for default store
      sendTelegramMessage(tgMessage).catch((err) =>
        console.error("Failed to send payment initiated Telegram alert:", err)
      );
    }

    // 3. Update Firestore cart session to payment_initiated (forced single write for this milestone)
    if (sessionId) {
      saveCartSessionQuotaOptimized({
        sessionId,
        items,
        totalItems: items.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0),
        subtotal: numAmount,
        deviceInfo,
        status: "payment_initiated",
        orderId: txnid,
        customer: {
          name: firstname,
          phone,
          email,
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode,
        },
      }, true).catch((err) => console.error("Firestore payment session update error:", err));
    }

    return NextResponse.json({
      action,
      key,
      txnid,
      amount: amountStr,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      service_provider: "payu_paisa",
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("PayU hash error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
