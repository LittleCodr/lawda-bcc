"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  Loader2,
  Download,
  Gift,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { logAppEvent } from "@/lib/firebase";
import { useBlackFridayActive } from "@/lib/black-friday";
import {
  downloadOrderInvoicePDF,
  type InvoiceOrderInput,
  type InvoiceOrderItem,
  type InvoiceShippingDetails,
} from "@/lib/invoice";
import { formatPriceINR } from "@/lib/catalog-types";
import toast from "react-hot-toast";

interface VerifiedOrderDetails {
  orderId: string;
  payuTxnId?: string;
  bankRefNum?: string;
  amount: number;
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  deliveryMethod?: string;
  paymentMode?: string;
  createdAt?: string;
  confirmationEmailSent?: boolean;
  customer: InvoiceShippingDetails;
  items: InvoiceOrderItem[];
}

interface StoredSessionOrder {
  orderId?: string;
  total?: number;
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  deliveryMethod?: string;
  createdAt?: string;
  items?: InvoiceOrderItem[];
  shipping?: InvoiceShippingDetails;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("order_id") || searchParams.get("txnid") || "";
  const statusParam = searchParams.get("status")?.toLowerCase() || "";
  const payuidParam = searchParams.get("payuid") || searchParams.get("mihpayid") || "";
  const errorParam = searchParams.get("error") || "";

  const baseOrderIdMatch = rawOrderId.match(/(ORD-\d{13})/);
  const orderId = baseOrderIdMatch ? baseOrderIdMatch[1] : rawOrderId;

