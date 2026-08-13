"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { logAppEvent, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "premium">("standard");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const baseTotal = totalPrice();
  const deliveryFee = deliveryMethod === "premium" ? 300 : 0;
  const isAdmin = user?.email && ["littlecodr@gmail.com", "srijanrai966@gmail.com"].includes(user.email.toLowerCase());
  const finalTotal = isAdmin ? 1 : baseTotal + deliveryFee;
  const loggedBeginCheckout = useRef(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (items.length > 0 && !loggedBeginCheckout.current) {
      logAppEvent("begin_checkout", {
        currency: "INR",
        value: finalTotal,
        items: items.map((i) => ({ 
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Additional JS Validation
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(formData.zip.trim())) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);
    try {
      const orderId = `ORD-${Date.now()}`;
      
      const isCOD = paymentMethod === "cod";
      const payUAmount = isAdmin ? 1 : (isCOD ? 100 : finalTotal);
      const orderTotal = isCOD ? finalTotal + (isAdmin ? 0 : 100) : finalTotal;
      const codBalance = isCOD ? finalTotal : 0;
      
      // Write to Firestore (single batched write to minimize quota)
      await setDoc(doc(db, "users", user.uid, "orders", orderId), {
        orderId,
        userId: user.uid,
        status: isCOD ? "pending_cod_advance" : "pending_payment",
        total: orderTotal,
        amountPaid: 0,
        codBalance: codBalance,
        paymentMethod: paymentMethod,
        deliveryMethod: deliveryMethod,
        items: JSON.parse(JSON.stringify(items)),
        shippingDetails: formData,
        createdAt: new Date(),
      });

      // Fetch PayU Hash
      const cartSummary = items.map(i => `${i.title} (${i.quantity})`).join(", ");
      const hashRes = await fetch("/api/payu/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payUAmount,
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          cartSummary: isCOD ? `COD Advance: ${cartSummary}` : cartSummary,
        }),
      });

      const hashData = await hashRes.json();
      if (hashData.error) {
        throw new Error(hashData.error);
      }

      // Log Purchase Event
      logAppEvent("purchase", {
        transaction_id: orderId,
        currency: "INR",
        value: finalTotal,
        items: items.map((i) => ({ 
          item_id: i.id, 
          item_name: i.title, 
          quantity: i.quantity,
          price: i.price,
          item_variant: i.variantTitle
        }))
      });

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
      
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an issue processing your order. Please try again.");
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
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="priya@example.com" />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Phone Number</label>
                  <input required type="tel" pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="10-digit Mobile Number" />
                </div>

                <div className="relative">
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Street Address</label>
                  <input required minLength={5} type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="House/Flat No., Street" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="col-span-2 md:col-span-1 relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">City</label>
                    <input required minLength={2} type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="City" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">State</label>
                    <input required minLength={2} type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="State" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">ZIP Code</label>
                    <input required type="text" pattern="[0-9]{6}" title="Please enter a valid 6-digit PIN code" name="zip" value={formData.zip} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="6-digit PIN" />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="font-serif text-2xl mb-6 text-stone-900">Delivery Method</h3>
                  <div className="space-y-4">
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-[#800020] bg-[#FDF8F5]' : 'border-stone-200 hover:border-[#800020]'}`}>
                      <input type="radio" name="delivery" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="w-4 h-4 text-[#800020] focus:ring-[#800020] cursor-pointer" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-stone-900">Standard Delivery (Free)</span>
                        <span className="text-xs text-stone-500">2-5 business days</span>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${deliveryMethod === 'premium' ? 'border-[#800020] bg-[#FDF8F5]' : 'border-stone-200 hover:border-[#800020]'}`}>
                      <input type="radio" name="delivery" value="premium" checked={deliveryMethod === 'premium'} onChange={() => setDeliveryMethod('premium')} className="w-4 h-4 text-[#800020] focus:ring-[#800020] cursor-pointer" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-stone-900">Premium Delivery by Air (+₹300)</span>
                        <span className="text-xs text-stone-500">2 day delivery</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="font-serif text-2xl mb-6 text-stone-900">Payment Method</h3>
                  <div className="space-y-4">
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'prepaid' ? 'border-[#800020] bg-[#FDF8F5]' : 'border-stone-200 hover:border-[#800020]'}`}>
                      <input type="radio" name="payment" value="prepaid" checked={paymentMethod === 'prepaid'} onChange={() => setPaymentMethod('prepaid')} className="w-4 h-4 text-[#800020] focus:ring-[#800020] cursor-pointer" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-stone-900">Pay in Full (Recommended)</span>
                        <span className="text-xs text-stone-500">Pay securely via UPI, Cards, or Netbanking.</span>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#800020] bg-[#FDF8F5]' : 'border-stone-200 hover:border-[#800020]'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#800020] focus:ring-[#800020] cursor-pointer" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-stone-900">Cash on Delivery (₹100 Fee)</span>
                        <span className="text-xs text-stone-500">Pay ₹100 securely now as advance, pay the rest on delivery.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#800020] text-white py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#600018] transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? "Processing..." : (
                    <>
                      <Lock size={14} /> {paymentMethod === 'cod' ? 'Pay ₹100 Advance' : `Pay ₹${finalTotal}`}
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
                {items.map((item) => (
                  <li key={item.cartItemId || `${item.id}-${item.variantId}`} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-stone-50 shrink-0 border border-stone-100">
                      <Image src={item.image || "/logo.png"} alt={item.title} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-serif text-lg leading-tight text-stone-900">{item.title}</p>
                      {item.variantTitle && (
                        <p className="text-xs text-stone-500 mt-1">{item.variantTitle}</p>
                      )}
                      
                      {/* Personalization Details Summary */}
                      {(item.customName || item.customPhotoUrl || item.isGift) && (
                        <div className="mt-1 flex flex-col gap-0.5">
                           {item.customName && <p className="text-[10px] text-stone-500 uppercase tracking-widest">Engraving: {item.customName}</p>}
                           {item.customPhotoUrl && <p className="text-[10px] text-stone-500 uppercase tracking-widest">Photo Included</p>}
                           {item.isGift && <p className="text-[10px] text-[#800020] font-bold uppercase tracking-widest">Premium Gift</p>}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-medium text-stone-700">₹{item.price}</p>
                        <p className="text-xs text-stone-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="border-t border-stone-200 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{finalTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span>{deliveryMethod === 'premium' ? '₹300' : 'Free'}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm text-[#800020] font-bold">
                    <span>COD Fee</span>
                    <span>+₹100</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-stone-200">
                  <span className="font-serif text-2xl text-stone-900">Total</span>
                  <span className="text-xl font-medium text-stone-900">₹{paymentMethod === 'cod' ? finalTotal + 100 : finalTotal}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between items-end pt-2 text-sm">
                    <span className="font-bold text-stone-600 uppercase tracking-widest text-[10px]">To Pay Now</span>
                    <span className="font-bold text-[#800020]">₹100</span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex justify-center gap-8 border-t border-stone-100 pt-8 text-stone-400">
                <div className="flex flex-col items-center gap-2 text-center">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] uppercase tracking-widest font-medium">Secure<br/>Checkout</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <CheckCircle2 size={20} />
                  <span className="text-[10px] uppercase tracking-widest font-medium">Quality<br/>Guarantee</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
