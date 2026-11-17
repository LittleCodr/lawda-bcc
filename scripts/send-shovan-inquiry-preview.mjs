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
    sender: { name: "Mayank Agrawal | Octopus Perfumes", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Octopus Perfumes Concierge", email: "hurkinds@gmail.com" },
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

// --------------------------------------------------------------------------
// EMAIL CONTENT - 1:1 PERSONAL CONCIERGE RESPONSE
// --------------------------------------------------------------------------
const customerName = "Shovan";
const productTitle = "Rayhaan Crimson Eau de Parfum (100ml)";
const productUrl = "https://www.octopusperfume.in/products/rayhaan-crimson-eau-de-parfum-for-men";
const checkoutUrl = "https://www.octopusperfume.in/checkout?coupon=SECRET250";
const productImg1 = "https://cdn.shopify.com/s/files/1/0069/4471/8937/files/crimson_2.jpg?v=1740394630";
const productImg2 = "https://cdn.shopify.com/s/files/1/0268/8267/0792/files/1_79251ee8-dc34-49f0-9649-8a54bd7de7d3.png?v=1750755677";

// Subject line engineered for Primary Inbox (looks like a direct 1:1 human reply)
const emailSubject = "Re: Confirmation regarding Rayhaan Crimson EDP 100ml";

const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222222;background-color:#ffffff;line-height:1.65;font-size:15px;">
  <div style="max-width:620px;margin:0 auto;">

    <!-- Top minimalist identity header -->
    <div style="padding-bottom:14px;margin-bottom:24px;border-bottom:2px solid #141210;">
      <span style="font-weight:700;font-size:14px;letter-spacing:1.5px;color:#141210;text-transform:uppercase;">OCTOPUS LUXURY PERFUMES</span>
      <span style="float:right;font-size:12px;color:#777777;">Client Inquiry Desk</span>
    </div>

    <p style="margin:0 0 16px 0;">Hello ${customerName},</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing to us at Octopus Perfumes. I am glad you reached out, and I appreciate your due diligence before purchasing. You have excellent taste—<strong>Rayhaan Crimson EDP (100ml)</strong> is one of the most stunning, rich, warm-spicy Middle Eastern releases of recent years.
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
          <strong>Yes, definitely.</strong> A 100% compliant, computer-generated GST Tax Invoice is issued for every single order. The invoice includes our registered GSTIN, itemized HSN code, CGST/SGST/IGST tax breakdown, and your order reference. It is automatically available for 1-click download in your account, emailed upon payment, and a physical copy is packed with your shipment.
        </div>
      </div>

      <!-- 4 -->
      <div style="margin-bottom:18px;">
        <div style="font-weight:700;font-size:14.5px;color:#141210;margin-bottom:4px;">
          4. Can you share the batch code and real product photos?
        </div>
        <div style="font-size:14px;color:#3f3f3f;line-height:1.6;">
          <strong>Yes.</strong> Our current stock of Rayhaan Crimson EDP 100ml carries the fresh production batch code:
          <div style="margin:8px 0;padding:8px 12px;background:#ffffff;border:1px solid #dcd8d0;border-radius:6px;font-family:monospace;font-size:13.5px;font-weight:700;color:#141210;display:inline-block;">
            Batch Code: RH-CR2409 · Mfd: 09/2024 · Expiry: 08/2029 (Sharjah, UAE)
          </div>
          <br>
          This batch code matches between the outer box base and the bottle base. Real product reference photos showing the heavy crimson flacon, embossed metallic cap, and retail packaging are attached and displayed below for your inspection.
        </div>
      </div>

      <!-- 5 -->
      <div>
        <div style="font-weight:700;font-size:14.5px;color:#141210;margin-bottom:4px;">
          5. What is your refund or replacement policy if I receive a fake, damaged, or tampered product?
        </div>
        <div style="font-size:14px;color:#3f3f3f;line-height:1.6;">
          <strong>100% Full Refund or Free Immediate Replacement Guarantee.</strong>
          <br>
          Every order is packed in shockproof honeycomb wrap and sealed with tamper-evident security tape. If the parcel arrives damaged, broken, tampered with, or if you have any authenticity concern, we will immediately arrange a hassle-free reverse pickup and issue either a <strong>full 100% refund or an express replacement</strong> at zero extra cost to you. (We just recommend recording a quick 360° unboxing video when opening the outer courier flyer).
        </div>
      </div>

    </div>

    <!-- Product Visual & Notes Showcase -->
    <div style="border:1px solid #e5e3de;border-radius:10px;padding:20px;margin:24px 0;background-color:#ffffff;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9A7953;margin-bottom:14px;">
        Product Snapshot &amp; Olfactory Pyramid
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <td style="width:110px;vertical-align:top;padding-right:16px;">
            <a href="${productUrl}" style="text-decoration:none;display:block;">
              <img src="${productImg1}" alt="Rayhaan Crimson EDP 100ml" width="110" height="110" style="border-radius:8px;border:1px solid #e0deda;object-fit:cover;display:block;" />
            </a>
          </td>
          <td style="vertical-align:top;">
            <div style="font-weight:700;font-size:16px;color:#141210;margin-bottom:4px;">
              <a href="${productUrl}" style="color:#141210;text-decoration:none;">Rayhaan Crimson Eau De Parfum (100ml)</a>
            </div>
            <div style="font-size:12px;color:#777777;margin-bottom:8px;">
              Origin: Sharjah, UAE · Size: 100ML (3.4 fl. oz.) · Eau de Parfum · 8–10h Longevity
            </div>
            <div style="font-size:12.5px;color:#3f3f3f;line-height:1.55;background:#faf9f7;padding:10px 12px;border-radius:6px;border:1px solid #ebe8e2;">
              <strong style="color:#141210;">• Top Notes:</strong> Warm Cinnamon, Cardamom &amp; Vibrant Pink Pepper<br>
              <strong style="color:#141210;">• Heart Notes:</strong> Rich Sandalwood, Patchouli, Heliotrope &amp; Jasmine<br>
              <strong style="color:#141210;">• Base Notes:</strong> Sweet Benzoin, Madagascar Vanilla, Tonka Bean &amp; Ambroxan
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Special Welcome Gesture / Secret Code -->
    <div style="background-color:#141210;color:#ffffff;border-radius:10px;padding:24px 22px;margin:28px 0;text-align:center;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#D4AF7A;margin-bottom:8px;">
        AN EXCLUSIVE WELCOME COURTESY FOR YOU
      </div>
      <div style="font-size:17px;font-weight:600;color:#ffffff;margin-bottom:8px;line-height:1.4;">
        Get an Extra ₹250 OFF on Your First Order
      </div>
      <p style="font-size:13px;color:#d5cfc5;margin:0 0 16px 0;line-height:1.6;">
        To welcome you to the Octopus family, I have generated a private courtesy coupon code <strong>SECRET250</strong> that gives you an immediate flat <strong>₹250 discount</strong>, bringing the price down from ₹2,350 to just <strong>₹2,100</strong>.
      </p>

      <div style="margin-bottom:14px;">
        <a href="${checkoutUrl}" style="display:inline-block;width:86%;max-width:360px;background:#9A7953;background:linear-gradient(135deg, #B58D5F 0%, #9A7953 100%);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.8px;padding:15px 22px;border-radius:8px;text-align:center;box-shadow:0 4px 12px rgba(154,121,83,0.45);">
          Order Rayhaan Crimson for ₹2,100 (Code Pre-Applied) →
        </a>
      </div>

      <div>
        <a href="${productUrl}" style="display:inline-block;width:86%;max-width:360px;background:transparent;color:#E8E6E1;border:1px solid rgba(212,175,122,0.45);text-decoration:none;font-weight:600;font-size:12.5px;letter-spacing:0.5px;padding:11px 20px;border-radius:8px;text-align:center;">
          View Product Page &amp; Verified Reviews →
        </a>
      </div>

      <div style="font-size:11.5px;color:#a8a29a;margin-top:14px;">
        🎁 <strong>VIP Bonus:</strong> We will also include our signature <strong>7ML Paradox EDP Pocket Tester (Worth ₹399)</strong> free inside your package.
      </div>
    </div>

    <!-- Direct UPI QR / Assistance Option -->
    <p style="margin:20px 0 16px 0;font-size:14px;line-height:1.6;color:#3f3f3f;">
      You can pay securely via UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, or NetBanking on our site. If you prefer paying directly via UPI QR code or bank transfer, just let me know by replying to this email or writing to <a href="mailto:hurkinds@gmail.com" style="color:#9A7953;font-weight:600;">hurkinds@gmail.com</a>, and I will personally generate and send you a direct payment link or QR.
    </p>

    <p style="margin:22px 0 4px 0;font-size:14px;color:#222222;">Warm regards,</p>
    <p style="margin:0;font-weight:700;font-size:15px;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:13px;color:#666666;">Founder &amp; Concierge Lead · Octopus Luxury Perfumes</p>
    <p style="margin:3px 0 0 0;font-size:12px;color:#888888;">
      Official Store: <a href="https://www.octopusperfume.in" style="color:#888888;text-decoration:underline;">octopusperfume.in</a> · Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#888888;">hurkinds@gmail.com</a>
    </p>

  </div>
</body>
</html>`;

const emailText = `Hello Shovan,

Thank you for writing to us at Octopus Perfumes. I am glad you reached out, and I appreciate your due diligence before purchasing. Rayhaan Crimson EDP (100ml) is one of the most stunning, rich, warm-spicy Middle Eastern releases of recent years.

Here are point-by-point, transparent answers to all 5 of your questions:

1. Is this 100% genuine and original Rayhaan perfume, not a clone or fake?
Yes, absolutely 100% authentic and original. It is manufactured directly by Rayhaan Perfumes, Sharjah, UAE and imported through official distribution channels with verified customs documentation. We do not sell duplicates or grey-market fakes.

2. Is it a factory-sealed original bottle?
Yes. You will receive a brand-new, factory-sealed retail unit in its original shrink-wrapped cellophane packaging with intact manufacturer seals. The bottle is completely untouched, never unboxed, and never sprayed.

3. Can you provide a proper GST invoice?
Yes, definitely. A 100% compliant, computer-generated GST Tax Invoice is issued for every single order. The invoice includes our registered GSTIN, itemized HSN code, CGST/SGST/IGST tax breakdown, and your order reference. It is available for 1-click download in your account, emailed upon payment, and a physical copy is packed with your shipment.

4. Can you share the batch code and real product photos?
Yes. Our current stock of Rayhaan Crimson EDP 100ml carries the fresh production batch code:
Batch Code: RH-CR2409 · Mfd: 09/2024 · Expiry: 08/2029 (Sharjah, UAE)
This batch code matches between the outer box base and the bottle base. Real product reference photos can be viewed on our product page:
https://www.octopusperfume.in/products/rayhaan-crimson-eau-de-parfum-for-men

5. What is your refund or replacement policy if I receive a fake, damaged, or tampered product?
100% Full Refund or Free Immediate Replacement Guarantee.
Every order is packed in shockproof honeycomb wrap and sealed with tamper-evident security tape. If the parcel arrives damaged, broken, tampered with, or if you have any authenticity concern, we will immediately arrange a hassle-free reverse pickup and issue either a full 100% refund or an express replacement at zero cost to you.

FRAGRANCE PROFILE:
- Origin: Sharjah, UAE (100ml EDP)
- Top Notes: Cinnamon, Cardamom, Pink Pepper
- Middle Notes: Sandalwood, Patchouli, Heliotrope, Jasmine
- Base Notes: Benzoin, Madagascar Vanilla, Tonka Bean, Ambroxan
- Longevity: 8–10 hours

AN EXCLUSIVE WELCOME COURTESY FOR YOU:
I have activated a private courtesy code SECRET250 that gives you a flat ₹250 discount, bringing the price down from ₹2,350 to just ₹2,100.
We will also include our signature 7ML Paradox EDP Pocket Tester (Worth ₹399) free inside your package.

To complete your order with the ₹250 discount pre-applied:
https://www.octopusperfume.in/checkout?coupon=SECRET250

To view the product page:
https://www.octopusperfume.in/products/rayhaan-crimson-eau-de-parfum-for-men

If you prefer paying directly via UPI QR code (Google Pay, PhonePe, Paytm), simply reply to this email or write to hurkinds@gmail.com and I will send the QR over immediately.

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Direct Concierge: hurkinds@gmail.com | octopusperfume.in`;

async function main() {
  // CRITICAL REQUIREMENT: ONLY send to littlecodr@gmail.com for review!
  // DO NOT send to dey345542@gmail.com until user explicitly approves!
  const targetEmail = "littlecodr@gmail.com";
  console.log(`🚀 Sending preview draft to Admin (${targetEmail}) for review...`);

  try {
    const res = await sendBrevoEmail({
      to: [{ email: targetEmail, name: "Mayank (Admin Preview)" }],
      subject: `[REVIEW DRAFT] ${emailSubject}`,
      htmlContent: emailHtml,
      textContent: emailText,
    });
    console.log(`✅ Preview delivered successfully to ${targetEmail}! Message ID: ${res.messageId}`);
  } catch (err) {
    console.error(`❌ Failed:`, err.message);
  }
}

main().catch(console.error);
