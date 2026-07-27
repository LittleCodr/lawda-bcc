"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect, ReactNode } from "react";
import type { Product } from "./products";
import { useAuth } from "./auth-context";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  subtotal: number;
  compareSubtotal: number;
  count: number;
  emptyCart: () => void;
  couponCode: string | null;
  discountPercentage: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      let localCart: CartItem[] = [];
      try {
        const stored = localStorage.getItem("cart");
        if (stored) localCart = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse local cart", e);
      }

      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "cart", "data");
          const snap = await getDoc(docRef);
          
          if (snap.exists()) {
            const firestoreCart = (snap.data().items as CartItem[]) || [];
            
            // Merge local cart and firestore cart
            const merged = [...firestoreCart];
            localCart.forEach((localItem) => {
              const existingIndex = merged.findIndex((i) => i.slug === localItem.slug);
              if (existingIndex >= 0) {
                 // Update to max quantity so we don't accidentally shrink their cart if they logged in with 1 item locally but had 2 in firestore
                 merged[existingIndex].quantity = Math.max(merged[existingIndex].quantity, localItem.quantity);
              } else {
                 merged.push(localItem);
              }
            });
            
            setItems(merged);
            localStorage.setItem("cart", JSON.stringify(merged));
            await setDoc(docRef, { items: merged }, { merge: true });
          } else {
            // First time login with an existing local cart
            setItems(localCart);
            if (localCart.length > 0) {
              await setDoc(docRef, { items: localCart }, { merge: true });
            }
          }
        } catch (e) {
          console.error("Failed to load cart from Firestore", e);
          setItems(localCart);
        }
      } else {
        setItems(localCart);
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [user]);

  const syncCart = useCallback(async (newItems: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(newItems));
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid, "cart", "data");
        await setDoc(docRef, { items: newItems }, { merge: true });
      } catch (e) {
        console.error("Failed to sync cart to Firestore", e);
      }
    }
  }, [user]);

  const applyCoupon = useCallback((code: string) => {
    const codeUpper = code.toUpperCase();
    if (["HARSH10", "HARSH15", "HARSH20", "FREEDOM"].includes(codeUpper)) {
      setCouponCode(codeUpper);
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      let newItems;
      if (existing) {
        newItems = prev.map((i) =>
          i.slug === product.slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [
          ...prev,
          {
            slug: product.slug,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: product.images.grid,
            quantity,
          },
        ];
      }
      syncCart(newItems);
      return newItems;
    });
    setIsOpen(true);
  }, [syncCart]);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.slug !== slug);
      syncCart(newItems);
      return newItems;
    });
  }, [syncCart]);

  const emptyCart = useCallback(() => {
    const newItems: CartItem[] = [];
    setItems(newItems);
    syncCart(newItems);
  }, [syncCart]);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) => {
      const newItems = quantity <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, quantity } : i));
      syncCart(newItems);
      return newItems;
    });
  }, [syncCart]);

  const rawSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const displayItems = useMemo(() => {
    if (rawSubtotal >= 1499) {
      return [
        ...items,
        {
          slug: "free-travel-spray",
          name: "Free Travel Spray (10ml)",
          price: 0,
          compareAtPrice: 299,
          image: "/images/products/Mirage_Hero_Octopus.webp",
          quantity: 1,
        },
      ];
    }
    return items;
  }, [items, rawSubtotal]);

  const subtotal = rawSubtotal;
  
  const compareSubtotal = useMemo(
    () => displayItems.reduce((sum, i) => sum + i.compareAtPrice * i.quantity, 0),
    [displayItems]
  );

  const discountPercentage = useMemo(() => {
    if (couponCode === "FREEDOM") {
      if (subtotal >= 3499) return 25;
      if (subtotal >= 2499) return 20;
      return 15;
    }
    if (couponCode === "HARSH20" && subtotal >= 3499) return 20;
    if ((couponCode === "HARSH20" || couponCode === "HARSH15") && subtotal >= 2499) return 15;
    if (couponCode) return 10;
    return 0;
  }, [couponCode, subtotal]);

  const discount = useMemo(
    () => Math.floor(subtotal * (discountPercentage / 100)),
    [subtotal, discountPercentage]
  );
  const total = useMemo(
    () => subtotal - discount,
    [subtotal, discount]
  );
  const count = useMemo(() => displayItems.reduce((sum, i) => sum + i.quantity, 0), [displayItems]);

  const value: CartContextValue = {
    items: displayItems,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    setQuantity,
    subtotal,
    compareSubtotal,
    count,
    emptyCart,
    couponCode,
    discountPercentage,
    discount,
    total,
    applyCoupon,
    removeCoupon,
    isLoaded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
