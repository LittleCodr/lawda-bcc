import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, phone, name, productinfo = "Octopus Perfume Order" } = body;

    const key = (process.env.PAYU_MERCHANT_KEY || "").trim();
    const salt = (process.env.PAYU_MERCHANT_SALT || "").trim();

    if (!key || !salt) {
      throw new Error("PayU credentials missing. Did you restart the server?");
    }

    const txnid = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // PayU sometimes fails if amount has .00 or trailing decimals unnecessarily
    const amountStr = Number.isInteger(Number(amount)) ? String(Number(amount)) : parseFloat(amount.toString()).toFixed(2);
    
    // Strip spaces and special characters from firstname to be safe
    const firstname = name ? name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '') : "Customer";
    
    // Make productinfo completely safe (no spaces)
    const safeProductInfo = "Perfume";
    const emailStr = email ? email.trim() : "customer@octopusperfume.in";
    const udf1 = "1";
    const udf2 = "2";
    const udf3 = "3";
    const udf4 = "4";
    const udf5 = "5";
    
    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    const hashString = `${key}|${txnid}|${amountStr}|${safeProductInfo}|${firstname}|${emailStr}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    
    console.log("PAYU DEBUG HASH STRING:", hashString);

    const host = req.headers.get("host");
    const secureProtocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = req.headers.get("origin") || (host ? `${secureProtocol}://${host}` : "https://octopusperfume.in");

    return NextResponse.json({
      key,
      txnid,
      amount: amountStr,
      productinfo: safeProductInfo,
      firstname,
      email: emailStr,
      phone,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      hash,
      surl: `${origin}/api/payu/redirect`,
      furl: `${origin}/api/payu/redirect`,
      action: process.env.PAYU_URL || "https://secure.payu.in/_payment",
    });
  } catch (error: any) {
    console.error("Error generating PayU hash:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate hash" },
      { status: 500 }
    );
  }
}
