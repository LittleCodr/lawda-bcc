export interface OrderConfirmationItem {
  title?: string;
  variantTitle?: string;
  quantity?: number;
  price?: number;
  isGift?: boolean;
  isFree?: boolean;
}

export interface OrderConfirmationDetails {
  items?: OrderConfirmationItem[];
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  paymentMode?: string;
  transactionId?: string;
  shippingAddress?: string;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInr(amount: number | string): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return escapeHtml(amount);
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
}

export async function sendBrevoEmail(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent?: string
) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY is not defined");
    return { success: false, error: "API key missing" };
  }

  try {
    const payload: {
      sender: { name: string; email: string };
      to: Array<{ email: string; name: string }>;
      replyTo: { name: string; email: string };
      subject: string;
      htmlContent: string;
      textContent?: string;
    } = {
      sender: { name: "Octopus Perfumes", email: "orders@octopusperfume.in" },
      to: [{ email: toEmail, name: toName || "Valued Customer" }],
      replyTo: { name: "Octopus Perfumes Concierge", email: "orders@octopusperfume.in" },
      subject,
      htmlContent,
    };

    if (textContent) {
      payload.textContent = textContent;
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
      console.error("Brevo API error:", data);
      return { success: false, error: data.message || "Brevo API request failed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Brevo email:", error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(
  orderId: string,
  customerName: string,
  customerEmail: string,
  totalAmount: string | number,
  productInfo: string,
  details?: OrderConfirmationDetails
) {
  const cleanEmail = String(customerEmail || "").trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "No valid email provided" };
  }

  const safeName = escapeHtml(customerName || "Valued Patron");
  const safeOrderId = escapeHtml(orderId);
  const rawItems = Array.isArray(details?.items) && details.items.length > 0 ? details.items : null;

  const itemsRowsHtml = rawItems
    ? rawItems
        .map((item) => {
          const title = escapeHtml(item.title || "Signature Eau De Parfum");
          const variant =
            item.variantTitle && item.variantTitle !== "Default Title"
              ? `<div style="font-size:12px;color:#777777;margin-top:2px;">${escapeHtml(item.variantTitle)}</div>`
              : "";
          const qty = Number(item.quantity || 1);
          const price = Number(item.price || 0);
          const lineTotal = item.isFree || price === 0 ? "Complimentary" : formatInr(price * qty);
          return `
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #E8E6E1;vertical-align:top;">
                <div style="font-size:14px;font-weight:600;color:#242424;">${title}</div>
                ${variant}
                <div style="font-size:12px;color:#777777;margin-top:2px;">Qty: ${qty}</div>
              </td>
              <td style="padding:12px 0;border-bottom:1px solid #E8E6E1;text-align:right;vertical-align:top;font-size:14px;font-weight:600;color:#242424;white-space:nowrap;">
                ${lineTotal}
              </td>
            </tr>`;
        })
        .join("")
    : `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E8E6E1;vertical-align:top;">
            <div style="font-size:14px;font-weight:600;color:#242424;">${escapeHtml(productInfo || "Curated Fragrance Order")}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #E8E6E1;text-align:right;vertical-align:top;font-size:14px;font-weight:600;color:#242424;">
            ${formatInr(totalAmount)}
          </td>
        </tr>`;

  const hasGift =
    rawItems?.some((i) => (i.title || "").toLowerCase().includes("paradox") || i.isGift) ?? false;
  const giftRowHtml = hasGift
    ? ""
    : `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #E8E6E1;vertical-align:top;">
          <div style="font-size:14px;font-weight:600;color:#242424;">Paradox 7ML Eau de Parfum Tester</div>
          <div style="font-size:12px;color:#9A7953;margin-top:2px;">Complimentary Discovery Bonus</div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #E8E6E1;text-align:right;vertical-align:top;font-size:13px;font-weight:700;color:#347A54;">
          FREE
        </td>
      </tr>`;

  const discountHtml =
    details?.discountAmount && details.discountAmount > 0
      ? `
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#347A54;">Savings${details.promoCode ? ` (${escapeHtml(details.promoCode)})` : ""}</td>
          <td style="padding:6px 0;text-align:right;font-size:13px;font-weight:600;color:#347A54;">-${formatInr(details.discountAmount)}</td>
        </tr>`
      : "";

  const shippingLabel =
    details?.shippingFee && details.shippingFee > 0 ? formatInr(details.shippingFee) : "FREE";

  const shippingBlockHtml = details?.shippingAddress
    ? `
      <div style="background-color:#F7F6F3;border:1px solid #E8E6E1;border-radius:8px;padding:16px 18px;margin-top:22px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#9A7953;margin-bottom:6px;">Dispatch Destination</div>
        <div style="font-size:13px;color:#242424;line-height:1.5;">${escapeHtml(details.shippingAddress)}</div>
      </div>`
    : "";

  const metaLineParts = [
    details?.paymentMode ? `Payment: ${escapeHtml(details.paymentMode)}` : "",
    details?.transactionId ? `Txn Ref: ${escapeHtml(details.transactionId)}` : "",
  ].filter(Boolean);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#F7F6F3;font-family:'Helvetica Neue',Arial,sans-serif;color:#242424;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F7F6F3;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E8E6E1;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="background-color:#141210;padding:28px 32px;border-bottom:3px solid #9A7953;">
              <div style="font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#D4AF7A;font-weight:700;">OCTOPUS PERFUMES</div>
              <h1 style="margin:8px 0 0 0;font-family:Georgia,serif;font-size:24px;font-weight:600;color:#FFFFFF;">Your Order Is Confirmed</h1>
              <div style="margin-top:6px;font-size:13px;color:#C8C2B8;">Order Reference: <strong style="color:#FFFFFF;">#${safeOrderId}</strong></div>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 32px;">
              <p style="margin:0 0 14px 0;font-size:15px;color:#242424;">Dear ${safeName},</p>
              <p style="margin:0 0 22px 0;font-size:14px;line-height:1.65;color:#5C5954;">
                Thank you for shopping with Octopus Perfumes. Your payment has been verified and our dispatch team is preparing your sealed bottle(s) along with a complimentary 7ML Paradox EDP tester.
              </p>

              <div style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#9A7953;margin-bottom:8px;">Order Summary</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:1px solid #E8E6E1;">
                ${itemsRowsHtml}
                ${giftRowHtml}
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:14px;">
                ${discountHtml}
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#5C5954;">Insured Express Shipping</td>
                  <td style="padding:6px 0;text-align:right;font-size:13px;font-weight:600;color:#347A54;">${shippingLabel}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0 0;border-top:1px solid #D4CFC7;font-size:16px;font-weight:700;color:#141210;">Total Paid</td>
                  <td style="padding:12px 0 0 0;border-top:1px solid #D4CFC7;text-align:right;font-size:18px;font-weight:700;color:#141210;">${formatInr(totalAmount)}</td>
                </tr>
              </table>

              ${shippingBlockHtml}
              ${
                metaLineParts.length > 0
                  ? `<p style="margin:18px 0 0 0;font-size:12px;color:#777777;">${metaLineParts.join("  •  ")}</p>`
                  : ""
              }

              <div style="margin-top:26px;text-align:center;">
                <a href="https://www.octopusperfume.in/account?tab=orders" style="display:inline-block;background-color:#141210;color:#FFFFFF;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;padding:13px 26px;border-radius:6px;">
                  View Order &amp; Download Invoice
                </a>
              </div>

              <p style="margin:24px 0 0 0;font-size:13px;line-height:1.6;color:#5C5954;">
                You will receive your AWB tracking update shortly after dispatch. For any assistance, simply reply to this email or view your order inside your Octopus Perfumes account.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F7F6F3;padding:18px 32px;border-top:1px solid #E8E6E1;text-align:center;font-size:12px;color:#777777;">
              <div>100% Genuine Sealed Fragrances · Batch-Verified Dispatch</div>
              <div style="margin-top:4px;">© ${new Date().getFullYear()} Octopus Perfumes · orders@octopusperfume.in</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const plainItems = rawItems
    ? rawItems
        .map(
          (i) =>
            `- ${i.title || "Fragrance"}${i.variantTitle ? ` (${i.variantTitle})` : ""} x${i.quantity || 1}: ${
              i.isFree || Number(i.price || 0) === 0 ? "FREE" : formatInr(Number(i.price || 0) * Number(i.quantity || 1))
            }`
        )
        .join("\n")
    : `- ${productInfo || "Curated Fragrance Order"}`;

  const textContent = [
    `OCTOPUS PERFUMES — ORDER CONFIRMATION`,
    `Order ID: #${orderId}`,
    ``,
    `Dear ${customerName || "Valued Patron"},`,
    `Your payment has been verified and your order is now queued for dispatch with a complimentary 7ML Paradox EDP tester.`,
    ``,
    `Items:`,
    plainItems,
    ``,
    `Total Paid: ₹${Math.round(Number(totalAmount || 0)).toLocaleString("en-IN")}`,
    details?.shippingAddress ? `Shipping To: ${details.shippingAddress}` : "",
    ``,
    `View your order & download your invoice at: https://www.octopusperfume.in/account?tab=orders`,
    `Need help? Reply directly to orders@octopusperfume.in`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendBrevoEmail(
    cleanEmail,
    customerName || "Valued Patron",
    `Order Confirmed (#${orderId}) — Octopus Perfumes`,
    htmlContent,
    textContent
  );
}

export async function sendAbandonedCartReminder(order: {
  name?: string;
  email?: string;
  orderId?: string;
  id?: string;
  shippingDetails?: { name?: string; email?: string };
}) {
  const customerName = order.name || order.shippingDetails?.name || "there";
  const customerEmail = order.email || order.shippingDetails?.email;
  if (!customerEmail) return { success: false, error: "No email provided" };

  const safeName = escapeHtml(customerName);
  const htmlContent = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background-color:#F7F6F3;padding:32px 16px;">
      <div style="background-color:#141210;padding:24px 28px;border-radius:10px 10px 0 0;border-bottom:3px solid #9A7953;">
        <span style="color:#D4AF7A;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Octopus Perfumes</span>
        <h1 style="color:#FFFFFF;font-family:Georgia,serif;font-size:24px;margin:6px 0 0 0;">Complete Your Selection</h1>
      </div>
      <div style="background-color:#FFFFFF;padding:32px 28px;border:1px solid #E8E6E1;border-top:0;border-radius:0 0 10px 10px;">
        <p style="font-size:16px;color:#242424;margin-top:0;">Hey ${safeName},</p>
        <p style="font-size:14px;color:#5C5954;line-height:1.65;">
          Your fragrance selection is still reserved in your bag, including complimentary express pan-India delivery and a free 7ML Paradox EDP tester.
        </p>
        <p style="font-size:14px;color:#5C5954;line-height:1.65;">
          Shopping ₹5,000 or more? Apply code <strong style="color:#242424;">OCTOPUS5</strong> at checkout for 5% OFF.
        </p>
        <div style="text-align:center;margin:28px 0;">
          <a href="https://www.octopusperfume.in/checkout" style="background-color:#141210;color:#FFFFFF;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:700;font-size:13px;letter-spacing:1.2px;text-transform:uppercase;display:inline-block;">
            Resume Checkout
          </a>
        </div>
        <p style="font-size:13px;color:#777777;margin-bottom:0;">
          Warm regards,<br/><strong>Octopus Perfumes Concierge</strong>
        </p>
      </div>
    </div>
  `;

  return sendBrevoEmail(
    customerEmail,
    customerName,
    "Your reserved fragrances await — Octopus Perfumes",
    htmlContent,
    `Hey ${customerName}, your fragrance selection is still reserved at https://www.octopusperfume.in/checkout . Orders of ₹5,000+ can apply OCTOPUS5 for 5% OFF.`
  );
}
