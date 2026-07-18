import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing orderId" }, { status: 400 });
    }

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!key || !salt) {
      throw new Error("PayU credentials missing");
    }

    const command = "verify_payment";
    // hash sequence for verify_payment: key|command|var1|salt
    const hashString = `${key}|${command}|${orderId}|${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const params = new URLSearchParams();
    params.append("key", key);
    params.append("command", command);
    params.append("var1", orderId);
    params.append("hash", hash);

    const payuRes = await fetch("https://info.payu.in/merchant/postservice.php?form=2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const payuData = await payuRes.json();
    
    // PayU verify_payment returns status 1 for success
    if (payuData.status === 1) {
      const transaction = payuData.transaction_details[orderId];
      if (transaction && transaction.status === "success" && transaction.unmappedstatus === "captured") {
        return NextResponse.json({ success: true, transaction });
      }
    }

    return NextResponse.json({ success: false, data: payuData });
  } catch (error: any) {
    console.error("Error verifying PayU payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
