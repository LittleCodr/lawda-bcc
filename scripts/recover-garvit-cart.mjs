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
      "X-Entity-Ref-ID": "ORD-1794757486470",
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
const productPrice = "₹2,150";
const productUrl = "https://www.octopusperfume.in/products/mykonos-inception-extrait-de-parfum";
const cartUrl = "https://www.octopusperfume.in/cart";
const checkoutUrl = "https://www.octopusperfume.in/checkout";
const productImg = "https://cdn.shopify.com/s/files/1/0772/1448/2736/files/inception_50ml_sku_1.webp?v=1781614748";

// Transactional subject line designed to land in Primary Inbox
const emailSubject = `Regarding your order #ORD-1794757486470 - Mykonos Inception`;

// Clean, high-inbox-rate personal concierge email
const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222222;background-color:#ffffff;line-height:1.6;font-size:15px;">
  <div style="max-width:580px;margin:0 auto;">
    
    <!-- Minimalist header line -->
    <div style="padding-bottom:16px;margin-bottom:20px;border-bottom:2px solid #141210;">
      <span style="font-weight:700;font-size:14px;letter-spacing:1.5px;color:#141210;text-transform:uppercase;">OCTOPUS PERFUMES</span>
      <span style="float:right;font-size:12px;color:#777777;">Order #${orderId}</span>
    </div>

    <p style="margin:0 0 16px 0;">Hi ${customerName},</p>

    <p style="margin:0 0 16px 0;">
      I was reviewing our order system today and noticed that your checkout session for <strong>Mykonos Inception Extrait De Parfum (50ml)</strong> timed out at the payment gateway before completion. No funds were debited from your account.
    </p>

    <p style="margin:0 0 20px 0;">
      Because our stock of Mykonos Inception is running low, I didn't want your allocation to be released back to the general inventory, so I have personally kept your sealed bottle on reserve in our Jaipur dispatch queue for the next 24 hours. I've also set aside the complimentary 7ML Paradox tester to be packed inside your box.
    </p>

    <!-- Product Summary Card -->
    <div style="border:1px solid #e2e0dc;border-radius:10px;padding:18px;margin:24px 0;background-color:#faf9f7;">
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
            <div style="font-size:14px;font-weight:700;color:#141210;">
              Total: ${productPrice} <span style="font-size:11px;font-weight:normal;color:#2e7d32;">(Includes Free Express Shipping &amp; 7ML Paradox Tester)</span>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Visually Appealing, High-Converting CTAs -->
    <div style="margin:28px 0;padding:20px;background-color:#ffffff;border:1px solid #e2e0dc;border-radius:10px;text-align:center;">
      <div style="font-size:13px;color:#555555;margin-bottom:14px;font-weight:600;">
        Choose an option below to complete your order or review details:
      </div>

      <!-- Primary CTA: Complete Order -->
      <div style="margin-bottom:12px;">
        <a href="${checkoutUrl}" style="display:inline-block;width:88%;max-width:360px;background-color:#141210;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.8px;padding:15px 22px;border-radius:8px;text-align:center;box-shadow:0 3px 8px rgba(0,0,0,0.15);">
          Complete Your Order (${productPrice}) →
        </a>
      </div>

      <!-- Secondary CTA: Product Page -->
      <div style="margin-bottom:12px;">
        <a href="${productUrl}" style="display:inline-block;width:88%;max-width:360px;background-color:#f5efe6;color:#6b4d24;border:1px solid #d8c8b4;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.5px;padding:12px 20px;border-radius:8px;text-align:center;">
          View Mykonos Inception Product Page &amp; Notes →
        </a>
      </div>

      <!-- Direct Bag Link -->
      <div style="font-size:12px;color:#777777;margin-top:10px;">
        You can also review your shopping bag at <a href="${cartUrl}" style="color:#6b4d24;text-decoration:underline;">octopusperfume.in/cart</a>
      </div>
    </div>

    <p style="margin:0 0 16px 0;">
      If you ran into an issue with the payment gateway, or if you prefer to complete payment directly via UPI QR code (Google Pay, PhonePe, or Paytm), please reply to this email or reach us at <a href="mailto:hurkinds@gmail.com" style="color:#6b4d24;font-weight:600;">hurkinds@gmail.com</a>. I will personally share the QR code with you.
    </p>

    <p style="margin:20px 0 4px 0;">Best regards,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:13px;color:#666666;">Concierge Team · Octopus Luxury Perfumes</p>
    <p style="margin:2px 0 0 0;font-size:12px;color:#888888;">Direct Support: hurkinds@gmail.com · <a href="https://www.octopusperfume.in" style="color:#888888;">octopusperfume.in</a></p>

  </div>
</body>
</html>`;

const emailText = `Hi ${customerName},

I was reviewing our order system today and noticed that your checkout session for Mykonos Inception Extrait De Parfum (50ml) timed out at the payment gateway before completion. No funds were debited from your account.

Because our stock of Mykonos Inception is running low, I didn't want your allocation to be released back to the general inventory, so I have personally kept your sealed bottle on reserve in our Jaipur dispatch queue for the next 24 hours. I've also set aside the complimentary 7ML Paradox tester to be packed inside your box.

Order Summary:
- 1x Mykonos Inception Extrait De Parfum (50ml)
- 1x Complimentary 7ML Paradox EDP Tester
- Free Pan-India Express Delivery
- Total: ${productPrice}

To complete your order:
${checkoutUrl}

To view the product page and fragrance notes:
${productUrl}

To review your shopping bag:
${cartUrl}

If you ran into an issue with the payment gateway, or if you prefer to complete payment directly via UPI QR code (Google Pay, PhonePe, or Paytm), simply reply to this email or reach us at hurkinds@gmail.com.

Best regards,
Mayank Agrawal
Concierge Team · Octopus Luxury Perfumes
Direct Support: hurkinds@gmail.com | octopusperfume.in`;

async function main() {
  const recipients = [
    { email: "littlecodr@gmail.com", name: "Admin (LittleCodr)" },
    { email: "garvitlakhani08@gmail.com", name: "Garvit" }
  ];

  console.log(`🚀 Dispatching inbox-optimized concierge email to ${recipients.length} recipients...`);

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

  console.log("\n🎉 Done dispatching recovery emails!");
}

main().catch(console.error);
