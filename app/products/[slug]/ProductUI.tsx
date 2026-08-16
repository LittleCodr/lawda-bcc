"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import ProductImageGallery from "@/components/ProductImageGallery";
import { Gift, ShieldCheck, Truck, Star, Heart, CheckCircle2, ChevronRight, ChevronDown, ShoppingBag, Zap, Clock, Smile, Award, Users, Flame, Sparkles, Gem, Info, Lock } from "lucide-react";
import { logAppEvent, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import ZoomableImage from "@/components/ZoomableImage";

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
  const [customFont, setCustomFont] = useState("font-italianno");
  // Tabs state
  const [activeTab, setActiveTab] = useState("details");

  const { user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
  const isRing = productTitleLower.includes('ring');
  const showNameInput = isNamePersonalised || !isRing;

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
      customName: showNameInput ? customName : undefined,
      customPhotoUrl: isPhotoPersonalised ? customPhotoUrl : undefined,
      customFont: showNameInput ? customFont : undefined,
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
    (!showNameInput || customName.trim().length > 0) &&
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

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-6 lg:sticky top-24">
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
              <span className="flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full font-bold text-[10px]">₹</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Cash on Delivery Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col pt-2">

          {product.handle === "fairy-name-necklace" && (
            <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-[2px] rounded-xl mb-6 shadow-lg animate-pulse">
              <div className="bg-white rounded-[10px] p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-red-600 mb-1">
                  <Sparkles size={20} className="fill-current" />
                  <h3 className="font-black tracking-widest uppercase text-lg">Independence Day</h3>
                  <Sparkles size={20} className="fill-current" />
                </div>
                <p className="text-xl font-black text-gray-900 uppercase tracking-widest mt-1">
                  Mega Offer Sale
                </p>

              </div>
            </div>
          )}


          <h1 className="font-serif text-3xl md:text-4xl text-[#2d2d2d] mb-2 leading-tight">
            {product.title}
          </h1>
          {(product.title || "").toLowerCase().includes('name necklace') && (
            <div className="flex items-center gap-2 mb-4 relative">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#b8860b] bg-[#fdf5e6] px-2.5 py-1 rounded-sm border border-[#f5deb3] flex items-center gap-1">
                22k Gold Plated
                <button onClick={() => setIsInfoModalOpen(true)} className="text-[#b8860b] hover:text-[#800020] transition-colors md:group">
                   <Info size={12} />
                   <div className="hidden md:group-hover:block absolute top-full left-0 mt-2 w-72 bg-white border border-[#b8860b]/30 shadow-xl rounded-lg p-4 z-50 normal-case tracking-normal">
                      <p className="font-serif font-bold text-[#b8860b] mb-1">An Everlasting Keepsake</p>
                      <p className="text-gray-600 text-xs leading-relaxed mb-2">This isn't just jewelry; it's a memory crafted to last forever. Triple-plated with real 22K Gold and sealed with an advanced anti-tarnish shield, it's designed to be worn daily without losing its shine.</p>
                      <p className="text-gray-500 text-[10px] italic">Over 15,000+ sisters wear our pieces every day. Give a gift that stays as beautiful as your bond.</p>
                   </div>
                </button>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-sm border border-gray-200">
                Anti Tarnish
              </span>
              
              {/* Mobile Info Modal */}
              {isInfoModalOpen && (
                 <div className="md:hidden fixed inset-0 z-[100] flex items-end justify-center bg-black/50" onClick={() => setIsInfoModalOpen(false)}>
                    <div className="bg-white w-full rounded-t-2xl p-6 border-t border-[#b8860b]/30 shadow-2xl animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="font-serif font-bold text-xl text-[#b8860b]">An Everlasting Keepsake</h3>
                          <button onClick={() => setIsInfoModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                       </div>
                       <p className="text-gray-600 text-sm leading-relaxed mb-4 text-justify">This isn't just jewelry; it's a memory crafted to last forever. Triple-plated with real 22K Gold and sealed with an advanced anti-tarnish shield, it's designed to be worn daily without losing its shine.</p>
                       <p className="text-gray-500 text-xs italic bg-[#fdfaf8] p-3 rounded-lg border border-[#800020]/10">Over 15,000+ sisters wear our pieces every day. Give a gift that stays as beautiful as your bond.</p>
                    </div>
                 </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-[#800020]">₹{currentPrice.toFixed(2)}</span>
            {compareAtPrice > basePrice && (
              <>
                <span className="text-sm text-gray-400 line-through font-medium">₹{compareAtPrice.toFixed(2)}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-200 flex items-center gap-1">
                   <Sparkles size={12} /> You Save ₹{(compareAtPrice - currentPrice).toFixed(0)} ({discountPercent}%)
                </span>
              </>
            )}
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
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border rounded-md transition-all duration-300 ${selectedVariantId === variant.id
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

            {showNameInput && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#2d2d2d] flex justify-between">
                    <span>{isNamePersonalised ? 'Enter Name to Engrave' : 'Enter Name for Free Ring'}</span>
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
                  <div className="flex flex-wrap gap-2">
                    {['font-italianno', 'font-alexbrush', 'font-pinyon', 'font-tangerine', 'font-satisfy'].map(fontClass => (
                      <button
                        key={fontClass}
                        onClick={() => setCustomFont(fontClass)}
                        className={`px-3 py-2 border rounded-md text-center transition-all flex-1 min-w-[30%] ${customFont === fontClass
                          ? 'border-[#800020] bg-[#fdfaf8] text-[#800020] shadow-sm'
                          : 'border-gray-200 text-gray-500 hover:border-[#800020]'
                          }`}
                      >
                        <span className={`text-2xl leading-none ${fontClass}`}>
                          {fontClass === 'font-italianno' ? 'Italianno' :
                            fontClass === 'font-alexbrush' ? 'Alex Brush' :
                              fontClass === 'font-pinyon' ? 'Pinyon' :
                                fontClass === 'font-tangerine' ? 'Tangerine' : 'Satisfy'}
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

          {/* Free Ring Promo */}
          {!productTitleLower.includes('ring') && (
            <div className="bg-[#fdfaf8] border border-[#800020]/30 rounded-xl p-4 mb-6 flex items-center gap-4 relative overflow-hidden group shadow-sm">
              <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[#800020]/20 bg-white">
                <ZoomableImage src="https://cdn.shopify.com/s/files/1/0277/7019/2008/products/fpetnb-127-adjustable-paw-print-and-name-ring-1-1631952212-975255350.jpg?v=1667301766" alt="Free Ring" />
              </div>
              <div className="flex-1">
                <h4 className="text-[#800020] font-bold text-sm mb-1 uppercase tracking-widest flex items-center gap-2">
                  <Gift size={14} className="inline-block" /> Free Gift
                </h4>
                <p className="text-[#2d2d2d] text-xs font-medium leading-relaxed">
                  Get a <a href="https://octopusperfume.in/products/18k-paw-name-ring" target="_blank" rel="noopener noreferrer" className="text-[#800020] underline font-bold">FREE 18K Paw Name Ring</a>{isNamePersonalised ? ' with your name engraved!' : '!'} (Added automatically to cart)
                </p>
              </div>
            </div>
          )}

          {/* Rakhi Special Promo */}
          {isNamePersonalised && productTitleLower.includes('necklace') && product.handle !== 'fairy-name-necklace' && (
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
                    Brother, use secret code <strong className="font-black text-[#800020] bg-white px-2 py-0.5 rounded border border-[#800020]/20">ILYBEHENA</strong> at checkout to get an extra <strong className="text-[#800020]">15% OFF</strong> on orders above ₹499!
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Action Buttons */}
          <div className="flex gap-4 mb-2">
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="flex-1 flex items-center justify-center gap-2 bg-[#800020] text-white py-4 px-2 uppercase tracking-widest text-[10px] font-bold rounded-lg hover:bg-[#600018] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} className="shrink-0" />
              <span className="text-center leading-tight">
                {!isAvailable
                  ? "Sold Out"
                  : isUploading
                    ? "Uploading..."
                    : !isPersonalizationComplete
                      ? "Personalize to Add"
                      : "Add to Cart"}
              </span>
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="flex-1 flex items-center justify-center border border-[#800020] text-[#800020] py-4 px-2 uppercase tracking-widest text-[10px] font-bold rounded-lg hover:bg-[#800020] hover:text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-center leading-tight">Buy Now</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 mt-4">
             <div className="flex flex-col items-center justify-center text-center gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <Lock size={16} className="text-[#800020]" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-600">100% Secure Checkout</span>
             </div>
             <div className="flex flex-col items-center justify-center text-center gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <Truck size={16} className="text-[#800020]" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-600">Fast Dispatch</span>
             </div>
             <div className="flex flex-col items-center justify-center text-center gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <Sparkles size={16} className="text-[#800020]" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-600">Premium Anti-Tarnish</span>
             </div>
          </div>
          
          {/* Progress Tracker */}
          <div className="mt-6 mb-6 bg-stone-50 rounded-xl p-6 border border-stone-100">
            <div className="flex items-center justify-between relative max-w-sm mx-auto">
              <div className="absolute left-6 right-6 top-1.5 h-0.5 bg-gray-200 -z-10"></div>
              <div className="absolute left-6 right-1/2 top-1.5 h-0.5 bg-stone-800 -z-10"></div>
              
              <div className="flex flex-col items-center flex-1">
                <div className="w-3 h-3 rounded-full bg-stone-800 border-2 border-stone-50 box-content"></div>
                <span className="text-[10px] font-bold text-gray-900 mt-2 text-center">Order Placed</span>
                <span className="text-[9px] text-gray-500">Today</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-3 h-3 rounded-full bg-stone-50 border-2 border-gray-300 box-content"></div>
                <span className="text-[10px] font-bold text-gray-900 mt-2 text-center">Shipped</span>
                <span className="text-[9px] text-gray-500">Tomorrow evening</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-3 h-3 rounded-full bg-stone-50 border-2 border-gray-300 box-content"></div>
                <span className="text-[10px] font-bold text-gray-900 mt-2 text-center">Delivered</span>
                <span className="text-[9px] text-gray-500">In 3-5 days</span>
              </div>
            </div>
            <p className="text-center text-[9px] italic text-gray-500 mt-4 flex justify-center items-center gap-1">
              ✨ Each piece is carefully crafted to order. Not picked from a shelf.
            </p>
          </div>
          
          <p className="text-center text-xs font-serif italic text-gray-500 mt-4 mb-6">"Imagine her smile when she opens this personalized keepsake. Guaranteed to be her favorite gift."</p>


          {/* Accordion Description - Moved Below */}
          <div className="mb-8 border border-stone-200 rounded-lg overflow-hidden bg-white mt-4">
            <button
              onClick={() => setIsDescOpen(!isDescOpen)}
              className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <span className="font-bold text-[#2d2d2d] uppercase tracking-widest text-[10px]">Product Description</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDescOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isDescOpen ? 'max-h-[5000px] opacity-100 border-t border-stone-200' : 'max-h-0 opacity-0'}`}>
              <div
                className="prose prose-sm text-gray-600 p-6 leading-relaxed max-w-none text-justify"
                dangerouslySetInnerHTML={{ __html: product.body_html || "" }}
              />
            </div>
          </div>

        </div>


      </div>

      {/* Social Proof Section */}
      <div className="mt-16 mb-8 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">REAL GIFTING MOMENTS</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[#2d2d2d]">2 Lakh+ sisters have <span className="italic">received this gift</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {[
            "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Still_2026-03-18_155922_2.8.1.png?v=1774435784&width=300",
            "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/2_540119ee-180a-4c97-be0b-7471fa4138e2.jpg?v=1774435875&width=300",
            "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/Name_Necklace_3.jpg?v=1774435972&width=300",
            "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/6.jpg?v=1774436053&width=300",
            "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/image_3_59ac7156-ef01-4ccf-8e70-b440a413b90d.png?v=1774436174&width=300",
            "https://cdn.shopify.com/s/files/1/0277/7019/2008/files/image_4.png?v=1774436221&width=300"
          ].map((src, index) => (
            <div key={index} className="aspect-square relative rounded-xl overflow-hidden shadow-sm bg-gray-100">
              <img src={src} alt={`Customer moment ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 max-w-4xl border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center border-b border-gray-200 bg-gray-50/50">
          {['details', 'shipping', 'faqs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === tab
                ? 'bg-white text-[#800020] border-b-2 border-[#800020]'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              {tab === 'details' ? 'Product Details' :
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

          {activeTab === 'shipping' && (
            <div className="animate-in fade-in duration-300">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Shipping Information</h4>
              <p className="text-sm text-gray-600 mb-6 text-justify">Free standard shipping on all orders. Personalised items take 3-5 business days to craft before shipping to ensure perfection. Once shipped, domestic delivery takes 2-5 days across India, and international delivery takes up to 7 days.</p>
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

    </div >
  );
}
