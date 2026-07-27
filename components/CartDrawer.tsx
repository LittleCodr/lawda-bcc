"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, Clock, Truck, Zap, ShieldCheck, Lock, Tag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/products";

const TIERS = [
  { threshold: 999, label: "Free Shipping", short: "Ship" },
  { threshold: 1499, label: "Free Gift", short: "Gift" },
  { threshold: 2499, label: "20% OFF (FREEDOM)", short: "20%" },
  { threshold: 3499, label: "25% OFF (FREEDOM)", short: "25%" },
];

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, compareSubtotal, total, discount, applyCoupon, removeCoupon, couponCode } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

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
  const currentTierIndex = TIERS.findLastIndex(t => subtotal >= t.threshold);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  const progress = nextTier ? Math.min((subtotal / nextTier.threshold) * 100, 100) : 100;
  const remaining = nextTier ? Math.max(nextTier.threshold - subtotal, 0) : 0;

  const [cartTimer, setCartTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setCartTimer(600);
      return;
    }
    const interval = setInterval(() => {
      setCartTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, items.length]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] h-full w-full sm:w-[420px] bg-paper flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-ink/10 shrink-0">
              <h2 className="font-serif-display text-xl uppercase tracking-wide">Your Bag</h2>
              <button onClick={closeCart} aria-label="Close cart" className="p-1">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {items.length > 0 && (
              <div className={`border-b px-6 py-2.5 flex items-center justify-center gap-2 ${cartTimer <= 120 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-rose-50 border-rose-100 text-rose-600"}`}>
                <Clock size={14} className={cartTimer <= 120 ? "text-red-600" : "text-rose-600"} />
                <p className={`text-[11px] font-medium tracking-wide uppercase ${cartTimer <= 120 ? "text-red-600 font-bold" : "text-rose-600"}`}>
                  High demand! Your items are reserved for {formatTimer(cartTimer)}
                </p>
              </div>
            )}

            <div className="px-6 py-4 border-b border-ink/10 shrink-0 bg-ink/5">
              {nextTier ? (
                <div className="bg-amber-100/50 border border-amber-300/50 p-2.5 rounded-lg mb-3 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-amber-400 h-full"></div>
                  <p className="text-[11px] text-amber-900 font-bold uppercase tracking-wide flex items-center gap-1.5 animate-pulse">
                    <Zap size={14} className="fill-amber-500 text-amber-500" /> 
                    ALMOST THERE! Add {formatINR(remaining)} more to get {nextTier.label}!
                  </p>
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mb-2">
                  <Zap size={14} className="fill-emerald-600" /> You've unlocked all rewards!
                </p>
              )}
              <div className="h-1.5 bg-ink/10 mt-2 overflow-hidden rounded-full relative">
                <div
                  className="h-full bg-ink transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[9px] uppercase tracking-wider text-muted font-medium">
                {TIERS.map((tier) => (
                  <span key={tier.threshold} className={subtotal >= tier.threshold ? "text-ink font-bold" : ""}>
                    {tier.short}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-16">
                  <p className="text-muted text-sm">Your bag is empty.</p>
                  <Link
                    href="/collections/all"
                    onClick={closeCart}
                    className="text-[11px] tracking-[0.2em] uppercase border border-ink px-5 py-2.5 hover:bg-ink hover:text-paper transition-colors"
                  >
                    Explore Fragrances
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.slug} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-white shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between">
                          <p className="font-serif-display text-lg">{item.name}</p>
                          <button onClick={() => removeItem(item.slug)} aria-label="Remove" className="text-muted hover:text-ink">
                            <X size={15} strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="text-sm mt-1">{item.price === 0 ? "FREE" : formatINR(item.price)}</p>
                        {item.price > 0 && (
                          <div className="mt-auto flex items-center gap-3 border border-ink/20 w-fit px-2 py-1">
                            <button onClick={() => setQuantity(item.slug, item.quantity - 1)} aria-label="Decrease">
                              <Minus size={13} strokeWidth={1.5} />
                            </button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <button onClick={() => setQuantity(item.slug, item.quantity + 1)} aria-label="Increase">
                              <Plus size={13} strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                        {item.price === 0 && (
                           <div className="mt-auto text-[10px] text-emerald-600 font-bold uppercase tracking-wide">
                             Gift Included
                           </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ink/10 shrink-0 bg-ink/5">
                {/* Coupon Code Section */}
                <div className="mb-5 border-b border-ink/10 pb-5">
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-sm">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Tag size={14} />
                        <span className="text-xs font-bold uppercase tracking-wide">{couponCode} APPLIED</span>
                      </div>
                      <button onClick={removeCoupon} className="text-emerald-700/60 hover:text-emerald-700">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 border border-ink/20 px-3 py-2 text-sm bg-paper focus:outline-none focus:border-ink uppercase placeholder:normal-case placeholder:text-muted"
                      />
                      <button type="submit" className="bg-ink text-paper px-4 text-[10px] tracking-widest uppercase hover:opacity-90">
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-red-600 text-[10px] mt-1">{couponError}</p>}
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm tracking-wide">Subtotal</span>
                    <span className="text-sm font-medium">{formatINR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-baseline justify-between text-emerald-600">
                      <span className="text-sm tracking-wide">Discount</span>
                      <span className="text-sm font-medium">-{formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between text-ink border-t border-ink/10 pt-2 mt-2">
                    <div className="flex flex-col">
                      <span className="text-sm tracking-wide font-bold">Total</span>
                      <span className="text-[10px] text-ink/60">(Inclusive of 18% GST)</span>
                    </div>
                    <span className="text-lg font-bold">{formatINR(total)}</span>
                  </div>
                </div>
                
                <Link href="/checkout" onClick={closeCart} className="block w-full bg-ink text-paper py-3.5 text-center text-[11px] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity mb-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)]">
                  Proceed to Checkout
                </Link>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-[9px] uppercase tracking-wider text-ink/60 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Lock size={12} /> Secure Checkout
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} /> 100% Genuine
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
