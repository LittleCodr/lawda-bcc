import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trackAddToCart } from './cart-tracker';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantTitle?: string;
  customName?: string;
  customPhotoUrl?: string;
  customFont?: string;
  isGift?: boolean;
  cartItemId?: string; // Unique identifier for the cart instance
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  autoDiscountPercentage: () => number;
  autoDiscountAmount: () => number;
  discountedTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item) => {
        let updatedItems: CartItem[] = [];
        set((state) => {
          // Check if an EXACT same item exists (same id, variant, name, photo, gift)
          const existingItemIndex = state.items.findIndex(
            (i) => 
              i.id === item.id && 
              i.variantId === item.variantId &&
              i.customName === item.customName &&
              i.customPhotoUrl === item.customPhotoUrl &&
              i.customFont === item.customFont &&
              i.isGift === item.isGift
          );

          if (existingItemIndex !== -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            updatedItems = newItems;
            return { items: newItems, isOpen: true };
          }
          
          // Generate a unique ID for this specific cart entry if not provided
          const newItem = { ...item, cartItemId: item.cartItemId || `${item.id}-${item.variantId || 'default'}-${Date.now()}` };
          updatedItems = [...state.items, newItem];
          return { items: updatedItems, isOpen: true };
        });

        // Trigger real-time tracking (Telegram alert with device info & rate-limited Firestore session write)
        try {
          const totalItems = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
          const totalPrice = updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
          trackAddToCart(item, { items: updatedItems, totalItems, totalPrice });
        } catch {
          // Ignore tracking error
        }
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          // Fallback for legacy items that don't have cartItemId: match by id/variantId string
          items: state.items.filter((i) => (i.cartItemId || `${i.id}-${i.variantId || 'default'}`) !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => (i.cartItemId || `${i.id}-${i.variantId || 'default'}`) !== cartItemId),
            };
          }
          return {
            items: state.items.map((i) =>
              (i.cartItemId || `${i.id}-${i.variantId || 'default'}`) === cartItemId ? { ...i, quantity } : i
            ),
          };
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      autoDiscountPercentage: () => {
        const count = get().totalItems();
        if (count >= 3) return 5;
        if (count === 2) return 3;
        return 0;
      },
      autoDiscountAmount: () => {
        const raw = get().totalPrice();
        const pct = get().autoDiscountPercentage();
        return Math.floor(raw * (pct / 100));
      },
      discountedTotal: () => {
        return get().totalPrice() - get().autoDiscountAmount();
      },

    }),
    {
      name: 'everlasting-cart',
    }
  )
);
