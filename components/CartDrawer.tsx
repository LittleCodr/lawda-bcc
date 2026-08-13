"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, Lock, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice } = useCartStore();

  const closeCart = () => setIsOpen(false);

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
            className="fixed right-0 top-0 z-[70] h-full w-full sm:w-[420px] bg-[#FDF8F5] flex flex-col shadow-2xl border-l border-[#E5B8B7]/30"
          >
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#E5B8B7]/30 shrink-0 bg-white/50 backdrop-blur-md">
              <h2 className="font-serif text-2xl uppercase tracking-widest text-[#800020]">Your Cart</h2>
              <button onClick={closeCart} aria-label="Close cart" className="p-1 text-[#2d2d2d] hover:text-[#800020] transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

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
                  {items.map((item) => (
                    <li key={`${item.id}-${item.variantId}`} className="flex gap-5 group">
                      <div className="relative w-28 h-32 bg-white shrink-0 rounded-sm overflow-hidden border border-[#E5B8B7]/40 shadow-sm">
                        <Image src={item.image || "/logo.png"} alt={item.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-serif text-lg text-[#2d2d2d] leading-tight">{item.title}</p>
                            <button onClick={() => removeItem(item.id, item.variantId)} aria-label="Remove" className="text-[#E5B8B7] hover:text-[#800020] transition-colors -mt-1 -mr-2 p-2">
                              <X size={18} strokeWidth={1.5} />
                            </button>
                          </div>
                          {item.variantTitle && (
                            <p className="text-xs uppercase tracking-widest font-bold text-[#800020] mt-1">{item.variantTitle}</p>
                          )}
                          <p className="text-sm font-medium text-[#2d2d2d] mt-2">₹{item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="mt-4 flex items-center gap-4 border border-[#E5B8B7] w-fit px-3 py-2 rounded-sm bg-white">
                          <button onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)} aria-label="Decrease" className="text-[#2d2d2d] hover:text-[#800020]">
                            <Minus size={14} strokeWidth={1.5} />
                          </button>
                          <span className="text-xs font-medium w-6 text-center text-[#2d2d2d]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)} aria-label="Increase" className="text-[#2d2d2d] hover:text-[#800020]">
                            <Plus size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-8 border-t border-[#E5B8B7]/30 shrink-0 bg-white">
                <div className="space-y-3 mb-8">
                  <div className="flex items-baseline justify-between border-b border-[#E5B8B7]/20 pb-4">
                    <span className="text-xs tracking-widest uppercase text-[#2d2d2d] font-bold">Subtotal</span>
                    <span className="text-2xl font-serif text-[#800020]">₹{totalPrice().toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#2d2d2d] opacity-60 text-center">Taxes and shipping calculated at checkout</p>
                </div>
                
                <Link href="/checkout" onClick={closeCart} className="block w-full bg-[#800020] text-white py-5 text-center text-xs tracking-widest uppercase font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors mb-6 shadow-lg">
                  Secure Checkout
                </Link>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Lock size={14} /> Secure Checkout
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} /> 100% Quality
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
