'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutFailurePage() {
  const router = useRouter();

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center px-4 animate-[slideUp_0.5s_ease-out]">
      <div className="w-20 h-20 mx-auto bg-[#7A1111]/10 rounded-full flex items-center justify-center mb-8">
        <svg className="w-10 h-10 text-[#7A1111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl text-[#F2EEE7] mb-4 text-center">
        PAYMENT FAILED
      </h1>
      <p className="text-[#8A8A8A] text-sm uppercase tracking-widest mb-12 text-center">
        Your payment could not be processed. Your order has not been placed.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push('/checkout')}
          className="px-10 py-4 bg-[#7A1111] text-[#F2EEE7] font-bold text-xs uppercase tracking-widest hover:bg-[#A61515] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/shop"
          className="px-10 py-4 border border-[#333] text-[#F2EEE7] font-bold text-xs uppercase tracking-widest hover:border-[#F2EEE7] transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
