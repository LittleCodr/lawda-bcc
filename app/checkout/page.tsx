"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, CheckCircle2, Sparkles, Clock } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { logAppEvent, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, autoDiscountAmount: getAutoDiscountAmount, autoDiscountPercentage: getAutoDiscountPercentage } = useCartStore();
  const { user, loading: authLoading, loginAnonymously } = useAuth();
  const router = useRouter();

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
  const promoDiscountAmount = promoApplied 
    ? (["DIWALI20", "OCTOPUS20"].includes(promoCode.trim().toUpperCase()) ? Math.floor(baseTotal * 0.20) : Math.floor(baseTotal * 0.15)) 
    : 0;
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
  }, [formData.zip]);

  useEffect(() => {
    if (items.length > 0 && !loggedBeginCheckout.current) {
      logAppEvent("begin_checkout", {
        currency: "INR",
        value: finalTotal,
        items: allDisplayItems.map((i: any) => ({
          item_id: i.id,
          item_name: i.title,
          quantity: i.quantity,
          price: i.price,
          item_variant: i.variantTitle
        }))
      });
      loggedBeginCheckout.current = true;
    }
  }, [items, finalTotal]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-[#E5B8B7] border-t-[#800020] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
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
    let { name, value } = e.target;
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
    if (!user) return;

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
      logAppEvent("add_payment_info", {
        currency: "INR",
        value: finalTotal,
        payment_type: paymentMethod,
        items: allDisplayItems.map((i: any) => ({
          item_id: i.id,
          item_name: i.title,
          quantity: i.quantity,
          price: i.price,
        }))
      });

      const orderId = `ORD-${Date.now()}`;
      const payUAmount = isAdmin ? 1 : finalTotal;
      const orderTotal = finalTotal;

      // Associate email to anonymous account
      await setDoc(doc(db, "users", user.uid), {
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

      const orderPayload = {
        orderId,
        userId: user.uid,
        status: "pending_payment",
        total: orderTotal,
        amountPaid: 0,
        codBalance: 0,
        paymentMethod: "prepaid",
        deliveryMethod: deliveryMethod,
        items: JSON.parse(JSON.stringify(allDisplayItems)),
        shippingDetails: formData,
        promoCode: promoApplied ? promoCode : null,
        discountAmount: totalDiscount,
        abandonedEmailSent: false,
        createdAt: new Date(),
      };

      // Write to both root orders collection and user orders subcollection
      await Promise.all([
        setDoc(doc(db, "orders", orderId), orderPayload),
        setDoc(doc(db, "users", user.uid, "orders", orderId), orderPayload),
      ]);

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("last_order_id", orderId);
          sessionStorage.setItem("last_order_data", JSON.stringify({
            orderId,
            items: allDisplayItems,
            total: finalTotal,
            shipping: formData
          }));
        } catch (e) {}
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
          userId: user.uid,
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

    } catch (error: any) {
      console.error("Error creating order:", error);
      logAppEvent("payment_error", {
        reason: error.message || "Unknown error generating hash"
      });
      toast.error("There was an issue processing your order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Main Content Area */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 border border-stone-200">
              <h2 className="font-serif text-3xl mb-10 text-stone-900">Shipping Details</h2>

              <form onSubmit={handlePayment} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Full Name</label>
                    <input required minLength={3} type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="Priya Sharma" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Email Address</label>
                    <input required type="email" pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$" title="Please enter a valid email address (e.g. name@domain.com)" name="email" value={formData.email} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="priya@example.com" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Phone Number</label>
                  <input required type="tel" pattern="\d{10}" maxLength={10} title="Please enter a valid 10-digit mobile number" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="10-digit Mobile Number" />
                </div>

                <div className="relative">
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Street Address</label>
                  <input required minLength={5} type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="House/Flat No., Street" />
                </div>

                <div className="relative">
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Country</label>
                  <select name="country" value={formData.country} onChange={(e) => {
                    handleChange(e);
                    if (e.target.value !== "India") {
                      setDeliveryMethod("international");
                    } else {
                      setDeliveryMethod("standard");
                    }
                  }} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm">
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

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="relative order-1 md:order-1">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">ZIP Code</label>
                    <div className="relative">
                      {formData.country === "India" ? (
                        <input required type="text" pattern="\d{6}" maxLength={6} title="Please enter a valid 6-digit PIN code" name="zip" value={formData.zip} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="6-digit PIN" />
                      ) : (
                        <input required type="text" minLength={3} name="zip" value={formData.zip} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="ZIP / Postal Code" />
                      )}
                      {fetchingPin && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#E5B8B7] border-t-[#800020] rounded-full animate-spin"></div>}
                    </div>
                  </div>
                  <div className="relative order-2 md:order-2">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">City</label>
                    <input required minLength={2} type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent text-stone-900 focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="Enter City" />
                  </div>
                  <div className="relative order-3 md:order-3">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">State</label>
                    <input required minLength={2} type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent text-stone-900 focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="Enter State" />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ebebeb]">
                  <h3 className="text-[18px] font-semibold mb-4 text-[#222222]">Delivery Method</h3>
                  <div className="space-y-3">
                    {formData.country === "India" ? (
                      <label className="flex items-center gap-4 p-4 border rounded-[10px] cursor-pointer transition-colors border-[#222222] bg-[#f7f7f7]">
                        <input type="radio" name="delivery" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="w-4 h-4 accent-[#ff385c] cursor-pointer" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#222222]">Free Express Pan-India Delivery</span>
                          <span className="text-xs text-[#6a6a6a]">2-4 business days with real-time tracking</span>
                        </div>
                      </label>
                    ) : (
                      <label className={`flex items-center gap-4 p-4 border rounded-[10px] cursor-pointer transition-colors ${deliveryMethod === 'international' ? 'border-[#222222] bg-[#f7f7f7]' : 'border-[#ebebeb] hover:border-[#222222]'}`}>
                        <input type="radio" name="delivery" value="international" checked={deliveryMethod === 'international'} onChange={() => setDeliveryMethod('international')} className="w-4 h-4 accent-[#ff385c] cursor-pointer" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#222222]">International Delivery (+₹1500)</span>
                          <span className="text-xs text-[#6a6a6a]">Within 7 days worldwide</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ebebeb]">
                  <h3 className="text-[18px] font-semibold mb-4 text-[#222222]">Payment Method</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 border rounded-[10px] border-[#222222] bg-[#f7f7f7]">
                      <input type="radio" name="payment" value="prepaid" checked readOnly className="w-4 h-4 accent-[#ff385c]" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-[#222222]">100% Secure Online Payment (Prepaid)</span>
                        <span className="text-xs text-[#6a6a6a]">Instant checkout via UPI (Google Pay, PhonePe, Paytm), Cards & Netbanking.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ff385c] hover:bg-[#e00b41] text-white py-4 rounded-lg text-[15px] font-medium transition-colors disabled:bg-[#ffd1da] mt-6 flex items-center justify-center gap-2 cursor-pointer shadow-none"
                >
                  {loading ? "Processing..." : (
                    <>
                      <Lock size={16} /> Pay ₹{finalTotal} Securely
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
                {allDisplayItems.map((item: any) => (
                  <li key={item.cartItemId || `${item.id}-${item.variantId}`} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-stone-50 shrink-0 border border-stone-100">
                      <Image src={item.image || "/logo.png"} alt={item.title} fill unoptimized sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-serif text-lg leading-tight text-stone-900 mb-0.5">{item.title}</p>
                      {!item.isFree && (
                        <p className="text-[9px] uppercase tracking-widest text-amber-800 font-bold mb-1">25%+ French Oil EDP • 12H Longevity</p>
                      )}
                      {item.variantTitle && (
                        <p className="text-xs text-stone-500">{item.variantTitle}</p>
                      )}

                      {/* Personalization Details Summary */}
                      {(item.customName || item.customPhotoUrl || item.isGift) && (
                        <div className="mt-1 flex flex-col gap-0.5">
                          {item.customName && <p className="text-[10px] text-stone-500 uppercase tracking-widest">Engraving: {item.customName}</p>}
                          {item.customPhotoUrl && <p className="text-[10px] text-stone-500 uppercase tracking-widest">Photo Included</p>}
                          {item.isGift && !item.isFree && <p className="text-[10px] text-[#800020] font-bold uppercase tracking-widest">Premium Gift</p>}
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
                        const valid15 = ["DIWALI15", "FESTIVE15", "OCTOPUS15", "WELCOME15"];
                        const valid20 = ["DIWALI20", "OCTOPUS20"];
                        if (valid15.includes(cleanCode) || valid20.includes(cleanCode)) {
                          if (baseTotal <= 499) {
                            setPromoError("This promo code is only valid on orders above ₹499.");
                            return;
                          }
                          setPromoCode(cleanCode);
                          setPromoApplied(true);
                          setPromoError("");
                        } else {
                          setPromoError("Invalid promo code. Use DIWALI15 for 15% OFF or DIWALI20.");
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
                      className="bg-[#fff0f3] text-[#ff385c] border border-[#ffd1da] rounded-lg px-6 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {promoError && <p className="text-[#c13515] font-semibold text-xs mt-2">{promoError}</p>}
                {promoApplied && (
                  <p className="text-emerald-700 font-bold text-xs mt-2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
                    <CheckCircle2 size={14} className="text-emerald-600" /> 
                    <span>{promoCode === "DIWALI20" ? "🪔 Diwali Festive 20% OFF Applied!" : "Promo code applied successfully!"}</span>
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-stone-200 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{baseTotal}</span>
                </div>
                {cartAutoDiscount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-emerald-600">
                    <span>Auto Discount ({cartDiscountPercent}%)</span>
                    <span>-₹{cartAutoDiscount}</span>
                  </div>
                )}
                {promoApplied && (
                  <div className="flex justify-between text-sm font-bold text-emerald-600">
                    <span>Promo Discount ({promoCode})</span>
                    <span>-₹{promoDiscountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span>{deliveryMethod === 'international' ? '₹1500' : 'Free Express'}</span>
                </div>
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-stone-200">
                  <span className="font-serif text-2xl text-stone-900">Total</span>
                  <span className="text-xl font-medium text-stone-900">₹{finalTotal}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex justify-center gap-6 border-t border-stone-100 pt-8 text-stone-400">
                <div className="flex flex-col items-center gap-2 text-center">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] uppercase tracking-widest font-medium">100% Secure<br />Checkout</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center text-[#800020]">
                  <Sparkles size={20} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">25%+ French<br />EDP Oils</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center text-stone-700">
                  <Clock size={20} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">12+ Hour<br />Longevity</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <CheckCircle2 size={20} />
                  <span className="text-[10px] uppercase tracking-widest font-medium">Authentic<br />Guarantee</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
