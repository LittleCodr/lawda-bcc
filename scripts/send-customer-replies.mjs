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

// -------------------------------------------------------------
// 1. ANKIT SINGH (Rasasi Hawas Venom EDP)
// -------------------------------------------------------------
const ankitEmail = "luk4ankit@gmail.com";
const ankitProductUrl = "https://www.octopusperfume.in/products/rasasi-hawas-venom-eau-de-parfum-for-men";
const ankitCheckoutUrl = "https://www.octopusperfume.in/checkout?coupon=VENOM250";
const ankitSubject = "Re: Authenticity & COD Confirmation - Rasasi Hawas Venom";

const ankitHtml = `<!DOCTYPE html>
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

    <p style="margin:0 0 16px 0;">Hello Ankit,</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing to us at Octopus Perfumes. <strong>Rasasi Hawas Venom Eau de Parfum for Men</strong> is an exceptional release in the legendary Hawas lineup—darker, richer, and intensely commanding with beast-mode performance.
    </p>

    <p style="margin:0 0 16px 0;">
      Here are the direct and transparent answers to all 4 of your questions:
    </p>

    <!-- Detailed Answers Box -->
    <div style="background-color:#faf9f7;border:1px solid #e5e3de;border-radius:10px;padding:22px;margin:20px 0;">
      <ol style="margin:0;padding-left:20px;font-size:14px;color:#242424;line-height:1.8;">
        <li style="margin-bottom:14px;">
          <strong>Is the perfume 100% authentic and original?</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ 100% YES.</span> Every bottle of Rasasi Hawas Venom is brand new, genuine, and factory-sealed in its original cellophane retail presentation box. It comes directly with the official Rasasi Dubai holographic seal, laser batch code, and authorized Indian importer compliance labeling.
        </li>
        <li style="margin-bottom:14px;">
          <strong>Will you provide a GST invoice?</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ YES, absolutely.</span> Every order is accompanied by a formal computerized <strong>GST Tax Invoice</strong> with HSN code <code>33030010</code> (Perfumes with 18% GST breakdown). You will receive an official PDF invoice via email as soon as the order is placed, and a physical printed copy will be enclosed inside the parcel.
        </li>
        <li style="margin-bottom:14px;">
          <strong>Is Cash on Delivery available in Delhi?</strong><br>
          To maintain strict bottle integrity and eliminate courier package swaps or transit tampering for high-value imported Arabian fragrances, we fulfill orders strictly via <strong>100% secure prepaid payment</strong> (UPI / Google Pay, PhonePe, Cards, NetBanking via RBI-authorized PayU / Cashfree).<br>
          <span style="display:inline-block;margin-top:6px;background:#f0f7f3;padding:8px 12px;border-radius:6px;border-left:3px solid #2e7d32;">
            <strong>Delhi NCR Priority Advantage:</strong> Because our primary distribution fulfillment center is located in Delhi NCR, your order receives same-day priority dispatch via <strong>Blue Dart Air Express</strong>, reaching your doorstep in just <strong>24 to 48 hours</strong> with live SMS &amp; WhatsApp AWB tracking.
          </span>
        </li>
        <li>
          <strong>Batch Code &amp; Product Details:</strong><br>
          The bottle features a laser-etched batch code on the bottom of the glass flacon matching the batch number printed on the outer box base, independently verifiable on global perfume batch verification databases (such as CheckFresh). We inspect every tamper-evident cellophane seal prior to dispatch, backed by our <strong>100% Money-Back &amp; Transit Damage Guarantee</strong>.
        </li>
      </ol>
    </div>

    <!-- Special Courtesy Voucher -->
    <div style="background-color:#f4f9f5;border:1.5px dashed #2e7d32;border-radius:10px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#2e7d32;text-transform:uppercase;">Exclusive Delhi VIP Courtesy</p>
      <p style="margin:0 0 10px 0;font-size:18px;font-weight:700;color:#141210;">
        Special Voucher Code: <span style="background:#ffffff;padding:4px 10px;border-radius:6px;border:1px solid #c8e6c9;color:#1b5e20;font-family:monospace;font-size:20px;">VENOM250</span>
      </p>
      <p style="margin:0 0 14px 0;font-size:13px;color:#444444;line-height:1.5;">
        Get <strong>Flat ₹250 OFF</strong> on Rasasi Hawas Venom EDP (Retail: <strike>₹3,500</strike> &rarr; <strong>₹3,250</strong>) + <strong>Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399)</strong> + Free 24-48hr Express Delivery in Delhi NCR.
      </p>
      <a href="${ankitCheckoutUrl}" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:6px;letter-spacing:0.5px;">
        Order Hawas Venom with ₹250 Discount &rarr;
      </a>
    </div>

    <p style="margin:20px 0 8px 0;font-size:14px;">
      Direct product link on our website:<br>
      <a href="${ankitProductUrl}" style="color:#9A7953;word-break:break-all;">${ankitProductUrl}</a>
    </p>

    <p style="margin:24px 0 6px 0;">Warm regards,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:13px;color:#777777;">Founder &amp; Concierge Lead &middot; Octopus Luxury Perfumes</p>
    <p style="margin:4px 0 0 0;font-size:12px;color:#999999;">Official Flagship: <a href="https://www.octopusperfume.in" style="color:#777777;">octopusperfume.in</a> &middot; Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#777777;">hurkinds@gmail.com</a></p>

  </div>
</body>
</html>`;

