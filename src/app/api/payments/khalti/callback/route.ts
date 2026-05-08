import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lookupKhaltiPayment } from '@/lib/payments/khalti';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pidx = searchParams.get('pidx');
    const transaction_id = searchParams.get('transaction_id');

    if (!pidx) {
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

    const attempt = await db.paymentAttempt.findUnique({
      where: { pidx },
      include: { order: true }
    });

    if (!attempt) {
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

    // Always verify via lookup API securely
    const lookupResponse = await lookupKhaltiPayment(pidx);

    if (lookupResponse.status === 'Completed') {
      await db.$transaction([
        db.paymentAttempt.update({
          where: { id: attempt.id },
          data: { 
            status: 'COMPLETED',
            providerReference: transaction_id || lookupResponse.transaction_id,
            rawResponse: lookupResponse as any,
            verifiedAt: new Date()
          }
        }),
        db.order.update({
          where: { id: attempt.orderId },
          data: { status: 'PAID' }
        })
      ]);

      return NextResponse.redirect(new URL(`/orders/${attempt.order.orderNumber}?success=true`, req.url));
    } else {
      await db.paymentAttempt.update({
        where: { id: attempt.id },
        data: { 
          status: 'FAILED',
          rawResponse: lookupResponse as any
        }
      });
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

  } catch (error) {
    console.error('Khalti callback error:', error);
    return NextResponse.redirect(new URL('/checkout/failure', req.url));
  }
}
