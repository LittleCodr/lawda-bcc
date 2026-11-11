"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPriceINR } from "@/lib/catalog-types";
import { trackEcommerceEvent } from "@/lib/analytics";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    autoDiscountPercentage,
    autoDiscountAmount,
    discountedTotal,
  } = useCartStore();

  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const subtotal = totalPrice();
  const count = totalItems();
  const discountPct = autoDiscountPercentage();
  const discountAmt = autoDiscountAmount();
  const finalTotal = discountedTotal();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const panel = dialogRef.current?.firstElementChild;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsOpen(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      data-side="right"
      onCancel={(e) => {
        e.preventDefault();
        setIsOpen(false);
      }}
      onClick={handleBackdropClick}
      aria-label="Shopping bag"
      className="fc-drawer"
    >
      <div className="ml-auto fc-drawer-panel w-full max-w-md h-full bg-white flex flex-col border-l border-[#E8E6E1] shadow-2xl">
        {/* Drawer Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E8E6E1] flex items-center justify-between bg-[#F7F6F3]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-[#242424]" />
            <h2 className="font-serif text-xl font-semibold text-[#242424]">
              Your Bag ({count})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close shopping bag"
            className="p-2 rounded-full hover:bg-white border border-transparent hover:border-[#E8E6E1] text-[#242424] transition-colors cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        {/* Tiered Bundle Progress Bar */}
        {items.length > 0 && (
          <div className="px-5 sm:px-6 py-3 bg-[#F5EFE6] border-b border-[#E8E6E1] text-xs text-[#242424]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#9A7953]" />
                {count >= 3
                  ? "33% Mega Bundle Discount Unlocked!"
                  : count === 2
                    ? "15% OFF Unlocked! Add 1 more bottle for 33% OFF"
                    : "Add 1 more perfume to unlock 15% OFF"}
              </span>
              <span className="text-[11px] font-bold text-[#9A7953]">
                {count >= 3 ? "MAX TIER" : `${count}/3`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E8E6E1] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9A7953] transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((count / 3) * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F7F6F3] border border-[#E8E6E1] flex items-center justify-center">
                <ShoppingBag size={24} className="text-[#9A7953]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#242424] mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#777777] max-w-xs mx-auto leading-relaxed">
                  Every order includes free pan-India express shipping and a complimentary 7ML Paradox EDP tester.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 pt-2">
                <Link
                  href="/collections/bestsellers"
                  onClick={() => setIsOpen(false)}
                  className="btn-luxury-primary py-3 text-xs w-full"
                >
                  Shop Bestselling Scents
                </Link>
                <Link
                  href="/harsh-beniwal/octopus/perfumes"
                  onClick={() => setIsOpen(false)}
                  className="btn-luxury-secondary py-2.5 text-xs w-full"
                >
                  Explore Harsh Beniwal × Octopus
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Line Items */}
              <div className="divide-y divide-[#E8E6E1]">
                {items.map((item) => {
                  const key = item.cartItemId || item.id;
                  return (
                    <div key={key} className="py-4 first:pt-0 flex gap-3.5 items-start">
                      <div className="w-20 h-20 rounded-[8px] bg-[#F7F6F3] border border-[#E8E6E1] p-1.5 shrink-0 flex items-center justify-center">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-[13px] font-semibold text-[#242424] leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              trackEcommerceEvent("remove_from_cart", {
                                value: item.price * item.quantity,
                                items: [
                                  {
                                    item_id: item.id,
                                    item_name: item.title,
                                    item_variant: item.variantTitle,
                                    price: item.price,
                                    quantity: item.quantity,
                                  },
                                ],
                              });
                              removeItem(key);
                            }}
                            aria-label={`Remove ${item.title}`}
                            className="text-[#96928B] hover:text-[#B83232] transition-colors p-1 shrink-0 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {item.variantTitle && item.variantTitle !== "Default Title" && (
                          <p className="text-[11px] text-[#777777] mt-0.5">
                            Size: {item.variantTitle}
                          </p>
                        )}

                        {item.customName && (
                          <p className="text-[11px] text-[#5C5954] mt-0.5">
                            Engraving: {item.customName}
                          </p>
                        )}

                        <div className="mt-2.5 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center border border-[#D4CFC7] rounded-[6px] bg-[#F7F6F3]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(key, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.title}`}
                              className="p-1.5 text-[#5C5954] hover:text-[#242424] cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#242424] tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(key, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.title}`}
                              className="p-1.5 text-[#5C5954] hover:text-[#242424] cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <p className="text-sm font-bold text-[#242424] tabular-nums">
                            {formatPriceINR(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Complimentary 7ML Tester */}
              <div className="p-3 rounded-[8px] border border-[#E8E6E1] bg-[#F7F6F3] flex items-center gap-3">
                <div className="w-12 h-12 rounded-[6px] bg-white border border-[#E8E6E1] p-1 shrink-0 flex items-center justify-center">
                  <img
                    src="/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png"
                    alt="Complimentary 7ML Paradox EDP Tester"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Gift size={12} className="text-[#9A7953]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7953]">
                      Complimentary Bonus
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#242424] truncate">
                    Paradox 7ML EDP Pocket Tester
                  </p>
                  <p className="text-[11px] text-[#777777]">
                    Included automatically with every order
                  </p>
                </div>
                <span className="text-xs font-bold text-[#347A54] shrink-0">FREE</span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="px-5 sm:px-6 py-4 border-t border-[#E8E6E1] bg-[#F7F6F3] space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5C5954]">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums">{formatPriceINR(subtotal)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-[#347A54] font-semibold">
                  <span>Bundle Savings ({discountPct}% OFF)</span>
                  <span className="tabular-nums">−{formatPriceINR(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C5954]">
                <span>India Express Shipping</span>
                <span className="font-semibold text-[#347A54]">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E6E1]">
                <span className="font-semibold text-[#242424]">Estimated Total</span>
                <span className="font-serif text-2xl font-semibold text-[#242424] tabular-nums">
                  {formatPriceINR(finalTotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#777777]">
                Apply extra coupons like <strong>LUXURY25</strong> at checkout.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full btn-luxury-primary py-3.5 text-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="w-full btn-luxury-secondary py-2.5 text-xs text-center"
              >
                View Full Bag Page
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#777777]">
              <ShieldCheck size={13} className="text-[#347A54]" />
              <span>100% Sealed &amp; Insured Delivery</span>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
