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
    sender: { name: "Octopus Perfumes Concierge", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Octopus Perfumes Support", email: "hurkinds@gmail.com" },
    subject,
    htmlContent,
    textContent,
    headers: {
      "X-Entity-Ref-ID": "ORD-1794757486470-COUPON",
    },
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
// RECIPIENTS & DETAILS
// --------------------------------------------------------------------------
const orderId = "ORD-1794757486470";
const customerName = "Garvit";
const productTitle = "Mykonos Inception Extrait De Parfum (50ml)";
const secretCode = "SECRET250";
const originalPrice = "₹2,150";
const discountedPrice = "₹1,900";
const checkoutUrl = `https://www.octopusperfume.in/checkout?coupon=${secretCode}`;
const productUrl = "https://www.octopusperfume.in/products/mykonos-inception-extrait-de-parfum";
const cartUrl = "https://www.octopusperfume.in/cart";
const productImg = "https://cdn.shopify.com/s/files/1/0772/1448/2736/files/inception_50ml_sku_1.webp?v=1781614748";

// Transactional, human subject line to hit Primary Inbox
const emailSubject = `Personal note regarding your order #ORD-1794757486470`;

const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222222;background-color:#ffffff;line-height:1.6;font-size:15px;">
  <div style="max-width:580px;margin:0 auto;">
    
    <!-- Header border -->
    <div style="padding-bottom:16px;margin-bottom:20px;border-bottom:2px solid #141210;">
      <span style="font-weight:700;font-size:14px;letter-spacing:1.5px;color:#141210;text-transform:uppercase;">OCTOPUS PERFUMES</span>
      <span style="float:right;font-size:12px;color:#777777;">Order #${orderId}</span>
    </div>

    <p style="margin:0 0 16px 0;">Hi ${customerName},</p>

    <p style="margin:0 0 16px 0;">
      I wanted to follow up personally regarding your recent order session for <strong>${productTitle}</strong>.
    </p>

    <p style="margin:0 0 16px 0;">
      Because our checkout experienced a session timeout earlier today, I wanted to apologize for the inconvenience and make sure you have the smoothest possible experience with Octopus Perfumes.
    </p>

    <p style="margin:0 0 20px 0;">
      I have generated a private, secret courtesy code exclusively for your order:
    </p>

    <!-- Coupon Badge Card -->
    <div style="border:2px dashed #9A7953;border-radius:10px;padding:20px;margin:22px 0;background-color:#FAF9F6;text-align:center;">
      <div style="font-size:11.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9A7953;margin-bottom:6px;">
        EXCLUSIVE COURTESY CODE
      </div>
      <div style="font-size:24px;font-weight:800;letter-spacing:3px;color:#141210;font-family:monospace;background:#FFFFFF;display:inline-block;padding:8px 24px;border-radius:6px;border:1px solid #E8E6E1;margin-bottom:8px;">
        ${secretCode}
      </div>
      <div style="font-size:13px;color:#2D7D46;font-weight:700;">
        Flat ₹250 Instant Discount · Reduces Total from ${originalPrice} to ${discountedPrice}
      </div>
    </div>

    <!-- Product Summary Card -->
    <div style="border:1px solid #e2e0dc;border-radius:10px;padding:18px;margin:24px 0;background-color:#ffffff;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <td style="width:84px;vertical-align:top;padding-right:16px;">
            <a href="${productUrl}" style="text-decoration:none;">
              <img src="${productImg}" alt="Mykonos Inception" width="84" height="84" style="border-radius:8px;border:1px solid #e0deda;object-fit:cover;display:block;" />
            </a>
          </td>
          <td style="vertical-align:top;">
            <div style="font-weight:700;font-size:15px;color:#141210;margin-bottom:4px;">
              <a href="${productUrl}" style="color:#141210;text-decoration:none;">Mykonos Inception Extrait De Parfum</a>
            </div>
            <div style="font-size:12px;color:#666666;margin-bottom:6px;">
              Size: 50ML · Concentration: Extrait de Parfum · Batch-Verified Stock
            </div>
            <div style="font-size:13.5px;color:#555555;">
              Original: <span style="text-decoration:line-through;">${originalPrice}</span> → <strong style="font-size:15px;color:#141210;">${discountedPrice} with code ${secretCode}</strong>
            </div>
            <div style="font-size:11.5px;color:#2e7d32;margin-top:4px;">
              ✓ Complimentary 7ML Paradox EDP Pocket Tester included
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Visually Clear Action Buttons -->
    <div style="margin:28px 0;padding:22px;background-color:#ffffff;border:1px solid #e2e0dc;border-radius:10px;text-align:center;">
      <div style="font-size:13px;color:#555555;margin-bottom:14px;font-weight:600;">
        I have pre-applied this code for you — choose an option below:
      </div>

      <!-- Primary CTA: 1-Click Discounted Checkout -->
      <div style="margin-bottom:12px;">
        <a href="${checkoutUrl}" style="display:inline-block;width:88%;max-width:380px;background-color:#141210;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.8px;padding:15px 22px;border-radius:8px;text-align:center;box-shadow:0 3px 8px rgba(0,0,0,0.15);">
          Complete Order for ${discountedPrice} (${secretCode} Pre-Applied) →
        </a>
      </div>

      <!-- Secondary CTA: Product Page -->
      <div style="margin-bottom:12px;">
        <a href="${productUrl}" style="display:inline-block;width:88%;max-width:380px;background-color:#f5efe6;color:#6b4d24;border:1px solid #d8c8b4;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.5px;padding:12px 20px;border-radius:8px;text-align:center;">
          View Mykonos Inception Product Page &amp; Notes →
        </a>
      </div>

      <div style="font-size:12px;color:#777777;margin-top:10px;">
        Or review your bag at <a href="${cartUrl}" style="color:#6b4d24;text-decoration:underline;">octopusperfume.in/cart</a>
      </div>
    </div>

    <p style="margin:0 0 16px 0;">
      Your bottle remains safely on reserve in our Jaipur packing room. If you prefer to complete payment directly via UPI QR code (Google Pay, PhonePe, or Paytm), simply reply to this email or message support at <a href="mailto:hurkinds@gmail.com" style="color:#6b4d24;font-weight:600;">hurkinds@gmail.com</a> and I'll send the QR right away.
    </p>

    <p style="margin:20px 0 4px 0;">Warm regards,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:13px;color:#666666;">Concierge Team · Octopus Luxury Perfumes</p>
    <p style="margin:2px 0 0 0;font-size:12px;color:#888888;">Direct Support: hurkinds@gmail.com · <a href="https://www.octopusperfume.in" style="color:#888888;">octopusperfume.in</a></p>

  </div>
</body>
</html>`;

const emailText = `Hi ${customerName},

I wanted to follow up personally regarding your recent order session for ${productTitle}.

Because our checkout experienced a session timeout earlier today, I wanted to apologize for the inconvenience and make sure you have the smoothest possible experience with Octopus Perfumes.

I have generated a private, secret courtesy code exclusively for your order:

COUPON CODE: ${secretCode}
(Flat ₹250 Instant Discount — Reduces Total from ${originalPrice} down to ${discountedPrice})

I have already pre-applied this code for you at the link below:

1. Complete Your Order for ${discountedPrice} (${secretCode} Pre-Applied):
${checkoutUrl}

2. View Mykonos Inception Product Page & Notes:
${productUrl}

3. Review your shopping bag:
${cartUrl}

Your bottle of Mykonos Inception remains reserved in our Jaipur dispatch queue with your complimentary 7ML Paradox tester.

If you prefer completing payment directly via UPI QR code (Google Pay, PhonePe, or Paytm), simply reply to this email or reach us at hurkinds@gmail.com.

Warm regards,
Mayank Agrawal
Concierge Team · Octopus Luxury Perfumes
Direct Support: hurkinds@gmail.com | octopusperfume.in`;

async function main() {
  const recipients = [
    { email: "littlecodr@gmail.com", name: "Admin (LittleCodr)" },
    { email: "garvitlakhani08@gmail.com", name: "Garvit" }
  ];

  console.log(`🚀 Dispatching secret coupon (${secretCode} - ₹250 OFF) email to ${recipients.length} recipients...`);

  for (const r of recipients) {
    console.log(`\n📤 Sending to ${r.name} (${r.email})...`);
    try {
      const res = await sendBrevoEmail({
        to: [{ email: r.email, name: r.name }],
        subject: emailSubject,
        htmlContent: emailHtml,
        textContent: emailText,
      });
      console.log(`✅ Success for ${r.email}! Message ID: ${res.messageId}`);
    } catch (err) {
      console.error(`❌ Failed for ${r.email}:`, err.message);
    }
  }

  console.log("\n🎉 Done dispatching secret coupon email!");
}

main().catch(console.error);
