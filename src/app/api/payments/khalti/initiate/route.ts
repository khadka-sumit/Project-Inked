import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { initiateKhaltiPayment } from '@/lib/payments/khalti';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const attempt = await db.paymentAttempt.findFirst({
      where: { orderId, provider: 'KHALTI' },
      include: { order: true }
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Payment attempt not found' }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Amount must be in paisa (Rs * 100)
    const amountInPaisa = Math.round(attempt.amount * 100);

    const payload = {
      return_url: `${siteUrl}/api/payments/khalti/callback`,
      website_url: siteUrl,
      amount: amountInPaisa,
      purchase_order_id: attempt.id,
      purchase_order_name: `PROJECT INKED Order ${attempt.order.orderNumber}`,
      customer_info: {
        name: attempt.order.shippingFullName,
        email: attempt.order.shippingEmail,
        phone: attempt.order.shippingPhone || '9800000000'
      }
    };

    const khaltiResponse = await initiateKhaltiPayment(payload);

    if (khaltiResponse.pidx) {
      // Save pidx
      await db.paymentAttempt.update({
        where: { id: attempt.id },
        data: { pidx: khaltiResponse.pidx }
      });
      
      // Redirect to Khalti portal
      return NextResponse.redirect(khaltiResponse.payment_url);
    } else {
      console.error('Khalti Initiate Error:', khaltiResponse);
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

  } catch (error) {
    console.error('Khalti route error:', error);
    return NextResponse.redirect(new URL('/checkout/failure', req.url));
  }
}
