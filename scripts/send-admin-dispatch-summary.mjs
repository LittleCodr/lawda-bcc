import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const envPath = path.join(rootDir, ".env.local");
let apiKey = process.env.BREVO_API_KEY;

if (!apiKey && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("BREVO_API_KEY=")) {
      apiKey = line.split("=")[1].trim().replace(/^["']|["']$/g, "");
      break;
    }
  }
}

if (!apiKey) {
  console.error("❌ BREVO_API_KEY is not defined!");
  process.exit(1);
}

async function sendBrevoEmail({ to, subject, htmlContent, textContent }) {
  const payload = {
    sender: { name: "Octopus Concierge System", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Octopus Desk", email: "hurkinds@gmail.com" },
    subject,
    htmlContent,
    textContent,
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Brevo API Error (${response.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

const adminEmail = "littlecodr@gmail.com";
const adminSubject = "[Admin Notification] 2 High-Intent Customer Replies Sent & Vouchers Activated (Ankit Singh & Khrish Chauhan)";

const adminHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222;background-color:#f9f9f9;line-height:1.6;font-size:14px;">
  <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:10px;padding:28px;border:1px solid #e0e0e0;">

    <div style="border-bottom:2px solid #141210;padding-bottom:12px;margin-bottom:20px;">
      <h2 style="margin:0;color:#141210;font-size:18px;">Octopus Perfumes Concierge &middot; Admin Dispatch Alert</h2>
      <p style="margin:4px 0 0 0;color:#666;font-size:12px;">Automated lead conversion tracking &bull; Dispatched via Brevo SMTP</p>
    </div>

    <p style="margin:0 0 16px 0;">Hello Mayank,</p>
    <p style="margin:0 0 20px 0;">
      Both high-intent customer inquiries have been addressed with customized, persuasive, and doubt-clearing replies. Exclusive ₹250 conversion discount vouchers and free 7ML Paradox EDP testers were attached to close both sales immediately.
    </p>

    <!-- Lead 1 -->
    <div style="background:#fcfbf9;border:1px solid #ece7df;border-radius:8px;padding:18px;margin-bottom:20px;">
      <h3 style="margin:0 0 10px 0;color:#9A7953;font-size:16px;">1. Ankit Singh (Delhi NCR) &mdash; Rasasi Hawas Venom EDP</h3>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:#333;line-height:1.7;">
        <li><strong>Customer Email:</strong> <code>luk4ankit@gmail.com</code></li>
        <li><strong>Product:</strong> Rasasi Hawas Venom Eau de Parfum for Men (₹3,500)</li>
        <li><strong>Doubts Cleared:</strong>
          <ul>
            <li>Authenticity: 100% genuine, factory-cellophane sealed, official Dubai holographic seal &amp; laser batch codes.</li>
            <li>GST Invoice: Confirmed computerized GST tax invoice (HSN 33030010, 18% GST) provided.</li>
            <li>COD Policy &amp; Alternative: Explained why high-end Arabian perfumes are strictly prepaid (tampering/swap protection), backed by Delhi NCR priority dispatch via Blue Dart Express (24-48 hrs).</li>
            <li>Batch Code: Laser-etched matching outer box, verifiable on CheckFresh.</li>
          </ul>
        </li>
        <li><strong>Conversion Incentive:</strong> Voucher <code>VENOM250</code> (Flat ₹250 OFF &rarr; ₹3,250) + Free 7ML Paradox EDP Tester.</li>
        <li><strong>Direct Pre-Applied Checkout:</strong> <a href="https://www.octopusperfume.in/checkout?coupon=VENOM250">https://www.octopusperfume.in/checkout?coupon=VENOM250</a></li>
        <li><strong>Brevo Message ID:</strong> <code>&lt;202611261135.45151763683@smtp-relay.mailin.fr&gt;</code></li>
      </ul>
    </div>

    <!-- Lead 2 -->
    <div style="background:#fcfbf9;border:1px solid #ece7df;border-radius:8px;padding:18px;margin-bottom:20px;">
      <h3 style="margin:0 0 10px 0;color:#9A7953;font-size:16px;">2. Khrish Chauhan &mdash; Rayhaan Lion EDP 100ml</h3>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:#333;line-height:1.7;">
        <li><strong>Customer Email:</strong> <code>khrishchouhan@gmail.com</code></li>
        <li><strong>Product:</strong> Rayhaan Lion Eau de Parfum for Men 100ml (₹2,350)</li>
        <li><strong>Doubts Cleared:</strong>
          <ul>
            <li>Octopus Lifestyle Pvt Ltd (<code>buyoctopus.com</code>): Clarified that buyoctopus.com is an apparel/clothing brand with zero connection to perfumes. Octopus Perfumes (<code>octopusperfume.in</code>) is an independent luxury fragrance maison and authorized retailer.</li>
            <li>Authenticity &amp; Sourcing: 100% legal import through authorized Indian cosmetic distribution channels with customs clearance and importer declarations.</li>
            <li>GST Invoice: Computerized invoice with HSN 33030010 + 18% GST breakdown sent via email and packed in the parcel.</li>
            <li>Payment Safety: Processed via RBI-licensed PayU / Cashfree with 256-bit bank encryption and complete buyer guarantee.</li>
          </ul>
        </li>
        <li><strong>Conversion Incentive:</strong> Voucher <code>RAYHAAN250</code> (Flat ₹250 OFF &rarr; ₹2,100) + Free 7ML Paradox EDP Tester.</li>
        <li><strong>Direct Pre-Applied Checkout:</strong> <a href="https://www.octopusperfume.in/checkout?coupon=RAYHAAN250">https://www.octopusperfume.in/checkout?coupon=RAYHAAN250</a></li>
        <li><strong>Brevo Message ID:</strong> <code>&lt;202611261135.63531913750@smtp-relay.mailin.fr&gt;</code></li>
      </ul>
    </div>

    <!-- Summary Box -->
    <div style="background:#f0f7f3;border-left:4px solid #2e7d32;padding:12px 16px;border-radius:4px;font-size:13px;color:#1b5e20;">
      <strong>Live Tracking:</strong> Cart initiation and payment initiation events are active on Telegram (@jai_kirmada). As soon as Ankit or Khrish clicks the link and initiates checkout, you will receive an immediate Telegram alert.
    </div>

  </div>
</body>
</html>`;

const adminText = `Octopus Perfumes Concierge - Admin Dispatch Alert

Hello Mayank,

Both customer inquiries have been replied to individually with custom, high-converting messages.

1. Ankit Singh (luk4ankit@gmail.com) - Rasasi Hawas Venom EDP:
- Doubts cleared: 100% authentic, GST invoice provided, COD replaced with Delhi NCR 24-48h Blue Dart Express, batch code verifiable on CheckFresh.
- Incentive: Coupon VENOM250 (Flat ₹250 OFF -> ₹3,250) + Free 7ML Paradox EDP Tester.
- Checkout Link: https://www.octopusperfume.in/checkout?coupon=VENOM250
- Brevo ID: <202611261135.45151763683@smtp-relay.mailin.fr>

2. Khrish Chauhan (khrishchouhan@gmail.com) - Rayhaan Lion EDP 100ml:
- Doubts cleared: Clarified separation from buyoctopus.com (apparel brand vs our independent fragrance maison), 100% authorized distributor sourcing, GST invoice provided, RBI PayU buyer protection.
- Incentive: Coupon RAYHAAN250 (Flat ₹250 OFF -> ₹2,100) + Free 7ML Paradox EDP Tester.
- Checkout Link: https://www.octopusperfume.in/checkout?coupon=RAYHAAN250
- Brevo ID: <202611261135.63531913750@smtp-relay.mailin.fr>

All voucher codes are committed and live on the checkout page. Telegram alerts will notify you as soon as they initiate checkout or pay.
`;

async function main() {
  console.log("Dispatching admin notification to littlecodr@gmail.com...");
  const res = await sendBrevoEmail({
    to: [{ email: adminEmail, name: "Mayank Agrawal (Admin)" }],
    subject: adminSubject,
    htmlContent: adminHtml,
    textContent: adminText,
  });
  console.log("✅ Admin notification sent successfully! Message ID:", res.messageId);
}

main().catch(console.error);
