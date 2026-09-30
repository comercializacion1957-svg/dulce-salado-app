import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  selectedVariant?: any;
  selectedExtras: any[];
  notes?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image_url?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.id === newItem.id);
        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const item = updatedItems[existingIndex];
          const newQty = item.quantity + newItem.quantity;
          updatedItems[existingIndex] = {
            ...item,
            quantity: newQty,
            subtotal: item.unitPrice * newQty,
          };
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, newItem] });
        }
      },
      removeItem: (itemId) => set({ items: get().items.filter((i) => i.id !== itemId) }),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      getSubtotal: () => get().items.reduce((acc, i) => acc + i.subtotal, 0),
    }),
    { name: 'dulce_arte_cart_v1' }
  )
);