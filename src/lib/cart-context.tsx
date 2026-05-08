'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/mock-products';
import { ReactNode, useState, useEffect } from 'react';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  cartId: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      subtotal: 0,

      addItem: (product, size, color) => set((state) => {
        const cartId = `${product.id}-${size ?? 'nosize'}-${color ?? 'nocolor'}`;
        const existing = state.items.find((i) => i.cartId === cartId);
        
        let newItems;
        if (existing) {
          newItems = state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...state.items, { product, quantity: 1, size, color, cartId }];
        }
        
        const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        
        return { items: newItems, isOpen: true, totalItems, subtotal };
      }),

      removeItem: (cartId) => set((state) => {
        const newItems = state.items.filter((i) => i.cartId !== cartId);
        const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        
        return { items: newItems, totalItems, subtotal };
      }),

      updateQuantity: (cartId, quantity) => set((state) => {
        const newItems = state.items
          .map((i) => i.cartId === cartId ? { ...i, quantity } : i)
          .filter((i) => i.quantity > 0);
          
        const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        
        return { items: newItems, totalItems, subtotal };
      }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),
    }),
    {
      name: 'pi-cart-storage',
      partialize: (state) => ({ items: state.items, totalItems: state.totalItems, subtotal: state.subtotal }),
    }
  )
);

// Custom hook to prevent hydration errors with Zustand persist
export function useCart() {
  const [mounted, setMounted] = useState(false);
  const store = useCartStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      ...store,
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }

  return store;
}

// Passthrough for backward compatibility with AppShell
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
