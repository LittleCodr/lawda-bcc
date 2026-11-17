"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Package,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Gift,
  Mail,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

interface TrackedOrder {
  orderId: string;
  customerName: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ title: string; quantity: number; price: number; image?: string }>;
  total: number;
  paymentMethod: string;
  createdAt: string;
  courier: string;
  awb: string;
  status: string;
  stepIndex?: number;
  edd: string;
  trackingUrl?: string;
}

const SAMPLE_ORDERS = [
  { label: "ORD-1794674278670 (Black Aoud)", id: "ORD-1794674278670" },
  { label: "ORD-1793902511615 (Somersault)", id: "ORD-1793902511615" },
  { label: "ORD-1794670371488 (Maahir Legacy)", id: "ORD-1794670371488" },
  { label: "AWB: 7D141347842 (DTDC)", id: "7D141347842" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery =
    searchParams.get("orderId") || searchParams.get("awb") || searchParams.get("q") || "";

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedAwb, setCopiedAwb] = useState(false);

  const fetchTracking = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(searchVal.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Shipment not found. Please verify your reference number.");
        setOrder(null);
      } else {
        setOrder(data.order);
        setError(null);
      }
    } catch (err: any) {
      setError("Unable to connect to courier gateway. Please try again or email hurkinds@gmail.com.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) {
      toast.error("Please enter your Order ID or AWB Tracking Number");
      return;
    }
    router.push(`/track?orderId=${encodeURIComponent(queryInput.trim())}`);
    fetchTracking(queryInput.trim());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAwb(true);
    toast.success("AWB Number copied to clipboard!");
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  // Determine active step index (1-4)
  const getStepProgress = (ord: TrackedOrder) => {
    const s = ord.status.toLowerCase();
    if (s.includes("delivered")) return 4;
    if (s.includes("out for delivery")) return 3;
    if (s.includes("in transit") || s.includes("dispatched") || ord.awb) return 2;
    return 1;
  };

  const activeStep = order ? getStepProgress(order) : 1;

  const STEPS = [
    { title: "Order Confirmed", desc: "Payment verified & entered queue" },
    { title: "Packed & Sealed", desc: "Honeycomb wrapped & tamper sealed" },
    { title: "Dispatched", desc: "In transit with express air courier" },
    { title: "Delivered", desc: "Handed over at doorstep" },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141210] text-[#D4AF7A] text-[11px] font-bold uppercase tracking-[0.18em] mb-4 shadow-xs">
            <Truck size={13} />
            <span>Pan-India Live Dispatch Tracking</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#141210] tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-sm sm:text-base text-[#5C5954] mt-3 max-w-xl mx-auto leading-relaxed">
            Enter your Octopus Order Reference ID (e.g. <strong className="text-[#141210]">ORD-1793902511615</strong>) or Courier AWB Number to view real-time transit status and estimated delivery.
          </p>
        </div>

        {/* Search Input Card */}
        <div className="bg-white border border-[#E8E6E1] rounded-[16px] p-5 sm:p-7 shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A7953]"
              />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter Order ID (ORD-XXXXX) or AWB Tracking Number..."
                className="w-full pl-11 pr-4 py-3.5 rounded-[8px] border border-[#D4CFC7] bg-[#FAF9F6] focus:bg-white focus:border-[#9A7953] focus:outline-none text-sm text-[#141210] placeholder-[#888888] font-medium transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-luxury-primary px-8 py-3.5 text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Truck size={15} />
                  <span>Track Parcel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sample Links */}
          <div className="mt-4 pt-4 border-t border-[#F0EDE6] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777777] mr-1">
              Quick Test:
            </span>
            {SAMPLE_ORDERS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setQueryInput(sample.id);
                  router.push(`/track?orderId=${sample.id}`);
                  fetchTracking(sample.id);
                }}
                className="text-xs px-2.5 py-1 rounded bg-[#F7F6F3] hover:bg-[#EAE6DE] border border-[#E8E6E1] text-[#3E3C38] hover:text-[#141210] font-mono transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-[#FFF5F5] border border-[#FCD8D8] rounded-[12px] p-5 mb-8 flex items-start gap-3.5 text-[#B83232]">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">No Shipment Found</p>
              <p className="text-xs text-[#802020] leading-relaxed">{error}</p>
              <p className="text-xs text-[#802020] mt-2">
                Need help locating your parcel? Write to our concierge desk at{" "}
                <a href="mailto:hurkinds@gmail.com" className="font-semibold underline">
                  hurkinds@gmail.com
                </a>{" "}
                and we will verify within minutes.
              </p>
            </div>
          </div>
        )}

        {/* Live Tracking Result Card */}
        {order && (
          <div className="space-y-6">
            
            {/* Main Obsidian Status Header */}
            <div className="rounded-[16px] bg-[#141210] text-white p-6 sm:p-8 border-b-4 border-[#9A7953] shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF7A]">
                      Shipment Status
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#347A54]/30 border border-[#347A54] text-[#A6E3BE] text-xs font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      {order.status}
                    </span>
                  </div>
                  <h2 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {order.orderId}
                  </h2>
                  <p className="text-xs text-[#B8B2A8] mt-1">
                    Booked for: <strong className="text-white">{order.customerName}</strong> ·{" "}
                    Destination: <strong className="text-white">{order.city}, {order.state} ({order.pincode})</strong>
                  </p>
                </div>

                <div className="md:text-right bg-white/5 md:bg-transparent p-4 md:p-0 rounded-lg border md:border-0 border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8B2A8] block">
                    Estimated Delivery Date (EDD)
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF7A]">
                    {order.edd}
                  </span>
                  <span className="text-[11px] text-[#A0988C] block mt-0.5">
                    Express Air Pan-India Courier
                  </span>
                </div>
              </div>

              {/* Courier Partner & AWB Strip */}
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-[#888888] block text-[10px] uppercase tracking-wider">
                      Logistics Partner
                    </span>
                    <strong className="text-white text-sm">{order.courier}</strong>
                  </div>
                  <div className="h-7 w-[1px] bg-white/15 hidden sm:block" />
                  <div>
                    <span className="text-[#888888] block text-[10px] uppercase tracking-wider">
                      AWB Waybill Code
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-sm text-[#D4AF7A]">
                        {order.awb}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(order.awb)}
                        aria-label="Copy AWB Number"
                        className="p-1 rounded hover:bg-white/10 text-[#C8C2B8] hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedAwb ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#9A7953] hover:bg-[#856541] text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    <span>Track on Carrier Website</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* 4-Step Interactive Shipment Stepper */}
            <div className="bg-white border border-[#E8E6E1] rounded-[16px] p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7953] mb-6">
                Transit Milestones &amp; History
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                {STEPS.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = activeStep >= stepNum;
                  const isCurrent = activeStep === stepNum;

                  return (
                    <div key={step.title} className="relative flex sm:flex-col items-start gap-3 sm:gap-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isCompleted
                            ? "bg-[#141210] text-[#D4AF7A] border-2 border-[#9A7953]"
                            : "bg-[#F7F6F3] text-[#888888] border border-[#D4CFC7]"
                        }`}
                      >
                        {isCompleted ? <Check size={16} /> : stepNum}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold leading-tight ${
                            isCompleted ? "text-[#141210]" : "text-[#777777]"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-[#5C5954] mt-1 leading-snug">
                          {step.desc}
                        </p>
                        {isCurrent && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F5EFE6] text-[#9A7953] border border-[#D4AF7A]/30">
                            Current Stage
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Package Contents Card */}
            <div className="bg-white border border-[#E8E6E1] rounded-[16px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E6E1]">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7953]">
                  Package Contents ({order.items.length} items)
                </h3>
                <span className="text-xs text-[#777777] font-medium">
                  Total Value: <strong className="text-[#141210]">₹{order.total.toLocaleString("en-IN")}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={`${order.orderId}-item-${idx}`}
                    className="flex items-center gap-3.5 p-3 rounded-[8px] bg-[#FAF9F6] border border-[#E8E6E1]"
                  >
                    <div className="relative w-14 h-14 bg-white border border-[#E8E6E1] rounded-[6px] shrink-0 p-1 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#141210] line-clamp-1">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[#5C5954] mt-1">
                        <span>Quantity: <strong>{item.quantity}</strong></span>
                        <span className="font-bold text-[#141210]">
                          {item.price === 0 ? "FREE" : `₹${item.price.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complimentary Gift Assurance */}
              <div className="mt-4 p-3.5 rounded-[8px] bg-[#FAF7F2] border border-[#D4AF7A]/30 flex items-center gap-3">
                <Gift size={18} className="text-[#9A7953] shrink-0" />
                <p className="text-xs text-[#3E3C38] leading-relaxed">
                  <strong>Complimentary Gift Included:</strong> Every package is packed with an official 7ML Paradox EDP Pocket Tester and sealed in tamper-evident honeycomb protection.
                </p>
              </div>
            </div>

            {/* Help & Support Strip */}
            <div className="rounded-[12px] bg-[#FAF9F6] border border-[#E8E6E1] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center text-[#9A7953] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#141210]">
                    Need Expedited Delivery or Assistance?
                  </p>
                  <p className="text-xs text-[#5C5954] mt-0.5">
                    Our direct concierge desk is on standby:{" "}
                    <a href="mailto:hurkinds@gmail.com" className="font-semibold text-[#9A7953] underline">
                      hurkinds@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <Link
                href="/account?tab=orders"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[6px] border border-[#141210] text-[#141210] hover:bg-[#141210] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
              >
                <span>View Full Order History</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF9F6]">
          <Loader2 size={32} className="text-[#9A7953] animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
