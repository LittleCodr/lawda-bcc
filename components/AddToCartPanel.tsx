"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-ink tracking-tight">{formatINR(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-xl text-ink/40 line-through font-medium">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-ink/40">incl. taxes</span>
          {product.compareAtPrice > product.price && (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-sm">
              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Quantity + Add to Cart Row */}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-ink/15 bg-neutral-50 px-3">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="text-ink/50 hover:text-ink transition-colors p-1">
            <Minus size={14} strokeWidth={2} />
          </button>
          <span className="w-10 text-center text-sm text-ink font-bold tabular-nums">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="text-ink/50 hover:text-ink transition-colors p-1">
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>

        <button
          onClick={() => {
            addItem(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-ink/15 text-ink py-4 px-6 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-50 hover:border-ink/30 transition-all font-bold"
        >
          <ShoppingBag size={14} />
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>

      {/* Buy Now - Brutalist full-width */}
      <button
        onClick={() => {
          addItem(product, qty);
          openCart();
        }}
        className="w-full bg-ink text-paper py-5 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-gold transition-colors duration-500"
      >
        Buy Now — {formatINR(product.price * qty)}
      </button>
    </div>
  );
}
