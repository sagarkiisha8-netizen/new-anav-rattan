'use client';

import React, { useEffect, useState } from 'react';
import '../admin.css';

export default function AdminSettingsPage() {
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.admin?.email) {
          setAdminEmail(data.admin.email);
        }
      })
      .catch(() => {});
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setStatusMessage({ type: 'success', text: 'Password updated successfully! Please use it on your next login.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error updating password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Security & Credentials</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
              Update your administrator login password and account credentials
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className={`admin-alert ${statusMessage.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`}>
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className="admin-form-group">
            <label className="admin-label">Account Email</label>
            <input
              type="text"
              disabled
              value={adminEmail || 'admin@drrattanentclinic.com'}
              className="admin-input"
              style={{ background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Primary administrative email cannot be altered directly.
            </span>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="admin-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ padding: '10px 20px', marginTop: '8px' }}
          >
            {loading ? 'Saving New Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">System & Storage Information</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Platform Architecture</span>
            <strong style={{ color: '#123653' }}>Next.js 16 (App Router)</strong>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Data Storage Mode</span>
            <strong style={{ color: '#123653' }}>Persistent File Database</strong>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Media Assets Directory</span>
            <strong style={{ color: '#123653' }}>/public/uploads/</strong>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Session Security</span>
            <strong style={{ color: '#10b981' }}>HttpOnly HMAC-SHA256</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
