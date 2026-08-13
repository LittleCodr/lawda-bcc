"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import ProductImageGallery from "@/components/ProductImageGallery";

interface ProductUIProps {
  product: any;
}

export default function ProductUI({ product }: ProductUIProps) {
  const { addItem } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const isAvailable = true; // Inventory logic placeholder

  // The price automatically updates based on the selected variant
  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price) : 0;

  // Derive the active image. If the selected variant has a specific image_id, use that.
  const activeImageId = selectedVariant?.image_id || null;

  // Format images
  const images = product.images?.map((img: any) => ({
    src: img.local_src || img.src,
    alt: product.title,
    id: img.id
  })) || [];

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      id: product.id.toString(),
      title: product.title,
      price: currentPrice,
      image: images.length > 0 ? images[0].src : "/logo.png",
      quantity: 1,
      variantId: selectedVariant.id.toString(),
      variantTitle: selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
      
      {/* 1. Interactive Image Gallery */}
      <div className="sticky top-32">
        <ProductImageGallery images={images} selectedImageId={activeImageId} />
      </div>

      {/* 2. Product Details & Variants */}
      <div className="flex flex-col">
        {/* Breadcrumb / Category */}
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#800020] font-bold mb-4 block">
          {product.product_type || "Everlasting Gift"}
        </span>

        <h1 className="font-serif text-3xl md:text-5xl text-[#2d2d2d] mb-4 leading-tight">
          {product.title}
        </h1>
        
        <p className="text-xl text-[#800020] mb-8 font-medium">
          ₹{currentPrice.toFixed(2)}
        </p>

        {/* Product Description */}
        <div 
          className="prose prose-stone prose-sm mb-10 max-w-none text-[#2d2d2d] opacity-90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.body_html || "" }} 
        />

        {/* Variant Selection */}
        <div className="flex flex-col gap-8 mb-10">
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-col gap-4">
              <label className="text-xs uppercase tracking-widest font-bold text-[#2d2d2d]">
                Select Option
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`px-6 py-3 text-xs uppercase tracking-widest font-medium border rounded-sm transition-all duration-300 ${
                      selectedVariantId === variant.id
                        ? "border-[#800020] bg-[#800020] text-white shadow-md"
                        : "border-[#E5B8B7] text-[#2d2d2d] hover:border-[#800020] hover:bg-[#FDF8F5]"
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || !selectedVariant}
            className="w-full bg-[#800020] text-white py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors duration-300 disabled:opacity-50 shadow-xl"
          >
            {isAvailable ? "Add to Cart" : "Sold Out"}
          </button>
        </div>

        {/* Features / Details Accordion-style layout */}
        <div className="mt-8 border-t border-[#E5B8B7]/30 pt-8 space-y-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#800020] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#800020]"></span> 
              Shipping & Returns
            </h3>
            <p className="text-sm text-[#2d2d2d] opacity-80 leading-relaxed pl-6">
              Free standard shipping on all orders. Personalised items take 3-5 business days to craft before shipping to ensure perfection.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#800020] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#800020]"></span> 
              Materials & Care
            </h3>
            <p className="text-sm text-[#2d2d2d] opacity-80 leading-relaxed pl-6">
              Crafted with high-quality stainless steel and plated in 18k gold. Hypoallergenic, tarnish-resistant, and designed to last a lifetime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
