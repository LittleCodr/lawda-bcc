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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const finalTotal = totalPrice();
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
    
    setLoading(true);
    try {
      const orderId = `ORD-${Date.now()}`;
      
      // Write to Firestore (single batched write to minimize quota)
      await setDoc(doc(db, "users", user.uid, "orders", orderId), {
        orderId,
        userId: user.uid,
        status: "pending_payment",
        total: finalTotal,
        items,
        shippingDetails: formData,
        createdAt: new Date(),
      });

      // Fetch PayU Hash
      const cartSummary = items.map(i => `${i.title} (${i.quantity})`).join(", ");
      const hashRes = await fetch("/api/payu/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          cartSummary,
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
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="Jane Doe" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="jane@example.com" />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="Mobile Number" />
                </div>

                <div className="relative">
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Street Address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" placeholder="House/Flat No., Street" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="col-span-2 md:col-span-1 relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">State</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">ZIP Code</label>
                    <input required type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-stone-900 transition-colors text-sm" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-4 text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : (
                    <>
                      <Lock size={14} /> Complete Order
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
                  <span>Free</span>
                </div>
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-stone-200">
                  <span className="font-serif text-2xl text-stone-900">Total</span>
                  <span className="text-xl font-medium text-stone-900">₹{finalTotal}</span>
                </div>
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