const ankitText = `Hello Ankit,

Thank you for writing to us at Octopus Perfumes. Rasasi Hawas Venom Eau de Parfum for Men is an exceptional release in the legendary Hawas lineup—darker, richer, and intensely commanding with beast-mode performance.

Here are the direct answers to all 4 of your questions:

1. Is the perfume 100% authentic and original?
YES, 100%. Every bottle of Rasasi Hawas Venom is brand new, genuine, and factory-sealed in its original cellophane retail presentation box with the official Rasasi Dubai holographic seal, laser batch code, and authorized Indian importer compliance labeling.

2. Will you provide a GST invoice?
YES, absolutely. Every order is accompanied by a formal computerized GST Tax Invoice with HSN code 33030010 (Perfumes with 18% GST breakdown). A digital PDF is emailed immediately upon placing your order, and a printed copy is packed inside the delivery box.

3. Is Cash on Delivery available in Delhi?
To maintain strict bottle seal integrity and eliminate courier package swaps or transit tampering for high-value imported Arabian fragrances, we fulfill orders strictly via 100% secure prepaid payment (UPI / Google Pay, PhonePe, Cards, NetBanking via RBI-authorized PayU / Cashfree).
Delhi NCR Priority Advantage: Because our primary distribution fulfillment center is located in Delhi NCR, your order receives same-day priority dispatch via Blue Dart Air Express, reaching your doorstep in just 24 to 48 hours with live AWB tracking.

4. Batch Code & Product Details:
The bottle features a laser-etched batch code on the bottom of the glass flacon matching the batch number printed on the outer box base, independently verifiable on global perfume batch verification databases (such as CheckFresh). We inspect every tamper-evident cellophane seal prior to dispatch, backed by our 100% Money-Back & Transit Damage Guarantee.

EXCLUSIVE COURTESY VOUCHER:
We have activated voucher code: VENOM250
Get Flat ₹250 OFF on Rasasi Hawas Venom EDP (Retail: ₹3,500 -> ₹3,250) + Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399) + Free 24-48hr Express Delivery in Delhi NCR.

Direct Checkout Link (Pre-Applied):
${ankitCheckoutUrl}

Product Page:
${ankitProductUrl}

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Official Store: https://www.octopusperfume.in · Direct Concierge: hurkinds@gmail.com
`;

// -------------------------------------------------------------
// 2. KHRISH CHAUHAN (Rayhaan Lion 100ml & Legitimacy Clarification)
// -------------------------------------------------------------
const khrishEmail = "khrishchouhan@gmail.com";
const khrishProductUrl = "https://www.octopusperfume.in/products/rayhaan-lion-eau-de-parfum-for-men";
const khrishCheckoutUrl = "https://www.octopusperfume.in/checkout?coupon=RAYHAAN250";
const khrishSubject = "Re: Verification - Authenticity and Legitimacy of octopusperfume.in";

