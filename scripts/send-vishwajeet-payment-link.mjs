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

async function sendBrevoEmail({ to, bcc, subject, htmlContent, textContent }) {
  const payload = {
    sender: { name: "Mayank Agrawal | Octopus Perfumes", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Octopus Perfumes Concierge", email: "hurkinds@gmail.com" },
    subject,
    htmlContent,
    textContent,
  };

  if (bcc && bcc.length > 0) {
    payload.bcc = bcc;
  }

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

const customerName = "Vishwajeet";
const productUrl = "https://www.octopusperfume.in/products/tom-ford-oud-wood-eau-de-parfum-for-unisex-vials-2ml";
const instantPayuUrl = "https://www.octopusperfume.in/payu-proxy?txnid=ORD-TF750-VISHWAJEET&amount=750&productinfo=Tom+Ford+Oud+Wood+2ml+Decant&firstname=Vishwajeet&email=wishvajeet9@gmail.com";
const fullBottleUrl = "https://www.octopusperfume.in/products/tom-ford-oud-wood-eau-de-perfume";

const emailSubject = "Re: Order request for Tom Ford Oud Wood EDP 2 mL - ₹750";

const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222222;background-color:#ffffff;line-height:1.65;font-size:15px;">
  <div style="max-width:620px;margin:0 auto;">

    <!-- Top Minimalist Header -->
    <div style="padding-bottom:14px;margin-bottom:24px;border-bottom:2px solid #141210;">
      <span style="font-weight:700;font-size:14px;letter-spacing:1.5px;color:#141210;text-transform:uppercase;">OCTOPUS LUXURY PERFUMES</span>
      <span style="float:right;font-size:12px;color:#777777;">Client Concierge Desk</span>
    </div>

    <p style="margin:0 0 16px 0;">Hi ${customerName},</p>

    <p style="margin:0 0 16px 0;">
      Thank you for confirming your order!
    </p>

    <!-- Merchant Name Confirmation Banner -->
    <div style="background-color:#FAF7F2;border:2px solid #D4AF7A;border-radius:10px;padding:18px 22px;margin:22px 0;">
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#9A7953;margin-bottom:6px;">
        ✔ MERCHANT NAME VERIFICATION
      </div>
      <div style="font-size:15px;color:#141210;line-height:1.6;">
        The official verified merchant name appearing on your UPI app / payment screen is:<br>
        <span style="display:inline-block;margin-top:6px;font-size:19px;font-weight:800;color:#141210;background:#ffffff;border:1px solid #e0ded9;padding:6px 14px;border-radius:6px;letter-spacing:0.5px;">
          Octopus Perfumes
        </span>
      </div>
    </div>

    <p style="margin:0 0 14px 0;">
      Here are the two official payment and checkout options to complete your order of <strong>₹750</strong>:
    </p>

    <!-- Option 1: Official Store Checkout -->
    <div style="background:#ffffff;border:1px solid #e8e6e1;border-radius:10px;padding:20px;margin-bottom:18px;">
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#9A7953;margin-bottom:6px;">
        OPTION 1 · OFFICIAL STORE CHECKOUT (RECOMMENDED)
      </div>
      <p style="margin:0 0 14px 0;font-size:13.5px;color:#444444;line-height:1.6;">
        Use this link if you want to enter your complete flat/street address in Omaxe City directly into our dispatch system:
      </p>
      <div style="margin-bottom:8px;">
        <a href="${productUrl}" target="_blank" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
          Enter Delivery Address &amp; Pay ₹750 &rarr;
        </a>
      </div>
      <div style="font-size:12px;color:#777777;">
        Direct Link: <a href="${productUrl}" style="color:#9A7953;text-decoration:underline;">${productUrl}</a>
      </div>
    </div>

    <!-- Option 2: Direct Instant PayU / UPI Link -->
    <div style="background:#FAF9F6;border:1px solid #e8e6e1;border-radius:10px;padding:20px;margin-bottom:22px;">
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#9A7953;margin-bottom:6px;">
        OPTION 2 · INSTANT DIRECT PAYU GATEWAY / UPI LINK
      </div>
      <p style="margin:0 0 14px 0;font-size:13.5px;color:#444444;line-height:1.6;">
        Click below to immediately open the secure PayU payment terminal for <strong>₹750</strong>. It generates a live UPI QR code (scan with Google Pay, PhonePe, Paytm, BHIM) and displays merchant <strong>Octopus Perfumes</strong>:
      </p>
      <div style="margin-bottom:8px;">
        <a href="${instantPayuUrl}" target="_blank" style="display:inline-block;background-color:#9A7953;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
          Open Instant UPI / PayU Terminal (₹750) &rarr;
        </a>
      </div>
      <div style="font-size:12px;color:#777777;">
        Direct Link: <a href="${instantPayuUrl}" style="color:#9A7953;text-decoration:underline;">${instantPayuUrl}</a>
      </div>
      <p style="margin:10px 0 0 0;font-size:12px;color:#666666;font-style:italic;">
        *If you use Option 2, simply reply to this email with your exact House/Flat No. in Omaxe City so we can generate your dispatch docket.
      </p>
    </div>

    <!-- Order Summary Recap -->
    <div style="border:1px solid #e8e6e1;border-radius:10px;padding:18px;margin:22px 0;background-color:#ffffff;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#777777;margin-bottom:8px;">
        Order Details Summary
      </div>
      <ul style="margin:0;padding-left:18px;font-size:13.5px;color:#333333;line-height:1.7;">
        <li><strong>Item:</strong> 1x Tom Ford Oud Wood Eau de Parfum (2 mL decant vial)</li>
        <li><strong>Complimentary Bonus:</strong> 1x 7ML Paradox EDP Deluxe Pocket Spray (Worth ₹399) included free</li>
        <li><strong>Total Delivered Amount:</strong> <strong>₹750</strong> (inclusive of all taxes and express air courier)</li>
        <li><strong>Delivery Destination:</strong> Omaxe City, Lucknow, Uttar Pradesh (PIN 226025)</li>
        <li><strong>Estimated Transit Time:</strong> 2 to 3 business days via Blue Dart / Express Air</li>
      </ul>
    </div>

    <p style="margin:20px 0 8px 0;font-size:13.5px;color:#444444;line-height:1.6;">
      As soon as your payment of ₹750 is completed, our fulfillment desk will pack your vial in shockproof honeycomb wrap, seal it with tamper-evident security tape, and email you the live tracking number.
    </p>

    <!-- Sign-off -->
    <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e8e6e1;">
      <p style="margin:0 0 4px 0;font-size:14px;color:#222222;">Warm regards,</p>
      <p style="margin:0;font-weight:700;font-size:15px;color:#141210;">Mayank Agrawal</p>
      <p style="margin:0;font-size:13px;color:#666666;">Founder &amp; Concierge Lead · Octopus Luxury Perfumes</p>
      <p style="margin:4px 0 0 0;font-size:12px;color:#888888;">
        Official Flagship: <a href="https://www.octopusperfume.in" style="color:#888888;text-decoration:underline;">octopusperfume.in</a> · Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#888888;">hurkinds@gmail.com</a>
      </p>
    </div>

  </div>
</body>
</html>`;

const emailText = `Hi Vishwajeet,

Thank you for confirming your order!

MERCHANT NAME VERIFICATION:
The official verified merchant name appearing on your UPI app / payment screen is:
Octopus Perfumes

Here are the two official payment and checkout options to complete your order of ₹750:

OPTION 1 · OFFICIAL STORE CHECKOUT (RECOMMENDED):
Use this link to enter your complete flat/street address in Omaxe City directly into our dispatch system:
${productUrl}

OPTION 2 · INSTANT DIRECT PAYU GATEWAY / UPI LINK:
Click below to open the secure PayU payment terminal for ₹750. It generates a live UPI QR code (Google Pay, PhonePe, Paytm, BHIM) and displays merchant Octopus Perfumes:
${instantPayuUrl}

(If you use Option 2, simply reply to this email with your exact House/Flat No. in Omaxe City so we can generate your dispatch docket).

ORDER SUMMARY:
- Item: 1x Tom Ford Oud Wood Eau de Parfum (2 mL decant vial)
- Complimentary Bonus: 1x 7ML Paradox EDP Deluxe Pocket Spray (Worth ₹399) included free
- Total Delivered Amount: ₹750 (All taxes & express air courier included)
- Destination: Omaxe City, Lucknow, Uttar Pradesh (PIN 226025)
- Delivery Estimate: 2 to 3 business days via Blue Dart / Express Air

As soon as your payment of ₹750 is completed, our fulfillment desk will pack your parcel in shockproof honeycomb wrap, seal it with tamper-evident security tape, and email you the live tracking number.

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Official Store: https://www.octopusperfume.in
Direct Concierge: hurkinds@gmail.com`;

async function main() {
  const customerEmail = "wishvajeet9@gmail.com";
  console.log(`🚀 Dispatching payment link email to customer: ${customerEmail}...`);

  try {
    const res = await sendBrevoEmail({
      to: [{ email: customerEmail, name: "Vishwajeet Verma" }],
      bcc: [
        { email: "littlecodr@gmail.com", name: "Mayank (Review Copy)" },
        { email: "hurkinds@gmail.com", name: "Concierge Archive" },
      ],
      subject: emailSubject,
      htmlContent: emailHtml,
      textContent: emailText,
    });
    console.log(`✅ Payment link delivered successfully to ${customerEmail}! Message ID: ${res.messageId}`);
  } catch (err) {
    console.error(`❌ Failed:`, err.message);
  }
}

main().catch(console.error);
