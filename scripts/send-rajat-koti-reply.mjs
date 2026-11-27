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
    sender: { name: "Mayank Agrawal | Octopus Perfumes Concierge", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Octopus Priority Support", email: "hurkinds@gmail.com" },
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

const customerEmail = "rajatkoti0@gmail.com";
const customerName = "Rajat Koti";
const orderId = "ORD-1795504070774";
const subject = "Re: Need information on ORD-1795504070774 - Order Status & Delivery Timeline";

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222222;background-color:#ffffff;line-height:1.65;font-size:14px;">
  <div style="max-width:620px;margin:0 auto;border:1px solid #e8e6e1;border-radius:10px;padding:26px;">

    <!-- Brand Header -->
    <div style="border-bottom:2px solid #141210;padding-bottom:14px;margin-bottom:22px;">
      <span style="font-weight:700;font-size:14px;letter-spacing:1.5px;color:#141210;text-transform:uppercase;">OCTOPUS LUXURY PERFUMES</span>
      <span style="float:right;font-size:11px;font-weight:600;color:#9A7953;text-transform:uppercase;letter-spacing:1px;">Priority Concierge Desk</span>
    </div>

    <!-- Case Box -->
    <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:10px 14px;margin-bottom:20px;font-size:13px;color:#555;">
      <strong>Order Reference:</strong> <span style="font-family:monospace;color:#141210;font-weight:700;">${orderId}</span>
      <span style="float:right;color:#2E7D32;font-weight:600;">✓ Prepaid Verified</span>
    </div>

    <p style="margin:0 0 16px 0;">Dear Rajat,</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing to us. We have received your inquiry regarding prepaid order <strong>#${orderId}</strong>, and we are glad to provide you with complete clarity on your shipment status and expected delivery timeline.
    </p>

    <!-- Why No Package Found -->
    <div style="background-color:#FAF9F6;border:1px solid #E8E6E1;border-radius:8px;padding:16px;margin:18px 0;font-size:13px;line-height:1.7;">
      <strong style="color:#141210;">Regarding the "No Package Found" notice on the carrier site:</strong><br>
      The number assigned during warehouse packaging (e.g. <code>OCT-04070774</code>) is our <strong>internal warehouse consignment manifest docket</strong>. In express air logistics, public tracking barcodes only show live scan events once the consignment is physically scanned into the central airport sorting hub and sorted for the destination route. Prior to that electronic handshake, external courier portals display "no package found" or "invalid waybill".
    </div>

    <!-- Current Status & Delivery Timeline -->
    <div style="background-color:#F4F9F5;border:1px solid #C8E6C9;border-left:4px solid #2E7D32;border-radius:6px;padding:16px;margin:18px 0;font-size:13px;line-height:1.7;">
      <p style="margin:0 0 8px 0;font-weight:700;color:#1B5E20;font-size:14px;">
        📦 Current Dispatch &amp; Estimated Delivery Schedule
      </p>
      <ul style="margin:0;padding-left:18px;color:#242424;">
        <li><strong>Consignment State:</strong> Quality checked, packaged with tamper-evident sealing, and in express air transit.</li>
        <li><strong>Estimated Doorstep Delivery:</strong> Scheduled between <strong>Monday, 30 November &ndash; Tuesday, 1 December 2026</strong>.</li>
        <li><strong>Fulfillment Mode:</strong> Express Air Priority.</li>
      </ul>
    </div>

    <!-- Buyer Protection Guarantee -->
    <div style="background-color:#FFF9F0;border:1px solid #FFE0B2;border-radius:6px;padding:14px 16px;margin:18px 0;font-size:12px;color:#795548;line-height:1.5;">
      <strong>🛡️ 100% Zero-Risk Transit &amp; Damage Guarantee:</strong><br>
      Your payment and shipment are fully insured. In the unlikely event of any carrier delay beyond the expected delivery window, our concierge desk will immediately intervene to expedite delivery or provide an immediate full refund.
    </div>

    <p style="margin:20px 0 6px 0;">
      You can track the updated live status on our store portal here:<br>
      <a href="https://www.octopusperfume.in/track?orderId=${orderId}" style="color:#9A7953;font-weight:600;word-break:break-all;">https://www.octopusperfume.in/track?orderId=${orderId}</a>
    </p>

    <p style="margin:22px 0 6px 0;">Warm regards,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:12px;color:#777777;">Founder &middot; Octopus Luxury Perfumes</p>
    <p style="margin:4px 0 0 0;font-size:11px;color:#999999;">Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#777777;">hurkinds@gmail.com</a> &middot; Flagship: <a href="https://www.octopusperfume.in" style="color:#777777;">octopusperfume.in</a></p>

  </div>
</body>
</html>`;

const textContent = `Dear Rajat,

Thank you for writing to us. We have received your inquiry regarding prepaid order #${orderId}, and we are glad to provide complete clarity on your shipment status and expected delivery timeline.

Why the carrier site showed "No Package Found":
The number assigned during warehouse packaging (OCT-04070774) is our internal warehouse consignment manifest docket. Express air carriers only display live scan events on public trackers once the consignment clears initial airport hub intake and sorting. Prior to that scan, external portals display "no package found".

Current Status & Delivery Timeline:
- Status: Quality checked, sealed, and in express air transit.
- Estimated Delivery Date: Monday, 30 November - Tuesday, 1 December 2026.
- Shipping Method: Express Air Priority.

100% Transit Guarantee:
Your payment and shipment are fully insured. If there is any unforeseen transit delay beyond this window, our desk will immediately intervene to expedite or provide an immediate full refund.

Live Tracking Link:
https://www.octopusperfume.in/track?orderId=${orderId}

Warm regards,
Mayank Agrawal
Founder · Octopus Luxury Perfumes
Direct Concierge: hurkinds@gmail.com · https://www.octopusperfume.in
`;

async function main() {
  console.log("--------------------------------------------------");
  console.log(`Dispatching reply to Rajat Koti (${customerEmail}) for ${orderId}...`);
  const res = await sendBrevoEmail({
    to: [{ email: customerEmail, name: customerName }],
    bcc: [
      { email: "littlecodr@gmail.com", name: "Mayank Agrawal (Admin)" },
      { email: "hurkinds@gmail.com", name: "Octopus Desk" },
    ],
    subject,
    htmlContent,
    textContent,
  });
  console.log("✅ Reply sent successfully! Message ID:", res.messageId);
  console.log("--------------------------------------------------");
}

main().catch(console.error);
