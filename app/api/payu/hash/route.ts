import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, phone, name, cartSummary, txnid } = body;

    const key = process.env.PAYU_MERCHANT_KEY || "";
    const salt = process.env.PAYU_MERCHANT_SALT || "";

    if (!key || !salt) {
      return NextResponse.json(
        { error: "PayU credentials not configured" },
        { status: 500 }
      );
    }

    const txnIdToUse = txnid || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Normalize amount: always send as string with 2 decimal places
    const amountStr = parseFloat(String(amount)).toFixed(2);

    // Keep firstname simple — first word, alphanumeric only
    const firstname = name
      ? name.trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "") || "Customer"
      : "Customer";

    const emailStr = (email || "").trim() || "customer@octopusperfume.in";
    const phoneStr = (phone || "").trim() || "9999999999";

    const fullCart = cartSummary || "OctopusPerfume";
    const productinfo = fullCart.length > 100 ? fullCart.substring(0, 97) + "..." : fullCart;

    // Use UDF fields to guarantee we get this info back in the verify webhook/redirect
    const udf1 = emailStr.substring(0, 255);
    const udf2 = phoneStr.substring(0, 255);
    const udf3 = fullCart.substring(0, 255);
    const udf4 = "";
    const udf5 = "";

    // PayU hash sequence (documented):
    // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    // Note: there are 5 extra empty pipes between udf5 and SALT (for udf6-udf10)
    const hashString = [
      key, txnIdToUse, amountStr, productinfo, firstname, emailStr,
      udf1, udf2, udf3, udf4, udf5,
      "", "", "", "", "", // udf6-udf10 (always empty)
      salt
    ].join("|");

    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // Derive URLs
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "octopusperfume.in";
    const cleanHost = host.replace(/^www\./, "");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = `${protocol}://${cleanHost}`;

    return NextResponse.json({
      key,
      txnid: txnIdToUse,
      amount: amountStr,
      productinfo,
      firstname,
      email: emailStr,
      phone: phoneStr,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
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
