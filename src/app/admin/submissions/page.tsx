'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmissionsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/forms');
  }, [router]);

  return null;
}
