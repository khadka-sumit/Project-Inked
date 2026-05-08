'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
  shippingFullName: z.string().min(2, 'Name is required'),
  shippingPhone: z.string().min(10, 'Valid phone is required'),
  shippingEmail: z.string().email('Valid email required'),
  shippingAddressLine1: z.string().min(5, 'Address is required'),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().min(2, 'City is required'),
  shippingDistrict: z.string().min(2, 'District is required'),
  shippingProvince: z.string().min(2, 'Province is required'),
  paymentProvider: z.enum(['ESEWA', 'KHALTI', 'COD']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutClient({ userEmail }: { userEmail: string }) {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const deliveryCharge = subtotal >= 5000 ? 0 : 150;
  const total = subtotal + deliveryCharge;

  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingEmail: userEmail,
      paymentProvider: 'ESEWA',
    }
  });

  const paymentProvider = watch('paymentProvider');

  const nextStep = async () => {
    const valid = await trigger(['shippingFullName', 'shippingPhone', 'shippingEmail', 'shippingAddressLine1', 'shippingCity', 'shippingDistrict', 'shippingProvince']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const orderData = {
        ...data,
        subtotal,
        items: items.map(i => ({
          productId: i.product.id,
          productName: i.product.title,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          unitPrice: i.product.price
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      if (data.paymentProvider === 'ESEWA') {
        router.push(`/api/payments/esewa/initiate?orderId=${result.orderId}`);
      } else if (data.paymentProvider === 'KHALTI') {
        router.push(`/api/payments/khalti/initiate?orderId=${result.orderId}`);
      } else {
        clearCart();
        router.push(`/orders/${result.orderNumber}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#050505]">
        <h2 className="text-[#F2EEE7] font-display text-4xl mb-4">YOUR CART IS EMPTY</h2>
        <button onClick={() => router.push('/shop')} className="px-8 py-3 bg-[#7A1111] text-[#F2EEE7] uppercase tracking-widest text-xs font-bold">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-4">
      <div className="container-custom max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-7">
          <h1 className="font-display text-4xl text-[#F2EEE7] mb-8">SECURE CHECKOUT</h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4 mb-8 text-[10px] uppercase tracking-widest">
            <span className={step === 1 ? 'text-[#F2EEE7]' : 'text-[#555] cursor-pointer'} onClick={() => setStep(1)}>1. SHIPPING</span>
            <span className="text-[#333]">—</span>
            <span className={step === 2 ? 'text-[#F2EEE7]' : 'text-[#555]'}>2. PAYMENT</span>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 sm:p-8 rounded-sm">
            {step === 1 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                <h3 className="text-[#F2EEE7] text-sm uppercase tracking-[0.2em] mb-4 border-b border-[#1a1a1a] pb-2">Shipping Details</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Full Name *</label>
                    <input {...register('shippingFullName')} className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 outline-none focus:border-[#555]" />
                    {errors.shippingFullName && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.shippingFullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Email *</label>
                    <input type="email" {...register('shippingEmail')} className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 outline-none focus:border-[#555]" />
                    {errors.shippingEmail && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.shippingEmail.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Phone *</label>
                  <input {...register('shippingPhone')} className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 outline-none focus:border-[#555]" />
                  {errors.shippingPhone && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.shippingPhone.message}</p>}
                </div>

                <div>
                  <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Address Line 1 *</label>
                  <input {...register('shippingAddressLine1')} className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 outline-none focus:border-[#555]" />
                  {errors.shippingAddressLine1 && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.shippingAddressLine1.message}</p>}
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">City *</label>
                    <input {...register('shippingCity')} className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 outline-none focus:border-[#555]" />
                  </div>
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">District *</label>
                    <input {...register('shippingDistrict')} className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 outline-none focus:border-[#555]" />
                  </div>
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Province *</label>
                    <input {...register('shippingProvince')} className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 outline-none focus:border-[#555]" />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={nextStep}
                  className="w-full py-4 mt-6 bg-[#F2EEE7] text-[#050505] text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#ccc] transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                <h3 className="text-[#F2EEE7] text-sm uppercase tracking-[0.2em] mb-4 border-b border-[#1a1a1a] pb-2">Payment Method</h3>
                
                <div className="space-y-4">
                  <label className={`block p-4 border rounded-sm cursor-pointer transition-colors ${paymentProvider === 'ESEWA' ? 'border-[#4CAF50] bg-[#4CAF50]/5' : 'border-[#2a2a2a] bg-[#111]'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" value="ESEWA" {...register('paymentProvider')} className="w-4 h-4 accent-[#4CAF50]" />
                      <span className="text-[#F2EEE7] font-bold tracking-widest">eSewa Mobile Wallet</span>
                    </div>
                  </label>

                  <label className={`block p-4 border rounded-sm cursor-pointer transition-colors ${paymentProvider === 'KHALTI' ? 'border-[#5C2D91] bg-[#5C2D91]/5' : 'border-[#2a2a2a] bg-[#111]'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" value="KHALTI" {...register('paymentProvider')} className="w-4 h-4 accent-[#5C2D91]" />
                      <span className="text-[#F2EEE7] font-bold tracking-widest">Khalti Digital Wallet</span>
                    </div>
                  </label>

                  <label className={`block p-4 border rounded-sm cursor-pointer transition-colors ${paymentProvider === 'COD' ? 'border-[#F2EEE7] bg-[#F2EEE7]/5' : 'border-[#2a2a2a] bg-[#111]'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" value="COD" {...register('paymentProvider')} className="w-4 h-4 accent-[#F2EEE7]" />
                      <span className="text-[#F2EEE7] font-bold tracking-widest">Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-[#333] text-[#F2EEE7] text-xs font-bold uppercase tracking-widest hover:border-[#F2EEE7]"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-[#7A1111] text-[#F2EEE7] text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#A61515] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order & Pay'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 sm:p-8 rounded-sm sticky top-32">
            <h3 className="text-[#F2EEE7] text-sm uppercase tracking-[0.2em] mb-6 border-b border-[#1a1a1a] pb-2">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {items.map((item) => (
                <div key={item.cartId} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-[#111]">
                    <img src={item.product.images?.[0] || item.product.image} alt={item.product.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#F2EEE7] text-sm font-bold truncate">{item.product.title}</p>
                    <p className="text-[#8A8A8A] text-xs">{item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}</p>
                    <p className="text-[#8A8A8A] text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-[#F2EEE7] text-sm">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1a1a1a] pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#8A8A8A]">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#8A8A8A]">
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`}</span>
              </div>
            </div>
            <div className="border-t border-[#1a1a1a] mt-4 pt-4 flex justify-between text-[#F2EEE7] font-display text-xl">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
