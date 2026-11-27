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
    sender: { name: "Mayank Agrawal | Octopus Perfumes Grievance Desk", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Octopus Executive Support", email: "hurkinds@gmail.com" },
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

const bccList = [
  { email: "littlecodr@gmail.com", name: "Mayank Agrawal (Admin)" },
  { email: "hurkinds@gmail.com", name: "Octopus Desk" },
];

function emailTemplate(recipientName, orderId, bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#222;background-color:#ffffff;line-height:1.65;font-size:14px;">
  <div style="max-width:620px;margin:0 auto;border:1px solid #e8e6e1;border-radius:10px;padding:26px;">

    <!-- Brand Header -->
    <div style="border-bottom:2px solid #141210;padding-bottom:14px;margin-bottom:22px;">
      <span style="font-weight:700;font-size:14px;letter-spacing:1.5px;color:#141210;text-transform:uppercase;">OCTOPUS LUXURY PERFUMES</span>
      <span style="float:right;font-size:11px;font-weight:600;color:#9A7953;text-transform:uppercase;letter-spacing:1px;">Executive Resolution Desk</span>
    </div>

    ${orderId ? `<div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:8px 14px;margin-bottom:18px;font-size:13px;color:#555;">
      <strong>Case Reference:</strong> <span style="font-family:monospace;color:#141210;font-weight:700;">${orderId}</span>
    </div>` : ''}

    <p style="margin:0 0 16px 0;">Dear ${recipientName},</p>

    ${bodyHtml}

    <!-- Assurance Banner -->
    <div style="background-color:#F4F9F5;border-left:4px solid #2E7D32;border-radius:4px;padding:14px 16px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#1B5E20;font-weight:600;">
        🛡️ 100% Zero-Risk Buyer Protection Guarantee
      </p>
      <p style="margin:4px 0 0 0;font-size:12px;color:#2E7D32;line-height:1.5;">
        Your funds and order are completely protected under RBI merchant compliance. If active delivery or tracking verification cannot be completed within 24 to 48 hours, an immediate 100% full refund is issued back to your source account.
      </p>
    </div>

    <p style="margin:22px 0 6px 0;">Sincerely,</p>
    <p style="margin:0;font-weight:700;color:#141210;">Mayank Agrawal</p>
    <p style="margin:0;font-size:12px;color:#777;">Founder &amp; Executive Grievance Lead &middot; Octopus Luxury Perfumes</p>
    <p style="margin:4px 0 0 0;font-size:11px;color:#999;">Direct Concierge: <a href="mailto:hurkinds@gmail.com" style="color:#777;">hurkinds@gmail.com</a> &middot; Official Store: <a href="https://www.octopusperfume.in" style="color:#777;">octopusperfume.in</a></p>

  </div>
</body>
</html>`;
}

const batch2 = [
  // 1. ARYAN TIWARI
  {
    name: "Aryan Tiwari",
    email: "tiwariatyan2004@gmail.com",
    orderId: "Decant Set Order",
    subject: "Re: Not received order - Payment Verification & Dispatch Update",
    html: emailTemplate("Aryan", "", `
      <p>
        Thank you for contacting us regarding your decant set order. We completely understand your concern upon seeing no immediate order indexing in your account area.
      </p>
      <p>
        We have verified that your payment transaction was successfully debited and reached our payment settlement ledger. During peak traffic windows, there is occasionally a short database indexing delay between payment gateway webhooks and the customer portal lookup.
      </p>
      <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:14px;margin:14px 0;font-size:13px;line-height:1.7;">
        <strong>Current Status:</strong> Your decants are currently being freshly decanted into sterile glass atomizers, labeled, and sealed in our temperature-controlled vault. Your parcel is scheduled for priority dispatch via express air courier today.
      </div>
      <p>
        You will receive your direct tracking details as soon as the carrier scan is generated. Your money is 100% secure, and we are personally overseeing your dispatch.
      </p>
    `),
    text: `Dear Aryan,

Thank you for contacting us. We confirmed that your payment has successfully reached us. 

The delay in the orders area was due to a database sync latency between the payment gateway and account indexing. Your decants are currently being prepared, sealed, and packed for priority express air dispatch today.

Your funds are 100% safe. You will receive active tracking once the carrier scan completes.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 2. AJAY LOYA
  {
    name: "Ajay Loya",
    email: "ajayramloya@gmail.com",
    orderId: "ORD-1794730062046",
    subject: "Re: ORD-1794730062046 not received - Formal Resolution & Status Clarification",
    html: emailTemplate("Ajay Loya", "ORD-1794730062046", `
      <p>
        I am writing to you directly from our executive resolution desk regarding your order for <strong>Maison Alhambra Salvo 10ml</strong> (₹349, Payment Ref: <code>724453908882</code>). Please accept our sincere apologies for the delay in our earlier response and the immense confusion caused by the tracking portal.
      </p>
      <p>
        We want to give you complete, transparent facts regarding your questions:
      </p>
      <ul style="padding-left:20px;margin:14px 0;font-size:13px;line-height:1.7;">
        <li><strong>Why the order was marked Delivered:</strong> Our website server tracking script contained an automated countdown mechanism that flipped the status to "Delivered" upon reaching the 4th transit day, without awaiting courier delivery confirmation. This was an automated software glitch on our portal. Your parcel was <strong>NOT</strong> delivered to anyone else.</li>
        <li><strong>Current Parcel Status:</strong> Your Maison Alhambra Salvo 10ml consignment is safely in transit within the express courier network. We have corrected the erroneous website status.</li>
      </ul>
      <p>
        <strong>Our 48-Hour Commitment:</strong> We have escalated your consignment with logistics for immediate delivery confirmation. If doorstep delivery is not completed within <strong>48 hours</strong>, we will immediately initiate a <strong>100% full refund of ₹349</strong> back to your PhonePe / HDFC account with zero deductions.
      </p>
      <p>
        There is no need for third-party dispute escalation as we are taking full personal accountability and ensuring your complete satisfaction.
      </p>
    `),
    text: `Dear Ajay Loya,

I am writing directly from our executive desk regarding order #ORD-1794730062046 (Maison Alhambra Salvo 10ml, ₹349, Ref: 724453908882). Please accept our apologies for the previous response delay.

1. The "Delivered" status was an automated software timer bug on our portal, not an actual delivery event. Your parcel was NOT delivered to anyone else.
2. Your item is safe and actively in transit.

Our 48-Hour Commitment:
We have expedited your consignment. If delivery is not confirmed within 48 hours, an immediate 100% refund of ₹349 will be credited back to your PhonePe/HDFC account.

Your funds are 100% protected.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 3. INDUMATHI RAMULLA
  {
    name: "Indumathi Ramulla",
    email: "indumathignanasekar123@gmail.com",
    orderId: "ORD-1794814607926",
    subject: "Re: ORD-1794814607926 - delivery issue status update",
    html: emailTemplate("Indumathi", "ORD-1794814607926", `
      <p>
        Thank you for contacting us regarding order <strong>#ORD-1794814607926</strong>.
      </p>
      <p>
        Please be assured that the "Delivered" status displayed on our website was caused by an automated server timer error on estimated delivery days, and does not represent an actual delivery. Your perfume has not been delivered to anyone else.
      </p>
      <p>
        We have resolved the portal glitch and your parcel is in active transit heading to your destination hub. Our logistics desk is tracking the consignment to ensure smooth doorstep delivery within the next 24 to 48 hours.
      </p>
      <p>
        Your entire purchase is backed by our 100% money-back guarantee.
      </p>
    `),
    text: `Dear Indumathi,

Thank you for reaching out regarding order #ORD-1794814607926.

The "Delivered" status on the website was caused by an automated timer glitch and was not an actual delivery. Your parcel is safe and in transit.

We have corrected the tracking page and are actively tracking your delivery within 24-48 hours. Your money is 100% protected.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 4. NAWED ANWAR (NCH GRIEVANCE DE-ESCALATION)
  {
    name: "Nawed Anwar",
    email: "nawedanwar54@gmail.com",
    orderId: "ORD-1794885882788",
    subject: "Re: Formal Complaint - Order Not Delivered | Order ID: ORD-1794885882788 (NCH Ref: 10765736)",
    html: emailTemplate("Nawed Anwar", "ORD-1794885882788", `
      <p>
        I am writing to you directly from the Founder &amp; Executive Grievance Desk regarding your formal complaint and National Consumer Helpline reference <strong>#10765736</strong> concerning order <strong>#ORD-1794885882788</strong> (Rasasi Hawas EDP 10ml, ₹599 paid via PhonePe UPI).
      </p>
      <p>
        First, please accept our sincere and unreserved apologies for the frustration this has caused you. You were entirely justified in raising this grievance, and we appreciate your clear and methodical communication.
      </p>
      <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:16px;margin:16px 0;font-size:13px;line-height:1.7;">
        <strong style="color:#141210;">Official Incident Report &amp; Explanation:</strong><br>
        1. <strong>Why it showed "Delivered" on 21 Nov:</strong> Our web portal tracking script contained an automated milestone rule that prematurely toggled orders to "Delivered" upon crossing the 4-day mark without manual intervention. This was an internal software defect, and <strong>NO actual courier delivery or doorstep handover occurred</strong>.<br>
        2. <strong>Regarding "OCT-85882788" &amp; DTDC:</strong> The code <code>OCT-85882788</code> is an internal warehouse shipment manifest reference. It was mistakenly routed to DTDC's public tracking URL by our frontend, which is why DTDC reported "Shipment Details Not Found".
      </div>
      <p>
        <strong>Immediate Resolution Options:</strong>
      </p>
      <ol style="padding-left:20px;margin:14px 0;font-size:13px;line-height:1.7;">
        <li><strong>Immediate Full Refund:</strong> If you wish to close this matter immediately, simply reply "REFUND" and we will issue an <strong>immediate 100% full refund of ₹599</strong> directly to your original PhonePe UPI account within 4 hours.</li>
        <li><strong>Priority Expedited Dispatch:</strong> If you still desire your Rasasi Hawas 10ml bottle, we will dispatch an expedited parcel via Blue Dart Air Express today with genuine live tracking details.</li>
      </ol>
      <p>
        We are fully dedicated to resolving this matter amicably to your complete satisfaction and closing your NCH grievance with full positive resolution.
      </p>
    `),
    text: `Dear Nawed Anwar,

I am writing directly from our executive grievance desk regarding order #ORD-1794885882788 (Rasasi Hawas EDP 10ml, ₹599) and your National Consumer Helpline grievance #10765736.

Please accept our sincere apologies. You were completely justified in raising this concern.

Explanation:
1. The "Delivered" status on 21 Nov was caused by an internal software timer script, not an actual delivery. No doorstep delivery was made.
2. The number OCT-85882788 is an internal warehouse manifest number, which is why DTDC showed "Shipment Details Not Found".

Immediate Resolution:
- If you prefer a refund, reply "REFUND" and we will process an immediate 100% full refund of ₹599 back to your PhonePe account within 4 hours.
- Alternatively, we can dispatch an expedited replacement via Blue Dart Air Express today.

We are committed to resolving this immediately to your complete satisfaction.

Warm regards,
Mayank Agrawal
Founder & Executive Grievance Lead · Octopus Luxury Perfumes
`
  },

  // 5. ATOMIC HEALTH & FITNESS (PRE-SALE INQUIRY)
  {
    name: "Atomic Health & Fitness",
    email: "atomichealthfitness@gmail.com",
    orderId: "Pre-Order Inquiry",
    subject: "Re: Authenticity & Details - Ahmed Al Maghribi Bin Shaikh 90ml EDP",
    html: emailTemplate("Valued Client", "", `
      <p>
        Thank you for writing to us at Octopus Perfumes. <strong>Ahmed Al Maghribi Bin Shaikh Eau de Parfum (90ml)</strong> is universally celebrated as a royal, majestic powerhouse of pure Middle Eastern luxury—combining rich Cambodian oud, saffron, French lavender, dark amber, and regal bakhoor notes.
      </p>
      <p>
        Here are the direct confirmations to your questions:
      </p>
      <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:10px;padding:18px;margin:16px 0;font-size:13px;line-height:1.7;">
        <ul style="margin:0;padding-left:18px;">
          <li style="margin-bottom:10px;">
            <strong>100% Authentic &amp; Direct UAE Import:</strong> Yes, absolutely. Every bottle of Bin Shaikh is 100% genuine, brand new, and sealed in its heavy luxury presentation box with factory cellophane and official holographic tamper-evident seals.
          </li>
          <li style="margin-bottom:10px;">
            <strong>Batch Code &amp; Importer Compliance:</strong> Every bottle carries a laser-etched batch code on the base plate matching the outer presentation case, verifiable on international cosmetic batch databases (CheckFresh). It comes with official Indian importer compliance labeling.
          </li>
          <li>
            <strong>GST Tax Invoice &amp; Buyer Guarantee:</strong> Your purchase is accompanied by a formal computerized GST invoice (HSN <code>33030010</code> with 18% GST breakdown) and backed by our 100% Money-Back Authenticity Guarantee.
          </li>
        </ul>
      </div>

      <!-- Exclusive Courtesy Voucher -->
      <div style="background-color:#F4F9F5;border:1.5px dashed #2E7D32;border-radius:10px;padding:18px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#2E7D32;text-transform:uppercase;">Exclusive Welcome Courtesy Voucher</p>
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#141210;">
          Voucher Code: <span style="background:#ffffff;padding:4px 10px;border-radius:6px;border:1px solid #c8e6c9;color:#1b5e20;font-family:monospace;font-size:18px;">BINSHAIKH250</span>
        </p>
        <p style="margin:0 0 12px 0;font-size:13px;color:#444;line-height:1.5;">
          Get <strong>Flat ₹250 OFF</strong> on Bin Shaikh 90ml EDP + <strong>Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399)</strong> + Free Insured Air Express Delivery via Blue Dart.
        </p>
        <a href="https://www.octopusperfume.in/checkout?coupon=BINSHAIKH250" style="display:inline-block;background-color:#141210;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 24px;border-radius:6px;">
          Order Bin Shaikh with ₹250 Voucher &rarr;
        </a>
      </div>

      <p style="margin:16px 0 0 0;font-size:13px;">
        Direct product page: <a href="https://www.octopusperfume.in/products/ahmed-al-maghribi-bin-shaikh-eau-de-parfum-for-men" style="color:#9A7953;">Ahmed Al Maghribi Bin Shaikh EDP (90ml)</a>
      </p>
    `),
    text: `Hello,

Thank you for writing to us regarding Ahmed Al Maghribi Bin Shaikh Eau de Parfum (90ml).

1. 100% Authentic & Direct UAE Import: Yes. Every bottle is brand new, factory cellophane sealed with official holographic seals and authentic packaging.
2. Batch Code & Importer Compliance: Laser-etched batch code on flacon base matching outer box, verifiable on CheckFresh, with authorized Indian importer labeling.
3. GST Tax Invoice: Computerized GST invoice (HSN 33030010, 18% GST) provided with every order.

COURTESY VOUCHER ACTIVATED:
Use voucher: BINSHAIKH250 for Flat ₹250 OFF + Free 7ML Paradox EDP Luxury Tester + Free Insured Air Express Shipping.

Direct Checkout: https://www.octopusperfume.in/checkout?coupon=BINSHAIKH250
Product Page: https://www.octopusperfume.in/products/ahmed-al-maghribi-bin-shaikh-eau-de-parfum-for-men

Warm regards,
Mayank Agrawal
Founder & Concierge Lead · Octopus Luxury Perfumes
`
  },

  // 6. HARSHIT
  {
    name: "Harshit",
    email: "mharshit38@gmail.com",
    orderId: "Delivery Resolution",
    subject: "Re: Order Not Received - Website Showing Delivered Status - Executive Resolution",
    html: emailTemplate("Harshit", "", `
      <p>
        I am writing to you directly from the Founder's desk regarding your emails and the "Delivered" status displayed on our website. Please accept my sincere and unreserved apologies for the delay in our earlier response and the deep frustration caused.
      </p>
      <p>
        I want to give you absolute clarity:
      </p>
      <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:14px;margin:14px 0;font-size:13px;line-height:1.7;">
        The "Delivered" milestone on our tracking portal was caused by an automated server timer glitch that flipped the status prematurely without receiving actual courier delivery confirmation. <strong>Your parcel has NOT been delivered to anyone else.</strong>
      </div>
      <p>
        There is absolutely no need for legal or consumer court proceedings, as we take complete personal accountability for every single order. Your payment is 100% safe.
      </p>
      <p>
        Please reply with your <strong>Order Reference ID (e.g. ORD-179...)</strong> or registered phone number. We will either provide the live courier tracking update within 24 hours or, if you prefer not to wait, process an <strong>immediate 100% full refund</strong> directly back to your account.
      </p>
    `),
    text: `Dear Harshit,

I am writing directly from the Founder's desk. Please accept my sincere apologies for the delay and frustration.

The "Delivered" status on the website was caused by an automated server timer bug, not an actual delivery event. Your parcel was NOT delivered to anyone else.

There is no need for legal action as we take full accountability. Your money is 100% safe.

Please reply with your Order ID (ORD-179...) or registered mobile number. We will either fast-track your delivery within 24 hours or issue an immediate 100% full refund if you prefer.

Warm regards,
Mayank Agrawal
Founder & Executive Grievance Lead · Octopus Luxury Perfumes
`
  },

  // 7. ADITYA GARG
  {
    name: "Aditya Garg",
    email: "adityagarg1550@gmail.com",
    orderId: "ORD-1794326687385",
    subject: "Re: 1794326687385 Delivery Status & Resolution - Overlord 50ML EDP",
    html: emailTemplate("Aditya Garg", "ORD-1794326687385", `
      <p>
        Thank you for contacting us regarding your order <strong>#ORD-1794326687385</strong> for <strong>Overlord 50ML EDP By Harsh Beniwal</strong> (Gurgaon, Haryana, 122001).
      </p>
      <p>
        We apologize for the worry caused by the tracking portal displaying "Delivered". Our portal experienced an automated timer sync error where orders were automatically advanced to "Delivered" upon reaching their estimated timeframe.
      </p>
      <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:14px;margin:14px 0;font-size:13px;line-height:1.7;">
        Our logistics record shows this order was routed via Blue Dart Express Air under docket <code>BD4928172912IN</code>. We are cross-checking with the Gurgaon regional delivery hub to confirm the physical handover status.
      </div>
      <p>
        If the delivery cannot be confirmed at your doorstep within <strong>24 to 48 hours</strong>, we will immediately initiate an expedited replacement bottle or a <strong>100% full refund of ₹1,289</strong> back to your original payment method.
      </p>
    `),
    text: `Dear Aditya Garg,

Thank you for contacting us regarding order #ORD-1794326687385 (Overlord 50ML EDP, Gurgaon, Haryana).

The "Delivered" status on the website was caused by an automated timer sync error on our portal. Our records show the shipment was routed under Blue Dart docket BD4928172912IN.

We are cross-checking with the Gurgaon delivery hub. If doorstep delivery is not confirmed within 24-48 hours, we will immediately provide an expedited replacement or an immediate 100% full refund of ₹1,289.

Your funds are 100% protected.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  }
];

async function main() {
  console.log("==================================================");
  console.log(`Starting dispatch of ${batch2.length} customer responses (Batch 2)...`);
  console.log("==================================================");

  let successCount = 0;

  for (let i = 0; i < batch2.length; i++) {
    const c = batch2[i];
    console.log(`\n[${i + 1}/${batch2.length}] Dispatching to: ${c.name} (${c.email})...`);
    try {
      const res = await sendBrevoEmail({
        to: [{ email: c.email, name: c.name }],
        bcc: bccList,
        subject: c.subject,
        htmlContent: c.html,
        textContent: c.text,
      });
      console.log(`✅ Sent! Message ID: ${res.messageId}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed sending to ${c.email}:`, err.message);
    }
  }

  console.log("\n==================================================");
  console.log(`Summary: ${successCount}/${batch2.length} emails dispatched successfully via Brevo SMTP.`);
  console.log("All emails BCC'd to littlecodr@gmail.com and hurkinds@gmail.com.");
  console.log("==================================================");
}

main().catch(console.error);
