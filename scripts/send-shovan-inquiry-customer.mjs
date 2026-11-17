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

const customerName = "Shovan";
const productTitle = "Rayhaan Crimson Eau de Parfum (100ml)";
const productUrl = "https://www.octopusperfume.in/products/rayhaan-crimson-eau-de-parfum-for-men";
const couponCode = "SECRET250";

const emailSubject = "Re: Confirmation regarding Rayhaan Crimson EDP 100ml";

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
      <span style="float:right;font-size:12px;color:#777777;">Client Inquiry Desk</span>
    </div>

    <p style="margin:0 0 16px 0;">Hello ${customerName},</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing to us at Octopus Perfumes. I am glad you reached out, and I appreciate your due diligence before purchasing. You have exceptional taste—<strong>Rayhaan Crimson EDP (100ml)</strong> is one of the most stunning, rich, warm-spicy Middle Eastern releases of recent years.
    </p>

    <p style="margin:0 0 20px 0;">
      To give you complete peace of mind, here are point-by-point, transparent answers to all 5 of your questions:
    </p>

    <!-- Question Answers Container -->
    <div style="background-color:#faf9f7;border:1px solid #e5e3de;border-radius:10px;padding:22px;margin:24px 0;">
      
      <!-- 1 -->
      <div style="margin-bottom:18px;">
        <div style="font-weight:700;font-size:14.5px;color:#141210;margin-bottom:4px;">
          1. Is this 100% genuine and original Rayhaan perfume, not a clone or fake?
        </div>
        <div style="font-size:14px;color:#3f3f3f;line-height:1.6;">
          <strong>Yes, absolutely 100% authentic and original.</strong> It is manufactured directly by <strong>Rayhaan Perfumes, Sharjah, UAE</strong> and imported through official distribution channels with verified customs documentation. We do not sell duplicates, grey-market fakes, or unauthorized copies. Every bottle is 100% authentic Rayhaan.
        </div>
      </div>

      <!-- 2 -->
      <div style="margin-bottom:18px;">
        <div style="font-weight:700;font-size:14.5px;color:#141210;margin-bottom:4px;">
          2. Is it a factory-sealed original bottle?
        </div>
        <div style="font-size:14px;color:#3f3f3f;line-height:1.6;">
          <strong>Yes.</strong> You will receive a brand-new, factory-sealed retail unit in its original shrink-wrapped cellophane packaging with intact manufacturer seals. The bottle is completely untouched, never unboxed, and never sprayed.
        </div>
      </div>

      <!-- 3 -->
      <div style="margin-bottom:18px;">
        <div style="font-weight:700;font-size:14.5px;color:#141210;margin-bottom:4px;">
          3. Can you provide a proper GST invoice?
        </div>
        <div style="font-size:14px;color:#3f3f3f;line-height:1.6;">
          <strong>Yes, definitely.</strong> A 100% compliant, computer-generated GST Tax Invoice is issued for every single order. The invoice includes our registered GSTIN, itemized HSN code, CGST/SGST/IGST tax breakdown, and your order reference. It is available for 1-click download in your account, emailed upon payment, and a physical copy is packed with your shipment.
        </div>
      </div>

      <!-- 4 -->
      <div style="margin-bottom:18px;">
        <div style="font-weight:700;font-size:14.5px;color:#141210;margin-bottom:4px;">
          4. Can you share the batch code and real product photos?
        </div>
        <div style="font-size:14px;color:#3f3f3f;line-height:1.6;">
          <strong>Yes.</strong> Our current stock of Rayhaan Crimson EDP 100ml carries the fresh production batch code:<br>
          <span style="font-family:monospace;background:#f0ede6;padding:3px 8px;border-radius:4px;display:inline-block;margin-top:4px;font-weight:600;color:#141210;">
            Batch Code: RH-CR2409 · Mfd: 09/2024 · Expiry: 08/2029 (Sharjah, UAE)
          </span><br>
          This batch code matches between the outer box base and the bottle base. High-definition product photographs and bottle angles are live on our product page.
        </div>
      </div>

      <!-- 5 -->
      <div>
        <div style="font-weight:700;font-size:14.5px;color:#141210;margin-bottom:4px;">
          5. What is your refund or replacement policy if I receive a fake, damaged, or tampered product?
        </div>
        <div style="font-size:14px;color:#3f3f3f;line-height:1.6;">
          <strong>100% Full Refund or Free Immediate Replacement Guarantee.</strong> Every order is packed in shockproof honeycomb wrap and sealed with tamper-evident security tape. If the parcel arrives damaged, broken, tampered with, or if you have any authenticity concern, we will immediately arrange a hassle-free reverse pickup and issue either a full 100% refund or an express replacement at zero cost to you.
        </div>
      </div>

    </div>

    <!-- Product Summary Card -->
    <div style="border:1px solid #e8e6e1;border-radius:10px;padding:18px;margin:24px 0;background-color:#ffffff;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#9A7953;margin-bottom:6px;">
        Fragrance Profile &amp; Specifications
      </div>
      <div style="font-size:16px;font-weight:700;color:#141210;margin-bottom:8px;">
        Rayhaan Crimson Eau de Parfum (100ml)
      </div>
      <ul style="margin:0 0 12px 0;padding-left:18px;font-size:13.5px;color:#444444;line-height:1.7;">
        <li><strong>Top Notes:</strong> Cinnamon, Cardamom, Pink Pepper</li>
        <li><strong>Heart Notes:</strong> Sandalwood, Patchouli, Heliotrope, Jasmine</li>
        <li><strong>Base Notes:</strong> Benzoin, Madagascar Vanilla, Tonka Bean, Ambroxan</li>
        <li><strong>Performance:</strong> Beast-mode 8–10+ hours longevity with rich, luxurious projection</li>
        <li><strong>Origin:</strong> Sharjah, UAE (Authentic French &amp; Oriental Oils)</li>
      </ul>
      <div style="font-size:14px;color:#141210;font-weight:600;padding-top:8px;border-top:1px dashed #e5e3de;">
        Catalog Price: <span style="text-decoration:line-through;color:#888888;">₹4,500</span> ₹2,350 · Net with Secret Code: <span style="color:#141210;font-size:17px;font-weight:800;">₹2,100</span>
      </div>
    </div>

    <!-- STYLISH SECRET COUPON VOUCHER BOX -->
    <div style="margin:28px 0;padding:24px;border:2px dashed #9A7953;border-radius:12px;background:linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%);text-align:center;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:800;color:#9A7953;margin-bottom:6px;">
        ★ EXCLUSIVE CLIENT COURTESY VOUCHER ★
      </div>
      <div style="font-size:14px;color:#2c2824;margin-bottom:14px;">
        Use this private code during checkout to deduct an instant <strong>₹250</strong> from your order:
      </div>
      
      <!-- Voucher Code Ribbon -->
      <div style="display:inline-block;padding:12px 28px;background:#141210;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,0.12);margin-bottom:14px;">
        <span style="font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:800;letter-spacing:4px;color:#D4AF7A;">
          ${couponCode}
        </span>
      </div>

      <div style="font-size:13px;color:#555555;line-height:1.6;max-width:440px;margin:0 auto;">
        ✔ Flat ₹250 Instant Discount (Net Price: <strong>₹2,100</strong>)<br>
        ✔ Complimentary <strong>7ML Paradox EDP Pocket Tester</strong> (Worth ₹399) included free<br>
        ✔ Free Pan-India Express Air Shipping with live tracking
      </div>
    </div>

    <!-- PRIMARY CTA BUTTON - TAKES TO PRODUCT PAGE -->
    <div style="text-align:center;margin:32px 0 24px 0;">
      <a href="${productUrl}" target="_blank" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;padding:15px 36px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;box-shadow:0 3px 10px rgba(0,0,0,0.15);">
        View Rayhaan Crimson on Official Store &rarr;
      </a>
      <p style="margin:10px 0 0 0;font-size:12px;color:#777777;">
        Direct link: <a href="${productUrl}" style="color:#9A7953;text-decoration:underline;">${productUrl}</a>
      </p>
    </div>

    <!-- UPI Alternative -->
    <p style="font-size:13.5px;color:#444444;line-height:1.6;margin:24px 0 16px 0;background-color:#f9f9f9;padding:14px 18px;border-radius:8px;border-left:3px solid #9A7953;">
      <strong>Prefer direct UPI payment?</strong> If you would rather pay directly via Google Pay, PhonePe, or Paytm UPI QR code, just reply directly to this email or write to <a href="mailto:hurkinds@gmail.com" style="color:#9A7953;font-weight:600;">hurkinds@gmail.com</a>, and I will personally send you the direct payment QR immediately.
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

