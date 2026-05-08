'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled
            ? 'border-[#1a1a1a] bg-[#050505]/98 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'border-[#1a1a1a]/50 bg-[#050505]/90 backdrop-blur-xl'
        }`}
      >
        <div className="container-custom flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <a
            href="/"
            className="font-display text-sm uppercase tracking-[0.45em] text-[#F2EEE7] transition-colors duration-200 hover:text-[#7A1111]"
          >
            PROJECT INKED
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm uppercase tracking-[0.25em] text-[#8A8A8A] transition-colors duration-200 hover:text-[#F2EEE7] group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#7A1111] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Shop CTA — desktop */}
            <a
              href="/shop"
              className="hidden rounded-full border border-[#2a2a2a] px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-[#F2EEE7] transition-all duration-300 hover:border-[#7A1111] hover:text-[#7A1111] hover:shadow-[0_0_15px_rgba(122,17,17,0.2)] lg:inline-flex"
            >
              Shop Drop
            </a>

            {/* Cart button */}
            <button
              onClick={toggleCart}
              aria-label={`Open cart (${totalItems} items)`}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#2a2a2a] text-[#F2EEE7] transition-all duration-300 hover:border-[#7A1111] hover:shadow-[0_0_15px_rgba(122,17,17,0.2)] active:scale-90"
            >
              {/* Bag icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>

              {/* Badge */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#7A1111] text-[#F2EEE7] text-[9px] font-bold rounded-full flex items-center justify-center px-1 animate-pop">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label="Open mobile menu"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-[#2a2a2a] text-[#F2EEE7] transition-all duration-300 hover:border-[#7A1111] lg:hidden"
            >
              <span className="block w-4 h-px bg-current transition-all duration-300" />
              <span className="block w-3 h-px bg-current transition-all duration-300" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
