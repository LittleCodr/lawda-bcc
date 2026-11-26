"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProxyForm() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(2);
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

  useEffect(() => {
    if (payuParams) {
      // 2-second fast redirect for super snappy UX
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (formRef.current) {
              formRef.current.submit();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [payuParams]);

  const handleManualSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

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
            Retry Secure Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-50/95 p-4 font-sans text-slate-900 overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-7 text-center border border-slate-100 flex flex-col items-center relative overflow-hidden">
        
        {/* Top decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center space-x-2.5">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white font-black text-lg">
            IH
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Internships<span className="text-emerald-600">Hub</span>
          </span>
        </div>

        {/* Animated Loader with Countdown */}
        <div className="relative w-16 h-16 mb-5">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-emerald-600 font-extrabold text-sm">{countdown}s</span>
          </div>
        </div>

        <h1 className="text-lg font-extrabold text-slate-900 mb-2">
          Connecting to PayU Secure Gateway
        </h1>

        <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4 text-left space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Order ID</span>
            <span className="font-mono font-bold text-slate-800">{txnid}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Item</span>
            <span className="font-semibold text-slate-800">{productinfo}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Candidate</span>
            <span className="font-medium text-slate-800">{firstname}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Amount Payable</span>
            <span className="text-emerald-600 font-extrabold text-base">₹{amount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualSubmit}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed to PayU Checkout</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 10-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 10-1.42-1.41z"/>
          </svg>
          256-bit SSL Encrypted • RBI Approved PayU Gateway
        </p>

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
    </div>
  );
}

export default function PayUProxyPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Connecting to PayU Secure Gateway...
      </div>
    }>
      <ProxyForm />
    </Suspense>
  );
}
