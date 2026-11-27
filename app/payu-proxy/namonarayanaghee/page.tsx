"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProxyForm() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const rawTxnid = searchParams.get('txnid') || searchParams.get('order_id') || searchParams.get('orderId');
  const txnid = rawTxnid ? rawTxnid.replace(/^#/, '').trim() : '';
  const rawAmount = searchParams.get('amount');
  const productinfo = searchParams.get('productinfo') || 'Pure A2 Gir Cow Ghee';
  const firstname = searchParams.get('firstname') || searchParams.get('name') || 'Customer';
  const email = (searchParams.get('email') || 'customer@namonarayanaghee.store').trim();
  const phone = searchParams.get('phone') || '';
  const udf1 = searchParams.get('udf1') || 'namonarayanaghee';

  // Admin ₹1.00 bypass
  const isAdmin = ["littlecodr@gmail.com", "hurkinds@gmail.com"].includes(email.toLowerCase());
  const effectiveAmount = isAdmin ? "1.00" : (rawAmount || "1.00");

  useEffect(() => {
    if (!txnid || !rawAmount) {
      setError("Missing required payment details (Order ID or Amount)");
      return;
    }

    const getHash = async () => {
      try {
        const response = await fetch('/api/payu/hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txnid,
            amount: effectiveAmount,
            productinfo,
            firstname,
            email,
            phone: phone || '',
            udf1: udf1 || 'namonarayanaghee',
            udf2: phone || '',
            udf3: 'namonarayanaghee',
          })
        });

        const data = await response.json();
        
        if (data.hash && data.key) {
          setPayuParams(data);
        } else {
          setError(data.error || "Failed to generate hash");
        }
      } catch {
        setError("Error communicating with server");
      }
    };

    getHash();
  }, [txnid, rawAmount, effectiveAmount, productinfo, firstname, email, phone, udf1]);

  useEffect(() => {
    if (payuParams && formRef.current) {
      // Instant direct submit without delay or transition animation
      formRef.current.submit();
    }
  }, [payuParams]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#1E3A24]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-[#E9E5D9] flex flex-col items-center">
          <h1 className="text-xl font-serif font-bold text-[#1E3A24] mb-2">Payment Error</h1>
          <p className="text-[#576B55] mb-6 text-sm">{error}</p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.top ? (window.top.location.href = 'https://www.namonarayanaghee.store/checkout') : (window.location.href = 'https://www.namonarayanaghee.store/checkout');
              }
            }}
            className="w-full py-3 px-4 bg-[#1E3A24] text-white rounded-xl font-bold shadow-lg hover:bg-[#152919] transition"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      {payuParams && (
        <form ref={formRef} action={payuParams.action || "https://secure.payu.in/_payment"} method="POST" target="_top" className="hidden">
          {Object.entries(payuParams).map(([name, val]) => (
            name !== "action" && <input key={name} type="hidden" name={name} value={String(val ?? '')} />
          ))}
        </form>
      )}
    </div>
  );
}

export default function NamoNarayanaProxyPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-white" />}>
      <ProxyForm />
    </Suspense>
  );
}
