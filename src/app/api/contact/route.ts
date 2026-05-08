import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
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

    // TODO: Integrate Resend to send an email notification here
    
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
