import { NextRequest, NextResponse } from 'next/server';
import { addSubmission } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, service, doctor, date, time, message } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Full name and phone number are required.' },
        { status: 400 }
      );
    }

    const nameStr = String(fullName).trim();
    const now = new Date().toISOString();

    const submission = await addSubmission({
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'appointment',
      fullName: nameStr,
      name: nameStr,
      patientName: nameStr,
      phone: String(phone).trim(),
      email: email ? String(email).trim() : '',
      service: service ? String(service).trim() : '',
      doctor: doctor ? String(doctor).trim() : 'Either Specialist',
      date: date ? String(date).trim() : '',
      preferredDate: date ? String(date).trim() : '',
      time: time ? String(time).trim() : '',
      preferredSlot: time ? String(time).trim() : '',
      message: message ? String(message).trim() : '',
      symptoms: message ? String(message).trim() : '',
      status: 'new',
      createdAt: now,
      submittedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: 'Your appointment request has been received. Our clinic reception will call you to confirm your slot.',
      id: submission.id,
    });
  } catch (error) {
    console.error('Appointment submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process appointment request. Please try again.' },
      { status: 500 }
    );
  }
}
