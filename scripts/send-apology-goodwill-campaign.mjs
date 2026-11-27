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
    sender: { name: "Mayank Agrawal | Founder, Octopus Perfumes", email: "orders@octopusperfume.in" },
    to,
    replyTo: { name: "Founder Concierge Desk", email: "hurkinds@gmail.com" },
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

const recipients = [
  { name: "Harpreet Kaur Saini", email: "harpreetmiku@gmail.com" },
  { name: "Keshav Sharma", email: "mailkeshav298@gmail.com" },
  { name: "Shameem Mir", email: "inboxmemin@gmail.com" },
  { name: "Naeem Solanki", email: "naeemsolanki4849@gmail.com" },
  { name: "Aditya Kumar", email: "adityaphusro@gmail.com" },
  { name: "Kirtan Singi", email: "kirtansingi@gmail.com" },
  { name: "Sandip Yadav", email: "yadavsandip32@gmail.com" },
  { name: "Ajith Sriramula", email: "ajithec121@gmail.com" },
  { name: "Theophelous Mudhleyo", email: "theophelousmudhleyo@gmail.com" },
  { name: "Aryan Tiwari", email: "tiwariatyan2004@gmail.com" },
  { name: "Aryan Tiwari", email: "tiwariaryan2004@gmail.com" },
  { name: "Ajay Loya", email: "ajayramloya@gmail.com" },
  { name: "Indumathi Ramulla", email: "indumathignanasekar123@gmail.com" },
  { name: "Nawed Anwar", email: "nawedanwar54@gmail.com" },
  { name: "Atomic Health & Fitness", email: "atomichealthfitness@gmail.com" },
  { name: "Harshit", email: "mharshit38@gmail.com" },
  { name: "Aditya Garg", email: "adityagarg1550@gmail.com" },
  { name: "Aditya Garg", email: "adityagarg09@icloud.com" },
  { name: "Rajat Koti", email: "rajatkoti0@gmail.com" },
  { name: "Ankit Singh", email: "luk4ankit@gmail.com" },
  { name: "Khrish Chauhan", email: "khrishchouhan@gmail.com" },
  { name: "Yaseen", email: "ym2571939@gmail.com" },
  { name: "Manmeet Kalia", email: "manmeet.kalia@yahoo.com" },
  { name: "Jaya Sankar", email: "jayasankar1194@gmail.com" },
  { name: "Chandan Kumar", email: "starseve1@gmail.com" },
  { name: "Mohsin Sharif", email: "mohsinsharif9@gmail.com" },
  { name: "Dhaval Parekh", email: "dhavalparekh02765@gmail.com" },
  { name: "Veena D", email: "veenadharsha@gmail.com" },
  { name: "Shardul Sawant", email: "shardulms99@gmail.com" },
  { name: "Dheeraj Barse", email: "dheerajbarse10@gmail.com" }
];

// Deduplicate
const uniqueMap = new Map();
for (const r of recipients) {
  const norm = r.email.toLowerCase().trim();
  if (!uniqueMap.has(norm)) {
    uniqueMap.set(norm, r.name);
  }
}

const uniqueList = Array.from(uniqueMap.entries()).map(([email, name]) => ({ email, name }));

