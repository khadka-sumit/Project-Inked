import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col pt-20">
      {/* Basic Admin Nav */}
      <nav className="bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex justify-between items-center px-8">
        <Link href="/admin/orders" className="font-display text-xl text-[#F2EEE7]">INKED_ADMIN</Link>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-[#8A8A8A]">
          <Link href="/admin/orders" className="hover:text-[#F2EEE7] transition-colors">Orders</Link>
          <Link href="/" className="hover:text-[#F2EEE7] transition-colors">View Store</Link>
        </div>
      </nav>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
