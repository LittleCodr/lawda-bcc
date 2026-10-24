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
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-8 mt-4">
        <Link href="/" className="hover:text-[#800020] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href={isPerfume ? "/harsh-beniwal/octopus/perfumes" : "/collections/all"} className="hover:text-[#800020] transition-colors">
          {isPerfume ? "Harsh Beniwal Octopus Perfumes" : "Gifts"}
        </Link>
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">Free Express Shipping</span>
                <span className="text-[9px] text-gray-500">Pan-India delivery in 2-4 days</span>
              </div>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-amber-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900">100% French EDP Oils</span>
                <span className="text-[9px] text-stone-500">12+ Hours Projection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col pt-2">


          {/* Social Proof & Rating Bar */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs font-black text-stone-900">4.9/5</span>
            <span className="text-xs text-stone-500 font-medium">(284+ Reviews)</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200 ml-auto flex items-center gap-1">
              <CheckCircle2 size={11} /> 100% Official
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-[#2d2d2d] mb-2 leading-tight">
            {product.title}
          </h1>

          {/* Live Activity & Scarcity Ticker */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded-full font-bold text-[10px]">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <Flame size={12} className="text-rose-600 fill-rose-600" />
              <span>{liveViewers} people viewing right now</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-full font-bold text-[10px]">
              <Zap size={12} className="text-amber-600 fill-amber-500" />
              <span>Only 4 units left at offer price!</span>
            </div>
          </div>

          {/* Perfume Quality Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-300 flex items-center gap-1 shadow-sm">
              <Sparkles size={12} className="text-amber-600" /> 25%+ French Fragrance Oils
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-300">
              50ML Eau De Parfum
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
              12H+ Beast Longevity
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl font-black text-[#800020]">₹{currentPrice.toFixed(0)}</span>
            {compareAtPrice > basePrice && (
              <>
                <span className="text-base text-gray-400 line-through font-medium">₹{compareAtPrice.toFixed(0)}</span>
                <span className="text-[10px] uppercase font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 flex items-center gap-1">
                   <Sparkles size={12} /> Save ₹{(compareAtPrice - currentPrice).toFixed(0)} ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Express Same-Day Dispatch Countdown */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500/30 rounded-xl p-3 mb-5 flex items-center gap-3 shadow-sm">
            <div className="bg-emerald-600 text-white p-2 rounded-lg shrink-0 shadow-sm">
              <Clock size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-950 uppercase tracking-wide text-[10px]">
                  ⚡ Same-Day Dispatch Guaranteed
                </span>
                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                  Free Express Shipping
                </span>
              </div>
              <p className="text-emerald-900 text-xs font-semibold mt-0.5 leading-snug">
                Order within <span className="font-mono font-black text-emerald-950 bg-white px-1.5 py-0.5 rounded border border-emerald-200">{timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</span> for instant dispatch today!
              </p>
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
                    <span>{isNamePersonalised ? 'Enter Name to Engrave' : 'Enter Name for Customization'}</span>
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
            {!isPerfume && (
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
            )}
          </div>

          {/* Free 7ML Paradox Tester Promo */}
          <div className="backdrop-blur-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white border border-amber-400/50 rounded-2xl p-4 mb-6 relative overflow-hidden shadow-xl shadow-amber-500/10">
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-16 h-16 bg-stone-800/80 rounded-xl overflow-hidden border border-amber-400/30 shrink-0 p-1 flex items-center justify-center backdrop-blur-sm">
                <img src="/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png" alt="Free 7ML Paradox Tester" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1 shadow-sm">
                  <Gift size={11} className="fill-stone-950" /> FREE GIFT • WORTH ₹399
                </div>
                <h4 className="font-serif font-bold text-sm text-amber-200 leading-tight">
                  7ML Paradox EDP Luxury Tester Pack
                </h4>
                <p className="text-stone-300 text-xs leading-snug mt-1">
                  Harsh Beniwal's 12H luxury EDP tester is <strong className="text-amber-400">added 100% FREE</strong> to your parcel with this order!
                </p>
              </div>
            </div>
          </div>

          {/* Diwali Festive Special Promo with 1-Click Copy */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 rounded-2xl p-4 sm:p-5 mb-6 relative overflow-hidden shadow-lg shadow-amber-500/5">
            <div className="flex items-start gap-3 relative z-10">
              <div className="bg-amber-400/20 text-amber-800 p-2.5 rounded-xl border border-amber-400/30 shrink-0 backdrop-blur-md">
                <Gift size={22} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-stone-950 font-bold text-xs sm:text-sm mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🪔</span> DIWALI FESTIVE SPECIAL • 20% OFF
                </h4>
                <p className="text-stone-800 text-xs font-medium leading-relaxed mb-2">
                  Use code <strong className="font-mono bg-stone-900 text-amber-300 px-2 py-0.5 rounded-md border border-stone-800 shadow-sm">DIWALI20</strong> at checkout for flat <strong className="text-stone-950 font-bold">20% OFF</strong>!
                </p>
                <button
                  type="button"
                  onClick={() => copyPromoCode("DIWALI20")}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-stone-950 to-stone-900 text-white hover:text-amber-300 text-[10px] uppercase font-bold px-3.5 py-1.5 rounded-xl border border-stone-800 shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{copiedCode ? "Copied to Clipboard! ✓" : "Tap to Copy Code: DIWALI20"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sm:gap-4 mb-3">
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-stone-900 to-stone-950 text-white py-4 px-3 uppercase tracking-wider text-[11px] font-bold rounded-2xl border border-stone-800 shadow-lg shadow-black/15 hover:border-amber-400/40 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingBag size={16} className="shrink-0 stroke-[2.2]" />
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
              onClick={handleBuyNow}
              disabled={isButtonDisabled}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 py-4 px-3 uppercase tracking-wider text-[11px] font-black rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap size={16} className="fill-stone-950 stroke-stone-950 shrink-0" />
              <span className="text-center leading-tight">Buy Now</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 mt-4">
             <div className="flex flex-col items-center justify-center text-center gap-1.5 backdrop-blur-xl bg-white/80 p-3 rounded-2xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <Lock size={16} className="text-amber-700 stroke-[2.2]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-stone-800">
                  {isPerfume ? "100% Original EDP" : "Secure Checkout"}
                </span>
             </div>
             <div className="flex flex-col items-center justify-center text-center gap-1.5 backdrop-blur-xl bg-white/80 p-3 rounded-2xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <ShieldCheck size={16} className="text-emerald-700 stroke-[2.2]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-stone-800">
                  12H+ Longevity
                </span>
             </div>
             <div className="flex flex-col items-center justify-center text-center gap-1.5 backdrop-blur-xl bg-white/80 p-3 rounded-2xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <Truck size={16} className="text-amber-700 stroke-[2.2]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-stone-800">
                  Fast Express Pan-India
                </span>
             </div>
          </div>
          
          {/* Fragrance Specifications for Perfumes / Delivery Tracker for Keepsakes */}
          {isPerfume ? (
            <div className="mt-8 mb-6 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-6 border border-amber-500/20 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-amber-400" />
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Harsh Beniwal x Octopus • 25%+ French Oil Concentration</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                {product.tagline || product.scentStory || "Crafted with imported French fragrance oils. 50ML Eau De Parfum formulated for maximum longevity, magnetic sillage, and IFRA skin safety."}
              </p>
              
              {product.notes && (
                <div className="pt-3 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left sm:text-center">
                  <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-700/50">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block mb-0.5">Top Notes</span>
                    <span className="text-[11px] text-amber-200 font-medium block">{product.notes.top || "Citrus, Fresh Zest"}</span>
                  </div>
                  <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-700/50">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block mb-0.5">Heart Notes</span>
                    <span className="text-[11px] text-amber-200 font-medium block">{product.notes.heart || "Aromatic Spices, Florals"}</span>
                  </div>
                  <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-700/50">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block mb-0.5">Base Notes</span>
                    <span className="text-[11px] text-amber-200 font-medium block">{product.notes.base || "Amber, Woody Ambroxan"}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Premium Progress Tracker */}
              <div className="mt-8 mb-10 bg-gradient-to-br from-[#fdfaf8] to-white rounded-2xl p-6 border border-[#800020]/10 shadow-[0_8px_30px_rgb(128,0,32,0.04)] relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#800020]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative max-w-sm mx-auto">
                  <div className="absolute top-3 left-1/6 right-1/6 h-[2px] bg-gray-200 rounded-full"></div>
                  <div className="absolute top-3 left-1/6 w-1/3 h-[2px] bg-gradient-to-r from-[#800020] to-[#d81b60] rounded-full shadow-[0_0_8px_rgba(128,0,32,0.3)]"></div>
                  <div className="flex justify-between relative z-10">
                    <div className="flex flex-col items-center flex-1 group">
                      <div className="w-6 h-6 rounded-full bg-white border-[3px] border-[#800020] flex items-center justify-center shadow-[0_0_12px_rgba(128,0,32,0.2)] relative transition-transform duration-300 group-hover:scale-110">
                        <div className="w-2 h-2 rounded-full bg-[#800020]"></div>
                        <div className="absolute -inset-1.5 rounded-full border border-[#800020]/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                      </div>
                      <div className="text-center mt-3">
                        <span className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1 transition-colors group-hover:text-[#800020]">Order Placed</span>
                        <span className="block text-[9px] font-bold text-[#800020] bg-[#800020]/5 border border-[#800020]/10 px-2 py-0.5 rounded-full inline-block shadow-sm">Today</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center flex-1 group">
                      <div className="w-6 h-6 rounded-full bg-white border-[3px] border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:border-gray-300 group-hover:scale-110">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                      </div>
                      <div className="text-center mt-3">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-hover:text-gray-600">Shipped</span>
                        <span className="block text-[9px] font-medium text-gray-500">Tomorrow Eve</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center flex-1 group">
                      <div className="w-6 h-6 rounded-full bg-white border-[3px] border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:border-gray-300 group-hover:scale-110">
                      </div>
                      <div className="text-center mt-3">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-hover:text-gray-600">Delivered</span>
                        <span className="block text-[9px] font-medium text-gray-500">In 3-5 Days</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#800020]/5 flex justify-center relative z-10">
                   <div className="bg-white/80 backdrop-blur-sm border border-[#800020]/10 shadow-sm rounded-full px-4 py-1.5 flex items-center gap-2 hover:shadow-md transition-shadow">
                     <Sparkles size={12} className="text-[#800020] animate-pulse" />
                     <span className="text-[10px] font-medium text-gray-700 italic">Handcrafted to order. Not picked from a shelf.</span>
                   </div>
                </div>
              </div>
              <p className="text-center text-xs font-serif italic text-gray-500 mt-4 mb-6">"Imagine her smile when she opens this personalized keepsake. Guaranteed to be her favorite gift."</p>
            </>
          )}

          {/* Accordion Description */}
          <div className="mb-8 border border-stone-200 rounded-lg overflow-hidden bg-white mt-4">
            <button
              onClick={() => setIsDescOpen(!isDescOpen)}
              className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <span className="font-bold text-[#2d2d2d] uppercase tracking-widest text-[10px]">
                {isPerfume ? "Fragrance Story & Notes" : "Product Description"}
              </span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDescOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isDescOpen ? 'max-h-[5000px] opacity-100 border-t border-stone-200' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 leading-relaxed">
                {isPerfume && product.scentStory && (
                  <div className="mb-4 text-sm text-stone-700 leading-relaxed font-sans">
                    <p className="font-semibold text-stone-900 mb-2">The Scent Story:</p>
                    <p className="text-stone-600">{product.scentStory}</p>
                  </div>
                )}
                <div
                  className="prose prose-sm text-gray-600 leading-relaxed max-w-none text-justify"
                  dangerouslySetInnerHTML={{ __html: product.body_html || product.descriptionHtml || product.descriptionText || "" }}
                />
                {isPerfume && Array.isArray(product.goodToKnow) && product.goodToKnow.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <p className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-2">Good To Know:</p>
                    <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
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


      </div>

      {/* Fragrance Lifestyle Proof Section */}
      <div className="mt-16 mb-8 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-1">THE OCTOPUS LUXURY EXPERIENCE</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[#2d2d2d]">Crafted for presence, <span className="italic">loved by 50,000+ perfume lovers</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {[
            { src: "/harsh-beniwal/octopus/perfumes/images/overlord_lifestyle.png", title: "Overlord EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/paradox_lifestyle.png", title: "Paradox EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/promised_lifestyle.png", title: "Promised EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/outlaw_lifestyle.png", title: "Outlaw EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/mirage_lifestyle.png", title: "Mirage EDP" },
            { src: "/harsh-beniwal/octopus/perfumes/images/rhapsody_lifestyle.png", title: "Rhapsody EDP" }
          ].map((item, index) => (
            <div key={index} className="aspect-square relative rounded-xl overflow-hidden shadow-sm bg-stone-900 border border-black/10 group">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/30">
                {item.title}
              </div>
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
              <p className="text-sm text-gray-600 mb-6 text-justify">Free express Pan-India shipping on all prepaid orders. Each 50ML Eau De Parfum bottle and free 7ML Paradox tester pack is carefully packaged in our crush-resistant luxury presentation box. Orders placed before 4:00 PM are dispatched on the same day via BlueDart / Delhivery / XpressBees air express.</p>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Transit Time</h4>
              <p className="text-sm text-gray-600 text-justify">Metro cities: 2-3 business days. Rest of India: 3-5 business days. You will receive live SMS and WhatsApp tracking updates as soon as your shipment departs our warehouse.</p>
            </div>
          )}
          {activeTab === 'faqs' && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">How long does the fragrance last?</h4>
                <p className="text-sm text-gray-600">Our Eau De Parfums are formulated with 25%+ imported French perfume oil concentration, providing 12+ hours of beast-mode longevity on clothes and 8+ hours on skin with magnetic sillage.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">What is the complimentary 7ML Paradox tester?</h4>
                <p className="text-sm text-gray-600">Every order comes with a free 7ML Paradox Eau De Parfum discovery tester pack (worth ₹399). It is pocket-friendly, travel-ready, and lets you experience another iconic scent from Harsh Beniwal's collection!</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Are these 100% authentic Harsh Beniwal perfumes?</h4>
                <p className="text-sm text-gray-600">Yes, this is the official Octopus by Harsh Beniwal store. All perfumes are 100% original, IFRA certified, and dermatologist-tested safe for daily skin application.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">What payment methods do you accept?</h4>
                <p className="text-sm text-gray-600">We accept 100% secure online prepaid payments including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking with free express shipping across India.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Add To Cart / Buy Now Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-white/80 px-3.5 py-2.5 md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.08)] pb-[calc(10px+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-2.5 max-w-lg mx-auto">
          <div className="relative w-12 h-12 bg-white/90 rounded-xl border border-white/80 overflow-hidden shrink-0 shadow-sm">
            <Image
              src={images.length > 0 ? (images[0].src || "/logo.png") : "/logo.png"}
              alt={product.title}
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="font-bold text-[11px] text-stone-950 truncate leading-tight">{product.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-black text-amber-700">₹{currentPrice.toFixed(0)}</span>
              {compareAtPrice > basePrice && (
                <>
                  <span className="text-[10px] text-stone-400 line-through">₹{compareAtPrice.toFixed(0)}</span>
                  <span className="text-[8px] font-bold text-emerald-800 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="bg-stone-900 text-white p-3 rounded-xl border border-stone-800 shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center hover:bg-stone-800"
              aria-label="Add to Cart"
            >
              <ShoppingBag size={16} className="stroke-[2.2]" />
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isButtonDisabled}
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-black py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/25 text-[11px] uppercase tracking-wider active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Zap size={14} className="fill-stone-950 stroke-stone-950" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-16 md:hidden"></div>

    </div >
  );
}
