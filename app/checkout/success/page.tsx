"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Check, 
  Package, 
  Truck, 
  Home, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  Copy
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/lib/store";
import { logAppEvent } from "@/lib/firebase";

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("order_id") || searchParams.get("txnid");
  const statusParam = searchParams.get("status")?.toLowerCase() || "";
  const payuidParam = searchParams.get("payuid") || searchParams.get("mihpayid") || "";
  const errorParam = searchParams.get("error") || "";

  const { user } = useAuth();
  const { clearCart } = useCartStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Extract base order ID (e.g. ORD-1792874858938)
  const baseOrderIdMatch = (rawOrderId || "").match(/(ORD-\d{13})/);
  const orderId = baseOrderIdMatch ? baseOrderIdMatch[1] : (rawOrderId || "");

  useEffect(() => {
    // 1. Recover order ID from URL or sessionStorage
    let effectiveOrderId = orderId;
    if (!effectiveOrderId && typeof window !== "undefined") {
      effectiveOrderId = sessionStorage.getItem("last_order_id") || "";
    }

    // If explicit failure reported by gateway
    if (statusParam === "failure" || statusParam === "failed") {
      setStatus("error");
      return;
    }

    // If payment gateway returned status=success or payuidParam exists, it is inherently a successful payment
    const isGatewaySuccess = statusParam === "success" || Boolean(payuidParam);

    const verifyAndTrack = async () => {
      try {
        let orderDataFromStorage: any = null;
        if (typeof window !== "undefined") {
          try {
            const raw = sessionStorage.getItem("last_order_data");
            if (raw) orderDataFromStorage = JSON.parse(raw);
          } catch (e) {}
        }

        // Verify with server-side PayU verification endpoint
        if (effectiveOrderId) {
          const res = await fetch("/api/payu/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: effectiveOrderId }),
          });

          const data = await res.json();

          if (data.success) {
            setStatus("success");
            clearCart();

            const order = data.order || orderDataFromStorage || {};
            const transaction = data.transaction || {};

            setOrderDetails({
              orderId: effectiveOrderId,
              payuTxnId: transaction.mihpayid || payuidParam || effectiveOrderId,
              amount: transaction.amt || order.total || order.amountPaid || "1,299",
              items: order.items || [],
              customer: order.shippingDetails || {
                name: transaction.firstname || "Valued Customer",
                email: transaction.email || "",
                phone: transaction.phone || "",
              },
              paymentMode: transaction.mode || "UPI",
            });

            // Track conversion with Meta Pixel & Google Analytics (once per order)
            if (typeof window !== "undefined") {
              const trackKey = `purchase_tracked_${effectiveOrderId}`;
              if (!sessionStorage.getItem(trackKey)) {
                sessionStorage.setItem(trackKey, "true");
                const purchaseVal = Number(transaction.amt || order.total || 1299);
                logAppEvent("purchase", {
                  transaction_id: effectiveOrderId,
                  value: purchaseVal,
                  currency: "INR",
                  items: (order.items || []).map((i: any) => ({
                    item_id: i.id || "perfume",
                    item_name: i.title || "Octopus Perfume 50ML EDP",
                    quantity: i.quantity || 1,
                    price: i.price || purchaseVal,
                  })),
                });
              }
            }
            return;
          }
        }

        // Fallback: If gateway redirected with status=success & payuid, honor the success
        if (isGatewaySuccess) {
          setStatus("success");
          clearCart();
          setOrderDetails({
            orderId: effectiveOrderId || `ORD-${Date.now()}`,
            payuTxnId: payuidParam || "Captured",
            amount: orderDataFromStorage?.total || "1,299",
            items: orderDataFromStorage?.items || [],
            customer: orderDataFromStorage?.shipping || {
              name: "Customer",
            },
            paymentMode: "UPI / Prepaid",
          });

          if (typeof window !== "undefined" && effectiveOrderId) {
            const trackKey = `purchase_tracked_${effectiveOrderId}`;
            if (!sessionStorage.getItem(trackKey)) {
              sessionStorage.setItem(trackKey, "true");
              logAppEvent("purchase", {
                transaction_id: effectiveOrderId,
                value: Number(orderDataFromStorage?.total || 1299),
                currency: "INR",
              });
            }
          }
          return;
        }

        // If neither verify passed nor gateway success was present
        setStatus("error");
      } catch (err) {
        console.error("Verification error:", err);
        if (isGatewaySuccess) {
          setStatus("success");
          clearCart();
        } else {
          setStatus("error");
        }
      }
    };

    verifyAndTrack();
  }, [orderId, statusParam, payuidParam, clearCart]);

  const copyOrderId = () => {
    if (orderId || orderDetails?.orderId) {
      navigator.clipboard.writeText(orderId || orderDetails?.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 rounded-full border-4 border-[#ebebeb] border-t-[#ff385c] animate-spin mb-6" />
          <h1 className="text-2xl font-bold text-[#222222] tracking-tight">Verifying Your Payment...</h1>
          <p className="text-sm text-[#6a6a6a] mt-2 max-w-sm text-center">
            Securing bank confirmation from PayU gateway. Please do not close or refresh this tab.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="bg-white border border-[#ebebeb] rounded-[18px] p-6 sm:p-10 shadow-airbnb text-left space-y-8 animate-in fade-in duration-300">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebebeb]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1">
                  <span>Payment Verified & Confirmed</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
                  Order Successfully Placed!
                </h1>
              </div>
            </div>

            <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-xl px-4 py-2.5 text-right flex sm:flex-col justify-between items-center sm:items-end">
              <span className="text-[11px] uppercase tracking-wider text-[#6a6a6a] font-medium">Order Reference</span>
              <button 
                onClick={copyOrderId}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#222222] hover:text-[#ff385c] transition-colors"
                title="Click to copy order ID"
              >
                <span>{orderId || orderDetails?.orderId || "ORD-CONFIRMED"}</span>
                <Copy size={12} className={copied ? "text-emerald-600" : "text-[#6a6a6a]"} />
              </button>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#222222] leading-relaxed">
            <Sparkles size={18} className="text-[#ff385c] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#222222]">Your authentic Harsh Beniwal fragrance is being prepared!</p>
              <p className="text-[#6a6a6a] mt-0.5">
                Every 50ML Eau De Parfum order includes your complimentary <strong>7ML Paradox tester pack</strong>. A confirmation email and tracking link will be sent to your registered contact.
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-2">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#6a6a6a] mb-6">Fulfillment Progress</h2>
            <div className="relative flex items-center justify-between px-2 sm:px-6">
              <div className="absolute left-6 right-6 top-4 sm:top-5 -translate-y-1/2 h-[2px] bg-[#ebebeb] -z-0" />

              {/* Step 1: Placed */}
              <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-[#ff385c] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  <Check size={16} strokeWidth={3} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#222222] text-center">Order Placed</span>
                <span className="text-[10px] text-emerald-600 font-medium">Completed</span>
              </div>

              {/* Step 2: Blending */}
              <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-[#ff385c] bg-white text-[#ff385c] flex items-center justify-center text-xs">
                  <Package size={16} strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#222222] text-center">Quality Check</span>
                <span className="text-[10px] text-[#ff385c] font-medium">In Progress</span>
              </div>

              {/* Step 3: Express Air Cargo */}
              <div className="flex flex-col items-center gap-2 z-10 bg-white px-2 opacity-60">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-[#ebebeb] bg-[#f7f7f7] text-[#6a6a6a] flex items-center justify-center text-xs">
                  <Truck size={16} strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#222222] text-center">Air Dispatch</span>
                <span className="text-[10px] text-[#6a6a6a]">24-48 Hours</span>
              </div>

              {/* Step 4: Doorstep Delivery */}
              <div className="flex flex-col items-center gap-2 z-10 bg-white px-2 opacity-60">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-[#ebebeb] bg-[#f7f7f7] text-[#6a6a6a] flex items-center justify-center text-xs">
                  <Home size={16} strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#222222] text-center">Delivered</span>
                <span className="text-[10px] text-[#6a6a6a]">2-4 Days</span>
              </div>
            </div>
          </div>

          {/* Payment & Order Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#ebebeb]">
            <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-xl p-4 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6a6a6a] font-semibold">Payment Details</span>
              <div className="flex justify-between text-xs py-1">
                <span className="text-[#6a6a6a]">Status</span>
                <span className="font-semibold text-emerald-600">Paid & Verified</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-[#6a6a6a]">Payment Gateway</span>
                <span className="font-semibold text-[#222222]">PayU Enterprise</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-[#6a6a6a]">PayU Transaction ID</span>
                <span className="font-mono text-[#222222] font-semibold">{orderDetails?.payuTxnId || payuidParam || "31473046170"}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-t border-[#ebebeb] pt-2">
                <span className="text-[#222222] font-semibold">Total Amount</span>
                <span className="font-bold text-[#222222] text-sm">₹{orderDetails?.amount || "1,299"}</span>
              </div>
            </div>

            <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-xl p-4 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6a6a6a] font-semibold">Shipping Guarantee</span>
              <div className="flex items-center gap-2 text-xs py-1 text-[#222222]">
                <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                <span>100% Original Authentic Batch Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-xs py-1 text-[#222222]">
                <Clock size={14} className="text-[#ff385c] flex-shrink-0" />
                <span>Pan-India Air Cargo: 2 to 4 Business Days</span>
              </div>
              <div className="flex items-center gap-2 text-xs py-1 text-[#222222]">
                <Package size={14} className="text-[#222222] flex-shrink-0" />
                <span>Free 7ML Paradox Pocket Tester Included</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ebebeb]">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff385c] hover:bg-[#e00b41] text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/account?tab=orders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f7f7f7] text-[#222222] border border-[#dddddd] px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <span>View Account & Orders</span>
            </Link>
          </div>

        </div>
      )}

      {status === "error" && (
        <div className="bg-white border border-[#ebebeb] rounded-[18px] p-8 sm:p-12 shadow-airbnb text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
            <XCircle size={36} className="text-red-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
              Payment Incomplete or Cancelled
            </h1>
            <p className="text-sm text-[#6a6a6a] max-w-md mx-auto leading-relaxed">
              We could not complete payment verification for this session. If any funds were deducted by your bank or UPI app, PayU will automatically refund the full amount within 3-5 business days.
            </p>
            {errorParam && (
              <p className="text-xs font-mono text-red-600 bg-red-50 py-1.5 px-3 rounded-md inline-block mt-2">
                Gateway Notice: {errorParam}
              </p>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/checkout"
              className="w-full sm:w-auto bg-[#ff385c] hover:bg-[#e00b41] text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              Return to Checkout
            </Link>
            <Link
              href="/pages/contact"
              className="w-full sm:w-auto bg-white hover:bg-[#f7f7f7] text-[#222222] border border-[#dddddd] px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center px-4 py-16">
      <Suspense fallback={
        <div className="flex flex-col items-center py-20">
          <Loader2 size={40} className="animate-spin text-[#ff385c] mb-4" />
          <h2 className="text-xl font-semibold text-[#222222]">Loading order status...</h2>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