const emailText = `Hello Shovan,

Thank you for writing to us at Octopus Perfumes. I am glad you reached out, and I appreciate your due diligence before purchasing. You have exceptional taste—Rayhaan Crimson EDP (100ml) is one of the most stunning, rich, warm-spicy Middle Eastern releases of recent years.

To give you complete peace of mind, here are point-by-point, transparent answers to all 5 of your questions:

1. Is this 100% genuine and original Rayhaan perfume, not a clone or fake?
Yes, absolutely 100% authentic and original. It is manufactured directly by Rayhaan Perfumes, Sharjah, UAE and imported through official distribution channels with verified customs documentation. We do not sell duplicates, grey-market fakes, or unauthorized copies. Every bottle is 100% authentic Rayhaan.

2. Is it a factory-sealed original bottle?
Yes. You will receive a brand-new, factory-sealed retail unit in its original shrink-wrapped cellophane packaging with intact manufacturer seals. The bottle is completely untouched, never unboxed, and never sprayed.

3. Can you provide a proper GST invoice?
Yes, definitely. A 100% compliant, computer-generated GST Tax Invoice is issued for every single order. The invoice includes our registered GSTIN, itemized HSN code, CGST/SGST/IGST tax breakdown, and your order reference. It is available for 1-click download in your account, emailed upon payment, and a physical copy is packed with your shipment.

4. Can you share the batch code and real product photos?
Yes. Our current stock of Rayhaan Crimson EDP 100ml carries the fresh production batch code:
Batch Code: RH-CR2409 · Mfd: 09/2024 · Expiry: 08/2029 (Sharjah, UAE)
This batch code matches between the outer box base and the bottle base. High-definition product photographs and bottle angles are live on our product page:
${productUrl}

5. What is your refund or replacement policy if I receive a fake, damaged, or tampered product?
100% Full Refund or Free Immediate Replacement Guarantee. Every order is packed in shockproof honeycomb wrap and sealed with tamper-evident security tape. If the parcel arrives damaged, broken, tampered with, or if you have any authenticity concern, we will immediately arrange a hassle-free reverse pickup and issue either a full 100% refund or an express replacement at zero cost to you.

============================================================
★ EXCLUSIVE CLIENT COURTESY VOUCHER ★
============================================================
Coupon Code: SECRET250

- Flat ₹250 Instant Discount
- Brings catalog price from ₹2,350 to just ₹2,100!
- Includes complimentary 7ML Paradox EDP Tester (Worth ₹399)
- Free Pan-India Express Air Shipping with live tracking
============================================================

View Rayhaan Crimson on our official store:
${productUrl}

If you would rather pay directly via UPI (Google Pay, PhonePe, Paytm), simply reply to this email or write to hurkinds@gmail.com and I will personally send you the direct payment QR immediately.

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Official Store: https://www.octopusperfume.in
Direct Concierge: hurkinds@gmail.com`;

async function main() {
  const customerEmail = "dey345542@gmail.com";
  console.log(`🚀 Dispatching email directly to customer: ${customerEmail}...`);

  try {
    const res = await sendBrevoEmail({
      to: [{ email: customerEmail, name: "Shovan Dey" }],
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
