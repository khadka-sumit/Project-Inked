import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import * as z from 'zod'

const orderSchema = z.object({
  paymentProvider: z.enum(['ESEWA', 'KHALTI', 'COD']),
  shippingFullName: z.string().min(2),
  shippingPhone: z.string().min(7),
  shippingEmail: z.email(),
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
    imageUrl: z.string().optional(),
  })).min(1),
  subtotal: z.number().min(0),
  paymentDetails: z.object({
    screenshotUrl: z.string(),
    senderName: z.string(),
    senderNumber: z.string(),
    remarks: z.string().optional(),
  }).optional(),
})

export async function POST(req: Request) {
  try {
    // 1. Authenticate user via session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse & validate body
    const body = await req.json()
    const data = orderSchema.parse(body)

    // 3. Calculate totals
    const calculatedSubtotal = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity, 0
    )
    const deliveryCharge = calculatedSubtotal >= 5000 ? 0 : 150
    const totalAmount = calculatedSubtotal + deliveryCharge

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    // 4. Use service role client for DB writes
    const adminClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 5. Upsert customer
    let { data: customer, error: custErr } = await adminClient
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      const { data: newCustomer, error: createErr } = await adminClient
        .from('customers')
        .insert({
          user_id: user.id,
          email: user.email!,
          full_name: data.shippingFullName,
          phone: data.shippingPhone,
        })
        .select('id')
        .single()

      if (createErr) throw new Error(`Customer error: ${createErr.message}`)
      customer = newCustomer
    }

    // 6. Create order
    const { data: order, error: orderErr } = await adminClient
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customer!.id,
        status: data.paymentProvider === 'COD' ? 'PENDING' : 'PAYMENT_PENDING',
        subtotal: calculatedSubtotal,
        delivery_charge: deliveryCharge,
        tax_amount: 0,
        total_amount: totalAmount,
        payment_provider: data.paymentProvider,
        shipping_full_name: data.shippingFullName,
        shipping_phone: data.shippingPhone,
        shipping_email: data.shippingEmail,
        shipping_address_line1: data.shippingAddressLine1,
        shipping_address_line2: data.shippingAddressLine2,
        shipping_city: data.shippingCity,
        shipping_district: data.shippingDistrict,
        shipping_province: data.shippingProvince,
        shipping_postal_code: data.shippingPostalCode,
        notes: data.notes,
      })
      .select('id')
      .single()

    if (orderErr) throw new Error(`Order error: ${orderErr.message}`)

    // 7. Insert order items
    const { error: itemsErr } = await adminClient
      .from('order_items')
      .insert(
        data.items.map(item => ({
          order_id: order!.id,
          product_id: item.productId,
          product_name: item.productName,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.unitPrice * item.quantity,
          image_url: item.imageUrl,
        }))
      )

    if (itemsErr) throw new Error(`Items error: ${itemsErr.message}`)

    // 8. Create payment attempt for non-COD
    if (data.paymentProvider !== 'COD') {
      await adminClient.from('payment_attempts').insert({
        order_id: order!.id,
        provider: data.paymentProvider,
        amount: totalAmount,
        status: 'PENDING_VERIFICATION', // Since it's a manual upload
        screenshot_url: data.paymentDetails?.screenshotUrl,
        sender_name: data.paymentDetails?.senderName,
        sender_number: data.paymentDetails?.senderNumber,
        remarks: data.paymentDetails?.remarks,
      })
    }

    // 9. Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        const itemsHtml = data.items.map(item => `
          <div style="display: flex; gap: 16px; margin-bottom: 16px; align-items: center; border-bottom: 1px solid #eaeaea; padding-bottom: 16px;">
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.productName}" style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px;" />` : ''}
            <div>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${item.productName}</p>
              <p style="margin: 4px 0; color: #666; font-size: 14px;">Size: ${item.size || 'N/A'} | Qty: ${item.quantity}</p>
              <p style="margin: 0; color: #333;">Rs. ${item.unitPrice}</p>
            </div>
          </div>
        `).join('')

        const paymentHtml = data.paymentProvider !== 'COD' && data.paymentDetails ? `
          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 24px;">
            <h3 style="margin-top: 0;">Payment Details (${data.paymentProvider})</h3>
            <p><strong>Sender Name:</strong> ${data.paymentDetails.senderName}</p>
            <p><strong>Sender Number:</strong> ${data.paymentDetails.senderNumber}</p>
            <p><strong>Remarks:</strong> ${data.paymentDetails.remarks || 'None'}</p>
            ${data.paymentDetails.screenshotUrl ? `
              <p style="margin-bottom: 8px;"><strong>Payment Screenshot:</strong></p>
              <a href="${data.paymentDetails.screenshotUrl}" target="_blank">
                <img src="${data.paymentDetails.screenshotUrl}" style="max-width: 300px; border-radius: 8px; border: 1px solid #ccc;" />
              </a>
            ` : ''}
          </div>
        ` : `<div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 24px;"><h3>Payment Method: Cash on Delivery</h3></div>`

        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 12px;">New Order Received!</h1>
            <p style="font-size: 16px;"><strong>Order No:</strong> ${orderNumber}</p>
            <p style="font-size: 16px;"><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
            
            <h2 style="margin-top: 32px;">Customer Details</h2>
            <p><strong>Name:</strong> ${data.shippingFullName}</p>
            <p><strong>Email:</strong> ${data.shippingEmail}</p>
            <p><strong>Phone:</strong> ${data.shippingPhone}</p>
            <p><strong>Address:</strong> ${data.shippingAddressLine1}, ${data.shippingCity}, ${data.shippingDistrict}, ${data.shippingProvince}</p>
            
            <h2 style="margin-top: 32px;">Order Items</h2>
            ${itemsHtml}
            
            ${paymentHtml}
          </div>
        `

        await resend.emails.send({
          from: 'Project Inked Orders <onboarding@resend.dev>',
          to: 'sumitkhadka708@gmail.com', // Sending specifically to the requested email
          subject: `New Order Received - ${orderNumber} (Rs. ${totalAmount})`,
          html: htmlBody,
        })
      } catch (emailError) {
        console.error('Failed to send order email:', emailError)
        // Don't throw error here so the order still succeeds even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      totalAmount,
      orderId: order!.id,
    })

  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
