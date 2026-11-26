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

const customerEmail = "ym2571939@gmail.com";
const customerName = "Yaseen";
const productUrl = "https://www.octopusperfume.in/products/lattafa-musamam-black-intense-eau-de-parfum-for-men";
const checkoutUrl = "https://www.octopusperfume.in/checkout?coupon=MUSAMAM250";
const subject = "Re: Order inquiry - Lattafa Musamam Black Intense EDP 100ml";

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222222;background-color:#ffffff;line-height:1.65;font-size:15px;">
  <div style="max-width:620px;margin:0 auto;">

    <!-- Header -->
    <div style="padding-bottom:14px;margin-bottom:24px;border-bottom:2px solid #141210;">
      <span style="font-weight:700;font-size:14px;letter-spacing:1.5px;color:#141210;text-transform:uppercase;">OCTOPUS LUXURY PERFUMES</span>
      <span style="float:right;font-size:12px;color:#777777;">Client Concierge Desk</span>
    </div>

    <p style="margin:0 0 16px 0;">Hello Yaseen,</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing to us at Octopus Perfumes. <strong>Lattafa Musamam Black Intense Eau de Parfum (100ml)</strong> is widely considered one of Lattafa’s greatest masterworks—an intoxicating, commanding blend of dark leather, spices, and smoky woods housed in one of the most striking presentation flacons in modern Arabian perfumery.
    </p>

    <p style="margin:0 0 16px 0;">
      Here are the direct and transparent confirmations to all 4 of your questions:
    </p>

    <!-- Clarification Points Box -->
    <div style="background-color:#faf9f7;border:1px solid #e5e3de;border-radius:10px;padding:22px;margin:20px 0;">
      <ol style="margin:0;padding-left:20px;font-size:14px;color:#242424;line-height:1.8;">

        <li style="margin-bottom:16px;">
          <strong>Is it 100% genuine and factory-sealed?</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ 100% YES.</span> Every bottle of Lattafa Musamam Black Intense EDP is brand new, completely untampered, and sealed in its original factory cellophane with the official <strong>Lattafa 3D holographic security emblem</strong>. It comes in the full collector’s presentation box featuring the iconic snakeskin-embossed case and heavy metal snake-sculpted bottle cap.
        </li>

        <li style="margin-bottom:16px;">
          <strong>Batch Code and Importer Details:</strong><br>
          <ul style="margin:6px 0 0 0;padding-left:18px;">
            <li><strong>Official Importer in India:</strong> Sharaya Cosmocare Pvt. Ltd., 118, Tribhuvan Complex, Ishwar Nagar, Mathura Road, New Delhi – 110065.</li>
            <li><strong>Manufacturer:</strong> Lattafa Perfumes Ind. LLC, Sharjah / Dubai, United Arab Emirates.</li>
            <li><strong>Batch Code:</strong> Every box and flacon features matching laser-etched batch numbers on the bottom plate with valid manufacturing and expiry dates, fully verifiable on global fragrance batch registries (such as CheckFresh).</li>
          </ul>
        </li>

        <li style="margin-bottom:16px;">
          <strong>Will you receive a GST invoice?</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ YES, absolutely.</span> Every purchase generates an official computerized <strong>GST Tax Invoice</strong> specifying registered business details, buyer billing/shipping information, HSN Code <code>33030010</code> (Perfumes and Toilet Waters), and itemized 18% GST (CGST/SGST/IGST). A digital invoice PDF is emailed to you immediately upon dispatch, and a printed physical copy is enclosed inside your shipping parcel.
        </li>

        <li>
          <strong>Return/Refund Policy for Counterfeit:</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ 100% Money-Back &amp; Authenticity Guarantee.</span> We have a zero-tolerance policy against fakes. In the impossible event that any bottle is found non-genuine or counterfeit, or arrives damaged/unsealed in transit, we provide an <strong>immediate 100% full refund</strong> with zero questions asked, and we cover all return reverse shipping costs.<br>
          All online payments are processed through RBI-authorized gateways (<strong>PayU</strong> &amp; <strong>Cashfree</strong>) featuring 256-bit bank encryption with complete buyer protection.
        </li>

      </ol>
    </div>

    <!-- Special Courtesy Voucher -->
    <div style="background-color:#f4f9f5;border:1.5px dashed #2e7d32;border-radius:10px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#2e7d32;text-transform:uppercase;">Special Welcome Courtesy Voucher</p>
      <p style="margin:0 0 10px 0;font-size:18px;font-weight:700;color:#141210;">
        Special Voucher Code: <span style="background:#ffffff;padding:4px 10px;border-radius:6px;border:1px solid #c8e6c9;color:#1b5e20;font-family:monospace;font-size:20px;">MUSAMAM250</span>
      </p>
      <p style="margin:0 0 14px 0;font-size:13px;color:#444444;line-height:1.5;">
        Get <strong>Flat ₹250 OFF</strong> on Lattafa Musamam Black Intense EDP 100ml (Retail: <strike>₹4,000</strike> &rarr; <strong>₹3,750</strong>) + <strong>Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399)</strong> + Free Insured Air Express Shipping via Blue Dart.
      </p>
      <a href="${checkoutUrl}" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:6px;letter-spacing:0.5px;">
        Order Musamam Black Intense with ₹250 Discount &rarr;
      </a>
    </div>

    <p style="margin:20px 0 8px 0;font-size:14px;">
      Direct product page on our store:<br>
      <a href="${productUrl}" style="color:#9A7953;word-break:break-all;">${productUrl}</a>
    </p>

    <p style="margin:24px 0 6px 0;">Warm regards,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:13px;color:#777777;">Founder &amp; Concierge Lead &middot; Octopus Luxury Perfumes</p>
    <p style="margin:4px 0 0 0;font-size:12px;color:#999999;">Official Flagship: <a href="https://www.octopusperfume.in" style="color:#777777;">octopusperfume.in</a> &middot; Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#777777;">hurkinds@gmail.com</a></p>

  </div>
