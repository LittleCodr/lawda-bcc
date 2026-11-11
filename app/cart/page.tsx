"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Gift,
  Truck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPriceINR } from "@/lib/catalog-types";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    autoDiscountPercentage,
    autoDiscountAmount,
    discountedTotal,
  } = useCartStore();

  const count = totalItems();
  const subtotal = totalPrice();
  const discountPct = autoDiscountPercentage();
  const discountAmt = autoDiscountAmount();
  const finalTotal = discountedTotal();

  return (
    <div className="bg-white min-h-[70vh] py-10 sm:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#E8E6E1] mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] mb-1">
              Review Order
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#242424]">
              Your Shopping Bag ({count})
            </h1>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-medium text-[#777777] hover:text-[#B83232] underline underline-offset-4 cursor-pointer"
            >
              Clear Shopping Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-[#F7F6F3] border border-[#E8E6E1] rounded-[12px] p-10 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-white border border-[#E8E6E1] mx-auto flex items-center justify-center mb-5">
              <ShoppingBag size={26} className="text-[#9A7953]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424] mb-2">
              Your fragrance bag is empty
            </h2>
            <p className="text-sm text-[#5C5954] max-w-md mx-auto mb-7 leading-relaxed">
              Explore over 1,700 factory-sealed designer, niche, and Middle Eastern creations. Orders include free pan-India express shipping and a complimentary 7ML Paradox tester.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/collections/bestsellers" className="btn-luxury-primary px-6 py-3 text-xs">
                Shop Bestsellers
              </Link>
              <Link href="/collections/middle-eastern-perfumes" className="btn-luxury-secondary px-6 py-3 text-xs">
                Explore Middle Eastern Houses
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Line Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Tiered Discount Banner */}
              <div className="p-4 rounded-[8px] bg-[#F5EFE6] border border-[#E8E6E1] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-sm text-[#242424]">
                  <Sparkles size={16} className="text-[#9A7953]" />
                  <span className="font-medium">
                    {count >= 3
                      ? "5% Mega Bundle Discount active across all fragrances."
                      : count === 2
                        ? "3% Bundle Discount active — add 1 more bottle to unlock 5% OFF."
                        : "Add 1 more fragrance to unlock 3% OFF automatically (or 2 more for 5% OFF)."}
                  </span>
                </div>
                <Link
                  href="/collections/all"
                  className="text-xs font-semibold text-[#9A7953] hover:text-[#242424] underline underline-offset-4"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="border border-[#E8E6E1] rounded-[10px] divide-y divide-[#E8E6E1] bg-white overflow-hidden">
                {items.map((item) => {
                  const key = item.cartItemId || item.id;
                  return (
                    <div
                      key={key}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center"
                    >
                      <div className="w-24 h-24 rounded-[8px] bg-[#F7F6F3] border border-[#E8E6E1] p-2 shrink-0 flex items-center justify-center">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-[#242424] leading-snug">
                          {item.title}
                        </h3>
                        {item.variantTitle && item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-[#777777] mt-1">
                            Variant: {item.variantTitle}
                          </p>
                        )}
                        <p className="text-xs font-medium text-[#347A54] mt-1">
                          Unit Price: {formatPriceINR(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        <div className="inline-flex items-center border border-[#D4CFC7] rounded-[6px] bg-[#F7F6F3]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            aria-label={`Decrease quantity for ${item.title}`}
                            className="p-2 text-[#5C5954] hover:text-[#242424] cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-[#242424] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            aria-label={`Increase quantity for ${item.title}`}
                            className="p-2 text-[#5C5954] hover:text-[#242424] cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-base font-bold text-[#242424] min-w-[84px] text-right tabular-nums">
                          {formatPriceINR(item.price * item.quantity)}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          aria-label={`Remove ${item.title}`}
                          className="p-2 text-[#96928B] hover:text-[#B83232] transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Complimentary 7ML Paradox Row */}
              <div className="p-4 rounded-[10px] border border-[#E8E6E1] bg-[#F7F6F3] flex items-center gap-4">
                <div className="w-14 h-14 rounded-[8px] bg-white border border-[#E8E6E1] p-1.5 shrink-0 flex items-center justify-center">
                  <img
                    src="/harsh-beniwal/octopus/perfumes/images/paradox_bottle.png"
                    alt="Complimentary 7ML Paradox EDP Tester"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A7953] flex items-center gap-1.5">
                    <Gift size={13} /> Complimentary Bonus Added
                  </p>
                  <p className="text-sm font-semibold text-[#242424]">
                    Paradox 7ML Eau de Parfum Pocket Tester
                  </p>
                  <p className="text-xs text-[#777777]">
                    Included with your order at zero additional charge.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#347A54] bg-white border border-[#E8E6E1] px-2.5 py-1 rounded-[4px]">
                  FREE
                </span>
              </div>
            </div>

            {/* Right Summary Box */}
            <aside className="lg:col-span-4 bg-[#F7F6F3] border border-[#E8E6E1] rounded-[12px] p-6 space-y-5 sticky top-24">
              <h2 className="font-serif text-2xl font-semibold text-[#242424]">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm border-b border-[#E8E6E1] pb-4">
                <div className="flex justify-between text-[#5C5954]">
                  <span>Catalog Subtotal ({count} items)</span>
                  <span className="font-medium text-[#242424] tabular-nums">
                    {formatPriceINR(subtotal)}
                  </span>
                </div>

                {discountAmt > 0 && (
                  <div className="flex justify-between text-[#347A54] font-semibold">
                    <span>Automatic Bundle ({discountPct}% OFF)</span>
                    <span className="tabular-nums">−{formatPriceINR(discountAmt)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#5C5954]">
                  <span>India Express Delivery</span>
                  <span className="font-semibold text-[#347A54]">FREE</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-[#242424]">Estimated Total</span>
                <span className="font-serif text-3xl font-semibold text-[#242424] tabular-nums">
                  {formatPriceINR(finalTotal)}
                </span>
              </div>

              <p className="text-xs text-[#777777] bg-white p-3 rounded-[6px] border border-[#E8E6E1]">
                Spend ₹5,000+? Apply coupon <strong className="text-[#242424]">OCTOPUS5</strong> at checkout for an extra{" "}
                <strong className="text-[#242424]">5% OFF</strong>.
              </p>

              <Link href="/checkout" className="w-full btn-luxury-primary py-4 text-xs">
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </Link>

              <div className="space-y-2 pt-2 text-xs text-[#5C5954]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#347A54]" />
                  <span>100% Genuine Sealed Perfumes with Batch Codes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#9A7953]" />
                  <span>Insured Pan-India Prepaid Dispatch</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

