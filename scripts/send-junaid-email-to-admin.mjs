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

const customerName = "Junaid Khan";
const orderId = "ORD-1794618311844";
const productTitle = "Rasasi Hawas Black Eau de Parfum for Men";
const productPrice = "₹3,000.00";
const productUrl = "https://www.octopusperfume.in/products/rasasi-hawas-black-eau-de-parfum-for-men";

// EXACT SAME SUBJECT AND CONTENT AS SENT TO JUNAID KHAN
const subject = "Junaid, your Rasasi Hawas Black bottle is reserved (Session update & complimentary gift)";

const htmlContent = `<!DOCTYPE html>
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
                Your Bottle Is Held For You
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
                We noticed that while you were checking out for <strong>${productTitle}</strong> on your mobile browser, the payment session timed out before completion.
              </p>

              <!-- Stock Alert & Reserved Notice -->
              <div style="background-color:#FFFBF2;border-left:4px solid #D4AF7A;border-radius:6px;padding:16px 18px;margin-bottom:24px;">
                <div style="font-size:13.5px;font-weight:700;color:#805500;margin-bottom:4px;">
                  ⏳ 24-Hour Priority Allocation
                </div>
                <div style="font-size:13px;line-height:1.55;color:#604000;">
                  <strong>Rasasi Hawas Black</strong> is in intense demand with limited batch availability across India. To ensure you don't lose your bottle, our concierge team has <strong>temporarily reserved your sealed bottle in our dispatch center for the next 24 hours</strong>.
                </div>
              </div>

              <!-- Order Snapshot Card -->
              <div style="background-color:#FAF9F6;border:1px solid #E8E6E1;border-radius:10px;padding:20px;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9A7953;margin-bottom:12px;">
                  Reserved Selection Summary
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#242424;font-weight:600;vertical-align:top;">
                      ${productTitle}
                      <div style="font-size:12px;color:#777777;font-weight:normal;margin-top:2px;">100% Original Sealed Bottle · 1 Unit</div>
                    </td>
                    <td style="padding:8px 0;font-size:15px;color:#242424;font-weight:700;text-align:right;white-space:nowrap;vertical-align:top;">
                      ${productPrice}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 6px 0;border-top:1px dashed #D4CFC7;font-size:13px;color:#2D7D46;font-weight:600;">
                      🎁 VIP Bonus: Paradox 7ML EDP Deluxe Miniature Tester
                    </td>
                    <td style="padding:10px 0 6px 0;border-top:1px dashed #D4CFC7;font-size:13px;color:#2D7D46;font-weight:700;text-align:right;">
                      FREE
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#5C5954;">
                      🚀 Priority Insured Express Delivery
                    </td>
                    <td style="padding:6px 0;font-size:13px;color:#2D7D46;font-weight:700;text-align:right;">
                      FREE
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0 0;border-top:1px solid #D4CFC7;font-size:15px;color:#141210;font-weight:700;">
                      Total Amount
                    </td>
                    <td style="padding:12px 0 0 0;border-top:1px solid #D4CFC7;font-size:17px;color:#141210;font-weight:700;text-align:right;">
                      ${productPrice}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Reassurance Points -->
              <div style="background-color:#F0F7F4;border:1px solid #C6E6D6;border-radius:8px;padding:16px 18px;margin-bottom:28px;">
                <div style="font-size:13px;font-weight:700;color:#22543D;margin-bottom:6px;">
                  ✨ Why Shop With Octopus Perfumes:
                </div>
                <ul style="margin:0;padding-left:18px;font-size:13px;color:#234E3A;line-height:1.6;">
                  <li><strong>Complimentary 7ML Paradox EDP</strong> included automatically in your package.</li>
                  <li><strong>Fast & Reliable Payment</strong>: Complete with 1-tap UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, or Net Banking.</li>
                  <li><strong>Same-Day Dispatch & Live Tracking</strong>: Real-time SMS & WhatsApp updates as soon as your parcel ships.</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${productUrl}" style="display:inline-block;background-color:#141210;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:16px 36px;border-radius:6px;box-shadow:0 4px 14px rgba(20,18,16,0.25);">
                  Resume Checkout & Claim Bonus →
                </a>
              </div>

              <!-- Personal Support -->
              <p style="margin:24px 0 0 0;font-size:13.5px;line-height:1.6;color:#5C5954;border-top:1px solid #E8E6E1;padding-top:20px;">
                <strong>Need help or prefer paying via direct UPI QR?</strong><br>
                Simply reply directly to this email or reach out to our concierge desk at <strong>orders@octopusperfume.in</strong> or phone <strong>+91 7020512937</strong>. We are here to assist you immediately.
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

const textContent = `OCTOPUS LUXURY PERFUMES — CONCIERGE DESK
Order Reference: #${orderId}

Dear ${customerName},

We noticed that while checking out for ${productTitle} (${productPrice}) on your mobile browser, your session timed out before completion.

YOUR BOTTLE HAS BEEN RESERVED:
Rasasi Hawas Black is currently in intense demand. Our concierge team has placed a temporary 24-hour reserve on your sealed bottle under #${orderId} so you don't lose your allocation.

EXCLUSIVE VIP COURTESY:
- Complimentary 7ML Paradox EDP Deluxe Discovery Sample added free to your box.
- Free Insured Express Pan-India Delivery with live tracking.
- Fast & seamless payment options: Google Pay, PhonePe, Paytm, Cards, or NetBanking.

Complete your order here:
${productUrl}

Need personal assistance or a direct UPI QR link? Reply directly to this email at orders@octopusperfume.in.

Warm regards,
Octopus Perfumes Concierge Team`;

const adminRecipients = [
  { email: "mayankheroagrawal25@gmail.com", name: "Mayank Agrawal" },
  { email: "littlecodr@gmail.com", name: "Admin" },
  { email: "poojatradingco450@gmail.com", name: "Octopus Store Operations" }
];

async function main() {
  console.log("📤 Sending the EXACT customer email to admin recipients:", adminRecipients.map(a => a.email).join(", "));
  const res = await sendBrevoEmail({
    to: adminRecipients,
    subject,
    htmlContent,
    textContent,
  });
  console.log("✅ Exactly identical customer mail sent to admin! Message ID:", res.messageId);
}

main().catch(err => {
  console.error("❌ Failed to send:", err);
  process.exit(1);
});

