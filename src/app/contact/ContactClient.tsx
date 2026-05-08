'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  inquiryType: z.enum(['General', 'Order Support', 'Collaboration', 'Wholesale', 'Returns/Exchange', 'Custom Request']),
  orderNumber: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: 'General',
    }
  });

  const inquiryType = watch('inquiryType');
  const showOrderNumber = ['Order Support', 'Returns/Exchange'].includes(inquiryType);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmitStatus('success');
      reset();
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-4">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-[slideUp_0.5s_ease-out]">
          <h1 className="font-display text-5xl sm:text-7xl text-[#F2EEE7] mb-6">CONTACT US</h1>
          <p className="text-[#8A8A8A] text-sm uppercase tracking-[0.3em] max-w-xl mx-auto leading-relaxed">
            For general inquiries, support, or collaborations, please fill out the form below. We typically respond within 24-48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="md:col-span-1 space-y-12 animate-[slideUp_0.5s_ease-out_0.2s_both]">
            <div>
              <h3 className="text-[#F2EEE7] text-sm uppercase tracking-[0.2em] font-bold mb-4 border-b border-[#1a1a1a] pb-2">Support Hours</h3>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Monday - Friday<br />
                10:00 AM - 6:00 PM NPT
              </p>
            </div>
            
            <div>
              <h3 className="text-[#F2EEE7] text-sm uppercase tracking-[0.2em] font-bold mb-4 border-b border-[#1a1a1a] pb-2">Direct Contact</h3>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">
                Email: support@projectinked.com<br />
                Phone: +977 9800000000
              </p>
            </div>

            <div>
              <h3 className="text-[#F2EEE7] text-sm uppercase tracking-[0.2em] font-bold mb-4 border-b border-[#1a1a1a] pb-2">Socials</h3>
              <div className="flex flex-col gap-2">
                <a href="https://instagram.com/projectinked" className="text-[#8A8A8A] hover:text-[#F2EEE7] text-sm transition-colors">Instagram</a>
                <a href="https://tiktok.com/@projectinked" className="text-[#8A8A8A] hover:text-[#F2EEE7] text-sm transition-colors">TikTok</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-[#0a0a0a] p-6 sm:p-10 border border-[#1a1a1a] rounded-sm animate-[slideUp_0.5s_ease-out_0.4s_both]">
            {submitStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-3xl text-[#F2EEE7] mb-4">MESSAGE RECEIVED</h3>
                <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-sm">
                  Thank you for reaching out. Our team will review your inquiry and get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-8 px-8 py-3 border border-[#333] text-[#F2EEE7] text-xs uppercase tracking-[0.2em] hover:border-[#F2EEE7] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {submitStatus === 'error' && (
                  <div className="bg-[#7A1111]/10 border border-[#7A1111]/30 text-[#F2EEE7] px-4 py-3 text-sm rounded">
                    {errorMessage}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Name *</label>
                    <input 
                      {...register('name')}
                      className={`w-full bg-[#111] border ${errors.name ? 'border-[#7A1111]' : 'border-[#2a2a2a]'} text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors`}
                    />
                    {errors.name && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Email *</label>
                    <input 
                      type="email"
                      {...register('email')}
                      className={`w-full bg-[#111] border ${errors.email ? 'border-[#7A1111]' : 'border-[#2a2a2a]'} text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors`}
                    />
                    {errors.email && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Phone (Optional)</label>
                    <input 
                      {...register('phone')}
                      className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Inquiry Type *</label>
                    <select 
                      {...register('inquiryType')}
                      className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors appearance-none"
                    >
                      <option value="General">General Inquiry</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Returns/Exchange">Returns & Exchange</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Custom Request">Custom Request</option>
                    </select>
                  </div>
                </div>

                {showOrderNumber && (
                  <div>
                    <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Order Number *</label>
                    <input 
                      {...register('orderNumber')}
                      className={`w-full bg-[#111] border ${errors.orderNumber ? 'border-[#7A1111]' : 'border-[#2a2a2a]'} text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors`}
                      placeholder="#ORD-XXXXXX"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Subject *</label>
                  <input 
                    {...register('subject')}
                    className={`w-full bg-[#111] border ${errors.subject ? 'border-[#7A1111]' : 'border-[#2a2a2a]'} text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors`}
                  />
                  {errors.subject && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2">Message *</label>
                  <textarea 
                    {...register('message')}
                    rows={5}
                    className={`w-full bg-[#111] border ${errors.message ? 'border-[#7A1111]' : 'border-[#2a2a2a]'} text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors resize-none`}
                  />
                  {errors.message && <p className="text-[#7A1111] text-[10px] mt-1 uppercase tracking-wider">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#7A1111] text-[#F2EEE7] text-xs font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#A61515] hover:shadow-[0_0_30px_rgba(122,17,17,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
