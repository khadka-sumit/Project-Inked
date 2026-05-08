'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockProducts, Product } from '@/data/mock-products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductModal } from '@/components/product/ProductModal';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const featured = mockProducts.filter((p) => p.featured).slice(0, 3);
  const newDrop = mockProducts.filter((p) => !p.featured).slice(0, 3);

  return (
    <>
      <div className="bg-[#050505] min-h-screen">
        {/* ── Hero ── */}
        <section className="relative min-h-[95vh] flex items-center overflow-hidden">
          {/* Background hero image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/products/product-5.jpg"
              alt="PROJECT INKED hero"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>
          <div className="absolute inset-0 grain opacity-40 z-0 pointer-events-none" />

          <div className="container-custom relative z-10 py-32">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.6em] text-[#7A1111] mb-8 font-medium flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-[#7A1111]" />
                Drop 001 — Active
              </p>
              <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.85] tracking-tight text-[#F2EEE7] mb-8">
                WEAR<br />
                YOUR<br />
                <span className="text-[#7A1111]">MARK</span>
              </h1>
              <p className="text-lg text-[#8A8A8A] max-w-sm leading-relaxed mb-10">
                Wearable ink. Limited marks. PROJECT INKED is where garment, graphic, and identity collide.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/shop"
                  className="px-8 py-4 bg-[#7A1111] text-[#F2EEE7] text-sm font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-[#A61515] hover:shadow-[0_0_40px_rgba(122,17,17,0.4)] active:scale-95 transition-all duration-300"
                >
                  Shop the Drop
                </a>
                <a
                  href="/lookbook"
                  className="px-8 py-4 border border-[#333] text-[#F2EEE7] text-sm font-bold uppercase tracking-[0.3em] rounded-xl hover:border-[#7A1111] hover:text-[#7A1111] active:scale-95 transition-all duration-300"
                >
                  Lookbook
                </a>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-bounce">
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#555]">Scroll</span>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M6 1v18M1 14l5 5 5-5" stroke="#555" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </section>

        {/* ── Marquee strip ── */}
        <div className="border-y border-[#1a1a1a] py-4 overflow-hidden bg-[#080808]">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {Array(4).fill(['WEARABLE INK', 'LIMITED MARKS', 'NOT MADE FOR EVERYONE', 'MADE TO LEAVE A MARK', 'DROP 001 ACTIVE']).flat().map((text, i) => (
              <span key={i} className="text-xs uppercase tracking-[0.5em] text-[#333] font-medium">
                {text}
                <span className="mx-8 text-[#7A1111]">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Featured Products ── */}
        <section className="container-custom py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-[#7A1111] mb-3">This Drop</p>
              <h2 className="font-display text-5xl sm:text-6xl text-[#F2EEE7] leading-tight">
                FEATURED<br />PIECES
              </h2>
            </div>
            <a
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#555] hover:text-[#F2EEE7] transition-colors duration-200 group"
            >
              View all
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} onOpenModal={setSelectedProduct} />
            ))}
          </div>
        </section>

        {/* ── Sale Banner ── */}
        <section className="border-y border-[#7A1111]/20 bg-[#7A1111]/8 py-16 overflow-hidden relative">
          <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
          <div className="container-custom relative text-center">
            <p className="text-xs uppercase tracking-[0.6em] text-[#7A1111] mb-4">Limited Time</p>
            <h2 className="font-display text-5xl sm:text-7xl text-[#F2EEE7] mb-4">
              UP TO <span className="text-[#7A1111]">27% OFF</span>
            </h2>
            <p className="text-sm text-[#6B6B6B] mb-8 uppercase tracking-wider">
              On selected pieces from this drop
            </p>
            <a
              href="/shop?sort=discount"
              className="inline-block px-8 py-4 border border-[#7A1111] text-[#7A1111] text-xs font-bold uppercase tracking-[0.35em] rounded-xl hover:bg-[#7A1111] hover:text-[#F2EEE7] transition-all duration-300"
            >
              Shop Discounts
            </a>
          </div>
        </section>

        {/* ── New Arrivals ── */}
        <section className="container-custom py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-[#7A1111] mb-3">Just Dropped</p>
              <h2 className="font-display text-5xl sm:text-6xl text-[#F2EEE7] leading-tight">
                NEW<br />ARRIVALS
              </h2>
            </div>
            <a
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#555] hover:text-[#F2EEE7] transition-colors duration-200 group"
            >
              Full drop
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {newDrop.map((product) => (
              <ProductCard key={product.id} product={product} onOpenModal={setSelectedProduct} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/shop" className="inline-flex items-center gap-2 px-8 py-4 border border-[#2a2a2a] text-[#F2EEE7] text-xs uppercase tracking-[0.35em] rounded-xl hover:border-[#7A1111] hover:shadow-[0_0_20px_rgba(122,17,17,0.15)] transition-all duration-300">
              View All {mockProducts.length} Pieces →
            </a>
          </div>
        </section>

        {/* ── Brand Statement ── */}
        <section className="border-t border-[#1a1a1a] py-24 overflow-hidden">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <p className="font-display text-5xl sm:text-7xl text-[#F2EEE7] leading-tight mb-6">
                "NOT MADE FOR EVERYONE.<br />
                <span className="text-[#7A1111]">MADE TO LEAVE A MARK."</span>
              </p>
              <p className="text-sm text-[#555] uppercase tracking-[0.5em] mt-8">— PROJECT INKED</p>
            </div>
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="border-t border-[#1a1a1a] bg-[#080808] py-20">
          <div className="container-custom max-w-xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[#7A1111] mb-4">Early Access</p>
            <h2 className="font-display text-4xl text-[#F2EEE7] mb-4">ENTER THE NEXT DROP</h2>
            <p className="text-sm text-[#555] mb-8">Get notified 24h before the next drop goes live.</p>
            <form className="flex gap-3 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 rounded-xl placeholder-[#444] outline-none focus:border-[#7A1111] transition-colors duration-200"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#7A1111] text-[#F2EEE7] text-xs font-bold uppercase tracking-[0.25em] rounded-xl hover:bg-[#A61515] active:scale-95 transition-all duration-200 whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Product modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
