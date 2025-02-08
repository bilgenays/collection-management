import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductData } from '@/lib/types/api';

interface CollectionStore {
  products: ProductData[];
  constants: ProductData[];
  addedProducts: Set<string>;
  currentPage: number;
  setProducts: (products: ProductData[]) => void;
  setConstants: (constants: ProductData[]) => void;
  addToConstants: (product: ProductData) => void;
  removeFromConstants: (productKey: string) => void;
  setAddedProducts: (products: Set<string>) => void;
  addToAddedProducts: (productKey: string) => void;
  removeFromAddedProducts: (productKey: string) => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  resetStore: () => void;
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set) => ({
      products: [],
      constants: [],
      addedProducts: new Set(),
      currentPage: 1,
      setProducts: (products) => set({ products }),
      setConstants: (constants) => set({ constants }),
      addToConstants: (product) => 
        set((state) => ({ 
          constants: [...state.constants, product] 
        })),
      removeFromConstants: (productKey) =>
        set((state) => ({
          constants: state.constants.filter(
            p => `${p.productCode}-${p.colorCode}` !== productKey
          )
        })),
      setAddedProducts: (products) => set({ addedProducts: products }),
      addToAddedProducts: (productKey) =>
        set((state) => ({
          addedProducts: new Set([...state.addedProducts, productKey])
        })),
      removeFromAddedProducts: (productKey) =>
        set((state) => {
          const newSet = new Set(state.addedProducts);
          newSet.delete(productKey);
          return { addedProducts: newSet };
        }),
      setCurrentPage: (page) => set((state) => ({ 
        currentPage: typeof page === 'function' ? page(state.currentPage) : page 
      })),
      resetStore: () => set({
        products: [],
        constants: [],
        addedProducts: new Set(),
        currentPage: 1
      }),
    }),
    {
      name: 'collection-storage',
      partialize: (state) => ({
        ...state,
        addedProducts: Array.from(state.addedProducts),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.addedProducts)) {
          state.addedProducts = new Set(state.addedProducts);
        }
      },
    }
  )
); 