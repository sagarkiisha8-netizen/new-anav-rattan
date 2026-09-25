import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getSubmissions, updateSubmission, deleteSubmission } from '@/lib/db';
import { SubmissionStatus, SubmissionType } from '@/lib/types';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type') as SubmissionType | 'all' | null;
  const statusFilter = searchParams.get('status') as SubmissionStatus | 'all' | null;
  const searchQuery = searchParams.get('search')?.toLowerCase();
  const format = searchParams.get('format');

  let list = await getSubmissions();

  if (typeFilter && typeFilter !== 'all') {
    list = list.filter((s) => s.type === typeFilter);
  }
  if (statusFilter && statusFilter !== 'all') {
    list = list.filter((s) => s.status === statusFilter);
  }
  if (searchQuery) {
    list = list.filter((s) => {
      const name = (s.fullName || s.name || s.patientName || '').toLowerCase();
      const phone = (s.phone || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const service = (s.service || s.subject || '').toLowerCase();
      const message = (s.message || s.symptoms || '').toLowerCase();

      return (
        name.includes(searchQuery) ||
        phone.includes(searchQuery) ||
        email.includes(searchQuery) ||
        service.includes(searchQuery) ||
        message.includes(searchQuery)
      );
    });
  }

  // Handle CSV export
  if (format === 'csv') {
    const headers = ['ID', 'Type', 'Full Name', 'Phone', 'Email', 'Service', 'Doctor', 'Date', 'Time', 'Status', 'Notes', 'Created At'];
    const rows = list.map((item) => {
      const pName = item.fullName || item.name || item.patientName || '';
      const pPhone = item.phone || '';
      const pEmail = item.email || '';
      const pService = item.service || item.subject || '';
      const pDoctor = item.doctor || '';
      const pDate = item.date || item.preferredDate || '';
      const pTime = item.time || item.preferredSlot || '';
      const pNotes = item.notes || item.adminNotes || '';
      const pCreated = item.createdAt || item.submittedAt || '';

      return [
        item.id,
        item.type,
        `"${pName.replace(/"/g, '""')}"`,
        `"${pPhone.replace(/"/g, '""')}"`,
        `"${pEmail.replace(/"/g, '""')}"`,
        `"${pService.replace(/"/g, '""')}"`,
        `"${pDoctor.replace(/"/g, '""')}"`,
        `"${pDate.replace(/"/g, '""')}"`,
        `"${pTime.replace(/"/g, '""')}"`,
        item.status,
        `"${pNotes.replace(/"/g, '""')}"`,
        pCreated,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="dr-rattan-submissions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ submissions: list });
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required.' }, { status: 400 });
    }

    const updated = await updateSubmission(id, {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update submission.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required.' }, { status: 400 });
    }

    const success = await deleteSubmission(id);
    if (!success) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Submission deleted.' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete submission.' }, { status: 500 });
  }
}
