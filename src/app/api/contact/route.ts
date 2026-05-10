import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Resend } from 'resend';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  inquiryType: z.string(),
  orderNumber: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const message = await db.contactMessage.create({
      data: validatedData,
    });

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Project Inked <onboarding@resend.dev>',
          to: process.env.CONTACT_RECEIVER_EMAIL || 'support@projectinked.com',
          subject: `[Contact] ${validatedData.inquiryType}: ${validatedData.subject}`,
          text: [
            `Name: ${validatedData.name}`,
            `Email: ${validatedData.email}`,
            validatedData.phone ? `Phone: ${validatedData.phone}` : '',
            validatedData.orderNumber ? `Order: ${validatedData.orderNumber}` : '',
            `\nMessage:\n${validatedData.message}`,
          ].filter(Boolean).join('\n'),
        });
      } catch (emailError) {
        console.error('Failed to send contact email:', emailError);
      }
    }

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Contact form error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
