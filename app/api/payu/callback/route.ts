import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const status = formData.get('status');
    const txnid = formData.get('txnid');
    const payuid = formData.get('mihpayid');
    const error_Message = formData.get('error_Message');
    const udf1 = formData.get('udf1');
    
    // In PayU callback, redirect to origin checkout success page with order_id
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'www.octopusperfume.in';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    let redirectUrlStr = `${origin}/checkout/success`;
    if (udf1 === 'namonarayanaghee') {
      redirectUrlStr = 'https://namonarayanaghee.store/checkout/success';
    }
    const redirectUrl = new URL(redirectUrlStr);
    const orderId = txnid?.toString() || '';
    redirectUrl.searchParams.set('order_id', orderId);
    redirectUrl.searchParams.set('txnid', orderId);
    redirectUrl.searchParams.set('status', status?.toString() || '');
    redirectUrl.searchParams.set('payuid', payuid?.toString() || '');
    if (error_Message) {
      redirectUrl.searchParams.set('error', error_Message.toString());
    }

    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (error: any) {
    console.error('PayU callback error:', error);
    return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 });
  }
}
