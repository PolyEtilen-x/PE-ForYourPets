import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface RecentlyViewedState {
  items: Product[];
  addProduct: (product: Product) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addProduct: (product) =>
        set((state) => {
          // Filter out existing and prepend the product, keeping max 5 items
          const filtered = state.items.filter((item) => item.id !== product.id);
          return { items: [product, ...filtered].slice(0, 5) };
        }),
    }),
    {
      name: 'pe-recently-viewed-store',
    }
  )
);
