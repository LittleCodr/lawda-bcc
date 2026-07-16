import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";

Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID as string;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY as string;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" ? Cashfree.Environment.SANDBOX : Cashfree.Environment.PRODUCTION;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, items, shipping, phone, name } = body;

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
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?order_id=${orderId}`,
      },
      order_note: "Order from Octopus Perfumes"
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    return NextResponse.json({
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (error: any) {
    console.error("Error creating Cashfree order:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Failed to create order", details: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}
