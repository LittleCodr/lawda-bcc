import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, items, shipping, discount, couponCode, subtotal } = body;

    const appId = process.env.NEXT_PUBLIC_GOKWIK_APP_ID;
    const appSecret = process.env.GOKWIK_APP_SECRET;
    const merchantId = process.env.NEXT_PUBLIC_GOKWIK_MERCHANT_ID; // 19pkt8nylu4e

    if (!appId || !appSecret) {
      console.error("GoKwik API credentials are missing in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // GoKwik API Endpoint for checkout initiation
    const gokwikEndpoint = "https://api.gokwik.co/v3/order/create"; 

    // Build the payload for GoKwik Checkout
    const payload = {
      order_id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order_amount: amount,
      customer_email: email,
      customer_phone: shipping?.phone || "",
      shipping_address: {
        name: shipping?.name || "",
        address: shipping?.address || "",
        city: shipping?.city || "",
        state: shipping?.state || "",
        zip: shipping?.zip || "",
      },
      items: items?.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      discount: discount || 0,
      subtotal: subtotal || 0,
      // You can append other requirements for GoKwik V3 payload
    };

    console.log("Creating GoKwik Checkout Order with payload:", payload);

    /*
    // Live API Call when payload is strictly confirmed
    const response = await fetch(gokwikEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "app-id": appId,
        "app-secret": appSecret,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GoKwik API error:", data);
      return NextResponse.json(
        { error: "Failed to create order with GoKwik", details: data },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ 
      orderId: payload.order_id, 
      gokwikOrderId: data.gokwik_order_id,
      checkoutUrl: data.payment_link 
    });
    */

    // MOCK RESPONSE for now until exact API is confirmed
    return NextResponse.json({
      orderId: payload.order_id,
      gokwikOrderId: "GK-MOCK-" + Date.now(),
      checkoutUrl: null, // If it returns a URL, we'd redirect
      success: true,
    });

  } catch (error) {
    console.error("Error creating GoKwik order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
