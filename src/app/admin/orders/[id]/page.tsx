'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

const ALL_STATUSES = ['PENDING', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setOrder(d.order);
        setSelectedStatus(d.order.status);
        setAdminNotes(d.order.notes || '');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    setUpdatingStatus(true);
    setSaveMsg('');
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus, notes: adminNotes }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setOrder(d.order);
      setSaveMsg('Saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e: any) {
      setSaveMsg(`Error: ${e.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/admin/orders');
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-red-900/20 border border-red-900/40 text-red-400 px-6 py-4 rounded-sm">
      <p className="font-bold mb-2">Error loading order</p>
      <p className="text-sm">{error}</p>
      <Link href="/admin/orders" className="mt-4 inline-block text-xs uppercase tracking-widest underline">← Back to Orders</Link>
    </div>
  );

  if (!order) return null;

  const payment = order.payment_attempts?.[0];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-[10px] uppercase tracking-widest text-[#8A8A8A] hover:text-[#F2EEE7] transition-colors">
            ← All Orders
          </Link>
          <h1 className="font-display text-2xl text-[#F2EEE7] mt-1">{order.order_number}</h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            {new Date(order.created_at).toLocaleString('en-NP')}
          </p>
        </div>
        <span className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border rounded-sm ${STATUS_COLORS[order.status] || ''}`}>
          {order.status?.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1a1a1a]">
              <h2 className="text-xs uppercase tracking-widest text-[#F2EEE7]">Order Items</h2>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {(order.order_items || []).map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4 items-center">
                  {item.image_url && (
                    <div className="relative w-16 h-20 flex-shrink-0 bg-[#111] overflow-hidden rounded-sm">
                      <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F2EEE7] text-sm font-medium">{item.product_name}</p>
                    <p className="text-[#8A8A8A] text-xs mt-0.5">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` · Color: ${item.color}`}
                      {` · Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#F2EEE7] text-sm">Rs. {item.unit_price?.toLocaleString()}</p>
                    <p className="text-[#8A8A8A] text-xs">Total: Rs. {item.total_price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[#1a1a1a] space-y-1">
              <div className="flex justify-between text-xs text-[#8A8A8A]">
                <span>Subtotal</span><span>Rs. {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#8A8A8A]">
                <span>Delivery</span><span>{order.delivery_charge === 0 ? 'Free' : `Rs. ${order.delivery_charge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#F2EEE7] pt-2 border-t border-[#1a1a1a] mt-2">
                <span>Total</span><span>Rs. {order.total_amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {payment && (
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm">
              <div className="px-6 py-4 border-b border-[#1a1a1a]">
                <h2 className="text-xs uppercase tracking-widest text-[#F2EEE7]">Payment Details</h2>
              </div>
              <div className="p-6 space-y-3">
                <Row label="Provider" value={payment.provider} />
                <Row label="Status" value={payment.status} />
                {payment.sender_name && <Row label="Sender Name" value={payment.sender_name} />}
                {payment.sender_number && <Row label="Sender Number" value={payment.sender_number} />}
                {payment.remarks && <Row label="Remarks" value={payment.remarks} />}
                {payment.screenshot_url && (
                  <div className="pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-2">Payment Screenshot</p>
                    <a href={payment.screenshot_url} target="_blank" rel="noreferrer">
                      <img src={payment.screenshot_url} alt="Payment screenshot" className="max-w-xs rounded border border-[#2a2a2a] hover:opacity-80 transition-opacity" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm">
            <div className="px-6 py-4 border-b border-[#1a1a1a]">
              <h2 className="text-xs uppercase tracking-widest text-[#F2EEE7]">Update Order</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full bg-[#050505] border border-[#2a2a2a] text-[#F2EEE7] px-3 py-2 text-sm outline-none focus:border-[#7A1111]"
                >
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#8A8A8A] mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Internal notes..."
                  className="w-full bg-[#050505] border border-[#2a2a2a] text-[#F2EEE7] px-3 py-2 text-sm outline-none focus:border-[#7A1111] resize-none"
                />
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="w-full bg-[#F2EEE7] text-[#050505] py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#7A1111] hover:text-white transition-all disabled:opacity-50"
              >
                {updatingStatus ? 'Saving...' : 'Save Changes'}
              </button>
              {saveMsg && (
                <p className={`text-xs text-center ${saveMsg.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                  {saveMsg}
                </p>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm">
            <div className="px-6 py-4 border-b border-[#1a1a1a]">
              <h2 className="text-xs uppercase tracking-widest text-[#F2EEE7]">Customer</h2>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-sm text-[#F2EEE7]">{order.shipping_full_name}</p>
              <p className="text-xs text-[#8A8A8A]">{order.shipping_email}</p>
              <p className="text-xs text-[#8A8A8A]">{order.shipping_phone}</p>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm">
            <div className="px-6 py-4 border-b border-[#1a1a1a]">
              <h2 className="text-xs uppercase tracking-widest text-[#F2EEE7]">Shipping Address</h2>
            </div>
            <div className="p-6 space-y-1">
              <p className="text-sm text-[#F2EEE7]">{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p className="text-sm text-[#F2EEE7]">{order.shipping_address_line2}</p>}
              <p className="text-xs text-[#8A8A8A]">{order.shipping_city}, {order.shipping_district}</p>
              <p className="text-xs text-[#8A8A8A]">{order.shipping_province}{order.shipping_postal_code ? ` – ${order.shipping_postal_code}` : ''}</p>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-sm">
            <div className="px-6 py-4 border-b border-red-900/30">
              <h2 className="text-xs uppercase tracking-widest text-red-400">Danger Zone</h2>
            </div>
            <div className="p-6">
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="w-full border border-red-900/50 text-red-400 py-2 text-xs uppercase tracking-widest hover:bg-red-900/20 transition-all"
                >
                  Delete Order
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-red-400 text-center">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={handleDelete} className="flex-1 bg-red-900/40 text-red-400 py-2 text-xs uppercase tracking-widest hover:bg-red-900/70 transition-all">Yes, Delete</button>
                    <button onClick={() => setDeleteConfirm(false)} className="flex-1 border border-[#2a2a2a] text-[#8A8A8A] py-2 text-xs uppercase tracking-widest hover:text-[#F2EEE7] transition-all">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] flex-shrink-0">{label}</span>
      <span className="text-xs text-[#F2EEE7] text-right">{value}</span>
    </div>
  );
}
