'use client';

import React, { useEffect, useState } from 'react';
import { SubmissionItem, SubmissionStatus, SubmissionType } from '@/lib/types';
import '../admin.css';

export default function AdminFormsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'contact' | 'appointment'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [typeFilter, statusFilter]);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSubmissions();
  };

  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }

      setStatusMessage('Status updated successfully');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    setSavingNote(true);

    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedSubmission.id, notes: internalNote }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save notes');

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id ? { ...s, notes: internalNote, adminNotes: internalNote } : s
        )
      );
      setSelectedSubmission({ ...selectedSubmission, notes: internalNote, adminNotes: internalNote });
      setStatusMessage('Internal notes saved successfully');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      alert(err.message || 'Error saving internal notes');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete submission from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      setStatusMessage('Submission deleted');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      alert(err.message || 'Error deleting submission');
    }
  };

  const handleExportCSV = () => {
    window.location.href = `/api/admin/submissions?format=csv&type=${typeFilter}&status=${statusFilter}`;
  };

  const openDetails = (sub: SubmissionItem) => {
    setSelectedSubmission(sub);
    setInternalNote(sub.notes || sub.adminNotes || '');
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#123653', margin: 0 }}>
            Patient Inquiries & Appointment Bookings
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
            Review, triage, and record clinical follow-up for inquiries received online.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {statusMessage && (
            <span style={{ fontSize: '12px', color: '#15803d', background: '#f0fdf4', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', fontWeight: 600 }}>
              {statusMessage}
            </span>
          )}
          <button onClick={handleExportCSV} className="admin-btn admin-btn-secondary" style={{ padding: '8px 14px', fontSize: '12px' }}>
            📥 Export to CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Type filter */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setTypeFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                background: typeFilter === 'all' ? '#123653' : 'transparent',
                color: typeFilter === 'all' ? '#ffffff' : '#64748b'
              }}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('appointment')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                background: typeFilter === 'appointment' ? '#123653' : 'transparent',
                color: typeFilter === 'appointment' ? '#ffffff' : '#64748b'
              }}
            >
              Appointments
            </button>
            <button
              onClick={() => setTypeFilter('contact')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                background: typeFilter === 'contact' ? '#123653' : 'transparent',
                color: typeFilter === 'contact' ? '#ffffff' : '#64748b'
              }}
            >
              Inquiries
            </button>
          </div>

          {/* Status filter */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                background: statusFilter === 'all' ? '#123653' : 'transparent',
                color: statusFilter === 'all' ? '#ffffff' : '#64748b'
              }}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                background: statusFilter === 'new' ? '#d97706' : 'transparent',
                color: statusFilter === 'new' ? '#ffffff' : '#64748b'
              }}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter('contacted')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                background: statusFilter === 'contacted' ? '#2563eb' : 'transparent',
                color: statusFilter === 'contacted' ? '#ffffff' : '#64748b'
              }}
            >
              Contacted
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                background: statusFilter === 'resolved' ? '#059669' : 'transparent',
                color: statusFilter === 'resolved' ? '#ffffff' : '#64748b'
              }}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search patient, phone, query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
            style={{ width: '220px', padding: '7px 12px', fontSize: '12px' }}
          />
          <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '7px 14px', fontSize: '12px' }}>
            Filter
          </button>
        </form>
      </div>

      {/* Submissions Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div style={{
              width: '28px',
              height: '28px',
              border: '3px solid #cbd5e1',
              borderTopColor: '#123653',
              borderRadius: '50%',
              animation: 'adminSpin 0.8s linear infinite',
              margin: '0 auto 10px'
            }} />
            <p style={{ fontSize: '12px' }}>Loading inquiries...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No submissions found matching criteria.
          </div>
        ) : (
          <div className="admin-table-wrap" style={{ border: 'none' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient Name & Contact</th>
                  <th>Type</th>
                  <th>Service / Preferred Doctor</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const pName = sub.fullName || sub.name || sub.patientName;
                  const statusKey = (sub.status || 'new').toLowerCase();
                  const badgeClass =
                    statusKey === 'resolved'
                      ? 'admin-badge-resolved'
                      : statusKey === 'contacted'
                      ? 'admin-badge-contacted'
                      : 'admin-badge-new';

                  return (
                    <tr key={sub.id}>
                      <td>
                        <strong style={{ color: '#123653', display: 'block' }}>{pName}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px', marginTop: '2px' }}>
                          <span>📞 {sub.phone}</span>
                          {sub.email && <span>✉️ {sub.email}</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: sub.type === 'appointment' ? '#ede9fe' : '#e0f2fe',
                          color: sub.type === 'appointment' ? '#6b21a8' : '#0369a1'
                        }}>
                          {sub.type === 'appointment' ? 'Appointment' : 'Inquiry'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#334155' }}>
                          {sub.service || sub.subject || 'General Consultation'}
                        </div>
                        {sub.doctor && (
                          <div style={{ fontSize: '11px', color: '#C9A24A', fontWeight: 600 }}>
                            Dr: {sub.doctor}
                          </div>
                        )}
                        {(sub.date || sub.preferredDate) && (
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Preferred: {sub.date || sub.preferredDate} {sub.time || sub.preferredSlot ? `(${sub.time || sub.preferredSlot})` : ''}
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          value={statusKey}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                          className="admin-select"
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            borderRadius: '20px',
                            width: 'auto',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="resolved">RESOLVED</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(sub.createdAt || sub.submittedAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => openDetails(sub)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '11px' }}
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id, pName || 'this submission')}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '5px 8px', fontSize: '11px' }}
                            title="Delete submission"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                  {selectedSubmission.type.toUpperCase()} DETAILS
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#123653', margin: '2px 0 0' }}>
                  {selectedSubmission.fullName || selectedSubmission.name || selectedSubmission.patientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Phone Number:</span>
                <strong style={{ color: '#123653', fontSize: '13px' }}>
                  <a href={`tel:${selectedSubmission.phone}`} style={{ color: '#123653' }}>
                    {selectedSubmission.phone}
                  </a>
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Email Address:</span>
                <strong style={{ color: '#123653' }}>{selectedSubmission.email || 'None provided'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Clinical Service:</span>
                <strong style={{ color: '#123653' }}>{selectedSubmission.service || selectedSubmission.subject || 'General'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Doctor Preference:</span>
                <strong style={{ color: '#C9A24A' }}>{selectedSubmission.doctor || 'First Available'}</strong>
              </div>
              {(selectedSubmission.date || selectedSubmission.preferredDate) && (
                <div style={{ gridColumn: 'span 2', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>Requested Appointment Slot:</span>
                  <strong style={{ color: '#123653' }}>
                    {selectedSubmission.date || selectedSubmission.preferredDate} • {selectedSubmission.time || selectedSubmission.preferredSlot}
                  </strong>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Patient Message / Symptoms:
              </span>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', lineHeight: 1.6, color: '#334155', border: '1px solid #e2e8f0' }}>
                {selectedSubmission.message || selectedSubmission.symptoms || 'No additional message provided.'}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#123653' }}>
                  Internal Clinic Notes
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Only visible to administrators</span>
              </div>
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Log reception call timestamp, confirmed slot, doctor discussion..."
                className="admin-textarea"
                style={{ fontSize: '12px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
              <button onClick={() => setSelectedSubmission(null)} className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Close
              </button>
              <button onClick={handleSaveNotes} disabled={savingNote} className="admin-btn admin-btn-primary" style={{ padding: '8px 18px', fontSize: '12px' }}>
                {savingNote ? 'Saving...' : 'Save Internal Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
