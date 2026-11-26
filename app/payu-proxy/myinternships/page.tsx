"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function MyInternshipsPayUContent() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
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

  const isAdmin = email === "littlecodr@gmail.com";
  const displayAmount = isAdmin ? "1.00" : Number(rawAmount || 0).toLocaleString("en-IN");

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

  // Auto-submit form targeting top window once hash is prepared
  useEffect(() => {
    if (!payuParams) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [payuParams]);

  const triggerSubmit = () => {
    if (formRef.current && !isSubmitting) {
      setIsSubmitting(true);
      formRef.current.submit();
    }
  };

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
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F5F9F6]/95 backdrop-blur-xs p-4 font-sans text-[#10221A] overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-7 text-center border border-[#DCE9E1] flex flex-col items-center relative overflow-hidden">
        {/* Top Obsidian Emerald Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#009B70] via-[#00B98A] to-[#006C50]"></div>

        {/* Brand Header */}
        <div className="mb-5 flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#E0F7EC] border border-[#A7DDC0] flex items-center justify-center text-[#009B70] font-bold text-lg">
              🎓
            </div>
            <span className="text-2xl font-black tracking-tight text-[#10221A]">
              my<span className="text-[#009B70]">internships</span>.online
            </span>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#607469] font-semibold">
            PayU Official Payment Gateway
          </span>
        </div>

        {/* Animated Connecting Indicator */}
        <div className="relative w-16 h-16 mb-5">
          <div className="absolute inset-0 border-4 border-[#E0F7EC] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#009B70] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#009B70] font-bold text-sm">{countdown}s</span>
          </div>
        </div>

        <h1 className="text-lg font-bold text-[#10221A] mb-1">
          Redirecting to PayU Secure Gateway
        </h1>
        <p className="text-xs text-[#607469] mb-4">
          Opening 256-Bit Bank-Grade Portal (UPI, GPay, PhonePe, Cards, NetBanking)
        </p>

        {/* Order Details Pill */}
        <div className="bg-[#F5F9F6] border border-[#DCE9E1] rounded-2xl p-4 mb-5 text-left w-full space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#607469]">Candidate:</span>
            <span className="font-semibold text-[#10221A] truncate max-w-[180px]">{firstname}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#607469]">Plan:</span>
            <span className="font-semibold text-[#009B70] uppercase">{plan} Pass</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#607469]">Reference ID:</span>
            <span className="font-mono text-[11px] text-[#10221A]">#{txnid.slice(-12)}</span>
          </div>
          {isAdmin && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-2.5 py-1 rounded-lg font-medium flex items-center justify-between">
              <span>Admin Test Mode (littlecodr)</span>
              <span className="font-bold">₹1.00</span>
            </div>
          )}
          <div className="pt-2 border-t border-[#DCE9E1] flex justify-between items-center">
            <span className="text-xs font-bold text-[#10221A]">Total Payable:</span>
            <span className="font-bold text-[#009B70] text-base">₹{displayAmount}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={triggerSubmit}
          disabled={!payuParams || isSubmitting}
          className="w-full py-3.5 px-4 bg-[#009B70] hover:bg-[#008763] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <span>Connecting to Bank Gateway...</span>
          ) : (
            <span>Proceed to Pay ₹{displayAmount} Now →</span>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#899A90]">
          <svg className="w-3.5 h-3.5 text-[#009B70]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 10-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 10-1.42-1.41z" />
          </svg>
          <span>PayU 256-Bit SSL Encrypted Connection</span>
        </div>

        {/* Hidden Form targeting top window for seamless navigation */}
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
