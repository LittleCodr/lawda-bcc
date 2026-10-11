import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support both canonical PayU keys and checkout form aliases
    const txnid = (body.txnid || body.orderId || `ORD-${Date.now()}`).toString().trim();
    const rawAmount = body.amount;
    const firstname = (body.firstname || body.name || "Customer").toString().replace(/[|'"]/g, '').trim() || "Customer";
    const email = (body.email || "customer@octopusperfume.in").toString().trim();
    const phone = (body.phone || "").toString().trim();
    const rawProductInfo = (body.productinfo || body.cartSummary || "Octopus Perfumes").toString();
    const productinfo = rawProductInfo.replace(/[|'"]/g, '').trim() || "Octopus Perfumes";

    const udf1 = (body.udf1 !== undefined ? body.udf1 : email).toString().replace(/[|]/g, '');
    const udf2 = (body.udf2 !== undefined ? body.udf2 : phone).toString().replace(/[|]/g, '');
    const udf3 = (body.udf3 !== undefined ? body.udf3 : "octopusperfumes").toString().replace(/[|]/g, '');
    const udf4 = (body.udf4 !== undefined ? body.udf4 : "").toString().replace(/[|]/g, '');
    const udf5 = (body.udf5 !== undefined ? body.udf5 : "").toString().replace(/[|]/g, '');

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!key || !salt) {
      return NextResponse.json({ error: 'PayU credentials not configured' }, { status: 500 });
    }

    if (!txnid || rawAmount === undefined || rawAmount === null || rawAmount === "") {
      return NextResponse.json({ error: 'Missing required parameters: txnid or amount' }, { status: 400 });
    }

    // Format amount with 2 decimal places for PayU consistency (e.g. 999.00 or 1.00)
    const numAmount = Number(rawAmount);
    const amountStr = !isNaN(numAmount) ? numAmount.toFixed(2) : String(rawAmount);

    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = `${key}|${txnid}|${amountStr}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    // Dynamically resolve caller origin for surl/furl
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'www.octopusperfume.in';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    const surl = `${origin}/api/payu/callback`;
    const furl = `${origin}/api/payu/callback`;
    const action = process.env.PAYU_URL || "https://secure.payu.in/_payment";

    return NextResponse.json({
      action,
      key,
      txnid,
      amount: amountStr,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      service_provider: "payu_paisa",
    });
  } catch (error: any) {
    console.error('PayU hash error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
