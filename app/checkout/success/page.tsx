"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/store";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { user } = useAuth();
  const { clearCart } = useCartStore();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  
  useEffect(() => {
    if (!orderId || !user) {
      if (!user) return; // Wait for user to load
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/payu/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        
        const data = await res.json();
        
        if (data.success) {
          // Extract original base order ID in case PayU appends a suffix (e.g. ORD-1234567890123-1)
          const baseOrderIdMatch = orderId.match(/(ORD-\d{13})/);
          const baseOrderId = baseOrderIdMatch ? baseOrderIdMatch[1] : orderId;

          // Update Firestore
          const orderDoc = doc(db, "users", user.uid, "orders", baseOrderId);
          await updateDoc(orderDoc, { status: "Paid", payuTxnId: orderId });
          setStatus("success");
          clearCart();
        } else {
          // Payment failed
          const baseOrderIdMatch = orderId.match(/(ORD-\d{13})/);
          const baseOrderId = baseOrderIdMatch ? baseOrderIdMatch[1] : orderId;
          const orderDoc = doc(db, "users", user.uid, "orders", baseOrderId);
          await updateDoc(orderDoc, { status: "Failed", payuTxnId: orderId });
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [orderId, user]);

  return (
    <>
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-ink mb-4" />
          <h1 className="font-serif-display text-4xl mb-4">Verifying Payment...</h1>
        </div>
      )}

      {status === "success" && (
        <>
          <CheckCircle size={48} className="text-green-600 mb-4" strokeWidth={1.5} />
          <h1 className="font-serif-display text-4xl md:text-5xl mb-4">Thank You!</h1>
          <p className="text-muted max-w-md mx-auto mb-4 leading-relaxed">
            Your payment was successful and your order has been placed! We've sent a detailed confirmation email to your inbox.
          </p>
          <p className="text-muted max-w-md mx-auto mb-10 text-sm">
            You can track your order status anytime by visiting the{" "}
            <Link href="/account?tab=orders" className="underline text-ink font-medium">Orders</Link> tab in your account section.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/account?tab=orders"
              className="border border-ink px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-ink hover:text-paper transition-colors"
            >
              View Orders
            </Link>
            <Link 
              href="/"
              className="bg-ink text-paper px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
            >
              Return to Home
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle size={48} className="text-red-600 mb-4" strokeWidth={1.5} />
          <h1 className="font-serif-display text-4xl md:text-5xl mb-4">Payment Failed</h1>
          <p className="text-muted max-w-md mx-auto mb-4 leading-relaxed">
            We could not verify your payment. If money was deducted, it will be automatically refunded within 5-7 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link 
              href="/checkout"
              className="bg-ink text-paper px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
            >
              Try Again
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
      <Image src="/logo.png" alt="Octopus" width={56} height={56} className="mb-6" />
      <Suspense fallback={
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-ink mb-4" />
          <h1 className="font-serif-display text-4xl mb-4">Loading...</h1>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
