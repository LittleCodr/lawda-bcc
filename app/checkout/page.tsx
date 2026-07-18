"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Tag, X, Loader2, AlertCircle, User, Mail, Phone, MapPin, Building, Map, CheckCircle2, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatINR } from "@/lib/products";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const { items, subtotal, discount, applyCoupon, removeCoupon, couponCode } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Delivery, 2 = Payment
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (!success) {
      setCouponError("Invalid promo code");
    } else {
      setCouponError("");
      setCouponInput("");
    }
  };

  // Redirect to home if cart is empty, wait for mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [deliveryRange, setDeliveryRange] = useState("");

  useEffect(() => {
    setMounted(true);
    // Calculate delivery range (3-5 days from today)
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 5);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    setDeliveryRange(`${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`);
  }, []);

  // Auth guard: redirect to sign in if not logged in
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/auth?redirect=/checkout");
    }
  }, [mounted, authLoading, user, router]);

  // Pre-fill email from auth
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || "" }));
    }
    if (user?.displayName) {
      setFormData((prev) => ({ ...prev, name: user.displayName || "" }));
    }
  }, [user]);

  if (!mounted || authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted text-sm">Redirecting to sign in...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-serif-display text-4xl mb-4">Your Bag is Empty</h1>
        <p className="text-muted mb-8">Add items to your bag before proceeding to checkout.</p>
        <button
          onClick={() => router.push("/collections/all")}
          className="border border-ink px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-ink hover:text-paper transition-colors"
        >
          Explore Fragrances
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      showToast("Please enter a valid 10-digit Indian phone number.", "error");
      return;
    }
    setStep(2);
  };

  const shipping = subtotal >= 999 ? 0 : 99;
  let finalTotal = subtotal - discount + shipping;
  
  if (user?.email === "littlecodr@gmail.com") {
    finalTotal = 1; // test environment bypass
  }

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Get hash from backend
      const res = await fetch("/api/payu/hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: finalTotal, 
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          userId: user.uid,
          items,
          shipping: formData,
          discount,
          couponCode,
          subtotal
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate payment hash");
      }

      // 2. Log order to Firestore
      try {
        const orderId = data.txnid;
        const orderData = {
          items: items.map((item) => ({
            slug: item.slug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          total: finalTotal,
          discount,
          couponCode,
          subtotal,
          shipping: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
          status: "Processing",
          createdAt: serverTimestamp(),
        };

        const orderDoc = doc(db, "users", user.uid, "orders", orderId);
        await setDoc(orderDoc, orderData);

        const userDoc = doc(db, "users", user.uid);
        await setDoc(
          userDoc,
          {
            email: user.email || formData.email,
            displayName: user.displayName || formData.name,
            phone: formData.phone,
            lastOrderAt: serverTimestamp(),
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
          { merge: true }
        );
      } catch (firestoreError) {
        console.error("Firestore logging error:", firestoreError);
      }

      // 3. Initiate PayU Checkout via form post
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.action;

      const params: Record<string, string> = {
        key: data.key,
        txnid: data.txnid,
        amount: data.amount,
        productinfo: data.productinfo,
        firstname: data.firstname,
        email: data.email,
        phone: data.phone,
        surl: data.surl,
        furl: data.furl,
        hash: data.hash,
      };

      for (const key in params) {
        const hiddenField = document.createElement("input");
        hiddenField.type = "hidden";
        hiddenField.name = key;
        hiddenField.value = params[key];
        form.appendChild(hiddenField);
      }

      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Something went wrong with checkout. Please try again.", "error");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-8 left-1/2 z-50 flex items-center gap-3 px-6 py-4 shadow-2xl border ${
              toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            {toast.type === "error" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-[1200px] px-5 py-12 md:py-20 relative">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex flex-col items-center \${step >= 1 ? 'text-ink' : 'text-muted'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 \${step >= 1 ? 'border-ink bg-ink text-paper' : 'border-ink/20'}`}>
                1
              </div>
              <span className="text-[10px] uppercase tracking-widest mt-2 font-medium">Delivery</span>
            </div>
            <div className={`w-16 h-[2px] mb-6 \${step === 2 ? 'bg-ink' : 'bg-ink/10'}`}></div>
            <div className={`flex flex-col items-center \${step === 2 ? 'text-ink' : 'text-muted'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 \${step === 2 ? 'border-ink bg-ink text-paper' : 'border-ink/20'}`}>
                2
              </div>
              <span className="text-[10px] uppercase tracking-widest mt-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content Area */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white/40 p-6 md:p-10 border border-ink/10 relative overflow-hidden">
                    <h2 className="font-serif-display text-2xl mb-8">Delivery Details</h2>
                    
                    <form onSubmit={handleContinueToPayment} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-medium">Full Name</label>
                          <div className="relative">
                            <User size={16} className="absolute left-0 bottom-3 text-ink/40" />
                            <input required type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border-b border-ink/20 py-2.5 pl-8 bg-transparent focus:outline-none focus:border-ink transition-colors placeholder:text-ink/20 text-sm" placeholder="John Doe" />
                          </div>
                        </div>
                        <div className="relative">
                          <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-medium">Email Address</label>
                          <div className="relative">
                            <Mail size={16} className="absolute left-0 bottom-3 text-ink/40" />
                            <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-b border-ink/20 py-2.5 pl-8 bg-transparent focus:outline-none focus:border-ink transition-colors placeholder:text-ink/20 text-sm" placeholder="john@example.com" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-medium">Phone Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-0 bottom-3 text-ink/40" />
                          <input required type="tel" id="phone" name="phone" maxLength={10} value={formData.phone} onChange={handleChange} className="w-full border-b border-ink/20 py-2.5 pl-8 bg-transparent focus:outline-none focus:border-ink transition-colors placeholder:text-ink/20 text-sm" placeholder="10-digit mobile number" />
                        </div>
                        <p className="text-[10px] text-muted mt-1.5">For delivery updates and OTPs.</p>
                      </div>

                      <div className="relative">
                        <label htmlFor="address" className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-medium">Street Address</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-0 bottom-3 text-ink/40" />
                          <input required type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full border-b border-ink/20 py-2.5 pl-8 bg-transparent focus:outline-none focus:border-ink transition-colors placeholder:text-ink/20 text-sm" placeholder="House/Flat No., Building Name, Street" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="col-span-2 md:col-span-1 relative">
                          <label htmlFor="city" className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-medium">City</label>
                          <div className="relative">
                            <Building size={16} className="absolute left-0 bottom-3 text-ink/40" />
                            <input required type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full border-b border-ink/20 py-2.5 pl-8 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm" />
                          </div>
                        </div>
                        <div className="relative">
                          <label htmlFor="state" className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-medium">State</label>
                          <div className="relative">
                            <Map size={16} className="absolute left-0 bottom-3 text-ink/40" />
                            <input required type="text" id="state" name="state" value={formData.state} onChange={handleChange} className="w-full border-b border-ink/20 py-2.5 pl-8 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm" />
                          </div>
                        </div>
                        <div className="relative">
                          <label htmlFor="zip" className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-medium">PIN Code</label>
                          <div className="relative">
                            <MapPin size={16} className="absolute left-0 bottom-3 text-ink/40" />
                            <input required type="text" id="zip" name="zip" maxLength={6} value={formData.zip} onChange={handleChange} className="w-full border-b border-ink/20 py-2.5 pl-8 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="relative mt-10 w-full bg-ink text-paper py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-ink/90 transition-colors shadow-lg flex items-center justify-center group"
                      >
                        Continue to Payment
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white/40 p-6 md:p-10 border border-ink/10">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/10">
                      <h2 className="font-serif-display text-2xl">Payment & Review</h2>
                      <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest font-medium underline underline-offset-4 text-muted hover:text-ink">
                        Edit Details
                      </button>
                    </div>

                    {/* Shipping Block */}
                    <div className="mb-10 bg-gradient-to-br from-paper to-paper/50 p-6 border border-ink/10 shadow-sm relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-ink/5 rotate-12">
                        <Truck size={120} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <Truck size={18} className="text-ink" /> 
                          <span className="font-medium text-[10px] uppercase tracking-widest">Shipping Method</span>
                        </div>
                        <p className="font-serif-display text-lg mb-1">Standard Delivery</p>
                        <p className="text-sm text-ink/80 flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Expected between <strong className="font-medium text-ink">{deliveryRange}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 bg-paper p-5 border border-ink/10 text-sm text-ink/80">
                      <p><span className="font-medium text-ink w-20 inline-block">Deliver to:</span> {formData.name}</p>
                      <p><span className="font-medium text-ink w-20 inline-block">Address:</span> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                      <p><span className="font-medium text-ink w-20 inline-block">Contact:</span> {formData.phone} | {formData.email}</p>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="relative w-full bg-ink text-paper py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-ink/90 transition-all disabled:opacity-80 shadow-lg flex items-center justify-center min-h-[54px] hover:shadow-xl"
                    >
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Loader2 size={20} className="opacity-70" />
                        </motion.div>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock size={14} /> Complete Purchase — {formatINR(finalTotal)}
                        </span>
                      )}
                    </button>

                    {/* Trust Badges */}
                    <div className="mt-6 flex flex-wrap justify-center gap-6 border-t border-ink/10 pt-6">
                      <div className="flex flex-col items-center gap-2 text-center text-ink/60">
                        <ShieldCheck size={20} className="text-ink" />
                        <span className="text-[9px] uppercase tracking-widest font-medium">100% Secure<br/>Payments</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-center text-ink/60">
                        <Lock size={20} className="text-ink" />
                        <span className="text-[9px] uppercase tracking-widest font-medium">SSL Encrypted<br/>Checkout</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-center text-ink/60">
                        <CheckCircle2 size={20} className="text-ink" />
                        <span className="text-[9px] uppercase tracking-widest font-medium">Genuine<br/>Products</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white/60 p-6 md:p-8 border border-ink/10 sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="font-serif-display text-xl mb-6">Order Summary</h2>

              {/* Coupon Code Section */}
              <div className="mb-6 pb-6 border-b border-ink/10">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-200/60 px-4 py-3">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Tag size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{couponCode} APPLIED</span>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-emerald-700/60 hover:text-emerald-700 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 border border-ink/20 px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:border-ink uppercase placeholder:normal-case placeholder:text-muted transition-colors"
                    />
                    <button type="submit" className="bg-ink text-paper px-5 text-[10px] tracking-widest uppercase hover:bg-ink/90 transition-colors">
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-red-600 text-xs mt-2">{couponError}</p>}
              </div>

              {/* Items List */}
              <ul className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-ink/10">
                {items.map((item) => (
                  <li key={item.slug} className="flex gap-4 group">
                    <div className="relative w-16 h-20 bg-paper shrink-0 border border-ink/5 group-hover:border-ink/20 transition-colors">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-2" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <p className="font-serif-display text-base leading-tight pr-4">{item.name}</p>
                        <p className="text-sm font-medium">{formatINR(item.price)}</p>
                      </div>
                      <p className="text-xs text-muted mt-1.5 uppercase tracking-wider">Qty: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="border-t border-ink/10 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
                </div>
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-ink/10">
                  <div className="flex flex-col">
                    <span className="text-xl font-serif-display">Total</span>
                    <span className="text-[9px] text-muted uppercase tracking-widest mt-1">Includes 18% GST</span>
                  </div>
                  <span className="text-xl font-medium">{formatINR(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
