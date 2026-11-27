"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function ProxyForm() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const rawTxnid = searchParams.get('txnid') || searchParams.get('order_id') || searchParams.get('orderId');
  const txnid = rawTxnid || `IHUB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const amount = searchParams.get('amount') || '149';
  const productinfo = searchParams.get('productinfo') || searchParams.get('plan') || 'InternshipsHub Premium Plan';
  const firstname = searchParams.get('firstname') || searchParams.get('name') || 'Candidate';
  const email = searchParams.get('email') || 'candidate@internshipshub.in';
  const phone = searchParams.get('phone') || '9999999999';
  const udf1 = searchParams.get('udf1') || 'internshipshub';
  const udf2 = searchParams.get('udf2') || searchParams.get('uid') || '';

  useEffect(() => {
    let isCancelled = false;

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
            phone: phone || '9999999999',
            udf1: udf1 || 'internshipshub',
            udf2: udf2 || '',
            udf3: 'internshipshub',
          })
        });

        const data = await response.json();
        if (isCancelled) return;
        
        if (data.hash && data.key) {
          setPayuParams(data);
        } else {
          setError(data.error || "Failed to generate PayU secure hash");
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err?.message || "Error communicating with payment gateway");
        }
      }
    };

    getHash();

    return () => {
      isCancelled = true;
    };
  }, [txnid, amount, productinfo, firstname, email, phone, udf1, udf2]);

  // Instant direct submit without delay, countdown, or transition animation
  useEffect(() => {
    if (payuParams && formRef.current) {
      formRef.current.submit();
    }
  }, [payuParams]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100 flex flex-col items-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-5">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Payment Initializing Error</h1>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button 
            type="button"
            onClick={() => window.location.reload()} 
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition"
          >
            Retry Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex items-center justify-center">
      {payuParams && (
        <form 
          ref={formRef} 
          action={payuParams.action || "https://secure.payu.in/_payment"} 
          method="POST" 
          target="_top" 
          className="hidden"
        >
          {Object.entries(payuParams).map(([name, val]) => (
            name !== "action" && <input key={name} type="hidden" name={name} value={String(val ?? '')} />
          ))}
        </form>
      )}
    </div>
  );
}

export default function PayUProxyPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[99999] bg-white" />}>
      <ProxyForm />
    </Suspense>
  );
}
