import Link from 'next/link';
import { ReactNode } from 'react';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export const metadata = {
  title: 'Admin Panel — Project Inked',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col">
      {/* Top Nav */}
      <nav className="bg-[#080808] border-b border-[#1a1a1a] px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <Link href="/admin/orders" className="font-display text-lg text-[#F2EEE7] tracking-widest">
            INKED_ADMIN
          </Link>
          <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest text-[#8A8A8A]">
            <Link href="/admin/orders" className="hover:text-[#F2EEE7] transition-colors">
              Orders
            </Link>
            <Link href="/admin/customers" className="hover:text-[#F2EEE7] transition-colors">
              Customers
            </Link>
            <Link href="/" target="_blank" className="hover:text-[#F2EEE7] transition-colors">
              View Store ↗
            </Link>
          </div>
        </div>
        <AdminLogoutButton />
      </nav>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
