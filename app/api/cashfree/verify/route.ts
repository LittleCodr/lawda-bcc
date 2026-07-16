import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";

Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID as string;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY as string;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" ? Cashfree.Environment.SANDBOX : Cashfree.Environment.PRODUCTION;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    
    // Check if there's any successful payment in the list of payments for this order
    const isPaid = response.data?.some((payment: any) => payment.payment_status === "SUCCESS");
    
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
