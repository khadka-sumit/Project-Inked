import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Secure Checkout - PROJECT INKED',
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  return <CheckoutClient userEmail={user.email || ''} />;
}
