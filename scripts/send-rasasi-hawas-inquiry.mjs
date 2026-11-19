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

const customerEmail = "smolmistake2@gmail.com";
const productUrl = "https://www.octopusperfume.in/products/rasasi-hawas-ice-eau-de-parfum-for-men";
const checkoutUrl = "https://www.octopusperfume.in/checkout?coupon=HAWAS250";
const couponCode = "HAWAS250";

const emailSubject = "Re: Delivery Availability and Authenticity Confirmation - Rasasi Hawas Ice 100ml (PIN 744105)";

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

    <p style="margin:0 0 16px 0;">Hello,</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing to us at Octopus Perfumes. <strong>Rasasi Hawas Ice Eau de Parfum (100ml)</strong> is one of the most celebrated fresh, icy aquatic beast-mode fragrances in our Dubai collection, and we are delighted to confirm full availability for you.
    </p>

    <p style="margin:0 0 16px 0;">
      Here are the direct, verified answers to all 5 of your questions:
    </p>

    <!-- Detailed Answers Box -->
    <div style="background-color:#faf9f7;border:1px solid #e5e3de;border-radius:10px;padding:22px;margin:20px 0;">
      <ol style="margin:0;padding-left:20px;font-size:14px;color:#242424;line-height:1.8;">
        <li style="margin-bottom:12px;">
          <strong>Delivery to PIN 744105 (Andaman and Nicobar Islands):</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ YES, absolutely.</span> We regularly deliver to Port Blair / South Andaman (PIN 744105) via priority Air Cargo.
        </li>
        <li style="margin-bottom:12px;">
          <strong>Courier Service &amp; Delivery Timeline:</strong><br>
          We ship to PIN 744105 via <strong>India Post Speed Post (Air Cargo)</strong> and <strong>Blue Dart Air</strong> with dedicated daily flights into Port Blair (Veer Savarkar Airport). Door-to-door transit takes <strong>4 to 6 business days</strong>. Full live AWB tracking is shared immediately upon dispatch.
        </li>
        <li style="margin-bottom:12px;">
          <strong>Authenticity &amp; Certificate of Authenticity:</strong><br>
          Your bottle is guaranteed <strong>100% original, brand new, and factory-sealed in its retail box with cellophane wrap</strong>. Authentic Rasasi perfumes (manufactured in Dubai, UAE) do not carry paper certificates inside (which counterfeiters easily forge); instead, every bottle features an <strong>independently verifiable laser-etched batch code</strong> on the flacon base that matches the outer box, verifiable on global perfume batch databases (such as CheckFresh).
        </li>
        <li style="margin-bottom:12px;">
          <strong>Authorized Indian Distribution Sourcing:</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ YES.</span> Sourced 100% legally through authorized Indian import &amp; distribution channels, with official Indian customs clearance, importer labeling, and strict climate-controlled vault storage.
        </li>
        <li>
          <strong>GST Tax Invoice:</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ YES.</span> A valid computerized <strong>GST Tax Invoice</strong> (HSN Code 33030010 - Perfumes with 18% GST breakdown) is generated upon order confirmation, emailed to you, and a printed copy is enclosed inside the package.
        </li>
      </ol>
    </div>

    <!-- Special Courtesy Voucher -->
    <div style="background-color:#f4f9f5;border:1.5px dashed #2e7d32;border-radius:10px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#2e7d32;text-transform:uppercase;">Exclusive Island Welcome Courtesy</p>
      <p style="margin:0 0 10px 0;font-size:18px;font-weight:700;color:#141210;">
        Special Voucher: <span style="background:#ffffff;padding:4px 10px;border-radius:6px;border:1px solid #c8e6c9;color:#1b5e20;font-family:monospace;font-size:20px;">${couponCode}</span>
      </p>
      <p style="margin:0 0 14px 0;font-size:13px;color:#444444;line-height:1.5;">
        Get <strong>Flat ₹250 OFF</strong> on Rasasi Hawas Ice 100ml (Retail: <strike>₹3,300</strike> &rarr; <strong>₹3,050</strong>) + <strong>Complimentary 7ML Paradox EDP Pocket Tester (Worth ₹399)</strong> + Free Insured Air Shipping to Port Blair.
      </p>
      <a href="${checkoutUrl}" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:6px;letter-spacing:0.5px;">
        Order Now with ₹250 Discount &rarr;
      </a>
    </div>

    <!-- Safe Air Transit Packaging -->
    <p style="margin:0 0 16px 0;font-size:13px;color:#555555;background:#f9f9f9;padding:12px 16px;border-radius:8px;border-left:3px solid #141210;">
      <strong>Safe Air Transit Guarantee:</strong> Because your package travels across the Bay of Bengal to Port Blair, our warehouse packs island consignments in multi-layered, shock-absorbing air bubble wrap sealed in waterproof outer tamper-evident bags to guarantee safe arrival.
    </p>

    <p style="margin:20px 0 8px 0;font-size:14px;">
      You can also explore the product details directly on our website here:<br>
      <a href="${productUrl}" style="color:#9A7953;word-break:break-all;">${productUrl}</a>
    </p>

    <p style="margin:24px 0 6px 0;">Warm regards,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:13px;color:#777777;">Founder &amp; Concierge Lead &middot; Octopus Luxury Perfumes</p>
    <p style="margin:4px 0 0 0;font-size:12px;color:#999999;">Official Store: <a href="https://www.octopusperfume.in" style="color:#777777;">octopusperfume.in</a> &middot; Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#777777;">hurkinds@gmail.com</a></p>

  </div>
