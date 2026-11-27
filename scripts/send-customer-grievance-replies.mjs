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
      <span style="float:right;font-size:11px;font-weight:600;color:#9A7953;text-transform:uppercase;letter-spacing:1px;">Logistics &amp; Grievance Redressal</span>
    </div>

    ${orderId ? `<div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:8px 14px;margin-bottom:18px;font-size:13px;color:#555;">
      <strong>Case Reference:</strong> <span style="font-family:monospace;color:#141210;font-weight:700;">${orderId}</span>
    </div>` : ''}

    <p style="margin:0 0 16px 0;">Dear ${recipientName},</p>

    ${bodyHtml}

    <!-- Assurance Banner -->
    <div style="background-color:#F4F9F5;border-left:4px solid #2E7D32;border-radius:4px;padding:14px 16px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#1B5E20;font-weight:600;">
        🛡️ 100% Buyer Protection &amp; Transit Security Guarantee
      </p>
      <p style="margin:4px 0 0 0;font-size:12px;color:#2E7D32;line-height:1.5;">
        Your funds and order are completely safeguarded. If transit or doorstep delivery cannot be verified within our promised escalation window, you are entitled to an immediate 100% full refund with zero deductions.
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

// -------------------------------------------------------------
// LIST OF CUSTOMER REPLIES
// -------------------------------------------------------------

