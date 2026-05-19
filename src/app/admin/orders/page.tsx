'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_provider: string;
  shipping_full_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_city: string;
  created_at: string;
  customers?: { full_name: string; email: string };
  order_items?: any[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  PAYMENT_PENDING: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  PAID: 'bg-green-500/10 text-green-400 border-green-500/20',
  PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  SHIPPED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  REFUNDED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const ALL_STATUSES = ['ALL', 'PENDING', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<any>(null);
  const limit = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to load orders');
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: stats.totalOrders, color: '#F2EEE7' },
            { label: 'Revenue (NPR)', value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`, color: '#4CAF50' },
            { label: 'Customers', value: stats.totalCustomers, color: '#7A9CC4' },
            { label: 'Last 7 Days', value: stats.recentOrders, color: '#e5a040' },
          ].map(s => (
            <div key={s.label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm p-5">
              <p className="text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-1">{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-[#F2EEE7] uppercase tracking-widest">Orders</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search name, email, order #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-2 outline-none focus:border-[#7A1111] w-64"
          />
          <button type="submit" className="bg-[#F2EEE7] text-[#050505] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#7A1111] hover:text-white transition-all">
            Search
          </button>
        </form>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-[#1a1a1a] pb-0">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 text-[10px] uppercase tracking-widest border-b-2 transition-all -mb-px ${
              statusFilter === s
                ? 'border-[#F2EEE7] text-[#F2EEE7]'
                : 'border-transparent text-[#8A8A8A] hover:text-[#F2EEE7]'
            }`}
          >
            {s}
            {stats?.statusCounts?.[s] ? ` (${stats.statusCounts[s]})` : ''}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-900/40 text-red-400 px-4 py-3 text-sm rounded-sm">
          {error} — <button onClick={fetchOrders} className="underline">retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8A8A8A]">
            <thead className="text-[10px] uppercase tracking-widest bg-[#111] text-[#F2EEE7]">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#1a1a1a]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-[#1a1a1a] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#8A8A8A]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                    <td className="px-6 py-4 text-[#F2EEE7] font-mono text-xs">{order.order_number}</td>
                    <td className="px-6 py-4 text-xs">{new Date(order.created_at).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <div className="text-[#F2EEE7] text-xs">{order.shipping_full_name}</div>
                      <div className="text-[10px] text-[#666]">{order.shipping_email}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">{order.payment_provider || 'COD'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm border ${STATUS_COLORS[order.status] || 'bg-[#333] text-[#8A8A8A] border-[#333]'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#F2EEE7] text-xs font-semibold">Rs. {order.total_amount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[10px] uppercase tracking-widest text-[#F2EEE7] border border-[#2a2a2a] px-3 py-1 hover:bg-[#F2EEE7] hover:text-[#050505] transition-all"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#1a1a1a]">
            <p className="text-[10px] text-[#8A8A8A] uppercase tracking-widest">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 text-[10px] border border-[#2a2a2a] text-[#8A8A8A] hover:text-[#F2EEE7] disabled:opacity-30 transition-colors">
                ← Prev
              </button>
              <span className="px-3 py-1 text-[10px] text-[#F2EEE7]">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1 text-[10px] border border-[#2a2a2a] text-[#8A8A8A] hover:text-[#F2EEE7] disabled:opacity-30 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
