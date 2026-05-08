'use client';

import { useState, useMemo } from 'react';
import { mockProducts, Product } from '@/data/mock-products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductModal } from '@/components/product/ProductModal';

const CATEGORIES = ['all', 'tees', 'hoodies', 'jackets', 'accessories'] as const;
type FilterCategory = typeof CATEGORIES[number];

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Biggest Discount', value: 'discount' },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let products = activeCategory === 'all'
      ? mockProducts
      : mockProducts.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case 'price-asc':
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        products = [...products].sort((a, b) => {
          const discA = a.originalPrice ? a.originalPrice - a.price : 0;
          const discB = b.originalPrice ? b.originalPrice - b.price : 0;
          return discB - discA;
        });
        break;
      case 'featured':
      default:
        products = [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return products;
  }, [activeCategory, sortBy]);

  const totalSavings = mockProducts.reduce((sum, p) => {
    return sum + (p.originalPrice ? p.originalPrice - p.price : 0);
  }, 0);

  return (
    <>
      <div className="bg-[#050505] min-h-screen">
        {/* Hero Banner */}
        <section className="relative border-b border-[#1a1a1a] py-20 overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7A1111]/5 via-transparent to-transparent pointer-events-none" />

          <div className="container-custom relative">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.5em] text-[#7A1111] mb-6 font-medium">
                ● Live Drop Active
              </p>
              <h1 className="font-display text-6xl sm:text-8xl text-[#F2EEE7] leading-[0.9] tracking-tight mb-6">
                SHOP<br />
                <span className="text-[#7A1111]">THE</span><br />
                DROP
              </h1>
              <p className="text-base text-[#8A8A8A] max-w-md leading-relaxed mb-8">
                Wearable ink. Limited marks. Every piece in this drop is numbered, deadstock, and made once.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <span className="text-2xl font-bold text-[#F2EEE7]">{mockProducts.length}</span>
                  <span className="text-xs text-[#555] ml-2 uppercase tracking-wider">Pieces</span>
                </div>
                <div className="w-px bg-[#1a1a1a]" />
                <div>
                  <span className="text-2xl font-bold text-[#4CAF50]">
                    Up to {Math.max(...mockProducts.filter(p => p.originalPrice).map(p => Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)))}% OFF
                  </span>
                  <span className="text-xs text-[#555] ml-2 uppercase tracking-wider">On selected</span>
                </div>
                <div className="w-px bg-[#1a1a1a]" />
                <div>
                  <span className="text-2xl font-bold text-[#F2EEE7]">Free</span>
                  <span className="text-xs text-[#555] ml-2 uppercase tracking-wider">Ship over Rs.5000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters bar */}
        <section className="sticky top-20 z-30 bg-[#050505]/95 backdrop-blur-xl border-b border-[#1a1a1a]">
          <div className="container-custom flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
            {/* Category filters */}
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-250 font-medium
                    ${activeCategory === cat
                      ? 'bg-[#7A1111] text-[#F2EEE7]'
                      : 'text-[#6B6B6B] hover:text-[#F2EEE7] hover:bg-[#1a1a1a]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort + count */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#555] uppercase tracking-wider hidden sm:block">
                {filteredProducts.length} items
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#111] border border-[#2a2a2a] text-[#8A8A8A] text-xs uppercase tracking-wider rounded-lg px-3 py-2 outline-none hover:border-[#7A1111] transition-colors duration-200 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <div className="bg-[#7A1111]/10 border-b border-[#7A1111]/20">
          <div className="container-custom py-3 flex items-center gap-4 overflow-hidden">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {['🔥 Limited Drop — Shop Now', '💰 Save Up To 27% This Drop', '🚚 Free Shipping Over Rs.5000', '⚡ Low Stock On Several Items', '🔥 Limited Drop — Shop Now', '💰 Save Up To 27% This Drop'].map((text, i) => (
                <span key={i} className="text-xs text-[#A61515] uppercase tracking-[0.3em] font-medium">{text}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Products grid */}
        <section className="container-custom py-12">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-4xl opacity-20">🔍</p>
              <p className="text-sm text-[#555] uppercase tracking-wider">No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenModal={setSelectedProduct}
                />
              ))}
            </div>
          )}

          {/* Savings callout */}
          <div className="mt-16 border border-[#7A1111]/20 bg-[#7A1111]/5 rounded-2xl p-8 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#7A1111] mb-3">This Drop</p>
            <p className="text-3xl font-display text-[#F2EEE7] mb-2">
              Save up to Rs. {Math.max(...mockProducts.filter(p => p.originalPrice).map(p => p.originalPrice! - p.price)).toLocaleString()}
            </p>
            <p className="text-sm text-[#555]">on select pieces — limited time pricing</p>
          </div>
        </section>
      </div>

      {/* Product modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
