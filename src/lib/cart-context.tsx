'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/data/mock-products';

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
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size?: string; color?: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartId: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, color } = action.payload;
      const cartId = `${product.id}-${size ?? 'nosize'}-${color ?? 'nocolor'}`;
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { product, quantity: 1, size, color, cartId }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.cartId !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.cartId === action.payload.cartId ? { ...i, quantity: action.payload.quantity } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'HYDRATE':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextValue {
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

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pi-cart');
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('pi-cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        subtotal,
        addItem: (product, size, color) => dispatch({ type: 'ADD_ITEM', payload: { product, size, color } }),
        removeItem: (cartId) => dispatch({ type: 'REMOVE_ITEM', payload: cartId }),
        updateQuantity: (cartId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
