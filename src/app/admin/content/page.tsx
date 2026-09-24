'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminContentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/pages');
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
      <div className="admin-spinner" />
      <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Redirecting to Website Pages Editor...</p>
    </div>
  );
}
