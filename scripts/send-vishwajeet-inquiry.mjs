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
const fullBottleUrl = "https://www.octopusperfume.in/products/tom-ford-oud-wood-eau-de-perfume";
const fullBottleCheckoutUrl = "https://www.octopusperfume.in/checkout?coupon=TF1000";
const decantVialUrl = "https://www.octopusperfume.in/products/tom-ford-oud-wood-eau-de-parfum-for-unisex-vials-2ml";
const couponCode = "TF1000";

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

    <p style="margin:0 0 16px 0;">Hello ${customerName},</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing to us at Octopus Perfumes. You have exquisite taste—<strong>Tom Ford Oud Wood Eau de Parfum</strong> is universally regarded as the gold standard of modern luxury woody fragrances.
    </p>

    <p style="margin:0 0 16px 0;">
      To answer all four of your questions directly:
    </p>

    <!-- Quick Answers Box -->
    <div style="background-color:#faf9f7;border:1px solid #e5e3de;border-radius:10px;padding:20px;margin:20px 0;">
      <ul style="margin:0;padding-left:18px;font-size:14px;color:#333333;line-height:1.7;">
        <li><strong>Availability:</strong> Both the 2 mL sample vial and the full retail presentation bottles (50ml &amp; 100ml) are <strong>in stock</strong> in our temperature-controlled vault and ready to dispatch.</li>
        <li><strong>Delivered Price for 2 mL:</strong> Exactly <strong>₹750</strong> (inclusive of all taxes and express air shipping).</li>
        <li><strong>Delivery Estimate to Lucknow (PIN 226025):</strong> Express air courier to <strong>Omaxe City, Lucknow</strong> takes just <strong>2 to 3 business days</strong> via Blue Dart / Express Air.</li>
        <li><strong>Cash on Delivery (COD) Policy:</strong> All orders are processed strictly via <strong>100% secure online prepaid payment</strong> (UPI / Google Pay, PhonePe, Paytm, Cards, NetBanking). For rare luxury Private Blend fragrances, we enforce prepaid-only with insured tamper-evident security sealing to prevent transit tampering or courier package swaps.</li>
      </ul>
    </div>

    <!-- The Sincere Recommendation: Why the Full Bottle is the Smarter Choice -->
    <div style="margin:26px 0;padding:22px;border:1px solid #e8e6e1;border-radius:12px;background:#ffffff;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:800;color:#9A7953;margin-bottom:8px;">
        ★ AN HONEST INSIDER RECOMMENDATION ★
      </div>
      <h3 style="margin:0 0 12px 0;font-size:17px;font-weight:700;color:#141210;line-height:1.35;">
        Why a 2 mL decant will disappoint you — and why the full retail bottle is 10x better value
      </h3>

      <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.65;">
        While we are happy to send you the 2 mL vial, I want to share a transparent perspective before you spend ₹750:
      </p>

      <ol style="margin:0 0 16px 0;padding-left:20px;font-size:13.5px;color:#444444;line-height:1.7;">
        <li><strong>The Math Doesn't Make Sense:</strong> A 2 mL vial at ₹750 works out to <strong>₹375 per mL</strong> (which equals an absurd ₹37,500 for 100ml!). In contrast, the full retail bottle brings your cost down by more than 60% per spray.</li>
        <li><strong>2 mL Is Gone in 2 Days:</strong> 2 mL is only about 20 to 22 sprays. Tom Ford Oud Wood is a complex, evolving masterpiece—smoky oud, Brazilian rosewood, cardamom, sandalwood, vetiver, tonka bean, and amber. By the third time you wear it and people start complimenting you, the vial is completely empty.</li>
        <li><strong>Collector's Flacon vs. Plastic/Glass Tube:</strong> A sample comes in an unbranded plain vial. The full bottle comes in the legendary Tom Ford Private Blend flacon—an architectural, chess-piece work of art on your dresser—100% factory shrink-wrapped in cellophane with batch code verification and full GST tax invoice.</li>
      </ol>
    </div>

    <!-- STYLISH EXCLUSIVE VOUCHER BOX FOR FULL BOTTLE -->
    <div style="margin:26px 0;padding:24px;border:2px dashed #9A7953;border-radius:12px;background:linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%);text-align:center;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:800;color:#9A7953;margin-bottom:6px;">
        ★ EXCLUSIVE COURTESY VOUCHER FOR VISHWAJEET ★
      </div>
      <div style="font-size:14px;color:#2c2824;margin-bottom:14px;">
        To make upgrading to the full bottle an easy decision, I have generated a private voucher for you:
      </div>
      
      <!-- Voucher Ribbon -->
      <div style="display:inline-block;padding:12px 28px;background:#141210;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,0.12);margin-bottom:14px;">
        <span style="font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:800;letter-spacing:4px;color:#D4AF7A;">
          ${couponCode}
        </span>
      </div>

      <div style="font-size:13.5px;color:#3f3f3f;line-height:1.7;max-width:480px;margin:0 auto;">
        ✔ <strong>Flat ₹1,000 Instant Discount</strong> on Tom Ford Oud Wood Full Bottle<br>
        • <strong>50ml Bottle:</strong> Listed at ₹16,750 (MRP ₹20,500) &rarr; <strong style="color:#141210;font-size:15px;">₹15,750</strong> with code<br>
        • <strong>100ml Bottle:</strong> Listed at ₹25,500 (MRP ₹30,990) &rarr; <strong style="color:#141210;font-size:15px;">₹24,500</strong> with code<br>
        ✔ Complimentary <strong>7ML Paradox EDP Deluxe Pocket Spray</strong> (Worth ₹399) added free<br>
        ✔ 100% Brand-New, Factory-Sealed Cellophane with GST Tax Invoice<br>
        ✔ Express Pan-India Air Delivery to Omaxe City, Lucknow
      </div>
    </div>

    <!-- ACTION BUTTONS: BOTH LINKS GIVEN -->
    <div style="text-align:center;margin:32px 0 24px 0;">
      
      <!-- Button 1: Full Bottle (Recommended) -->
      <div style="margin-bottom:16px;">
        <a href="${fullBottleUrl}" target="_blank" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;box-shadow:0 3px 10px rgba(0,0,0,0.15);">
          Upgrade to Full Bottle (₹1,000 OFF) &rarr;
        </a>
        <div style="font-size:12px;color:#777777;margin-top:6px;">
          Product Link: <a href="${fullBottleUrl}" style="color:#9A7953;text-decoration:underline;">${fullBottleUrl}</a><br>
          Direct Checkout with code pre-applied: <a href="${fullBottleCheckoutUrl}" style="color:#9A7953;">Click here to checkout</a>
        </div>
      </div>

      <!-- Button 2: Decant Vial (If still preferred) -->
      <div style="padding-top:14px;border-top:1px dashed #e5e3de;">
        <p style="margin:0 0 8px 0;font-size:13px;color:#666666;">
          If you still prefer starting small with the 2 mL sample vial:
        </p>
        <a href="${decantVialUrl}" target="_blank" style="display:inline-block;background-color:#f5efe6;color:#141210;text-decoration:none;padding:10px 22px;border-radius:6px;font-size:12px;font-weight:600;border:1px solid #d4cfc7;">
          Order 2 mL Vial for ₹750 &rarr;
        </a>
        <div style="font-size:11.5px;color:#888888;margin-top:5px;">
          Direct Link: <a href="${decantVialUrl}" style="color:#888888;text-decoration:underline;">${decantVialUrl}</a>
        </div>
      </div>

    </div>

    <!-- Direct UPI Payment Option -->
    <p style="font-size:13.5px;color:#444444;line-height:1.6;margin:24px 0 16px 0;background-color:#f9f9f9;padding:14px 18px;border-radius:8px;border-left:3px solid #9A7953;">
      <strong>Prefer direct UPI payment?</strong> If you want to pay directly via Google Pay, PhonePe, or Paytm UPI QR code, simply reply to this email or write to <a href="mailto:hurkinds@gmail.com" style="color:#9A7953;font-weight:600;">hurkinds@gmail.com</a>, and I will personally generate and send you the direct payment QR code immediately.
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

