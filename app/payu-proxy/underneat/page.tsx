"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ProxyForm() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const txnid = searchParams.get("txnid");
  const amount = searchParams.get("amount");
  const productinfo = searchParams.get("productinfo");
  const firstname = searchParams.get("firstname");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const udf1 = searchParams.get("udf1") || "underneat";
  const udf2 = searchParams.get("udf2") || phone || "";

  useEffect(() => {
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      setError("Missing required payment details in URL");
      return;
    }

    const getHash = async () => {
      try {
        const response = await fetch("/api/payu/hash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            phone: phone || "",
            udf1: "underneat",
            udf2: udf2,
            udf3: "underneatbykusha",
          }),
        });

        const data = await response.json();

        if (data.hash && data.key) {
          setPayuParams(data);
        } else {
          setError(data.error || "Failed to generate hash");
        }
      } catch {
        setError("Error communicating with payment gateway server");
      }
    };

    getHash();
  }, [txnid, amount, productinfo, firstname, email, phone, udf1, udf2]);

  useEffect(() => {
    if (payuParams) {
      // Auto-submit almost instantly (100ms)
      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [payuParams]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FFFCF8] p-4 font-sans text-[#241611] overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[#DFD3CB] flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#241611] mb-2">Payment Verification Error</h1>
          <p className="text-[#6B6560] mb-6 text-sm">{error}</p>
          <button
            onClick={() => (window.location.href = "https://underneatbykusha.in/checkout")}
            className="w-full py-3 px-4 bg-[#241611] text-white rounded-full font-bold shadow-lg hover:bg-[#D85A2A] transition"
          >
            Return to Underneat Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FFFCF8] p-4 font-sans text-[#241611] overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[#DFD3CB] flex flex-col items-center relative overflow-hidden">
        {/* Top Terracotta Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D85A2A]"></div>

        {/* Underneat Brand Badge */}
        <div className="mb-6 flex flex-col items-center justify-center space-y-1">
          <span className="text-2xl font-black tracking-tight text-[#241611]">
            underneat<span className="text-[#D85A2A]">.</span>
          </span>
          <span className="text-xs font-serif italic text-[#8B5A2B]">
            Curated by Kusha Kapila
          </span>
        </div>

        {/* Animated Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[#F6E6DF] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D85A2A] rounded-full border-t-transparent animate-spin"></div>
        </div>

        <h1 className="text-lg font-bold text-[#241611] mb-2">
          Redirecting to PayU Secure Gateway
        </h1>

        <div className="bg-[#FAF6F3] border border-[#DFD3CB] rounded-2xl p-4 mb-6 text-left w-full">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-neutral-500">Order ID:</span>
            <span className="font-mono font-bold text-[#241611]">{txnid}</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-neutral-500">Payable Amount:</span>
            <span className="font-bold text-[#D85A2A] text-sm">₹{Number(amount || 0).toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[11px] text-[#6B6560] leading-relaxed border-t border-[#DFD3CB]/60 pt-2 text-center">
            UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards &amp; NetBanking
          </p>
        </div>

        <div className="w-full bg-[#FCEFEA] border border-[#D85A2A]/20 text-[#D85A2A] text-xs py-2 px-3 rounded-full font-bold">
          Please do not refresh or close this window
        </div>

        {/* 256-bit encrypted footer */}
        <div className="mt-6 pt-4 border-t border-[#DFD3CB]/60 w-full">
          <p className="text-[11px] text-[#6B6560] font-medium flex justify-center items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 10-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 10-1.42-1.41z" />
            </svg>
            PayU 256-bit Bank-Grade Security
          </p>
        </div>

        {payuParams && (
          <form
            ref={formRef}
            action={payuParams.action || "https://secure.payu.in/_payment"}
            method="POST"
            className="hidden"
          >
            {Object.entries(payuParams).map(([name, val]) => (
              name !== "action" && (
                <input key={name} type="hidden" name={name} value={String(val ?? "")} />
              )
            ))}
          </form>
        )}
      </div>
    </div>
  );
}

export default function UnderneatPayUProxyPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FFFCF8] text-[#241611]">
          Loading secure checkout...
        </div>
      }
    >
      <ProxyForm />
    </Suspense>
  );
}
