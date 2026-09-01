import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { txnid, amount, productinfo, firstname, email, udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "" } = body;

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!key || !salt) {
      return NextResponse.json({ error: 'PayU credentials not configured' }, { status: 500 });
    }

    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({ hash, key });
  } catch (error: any) {
    console.error('PayU hash error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
