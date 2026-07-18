import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, phone, name, userId, productinfo = "Octopus Perfume Order" } = body;

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!key || !salt) {
      throw new Error("PayU credentials missing");
    }

    const txnid = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const amountStr = parseFloat(amount.toString()).toFixed(2);
    
    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    const hashString = `${key}|${txnid}|${amountStr}|${productinfo}|${name}|${email}|${userId}||||||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    return NextResponse.json({
      key,
      txnid,
      amount: amountStr,
      productinfo,
      firstname: name,
      email,
      phone,
      udf1: userId,
      hash,
      surl: `${req.headers.get("origin")}/api/payu/redirect`,
      furl: `${req.headers.get("origin")}/api/payu/redirect`,
      action: process.env.PAYU_URL || "https://secure.payu.in/_payment",
    });
  } catch (error: any) {
    console.error("Error generating PayU hash:", error);
    return NextResponse.json(
      { error: "Failed to generate hash" },
      { status: 500 }
    );
  }
}