  const { clearCart } = useCartStore();
  const isBlackFriday = useBlackFridayActive();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderDetails, setOrderDetails] = useState<VerifiedOrderDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const isGatewayFailure =
    statusParam === "failed" ||
    statusParam === "failure" ||
    errorParam === "gateway_failed" ||
    errorParam === "payment_failed";

  useEffect(() => {
    if (isGatewayFailure) {
      return;
    }

    let effectiveOrderId = orderId;
    if (!effectiveOrderId && typeof window !== "undefined") {
      effectiveOrderId = sessionStorage.getItem("last_order_id") || "";
    }

    const verifyAndTrack = async () => {
      let cachedOrder: StoredSessionOrder | null = null;
      if (typeof window !== "undefined") {
        try {
          const raw = sessionStorage.getItem("last_order_data");
          if (raw) cachedOrder = JSON.parse(raw) as StoredSessionOrder;
        } catch {
          // Ignore malformed sessionStorage fallback
        }
      }

      try {
        if (effectiveOrderId) {
          const res = await fetch("/api/payu/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: rawOrderId || effectiveOrderId }),
          });
          const data = await res.json();

          if (data.success) {
            const transaction = (data.transaction || {}) as Record<string, string | undefined>;
            const order = (data.order || {}) as {
              total?: number;
              subtotal?: number;
              discountAmount?: number;
              shippingFee?: number;
              promoCode?: string | null;
              deliveryMethod?: string;
              bankRefNum?: string;
              confirmationEmailSent?: boolean;
              shippingDetails?: InvoiceShippingDetails;
              items?: InvoiceOrderItem[];
            };

            clearCart();

            const verifiedAmount = Number(transaction.amt || order.total || cachedOrder?.total || 0);
            const verifiedItems: InvoiceOrderItem[] =
              Array.isArray(order.items) && order.items.length > 0
                ? order.items
                : cachedOrder?.items || [];

            const verifiedCustomer: InvoiceShippingDetails = order.shippingDetails ||
              cachedOrder?.shipping || {
                name: transaction.firstname || "Valued Patron",
                email: transaction.email || "",
                phone: transaction.phone || "",
              };

            setOrderDetails({
              orderId: effectiveOrderId,
              payuTxnId: transaction.mihpayid || payuidParam || effectiveOrderId,
              bankRefNum: order.bankRefNum || transaction.bank_ref_num || undefined,
              amount: verifiedAmount,
              subtotal: order.subtotal ?? cachedOrder?.subtotal,
              discountAmount: order.discountAmount ?? cachedOrder?.discountAmount,
              shippingFee: order.shippingFee ?? cachedOrder?.shippingFee,
              promoCode: order.promoCode ?? cachedOrder?.promoCode ?? null,
              deliveryMethod: order.deliveryMethod ?? cachedOrder?.deliveryMethod,
              paymentMode: transaction.mode || "UPI / Prepaid",
              createdAt:
                cachedOrder?.createdAt ||
                new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              confirmationEmailSent: Boolean(order.confirmationEmailSent || verifiedCustomer.email),
              customer: verifiedCustomer,
              items: verifiedItems,
            });
            setStatus("success");

            if (typeof window !== "undefined") {
              const trackKey = `purchase_tracked_${effectiveOrderId}`;
              if (!sessionStorage.getItem(trackKey)) {
                sessionStorage.setItem(trackKey, "true");
                logAppEvent("purchase", {
                  transaction_id: effectiveOrderId,
                  value: verifiedAmount,
                  currency: "INR",
                  items: verifiedItems.map((i) => ({
                    item_id: i.id || "perfume",
                    item_name: i.title || "Signature Eau De Parfum",
                    quantity: i.quantity || 1,
                    price: i.price || verifiedAmount,
                  })),
                });
              }
            }
            return;
          }
        }

        // Gateway callback query success fallback
        if (statusParam === "success" || statusParam === "paid" || statusParam === "captured") {
          clearCart();
          const fallbackTotal = Number(cachedOrder?.total || 0);
          const fallbackItems = cachedOrder?.items || [];
          const resolvedOrderId = effectiveOrderId || cachedOrder?.orderId || `ORD-${Date.now()}`;

          setOrderDetails({
            orderId: resolvedOrderId,
            payuTxnId: payuidParam || "Captured",
            amount: fallbackTotal,
            subtotal: cachedOrder?.subtotal,
            discountAmount: cachedOrder?.discountAmount,
            shippingFee: cachedOrder?.shippingFee,
            promoCode: cachedOrder?.promoCode ?? null,
            deliveryMethod: cachedOrder?.deliveryMethod,
            paymentMode: "UPI / Prepaid",
            createdAt:
              cachedOrder?.createdAt ||
              new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            confirmationEmailSent: Boolean(cachedOrder?.shipping?.email),
            customer: cachedOrder?.shipping || { name: "Valued Patron" },
            items: fallbackItems,
          });
          setStatus("success");

          if (typeof window !== "undefined" && effectiveOrderId) {
            const trackKey = `purchase_tracked_${effectiveOrderId}`;
            if (!sessionStorage.getItem(trackKey)) {
              sessionStorage.setItem(trackKey, "true");
              logAppEvent("purchase", {
                transaction_id: effectiveOrderId,
                value: fallbackTotal,
                currency: "INR",
              });
            }
          }
          return;
        }

        setStatus("error");
      } catch (err) {
        console.error("Verification error:", err);
        if (statusParam === "success") {
          clearCart();
          setOrderDetails({
            orderId: effectiveOrderId || `ORD-${Date.now()}`,
            payuTxnId: payuidParam || "Confirmed",
            amount: Number(cachedOrder?.total || 0),
            paymentMode: "Prepaid Verified",
            customer: cachedOrder?.shipping || { name: "Valued Patron" },
            items: cachedOrder?.items || [],
          });
          setStatus("success");
        } else {
          setStatus("error");
        }
      }
    };

    verifyAndTrack();
  }, [orderId, rawOrderId, statusParam, payuidParam, isGatewayFailure, clearCart]);

  const effectiveStatus = isGatewayFailure ? "error" : status;

  const handleCopyId = () => {
    if (!orderDetails?.orderId) return;
    navigator.clipboard.writeText(orderDetails.orderId);
    setCopied(true);
    toast.success("Order reference copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = async () => {
    if (!orderDetails) return;
    setDownloadingInvoice(true);
    try {
      const payload: InvoiceOrderInput = {
        orderId: orderDetails.orderId,
        createdAt: orderDetails.createdAt,
        status: "Order Confirmed & Paid",
        paymentMode: orderDetails.paymentMode,
        transactionId: orderDetails.payuTxnId || orderDetails.orderId,
        deliveryMethod: orderDetails.deliveryMethod,
        total: orderDetails.amount,
        subtotal: orderDetails.subtotal,
        discountAmount: orderDetails.discountAmount,
        shippingFee: orderDetails.shippingFee,
        promoCode: orderDetails.promoCode,
        shippingDetails: orderDetails.customer,
        items: orderDetails.items,
      };
      await downloadOrderInvoicePDF(payload);
      toast.success("PDF invoice downloaded");
    } catch (err) {
      console.error("Invoice generation failed:", err);
      toast.error("Unable to generate PDF invoice right now");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (effectiveStatus === "loading") {
    return (
      <div className="min-h-[75vh] bg-[#F7F6F3] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center shadow-sm mb-5">
          <Loader2 size={28} className="text-[#9A7953] animate-spin" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A7953] mb-2">
          Octopus Perfumes
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424] text-center">
          Verifying your payment &amp; locking inventory
        </h1>
        <p className="text-sm text-[#5C5954] mt-2 text-center max-w-md">
          Please keep this window open while we confirm your transaction and dispatch your confirmation email.
        </p>
      </div>
    );
  }

  if (effectiveStatus === "error") {
    return (
      <div className="min-h-[75vh] bg-[#F7F6F3] flex items-center justify-center px-4 py-14">
        <div className="max-w-lg w-full bg-white rounded-[12px] border border-[#E8E6E1] p-8 sm:p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FFF5F5] border border-[#F2D0D0] flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={30} className="text-[#B83232]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9A7953] mb-2">
            Payment Incomplete
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424] mb-3">
            We couldn&apos;t confirm this payment
          </h1>
          <p className="text-sm text-[#5C5954] leading-relaxed mb-7">
            Your bag remains saved if checkout timed out or was cancelled. Any debited amount from an incomplete gateway session is automatically reversed by your bank within 3–5 business days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/checkout" className="btn-luxury-primary w-full sm:w-auto px-7 py-3.5 text-xs">
              Return to Checkout
            </Link>
            <Link href="/collections/all" className="btn-luxury-secondary w-full sm:w-auto px-7 py-3.5 text-xs">
              Explore Fragrances
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displaySubtotal =
    typeof orderDetails?.subtotal === "number" && orderDetails.subtotal > 0
      ? orderDetails.subtotal
      : (orderDetails?.items || []).reduce(
          (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
          0
        );
  const shippingFee =
    typeof orderDetails?.shippingFee === "number"
      ? orderDetails.shippingFee
      : orderDetails?.deliveryMethod === "international"
      ? 1500
      : 0;
  const computedDiscount =
    typeof orderDetails?.discountAmount === "number"
      ? orderDetails.discountAmount
      : Math.max(0, displaySubtotal + shippingFee - (orderDetails?.amount || 0));

  return (
    <div className="min-h-screen bg-[#F7F6F3] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Obsidian Confirmation Header Card */}
        <section className="rounded-[14px] overflow-hidden bg-[#141210] border border-[#2C2824] shadow-xl text-white">
          <div className="p-6 sm:p-10 relative">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF7A]">
                <CheckCircle2 size={14} className="text-[#69D195]" />
                <span>Payment Verified &amp; Reserved</span>
              </div>

              {isBlackFriday && (
                <div className="bf-badge-glow inline-flex items-center gap-1.5 rounded-full bg-[#1F1B16] border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D4AF7A]">
                  <Sparkles size={12} />
                  <span>Black Friday Reserve Dispatch</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF7A] font-semibold mb-2">
                  Thank you, {orderDetails?.customer?.name || "Valued Patron"}
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-white">
                  Your fragrance order is confirmed.
                </h1>
                <p className="text-sm text-[#C8C2B8] mt-3 max-w-xl leading-relaxed">
                  Our batch-verification team is preparing your sealed bottle(s) along with a complimentary 7ML Paradox discovery tester and cold-chain express packaging.
                </p>
              </div>

              <div className="md:col-span-4 md:text-right space-y-1">
                <span className="block text-[11px] uppercase tracking-[0.16em] text-[#9A7953] font-semibold">
                  Order Reference
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-2 font-mono text-sm sm:text-base font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-[6px] px-3 py-1.5 transition-colors cursor-pointer"
                >
                  <span>#{orderDetails?.orderId}</span>
                  {copied ? <Check size={14} className="text-[#69D195]" /> : <Copy size={14} className="text-[#D4AF7A]" />}
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-7 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#C8C2B8]">
                <Mail size={15} className="text-[#D4AF7A] shrink-0" />
                <span>
                  {orderDetails?.customer?.email
                    ? `Official confirmation sent to ${orderDetails.customer.email}`
                    : "Order receipt recorded in your account"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#9A7953] hover:bg-[#B28E66] text-[#141210] font-bold text-xs uppercase tracking-[0.14em] px-5 py-2.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                {downloadingInvoice ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                <span>{downloadingInvoice ? "Generating PDF..." : "Download PDF Invoice"}</span>
              </button>
            </div>
          </div>

          {/* Champagne Hairline */}
          <div className="h-1 bg-gradient-to-r from-[#9A7953] via-[#D4AF7A] to-[#9A7953]" />
        </section>

        {/* Fulfillment Progress Stepper */}
        <section className="bg-white rounded-[12px] border border-[#E8E6E1] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A7953]">
                Dispatch Timeline
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#242424]">
                What Happens Next
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#347A54] bg-[#EDF7F1] border border-[#C6E5D2] px-3 py-1 rounded-full">
              ETA: 2–4 Business Days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Order Confirmed",
                desc: "Payment verified and stock allocated.",
                icon: CheckCircle2,
                active: true,
              },
              {
                step: "02",
                title: "Batch & Seal Check",
                desc: "Cello seal & tester included.",
                icon: Package,
                active: false,
              },
              {
                step: "03",
                title: "Express Air Dispatch",
                desc: "AWB tracking sent via email & SMS.",
                icon: Truck,
                active: false,
              },
              {
                step: "04",
                title: "Insured Delivery",
                desc: "Delivered tamper-evident.",
                icon: ShieldCheck,
                active: false,
              },
            ].map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className={`p-4 rounded-[8px] border transition-colors ${
                    stage.active
                      ? "bg-[#F7F6F3] border-[#9A7953]"
                      : "bg-white border-[#E8E6E1]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A7953]">
                      Step {stage.step}
                    </span>
                    <Icon
                      size={16}
                      className={stage.active ? "text-[#347A54]" : "text-[#96928B]"}
                    />
                  </div>
                  <p className="text-sm font-semibold text-[#242424]">{stage.title}</p>
                  <p className="text-xs text-[#777777] mt-1 leading-relaxed">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Itemized Summary + Delivery Address */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 cols: Itemized Summary */}
          <section className="lg:col-span-7 bg-white rounded-[12px] border border-[#E8E6E1] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-4">
              <h2 className="font-serif text-xl font-semibold text-[#242424]">
                Items Reserved
              </h2>
              <span className="text-xs text-[#777777]">
                {orderDetails?.items?.length || 1}{" "}
                {(orderDetails?.items?.length || 1) === 1 ? "line item" : "line items"}
              </span>
            </div>

            <div className="divide-y divide-[#E8E6E1]">
              {orderDetails?.items && orderDetails.items.length > 0 ? (
                orderDetails.items.map((item, idx) => {
                  const qty = Number(item.quantity || 1);
                  const unitPrice = Number(item.price || 0);
                  return (
                    <div key={`${item.id || "item"}-${idx}`} className="py-3.5 first:pt-0 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#242424] leading-snug">
                          {item.title || "Signature Eau De Parfum"}
                        </p>
                        {item.variantTitle && item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-[#777777] mt-0.5">{item.variantTitle}</p>
                        )}
                        {item.customName && (
                          <p className="text-[11px] text-[#9A7953] mt-0.5">
                            Engraving: {item.customName}
                          </p>
                        )}
                        <p className="text-xs text-[#5C5954] mt-1">Qty: {qty}</p>
                      </div>
                      <p className="text-sm font-bold text-[#242424] tabular-nums shrink-0">
                        {unitPrice === 0 ? "FREE" : formatPriceINR(unitPrice * qty)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#242424]">Curated Fragrance Order</p>
                    <p className="text-xs text-[#777777]">Sealed retail bottle allocation</p>
                  </div>
                  <p className="text-sm font-bold text-[#242424] tabular-nums">
                    {formatPriceINR(orderDetails?.amount || 0)}
                  </p>
                </div>
              )}

              {/* Complimentary 7ML Paradox Row */}
              <div className="pt-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Gift size={16} className="text-[#9A7953] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#242424]">
                      Paradox 7ML Eau de Parfum Tester
                    </p>
                    <p className="text-[11px] text-[#9A7953]">Complimentary Discovery Vial</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#347A54] bg-[#EDF7F1] px-2.5 py-1 rounded-[4px]">
                  FREE
                </span>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 border-t border-[#E8E6E1] space-y-2 text-sm">
              {displaySubtotal > 0 && (
                <div className="flex justify-between text-[#5C5954]">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium">{formatPriceINR(displaySubtotal)}</span>
                </div>
              )}
              {computedDiscount > 0 && (
                <div className="flex justify-between text-[#347A54] font-semibold">
                  <span>
                    Savings{orderDetails?.promoCode ? ` (${orderDetails.promoCode})` : ""}
                  </span>
                  <span className="tabular-nums">−{formatPriceINR(computedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C5954]">
                <span>Insured Air Shipping</span>
                <span className="font-semibold text-[#347A54]">
                  {shippingFee > 0 ? formatPriceINR(shippingFee) : "FREE"}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E6E1]">
                <span className="font-semibold text-[#242424]">Total Paid</span>
                <span className="font-serif text-2xl font-semibold text-[#141210] tabular-nums">
                  {formatPriceINR(orderDetails?.amount || 0)}
                </span>
              </div>
            </div>
          </section>

          {/* Right 5 cols: Delivery & Transaction Card */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-[12px] border border-[#E8E6E1] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A7953]">
                <MapPin size={14} />
                <span>Shipping Destination</span>
              </div>
              <div className="text-sm text-[#242424] space-y-1">
                <p className="font-semibold">{orderDetails?.customer?.name || "Valued Patron"}</p>
                {orderDetails?.customer?.address && (
                  <p className="text-[#5C5954] leading-relaxed">{orderDetails.customer.address}</p>
                )}
                {(orderDetails?.customer?.city || orderDetails?.customer?.state || orderDetails?.customer?.zip) && (
                  <p className="text-[#5C5954]">
                    {[orderDetails.customer.city, orderDetails.customer.state, orderDetails.customer.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                {orderDetails?.customer?.phone && (
                  <p className="text-xs text-[#777777] pt-1">Phone: +91 {orderDetails.customer.phone}</p>
                )}
                {orderDetails?.customer?.email && (
                  <p className="text-xs text-[#777777]">Email: {orderDetails.customer.email}</p>
                )}
              </div>

              <div className="pt-4 border-t border-[#E8E6E1] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5C5954]">
                  <span>Payment Method</span>
                  <span className="font-semibold text-[#242424] uppercase">
                    {orderDetails?.paymentMode || "Prepaid"}
                  </span>
                </div>
                {orderDetails?.payuTxnId && (
                  <div className="flex justify-between text-[#5C5954]">
                    <span>Gateway Reference</span>
                    <span className="font-mono text-[#242424]">{orderDetails.payuTxnId}</span>
                  </div>
                )}
                {orderDetails?.bankRefNum && (
                  <div className="flex justify-between text-[#5C5954]">
                    <span>Bank Ref</span>
                    <span className="font-mono text-[#242424]">{orderDetails.bankRefNum}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E8E6E1] p-6 shadow-sm flex flex-col gap-3">
              <Link href="/account?tab=orders" className="btn-luxury-primary py-3.5 text-xs w-full">
                <span>View All Orders &amp; Track Shipment</span>
                <ArrowRight size={14} />
              </Link>
              <Link href="/collections/bestsellers" className="btn-luxury-secondary py-3 text-xs w-full">
                Continue Exploring Fragrances
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] bg-[#F7F6F3] flex items-center justify-center">
          <Loader2 size={28} className="text-[#9A7953] animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
