"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function MyInternshipsPayUContent() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const txnid = searchParams.get("txnid") || searchParams.get("orderId") || searchParams.get("order_id") || `ORD-${Date.now()}`;
  const rawAmount = searchParams.get("amount") || "1";
  const plan = searchParams.get("plan") || "standard";
  const firstname = searchParams.get("firstname") || searchParams.get("name") || "Candidate";
  const email = (searchParams.get("email") || "candidate@myinternships.online").toLowerCase().trim();
  const phone = searchParams.get("phone") || "";
  const from = searchParams.get("from") || "";
  const uid = searchParams.get("uid") || "";
  const role = searchParams.get("role") || "";
  const company = searchParams.get("company") || "";
  const productinfo =
    searchParams.get("productinfo") ||
    `myinternships.online ${plan.toUpperCase()} Lifetime Pass`;


  // Inform parent iframe modal that gateway is mounted and active
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "SEAMLESS_PAYMENT_OPENED" }, "*");
        window.parent.postMessage({ type: "PAYU_OPENED" }, "*");
      }
    } catch {}
  }, []);

  // Fetch verified PayU Hash from server
  useEffect(() => {
    let isCancelled = false;

    const fetchHash = async () => {
      try {
        const response = await fetch("/api/payu/hash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            txnid,
            amount: rawAmount,
            productinfo,
            firstname,
            email,
            phone: phone || "9999999999",
            udf1: "myinternships",
            userId: uid,
            udf3: plan,
            udf4: from,
          }),
        });

        const data = await response.json();
        if (isCancelled) return;

        if (data.hash && data.key) {
          setPayuParams(data);
        } else {
          setError(data.error || "Failed to generate PayU secure hash.");
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: "SEAMLESS_PAYMENT_ERROR", error: data.error }, "*");
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError("Error connecting to payment gateway server.");
        }
      }
    };

    fetchHash();

    return () => {
      isCancelled = true;
    };
  }, [txnid, rawAmount, productinfo, firstname, email, phone, uid, plan, from]);

  // Auto-submit form immediately once hash is prepared without any delay or transition animation
  useEffect(() => {
    if (payuParams && formRef.current && !isSubmitting) {
      setIsSubmitting(true);
      formRef.current.submit();
    }
  }, [payuParams, isSubmitting]);

  const handleClose = () => {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "SEAMLESS_PAYMENT_DISMISSED" }, "*");
      }
    } catch {}
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#F5F9F6] p-4 font-sans text-[#10221A]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[#DCE9E1] flex flex-col items-center">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-[#10221A] mb-1">Payment Setup Error</h1>
          <p className="text-sm text-[#607469] mb-6">{error}</p>
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-[#009B70] text-white rounded-xl font-bold text-sm shadow hover:bg-[#008763] transition"
          >
            Close &amp; Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      {payuParams && (
        <form
          ref={formRef}
          action={payuParams.action || "https://secure.payu.in/_payment"}
          method="POST"
          target="_top"
          className="hidden"
        >
          {Object.entries(payuParams).map(([name, val]) =>
            name !== "action" ? (
              <input key={name} type="hidden" name={name} value={String(val ?? "")} />
            ) : null
          )}
        </form>
      )}
    </div>
  );
}

export default function MyInternshipsPayUPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F5F9F6] text-[#10221A]">
          <div className="w-10 h-10 border-4 border-[#E0F7EC] border-t-[#009B70] rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-medium">Connecting to PayU gateway...</span>
        </div>
      }
    >
      <MyInternshipsPayUContent />
    </Suspense>
  );
}
