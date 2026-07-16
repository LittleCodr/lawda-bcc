import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, items, shipping, discount, couponCode, subtotal } = body;

    const apiKey = process.env.NEXT_PUBLIC_SHIPROCKET_API_KEY || "W086BqViUgVvQrAZ";
    const secretKey = process.env.SHIPROCKET_SECRET_KEY || "cliizkwZXdj8iMeK8Tq0bvMucjK6Cm0e";

    if (!apiKey || !secretKey) {
      console.error("Shiprocket API keys are missing in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // TODO: Update this URL to the exact Shiprocket Fastrr API endpoint 
    // depending on the exact headless checkout flow (e.g. creating an order vs getting a checkout session).
    // Using a standard placeholder for headless checkout session creation.
    const shiprocketEndpoint = "https://headless.fastrr.com/api/v1/orders";

    // Build the payload for Shiprocket Checkout
    // Structure may vary based on actual Fastrr API documentation
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
    };

    console.log("Creating Shiprocket Checkout Order with payload:", payload);

    // Make the request to Shiprocket Fastrr API
    // Uncomment and adapt when the exact endpoint is confirmed
    /*
    const response = await fetch(shiprocketEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-api-secret": secretKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Shiprocket API error:", data);
      return NextResponse.json(
        { error: "Failed to create order with Shiprocket", details: data },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ 
      orderId: data.order_id, 
      shiprocketOrderId: data.shiprocket_order_id,
      checkoutUrl: data.checkout_url 
    });
    */

    // MOCK RESPONSE for now until exact API is confirmed
    return NextResponse.json({
      orderId: payload.order_id,
      shiprocketOrderId: "SR-MOCK-" + Date.now(),
      checkoutUrl: null, // If it returns a URL, we'd redirect
      success: true,
    });

  } catch (error) {
    console.error("Error creating Shiprocket order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
