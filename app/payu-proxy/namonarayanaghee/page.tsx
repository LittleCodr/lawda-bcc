"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProxyForm() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const txnid = searchParams.get('txnid');
  const amount = searchParams.get('amount');
  const productinfo = searchParams.get('productinfo');
  const firstname = searchParams.get('firstname');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const udf1 = searchParams.get('udf1');

  useEffect(() => {
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      setError("Missing required payment details in URL");
      return;
    }

    const getHash = async () => {
      try {
        const response = await fetch('/api/payu/hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txnid,
            amount,
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
      } catch (err) {
        setError("Error communicating with server");
      }
    };

    getHash();
  }, [txnid, amount, productinfo, firstname, email, phone, udf1]);

  useEffect(() => {
    if (payuParams && formRef.current) {
      formRef.current.submit();
    }
  }, [payuParams]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#1E3A24] overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-[#E9E5D9] flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-bold text-[#1E3A24] mb-2">Payment Error</h1>
          <p className="text-[#576B55] mb-6">{error}</p>
          <button onClick={() => window.location.href = 'https://namonarayanaghee.store/cart'} className="w-full py-3 px-4 bg-[#1E3A24] text-white rounded-xl font-bold shadow-lg hover:bg-[#152919] transition">
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-[#FAF9F5]">
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
    <Suspense fallback={<div className="fixed inset-0 z-[99999] bg-[#FAF9F5]" />}>
      <ProxyForm />
    </Suspense>
  );
}
