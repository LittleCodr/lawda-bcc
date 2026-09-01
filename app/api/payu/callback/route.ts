import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const status = formData.get('status');
    const txnid = formData.get('txnid');
    const payuid = formData.get('mihpayid');
    const error_Message = formData.get('error_Message');
    
    // In PayU callback, we should redirect to the origin site
    // The verify_payment will be handled securely by the origin site backend
    const redirectUrl = new URL('https://internshipshub.in/payment/verify-payu');
    redirectUrl.searchParams.set('txnid', txnid?.toString() || '');
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
