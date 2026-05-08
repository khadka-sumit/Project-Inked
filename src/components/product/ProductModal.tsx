'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/data/mock-products';
import { useCart } from '@/lib/cart-context';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImg, setActiveImg] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[2] ?? product.sizes?.[0] ?? '');
      setSelectedColor(product.colors?.[0] ?? '');
      setActiveImg(0);
      setIsAdding(false);
      setShowSuccess(false);
      setSizeError(false);
    }
  }, [product]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (product) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    setIsAdding(true);
    addItem(product, selectedSize || undefined, selectedColor || undefined);
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }, 600);
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#050505]/80 backdrop-blur-md p-0 sm:p-4"
      style={{ animation: 'fadeIn 0.25s ease' }}
    >
      <div
        className="relative w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-[#0d0d0d] border border-[#1f1f1f] rounded-t-2xl sm:rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#8A8A8A] hover:text-[#F2EEE7] hover:border-[#7A1111] transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image section */}
          <div className="relative bg-[#080808] rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden">
            <div className="aspect-[3/4] relative">
              <Image
                src={images[activeImg]}
                alt={product.title}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              {/* Discount tag */}
              {discount > 0 && product.inStock && (
                <div className="absolute top-4 left-4 bg-[#7A1111] text-[#F2EEE7] text-xs font-bold px-3 py-1.5 rounded-full">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      activeImg === idx ? 'border-[#7A1111] scale-105' : 'border-[#333] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" width={48} height={48} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            {/* Category + Badge */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#8A8A8A]">{product.category}</span>
              {product.badge && product.badge !== 'SOLD OUT' && (
                <span className="text-[9px] uppercase tracking-[0.2em] bg-[#7A1111]/20 text-[#A61515] border border-[#7A1111]/30 px-2 py-0.5 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-display text-[#F2EEE7] leading-tight">
              {product.title}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#F2EEE7]">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#555] line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && product.inStock && (
                <span className="text-sm font-bold text-[#4CAF50]">
                  Save Rs. {(product.originalPrice! - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#8A8A8A] leading-relaxed">{product.description}</p>

            {/* Material */}
            {product.material && (
              <p className="text-xs text-[#555] uppercase tracking-[0.2em]">
                Material: <span className="text-[#7A7A7A] normal-case">{product.material}</span>
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#555] mb-2.5">
                  Color: <span className="text-[#8A8A8A]">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200
                        ${selectedColor === c
                          ? 'border-[#7A1111] bg-[#7A1111]/15 text-[#F2EEE7]'
                          : 'border-[#2a2a2a] text-[#8A8A8A] hover:border-[#555]'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className={`text-[10px] uppercase tracking-[0.3em] ${sizeError ? 'text-[#7A1111]' : 'text-[#555]'}`}>
                    {sizeError ? '⚠ Select a size' : 'Size'}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      className={`w-12 h-10 text-xs font-medium rounded-lg border transition-all duration-200 active:scale-95
                        ${selectedSize === s
                          ? 'border-[#7A1111] bg-[#7A1111] text-[#F2EEE7]'
                          : sizeError
                          ? 'border-[#7A1111]/40 text-[#6B6B6B] hover:border-[#7A1111]'
                          : 'border-[#2a2a2a] text-[#8A8A8A] hover:border-[#555] hover:text-[#F2EEE7]'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <div className="mt-auto pt-2 space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className={`w-full py-4 text-sm font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-300
                  ${!product.inStock
                    ? 'bg-[#1a1a1a] text-[#555] cursor-not-allowed border border-[#333]'
                    : showSuccess
                    ? 'bg-[#4CAF50] text-white'
                    : isAdding
                    ? 'bg-[#7A1111]/60 text-[#F2EEE7]/60 scale-98'
                    : 'bg-[#7A1111] text-[#F2EEE7] hover:bg-[#A61515] hover:shadow-[0_0_30px_rgba(122,17,17,0.4)] active:scale-95'
                  }`}
              >
                {!product.inStock
                  ? 'Sold Out'
                  : showSuccess
                  ? '✓ Added to Cart'
                  : isAdding
                  ? 'Adding...'
                  : 'Add to Cart'}
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-xs uppercase tracking-[0.3em] text-[#555] border border-[#1f1f1f] rounded-xl hover:border-[#333] hover:text-[#8A8A8A] transition-all duration-200"
              >
                Continue Shopping
              </button>
            </div>

            {/* Trust badges */}
            <div className="border-t border-[#1a1a1a] pt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: '🚚', label: 'Free Ship', sub: 'Over Rs.5000' },
                { icon: '↩', label: 'Easy Return', sub: '7 Days' },
                { icon: '🔒', label: 'Secure Pay', sub: 'Encrypted' },
              ].map((b) => (
                <div key={b.label} className="space-y-0.5">
                  <div className="text-lg">{b.icon}</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#6B6B6B]">{b.label}</div>
                  <div className="text-[8px] text-[#444]">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
