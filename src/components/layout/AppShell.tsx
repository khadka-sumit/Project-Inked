'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { SmoothScroll } from '@/components/animation/SmoothScroll';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { CartProvider } from '@/lib/cart-context';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Admin pages have their own standalone layout — no site header/footer
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#050505] text-[#F2EEE7]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#F2EEE7] focus:text-[#050505] focus:px-4 focus:py-2 focus:rounded">
          Skip to content
        </a>
        <Header />
        <SmoothScroll>
          <main id="main-content" className="relative overflow-hidden">
            {children}
          </main>
        </SmoothScroll>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