function generateCampaignHtml(name) {
  const firstName = name.split(" ")[0] || "Valued Patron";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A1A1A;background-color:#F7F6F2;line-height:1.65;font-size:14px;">
  <div style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E8E5DD;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.04);">

    <!-- Elegant Gold & Black Header -->
    <div style="background-color:#141210;padding:26px 24px;text-align:center;border-bottom:3px solid #9A7953;">
      <h1 style="margin:0;font-size:16px;letter-spacing:3px;color:#D4AF7A;text-transform:uppercase;font-weight:700;">OCTOPUS LUXURY PERFUMES</h1>
      <p style="margin:6px 0 0 0;font-size:11px;letter-spacing:1.5px;color:#A8A39D;text-transform:uppercase;">Private Note from the Founder &middot; Direct Concierge</p>
    </div>

    <!-- Letter Body -->
    <div style="padding:28px 24px;">

      <p style="margin:0 0 16px 0;font-size:15px;font-weight:600;color:#141210;">Dear ${firstName},</p>

      <p style="margin:0 0 16px 0;color:#3A3733;">
        I am writing this letter to you personally from my desk. Over the past couple of weeks, our perfumery maison experienced an overwhelming surge in demand and seasonal air-shipping volumes across India. During this intense period, a software timer glitch on our web tracking portal prematurely shifted tracking milestones, and our response times on customer care lines fell short of the high standard you deserve.
      </p>

      <p style="margin:0 0 16px 0;color:#3A3733;">
        I want to apologize to you sincerely and unreservedly. As a fragrance lover, I know that when you order a luxury perfume, you are looking forward to that exhilarating first spray—and any delay, confusion, or silence is completely unacceptable. You placed your trust in us, and I take full personal accountability for making sure that trust is honored and respected.
      </p>

      <!-- The Exclusive Apology Privilege Box -->
      <div style="background:linear-gradient(135deg, #FAF7F2 0%, #F5EFEB 100%);border:1.5px solid #D4AF7A;border-radius:10px;padding:22px;margin:24px 0;text-align:center;">
        <span style="background:#9A7953;color:#FFFFFF;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;display:inline-block;margin-bottom:10px;">
          Private Goodwill Gesture
        </span>
        <h2 style="margin:0 0 6px 0;font-size:22px;color:#141210;font-weight:800;letter-spacing:0.5px;">
          FLAT ₹500 OFF PRIVILEGE VOUCHER
        </h2>
        <p style="margin:0 0 14px 0;font-size:13px;color:#615B53;">
          Use your exclusive VIP courtesy code at checkout:
        </p>
        <div style="background:#FFFFFF;border:2px dashed #9A7953;border-radius:8px;padding:10px 16px;display:inline-block;margin-bottom:14px;">
          <span style="font-family:monospace;font-size:24px;font-weight:800;color:#141210;letter-spacing:3px;">APOLOGY500</span>
        </div>
        <p style="margin:0 0 16px 0;font-size:12px;color:#554F47;line-height:1.6;">
          ✓ <strong>Flat ₹500 Instant Discount</strong> on your entire order<br>
          ✓ <strong>Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399)</strong> added automatically<br>
          ✓ <strong>Priority VIP Dispatch:</strong> 24-hr Air Express dispatch via Blue Dart with live WhatsApp updates
        </p>
        <a href="https://www.octopusperfume.in/checkout?coupon=APOLOGY500" style="display:inline-block;background-color:#141210;color:#D4AF7A;text-decoration:none;font-weight:700;font-size:14px;padding:12px 30px;border-radius:6px;letter-spacing:1px;box-shadow:0 3px 10px rgba(0,0,0,0.15);">
          Claim Your ₹500 Privilege Voucher &rarr;
        </a>
      </div>

      <!-- Featured Masterpieces -->
      <h3 style="margin:24px 0 14px 0;font-size:15px;color:#141210;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #E8E5DD;padding-bottom:8px;">
        Curated Masterpieces for Your Next Scent:
      </h3>

      <div style="margin-bottom:14px;">
        <table style="width:100%;border-collapse:collapse;">
          <!-- Item 1 -->
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F0EEE9;vertical-align:top;">
              <strong style="color:#141210;font-size:14px;">Rasasi Hawas Venom Eau de Parfum (100ml)</strong><br>
              <span style="font-size:12px;color:#666;">The commanding, dark aquatic beast-mode sensation. Seductive oceanic freshness with spicy amber and plum.</span><br>
              <span style="font-size:13px;font-weight:700;color:#9A7953;">₹3,500 &rarr; Only ₹3,000 with APOLOGY500</span> &bull; 
              <a href="https://www.octopusperfume.in/products/rasasi-hawas-venom-eau-de-parfum-for-men" style="color:#141210;font-weight:600;font-size:12px;">View &rarr;</a>
            </td>
          </tr>
          <!-- Item 2 -->
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F0EEE9;vertical-align:top;">
              <strong style="color:#141210;font-size:14px;">Ahmed Al Maghribi Bin Shaikh EDP (90ml)</strong><br>
              <span style="font-size:12px;color:#666;">Royal Cambodian oud, French lavender, saffron, and rich dark amber. Unrivaled Arabian royalty.</span><br>
              <span style="font-size:13px;font-weight:700;color:#9A7953;">₹5,500 &rarr; Only ₹5,000 with APOLOGY500</span> &bull; 
              <a href="https://www.octopusperfume.in/products/ahmed-al-maghribi-bin-shaikh-eau-de-parfum-for-men" style="color:#141210;font-weight:600;font-size:12px;">View &rarr;</a>
            </td>
          </tr>
          <!-- Item 3 -->
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F0EEE9;vertical-align:top;">
              <strong style="color:#141210;font-size:14px;">Rayhaan Lion Eau de Parfum (100ml)</strong><br>
              <span style="font-size:12px;color:#666;">Dubai’s modern woody-aromatic masterpiece with crisp citrus, cedarwood, and magnetic sillage.</span><br>
              <span style="font-size:13px;font-weight:700;color:#9A7953;">₹2,350 &rarr; Only ₹1,850 with APOLOGY500</span> &bull; 
              <a href="https://www.octopusperfume.in/products/rayhaan-lion-eau-de-parfum-for-men" style="color:#141210;font-weight:600;font-size:12px;">View &rarr;</a>
            </td>
          </tr>
          <!-- Item 4 -->
          <tr>
            <td style="padding:10px 0;vertical-align:top;">
              <strong style="color:#141210;font-size:14px;">Lattafa Musamam Black Intense EDP (100ml)</strong><br>
              <span style="font-size:12px;color:#666;">Dark smoky leather, spices, and olibanum in an iconic metal snake-sculpted collector flacon.</span><br>
              <span style="font-size:13px;font-weight:700;color:#9A7953;">₹4,000 &rarr; Only ₹3,500 with APOLOGY500</span> &bull; 
              <a href="https://www.octopusperfume.in/products/lattafa-musamam-black-intense-eau-de-parfum-for-men" style="color:#141210;font-weight:600;font-size:12px;">View &rarr;</a>
            </td>
          </tr>
        </table>
      </div>

      <p style="margin:20px 0 16px 0;font-size:13px;color:#555;">
        You can also explore our full catalogue of 17,000+ authentic niche and designer fragrances at <a href="https://www.octopusperfume.in" style="color:#9A7953;font-weight:600;">octopusperfume.in</a>.
      </p>

      <!-- Personal Closing -->
      <div style="border-top:1px solid #E8E5DD;padding-top:18px;margin-top:24px;">
        <p style="margin:0 0 4px 0;font-weight:600;color:#141210;">With deepest respect and warm regards,</p>
        <p style="margin:0;font-weight:800;font-size:15px;color:#141210;">Mayank Agrawal</p>
        <p style="margin:0;font-size:12px;color:#777777;">Founder &middot; Octopus Luxury Perfumes</p>
        <p style="margin:4px 0 0 0;font-size:11px;color:#999999;">Direct Executive Line: <a href="mailto:hurkinds@gmail.com" style="color:#777777;">hurkinds@gmail.com</a> &middot; New Delhi, India</p>
      </div>

    </div>

  </div>
