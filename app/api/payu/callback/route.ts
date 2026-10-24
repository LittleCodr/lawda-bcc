import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { sendOrderConfirmation } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const status = formData.get('status')?.toString() || '';
    const txnid = formData.get('txnid')?.toString() || '';
    const payuid = formData.get('mihpayid')?.toString() || '';
    const amount = formData.get('amount')?.toString() || '0';
    const mode = formData.get('mode')?.toString() || '';
    const bank_ref_num = formData.get('bank_ref_num')?.toString() || '';
    const firstname = formData.get('firstname')?.toString() || 'Customer';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const productinfo = formData.get('productinfo')?.toString() || '';
    const error_Message = formData.get('error_Message')?.toString() || '';
    const udf1 = formData.get('udf1')?.toString() || '';
    const udf2 = formData.get('udf2')?.toString() || ''; // userId

    const baseOrderIdMatch = txnid.match(/(ORD-\d{13})/);
    const orderId = baseOrderIdMatch ? baseOrderIdMatch[1] : txnid;

    // Server-side payment capture to Firestore
    if (status === 'success' && orderId) {
      const paymentUpdate = {
        orderId,
        status: "Paid",
        paymentMethod: "payu",
        payuTxnId: txnid,
        mihpayid: payuid,
        bankRefNum: bank_ref_num,
        paymentMode: mode,
        amountPaid: Number(amount) || 1,
        paidAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        // 1. Update root orders document
        await setDoc(doc(db, "orders", orderId), paymentUpdate, { merge: true });

        // 2. Also check if root order already had a userId
        let targetUserId = udf2;
        if (!targetUserId) {
          const rootSnap = await getDoc(doc(db, "orders", orderId));
          if (rootSnap.exists()) {
            targetUserId = rootSnap.data().userId || "";
          }
        }

        // 3. Update user orders subcollection if userId is known
        if (targetUserId) {
          await setDoc(doc(db, "users", targetUserId, "orders", orderId), paymentUpdate, { merge: true });
        }
      } catch (dbErr) {
        console.error("Error writing payment to Firestore in callback:", dbErr);
      }

      // 4. Telegram Notification
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        try {
          const message = `✅ *New Order Paid (PayU Callback)*\n\n` +
            `*Order ID:* \`${orderId}\`\n` +
            `*Amount:* ₹${amount}\n` +
            `*Payment ID:* \`${payuid}\`\n` +
            `*Mode:* ${mode} (${bank_ref_num})\n\n` +
            `*Customer Details:*\n` +
            `*Name:* ${firstname}\n` +
            `*Email:* ${email || 'N/A'}\n` +
            `*Phone:* ${phone || 'N/A'}\n\n` +
            `*Product:* ${productinfo}`;

          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: "Markdown",
            }),
          });
        } catch (tgErr) {
          console.error("Telegram callback notification error:", tgErr);
        }
      }

      // 5. Brevo Customer Email Confirmation
      if (email && email.includes("@")) {
        try {
          await sendOrderConfirmation(orderId, firstname, email, amount, productinfo);
        } catch (emailErr) {
          console.error("Brevo email callback error:", emailErr);
        }
      }
    }

    // In PayU callback, redirect to origin checkout success page with verified parameters
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'www.octopusperfume.in';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    let redirectUrlStr = `${origin}/checkout/success`;
    if (udf1 === 'namonarayanaghee') {
      redirectUrlStr = 'https://namonarayanaghee.store/checkout/success';
    }
    const redirectUrl = new URL(redirectUrlStr);
    redirectUrl.searchParams.set('order_id', orderId);
    redirectUrl.searchParams.set('txnid', txnid);
    redirectUrl.searchParams.set('status', status);
    redirectUrl.searchParams.set('payuid', payuid);
    if (error_Message) {
      redirectUrl.searchParams.set('error', error_Message);
    }

    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (error: any) {
    console.error('PayU callback error:', error);
    return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 });
  }
}
