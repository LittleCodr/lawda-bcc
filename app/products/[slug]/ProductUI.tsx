"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import ProductImageGallery from "@/components/ProductImageGallery";
import { Gift, ShieldCheck, Truck, Star, Heart, CheckCircle2, ChevronRight, ShoppingBag, Zap, Clock, Smile, Award, Users } from "lucide-react";
import { logAppEvent } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

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

  // Tabs state
  const [activeTab, setActiveTab] = useState("details");

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const isAvailable = true; 

  const productTitleLower = (product.title || "").toLowerCase();
  const isNamePersonalised = productTitleLower.includes('name') || productTitleLower.includes('initial');
  const isPhotoPersonalised = productTitleLower.includes('photo') || productTitleLower.includes('picture');

  const basePrice = selectedVariant ? parseFloat(selectedVariant.price) : 0;
  const compareAtPrice = selectedVariant?.compare_at_price ? parseFloat(selectedVariant.compare_at_price) : (basePrice * 1.4);
  const discountPercent = Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100);
  
  const currentPrice = basePrice + (isGift ? 249 : 0);

  const activeImageId = selectedVariant?.image_id || null;

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

    const variantImage = activeImageId 
      ? images.find((img: any) => img.id === activeImageId)?.src 
      : (images.length > 0 ? images[0].src : "/logo.png");

    addItem({
      id: product.id.toString(),
      title: product.title,
      price: currentPrice,
      image: variantImage,
      quantity: 1,
      variantId: selectedVariant.id.toString(),
      variantTitle: selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
      customName: isNamePersonalised ? customName : undefined,
      customPhotoUrl: isPhotoPersonalised ? customPhotoUrl : undefined,
      isGift,
    });
    
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
    
    setCustomName("");
    setCustomPhotoUrl("");
    setIsGift(false);
  };

  const isPersonalizationComplete = 
    (!isNamePersonalised || customName.trim().length > 0) &&
    (!isPhotoPersonalised || customPhotoUrl.length > 0);

  const isButtonDisabled = !isAvailable || !selectedVariant || !isPersonalizationComplete || isUploading;

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-8 mt-4">
        <Link href="/" className="hover:text-[#800020] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/collections/all" className="hover:text-[#800020] transition-colors">Gifts</Link>
        <ChevronRight size={12} />
        <span className="text-[#800020] truncate">{product.title}</span>
      </nav>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Gallery (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="relative">
             <div className="absolute top-4 left-4 z-10 bg-[#800020] text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
               🔥 Bestseller
             </div>
             <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-400 hover:text-[#800020]">
               <Heart size={20} />
             </button>
             <ProductImageGallery images={images} selectedImageId={activeImageId} />
          </div>
          
          {/* Trust Banner Below Image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fdfaf8] rounded-2xl p-4 border border-[#800020]/5">
            <div className="flex items-center gap-3">
              <Truck size={18} className="text-[#800020]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">Free Shipping</span>
                <span className="text-[9px] text-gray-500">On all prepaid orders</span>
              </div>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <Gift size={18} className="text-[#800020]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">Premium Gift Wrap</span>
                <span className="text-[9px] text-gray-500">Make it extra special</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Product Details (Span 4) */}
        <div className="lg:col-span-4 flex flex-col pt-2">
          
          <div className="flex gap-2 mb-4">
            <span className="bg-[#f9f2ed] text-[#800020] text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">Personalized Gift</span>
            <span className="bg-orange-50 text-orange-700 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">Trending</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-[#2d2d2d] mb-4 leading-tight">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-[#800020]">₹{currentPrice.toFixed(2)}</span>
            {compareAtPrice > basePrice && (
              <>
                <span className="text-sm text-gray-400 line-through font-medium">₹{compareAtPrice.toFixed(2)}</span>
                <span className="text-[10px] uppercase font-bold text-[#800020] bg-[#ffeaea] px-2 py-0.5 rounded-sm">({discountPercent}% OFF)</span>
              </>
            )}
          </div>

          {((productTitleLower.includes('gold')) || (selectedVariant?.title?.toLowerCase().includes('gold'))) && (
            <div className="bg-amber-50 text-amber-800 text-[10px] uppercase tracking-widest font-bold px-3 py-2 rounded-md mb-6 inline-block w-fit border border-amber-200">
              Note: This is an 18k Gold Plated item, not solid gold.
            </div>
          )}

          <div 
            className="prose prose-sm text-gray-600 mb-8 leading-relaxed max-w-none text-justify"
            dangerouslySetInnerHTML={{ __html: product.body_html || "" }} 
          />

          {/* Quick Features */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-[#fdfaf8] flex items-center justify-center text-[#800020]"><Star size={18} /></div>
               <span className="text-[9px] font-bold uppercase text-gray-700">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-[#fdfaf8] flex items-center justify-center text-[#800020]"><Smile size={18} /></div>
               <span className="text-[9px] font-bold uppercase text-gray-700">Skin Friendly</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-[#fdfaf8] flex items-center justify-center text-[#800020]"><CheckCircle2 size={18} /></div>
               <span className="text-[9px] font-bold uppercase text-gray-700">Anti Tarnish</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-[#fdfaf8] flex items-center justify-center text-[#800020]"><ShieldCheck size={18} /></div>
               <span className="text-[9px] font-bold uppercase text-gray-700">Warranty</span>
            </div>
          </div>

          {/* Configurations */}
          <div className="flex flex-col gap-6 mb-8">
            
            {product.variants && product.variants.length > 1 && (
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#2d2d2d]">Select Option</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border rounded-md transition-all duration-300 ${
                        selectedVariantId === variant.id
                          ? "border-[#800020] bg-[#800020] text-white shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-[#800020]"
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isNamePersonalised && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#2d2d2d] flex justify-between">
                  <span>Enter Name to Engrave</span>
                  <span className="text-[#800020]">{customName.length}/7</span>
                </label>
                <input 
                  type="text" 
                  maxLength={7}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. SOPHIA"
                  className="border border-gray-200 focus:border-[#800020] bg-gray-50/50 rounded-lg px-4 py-3 text-sm text-[#2d2d2d] font-bold outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            )}

            {isPhotoPersonalised && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#2d2d2d]">Upload Photo</label>
                {customPhotoUrl ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={customPhotoUrl} alt="Custom Memory" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => setCustomPhotoUrl("")} className="text-white text-[10px] tracking-widest uppercase font-bold border border-white px-2 py-1 rounded-md hover:bg-white hover:text-black">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-gray-200 hover:border-[#800020] rounded-lg p-6 text-center transition-colors bg-gray-50/50 group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 text-[#800020]">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-[#800020] rounded-full animate-spin"></div>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-[#800020] transition-colors">
                        <span className="text-xl font-light leading-none">+</span>
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
              className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 group ${isGift ? 'border-[#800020] bg-[#fdfaf8] shadow-sm' : 'border-gray-200 hover:border-[#800020]'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isGift ? 'border-[#800020] bg-[#800020]' : 'border-gray-300'}`}>
                  {isGift && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <div className="flex items-center gap-3">
                  <Gift size={20} className={isGift ? 'text-[#800020]' : 'text-gray-400 group-hover:text-[#800020] transition-colors'} strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#2d2d2d]">Make it a Gift</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 mt-0.5">Premium Box + Card</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#800020]">+₹249</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
             <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className="flex-1 flex items-center justify-center gap-2 bg-[#800020] text-white py-4 uppercase tracking-widest text-[10px] font-bold rounded-lg hover:bg-[#600018] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <ShoppingBag size={16} /> 
                {!isAvailable 
                  ? "Sold Out" 
                  : isUploading 
                    ? "Uploading..." 
                    : !isPersonalizationComplete 
                      ? "Personalize to Add" 
                      : "Add to Cart"}
             </button>
             <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className="flex-1 flex items-center justify-center border border-[#800020] text-[#800020] py-4 uppercase tracking-widest text-[10px] font-bold rounded-lg hover:bg-[#800020] hover:text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex"
             >
                Buy Now
             </button>
          </div>

          {/* Fast Delivery Highlight */}
          <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg p-3 flex items-center justify-center gap-2 text-emerald-800 mb-8">
             <Zap size={16} className="text-emerald-600 fill-emerald-600" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery across India | 2-5 Days</span>
          </div>

          {/* Reviews Preview */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
             <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-gray-800">4.8</span>
                <span className="text-[10px] text-gray-500 ml-1">(12,500+ Reviews)</span>
             </div>
             <button className="text-[10px] uppercase tracking-widest font-bold text-[#800020] hover:underline flex items-center gap-1">
                View All <ChevronRight size={12} />
             </button>
          </div>
        </div>

        {/* Right Column: Sidebar (Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          <div className="bg-[#fdfaf8] rounded-2xl p-6 border border-[#800020]/5">
             <h3 className="text-xs uppercase tracking-widest font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Perfect For</h3>
             <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-sm"><Gift size={18} strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-gray-700">Birthday Gifts</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-sm"><Heart size={18} strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-gray-700">Anniversary Gifts</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-sm"><Users size={18} strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-gray-700">Couple Gifts</span>
                </li>
             </ul>
          </div>

          <div className="bg-[#fdfaf8] rounded-2xl p-6 border border-[#800020]/5">
             <h3 className="text-xs uppercase tracking-widest font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Why Choose Octopus?</h3>
             <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <CheckCircle2 size={20} className="text-[#800020] shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-bold text-gray-700">Personalized Gifts</span>
                </li>
                <li className="flex items-center gap-4">
                  <Award size={20} className="text-[#800020] shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-bold text-gray-700">Premium Quality</span>
                </li>
                <li className="flex items-center gap-4">
                  <ShieldCheck size={20} className="text-[#800020] shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-bold text-gray-700">Secure Payments</span>
                </li>
                <li className="flex items-center gap-4">
                  <Smile size={20} className="text-[#800020] shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-bold text-gray-700">Happy Customers</span>
                </li>
             </ul>
          </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 max-w-4xl border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center border-b border-gray-200 bg-gray-50/50">
           {['details', 'reviews', 'shipping', 'faqs'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                 activeTab === tab 
                   ? 'bg-white text-[#800020] border-b-2 border-[#800020]' 
                   : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
               }`}
             >
               {tab === 'details' ? 'Product Details' : 
                tab === 'reviews' ? 'Reviews (1250)' : 
                tab === 'shipping' ? 'Shipping & Returns' : 'FAQs'}
             </button>
           ))}
        </div>
        <div className="p-8 bg-white min-h-[200px]">
           {activeTab === 'details' && (
             <div className="animate-in fade-in duration-300">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Product Details</h4>
                <div className="prose prose-sm text-gray-600 text-justify" dangerouslySetInnerHTML={{ __html: product.body_html || "" }} />
             </div>
           )}
           {activeTab === 'reviews' && (
             <div className="animate-in fade-in duration-300 text-center py-10">
                <div className="flex justify-center text-amber-400 mb-4"><Star size={24} fill="currentColor" /><Star size={24} fill="currentColor" /><Star size={24} fill="currentColor" /><Star size={24} fill="currentColor" /><Star size={24} fill="currentColor" /></div>
                <h4 className="text-xl font-serif text-gray-900 mb-2">4.8 out of 5 Stars</h4>
                <p className="text-sm text-gray-500">Based on 12,500+ reviews from verified customers.</p>
             </div>
           )}
           {activeTab === 'shipping' && (
             <div className="animate-in fade-in duration-300">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Shipping Information</h4>
                <p className="text-sm text-gray-600 mb-6 text-justify">Free standard shipping on all orders. Personalised items take 3-5 business days to craft before shipping to ensure perfection. Once shipped, delivery takes 2-5 days across India.</p>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Returns Policy</h4>
                <p className="text-sm text-gray-600 text-justify">Due to the personalized nature of our products, we do not accept returns unless the item is defective or incorrect. Please contact our support team within 48 hours of delivery if there are any issues.</p>
             </div>
           )}
           {activeTab === 'faqs' && (
             <div className="animate-in fade-in duration-300 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Is this anti-tarnish?</h4>
                  <p className="text-sm text-gray-600">Yes, our jewelry is made from premium materials and is anti-tarnish and waterproof.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Do you offer cash on delivery?</h4>
                  <p className="text-sm text-gray-600">Yes, Cash on Delivery is available on select non-personalized products.</p>
                </div>
             </div>
           )}
        </div>
      </div>

    </div>
  );
}
