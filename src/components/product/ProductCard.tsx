'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/data/mock-products';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { addItem } = useCart();
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleId.current;
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    setIsAdding(true);
    const defaultSize = product.sizes?.[2] ?? product.sizes?.[0];
    const defaultColor = product.colors?.[0];
    addItem(product, defaultSize, defaultColor);
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <div
      ref={cardRef}
      onClick={(e) => {
        handleRipple(e);
        onOpenModal(product);
      }}
      className="product-card group relative cursor-pointer overflow-hidden rounded-xl bg-[#111111] border border-[#1a1a1a] transition-all duration-500 hover:border-[#7A1111]/60 hover:shadow-[0_20px_60px_rgba(122,17,17,0.2)]"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Ripple effects */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-[#7A1111]/25 animate-ripple"
          style={{ left: r.x - 50, top: r.y - 50, width: 100, height: 100 }}
        />
      ))}

      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#0a0a0a]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={product.featured}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded z-10
            ${product.badge === 'SOLD OUT' ? 'bg-[#1a1a1a] text-[#8A8A8A] border border-[#333]' :
              product.badge === 'BEST SELLER' ? 'bg-[#7A1111] text-[#F2EEE7]' :
              product.badge === 'NEW DROP' ? 'bg-[#F2EEE7] text-[#050505]' :
              'bg-[#050505]/90 text-[#7A1111] border border-[#7A1111]/50'}`}
          >
            {product.badge}
          </div>
        )}

        {/* Discount pill */}
        {discount > 0 && product.inStock && (
          <div className="absolute top-3 right-3 bg-[#7A1111] text-[#F2EEE7] text-[10px] font-bold px-2 py-1 rounded-full z-10">
            -{discount}%
          </div>
        )}

        {/* Quick add button — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out p-4 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock || isAdding}
            className={`w-full py-3 text-xs font-bold uppercase tracking-[0.25em] rounded-lg transition-all duration-300
              ${!product.inStock
                ? 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
                : isAdding
                ? 'bg-[#4CAF50] text-white scale-95'
                : 'bg-[#F2EEE7] text-[#050505] hover:bg-[#7A1111] hover:text-[#F2EEE7] active:scale-95'
              }`}
          >
            {!product.inStock ? 'Sold Out' : isAdding ? '✓ Added' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A]">{product.category}</p>
        <h3 className="text-sm font-semibold text-[#F2EEE7] leading-snug group-hover:text-white transition-colors duration-200 line-clamp-1">
          {product.title}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-base font-bold text-[#F2EEE7]">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-[#6B6B6B] line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#7A1111] bg-[#7A1111]/10 px-1.5 py-0.5 rounded">
                SAVE Rs. {(product.originalPrice - product.price).toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Size chips */}
        {product.sizes && (
          <div className="flex gap-1 pt-1 flex-wrap">
            {product.sizes.slice(0, 5).map((s) => (
              <span key={s} className="text-[9px] uppercase tracking-wider border border-[#333] text-[#8A8A8A] px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[9px] text-[#555]">+{product.sizes.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
