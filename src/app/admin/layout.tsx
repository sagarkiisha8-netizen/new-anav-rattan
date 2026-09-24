import React from 'react';
import { getAdminSession } from '@/lib/auth';
import AdminShell from './AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  return <AdminShell initialSession={session}>{children}</AdminShell>;
}
