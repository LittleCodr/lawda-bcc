"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import ProductImageGallery from "@/components/ProductImageGallery";
import { Gift, ShieldCheck, Truck, Star, Heart, CheckCircle2, ChevronRight, ChevronDown, ShoppingBag, Zap, Clock, Smile, Award, Users, Flame, Sparkles, Gem, Lock } from "lucide-react";
import { logAppEvent, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ZoomableImage from "@/components/ZoomableImage";

interface ProductUIProps {
  product: any;
}

export default function ProductUI({ product }: ProductUIProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );

  // Marketing & FOMO States
  const [timeLeft, setTimeLeft] = useState({ hours: "02", minutes: "43", seconds: "19" });
  const [liveViewers, setLiveViewers] = useState(36);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    router.prefetch("/checkout");
  }, [router]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
      const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, "0");
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");
      setTimeLeft({ hours, minutes, seconds });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setLiveViewers(Math.floor(Math.random() * 14) + 27);
    }, 12000);
    return () => clearInterval(viewerInterval);
  }, []);

  const copyPromoCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      toast.success(`Coupon code ${code} copied!`);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

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
  const perfumeHandles = ['overlord', 'paradox', 'rhapsody', 'your-move', 'somersault', 'promised', 'outlaw', 'mirage', 'darling-women'];
  const isPerfume = perfumeHandles.includes(product.handle) || product.product_type?.toLowerCase() === 'perfume' || (product.tags || []).some((t: string) => typeof t === 'string' && (t.toLowerCase().includes('perfume') || t.toLowerCase().includes('harsh beniwal')));
  const isNamePersonalised = !isPerfume && (productTitleLower.includes('name') || productTitleLower.includes('initial') || product.handle === '12-in-1-jhumkas-box');
  const isPhotoPersonalised = !isPerfume && (productTitleLower.includes('photo') || productTitleLower.includes('picture'));
  const isRing = productTitleLower.includes('ring');
  const showNameInput = !isPerfume && (isNamePersonalised || !isRing);

  const basePrice = selectedVariant ? parseFloat(selectedVariant.price) : 0;
  const compareAtPrice = selectedVariant?.compare_at_price ? parseFloat(selectedVariant.compare_at_price) : (basePrice * 1.4);
  const discountPercent = Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100);

  const currentPrice = basePrice + (isGift ? 249 : 0);

  const activeImageId = selectedVariant?.image_id || null;

  const images = product.images?.map((img: any) => ({
    src: img.local_src || img.localPath || img.src || img.url,
    alt: img.alt || product.title,
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

  const handleBuyNow = () => {
    if (!selectedVariant || isButtonDisabled) return;
    handleAddToCart();
    router.push("/checkout");
  };

  const isPersonalizationComplete =
    (!showNameInput || customName.trim().length > 0) &&
    (!isPhotoPersonalised || customPhotoUrl.length > 0);

  const isButtonDisabled = !isAvailable || !selectedVariant || !isPersonalizationComplete || isUploading;

  return (
    <div className="bg-white text-[#222222] min-h-screen">
      {/* Breadcrumbs - Airbnb Subtle Hairline Path */}
      <nav className="flex items-center gap-2 text-[13px] text-[#6a6a6a] mb-6 mt-4">
        <Link href="/" className="hover:text-[#222222] hover:underline transition-colors">Home</Link>
        <span>/</span>
        <Link href={isPerfume ? "/harsh-beniwal/octopus/perfumes" : "/collections/all"} className="hover:text-[#222222] hover:underline transition-colors">
          {isPerfume ? "Octopus Perfumes" : "Collections"}
        </Link>
        <span>/</span>
        <span className="text-[#222222] font-medium truncate">{product.title}</span>
      </nav>

      {/* Main 2-Column Airbnb Listing Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Left Column (~64%): Image Gallery & Amenity Rows */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative">
            {/* Floating Guest Favorite Badge */}
            <div className="guest-favorite-badge">
              Guest favorite
            </div>
            
            <button
              onClick={toggleFavourite}
              disabled={isFavLoading}
              aria-label="Save to wishlist"
              className="heart-save-btn disabled:opacity-50"
            >
              <Heart size={18} fill={isFavourite ? "#ff385c" : "transparent"} className={isFavourite ? "text-[#ff385c]" : "text-[#222222]"} />
            </button>

            <ProductImageGallery images={images} selectedImageId={activeImageId} />
          </div>

          {/* Airbnb Amenity Rows */}
          <div className="border-y border-[#ebebeb] py-2 divide-y divide-[#ebebeb]">
            <div className="flex items-center gap-3.5 py-3.5">
              <Sparkles size={20} className="text-[#ff385c] shrink-0" />
              <div>
                <span className="text-[15px] font-semibold text-[#222222] block">25%+ French Fragrance Oils</span>
                <span className="text-[13px] text-[#6a6a6a]">Imported perfume essence for rich, all-day drydown</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 py-3.5">
              <Clock size={20} className="text-[#222222] shrink-0" />
              <div>
                <span className="text-[15px] font-semibold text-[#222222] block">12+ Hours Proven Longevity</span>
                <span className="text-[13px] text-[#6a6a6a]">Beast-mode projection specially formulated for Indian weather</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 py-3.5">
              <Gift size={20} className="text-[#ff385c] shrink-0" />
              <div>
                <span className="text-[15px] font-semibold text-[#222222] block">Free 7ML Paradox Discovery Tester (Worth ₹399)</span>
                <span className="text-[13px] text-[#6a6a6a]">Automatically included in every parcel at zero extra charge</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 py-3.5">
              <Truck size={20} className="text-[#222222] shrink-0" />
              <div>
                <span className="text-[15px] font-semibold text-[#222222] block">Free Pan-India Express Delivery</span>
                <span className="text-[13px] text-[#6a6a6a]">Dispatched today via BlueDart & Delhivery within 2-4 business days</span>
              </div>
            </div>
          </div>

          {/* Fragrance Specifications for Perfumes */}
          {isPerfume && (
            <div className="bg-[#f7f7f7] text-[#222222] rounded-[14px] p-6 border border-[#ebebeb] shadow-airbnb">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-[#ff385c]" />
                <span className="text-[11px] uppercase tracking-wider text-[#ff385c] font-bold">Harsh Beniwal x Octopus • 25%+ French Oil Concentration</span>
              </div>
              <p className="text-xs text-[#6a6a6a] leading-relaxed mb-4">
                {product.tagline || product.scentStory || "Crafted with imported French fragrance oils. 50ML Eau De Parfum formulated for maximum longevity, magnetic sillage, and IFRA skin safety."}
              </p>
              
              {product.notes && (
                <div className="pt-3 border-t border-[#dddddd] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left sm:text-center">
                  <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
                    <span className="text-[10px] uppercase tracking-wider text-[#6a6a6a] font-bold block mb-0.5">Top Notes</span>
                    <span className="text-[12px] text-[#222222] font-semibold block">{product.notes.top || "Citrus, Fresh Zest"}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
                    <span className="text-[10px] uppercase tracking-wider text-[#6a6a6a] font-bold block mb-0.5">Heart Notes</span>
                    <span className="text-[12px] text-[#222222] font-semibold block">{product.notes.heart || "Aromatic Spices, Florals"}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
                    <span className="text-[10px] uppercase tracking-wider text-[#6a6a6a] font-bold block mb-0.5">Base Notes</span>
                    <span className="text-[12px] text-[#222222] font-semibold block">{product.notes.base || "Amber, Woody Ambroxan"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Accordion Description */}
          <div className="border border-[#ebebeb] rounded-[14px] overflow-hidden bg-white">
            <button
              onClick={() => setIsDescOpen(!isDescOpen)}
              className="w-full flex items-center justify-between p-4 bg-[#f7f7f7] hover:bg-[#ebebeb] transition-colors"
            >
              <span className="font-semibold text-[#222222] text-xs uppercase tracking-wider">
                {isPerfume ? "Fragrance Story & Olfactory Notes" : "Product Description"}
              </span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDescOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isDescOpen ? 'max-h-[5000px] opacity-100 border-t border-[#ebebeb]' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 leading-relaxed">
                {isPerfume && product.scentStory && (
                  <div className="mb-4 text-sm text-[#3f3f3f] leading-relaxed font-sans">
                    <p className="font-semibold text-[#222222] mb-1">The Scent Story:</p>
                    <p className="text-[#6a6a6a]">{product.scentStory}</p>
                  </div>
                )}
                <div
                  className="prose prose-sm text-[#6a6a6a] leading-relaxed max-w-none text-justify"
                  dangerouslySetInnerHTML={{ __html: product.body_html || product.descriptionHtml || product.descriptionText || "" }}
                />
                {isPerfume && Array.isArray(product.goodToKnow) && product.goodToKnow.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#ebebeb]">
                    <p className="font-semibold text-[#222222] text-xs uppercase tracking-wider mb-2">Good To Know:</p>
                    <ul className="list-disc pl-5 text-xs text-[#6a6a6a] space-y-1">
                      {product.goodToKnow.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (~36%): Sticky Airbnb Reservation Card */}
        <div className="lg:col-span-5 lg:sticky top-24">
          <div className="bg-white border border-[#dddddd] rounded-[14px] p-6 sm:p-7 shadow-airbnb">
            
            {/* Price & Rating Header */}
            <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-[#ebebeb]">
              <div>
                <span className="text-[24px] sm:text-[28px] font-bold text-[#222222]">
                  ₹{currentPrice.toFixed(0)}
                </span>
                <span className="text-[14px] text-[#6a6a6a] font-normal"> / 50ML EDP</span>
                {compareAtPrice > basePrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[13px] text-[#6a6a6a] line-through">₹{compareAtPrice.toFixed(0)}</span>
                    <span className="text-[11px] font-bold text-[#ff385c] bg-[#fff0f3] px-2 py-0.5 rounded-full">
                      Save ₹{(compareAtPrice - currentPrice).toFixed(0)} ({discountPercent}% OFF)
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[14px] font-bold text-[#222222]">
                  <span>★</span>
                  <span>4.92</span>
                </div>
                <span className="text-[12px] text-[#6a6a6a] underline">284 reviews</span>
              </div>
            </div>

            {/* Listing Title & Category */}
            <h1 className="text-[20px] font-semibold text-[#222222] mb-1 leading-snug">
              {product.title}
            </h1>
            <p className="text-[13px] text-[#6a6a6a] mb-4">
              Harsh Beniwal 100% Original 50ML Eau De Parfum Collection
            </p>

            {/* Same-day dispatch live ticker */}
            <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-lg p-3 mb-5 flex items-center justify-between text-xs">
              <span className="text-[#222222] font-medium flex items-center gap-1.5">
                <Clock size={14} className="text-[#ff385c]" /> Same-day dispatch
              </span>
              <span className="font-mono font-bold text-[#222222]">
                {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
              </span>
            </div>

            {/* Option / Variant Selector */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-4">
                <label className="text-[12px] font-semibold uppercase text-[#222222] block mb-2">Select Variant</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                        selectedVariantId === variant.id
                          ? "border-[#222222] bg-[#222222] text-white shadow-sm"
                          : "border-[#dddddd] text-[#222222] hover:border-[#222222]"
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showNameInput && (
              <div className="mb-4 space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold uppercase text-[#222222] flex justify-between">
                    <span>{isNamePersonalised ? 'Name to Engrave' : 'Custom Name'}</span>
                    <span className="text-[#6a6a6a] font-normal">{customName.length}/7</span>
                  </label>
                  <input
                    type="text"
                    maxLength={7}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. HARSH"
                    className="border border-[#dddddd] focus:border-[#222222] rounded-lg px-3.5 py-2.5 text-sm text-[#222222] font-semibold outline-none transition-all placeholder:text-[#929292] placeholder:font-normal"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold uppercase text-[#222222]">Select Font</label>
                  <div className="flex flex-wrap gap-2">
                    {['font-italianno', 'font-alexbrush', 'font-pinyon', 'font-tangerine', 'font-satisfy'].map(fontClass => (
                      <button
                        key={fontClass}
                        onClick={() => setCustomFont(fontClass)}
                        className={`px-3 py-1.5 border rounded-lg text-center transition-all flex-1 min-w-[28%] ${
                          customFont === fontClass
                            ? 'border-[#222222] bg-[#f7f7f7] text-[#222222] font-bold'
                            : 'border-[#dddddd] text-[#6a6a6a] hover:border-[#222222]'
                        }`}
                      >
                        <span className={`text-xl leading-none ${fontClass}`}>Preview</span>
                      </button>
                    ))}
                  </div>
                </div>

                {customName && (
                  <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-lg p-3 text-center">
                    <span className="text-[10px] uppercase text-[#6a6a6a] block mb-1">Engraving Preview</span>
                    <p className={`text-2xl text-[#222222] ${customFont}`}>{customName}</p>
                  </div>
                )}
              </div>
            )}

            {isPhotoPersonalised && (
              <div className="mb-4 flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold uppercase text-[#222222]">Upload Photo</label>
                {customPhotoUrl ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#dddddd] group">
                    <img src={customPhotoUrl} alt="Custom Memory" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setCustomPhotoUrl("")} 
                      className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="relative border border-dashed border-[#dddddd] hover:border-[#222222] rounded-lg p-4 text-center bg-[#f7f7f7] cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-xs text-[#6a6a6a] font-medium">
                      {isUploading ? "Uploading..." : "+ Tap to choose photo"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Free Gift Strip - Diwali Festive Edition */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-3.5 mb-4 flex items-center gap-3 shadow-2xs">
              <span className="text-2xl shrink-0">🪔</span>
              <div className="text-left flex-1 min-w-0">
                <span className="text-[12px] font-bold text-amber-900 uppercase block">
                  Diwali Gift: Free 7ML Paradox Tester Included
                </span>
                <span className="text-[11px] text-[#3f3f3f] block leading-tight">
                  Worth ₹399 · Deluxe Festive Gift Packaging · Express Pan-India Delivery
                </span>
              </div>
            </div>

            {/* Promo Code Coupon Strip - DIWALI20 */}
            <div className="bg-white border-2 border-amber-300/80 rounded-xl p-3 mb-5 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase block">
                  Diwali Festive Coupon
                </span>
                <span className="text-[14px] font-extrabold text-[#222222] font-mono">
                  DIWALI20
                </span>
                <span className="text-[11px] font-semibold text-[#ff385c] ml-1.5">(20% Instant OFF)</span>
              </div>
              <button
                type="button"
                onClick={() => copyPromoCode("DIWALI20")}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                {copiedCode ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 mb-5">
              <button
                onClick={handleBuyNow}
                disabled={isButtonDisabled}
                className="w-full bg-[#ff385c] hover:bg-[#e00b41] active:scale-[0.99] text-white py-3.5 rounded-lg text-[15px] font-semibold shadow-sm hover:shadow-md transition-all disabled:bg-[#ffd1da] disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap size={17} className="fill-white" />
                <span>Buy Now (Instant Checkout)</span>
              </button>

              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className="w-full bg-white text-[#222222] border border-[#222222] hover:bg-[#f7f7f7] active:scale-[0.99] py-3.5 rounded-lg text-[15px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag size={17} />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Fee Breakdown Stack */}
            <div className="space-y-2 text-[14px] text-[#6a6a6a] pt-4 border-t border-[#ebebeb]">
              <div className="flex justify-between">
                <span>₹{currentPrice.toFixed(0)} × 1 bottle</span>
                <span className="text-[#222222] font-medium">₹{currentPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>7ML Paradox Tester Pack (₹399 value)</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Pan-India Express Shipping</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#ebebeb] text-[16px] font-bold text-[#222222]">
                <span>Total</span>
                <span>₹{currentPrice.toFixed(0)}</span>
              </div>
            </div>

            {/* 3 Micro Trust Notes */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#ebebeb] text-center text-[11px] text-[#6a6a6a]">
              <div>
                <Lock size={14} className="mx-auto text-[#222222] mb-1" />
                <span>100% Original</span>
              </div>
              <div>
                <Clock size={14} className="mx-auto text-[#222222] mb-1" />
                <span>12H Longevity</span>
              </div>
              <div>
                <Truck size={14} className="mx-auto text-[#222222] mb-1" />
                <span>Free Express</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Fragrance Lifestyle Proof Section */}
      <div className="mt-16 mb-8 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#ff385c] mb-1">THE OCTOPUS LUXURY EXPERIENCE</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222]">Crafted for presence, <span className="font-normal italic text-[#6a6a6a]">loved by 50,000+ perfume lovers</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { src: "/harsh-beniwal/octopus/perfumes/images/overlord_lifestyle.png", title: "Overlord EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/paradox_lifestyle.png", title: "Paradox EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/promised_lifestyle.png", title: "Promised EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/outlaw_lifestyle.png", title: "Outlaw EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/mirage_lifestyle.png", title: "Mirage EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/rhapsody_lifestyle.png", title: "Rhapsody EDP" }
          ].map((item, index) => (
            <div key={index} className="aspect-square relative rounded-[14px] overflow-hidden shadow-airbnb bg-[#f7f7f7] border border-[#ebebeb] group">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 max-w-4xl border border-[#ebebeb] rounded-[14px] overflow-hidden shadow-airbnb">
        <div className="flex items-center border-b border-[#ebebeb] bg-[#f7f7f7]">
          {['details', 'shipping', 'faqs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[11px] uppercase tracking-wider font-bold transition-all ${activeTab === tab
                ? 'bg-white text-[#ff385c] border-b-2 border-[#ff385c]'
                : 'text-[#6a6a6a] hover:bg-[#ebebeb] hover:text-[#222222]'
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
              <h4 className="text-sm font-bold text-[#222222] mb-3">Product Details & Specs</h4>
              <div className="prose prose-sm text-[#3f3f3f] text-justify leading-relaxed" dangerouslySetInnerHTML={{ __html: product.body_html || "" }} />
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#222222] mb-1.5">Free Express Pan-India Shipping</h4>
                <p className="text-sm text-[#3f3f3f] leading-relaxed">Free express Pan-India shipping on all prepaid orders. Each 50ML Eau De Parfum bottle and free 7ML Paradox tester pack is carefully packaged in our crush-resistant luxury presentation box. Orders placed before 4:00 PM are dispatched same-day via BlueDart / Delhivery / XpressBees air express.</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#222222] mb-1.5">Transit Times</h4>
                <p className="text-sm text-[#3f3f3f] leading-relaxed">Metro cities: 2-3 business days. Rest of India: 3-5 business days. You will receive live SMS and WhatsApp tracking updates as soon as your shipment departs our warehouse.</p>
              </div>
            </div>
          )}
          {activeTab === 'faqs' && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">How long does the fragrance last?</h4>
                <p className="text-sm text-[#3f3f3f] leading-relaxed">Our Eau De Parfums are formulated with 25%+ imported French perfume oil concentration, providing 12+ hours of beast-mode longevity on clothes and 8+ hours on skin with magnetic sillage.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">What is the complimentary 7ML Paradox tester?</h4>
                <p className="text-sm text-[#3f3f3f] leading-relaxed">Every order comes with a free 7ML Paradox Eau De Parfum discovery tester pack (worth ₹399). It is pocket-friendly, travel-ready, and lets you experience another iconic scent from Harsh Beniwal's collection!</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">Are these 100% authentic Harsh Beniwal perfumes?</h4>
                <p className="text-sm text-[#3f3f3f] leading-relaxed">Yes, this is the official Octopus by Harsh Beniwal store. All perfumes are 100% original, IFRA certified, and dermatologist-tested safe for daily skin application.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider mb-1">What payment methods do you accept?</h4>
                <p className="text-sm text-[#3f3f3f] leading-relaxed">We accept 100% secure online prepaid payments including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking with free express shipping across India.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supercharged Mobile Sticky Pricing & Instant Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#dddddd] px-3.5 sm:px-5 py-3 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto">
          
          {/* Left: Product Thumbnail & Live Price Stack */}
          <div className="flex items-center gap-2.5 min-w-0">
            {images.length > 0 && (
              <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-[#f7f7f7] border border-[#ebebeb]">
                <Image
                  src={images[0].src}
                  alt={product.title}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[17px] sm:text-[19px] font-bold text-[#222222] leading-none">
                  ₹{currentPrice.toFixed(0)}
                </span>
                {compareAtPrice > currentPrice && (
                  <span className="text-[12px] text-[#929292] line-through leading-none">
                    ₹{compareAtPrice.toFixed(0)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-bold text-[#ff385c] bg-[#fff0f3] px-1.5 py-0.5 rounded leading-none">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#6a6a6a] truncate mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock • Free 7ML Tester Pack
              </span>
            </div>
          </div>

          {/* Right: Instant Buy & Add to Cart Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="bg-white text-[#222222] border border-[#dddddd] hover:border-[#222222] p-2.5 sm:px-3 sm:py-2.5 rounded-lg active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 font-medium text-xs shadow-xs"
              aria-label="Add to Cart"
              title="Add to Cart"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">Add</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isButtonDisabled}
              className="bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white font-semibold py-2.5 px-4 sm:px-6 rounded-lg text-[13px] sm:text-[14px] shadow-sm hover:shadow-md transition-all disabled:bg-[#ffd1da] cursor-pointer flex items-center gap-1.5"
            >
              <Zap size={15} className="fill-white" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden"></div>

    </div >
  );
}
