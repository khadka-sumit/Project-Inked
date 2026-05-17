'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '12345') {
      document.cookie = "admin_access=true; path=/; max-age=86400"; // 1 day expiration
      router.push('/admin');
    } else {
      setError('Invalid passcode');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
      <div className="w-full max-w-md bg-[#111] p-8 border border-[#2a2a2a] rounded shadow-2xl relative">
        <h1 className="text-2xl font-display text-[#F2EEE7] mb-6 text-center uppercase tracking-widest">
          Admin Access
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="code" className="block text-xs uppercase tracking-[0.2em] text-[#8A8A8A] mb-2">
              Passcode
            </label>
            <input
              type="password"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#050505] border border-[#2a2a2a] text-[#F2EEE7] px-4 py-3 outline-none focus:border-[#7A1111] transition-colors"
              autoFocus
            />
          </div>
          {error && <p className="text-[#7A1111] text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-[#F2EEE7] text-[#050505] py-3 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#7A1111] hover:text-[#F2EEE7] transition-all duration-300"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
