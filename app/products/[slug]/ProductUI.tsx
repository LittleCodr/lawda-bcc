"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import ProductImageGallery from "@/components/ProductImageGallery";
import { Gift } from "lucide-react";
import { logAppEvent } from "@/lib/firebase";

interface ProductUIProps {
  product: any;
}

export default function ProductUI({ product }: ProductUIProps) {
  const { addItem } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  // Personalization State
  const [customName, setCustomName] = useState("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isGift, setIsGift] = useState(false);

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const isAvailable = true; // Inventory logic placeholder

  // Determine if personalization is required based on product title
  const productTitleLower = (product.title || "").toLowerCase();
  const isNamePersonalised = productTitleLower.includes('name') || productTitleLower.includes('initial');
  const isPhotoPersonalised = productTitleLower.includes('photo') || productTitleLower.includes('picture');

  // The price automatically updates based on the selected variant & gift option
  const basePrice = selectedVariant ? parseFloat(selectedVariant.price) : 0;
  const currentPrice = basePrice + (isGift ? 249 : 0);

  // Derive the active image. If the selected variant has a specific image_id, use that.
  const activeImageId = selectedVariant?.image_id || null;

  // Format images
  const images = product.images?.map((img: any) => ({
    src: img.local_src || img.src,
    alt: product.title,
    id: img.id
  })) || [];

  const loggedViewItem = useRef(false);
  useEffect(() => {
    if (!loggedViewItem.current) {
      logAppEvent("view_item", {
        currency: "INR",
        value: currentPrice,
        items: [
          {
            item_id: product.id.toString(),
            item_name: product.title,
            price: currentPrice,
            item_category: product.product_type,
          }
        ]
      });
      loggedViewItem.current = true;
    }
  }, [product, currentPrice]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("https://api.imgbb.com/1/upload?key=4709769dff446ed5d0edc22ceff9026c", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        setCustomPhotoUrl(data.data.url);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    // Find the actual image for this variant, or fallback to the first image
    const variantImage = activeImageId 
      ? images.find((img: any) => img.id === activeImageId)?.src 
      : (images.length > 0 ? images[0].src : "/logo.png");

    addItem({
      id: product.id.toString(),
      title: product.title,
      price: currentPrice, // Price already includes gift wrap cost
      image: variantImage,
      quantity: 1,
      variantId: selectedVariant.id.toString(),
      variantTitle: selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
      customName: isNamePersonalised ? customName : undefined,
      customPhotoUrl: isPhotoPersonalised ? customPhotoUrl : undefined,
      isGift,
    });
    
    // Log Add to Cart
    logAppEvent("add_to_cart", {
      currency: "INR",
      value: currentPrice,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.title,
          price: currentPrice,
          quantity: 1,
          item_variant: selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
          item_category: product.product_type,
        }
      ]
    });
    
    // Optional: Reset state after adding
    setCustomName("");
    setCustomPhotoUrl("");
    setIsGift(false);
  };

  const isPersonalizationComplete = 
    (!isNamePersonalised || customName.trim().length > 0) &&
    (!isPhotoPersonalised || customPhotoUrl.length > 0);

  const isButtonDisabled = !isAvailable || !selectedVariant || !isPersonalizationComplete || isUploading;

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
        
        <div className="flex items-end gap-3 mb-8">
          <p className="text-2xl text-[#800020] font-medium leading-none">
            ₹{currentPrice.toFixed(2)}
          </p>
          {isGift && (
            <span className="text-[10px] uppercase tracking-widest text-[#2d2d2d] opacity-50 mb-1">
              (Includes Gift Packaging)
            </span>
          )}
        </div>

        {/* Product Description */}
        <div 
          className="prose prose-stone prose-sm mb-10 max-w-none text-[#2d2d2d] opacity-90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.body_html || "" }} 
        />

        {/* Configurations */}
        <div className="flex flex-col gap-8 mb-10">
          
          {/* Variant Selection */}
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

          {/* Personalization: Name */}
          {isNamePersonalised && (
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-widest font-bold text-[#2d2d2d] flex justify-between">
                <span>Enter Name / Text</span>
                <span className="text-[#800020] opacity-70">{customName.length}/7</span>
              </label>
              <input 
                type="text" 
                maxLength={7}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. SOPHIA"
                className="border border-[#E5B8B7] focus:border-[#800020] focus:ring-1 focus:ring-[#800020] bg-white rounded-sm px-5 py-4 text-[#2d2d2d] font-medium outline-none transition-all placeholder:text-stone-300 shadow-sm"
              />
            </div>
          )}

          {/* Personalization: Photo */}
          {isPhotoPersonalised && (
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-widest font-bold text-[#2d2d2d]">
                Upload Your Memory
              </label>
              {customPhotoUrl ? (
                <div className="relative w-32 h-32 rounded-sm overflow-hidden border border-[#E5B8B7] shadow-sm group">
                  <img src={customPhotoUrl} alt="Custom Memory" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => setCustomPhotoUrl("")} className="text-white text-[10px] tracking-widest uppercase font-bold border border-white px-3 py-1.5 hover:bg-white hover:text-black transition-colors rounded-sm">Remove</button>
                  </div>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-[#E5B8B7] hover:border-[#800020] rounded-sm p-8 text-center transition-colors bg-[#FDF8F5]/30 group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3 text-[#800020]">
                      <div className="w-6 h-6 border-2 border-[#E5B8B7] border-t-[#800020] rounded-full animate-spin"></div>
                      <span className="text-[10px] uppercase tracking-widest font-bold">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#800020] opacity-70 group-hover:opacity-100 transition-opacity">
                      <span className="text-2xl font-light leading-none">+</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold">Tap to Upload Photo</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Upsell: Gift Packaging */}
          <div 
            onClick={() => setIsGift(!isGift)}
            className={`border rounded-sm p-5 flex items-center justify-between cursor-pointer transition-all duration-300 group ${isGift ? 'border-[#800020] bg-[#FDF8F5] shadow-md' : 'border-[#E5B8B7] hover:border-[#800020] hover:bg-[#FDF8F5]/30'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isGift ? 'border-[#800020] bg-[#800020]' : 'border-[#E5B8B7]'}`}>
                {isGift && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full transition-colors ${isGift ? 'bg-[#800020]/10 text-[#800020]' : 'bg-[#E5B8B7]/20 text-[#2d2d2d] group-hover:text-[#800020]'}`}>
                  <Gift size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#2d2d2d]">Make it a Gift</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#2d2d2d] opacity-70 mt-0.5">Premium Box + Message Card</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-[#800020] tracking-wider">+₹249</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
            className="w-full bg-[#800020] text-white py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-2"
          >
            {!isAvailable 
              ? "Sold Out" 
              : isUploading 
                ? "Uploading..." 
                : !isPersonalizationComplete 
                  ? "Complete Personalization" 
                  : "Add to Cart"}
          </button>
        </div>

        {/* Features / Details Accordion-style layout */}
        <div className="mt-4 border-t border-[#E5B8B7]/30 pt-8 space-y-8">
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
