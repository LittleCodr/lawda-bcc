"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProxyForm() {
  const searchParams = useSearchParams();
  const [hash, setHash] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    if (hash && key && formRef.current) {
      formRef.current.submit();
    }
  }, [hash, key]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-600">
        Error: {error}. Please return to InternshipsHub and try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-semibold text-lg text-center">
          Securely redirecting to PayU Payment Gateway...
        </p>
        <p className="text-gray-500 text-sm mt-2 text-center">
          Please do not refresh or close this page.
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
  );
}

export default function PayUProxyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <ProxyForm />
    </Suspense>
  );
}