const khrishHtml = `<!DOCTYPE html>
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

    <p style="margin:0 0 16px 0;">Hello Khrish,</p>

    <p style="margin:0 0 16px 0;">
      Thank you for writing directly to us. We genuinely appreciate and welcome customers who perform thorough due diligence before purchasing online. You have asked very fair and important questions, and we are glad to provide complete, transparent clarity on each of them.
    </p>

    <!-- Clarification Points Box -->
    <div style="background-color:#faf9f7;border:1px solid #e5e3de;border-radius:10px;padding:22px;margin:20px 0;">
      <ol style="margin:0;padding-left:20px;font-size:14px;color:#242424;line-height:1.8;">
        
        <li style="margin-bottom:16px;">
          <strong>Relationship with Octopus Lifestyle Private Limited (<code>buyoctopus.com</code>):</strong><br>
          We are <strong>completely separate and independent businesses</strong>.<br>
          The company you contacted—<strong>Octopus Lifestyle Private Limited (<code>buyoctopus.com</code>)</strong>—is an apparel, clothing, and fashion lifestyle brand. They do not manufacture, sell, or retail luxury fragrances.<br>
          <strong>Octopus Perfumes (<code>octopusperfume.in</code>)</strong> is an independent Indian luxury fragrance maison and specialized perfumery retailer. We operate exclusively in fine perfumery, attars, and luxury Middle Eastern &amp; French fragrances—including our own flagship brand (<em>Octopus Perfumes by Harsh Beniwal</em>) alongside an authorized retail catalog of global houses such as Rayhaan, Rasasi, Lattafa, Afnan, and Tom Ford.<br>
          Their support team at <code>buyoctopus.com</code> correctly stated they do not run our website, simply because they are a clothing brand and have no connection to our perfumery business.
        </li>

        <li style="margin-bottom:16px;">
          <strong>Are Rayhaan Lion perfumes 100% genuine and sourced from authorised distributors?</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ YES, 100%.</span> All Rayhaan perfumes (crafted in Dubai, UAE) sold on our platform are imported legally through authorized Indian distribution channels with complete customs documentation, importer declaration, and MRP sticker compliance. Every bottle of Rayhaan Lion (100 ml) is brand new, sealed in original factory cellophane, with genuine laser-engraved batch numbers on the flacon base.
        </li>

        <li style="margin-bottom:16px;">
          <strong>Will you receive a proper GST Tax Invoice?</strong><br>
          <span style="color:#1b5e20;font-weight:600;">✓ YES, 100%.</span> Every purchase generates an official computerized <strong>GST Tax Invoice</strong> specifying registered business details, buyer information, HSN Code <code>33030010</code> (Perfumes and Toilet Waters), and itemized 18% GST (CGST/SGST/IGST). A digital invoice PDF is emailed to you upon dispatch, and a printed physical copy is placed inside the shipping parcel.
        </li>

        <li>
          <strong>Legitimate Business &amp; Safe Online Payment:</strong><br>
          All online transactions on <code>octopusperfume.in</code> are processed through India's premier RBI-authorized payment gateways (<strong>PayU</strong> and <strong>Cashfree</strong>) featuring 256-bit bank-grade encryption (PCI-DSS Level 1 compliant) supporting UPI (Google Pay, PhonePe, Paytm), Cards, and NetBanking with complete buyer protection.<br>
          Every shipment is dispatched with live AWB tracking via <strong>Blue Dart Express Air</strong> and backed by our <strong>100% Zero-Risk Authenticity &amp; Transit Guarantee</strong>: If a product arrives unsealed, damaged, or not as described, you receive an immediate replacement or full refund.
        </li>

      </ol>
    </div>

    <!-- Special Courtesy Voucher -->
    <div style="background-color:#f4f9f5;border:1.5px dashed #2e7d32;border-radius:10px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#2e7d32;text-transform:uppercase;">Special Welcome Courtesy for Your Diligence</p>
      <p style="margin:0 0 10px 0;font-size:18px;font-weight:700;color:#141210;">
        Special Voucher Code: <span style="background:#ffffff;padding:4px 10px;border-radius:6px;border:1px solid #c8e6c9;color:#1b5e20;font-family:monospace;font-size:20px;">RAYHAAN250</span>
      </p>
      <p style="margin:0 0 14px 0;font-size:13px;color:#444444;line-height:1.5;">
        Get <strong>Flat ₹250 OFF</strong> on Rayhaan Lion EDP 100ml (Retail: <strike>₹2,350</strike> &rarr; <strong>₹2,100</strong>) + <strong>Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399)</strong> + Free Insured Air Express Shipping.
      </p>
      <a href="${khrishCheckoutUrl}" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:6px;letter-spacing:0.5px;">
        Order Rayhaan Lion with ₹250 Discount &rarr;
      </a>
    </div>

    <p style="margin:20px 0 8px 0;font-size:14px;">
      Direct product page on our store:<br>
      <a href="${khrishProductUrl}" style="color:#9A7953;word-break:break-all;">${khrishProductUrl}</a>
    </p>

    <p style="margin:24px 0 6px 0;">Warm regards,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:13px;color:#777777;">Founder &amp; Concierge Lead &middot; Octopus Luxury Perfumes</p>
    <p style="margin:4px 0 0 0;font-size:12px;color:#999999;">Official Store: <a href="https://www.octopusperfume.in" style="color:#777777;">octopusperfume.in</a> &middot; Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#777777;">hurkinds@gmail.com</a></p>

  </div>
</body>
</html>`;

