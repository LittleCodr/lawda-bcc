import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantTitle?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id && i.variantId === item.variantId
          );

          if (existingItemIndex !== -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems, isOpen: true };
          }
          return { items: [...state.items, item], isOpen: true };
        });
      },
      removeItem: (id, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.variantId === variantId)),
        }));
      },
      updateQuantity: (id, variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => !(i.id === id && i.variantId === variantId)),
            };
          }
          return {
            items: state.items.map((i) =>
              i.id === id && i.variantId === variantId ? { ...i, quantity } : i
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
    }),
    {
      name: 'everlasting-cart',
    }
  )
);
