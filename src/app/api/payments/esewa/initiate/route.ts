import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateEsewaSignature } from '@/lib/payments/esewa';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const paymentAttempt = await db.paymentAttempt.findFirst({
      where: { orderId, provider: 'ESEWA' },
      include: { order: true }
    });

    if (!paymentAttempt) {
      return NextResponse.json({ error: 'Payment attempt not found' }, { status: 404 });
    }

    // eSewa requires a unique transaction UUID per request
    const transactionUuid = `${paymentAttempt.id}-${Date.now()}`;
    const productCode = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
    const totalAmount = paymentAttempt.amount;

    // Update the attempt with the exact UUID we are sending
    await db.paymentAttempt.update({
      where: { id: paymentAttempt.id },
      data: { transactionUuid }
    });

    const signature = generateEsewaSignature(totalAmount, transactionUuid, productCode);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${siteUrl}/api/payments/esewa/success`;
    const failureUrl = `${siteUrl}/api/payments/esewa/failure?orderId=${orderId}`;

    // Return a simple HTML form that auto-submits
    const html = `
      <html>
        <head><title>Redirecting to eSewa...</title></head>
        <body onload="document.getElementById('esewa-form').submit();" style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #050505; color: #F2EEE7; font-family: sans-serif;">
          <div>
            <p>Redirecting to secure payment gateway...</p>
            <form id="esewa-form" action="${process.env.ESEWA_FORM_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'}" method="POST" style="display: none;">
              <input type="text" name="amount" value="${totalAmount}" required>
              <input type="text" name="tax_amount" value="0" required>
              <input type="text" name="total_amount" value="${totalAmount}" required>
              <input type="text" name="transaction_uuid" value="${transactionUuid}" required>
              <input type="text" name="product_code" value="${productCode}" required>
              <input type="text" name="product_service_charge" value="0" required>
              <input type="text" name="product_delivery_charge" value="0" required>
              <input type="text" name="success_url" value="${successUrl}" required>
              <input type="text" name="failure_url" value="${failureUrl}" required>
              <input type="text" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
              <input type="text" name="signature" value="${signature}" required>
              <input type="submit" value="Submit">
            </form>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error('eSewa initiate error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
