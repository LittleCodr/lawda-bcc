"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, Lock, ShieldCheck, Gift, Clock, Gem, Sparkles } from "lucide-react";
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
            className="fixed right-0 top-0 z-[70] h-full w-full sm:w-[450px] bg-white flex flex-col shadow-2xl border-l border-[#ebebeb]"
          >
            {/* Airbnb Style Drawer Header */}
            <div className="flex items-center justify-between px-6 h-18 border-b border-[#ebebeb] shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-semibold text-[#222222]">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="text-xs text-[#6a6a6a]">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                )}
              </div>
              <button 
                onClick={closeCart} 
                aria-label="Close cart" 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#222222] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Timer & Gamification Bar */}
            {items.length > 0 && (
              <div className="px-6 py-3.5 bg-[#f7f7f7] shrink-0 border-b border-[#ebebeb] flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#222222] flex items-center gap-1.5"><Clock size={13} className="text-[#ff385c]" /> Items held in cart for</span>
                  <span className="text-[#ff385c] font-mono font-semibold text-xs">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="w-full bg-[#ebebeb] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ff385c] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-center text-[#6a6a6a] font-medium">
                    {itemCount === 0 ? "Add items to unlock festive discounts" :
                      itemCount === 1 ? "Add 1 more EDP to unlock 15% OFF" :
                        itemCount === 2 ? "Add 1 more EDP to unlock 33% OFF" :
                          "You've unlocked the maximum 33% discount!"}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-5 text-center py-16">
                  <p className="text-[#6a6a6a] text-sm font-medium">Your cart is empty</p>
                  <Link
                    href="/harsh-beniwal/octopus/perfumes"
                    onClick={closeCart}
                    className="btn-secondary-airbnb"
                  >
                    Explore Harsh Beniwal Fragrances
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {(() => {
                    const freeTesterGift = items.length > 0 ? [
                      {
                        id: "free-tester-paradox",
                        cartItemId: "free-tester-paradox",
                        title: "FREE 7ML Paradox EDP Tester",
                        price: 0,
                        image: "/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png",
                        variantTitle: "Complimentary Pocket Tester (₹399 Value)",
                        isGift: false,
                        isFree: true,
                        quantity: 1
                      }
                    ] : [];
                    
                    const allDisplayItems = [...items, ...freeTesterGift];
                    
                    return allDisplayItems.map((item: any) => {
                      const uniqueId = item.cartItemId || `${item.id}-${item.variantId || 'default'}`;
                      return (
                        <li key={uniqueId} className="flex gap-4 group pb-6 border-b border-[#ebebeb] last:border-b-0">
                          <div className="relative w-20 h-20 bg-[#f7f7f7] shrink-0 rounded-[10px] overflow-hidden border border-[#ebebeb]">
                            <Image 
                              src={item.image || "/logo.png"} 
                              alt={item.title} 
                              fill 
                              unoptimized 
                              sizes="80px" 
                              className="object-contain p-2" 
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <p className="text-[15px] font-semibold text-[#222222] leading-snug pr-2">{item.title}</p>
                                {!item.isFree && (
                                  <button onClick={() => removeItem(uniqueId)} aria-label="Remove" className="text-[#929292] hover:text-[#222222] transition-colors p-1 shrink-0">
                                    <X size={16} strokeWidth={2} />
                                  </button>
                                )}
                              </div>
                              
                              <p className="text-[12px] text-[#6a6a6a] mt-0.5">{item.variantTitle || "50ML Eau De Parfum"}</p>

                              {item.isFree ? (
                                <p className="text-xs font-bold text-[#ff385c] mt-2 flex items-center gap-1 uppercase tracking-wide">
                                  <Gift size={13} /> FREE GIFT
                                </p>
                              ) : (
                                <p className="text-[14px] font-semibold text-[#222222] mt-2">₹{item.price.toFixed(0)}</p>
                              )}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              {item.isFree ? (
                                <span className="text-xs text-[#6a6a6a]">Qty: 1</span>
                              ) : (
                                <div className="flex items-center gap-3 border border-[#dddddd] w-fit px-2.5 py-1 rounded-[8px] bg-white">
                                  <button onClick={() => updateQuantity(uniqueId, item.quantity - 1)} aria-label="Decrease" className="text-[#222222] hover:text-[#ff385c] p-0.5">
                                    <Minus size={13} strokeWidth={2} />
                                  </button>
                                  <span className="text-xs font-semibold w-5 text-center text-[#222222]">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(uniqueId, item.quantity + 1)} aria-label="Increase" className="text-[#222222] hover:text-[#ff385c] p-0.5">
                                    <Plus size={13} strokeWidth={2} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    });
                  })()}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-[#ebebeb] shrink-0 bg-white">
                <div className="space-y-2 mb-6">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-[#6a6a6a]">Subtotal</span>
                    <span className="font-semibold text-[#222222]">₹{totalPrice().toFixed(0)}</span>
                  </div>

                  {autoDiscountAmount && autoDiscountAmount() > 0 && (
                    <div className="flex items-baseline justify-between text-sm text-[#188038]">
                      <span>Discount ({autoDiscountPercentage()}%)</span>
                      <span className="font-semibold">-₹{autoDiscountAmount().toFixed(0)}</span>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#ebebeb] text-base">
                    <span className="font-semibold text-[#222222]">Total</span>
                    <span className="text-xl font-bold text-[#222222]">₹{(discountedTotal ? discountedTotal() : totalPrice()).toFixed(0)}</span>
                  </div>

                  <p className="text-[11px] text-[#6a6a6a] text-center pt-1">Free Pan-India express delivery included</p>
                </div>

                <Link 
                  href="/checkout" 
                  prefetch={true}
                  onClick={closeCart} 
                  className="block w-full bg-[#ff385c] hover:bg-[#e00b41] text-white py-3.5 rounded-[8px] text-[16px] font-medium text-center transition-colors shadow-xs mb-3"
                >
                  Proceed to Checkout
                </Link>

                <div className="flex items-center justify-center gap-4 text-[11px] text-[#6a6a6a] pt-2">
                  <div className="flex items-center gap-1"><Lock size={12} /> Secure Checkout</div>
                  <span>•</span>
                  <div className="flex items-center gap-1"><ShieldCheck size={12} /> 100% Genuine Harsh Beniwal EDP</div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
