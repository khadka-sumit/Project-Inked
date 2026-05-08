'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeCart]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const shippingThreshold = 5000;
  const freeShipping = subtotal >= shippingThreshold;
  const remaining = shippingThreshold - subtotal;
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-[#050505]/70 backdrop-blur-sm"
          onClick={closeCart}
          style={{ animation: 'fadeIn 0.25s ease' }}
        />
      )}

      {/* Drawer */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 z-[95] h-full w-full max-w-md bg-[#0d0d0d] border-l border-[#1a1a1a] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.35em] text-[#F2EEE7]">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-[#7A1111] text-[#F2EEE7] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] uppercase tracking-wider text-[#555] hover:text-[#7A1111] transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#8A8A8A] hover:text-[#F2EEE7] hover:border-[#7A1111] transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Free shipping progress */}
        <div className="px-6 py-3 bg-[#0a0a0a] border-b border-[#1a1a1a]">
          {freeShipping ? (
            <p className="text-[11px] text-[#4CAF50] uppercase tracking-[0.2em] font-medium">
              ✓ Free shipping unlocked!
            </p>
          ) : (
            <p className="text-[11px] text-[#6B6B6B] uppercase tracking-[0.15em]">
              Rs. {remaining.toLocaleString()} more for free shipping
            </p>
          )}
          <div className="mt-2 h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7A1111] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="text-5xl opacity-20">🛍</div>
              <p className="text-sm text-[#555] uppercase tracking-[0.2em]">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-xs text-[#7A1111] border border-[#7A1111]/30 px-4 py-2 rounded-full uppercase tracking-wider hover:bg-[#7A1111]/10 transition-colors"
              >
                Shop the Drop
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="flex gap-4 px-6 py-4 hover:bg-[#111] transition-colors duration-200 group"
              >
                {/* Image */}
                <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[#0a0a0a]">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-semibold text-[#F2EEE7] leading-snug truncate">{item.product.title}</p>
                  <div className="flex gap-2">
                    {item.size && (
                      <span className="text-[9px] uppercase tracking-wider text-[#6B6B6B] border border-[#2a2a2a] px-1.5 py-0.5 rounded">
                        {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-[9px] uppercase tracking-wider text-[#6B6B6B] border border-[#2a2a2a] px-1.5 py-0.5 rounded">
                        {item.color}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 border border-[#2a2a2a] rounded-full px-2 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="text-[#8A8A8A] hover:text-[#F2EEE7] w-5 h-5 flex items-center justify-center text-base leading-none transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xs text-[#F2EEE7] w-4 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="text-[#8A8A8A] hover:text-[#F2EEE7] w-5 h-5 flex items-center justify-center text-base leading-none transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-bold text-[#F2EEE7]">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.cartId)}
                  className="text-[#333] hover:text-[#7A1111] transition-colors mt-0.5 opacity-0 group-hover:opacity-100"
                  aria-label="Remove item"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#1a1a1a] px-6 py-5 space-y-4 bg-[#0a0a0a]">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-[0.3em] text-[#6B6B6B]">Subtotal</span>
              <span className="text-lg font-bold text-[#F2EEE7]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-[#444] uppercase tracking-wider">
              Taxes and shipping calculated at checkout
            </p>
            <button className="w-full py-4 bg-[#7A1111] text-[#F2EEE7] text-sm font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-[#A61515] hover:shadow-[0_0_30px_rgba(122,17,17,0.35)] active:scale-95 transition-all duration-300">
              Checkout → Rs. {subtotal.toLocaleString()}
            </button>
            <button
              onClick={closeCart}
              className="w-full py-2.5 text-xs text-[#555] uppercase tracking-wider hover:text-[#8A8A8A] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
