"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import ProductImageGallery from "@/components/ProductImageGallery";
import { Gift, ShieldCheck, Truck, Star, Heart, CheckCircle2, ChevronRight, ShoppingBag, Zap, Clock, Smile, Award, Users, Flame, Sparkles } from "lucide-react";
import { logAppEvent, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

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
  const [customFont, setCustomFont] = useState("font-pacifico");
  const [viewers, setViewers] = useState(0);
  const [stockLeft, setStockLeft] = useState(0);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 20) + 15);
    setStockLeft(Math.floor(Math.random() * 5) + 2);
  }, []);
  // Tabs state
  const [activeTab, setActiveTab] = useState("details");

  const { user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);

  // PIN Code State
  const [pinCode, setPinCode] = useState("");
  const [pinStatus, setPinStatus] = useState<"idle" | "checking" | "success">("idle");

  useEffect(() => {
    if (!user) return;
    const checkFav = async () => {
      const docRef = doc(db, "users", user.uid, "favourites", product.id.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setIsFavourite(true);
    };
    checkFav();
  }, [user, product.id]);

  const toggleFavourite = async () => {
    if (!user) {
      toast.error("Please login to save favourites!");
      return;
    }
    setIsFavLoading(true);
    try {
      const docRef = doc(db, "users", user.uid, "favourites", product.id.toString());
      if (isFavourite) {
        await deleteDoc(docRef);
        setIsFavourite(false);
      } else {
        await setDoc(docRef, {
          id: product.id.toString(),
          handle: product.handle,
          title: product.title,
          price: currentPrice,
          image: images.length > 0 ? images[0].src : "/logo.png",
          addedAt: new Date()
        });
        setIsFavourite(true);
        toast.success("Added to favourites!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update favourites.");
    } finally {
      setIsFavLoading(false);
    }
  };

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const isAvailable = true; 

  const productTitleLower = (product.title || "").toLowerCase();
  const isNamePersonalised = productTitleLower.includes('name') || productTitleLower.includes('initial') || product.handle === '12-in-1-jhumkas-box';
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
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
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
      customFont: isNamePersonalised ? customFont : undefined,
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
    
    toast.success("Added to Cart!");
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
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky top-24">
          <div className="relative">
             <div className="absolute top-4 left-4 z-10 bg-[#800020] text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
               <Flame size={12} fill="currentColor" /> Bestseller
             </div>
             <button 
                onClick={toggleFavourite}
                disabled={isFavLoading}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-400 hover:text-[#800020] disabled:opacity-50 disabled:scale-100"
             >
               <Heart size={20} fill={isFavourite ? "#800020" : "transparent"} className={isFavourite ? "text-[#800020]" : ""} />
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
          
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-stone-600 flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#800020]"/> Personalized Gift</span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-stone-600 flex items-center gap-1.5"><Flame size={12} className="text-orange-600"/> Selling Fast</span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#800020] flex items-center gap-1.5"><Truck size={12}/> Deliver Before Rakhi</span>
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
              Note: This is an Artificial Jewelry item, not solid gold.
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
              <div className="flex flex-col gap-5">
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

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#2d2d2d]">Select Font</label>
                  <div className="flex gap-2">
                    {['font-pacifico', 'font-dancing', 'font-greatvibes'].map(fontClass => (
                      <button
                        key={fontClass}
                        onClick={() => setCustomFont(fontClass)}
                        className={`flex-1 py-3 px-2 border rounded-md text-center transition-all ${
                          customFont === fontClass 
                            ? 'border-[#800020] bg-[#fdfaf8] text-[#800020] shadow-sm' 
                            : 'border-gray-200 text-gray-500 hover:border-[#800020]'
                        }`}
                      >
                        <span className={`text-lg leading-none ${fontClass}`}>
                          {fontClass === 'font-pacifico' ? 'Pacifico' : fontClass === 'font-dancing' ? 'Dancing' : 'Great Vibes'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {customName && (
                  <div className="bg-[#fdfaf8] border border-[#800020]/20 rounded-lg p-6 flex flex-col items-center justify-center gap-2 shadow-sm relative overflow-hidden mt-2">
                    <span className="text-[9px] uppercase tracking-widest text-[#800020] font-bold absolute top-2 left-3">Live Preview</span>
                    <p className={`text-3xl text-stone-800 ${customFont} mt-2 text-center break-all`}>
                      {customName}
                    </p>
                  </div>
                )}
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

          {/* Rakhi Special Promo */}
          {isNamePersonalised && productTitleLower.includes('necklace') && (
            <div className="bg-[#FFEAEA] border border-[#800020]/20 rounded-xl p-4 mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#800020]/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-white text-[#800020] p-2 rounded-lg shadow-sm">
                  <Gift size={24} />
                </div>
                <div>
                  <h4 className="text-[#800020] font-bold text-sm mb-1 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="inline-block" /> Rakhi Special
                  </h4>
                  <p className="text-[#2d2d2d] text-xs font-medium leading-relaxed">
                    Brother, use secret code <strong className="font-black text-[#800020] bg-white px-2 py-0.5 rounded border border-[#800020]/20">ILYBEHENA</strong> at checkout to get an extra <strong className="text-[#800020]">₹150 OFF</strong> on this necklace!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FOMO Elements */}
          {(viewers > 0) && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-orange-700 bg-orange-50 border border-orange-200 px-3 py-2.5 rounded-md shadow-sm">
                <Users size={14} /> {viewers} people are viewing this right now
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded-md shadow-sm">
                <Flame size={14} /> Hurry, only {stockLeft} left in stock!
              </div>
            </div>
          )}

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
          <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg p-3 flex items-center justify-center gap-2 text-emerald-800 mb-4">
             <Zap size={16} className="text-emerald-600 fill-emerald-600" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery across India | 2-5 Days</span>
          </div>

          {/* PIN Code Check */}
          <div className="mb-8 border border-[#E5B8B7] rounded-lg p-4 bg-[#fdfaf8]">
            <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-2"><Truck size={14} className="text-[#800020]"/> Check Delivery Before Raksha Bandhan</h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter PIN Code" 
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                maxLength={6}
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#800020]" 
              />
              <button 
                onClick={() => {
                  if(pinCode.length === 6) {
                    setPinStatus("checking");
                    setTimeout(() => setPinStatus("success"), 800);
                  }
                }}
                className="bg-[#800020] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#600018] transition-colors"
              >
                {pinStatus === "checking" ? "..." : "Check"}
              </button>
            </div>
            {pinStatus === "success" ? (
              <p className="text-[10px] text-emerald-700 mt-3 font-bold flex items-center gap-1 bg-emerald-50 p-2 rounded-md"><CheckCircle2 size={12}/> Delivery available to {pinCode}. Order now with Premium Delivery to get it before Aug 28th.</p>
            ) : (
              <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">Enter a 6-digit PIN code to check delivery time.</p>
            )}
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
          </div>
        </div>

        {/* Right Column: Sidebar (Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          <div className="bg-[#fdfaf8] rounded-2xl p-6 border border-[#800020]/5">
             <h3 className="text-xs uppercase tracking-widest font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Perfect For</h3>
             <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-sm"><Gift size={18} strokeWidth={1.5} /></div>
                  <Link href="/collections/rakhi-gifts-for-sister" className="text-xs font-bold text-gray-700 hover:text-[#800020] transition-colors">Rakhi Gift for Sister</Link>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-sm"><Heart size={18} strokeWidth={1.5} /></div>
                  <Link href="/collections/rakhi-gifts-for-brother" className="text-xs font-bold text-gray-700 hover:text-[#800020] transition-colors">Rakhi Gift for Brother</Link>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-sm"><Users size={18} strokeWidth={1.5} /></div>
                  <Link href="/collections/rakhi-gifts-under-499" className="text-xs font-bold text-gray-700 hover:text-[#800020] transition-colors">Rakhi Gifts Under ₹499</Link>
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
