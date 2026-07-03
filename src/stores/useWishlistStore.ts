import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
  isOpen: boolean;
  toggleWishlist: (product: Product) => void;
  removeItem: (productId: string) => void;
  setOpen: (open: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            return { items: state.items.filter((item) => item.id !== product.id) };
          }
          return { items: [...state.items, product] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'pe-wishlist-store',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
