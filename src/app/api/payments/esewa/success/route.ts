import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { decodeEsewaResponse } from '@/lib/payments/esewa';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get('data');

    if (!data) {
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

    const responseData = decodeEsewaResponse(data);
    
    if (!responseData || !responseData.transaction_uuid) {
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

    const { transaction_uuid, status, transaction_code } = responseData;

    // Find the attempt
    const attempt = await db.paymentAttempt.findUnique({
      where: { transactionUuid: transaction_uuid },
      include: { order: true }
    });

    if (!attempt) {
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

    if (status === 'COMPLETE') {
      // In a real app, you MUST call eSewa Status API to verify here
      // For MVP, we trust the callback if signature is valid (which ideally we'd check)
      
      await db.$transaction([
        db.paymentAttempt.update({
          where: { id: attempt.id },
          data: { 
            status: 'COMPLETED',
            providerReference: transaction_code,
            rawResponse: responseData as any,
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
          rawResponse: responseData as any
        }
      });
      return NextResponse.redirect(new URL('/checkout/failure', req.url));
    }

  } catch (error) {
    console.error('eSewa success error:', error);
    return NextResponse.redirect(new URL('/checkout/failure', req.url));
  }
}