const emailText = `Hello Vishwajeet,

Thank you for writing to us at Octopus Perfumes. You have exquisite taste—Tom Ford Oud Wood Eau de Parfum is universally regarded as the gold standard of modern luxury woody fragrances.

To answer all four of your questions directly:
1. Availability: Both the 2 mL sample vial and the full retail presentation bottles (50ml & 100ml) are in stock in our temperature-controlled vault and ready to dispatch.
2. Delivered Price for 2 mL: Exactly ₹750 (inclusive of all taxes and express air shipping).
3. Delivery Estimate to Lucknow (PIN 226025): Express air courier to Omaxe City, Lucknow takes 2 to 3 business days via Blue Dart / Express Air.
4. Cash on Delivery (COD) Policy: All orders are processed strictly via 100% secure online prepaid payment (UPI, Google Pay, PhonePe, Cards, NetBanking). For rare luxury Private Blend fragrances, we enforce prepaid-only with insured tamper-evident security sealing to prevent transit tampering or courier package swaps.

============================================================
★ AN HONEST INSIDER RECOMMENDATION ★
============================================================
Why a 2 mL decant will disappoint you — and why the full retail bottle is 10x better value:

1. The Math: At ₹750 for 2 mL, you are paying ₹375 per mL (equivalent to an absurd ₹37,500 for a 100ml bottle!). In contrast, the full retail bottle brings your cost down by more than 60% per spray.
2. 2 mL Is Gone in 2 Days: 2 mL gives only about 20 to 22 sprays. Tom Ford Oud Wood is a complex, evolving masterpiece—smoky oud, Brazilian rosewood, cardamom, sandalwood, vetiver, tonka bean, and amber. By the third time you wear it and people start complimenting you, the vial is completely empty.
3. Collector's Flacon: A sample comes in an unbranded plain vial. The full bottle comes in the legendary Tom Ford Private Blend flacon—an architectural chess-piece work of art on your dresser—100% factory shrink-wrapped in cellophane with batch code verification and full GST tax invoice.

============================================================
★ EXCLUSIVE COURTESY VOUCHER FOR VISHWAJEET ★
============================================================
Coupon Code: TF1000

- Flat ₹1,000 Instant Discount on Tom Ford Oud Wood Full Bottle
• 50ml Bottle: Listed at ₹16,750 (MRP ₹20,500) -> ₹15,750 with code
• 100ml Bottle: Listed at ₹25,500 (MRP ₹30,990) -> ₹24,500 with code
- Includes Complimentary 7ML Paradox EDP Pocket Tester (Worth ₹399)
- 100% Brand-New, Factory-Sealed Cellophane with GST Tax Invoice
- Free Pan-India Express Air Shipping to Omaxe City, Lucknow
============================================================

LINKS TO ORDER:

1. Option 1 (Recommended - Full Retail Bottle with ₹1,000 OFF pre-applied):
${fullBottleUrl}
Direct checkout link: ${fullBottleCheckoutUrl}

2. Option 2 (2 mL Sample Vial if you still prefer starting small):
${decantVialUrl}

If you would rather pay directly via UPI (Google Pay, PhonePe, Paytm), simply reply to this email or write to hurkinds@gmail.com and I will personally send you the direct payment QR code immediately.

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Official Store: https://www.octopusperfume.in
Direct Concierge: hurkinds@gmail.com`;

async function main() {
  const customerEmail = "wishvajeet9@gmail.com";
  console.log(`🚀 Dispatching email directly to customer: ${customerEmail}...`);

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
    console.log(`✅ Email delivered successfully to ${customerEmail}! Message ID: ${res.messageId}`);
  } catch (err) {
    console.error(`❌ Failed:`, err.message);
  }
}

main().catch(console.error);
