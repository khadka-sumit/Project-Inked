import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import * as z from 'zod'

const orderSchema = z.object({
  paymentProvider: z.enum(['ESEWA', 'KHALTI', 'COD']),
  shippingFullName: z.string().min(2),
  shippingPhone: z.string().min(7),
  shippingEmail: z.string().email(),
  shippingAddressLine1: z.string().min(5),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().min(2),
  shippingDistrict: z.string().min(2),
  shippingProvince: z.string().min(2),
  shippingPostalCode: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    size: z.string().optional(),
    color: z.string().optional(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })).min(1),
  subtotal: z.number().min(0),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsedData = orderSchema.parse(body)

    let calculatedSubtotal = 0;
    parsedData.items.forEach(item => {
      calculatedSubtotal += item.unitPrice * item.quantity;
    });

    const deliveryCharge = calculatedSubtotal >= 5000 ? 0 : 150;
    const taxAmount = 0;
    const totalAmount = calculatedSubtotal + deliveryCharge + taxAmount;

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

    let customer = await db.customer.findUnique({
      where: { userId: user.id }
    });

    if (!customer) {
      customer = await db.customer.create({
        data: {
          userId: user.id,
          email: user.email!,
          fullName: parsedData.shippingFullName,
          phone: parsedData.shippingPhone,
        }
      });
    }

    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: parsedData.paymentProvider === 'COD' ? 'PENDING' : 'PAYMENT_PENDING',
        subtotal: calculatedSubtotal,
        deliveryCharge,
        taxAmount,
        totalAmount,
        paymentProvider: parsedData.paymentProvider,
        shippingFullName: parsedData.shippingFullName,
        shippingPhone: parsedData.shippingPhone,
        shippingEmail: parsedData.shippingEmail,
        shippingAddressLine1: parsedData.shippingAddressLine1,
        shippingAddressLine2: parsedData.shippingAddressLine2,
        shippingCity: parsedData.shippingCity,
        shippingDistrict: parsedData.shippingDistrict,
        shippingProvince: parsedData.shippingProvince,
        shippingPostalCode: parsedData.shippingPostalCode,
        notes: parsedData.notes,
        items: {
          create: parsedData.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity
          }))
        }
      }
    });

    if (parsedData.paymentProvider !== 'COD') {
      await db.paymentAttempt.create({
        data: {
          orderId: order.id,
          provider: parsedData.paymentProvider,
          amount: totalAmount,
          status: 'INITIATED'
        }
      });
    }

    return NextResponse.json({ success: true, orderNumber, totalAmount, orderId: order.id })

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 })
  }
}