</body>
</html>`;
}

function generateCampaignText(name) {
  const firstName = name.split(" ")[0] || "Valued Patron";

  return `Dear ${firstName},

I am writing this letter to you personally from my desk at Octopus Luxury Perfumes.

Over the past couple of weeks, our perfumery maison experienced an overwhelming surge in seasonal orders across India. During this intense period, a software timer glitch on our web tracking portal prematurely shifted tracking milestones, and our response times on customer care lines fell short of the high standard you deserve.

I want to apologize to you sincerely and unreservedly. As a fragrance lover, I know that when you order a luxury perfume, you are looking forward to that exhilarating first spray—and any delay, confusion, or silence is completely unacceptable. You placed your trust in us, and I take full personal accountability for making sure that trust is honored.

AN EXCLUSIVE GOODWILL GESTURE FROM THE FOUNDER:
We have activated an exclusive private courtesy voucher for you:

Code: APOLOGY500
- FLAT ₹500 OFF your entire order
- Complimentary 7ML Paradox EDP Luxury Pocket Tester (Worth ₹399) added automatically
- Priority VIP Express Air Dispatch via Blue Dart with dedicated tracking

CLAIM YOUR VOUCHER (Pre-Applied):
https://www.octopusperfume.in/checkout?coupon=APOLOGY500

CURATED FRAGRANCE HIGHLIGHTS:
1. Rasasi Hawas Venom EDP 100ml (Dark Oceanic Beast Mode): ₹3,500 -> ₹3,000 with APOLOGY500
https://www.octopusperfume.in/products/rasasi-hawas-venom-eau-de-parfum-for-men

2. Ahmed Al Maghribi Bin Shaikh EDP 90ml (Royal Oud & Saffron): ₹5,500 -> ₹5,000 with APOLOGY500
https://www.octopusperfume.in/products/ahmed-al-maghribi-bin-shaikh-eau-de-parfum-for-men

3. Rayhaan Lion EDP 100ml (Crisp Citrus & Cedar Sillage): ₹2,350 -> ₹1,850 with APOLOGY500
https://www.octopusperfume.in/products/rayhaan-lion-eau-de-parfum-for-men

4. Lattafa Musamam Black Intense EDP 100ml (Smoky Leather & Snake Flacon): ₹4,000 -> ₹3,500 with APOLOGY500
https://www.octopusperfume.in/products/lattafa-musamam-black-intense-eau-de-parfum-for-men

Explore all 17,000+ luxury fragrances at https://www.octopusperfume.in

With deepest respect and warm regards,
Mayank Agrawal
Founder · Octopus Luxury Perfumes
Direct Concierge: hurkinds@gmail.com
`;
}

async function main() {
  console.log("==================================================");
  console.log(`Starting Goodwill & Sales Conversion Campaign to ${uniqueList.length} patrons...`);
  console.log("==================================================");

  let success = 0;
  for (let i = 0; i < uniqueList.length; i++) {
    const { email, name } = uniqueList[i];
    console.log(`[${i + 1}/${uniqueList.length}] Sending to ${name} (${email})...`);
    try {
      const res = await sendBrevoEmail({
        to: [{ email, name }],
        bcc: bccList,
        subject: "A Personal Apology & an Exclusive ₹500 Privilege Voucher from Founder Mayank Agrawal",
        htmlContent: generateCampaignHtml(name),
        textContent: generateCampaignText(name),
      });
      console.log(`✅ Sent! Message ID: ${res.messageId}`);
      success++;
      // Sleep 150ms between sends to avoid rate limits
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      console.error(`❌ Failed sending to ${email}:`, err.message);
    }
  }

  console.log("==================================================");
  console.log(`Campaign Complete: ${success}/${uniqueList.length} emails dispatched successfully via Brevo SMTP.`);
  console.log("==================================================");
}

main().catch(console.error);
