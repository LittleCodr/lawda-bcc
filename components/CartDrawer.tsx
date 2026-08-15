"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, Lock, ShieldCheck, Gift, Clock, Gem } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems, autoDiscountPercentage, autoDiscountAmount, discountedTotal } = useCartStore();

  const closeCart = () => setIsOpen(false);

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const itemCount = totalItems ? totalItems() : 0;
  const progressPercent = itemCount >= 3 ? 100 : itemCount === 2 ? 66 : itemCount === 1 ? 33 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] h-full w-full sm:w-[440px] bg-[#FDF8F5] flex flex-col shadow-2xl border-l border-[#E5B8B7]/30"
          >
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#E5B8B7]/30 shrink-0 bg-white/50 backdrop-blur-md">
              <h2 className="font-serif text-2xl uppercase tracking-widest text-[#800020]">Your Cart</h2>
              <button onClick={closeCart} aria-label="Close cart" className="p-1 text-[#2d2d2d] hover:text-[#800020] transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Timer & Gamification Bar */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-white shrink-0 border-b border-[#E5B8B7]/30 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-orange-600 flex items-center gap-1"><Clock size={14} /> Cart Reserved For</span>
                  <span className="text-orange-600 font-mono text-sm">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-stone-500">
                    <span>Buy 2: 15% Off</span>
                    <span>Buy 3+: 33% Off</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-center mt-1 font-medium text-[#800020]">
                    {itemCount === 0 ? "Add items to unlock discounts!" :
                      itemCount === 1 ? "Add 1 more item to unlock 15% OFF!" :
                        itemCount === 2 ? "Add 1 more item to unlock 33% OFF!" :
                          "You've unlocked the maximum 33% OFF!"}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 text-center py-16">
                  <p className="text-[#2d2d2d] text-sm uppercase tracking-widest font-medium opacity-70">Your cart is empty</p>
                  <Link
                    href="/collections/all"
                    onClick={closeCart}
                    className="text-xs tracking-widest uppercase border border-[#800020] text-[#800020] px-8 py-4 hover:bg-[#800020] hover:text-white transition-all shadow-sm"
                  >
                    Find the Perfect Gift
                  </Link>
                </div>
              ) : (
                <ul className="space-y-8">
                  {items.map((item) => {
                    const uniqueId = item.cartItemId || `${item.id}-${item.variantId || 'default'}`;
                    return (
                      <li key={uniqueId} className="flex gap-5 group">
                        <div className="relative w-28 h-32 bg-white shrink-0 rounded-sm overflow-hidden border border-[#E5B8B7]/40 shadow-sm">
                          <Image src={item.image || "/logo.png"} alt={item.title} fill unoptimized sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex items-start justify-between mb-1">
                              <p className="font-serif text-lg text-[#2d2d2d] leading-tight pr-4">{item.title}</p>
                              <button onClick={() => removeItem(uniqueId)} aria-label="Remove" className="text-[#E5B8B7] hover:text-[#800020] transition-colors -mt-1 -mr-2 p-2 shrink-0">
                                <X size={18} strokeWidth={1.5} />
                              </button>
                            </div>
                            
                            {(item.title || "").toLowerCase().includes("name necklace") && (
                              <p className="text-[9px] uppercase tracking-widest text-[#b8860b] font-bold mb-1">22k Gold Plated • Anti Tarnish</p>
                            )}

                            {item.variantTitle && (
                              <p className="text-xs uppercase tracking-widest font-bold text-[#800020] mt-1">{item.variantTitle}</p>
                            )}

                            {/* Personalization Details */}
                            {(item.customName || item.customPhotoUrl) && (
                              <div className="mt-3 flex flex-col gap-2 border-t border-[#E5B8B7]/30 pt-3">
                                {item.customName && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest text-[#2d2d2d] opacity-70">Engraving</span>
                                    <span className="text-[11px] font-bold text-[#2d2d2d]">{item.customName}</span>
                                  </div>
                                )}
                                {item.customPhotoUrl && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-widest text-[#2d2d2d] opacity-70">Photo</span>
                                    <div className="w-8 h-8 rounded-sm overflow-hidden border border-[#E5B8B7]">
                                      <img src={item.customPhotoUrl} alt="Custom Memory" className="w-full h-full object-cover" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Gift Packaging */}
                            {item.isGift && (
                              <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#800020] bg-[#FDF8F5] border border-[#E5B8B7] w-fit px-2 py-1 rounded-sm shadow-sm">
                                <Gift size={12} strokeWidth={2} />
                                Premium Packaging
                              </div>
                            )}

                            <p className="text-sm font-medium text-[#2d2d2d] mt-3">₹{item.price.toFixed(2)}</p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 border border-[#E5B8B7] w-fit px-3 py-1.5 rounded-sm bg-white">
                              <button onClick={() => updateQuantity(uniqueId, item.quantity - 1)} aria-label="Decrease" className="text-[#2d2d2d] hover:text-[#800020]">
                                <Minus size={14} strokeWidth={1.5} />
                              </button>
                              <span className="text-xs font-medium w-6 text-center text-[#2d2d2d]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(uniqueId, item.quantity + 1)} aria-label="Increase" className="text-[#2d2d2d] hover:text-[#800020]">
                                <Plus size={14} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-8 border-t border-[#E5B8B7]/30 shrink-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="space-y-3 mb-8">
                  <div className="flex items-baseline justify-between border-b border-[#E5B8B7]/20 pb-2">
                    <span className="text-xs tracking-widest uppercase text-[#2d2d2d] font-bold">Subtotal</span>
                    <span className="text-xl font-serif text-[#800020]">₹{totalPrice().toFixed(2)}</span>
                  </div>

                  {autoDiscountAmount && autoDiscountAmount() > 0 && (
                    <div className="flex items-baseline justify-between border-b border-[#E5B8B7]/20 pb-2 text-emerald-600">
                      <span className="text-xs tracking-widest uppercase font-bold">Auto Discount ({autoDiscountPercentage()}%)</span>
                      <span className="text-xl font-serif">-₹{autoDiscountAmount().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs tracking-widest uppercase text-[#2d2d2d] font-bold">Total</span>
                    <span className="text-2xl font-serif text-[#800020]">₹{discountedTotal ? discountedTotal().toFixed(2) : totalPrice().toFixed(2)}</span>
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-[#2d2d2d] opacity-60 text-center mt-2">Taxes and shipping calculated at checkout</p>
                </div>

                <Link href="/checkout" onClick={closeCart} className="block w-full bg-[#800020] text-white py-5 text-center text-xs tracking-widest uppercase font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors mb-6 shadow-lg">
                  Continue Checkout
                </Link>

                {/* Trust Badges */}
                <div className="flex flex-col gap-2 p-3 bg-stone-50 border border-stone-200 rounded-lg mb-4 text-[10px] uppercase tracking-widest text-[#2d2d2d] font-bold">
                  <div className="flex items-center gap-2 justify-center text-[#b8860b]">
                    <Gem size={14} /> 100% Authentic 22K Gold Plated
                  </div>
                  <div className="flex items-center gap-2 justify-center text-emerald-600">
                    <ShieldCheck size={14} /> Waterproof & Skin Friendly
                  </div>
                  <div className="flex items-center justify-center gap-4 text-stone-500 mt-1 pt-2 border-t border-stone-200">
                    <div className="flex items-center gap-1.5"><Lock size={12} /> Secure Checkout</div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100">
                      Cash On Delivery
                    </div>
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
