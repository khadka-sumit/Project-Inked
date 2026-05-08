import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;

  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-4">
      <div className="container-custom max-w-3xl mx-auto text-center animate-[slideUp_0.5s_ease-out]">
        <div className="w-20 h-20 mx-auto bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="font-display text-4xl sm:text-5xl text-[#F2EEE7] mb-4">ORDER CONFIRMED</h1>
        <p className="text-[#8A8A8A] text-sm uppercase tracking-widest mb-12">
          Order No: {order.orderNumber}
        </p>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 text-left rounded-sm mb-12">
          <h3 className="text-[#F2EEE7] text-sm uppercase tracking-widest border-b border-[#1a1a1a] pb-4 mb-6">Order Details</h3>
          
          <div className="grid sm:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[#8A8A8A] text-xs uppercase tracking-wider mb-2">Shipping To</p>
              <p className="text-[#F2EEE7] text-sm">{order.shippingFullName}</p>
              <p className="text-[#8A8A8A] text-xs mt-1">{order.shippingAddressLine1}</p>
              <p className="text-[#8A8A8A] text-xs">{order.shippingCity}, {order.shippingProvince}</p>
              <p className="text-[#8A8A8A] text-xs mt-2">{order.shippingPhone}</p>
            </div>
            <div>
              <p className="text-[#8A8A8A] text-xs uppercase tracking-wider mb-2">Payment</p>
              <p className="text-[#F2EEE7] text-sm">{order.paymentProvider}</p>
              <p className={`text-xs mt-1 font-bold ${order.status === 'PAID' ? 'text-[#4CAF50]' : 'text-[#e5a040]'}`}>
                Status: {order.status}
              </p>
            </div>
          </div>

          <div className="border-t border-[#1a1a1a] pt-6 space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-[#F2EEE7]">{item.quantity}x {item.productName} <span className="text-[#8A8A8A] text-xs ml-2">({item.size})</span></span>
                <span className="text-[#8A8A8A]">Rs. {item.totalPrice}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1a1a1a] mt-6 pt-6 flex justify-between items-center text-[#F2EEE7] font-display text-xl">
            <span>Total</span>
            <span>Rs. {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <Link href="/shop" className="inline-block px-10 py-4 bg-[#F2EEE7] text-[#050505] font-bold text-xs uppercase tracking-widest hover:bg-[#ccc] transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
