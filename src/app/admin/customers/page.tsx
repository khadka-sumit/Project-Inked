'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  orders?: { id: string; order_number: string; total_amount: number; status: string }[];
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setCustomers(d.customers || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    !search ||
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-[#F2EEE7] uppercase tracking-widest">Customers</h1>
        <input
          type="text"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-2 outline-none focus:border-[#7A1111] w-72"
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900/40 text-red-400 px-4 py-3 text-sm rounded-sm">{error}</div>
      )}

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8A8A8A]">
            <thead className="text-[10px] uppercase tracking-widest bg-[#111] text-[#F2EEE7]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#1a1a1a]">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-[#1a1a1a] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">No customers found.</td>
                </tr>
              ) : (
                filtered.map(c => {
                  const totalSpent = (c.orders || [])
                    .filter(o => ['PAID','PROCESSING','SHIPPED','DELIVERED'].includes(o.status))
                    .reduce((s, o) => s + o.total_amount, 0);
                  return (
                    <tr key={c.id} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                      <td className="px-6 py-4 text-[#F2EEE7] text-xs font-medium">{c.full_name}</td>
                      <td className="px-6 py-4 text-xs">{c.email}</td>
                      <td className="px-6 py-4 text-xs">{c.phone || '—'}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className="text-[#F2EEE7]">{c.orders?.length || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#F2EEE7] font-semibold">
                        {totalSpent > 0 ? `Rs. ${totalSpent.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Date(c.created_at).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-6 py-3 border-t border-[#1a1a1a]">
            <p className="text-[10px] text-[#8A8A8A] uppercase tracking-widest">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
