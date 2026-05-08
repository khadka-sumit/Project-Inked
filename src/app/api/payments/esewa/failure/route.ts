import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (orderId) {
      await db.paymentAttempt.updateMany({
        where: { orderId, provider: 'ESEWA', status: 'INITIATED' },
        data: { status: 'FAILED' }
      });
    }

    return NextResponse.redirect(new URL('/checkout/failure', req.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/checkout/failure', req.url));
  }
}