const khrishText = `Hello Khrish,

Thank you for writing directly to us. We genuinely appreciate and welcome customers who perform thorough due diligence before purchasing online. You have asked very fair and important questions, and we are glad to provide complete, transparent clarity on each of them.

1. Relationship with Octopus Lifestyle Private Limited (buyoctopus.com):
We are completely separate and independent businesses.
The company you contacted—Octopus Lifestyle Private Limited (buyoctopus.com)—is an apparel, clothing, and fashion lifestyle brand. They do not manufacture, sell, or retail luxury fragrances.
Octopus Perfumes (octopusperfume.in) is an independent Indian luxury fragrance maison and specialized perfumery retailer. We operate exclusively in fine perfumery, attars, and luxury Middle Eastern & French fragrances—including our own flagship brand (Octopus Perfumes by Harsh Beniwal) alongside an authorized retail catalog of global houses such as Rayhaan, Rasasi, Lattafa, Afnan, and Tom Ford.
Their support team at buyoctopus.com correctly stated they do not run our website, simply because they are a clothing brand and have no connection to our perfumery business.

2. Are Rayhaan Lion perfumes 100% genuine and sourced from authorised distributors?
YES, 100%. All Rayhaan perfumes (crafted in Dubai, UAE) sold on our platform are imported legally through authorized Indian distribution channels with complete customs documentation, importer declaration, and MRP sticker compliance. Every bottle of Rayhaan Lion (100 ml) is brand new, sealed in original factory cellophane, with genuine laser-engraved batch numbers on the flacon base.

3. Will you receive a proper GST Tax Invoice?
YES, 100%. Every purchase generates an official computerized GST Tax Invoice specifying registered business details, buyer information, HSN Code 33030010 (Perfumes and Toilet Waters), and itemized 18% GST (CGST/SGST/IGST). A digital invoice PDF is emailed to you upon dispatch, and a printed physical copy is placed inside the shipping parcel.

4. Legitimate Business & Safe Online Payment:
All online transactions on octopusperfume.in are processed through India's premier RBI-authorized payment gateways (PayU and Cashfree) featuring 256-bit bank-grade encryption (PCI-DSS Level 1 compliant) supporting UPI (Google Pay, PhonePe, Paytm), Cards, and NetBanking with complete buyer protection.
Every shipment is dispatched with live AWB tracking via Blue Dart Express Air and backed by our 100% Zero-Risk Authenticity & Transit Guarantee: If a product arrives unsealed, damaged, or not as described, you receive an immediate replacement or full refund.

SPECIAL COURTESY VOUCHER:
We have activated an exclusive voucher code for you: RAYHAAN250
Get Flat ₹250 OFF on Rayhaan Lion EDP 100ml (Retail: ₹2,350 -> ₹2,100) + Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399) + Free Insured Air Express Shipping.

Direct Checkout Link (Pre-Applied):
${khrishCheckoutUrl}

Product Page:
${khrishProductUrl}

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
Official Store: https://www.octopusperfume.in · Direct Concierge: hurkinds@gmail.com
`;

async function main() {
  console.log("--------------------------------------------------");
  console.log("1. Dispatching reply to Ankit Singh (Rasasi Hawas Venom)...");
  const res1 = await sendBrevoEmail({
    to: [{ email: ankitEmail, name: "Ankit Singh" }],
    bcc: [
      { email: "littlecodr@gmail.com", name: "Mayank Agrawal" },
      { email: "hurkinds@gmail.com", name: "Octopus Desk" },
    ],
    subject: ankitSubject,
    htmlContent: ankitHtml,
    textContent: ankitText,
  });
  console.log("✅ Ankit email sent successfully! Message ID:", res1.messageId);

  console.log("--------------------------------------------------");
  console.log("2. Dispatching reply to Khrish Chauhan (Rayhaan Lion & Legitimacy)...");
  const res2 = await sendBrevoEmail({
    to: [{ email: khrishEmail, name: "Khrish Chauhan" }],
    bcc: [
      { email: "littlecodr@gmail.com", name: "Mayank Agrawal" },
      { email: "hurkinds@gmail.com", name: "Octopus Desk" },
    ],
    subject: khrishSubject,
    htmlContent: khrishHtml,
    textContent: khrishText,
  });
  console.log("✅ Khrish email sent successfully! Message ID:", res2.messageId);
  console.log("--------------------------------------------------");
}

main().catch(console.error);
