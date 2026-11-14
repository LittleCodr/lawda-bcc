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

async function sendBrevoEmail({ to, subject, htmlContent, textContent }) {
  const payload = {
    sender: { name: "Octopus Luxury Perfumes", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Octopus Perfumes Concierge", email: "hurkinds@gmail.com" },
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

const SHIPMENTS = [
  {
    orderId: "ORD-1793902511615",
    customerName: "Dheeraj Barse",
    email: "dheerajbarse10@gmail.com",
    courier: "DTDC Express Surface",
    awb: "7D141347842",
    trackingUrl: "https://shiprocket.co/tracking/7D141347842",
    carrierTrackUrl: "https://www.dtdc.in/tracking/shipment-tracking.asp",
    edd: "19 Nov 2026",
    totalPaid: "₹1,425.00",
    destination: "Shop No 1, Komal Complex, Day2Day Mart, Old Pune Mumbai Highway, Next to SBI Bank Nigdi, Pune, Maharashtra - 411044",
    items: [
      { name: "Somersault - 50ML EDP By Harsh Beniwal", qty: 1, price: "₹1,425.00" },
      { name: "Complimentary 7ML Paradox EDP Luxury Pocket Tester", qty: 1, price: "FREE (Gift)" }
    ]
  },
  {
    orderId: "ORD-1794326687385",
    customerName: "Aditya Garg",
    email: "adityagarg09@icloud.com",
    courier: "Delhivery Surface Express",
    awb: "19041978769222",
    trackingUrl: "https://shiprocket.co/tracking/19041978769222",
    carrierTrackUrl: "https://www.delhivery.com/track/package/19041978769222",
    edd: "18 Nov 2026",
    totalPaid: "₹1,289.00",
    destination: "Flat No 203, Shree Krishna Homes, Opp Thakral Nursing Homes, Shivaji Nagar, Gurgaon, Haryana - 122001",
    items: [
      { name: "Overlord - 50ML EDP By Harsh Beniwal", qty: 1, price: "₹780.00" },
      { name: "Darling - 50ML EDP By Harsh Beniwal", qty: 1, price: "₹509.00" },
      { name: "Complimentary 7ML Paradox EDP Luxury Pocket Tester", qty: 1, price: "FREE (Gift)" }
    ]
  },
  {
    orderId: "ORD-1794660599358",
    customerName: "Mohsin Sharif",
    email: "mohsinsharif9@gmail.com",
    courier: "Xpressbees Air Express",
    awb: "1319461229071",
    trackingUrl: "https://shiprocket.co/tracking/1319461229071",
    carrierTrackUrl: "https://www.xpressbees.com/track?awb=1319461229071",
    edd: "19 Nov 2026",
    totalPaid: "₹6,500.00",
    destination: "Habib Lodge, 7/94 Tilak Nagar, Near Tilak Nagar Market, Kanpur Nagar, Uttar Pradesh - 208002",
    items: [
      { name: "Abdul Samad Al Qurashi The Black Parfum (100ml)", qty: 1, price: "₹6,500.00" },
      { name: "Complimentary 7ML Paradox EDP Luxury Pocket Tester", qty: 1, price: "FREE (Gift)" }
    ]
  },
  {
    orderId: "ORD-1794661036502",
    customerName: "Mohsin Sharif",
    email: "mohsinsharif9@gmail.com",
    courier: "Delhivery Surface Express",
    awb: "19041978769314",
    trackingUrl: "https://shiprocket.co/tracking/19041978769314",
    carrierTrackUrl: "https://www.delhivery.com/track/package/19041978769314",
    edd: "19 Nov 2026",
    totalPaid: "₹2,716.00",
    destination: "Habib Lodge, 7/94 Tilak Nagar, Near Tilak Nagar Market, Kanpur Nagar, Uttar Pradesh - 208002",
    items: [
      { name: "Ahmed al Maghribi Blu Oud EDP (100ml)", qty: 1, price: "₹2,417.00" },
      { name: "Decant/Sample Nusuk Ana Al Awwal Silver EDP (10ml)", qty: 1, price: "₹299.00" },
      { name: "Complimentary 7ML Paradox EDP Luxury Pocket Tester", qty: 1, price: "FREE (Gift)" }
    ]
  },
  {
    orderId: "ORD-1794664978047",
    customerName: "Chandan Kumar",
    email: "starseve1@gmail.com",
    courier: "Delhivery Surface Express",
    awb: "19041978769244",
    trackingUrl: "https://shiprocket.co/tracking/19041978769244",
    carrierTrackUrl: "https://www.delhivery.com/track/package/19041978769244",
    edd: "18 Nov 2026",
    totalPaid: "₹3,000.00",
    destination: "21 A, 2nd Floor, Rajpal House, Mian Wali Colony, Gurgaon, Haryana - 122001",
    items: [
      { name: "Rasasi Hawas Black EDP for Men (100ml)", qty: 1, price: "₹3,000.00" },
      { name: "Complimentary 7ML Paradox EDP Luxury Pocket Tester", qty: 1, price: "FREE (Gift)" }
    ]
  },
  {
    orderId: "ORD-1794670371488",
    customerName: "Jaya Sankar",
    email: "jayasankar1194@gmail.com",
    courier: "Ekart Logistics Surface",
    awb: "SRSP6960832155",
    trackingUrl: "https://shiprocket.co/tracking/SRSP6960832155",
    carrierTrackUrl: "https://ekartlogistics.com/shipmenttrack/SRSP6960832155",
    edd: "20 Nov 2026",
    totalPaid: "₹2,750.00",
    destination: "Plot No 1, Raju Nivaz, Muthamil Nagar, Chinnalapatty, Dindigul, Tamil Nadu - 624301",
    items: [
      { name: "Lattafa Maahir Legacy EDP for Men (100ml)", qty: 1, price: "₹2,750.00" },
      { name: "Complimentary 7ML Paradox EDP Luxury Pocket Tester", qty: 1, price: "FREE (Gift)" }
    ]
  },
  {
    orderId: "ORD-1794674278670",
    customerName: "Manmeet Kalia",
    email: "manmeet.kalia@yahoo.com",
    courier: "Xpressbees Surface Express",
    awb: "14112362762469",
    trackingUrl: "https://shiprocket.co/tracking/14112362762469",
    carrierTrackUrl: "https://www.xpressbees.com/track?awb=14112362762469",
    edd: "19 Nov 2026",
    totalPaid: "₹13,400.00",
    destination: "House No 3262, Sector 49 D, Customs and Excise Officers Society, Chandigarh, Chandigarh - 160047",
    items: [
      { name: "Montale Black Aoud EDP (100ml)", qty: 1, price: "₹13,400.00" },
      { name: "Complimentary 7ML Paradox EDP Luxury Pocket Tester", qty: 1, price: "FREE (Gift)" }
    ]
  }
];

function buildEmailHtml(shipment) {
  const itemsHtml = shipment.items
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E8E6E1;font-size:13.5px;color:#242424;font-weight:600;">
          ${it.name}
          <div style="font-size:11px;color:#777777;font-weight:normal;margin-top:2px;">Quantity: ${it.qty}</div>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #E8E6E1;font-size:13.5px;color:#242424;font-weight:700;text-align:right;white-space:nowrap;">
          ${it.price}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Fragrance Order Has Dispatched - Octopus Perfumes</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F6F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#242424;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F7F6F3;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E8E6E1;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="background-color:#141210;padding:30px 34px;border-bottom:3px solid #9A7953;text-align:left;">
              <div style="font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#D4AF7A;font-weight:700;">OCTOPUS LUXURY PERFUMES</div>
              <h1 style="margin:8px 0 0 0;font-family:Georgia,serif;font-size:23px;font-weight:600;color:#FFFFFF;line-height:1.3;">
                Your Order Has Been Dispatched
              </h1>
              <div style="margin-top:6px;font-size:13px;color:#C8C2B8;">
                Order Reference: <strong style="color:#D4AF7A;">#${shipment.orderId}</strong>
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:32px 34px;">
              <p style="margin:0 0 14px 0;font-size:16px;color:#242424;">
                Dear <strong>${shipment.customerName}</strong>,
              </p>

              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.65;color:#5C5954;">
                Great news! Your luxury fragrance selection has been hand-inspected, packed with protective shockproof packaging, and handed over to our courier partner for insured express delivery.
              </p>

              <!-- Live Tracking Highlight Box -->
              <div style="background-color:#FAF9F6;border:1px solid #E8E6E1;border-left:4px solid #141210;border-radius:8px;padding:20px;margin-bottom:26px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9A7953;margin-bottom:12px;">
                  Live Courier Tracking Details
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13.5px;border-collapse:collapse;">
                  <tr>
                    <td style="padding:5px 0;color:#777777;width:140px;">Courier Partner:</td>
                    <td style="padding:5px 0;font-weight:700;color:#242424;">${shipment.courier}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;color:#777777;">AWB / Tracking No:</td>
                    <td style="padding:5px 0;font-family:monospace;font-size:14px;font-weight:700;color:#141210;letter-spacing:0.5px;">${shipment.awb}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;color:#777777;">Estimated Delivery:</td>
                    <td style="padding:5px 0;font-weight:700;color:#2E7D32;">By ${shipment.edd}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;color:#777777;">Shipping Status:</td>
                    <td style="padding:5px 0;font-weight:600;color:#141210;">Insured Express Transit</td>
                  </tr>
                </table>

                <div style="text-align:center;margin-top:20px;">
                  <a href="${shipment.trackingUrl}" style="display:inline-block;background-color:#141210;color:#FFFFFF;text-decoration:none;font-size:12.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:14px 28px;border-radius:6px;box-shadow:0 3px 10px rgba(0,0,0,0.15);">
                    Track Your Shipment Live →
                  </a>
                </div>
              </div>

              <!-- Package Contents -->
              <div style="background-color:#FFFFFF;border:1px solid #E8E6E1;border-radius:8px;padding:18px 20px;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9A7953;margin-bottom:8px;">
                  Package Contents
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${itemsHtml}
                  <tr>
                    <td style="padding:10px 0 0 0;font-size:13.5px;font-weight:700;color:#141210;">Total Paid</td>
                    <td style="padding:10px 0 0 0;font-size:15px;font-weight:700;color:#141210;text-align:right;">${shipment.totalPaid}</td>
                  </tr>
                </table>
              </div>

              <!-- Delivery Destination -->
              <div style="background-color:#F7F6F3;border:1px solid #E8E6E1;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9A7953;margin-bottom:6px;">
                  Delivery Destination
                </div>
                <div style="font-size:13px;color:#242424;line-height:1.5;">
                  ${shipment.destination}
                </div>
              </div>

              <!-- Care & Authenticity Note -->
              <div style="background-color:#F0F7F4;border-left:3px solid #347A54;border-radius:6px;padding:12px 16px;margin-bottom:24px;">
                <div style="font-size:12.5px;font-weight:700;color:#22543D;margin-bottom:3px;">
                  🛡️ Batch-Verified & Tamper-Proof Packaging
                </div>
                <div style="font-size:12.5px;color:#2D3748;line-height:1.5;">
                  Your fragrance bottles have been packed in shock-absorbing honeycomb casing with tamper-evident security tape. Please inspect the outer package before accepting the delivery.
                </div>
              </div>

              <p style="margin:20px 0 0 0;font-size:13px;line-height:1.6;color:#5C5954;">
                Need any help with your delivery or have a question? Contact concierge support at <strong>hurkinds@gmail.com</strong> or simply reply directly to this email.
              </p>

              <div style="margin-top:20px;font-size:13.5px;color:#242424;">
                Warm regards,<br>
                <strong>The Octopus Perfumes Concierge Team</strong>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F7F6F3;padding:20px 34px;border-top:1px solid #E8E6E1;text-align:center;font-size:11.5px;color:#777777;line-height:1.6;">
              <div style="font-weight:600;color:#5C5954;">OCTOPUS LUXURY PERFUMES</div>
              <div>100% Authentic Designer & Niche Fragrances · IFRA Certified · Insured Express Shipping</div>
              <div style="margin-top:4px;font-size:10.5px;">© ${new Date().getFullYear()} Octopus Perfumes. All rights reserved.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(shipment) {
  const itemsText = shipment.items.map((it) => `- ${it.name} (Qty: ${it.qty}): ${it.price}`).join("\n");
  return `OCTOPUS LUXURY PERFUMES — DISPATCH CONFIRMATION
Order Reference: #${shipment.orderId}

Dear ${shipment.customerName},

Great news! Your fragrance order has been packed and handed over to our courier partner for express delivery.

COURIER TRACKING DETAILS:
- Courier Partner: ${shipment.courier}
- AWB / Tracking No: ${shipment.awb}
- Estimated Delivery: By ${shipment.edd}
- Live Tracking Link: ${shipment.trackingUrl}

PACKAGE CONTENTS:
${itemsText}
Total Paid: ${shipment.totalPaid}

DELIVERY DESTINATION:
${shipment.destination}

Need assistance? Contact support at hurkinds@gmail.com or reply directly to this email.

Warm regards,
Octopus Perfumes Concierge Team`;
}

async function main() {
  console.log(`🚀 Sending ${SHIPMENTS.length} AWB dispatch tracking emails via Brevo...`);
  
  const results = [];
  for (const s of SHIPMENTS) {
    console.log(`\n📤 Sending tracking email to ${s.customerName} (${s.email}) for Order ${s.orderId} [AWB: ${s.awb}]...`);
    try {
      const res = await sendBrevoEmail({
        to: [{ email: s.email, name: s.customerName }],
        subject: `Your Octopus Perfumes Order #${s.orderId} Has Dispatched (Tracking ID: ${s.awb})`,
        htmlContent: buildEmailHtml(s),
        textContent: buildEmailText(s),
      });
      console.log(`✅ Dispatched successfully! Message ID: ${res.messageId}`);
      results.push({ orderId: s.orderId, customer: s.customerName, email: s.email, awb: s.awb, status: "Delivered", messageId: res.messageId });
    } catch (err) {
      console.error(`❌ Failed for ${s.orderId}:`, err.message);
      results.push({ orderId: s.orderId, customer: s.customerName, email: s.email, awb: s.awb, status: "Error", error: err.message });
    }
  }

  console.log("\n=======================================================");
  console.log("🎉 DISPATCH SUMMARY:");
  console.table(results);
}

main().catch(console.error);
