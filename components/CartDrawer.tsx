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
            className="fixed right-0 top-0 z-[70] h-full w-full sm:w-[420px] bg-stone-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-stone-200 shrink-0">
              <h2 className="font-serif text-xl uppercase tracking-widest">Your Cart</h2>
              <button onClick={closeCart} aria-label="Close cart" className="p-1 hover:text-stone-500 transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-16">
                  <p className="text-stone-500 text-sm">Your cart is empty.</p>
                  <Link
                    href="/collections/all"
                    onClick={closeCart}
                    className="text-xs tracking-widest uppercase border border-stone-900 px-6 py-3 hover:bg-stone-900 hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.variantId}`} className="flex gap-4">
                      <div className="relative w-24 h-24 bg-white shrink-0 rounded-md overflow-hidden border border-stone-100">
                        <Image src={item.image || "/logo.png"} alt={item.title} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between">
                          <p className="font-serif text-lg">{item.title}</p>
                          <button onClick={() => removeItem(item.id, item.variantId)} aria-label="Remove" className="text-stone-400 hover:text-stone-900">
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                        {item.variantTitle && (
                          <p className="text-xs text-stone-500 mt-1">{item.variantTitle}</p>
                        )}
                        <p className="text-sm mt-1">₹{item.price}</p>
                        
                        <div className="mt-auto flex items-center gap-4 border border-stone-200 w-fit px-3 py-1.5 rounded-sm">
                          <button onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)} aria-label="Decrease">
                            <Minus size={14} strokeWidth={1.5} />
                          </button>
                          <span className="text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)} aria-label="Increase">
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
              <div className="px-6 py-6 border-t border-stone-200 shrink-0 bg-white">
                <div className="space-y-2 mb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm tracking-widest uppercase text-stone-500">Subtotal</span>
                    <span className="text-lg font-medium">₹{totalPrice()}</span>
                  </div>
                  <p className="text-[10px] text-stone-400">Taxes and shipping calculated at checkout</p>
                </div>
                
                <Link href="/checkout" onClick={closeCart} className="block w-full bg-stone-900 text-white py-4 text-center text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors mb-4">
                  Checkout
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
