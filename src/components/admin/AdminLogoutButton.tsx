'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the admin cookie
    document.cookie = 'admin_access=; path=/; max-age=0';
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[10px] uppercase tracking-widest text-[#8A8A8A] hover:text-[#7A1111] transition-colors border border-[#2a2a2a] px-3 py-1.5 hover:border-[#7A1111]"
    >
      Logout
    </button>
  );
}
