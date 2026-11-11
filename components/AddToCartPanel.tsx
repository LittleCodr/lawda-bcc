"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/products";
import { useCartStore } from "@/lib/store";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addItem, setIsOpen } = useCartStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const image = product.images?.grid || product.images?.hero || "/placeholder.svg";
  const productId = product.sku || product.slug;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#242424] tracking-tight tabular-nums">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice > product.price && (
            <span className="text-xl text-[#96928B] line-through font-medium tabular-nums">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.12em] uppercase text-[#777777]">
            Inclusive of all taxes
          </span>
          {product.compareAtPrice > product.price && (
            <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#B83232] px-2 py-0.5 rounded-[4px]">
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
        </div>
      </div>

      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-[#D4CFC7] rounded-[6px] bg-[#F7F6F3] px-2">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="text-[#5C5954] hover:text-[#242424] transition-colors p-2 cursor-pointer"
          >
            <Minus size={14} strokeWidth={2} />
          </button>
          <span className="w-9 text-center text-sm text-[#242424] font-bold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            className="text-[#5C5954] hover:text-[#242424] transition-colors p-2 cursor-pointer"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            addItem({
              id: productId,
              title: product.name,
              price: product.price,
              image,
              quantity: qty,
              variantId: productId,
              variantTitle: "50ML EDP",
            });
            setAdded(true);
            setIsOpen(true);
            setTimeout(() => setAdded(false), 1600);
          }}
          className="flex-1 flex items-center justify-center gap-2 btn-luxury-secondary py-3.5 px-5 text-xs uppercase tracking-[0.14em]"
        >
          <ShoppingBag size={14} />
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          addItem({
            id: productId,
            title: product.name,
            price: product.price,
            image,
            quantity: qty,
            variantId: productId,
            variantTitle: "50ML EDP",
          });
          window.location.href = "/checkout";
        }}
        className="w-full btn-luxury-primary py-4 text-xs tracking-[0.2em]"
      >
        Buy Now — {formatINR(product.price * qty)}
      </button>
    </div>
  );
}
