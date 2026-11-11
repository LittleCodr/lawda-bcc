"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, CheckCircle2, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { logAppEvent, db, auth } from "@/lib/firebase";
import { trackEcommerceEvent } from "@/lib/analytics";
import { doc, setDoc } from "firebase/firestore";

const emptySub = () => () => {};

interface DisplayCheckoutItem {
  id: string;
  cartItemId?: string;
  title: string;
  price: number;
  image: string;
  variantId?: string;
  variantTitle?: string;
  customName?: string;
  customPhotoUrl?: string;
  customFont?: string;
  isGift?: boolean;
  isFree?: boolean;
  quantity: number;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, autoDiscountAmount: getAutoDiscountAmount, autoDiscountPercentage: getAutoDiscountPercentage } = useCartStore();
  const { user, loading: authLoading, loginAnonymously } = useAuth();
  const router = useRouter();
  const mounted = useSyncExternalStore(emptySub, () => true, () => false);

  const freeTesterGift = items.length > 0 ? [
    {
      id: "free-tester-paradox",
      cartItemId: "free-tester-paradox",
      title: "FREE 7ML Paradox EDP Tester Pack",
      price: 0,
      image: "/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png",
      variantTitle: "Harsh Beniwal 7ML Luxury Pocket Tester (Worth ₹399)",
      isGift: false,
      isFree: true,
      quantity: 1
    }
  ] : [];
  
  const allDisplayItems = [...items, ...freeTesterGift];


  const [loading, setLoading] = useState(false);
  const [paymentMethod] = useState<"prepaid">("prepaid");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "international">("standard");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [fetchingPin, setFetchingPin] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const baseTotal = totalPrice();
  const cartAutoDiscount = getAutoDiscountAmount ? getAutoDiscountAmount() : 0;
  const cartDiscountPercent = getAutoDiscountPercentage ? getAutoDiscountPercentage() : 0;
  const deliveryFee = deliveryMethod === "international" ? 1500 : 0;
  const promoDiscountAmount =
    promoApplied && baseTotal >= 5000 ? Math.floor(baseTotal * 0.05) : 0;
  const totalDiscount = cartAutoDiscount + promoDiscountAmount;
  const isAdmin = user?.email && ["littlecodr@gmail.com", "srijanrai966@gmail.com", "coderdracwound@gmail.com"].includes(user.email.toLowerCase());
  const finalTotal = isAdmin ? 1 : Math.max(0, baseTotal - totalDiscount + deliveryFee);
  const loggedBeginCheckout = useRef(false);

  useEffect(() => {
    if (!authLoading && !user) {
      loginAnonymously().catch(console.error);
    }
  }, [user, authLoading, loginAnonymously]);

  useEffect(() => {
    if (formData.country === "India" && formData.zip.length === 6) {
      const fetchPinDetails = async () => {
        setFetchingPin(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.zip}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: po.District || po.Block || po.Region,
              state: po.State
            }));
          }
        } catch (e) {
          console.error("Error fetching PIN code", e);
        } finally {
          setFetchingPin(false);
        }
      };
      fetchPinDetails();
    }
  }, [formData.zip, formData.country]);

  useEffect(() => {
    if (items.length > 0 && !loggedBeginCheckout.current) {
      trackEcommerceEvent("begin_checkout", {
        currency: "INR",
        value: finalTotal,
        items: (allDisplayItems as DisplayCheckoutItem[]).map((i) => ({
          item_id: i.id,
          item_name: i.title,
          quantity: i.quantity,
          price: i.price,
          item_variant: i.variantTitle,
        })),
      });
      loggedBeginCheckout.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, finalTotal]);

  if (mounted && items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center bg-stone-50 min-h-screen">
        <h1 className="font-serif text-4xl mb-6 text-stone-900">Your Cart is Empty</h1>
        <p className="text-stone-500 mb-10">Add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push("/collections/all")}
          className="bg-stone-900 text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    let value = e.target.value;
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    if (name === "zip") {
      value = value.replace(/\D/g, "").slice(0, 6);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Additional JS Validation
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(formData.zip.trim())) {
      toast.error("Please enter a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);
    try {
      let activeUser = user || auth.currentUser;
      if (!activeUser) {
        try {
          await loginAnonymously();
          activeUser = auth.currentUser;
        } catch (authErr) {
          console.warn("Silent anonymous login fallback:", authErr);
        }
      }
      const activeUserId = activeUser?.uid || `guest_${Date.now()}`;

      trackEcommerceEvent("add_shipping_info", {
        value: finalTotal,
        shipping_tier: deliveryMethod === "international" ? "International" : "Free Express India",
        items: (allDisplayItems as DisplayCheckoutItem[]).map((i) => ({
          item_id: i.id,
          item_name: i.title,
          quantity: i.quantity,
          price: i.price,
          item_variant: i.variantTitle,
        })),
      });
      trackEcommerceEvent("add_payment_info", {
        value: finalTotal,
        payment_type: paymentMethod,
        items: (allDisplayItems as DisplayCheckoutItem[]).map((i) => ({
          item_id: i.id,
          item_name: i.title,
          quantity: i.quantity,
          price: i.price,
          item_variant: i.variantTitle,
        })),
      });

      const orderId = `ORD-${Date.now()}`;
      const payUAmount = isAdmin ? 1 : finalTotal;
      const orderTotal = finalTotal;

      if (activeUser?.uid) {
        // Associate email to anonymous account
        try {
          await setDoc(doc(db, "users", activeUser.uid), {
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            address: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
            },
            updatedAt: new Date()
          }, { merge: true });
        } catch (e) {
          console.warn("Could not sync user profile:", e);
        }
      }

      const orderPayload = {
        orderId,
        userId: activeUserId,
        status: "pending_payment",
        total: orderTotal,
        subtotal: baseTotal,
        amountPaid: 0,
        codBalance: 0,
        paymentMethod: "prepaid",
        deliveryMethod: deliveryMethod,
        shippingFee: deliveryFee,
        items: JSON.parse(JSON.stringify(allDisplayItems)),
        shippingDetails: formData,
        promoCode: promoApplied ? promoCode : null,
        promoDiscount: promoDiscountAmount,
        autoDiscount: cartAutoDiscount,
        discountAmount: totalDiscount,
        confirmationEmailSent: false,
        abandonedEmailSent: false,
        createdAt: new Date(),
      };

      // Write to both root orders collection and user orders subcollection
      const orderPromises = [setDoc(doc(db, "orders", orderId), orderPayload)];
      if (activeUser?.uid) {
        orderPromises.push(setDoc(doc(db, "users", activeUser.uid, "orders", orderId), orderPayload));
      }
      await Promise.all(orderPromises);

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("last_order_id", orderId);
          sessionStorage.setItem("last_order_data", JSON.stringify({
            orderId,
            items: allDisplayItems,
            total: finalTotal,
            subtotal: baseTotal,
            discountAmount: totalDiscount,
            promoCode: promoApplied ? promoCode : null,
            shippingFee: deliveryFee,
            deliveryMethod,
            shipping: formData,
            createdAt: new Date().toISOString(),
          }));
        } catch {
          // Ignore storage fallback error
        }
      }

      // Fetch PayU Hash with userId in udf2
      const cartSummary = items.map(i => `${i.title} (${i.quantity})`).join(", ");
      const hashRes = await fetch("/api/payu/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnid: orderId,
          amount: payUAmount,
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          firstname: formData.name,
          productinfo: cartSummary,
          cartSummary: cartSummary,
          userId: activeUserId,
        }),
      });

      const hashData = await hashRes.json();
      if (hashData.error) {
        throw new Error(hashData.error);
      }

      clearCart();

      // Submit PayU form programmatically
      const form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action", hashData.action);

      Object.keys(hashData).forEach((key) => {
        if (key !== "action") {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", hashData[key]);
          form.appendChild(hiddenField);
        }
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error: unknown) {
      console.error("Error creating order:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error generating hash";
      logAppEvent("payment_error", {
        reason: errMsg
      });
      toast.error("There was an issue processing your order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Main Content Area */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 border border-[#E8E6E1] rounded-[12px] shadow-luxury">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
                Step 1 of 1 · Express Checkout
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-8 text-[#242424]">
                Shipping Details
              </h1>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="checkout-name" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="checkout-name"
                      required
                      minLength={3}
                      autoComplete="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="fc-input px-3.5 py-2.5 text-sm"
                      placeholder="Priya Sharma"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-email" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="checkout-email"
                      required
                      autoComplete="email"
                      type="email"
                      pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                      title="Please enter a valid email address (e.g. name@domain.com)"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="fc-input px-3.5 py-2.5 text-sm"
                      placeholder="priya@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-0.5">
                    Mobile Number *
                  </label>
                  <p className="text-[11px] text-[#777777] mb-1.5">
                    10-digit Indian mobile number for courier SMS &amp; tracking updates
                  </p>
                  <input
                    id="checkout-phone"
                    required
                    autoComplete="tel"
                    type="tel"
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    title="Please enter a valid 10-digit mobile number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="fc-input px-3.5 py-2.5 text-sm"
                    placeholder="98XXXXXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-address" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                    Street Address *
                  </label>
                  <input
                    id="checkout-address"
                    required
                    minLength={5}
                    autoComplete="street-address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="fc-input px-3.5 py-2.5 text-sm"
                    placeholder="House/Flat No., Building, Street, Landmark"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-country" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                    Country
                  </label>
                  <select
                    id="checkout-country"
                    autoComplete="country-name"
                    name="country"
                    value={formData.country}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value !== "India") {
                        setDeliveryMethod("international");
                      } else {
                        setDeliveryMethod("standard");
                      }
                    }}
                    className="fc-input px-3.5 py-2.5 text-sm"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="checkout-zip" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                      {formData.country === "India" ? "6-Digit PIN Code *" : "Postal / ZIP Code *"}
                    </label>
                    <div className="relative">
                      {formData.country === "India" ? (
                        <input
                          id="checkout-zip"
                          required
                          autoComplete="postal-code"
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                          title="Please enter a valid 6-digit PIN code"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          className="fc-input px-3.5 py-2.5 text-sm"
                          placeholder="110001"
                        />
                      ) : (
                        <input
                          id="checkout-zip"
                          required
                          autoComplete="postal-code"
                          type="text"
                          minLength={3}
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          className="fc-input px-3.5 py-2.5 text-sm"
                          placeholder="ZIP / Postal Code"
                        />
                      )}
                      {fetchingPin && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#D4CFC7] border-t-[#1F1D1B] rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="checkout-city" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                      City *
                    </label>
                    <input
                      id="checkout-city"
                      required
                      minLength={2}
                      autoComplete="address-level2"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="fc-input px-3.5 py-2.5 text-sm"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-state" className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                      State *
                    </label>
                    <input
                      id="checkout-state"
                      required
                      minLength={2}
                      autoComplete="address-level1"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="fc-input px-3.5 py-2.5 text-sm"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="pt-5 border-t border-[#E8E6E1]">
                  <h2 className="font-serif text-2xl font-semibold mb-3 text-[#242424]">
                    Delivery Method
                  </h2>
                  <div className="space-y-3">
                    {formData.country === "India" ? (
                      <label className="flex items-center gap-4 p-4 border rounded-[8px] cursor-pointer transition-colors border-[#1F1D1B] bg-[#F7F6F3]">
                        <input type="radio" name="delivery" value="standard" checked={deliveryMethod === "standard"} onChange={() => setDeliveryMethod("standard")} className="w-4 h-4 accent-[#1F1D1B] cursor-pointer" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#242424]">Free Express Pan-India Delivery</span>
                          <span className="text-xs text-[#5C5954]">2–5 business days with protective honeycomb packing &amp; tracking</span>
                        </div>
                      </label>
                    ) : (
                      <label className={`flex items-center gap-4 p-4 border rounded-[8px] cursor-pointer transition-colors ${deliveryMethod === "international" ? "border-[#1F1D1B] bg-[#F7F6F3]" : "border-[#E8E6E1] hover:border-[#1F1D1B]"}`}>
                        <input type="radio" name="delivery" value="international" checked={deliveryMethod === "international"} onChange={() => setDeliveryMethod("international")} className="w-4 h-4 accent-[#1F1D1B] cursor-pointer" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#242424]">International Insured Delivery (+₹1,500)</span>
                          <span className="text-xs text-[#5C5954]">7–10 business days worldwide</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-[#E8E6E1]">
                  <h2 className="font-serif text-2xl font-semibold mb-3 text-[#242424]">
                    Payment Method
                  </h2>
                  <div className="flex items-center gap-4 p-4 border rounded-[8px] border-[#1F1D1B] bg-[#F7F6F3]">
                    <input type="radio" name="payment" value="prepaid" checked readOnly className="w-4 h-4 accent-[#1F1D1B]" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-[#242424]">100% Secure Online Payment (Prepaid)</span>
                      <span className="text-xs text-[#5C5954]">Instant checkout via UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking via PayU.</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-luxury-primary py-4 text-xs tracking-[0.16em] disabled:opacity-50 mt-4"
                >
                  {loading ? "Processing Secure Gateway..." : (
                    <>
                      <Lock size={15} /> Pay ₹{finalTotal.toLocaleString("en-IN")} Securely
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-stone-200 sticky top-32">
              <h2 className="font-serif text-2xl mb-8 text-stone-900">Order Summary</h2>

              {/* Items List */}
              <ul className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-stone-200">
                {(allDisplayItems as DisplayCheckoutItem[]).map((item) => (
                  <li key={item.cartItemId || `${item.id}-${item.variantId}`} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-stone-50 shrink-0 border border-stone-100">
                      <Image src={item.image || "/logo.png"} alt={item.title} fill unoptimized sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-serif text-lg leading-tight text-stone-900 mb-0.5">{item.title}</p>
                      {!item.isFree && (
                        <p className="text-[10px] uppercase tracking-widest text-[#9A7953] font-semibold mb-1">Authentic Sealed Fragrance</p>
                      )}
                      {item.variantTitle && (
                        <p className="text-xs text-stone-500">{item.variantTitle}</p>
                      )}

                      {/* Personalization Details Summary */}
                      {(item.customName || item.customPhotoUrl || item.isGift) && (
                        <div className="mt-1 flex flex-col gap-0.5">
                          {item.customName && <p className="text-[10px] text-stone-500 uppercase tracking-widest">Engraving: {item.customName}</p>}
                          {item.customPhotoUrl && <p className="text-[10px] text-stone-500 uppercase tracking-widest">Photo Included</p>}
                          {item.isGift && !item.isFree && <p className="text-[10px] text-[#9A7953] font-bold uppercase tracking-widest">Premium Gift</p>}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        {item.isFree ? (
                          <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                            FREE
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-stone-700">₹{item.price}</p>
                        )}
                        <p className="text-xs text-stone-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    disabled={promoApplied}
                    placeholder="Enter code"
                    className="w-full border border-stone-300 rounded-xl px-4 py-2.5 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-sm font-bold uppercase shadow-sm"
                  />
                  {!promoApplied ? (
                    <button
                      type="button"
                      onClick={() => {
                        const cleanCode = promoCode.trim().toUpperCase();
                        if (["OCTOPUS5", "LUXURY5"].includes(cleanCode)) {
                          if (baseTotal < 5000) {
                            const shortfall = (5000 - baseTotal).toLocaleString("en-IN");
                            setPromoError(`Minimum order of ₹5,000 required for ${cleanCode}. Add ₹${shortfall} more to unlock 5% OFF.`);
                            return;
                          }
                          setPromoCode(cleanCode);
                          setPromoApplied(true);
                          setPromoError("");
                        } else {
                          setPromoError("Invalid or expired coupon. Use OCTOPUS5 for 5% OFF on orders of ₹5,000+.");
                        }
                      }}
                      className="bg-[#222222] hover:bg-black text-white rounded-lg px-6 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPromoApplied(false);
                        setPromoCode("");
                      }}
                      className="bg-[#FFF5F5] text-[#B83232] border border-[#E8C5C5] rounded-[6px] px-5 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {promoError && <p className="text-[#B83232] font-semibold text-xs mt-2">{promoError}</p>}
                {promoApplied && (
                  <p className="text-[#347A54] font-semibold text-xs mt-2 flex items-center gap-1.5 bg-[#F2F8F5] border border-[#CBE4D7] px-3 py-1.5 rounded-[6px] w-fit">
                    <CheckCircle2 size={14} className="text-[#347A54]" />
                    <span>{baseTotal >= 5000 ? "5% OFF Promo Applied!" : "Apply ₹5,000+ total to activate 5% OFF"}</span>
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-[#E8E6E1] pt-6 space-y-3">
                <div className="flex justify-between text-sm text-[#5C5954]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{baseTotal.toLocaleString("en-IN")}</span>
                </div>
                {cartAutoDiscount > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-[#347A54]">
                    <span>Auto Bundle ({cartDiscountPercent}%)</span>
                    <span className="tabular-nums">−₹{cartAutoDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {promoApplied && (
                  <div className="flex justify-between text-sm font-semibold text-[#347A54]">
                    <span>Promo ({promoCode})</span>
                    <span className="tabular-nums">−₹{promoDiscountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-[#5C5954]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#242424]">{deliveryMethod === "international" ? "₹1,500" : "Free Express"}</span>
                </div>
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-[#E8E6E1]">
                  <span className="font-serif text-2xl text-[#242424]">Total</span>
                  <span className="text-2xl font-bold text-[#242424] tabular-nums">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#E8E6E1] pt-6 text-[#5C5954]">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <ShieldCheck size={18} className="text-[#347A54]" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">100% Genuine<br />Sealed</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Sparkles size={18} className="text-[#9A7953]" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">7ML Bonus<br />Tester Free</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <CheckCircle2 size={18} className="text-[#242424]" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Encrypted<br />PayU Gateway</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
