import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfreeEnvironment = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" ? CFEnvironment.SANDBOX : CFEnvironment.PRODUCTION;
const cashfree = new Cashfree(
  cashfreeEnvironment,
  process.env.NEXT_PUBLIC_CASHFREE_APP_ID as string,
  process.env.CASHFREE_SECRET_KEY as string
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const response = await cashfree.PGOrderFetchPayments(orderId);
    
    // Check if there's any successful payment in the list of payments for this order
    const isPaid = response.data?.some((payment: any) => payment.payment_status === "SUCCESS");

    if (isPaid) {
      try {
        const payment = response.data.find((p: any) => p.payment_status === "SUCCESS");
        const amount = payment?.payment_amount || "Unknown";
        
        const message = `✅ *New Order Paid!*\n\n*Order ID:* \`${orderId}\`\n*Amount:* ₹${amount}`;
        
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN || "8878473167:AAH0MBRxFDUc7qbged9fMlypBapGu4QBovk"}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID || "5804733110",
            text: message,
            parse_mode: "Markdown",
          }),
        });
      } catch (tgError) {
        console.error("Failed to send telegram notification:", tgError);
      }
    }
    
    return NextResponse.json({
      success: isPaid,
      payments: response.data
    });
  } catch (error: any) {
    console.error("Error fetching Cashfree payments:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Failed to fetch payments", details: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}
