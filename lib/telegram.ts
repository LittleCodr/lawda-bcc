/**
 * Centralized Telegram notification helper for Octopus Perfumes.
 * Alerts store owner for:
 * 🟡 Cart Initiated / Item Added
 * 🟠 Payment Initiated (Proceeded to Pay)
 * ✅ Order Paid & Verified (Prepaid / PayU / Cashfree)
 */

export const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "8878473167:AAH0MBRxFDUc7qbged9fMlypBapGu4QBovk";
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "5804733110";

export async function sendTelegramMessage(text: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram sendMessage failed:", res.status, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram notification error:", err);
    return false;
  }
}

/**
 * Format IST timestamp for clean display: e.g. "19 Nov 2026, 08:45 PM IST"
 */
export function formatISTDate(date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date) + " IST";
  } catch {
    return date.toISOString();
  }
}
