"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProxyForm() {
  const searchParams = useSearchParams();
  const [hash, setHash] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(8);
  const formRef = useRef<HTMLFormElement>(null);

  const txnid = searchParams.get('txnid');
  const amount = searchParams.get('amount');
  const productinfo = searchParams.get('productinfo');
  const firstname = searchParams.get('firstname');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

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
          })
        });

        const data = await response.json();
        
        if (data.hash && data.key) {
          setHash(data.hash);
          setKey(data.key);
        } else {
          setError(data.error || "Failed to generate hash");
        }
      } catch (err) {
        setError("Error communicating with server");
      }
    };

    getHash();
  }, [txnid, amount, productinfo, firstname, email]);

  useEffect(() => {
    if (hash && key) {
      // Start 8-second countdown before submitting
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
  }, [hash, key]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Payment Error</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <button onClick={() => window.location.href = 'https://internshipshub.in'} className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition">
            Return to InternshipsHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100 flex flex-col items-center relative overflow-hidden">
        
        {/* Top decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500"></div>

        {/* InternshipsHub Logo */}
        <div className="mb-8 flex items-center justify-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9 5-9 5-9-5 9-5z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-800">
            Internships<span className="text-blue-600">Hub</span>
          </span>
        </div>

        {/* Animated Loader with Countdown */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">{countdown}s</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-3">
          Redirecting to Secure Checkout
        </h1>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
          <p className="text-blue-800 text-sm leading-relaxed">
            Our primary payment servers are currently experiencing high traffic. 
            <strong> We are securely routing you to our alternate PayU payment gateway</strong> to complete your transaction without any issues.
          </p>
        </div>
        
        <div className="w-full bg-amber-50 border border-amber-100 text-amber-800 text-xs py-2 px-3 rounded-lg font-medium">
          Please do not refresh or close this page
        </div>

        {/* Powered by footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 w-full">
          <p className="text-[11px] text-slate-400 font-medium flex justify-center items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 10-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 10-1.42-1.41z"/>
            </svg>
            256-bit Encrypted Connection
          </p>
        </div>

      {hash && key && (
        <form ref={formRef} action="https://secure.payu.in/_payment" method="POST" className="hidden">
          <input type="hidden" name="key" value={key} />
          <input type="hidden" name="txnid" value={txnid || ''} />
          <input type="hidden" name="amount" value={amount || ''} />
          <input type="hidden" name="productinfo" value={productinfo || ''} />
          <input type="hidden" name="firstname" value={firstname || ''} />
          <input type="hidden" name="email" value={email || ''} />
          <input type="hidden" name="phone" value={phone || ''} />
          <input type="hidden" name="surl" value="https://octopusperfume.in/api/payu/callback" />
          <input type="hidden" name="furl" value="https://octopusperfume.in/api/payu/callback" />
          <input type="hidden" name="hash" value={hash} />
        </form>
      )}
      </div>
    </div>
  );
}

export default function PayUProxyPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-50 text-slate-500">
        Loading secure checkout...
      </div>
    }>
      <ProxyForm />
    </Suspense>
  );
}