</body>
</html>`;

const emailText = `Hello,

Thank you for writing to us at Octopus Perfumes. Rasasi Hawas Ice Eau de Parfum (100ml) is one of the most celebrated fresh, icy aquatic beast-mode fragrances in our Dubai collection, and we are delighted to confirm full availability for you.

Here are the direct, verified answers to all 5 of your questions:

1. Delivery to PIN 744105 (Andaman and Nicobar Islands):
YES, absolutely. We regularly deliver to Port Blair / South Andaman (PIN 744105) via priority Air Cargo.

2. Courier Service & Delivery Timeline:
We ship to PIN 744105 via India Post Speed Post (Air Cargo) and Blue Dart Air with dedicated daily flights into Port Blair (Veer Savarkar Airport). Door-to-door transit takes 4 to 6 business days. Full live AWB tracking is shared immediately upon dispatch.

3. Authenticity & Certificate of Authenticity:
Your bottle is guaranteed 100% original, brand new, and factory-sealed in its retail box with cellophane wrap. Authentic Rasasi perfumes (manufactured in Dubai, UAE) do not carry paper certificates inside (which counterfeiters easily forge); instead, every bottle features an independently verifiable laser-etched batch code on the flacon base that matches the outer box, verifiable on global perfume batch databases (such as CheckFresh).

4. Authorized Indian Distribution Sourcing:
YES. Sourced 100% legally through authorized Indian import & distribution channels, with official Indian customs clearance, importer labeling, and strict climate-controlled vault storage.

5. GST Tax Invoice:
YES. A valid computerized GST Tax Invoice (HSN Code 33030010 - Perfumes with 18% GST breakdown) is generated upon order confirmation, emailed to you, and a printed copy is enclosed inside the package.

SPECIAL COURTESY VOUCHER:
We have activated an exclusive discount code for you: HAWAS250
Get Flat ₹250 OFF on Rasasi Hawas Ice 100ml (Retail: ₹3,300 -> ₹3,050) + Complimentary 7ML Paradox EDP Pocket Tester (Worth ₹399) + Free Insured Air Shipping to Port Blair.

Instant Order Link (Discount Pre-Applied):
${checkoutUrl}

Direct Product Page:
${productUrl}

Safe Air Transit Guarantee: Because your package travels across the Bay of Bengal to Port Blair, our warehouse packs island consignments in multi-layered, shock-absorbing air bubble wrap sealed in waterproof outer tamper-evident bags to guarantee safe arrival.

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Official Store: https://www.octopusperfume.in · Direct Concierge: hurkinds@gmail.com
`;

async function main() {
  console.log(`Sending reply to ${customerEmail}...`);
  const result = await sendBrevoEmail({
    to: [{ email: customerEmail, name: "Customer" }],
    bcc: [
      { email: "littlecodr@gmail.com", name: "Mayank Agrawal" },
      { email: "hurkinds@gmail.com", name: "Octopus Desk" },
    ],
    subject: emailSubject,
    htmlContent: emailHtml,
    textContent: emailText,
  });
  console.log("✅ Email sent successfully! Brevo Message ID:", result.messageId);
}

main().catch(console.error);
