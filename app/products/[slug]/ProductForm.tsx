"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";

export default function ProductForm({ product }: { product: any }) {
  const { addItem } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const isAvailable = true; // In a real store, check inventory

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      id: product.id.toString(),
      title: product.title,
      price: parseFloat(selectedVariant.price),
      image: product.images?.[0]?.local_src || product.images?.[0]?.src || "/logo.png",
      quantity: 1,
      variantId: selectedVariant.id.toString(),
      variantTitle: selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Variants (if multiple exist) */}
      {product.variants && product.variants.length > 1 && (
        <div className="flex flex-col gap-3">
          <label className="text-xs uppercase tracking-widest font-bold text-stone-900">
            Select Option
          </label>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant: any) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                className={`px-4 py-3 text-sm font-medium border transition-colors ${
                  selectedVariantId === variant.id
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700 hover:border-stone-400"
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!isAvailable || !selectedVariant}
        className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {isAvailable ? "Add to Cart" : "Sold Out"}
      </button>
    </div>
  );
}
