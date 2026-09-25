import { NextRequest, NextResponse } from 'next/server';
import { addSubmission } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, service, message } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Full name and phone number are required.' },
        { status: 400 }
      );
    }

    const nameStr = String(fullName).trim();
    const now = new Date().toISOString();

    const submission = await addSubmission({
      id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'contact',
      fullName: nameStr,
      name: nameStr,
      phone: String(phone).trim(),
      email: email ? String(email).trim() : '',
      service: service ? String(service).trim() : '',
      subject: service ? String(service).trim() : 'General Consultation',
      message: message ? String(message).trim() : '',
      status: 'new',
      createdAt: now,
      submittedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted successfully. Our team will contact you shortly.',
      id: submission.id,
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
