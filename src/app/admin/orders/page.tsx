import { db } from '@/lib/db';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-[#F2EEE7]">ORDERS</h1>
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8A8A8A]">
            <thead className="text-[10px] uppercase tracking-widest bg-[#111] text-[#F2EEE7]">
              <tr>
                <th className="px-6 py-4">Order No</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">No orders found.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                    <td className="px-6 py-4 text-[#F2EEE7]">{order.orderNumber}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{order.shippingFullName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm ${
                        order.status === 'PAID' ? 'bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20' : 
                        order.status === 'PENDING' ? 'bg-[#e5a040]/10 text-[#e5a040] border border-[#e5a040]/20' : 
                        'bg-[#333] text-[#8A8A8A]'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">Rs. {order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Link href={`/orders/${order.orderNumber}`} className="text-[#F2EEE7] hover:underline text-[10px] uppercase tracking-widest">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
