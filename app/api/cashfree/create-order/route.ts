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
    const { amount, email, items, shipping, phone, name } = body;

    const rawHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || "octopusperfume.in";
    const host = rawHost.replace(/^www\./, "");
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const secureProtocol = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" && host.includes("localhost") ? "http" : "https";
    const origin = `${secureProtocol}://${host}`;

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const request = {
      order_amount: parseFloat(amount.toString()),
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `CUST-${Date.now()}`,
        customer_phone: phone || "9999999999",
        customer_email: email,
        customer_name: name || "Customer"
      },
      order_meta: {
        return_url: `${origin}/checkout/success?order_id=${orderId}`,
        notify_url: `${origin}/api/cashfree/webhook`,
      },
      order_note: "Order from Octopus Perfume"
    };

    const response = await cashfree.PGCreateOrder(request);
    
    return NextResponse.json({
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (error: any) {
    console.error("Error creating Cashfree order:", error?.response?.data || error);

    const errorData = error?.response?.data;
    
    // Check if Cashfree returned a specific error response
    if (errorData) {
      // Return 400 for Cashfree API errors to allow the frontend to display them
      return NextResponse.json(
        { error: errorData.message || "Failed to create order", details: errorData },
        { status: 400 } // Use 400 instead of 500 so it can be handled as a validation/client configuration issue
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