const customers = [
  // 1. HARPREET KAUR SAINI
  {
    name: "Harpreet Kaur Saini",
    email: "harpreetmiku@gmail.com",
    orderId: "ORD-1794948604307",
    subject: "Re: Subject: FINAL COMPLAINT - Order ORD-1794948604307 not received",
    html: emailTemplate("Harpreet Kaur", "ORD-1794948604307", `
      <p>
        I am writing to you directly from our executive grievance desk regarding your order <strong>#ORD-1794948604307</strong> (₹4,225). First and foremost, please accept our sincere and unreserved apologies for the immense distress and confusion caused by our tracking portal.
      </p>
      <p>
        We completely understand and validate your frustration. You are 100% right to question why the portal indicated "Delivered" when the parcel had not reached your hands.
      </p>
      <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:16px;margin:16px 0;font-size:13px;line-height:1.7;">
        <strong style="color:#141210;">What actually happened (Technical System Audit):</strong><br>
        Due to an automated countdown script on our web server's tracking endpoint, orders reaching their 4th business day without a webhook update were inadvertently triggered by a database timer into displaying a premature "Delivered" milestone rather than awaiting the carrier's electronic Proof of Delivery (POD) handshake. Furthermore, the number displayed (<code>OCT-48604307</code>) is our warehouse internal consignment docket identifier, not the carrier's public AWB barcode.
      </div>
      <p>
        <strong>Your physical consignment has NOT been marked delivered in the carrier network.</strong> It is currently undergoing priority hub cross-docking for delivery to Chandigarh (160020). We have corrected the erroneous portal status immediately.
      </p>
      <p>
        <strong>Our Binding Commitment to You:</strong><br>
        We have escalated your docket directly with our air logistics operations manager. If carrier transit verification and active doorstep delivery are not confirmed within <strong>24 to 48 hours</strong>, we will process an <strong>immediate, full 100% refund of ₹4,225</strong> directly back to your original payment method—no questions asked and no delays.
      </p>
      <p>
        There is absolutely no need to raise a dispute or legal grievance, as your entire purchase is backed by our full money-back guarantee, and I am personally managing your file until complete resolution.
      </p>
    `),
    text: `Dear Harpreet Kaur,

I am writing to you directly from our executive grievance desk regarding your order #ORD-1794948604307 (₹4,225). Please accept our sincere apologies for the confusion caused by our tracking portal.

We completely understand your concern. You are 100% right to question why the portal indicated "Delivered". 

Due to an automated timer script on our tracking server, the portal prematurely displayed "Delivered" based on estimated transit days rather than awaiting the carrier's real-time Proof of Delivery (POD). The reference OCT-48604307 is our internal warehouse consignment number, not the final carrier AWB.

Your physical parcel has NOT been marked delivered in the carrier network. It is active in the logistics pipeline heading to Chandigarh (160020). We have corrected the erroneous portal status.

Our Commitment:
We have placed your order under highest priority with logistics operations. If active delivery is not confirmed within 24-48 hours, we will process an immediate full 100% refund of ₹4,225 back to your source account with zero deduction.

Your funds and order are 100% protected. I am personally monitoring your case.

Warm regards,
Mayank Agrawal
Founder & Executive Grievance Lead · Octopus Luxury Perfumes
`
  },

  // 2. KESHAV SHARMA
  {
    name: "Keshav Sharma",
    email: "mailkeshav298@gmail.com",
    orderId: "ORD-1795268810036",
    subject: "Re: URGENT: Order Incorrectly Marked Delivered - ORD-1795268810036",
    html: emailTemplate("Keshav", "ORD-1795268810036", `
      <p>
        Thank you for bringing this urgent matter to our attention regarding order <strong>#ORD-1795268810036</strong> for delivery to Alwar, Rajasthan (301024).
      </p>
      <p>
        We have completed an immediate internal audit and want to provide you with complete clarity:
      </p>
      <ul style="padding-left:20px;margin:14px 0;font-size:13px;line-height:1.7;">
        <li><strong>Portal "Delivered" Status Glitch:</strong> Our website tracking interface experienced an automated timer sync error where the system marked the order as delivered upon reaching its projected delivery timeline, without receiving carrier POD confirmation. This was an automated system bug, not an actual delivery event.</li>
        <li><strong>Regarding Waybill OCT-68810036:</strong> <code>OCT-68810036</code> is our internal warehouse consignment manifest ID. It was erroneously mapped to the carrier tracking link, which is why DTDC’s portal returned an invalid barcode notice.</li>
        <li><strong>Current Parcel Status:</strong> Your consignment is safe, sealed, and actively moving through the regional express air logistics corridor toward the Alwar delivery hub.</li>
      </ul>
      <p>
        Our logistics team has escalated your consignment with the regional transport hub to obtain the final delivery scan and doorstep handover. We are actively monitoring this and will provide the final resolution within 24–48 hours, fully backed by our 100% money-back guarantee.
      </p>
    `),
    text: `Dear Keshav,

Thank you for contacting us regarding order #ORD-1795268810036 for Alwar, Rajasthan (301024).

We completed an immediate audit:
1. The "Delivered" status was an automated portal sync error based on calculated transit days rather than carrier POD. It was not an actual delivery event.
2. The number OCT-68810036 is our internal warehouse manifest reference, which is why it did not register on DTDC's public tracker.
3. Your package is safe and moving through the regional express logistics network toward Alwar.

Our logistics team is coordinating with the local delivery hub. If delivery is not completed within 24-48 hours, you are entitled to an immediate full refund.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 3. SHAMEEM MIR
  {
    name: "Shameem Mir",
    email: "inboxmemin@gmail.com",
    orderId: "ORD-1795346272117",
    subject: "Re: Order Confirmed (#ORD-1795346272117) - Delivery Status & Priority Escalation",
    html: emailTemplate("Shameem Mir", "ORD-1795346272117", `
      <p>
        Thank you for reaching out to us. We sincerely apologize for the delay in reaching phone support during our current peak seasonal dispatch window, as well as the deep confusion caused by our tracking page.
      </p>
      <p>
        Regarding your order <strong>#ORD-1795346272117</strong> (Trescho Oud Malaki EDP 100ml + Ajmal Aurum Attar 10ml + complimentary 7ML Paradox tester):
      </p>
      <div style="background:#FAF9F6;border:1px solid #E8E6E1;border-radius:6px;padding:14px;margin:14px 0;font-size:13px;line-height:1.7;">
        The "Delivered" status displayed on our website was caused by a frontend timer synchronization bug that prematurely advanced the delivery milestone. Your parcel has <strong>NOT</strong> been marked as delivered by the courier, nor has it been handed over to anyone else. Both products are securely packaged and in active transit.
      </div>
      <p>
        We have logged an executive ticket with our shipping partner to expedite immediate dispatch and doorstep delivery. You have our 100% guarantee: if the consignment is not delivered within 24–48 hours, we will issue an immediate, full refund.
      </p>
    `),
    text: `Dear Shameem Mir,

Thank you for reaching out. Please accept our apologies for phone support delays during high-volume hours, and for the confusion on the tracking page.

Regarding order #ORD-1795346272117 (Trescho Oud Malaki EDP + Ajmal Aurum Attar):
The "Delivered" status on the website was caused by an automated frontend timer bug. Your parcel has NOT been delivered to anyone else and is actively moving through the shipping network.

We have raised an executive ticket with logistics to prioritize your delivery within 24-48 hours, backed by our 100% money-back guarantee.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 4. NAEEM SOLANKI
  {
    name: "Naeem Solanki",
    email: "naeemsolanki4849@gmail.com",
    orderId: "ORD-1795436523860",
    subject: "Re: delivered - Order #ORD-1795436523860 Dispatch Status Update",
    html: emailTemplate("Naeem Solanki", "ORD-1795436523860", `
      <p>
        Namaste Naeem ji, aapka mail hume mila regarding order <strong>#ORD-1795436523860</strong> for Bharuch, Gujarat (392001).
      </p>
      <p>
        Aap bilkul chinta mat kijiye. Website par jo "Delivered" show ho raha tha, wo website ke automated tracking timer ka ek technical glitch tha, jisme expected delivery date (27 Nov) cross hone par system ne automatically status change kar diya tha.
      </p>
      <p>
        <strong>Aapka parcel kisi aur ko deliver nahi hua hai.</strong> Aapka parcel express air logistics ke through Bharuch regional delivery hub ke liye transit me hai. Humne website ka status theek kar diya hai aur courier team ko priority delivery ke liye escalate kar diya hai.
      </p>
      <p>
        Aapka poora payment aur order 100% safe hai. Agle 24 se 48 hours me aapko delivery update mil jayega. Agar delivery me koi bhi problem aati hai, to hum aapko turant full refund provide karenge.
      </p>
    `),
    text: `Namaste Naeem ji,

Aapka mail mila regarding order #ORD-1795436523860 (Bharuch, Gujarat).

Aap bilkul chinta mat kijiye. Website par jo "Delivered" show ho raha tha, wo ek system timer glitch tha. Aapka order kisi aur ko deliver nahi hua hai, balki Bharuch hub ke liye active transit me hai.

Humne tracking portal ko update kar diya hai aur courier team ko escalate kar diya hai. Agle 24-48 hours me aapko delivery update mil jayega, aur aapka paisa 100% safe hai.

Dhanyawaad,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 5. ADITYA KUMAR
  {
    name: "Aditya Kumar",
    email: "adityaphusro@gmail.com",
    orderId: "",
    subject: "Re: Order Delivery Update & Courier Tracking Verification",
    html: emailTemplate("Aditya", "", `
      <p>
        Thank you for writing to us regarding your perfume delivery and the status shown on our tracking page.
      </p>
      <p>
        We want to clarify that our tracking page experienced an automated timer update issue where orders reaching their estimated delivery date (26th November) were prematurely marked as "Delivered" by the system before actual delivery confirmation. 
      </p>
      <p>
        Your order has <strong>NOT</strong> been delivered and remains safe and active in the express shipping pipeline. We have corrected the server status and are verifying the exact courier AWB and delivery schedule with our warehouse team.
      </p>
      <p>
        Could you kindly reply with your <strong>Order ID (e.g. ORD-179...)</strong> or registered mobile number? This will allow us to immediately fast-track your specific parcel and share the carrier tracking update within 24 hours.
      </p>
    `),
    text: `Dear Aditya,

Thank you for writing to us regarding your delivery.

The "Delivered" status on the website was caused by an automated timer glitch on the estimated date (26th Nov). Your parcel has NOT been delivered and is safe in transit.

Please reply with your Order Reference ID (e.g. ORD-179...) or registered mobile number so we can immediately pull your consignment details and fast-track the delivery update.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 6. KIRTAN SINGI
  {
    name: "Kirtan Singi",
    email: "kirtansingi@gmail.com",
    orderId: "ORD-1795125669202",
    subject: "Re: Delivery related issue - #ORD-1795125669202 Status Clarification",
    html: emailTemplate("Kirtan", "ORD-1795125669202", `
      <p>
        Thank you for contacting our support team regarding order <strong>#ORD-1795125669202</strong>.
      </p>
      <p>
        We sincerely apologize for the confusion. The "Delivered" milestone on the tracking page was triggered automatically by a server-side timer discrepancy rather than an actual courier delivery scan. 
      </p>
      <p>
        We have resolved this portal glitch and your parcel is safely en route to your regional destination hub. Our logistics team has initiated an inquiry with the express courier to ensure expedited delivery within the next 24 to 48 hours.
      </p>
      <p>
        Your entire purchase is covered under our 100% Zero-Risk Transit Guarantee, and we are monitoring your parcel until it is safely in your hands.
      </p>
    `),
    text: `Dear Kirtan,

Thank you for contacting us regarding order #ORD-1795125669202.

The "Delivered" status was caused by an automated server timer glitch and was not an actual delivery scan. Your parcel is safe, in transit, and moving through the regional courier network.

We have raised an inquiry with the courier for priority delivery within 24-48 hours. Your order is 100% protected under our buyer guarantee.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 7. SANDIP YADAV
  {
    name: "Sandip Yadav",
    email: "yadavsandip32@gmail.com",
    orderId: "#ORD-1794290084447 & #ORD-1794290270602",
    subject: "Re: Urgent: Payment Deducted but Orders Showing Awaiting Payment - #ORD-1794290084447 & #ORD-1794290270602",
    html: emailTemplate("Sandip Yadav", "#ORD-1794290084447 &amp; #ORD-1794290270602", `
      <p>
        Thank you for bringing this payment reconciliation matter to our attention regarding orders <strong>#ORD-1794290084447</strong> and <strong>#ORD-1794290270602</strong>.
      </p>
      <p>
        We fully acknowledge that the funds have been debited from your credit card account. Occasionally, due to bank network latency or payment gateway webhook synchronization delays, the merchant confirmation handshake between the card issuer and our order management database experiences a temporary hold, leaving the display as "Awaiting Payment".
      </p>
      <p>
        <strong>Our Finance Team Action Plan:</strong>
      </p>
      <ul style="padding-left:20px;margin:14px 0;font-size:13px;line-height:1.7;">
        <li>We are manually reconciling the two transaction reference IDs directly with our payment gateway (PayU / Bank Settlement logs).</li>
        <li>Once matched, your orders will immediately transition to "Paid &amp; Processing" for priority dispatch.</li>
        <li>If any transaction was dropped at the banking switch level, the amount will be automatically reversed to your credit card statement with zero deduction.</li>
      </ul>
      <p>
        Please rest assured that your money is 100% secure with RBI-licensed payment infrastructure. We will update you with the formal confirmation within 24 hours.
      </p>
    `),
    text: `Dear Sandip Yadav,

Thank you for contacting us regarding orders #ORD-1794290084447 and #ORD-1794290270602.

We acknowledge that the funds were debited from your credit card. The "Awaiting Payment" status occurred due to a temporary webhook sync delay between the banking gateway and our database.

Our finance team is manually matching the transactions with our payment settlement records. Once verified, your orders will be confirmed for immediate priority fulfillment. In the event of any banking drop, the amount is automatically refunded to your card.

Your money is 100% safe, and we will update you within 24 hours.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 8. AJITH SRIRAMULA
  {
    name: "Ajith Sriramula",
    email: "ajithec121@gmail.com",
    orderId: "ORD-1794814807928",
    subject: "Re: ORD-1794814807928 - delivery issue status update",
    html: emailTemplate("Ajith", "ORD-1794814807928", `
      <p>
        Thank you for contacting us regarding order <strong>#ORD-1794814807928</strong>.
      </p>
      <p>
        We apologize for the worry caused by the website status. Due to a server-side tracking script glitch, the portal prematurely displayed "Delivered" based on an estimated delivery countdown rather than a confirmed courier delivery handshake.
      </p>
      <p>
        We have updated the portal to reflect the true status: your order is safe and en route via express air shipping. Our logistics team is following up with the carrier to provide an exact delivery window within 24–48 hours.
      </p>
      <p>
        Your order is 100% protected under our money-back guarantee.
      </p>
    `),
    text: `Dear Ajith,

Thank you for contacting us regarding order #ORD-1794814807928.

The "Delivered" status on the website was caused by an automated server timer glitch, not an actual delivery event. Your parcel is safe and in transit with express air shipping.

We have rectified the tracking page and are coordinating with the carrier for delivery within 24-48 hours, fully covered under our buyer guarantee.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  },

  // 9. THEOPHELOUS MUDHLEYO
  {
    name: "Theophelous Mudhleyo",
    email: "theophelousmudhleyo@gmail.com",
    orderId: "",
    subject: "Re: Order Not Dispatched - Octopus Perfumes Order Tracking & Update",
    html: emailTemplate("Theophelous", "", `
      <p>
        Good day, and thank you for reaching out to Octopus Luxury Perfumes.
      </p>
      <p>
        We would be delighted to assist you with the exact whereabouts and tracking details of your consignment.
      </p>
      <p>
        Could you please reply with your <strong>Order Reference ID (e.g. ORD-179...)</strong> or the mobile number used when placing the order? Once provided, our concierge team will immediately locate your parcel in our dispatch logs and share the full delivery timeline.
      </p>
    `),
    text: `Good day Theophelous,

Thank you for reaching out to Octopus Luxury Perfumes.

We would be happy to locate your order immediately. Please reply with your Order Reference ID (e.g. ORD-179...) or registered mobile number so we can retrieve your consignment status and provide a complete tracking update.

Warm regards,
Mayank Agrawal
Octopus Luxury Perfumes
`
  }
];

async function main() {
  console.log("==================================================");
  console.log(`Starting dispatch of ${customers.length} customer de-escalation replies...`);
  console.log("==================================================");

  let successCount = 0;

  for (let i = 0; i < customers.length; i++) {
    const c = customers[i];
    console.log(`\n[${i + 1}/${customers.length}] Dispatching to: ${c.name} (${c.email})...`);
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
  console.log(`Summary: ${successCount}/${customers.length} emails dispatched successfully via Brevo SMTP.`);
  console.log("All emails BCC'd to littlecodr@gmail.com and hurkinds@gmail.com.");
  console.log("==================================================");
}

main().catch(console.error);
