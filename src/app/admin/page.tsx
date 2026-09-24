'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkRoute() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/admin/login');
        }
      } catch {
        router.replace('/admin/login');
      }
    }

    checkRoute();
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0B1B2B',
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        border: '3px solid rgba(201,162,74,0.2)',
        borderTopColor: '#C9A24A',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: '16px'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>
        Loading Dr. Rattan ENT Admin Portal...
      </p>
    </div>
  );
}
