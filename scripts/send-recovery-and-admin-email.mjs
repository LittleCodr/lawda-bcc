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
      apiKey = line.split("=")[1].trim();
      break;
    }
  }
}

if (!apiKey) {
  console.error("❌ BREVO_API_KEY is not defined!");
  process.exit(1);
}

async function sendBrevoEmail({ to, subject, htmlContent, textContent, replyTo }) {
  const payload = {
    sender: { name: "Octopus Luxury Perfumes", email: "orders@octopusperfume.in" },
    to,
    replyTo: replyTo || { name: "Octopus Perfumes Concierge", email: "orders@octopusperfume.in" },
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
// 1. CUSTOMER EMAIL (Sangeetha TJ)
// --------------------------------------------------------------------------
const customerEmail = "sangeethal479@gmail.com";
const customerName = "Sangeetha TJ";
const orderId = "ORD-1794501706977";
const productTitle = "Lattafa Asad Elixir Eau de Parfum for Men";
const productPrice = "₹2,750.00";
const productUrl = "https://www.octopusperfume.in/products/lattafa-asad-elixir-eau-de-parfum-for-men";

const customerSubject = "Sangeetha, we held your Lattafa Asad Elixir bottle (Quick payment update & complimentary gift inside)";

const customerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Update - Octopus Perfumes</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F6F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#242424;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F7F6F3;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E8E6E1;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="background-color:#141210;padding:32px 36px;border-bottom:3px solid #9A7953;text-align:left;">
              <div style="font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#D4AF7A;font-weight:700;">OCTOPUS LUXURY PERFUMES</div>
              <h1 style="margin:10px 0 0 0;font-family:Georgia,serif;font-size:23px;font-weight:600;color:#FFFFFF;line-height:1.3;">
                We Have Reserved Your Bottle
              </h1>
              <div style="margin-top:6px;font-size:13px;color:#C8C2B8;">
                Reference: <strong style="color:#D4AF7A;">#${orderId}</strong>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 16px 0;font-size:16px;color:#242424;">
                Dear <strong>${customerName}</strong>,
              </p>

              <p style="margin:0 0 18px 0;font-size:14.5px;line-height:1.65;color:#5C5954;">
                We noticed that your recent checkout for <strong>${productTitle}</strong> was interrupted by a temporary banking network glitch on the Paytm UPI gateway (<em>bank switch timeout</em>).
              </p>

              <!-- Peace of Mind Box -->
              <div style="background-color:#F0F7F4;border-left:4px solid #347A54;border-radius:6px;padding:16px 18px;margin-bottom:24px;">
                <div style="font-size:13px;font-weight:700;color:#22543D;margin-bottom:4px;">
                  🛡️ 100% Peace of Mind — No Double Charge
                </div>
                <div style="font-size:13px;line-height:1.55;color:#2D3748;">
                  If any money was temporarily deducted from your bank or wallet, please be fully assured: the payment did not reach our gateway and <strong>your bank will automatically reverse the full amount back to your account within 24 to 48 hours</strong>.
                </div>
              </div>

              <!-- High Demand & Reserved Alert -->
              <p style="margin:0 0 18px 0;font-size:14.5px;line-height:1.65;color:#5C5954;">
                Because <strong>Lattafa Asad Elixir</strong> is one of our fastest-selling luxury fragrance editions and stock is limited across India, our concierge team has <strong>temporarily placed a hold on your sealed bottle for the next 24 hours</strong> so you do not miss your allocation.
              </p>

              <!-- Order Snapshot Card -->
              <div style="background-color:#FAF9F6;border:1px solid #E8E6E1;border-radius:10px;padding:20px;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9A7953;margin-bottom:12px;">
                  Reserved Fragrance Details
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#242424;font-weight:600;vertical-align:top;">
                      ${productTitle}
                      <div style="font-size:12px;color:#777777;font-weight:normal;margin-top:2px;">100% Authentic Sealed Packaging · 1 Unit</div>
                    </td>
                    <td style="padding:8px 0;font-size:15px;color:#242424;font-weight:700;text-align:right;white-space:nowrap;vertical-align:top;">
                      ${productPrice}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 6px 0;border-top:1px dashed #D4CFC7;font-size:13px;color:#2D7D46;font-weight:600;">
                      🎁 VIP Courtesy: Paradox 7ML EDP Miniature Tester
                    </td>
                    <td style="padding:10px 0 6px 0;border-top:1px dashed #D4CFC7;font-size:13px;color:#2D7D46;font-weight:700;text-align:right;">
                      FREE
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#5C5954;">
                      🚀 Insured Express Pan-India Courier
                    </td>
                    <td style="padding:6px 0;font-size:13px;color:#2D7D46;font-weight:700;text-align:right;">
                      FREE
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0 0;border-top:1px solid #D4CFC7;font-size:15px;color:#141210;font-weight:700;">
                      Total Payable
                    </td>
                    <td style="padding:12px 0 0 0;border-top:1px solid #D4CFC7;font-size:17px;color:#141210;font-weight:700;text-align:right;">
                      ${productPrice}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Perks for Retrying -->
              <div style="background-color:#FFFBF2;border:1px solid #EED7A1;border-radius:8px;padding:16px 18px;margin-bottom:28px;">
                <div style="font-size:13px;font-weight:700;color:#805500;margin-bottom:6px;">
                  ✨ Exclusive VIP Courtesy Added to Your Order:
                </div>
                <ul style="margin:0;padding-left:18px;font-size:13px;color:#604000;line-height:1.6;">
                  <li><strong>Complimentary 7ML Paradox EDP Deluxe Discovery Sample</strong> included inside your parcel.</li>
                  <li><strong>Priority Dispatch & Insured Tracking</strong>: Dispatched same business day with live SMS & WhatsApp tracking updates.</li>
                  <li><strong>Smooth Payment Guarantee</strong>: You can retry seamlessly via <strong>Google Pay, PhonePe, Paytm, Any Debit/Credit Card, or Net Banking</strong> without transaction drops.</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${productUrl}" style="display:inline-block;background-color:#141210;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:16px 36px;border-radius:6px;box-shadow:0 4px 14px rgba(20,18,16,0.25);">
                  Complete Your Order & Claim Bonus →
                </a>
              </div>

              <!-- Assistance Note -->
              <p style="margin:24px 0 0 0;font-size:13.5px;line-height:1.6;color:#5C5954;border-top:1px solid #E8E6E1;padding-top:20px;">
                <strong>Prefer personal concierge assistance?</strong><br>
                If you would like us to send a direct UPI QR code or verify your order manually, simply reply directly to this email or contact us at <strong>orders@octopusperfume.in</strong> or phone <strong>+91 9884840560</strong>. Our team is standing by to assist you immediately.
              </p>

              <div style="margin-top:24px;font-size:14px;color:#242424;">
                Warmest regards,<br>
                <strong>The Octopus Perfumes Concierge Team</strong>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F7F6F3;padding:22px 36px;border-top:1px solid #E8E6E1;text-align:center;font-size:12px;color:#777777;line-height:1.6;">
              <div style="font-weight:600;color:#5C5954;">OCTOPUS LUXURY PERFUMES</div>
              <div>100% Authentic Designer & Niche Fragrances · IFRA Certified · Pan-India Express Delivery</div>
              <div style="margin-top:6px;font-size:11px;">
                © ${new Date().getFullYear()} Octopus Perfumes. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const customerText = `OCTOPUS LUXURY PERFUMES — CONCIERGE DESK
Order Reference: #${orderId}

Dear ${customerName},

We noticed that your checkout for ${productTitle} (${productPrice}) was interrupted by a temporary banking network switch timeout on Paytm UPI.

100% PEACE OF MIND:
If any amount was deducted from your account, please be reassured that no payment reached our gateway, and your bank will automatically reverse the full amount to your account within 24 to 48 hours.

YOUR BOTTLE HAS BEEN RESERVED:
Because Lattafa Asad Elixir is in exceptionally high demand, we have placed a temporary 24-hour reserve on your sealed bottle under #${orderId} so you don't lose your allocation.

EXCLUSIVE VIP COURTESY:
- Complimentary 7ML Paradox EDP Deluxe Discovery Sample added free to your box.
- Free Insured Express Delivery with live tracking.
- Seamless payment options: Google Pay, PhonePe, Cards, UPI, or NetBanking.

Complete your order here:
${productUrl}

Need personal assistance or direct payment help? Reply directly to this email at orders@octopusperfume.in.

Warm regards,
Octopus Perfumes Concierge Team`;

// --------------------------------------------------------------------------
// 2. ADMIN ALERT EMAIL
// --------------------------------------------------------------------------
const adminEmails = [
  { email: "mayankheroagrawal25@gmail.com", name: "Mayank Agrawal (Admin)" },
  { email: "littlecodr@gmail.com", name: "Store Admin" },
  { email: "poojatradingco450@gmail.com", name: "Octopus Store Operations" }
];

const adminSubject = `🚨 [FAILED PAYMENT ALERT - HIGH INTENT] Sangeetha TJ - Lattafa Asad Elixir (₹2,750) - ORD-1794501706977`;

const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background-color:#F7F6F3;padding:24px;margin:0;color:#242424;">
  <div style="max-width:650px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
    <div style="background-color:#991B1B;color:#FFFFFF;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#FECACA;font-weight:700;">URGENT CART RECOVERY ALERT</div>
      <h2 style="margin:6px 0 0 0;font-size:20px;">PayU Transaction Failure — Action Required</h2>
    </div>

    <div style="padding:24px;">
      <p style="margin-top:0;font-size:14px;color:#4B5563;">
        A high-intent customer attempted to purchase <strong>Lattafa Asad Elixir</strong> twice via PayU Paytm UPI, but the transaction failed due to a bank network error. An automated recovery email with bottle reservation and VIP complimentary gift has been dispatched.
      </p>

      <div style="background-color:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;padding:16px;margin:16px 0;">
        <div style="font-size:12px;font-weight:700;color:#991B1B;text-transform:uppercase;margin-bottom:8px;">Failure Diagnostics</div>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr><td style="padding:4px 0;color:#6B7280;width:140px;">Error Description:</td><td style="font-weight:600;color:#DC2626;">Mastercard DPA creation in progress. Please retry after 15 mins</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Payment Mode:</td><td style="font-weight:600;color:#1F2937;">Paytm UPI</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Order Ref ID:</td><td style="font-weight:600;color:#1F2937;">${orderId}</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">PayU Txn IDs:</td><td style="font-weight:600;color:#1F2937;">31809948883 (Attempt 2 - failed), 31809927082 (Attempt 1)</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Offer Applied:</td><td style="font-weight:600;color:#1F2937;">Getsavingsofupto15on@bhaq6kzK7cDS</td></tr>
        </table>
      </div>

      <div style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin:16px 0;">
        <div style="font-size:12px;font-weight:700;color:#334155;text-transform:uppercase;margin-bottom:8px;">Customer Information</div>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr><td style="padding:4px 0;color:#6B7280;width:140px;">Name:</td><td style="font-weight:600;color:#1F2937;">${customerName}</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Email:</td><td style="font-weight:600;color:#1F2937;"><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Mobile:</td><td style="font-weight:600;color:#1F2937;"><a href="tel:+919884840560">+91 9884840560</a></td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Firebase UID:</td><td style="font-size:12px;color:#475569;">DlgG7y2OI8XEGXZY0zygDymyO5i1</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Device:</td><td style="color:#1F2937;">Web</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Cart Item:</td><td style="font-weight:600;color:#1F2937;">${productTitle}</td></tr>
          <tr><td style="padding:4px 0;color:#6B7280;">Total Amount:</td><td style="font-size:16px;font-weight:700;color:#0F766E;">${productPrice}</td></tr>
        </table>
      </div>

      <div style="background-color:#EFF6FF;border-left:4px solid #3B82F6;padding:14px;border-radius:4px;margin-top:20px;">
        <div style="font-size:13px;font-weight:700;color:#1E40AF;margin-bottom:4px;">Recommended Next Actions for Admin:</div>
        <ol style="margin:0;padding-left:18px;font-size:13px;color:#1E3A8A;line-height:1.6;">
          <li><strong>WhatsApp Direct Outreach</strong>: Click <a href="https://wa.me/919884840560?text=Hi%20Sangeetha,%20this%20is%20Octopus%20Perfumes%20Concierge.%20We%20noticed%20a%20small%20UPI%20network%20delay%20during%20your%20Lattafa%20Asad%20Elixir%20order.%20We%20have%20held%20your%20bottle%20with%20a%20free%207ML%20tester." target="_blank" style="font-weight:bold;color:#2563EB;">here to message Sangeetha on WhatsApp</a> to offer a direct UPI payment link / QR.</li>
          <li><strong>Phone Call</strong>: If not converted within 2 hours, call +91 9884840560 to confirm whether she needs assistance.</li>
        </ol>
      </div>
    </div>
  </div>
</body>
</html>`;

const adminText = `URGENT FAILED TRANSACTION ALERT - OCTOPUS PERFUMES

Order Ref: ${orderId}
Product: ${productTitle} (${productPrice})
Customer: ${customerName}
Email: ${customerEmail}
Mobile: 9884840560
Gateway Error: Mastercard DPA creation in progress. Please retry after 15 mins (Paytm UPI)

Action Taken:
- Automated recovery email dispatched with bottle hold notice & free 7ML Paradox EDP bonus.

Recommended Admin Follow-up:
- Contact via WhatsApp: https://wa.me/919884840560
- Contact via Call: +91 9884840560`;

// --------------------------------------------------------------------------
// EXECUTION
// --------------------------------------------------------------------------
async function main() {
  console.log("🚀 Starting email dispatch via Brevo...");

  // 1. Send Customer Email
  console.log(`📤 Sending customer recovery email to: ${customerEmail}...`);
  const custRes = await sendBrevoEmail({
    to: [{ email: customerEmail, name: customerName }],
    subject: customerSubject,
    htmlContent: customerHtml,
    textContent: customerText,
  });
  console.log("✅ Customer email successfully dispatched! Message ID:", custRes.messageId);

  // 2. Send Admin Alert Email
  console.log("📤 Sending admin alert email to:", adminEmails.map((a) => a.email).join(", "));
  const adminRes = await sendBrevoEmail({
    to: adminEmails,
    subject: adminSubject,
    htmlContent: adminHtml,
    textContent: adminText,
  });
  console.log("✅ Admin alert email successfully dispatched! Message ID:", adminRes.messageId);

  console.log("\n🎉 Both emails have been dispatched successfully.");
}

main().catch((err) => {
  console.error("❌ Fatal error sending emails:", err);
  process.exit(1);
});