</body>
</html>`;

const textContent = `Hello Yaseen,

Thank you for writing to us at Octopus Perfumes. Lattafa Musamam Black Intense Eau de Parfum (100ml) is widely considered one of Lattafa’s greatest masterworks—an intoxicating, commanding blend of dark leather, spices, and smoky woods housed in one of the most striking presentation flacons in modern Arabian perfumery.

Here are the direct confirmations to all 4 of your questions:

1. Is it 100% genuine and factory-sealed?
YES, 100%. Every bottle of Lattafa Musamam Black Intense EDP is brand new, completely untampered, and sealed in its original factory cellophane with the official Lattafa 3D holographic security emblem. It comes in the full collector’s presentation box featuring the iconic snakeskin-embossed case and heavy metal snake-sculpted bottle cap.

2. Batch Code and Importer Details:
- Official Importer in India: Sharaya Cosmocare Pvt. Ltd., 118, Tribhuvan Complex, Ishwar Nagar, Mathura Road, New Delhi – 110065.
- Manufacturer: Lattafa Perfumes Ind. LLC, Sharjah / Dubai, United Arab Emirates.
- Batch Code: Every box and flacon features matching laser-etched batch numbers on the bottom plate with valid manufacturing and expiry dates, fully verifiable on global fragrance batch registries (such as CheckFresh).

3. Will you receive a GST invoice?
YES, absolutely. Every purchase generates an official computerized GST Tax Invoice specifying registered business details, buyer billing/shipping information, HSN Code 33030010 (Perfumes and Toilet Waters), and itemized 18% GST (CGST/SGST/IGST). A digital invoice PDF is emailed to you immediately upon dispatch, and a printed physical copy is enclosed inside your shipping parcel.

4. Return/Refund Policy for Counterfeit:
100% Money-Back & Authenticity Guarantee. We have a zero-tolerance policy against fakes. In the impossible event that any bottle is found non-genuine or counterfeit, or arrives damaged/unsealed in transit, we provide an immediate 100% full refund with zero questions asked, and we cover all return reverse shipping costs. All online payments are processed through RBI-authorized gateways (PayU & Cashfree) featuring 256-bit bank encryption with complete buyer protection.

SPECIAL WELCOME COURTESY VOUCHER:
We have activated an exclusive voucher code for you: MUSAMAM250
Get Flat ₹250 OFF on Lattafa Musamam Black Intense EDP 100ml (Retail: ₹4,000 -> ₹3,750) + Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399) + Free Insured Air Express Shipping via Blue Dart.

Direct Checkout Link (Pre-Applied):
${checkoutUrl}

Product Page:
${productUrl}

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Official Store: https://www.octopusperfume.in · Direct Concierge: hurkinds@gmail.com
`;

async function main() {
  console.log("--------------------------------------------------");
  console.log("Dispatching reply to Yaseen (Lattafa Musamam Black Intense EDP 100ml)...");
  const res = await sendBrevoEmail({
    to: [{ email: customerEmail, name: customerName }],
    bcc: [
      { email: "littlecodr@gmail.com", name: "Mayank Agrawal" },
      { email: "hurkinds@gmail.com", name: "Octopus Desk" },
    ],
    subject,
    htmlContent,
    textContent,
  });
  console.log("✅ Customer reply sent successfully! Message ID:", res.messageId);
  console.log("--------------------------------------------------");
}

main().catch(console.error);
