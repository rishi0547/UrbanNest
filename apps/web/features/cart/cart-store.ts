"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface CartItem {
  id: string; // matches productId
  productId: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  categoryName?: string;
}

export interface CartStoreState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface CartStoreActions {
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export type CartStore = CartStoreState & CartStoreActions;

/**
 * Calculates sum of quantities across all cart items.
 */
function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculates cumulative subtotal price in INR across all items.
 */
function calculateSubtotal(items: CartItem[]): number {
  const sum = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Zustand store with local storage persistence.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,

      addItem: (product, quantityToAdd = 1) => {
        const resolvedId = product.productId || (product as any).id;
        if (!resolvedId) return;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.productId === resolvedId
        );

        let newItems: CartItem[];

        if (existingIndex > -1) {
          // Item already in cart: increment quantity within stock bounds
          const existingItem = currentItems[existingIndex]!;
          const targetQty = existingItem.quantity + quantityToAdd;
          const clampedQty = Math.min(targetQty, product.stock);

          newItems = currentItems.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: clampedQty } : item
          );
        } else {
          // New item to add
          const initialQty = Math.min(Math.max(1, quantityToAdd), product.stock);
          newItems = [
            ...currentItems,
            {
              ...product,
              id: resolvedId,
              productId: resolvedId,
              quantity: initialQty,
            },
          ];
        }

        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          subtotal: calculateSubtotal(newItems),
        });
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((item) => item.productId !== productId && item.id !== productId);
        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          subtotal: calculateSubtotal(newItems),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const newItems = get().items.map((item) => {
          if (item.productId === productId || item.id === productId) {
            const clampedQty = Math.min(Math.max(1, quantity), item.stock);
            return { ...item, quantity: clampedQty };
          }
          return item;
        });

        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          subtotal: calculateSubtotal(newItems),
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
        });
      },
    }),
    {
      name: "urbannest-cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          // Filter out invalid items (must have valid 36-char hex UUID)
          const validItems = state.items.filter(
            (item) =>
              item &&
              typeof item.productId === "string" &&
              /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                item.productId
              )
          );
          if (validItems.length !== state.items.length) {
            state.items = validItems;
            state.totalItems = calculateTotalItems(validItems);
            state.subtotal = calculateSubtotal(validItems);
          }
        }
      },
    }
  )
);

/**
 * Hydration-safe React hook wrapper for the Zustand cart store.
 * Prevents Next.js SSR hydration mismatches by ensuring consistent initial render values.
 */
export function useCart() {
  const store = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...store,
    isHydrated,
    // Return empty safe values until client-side hydration completes
    items: isHydrated ? store.items : [],
    totalItems: isHydrated ? store.totalItems : 0,
    subtotal: isHydrated ? store.subtotal : 0,
  };
}
