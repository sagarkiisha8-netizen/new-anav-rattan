'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SubmissionItem } from '@/lib/types';
import '../admin.css';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    totalAppointments: 0,
    newAppointments: 0,
    servicesCount: 0,
    doctorsCount: 0,
    mediaCount: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [subRes, contentRes, mediaRes] = await Promise.all([
          fetch('/api/admin/submissions'),
          fetch('/api/admin/content'),
          fetch('/api/admin/media'),
        ]);

        const subData = await subRes.json();
        const contentData = await contentRes.json();
        const mediaData = await mediaRes.json();

        const submissions: SubmissionItem[] = subData.submissions || [];
        const content = contentData.content || contentData;
        const media = mediaData.media || [];

        const inquiries = submissions.filter((s) => s.type === 'contact');
        const appointments = submissions.filter((s) => s.type === 'appointment');

        setStats({
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter((s) => s.status.toLowerCase() === 'new').length,
          totalAppointments: appointments.length,
          newAppointments: appointments.filter((s) => s.status.toLowerCase() === 'new').length,
          servicesCount: content?.services?.length || 0,
          doctorsCount: content?.doctors?.length || 0,
          mediaCount: media.length,
        });

        setRecentSubmissions(submissions.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #cbd5e1',
          borderTopColor: '#123653',
          borderRadius: '50%',
          animation: 'adminSpin 0.8s linear infinite',
          margin: '0 auto 12px'
        }} />
        <p style={{ fontSize: '13px' }}>Loading clinic metrics...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #123653 0%, #1c4d74 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(18, 54, 83, 0.15)'
      }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(201, 162, 74, 0.25)',
          color: '#C9A24A',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '10px'
        }}>
          Executive Operations Suite
        </span>
        <h2 style={{ fontFamily: 'var(--serif), serif', fontSize: '26px', margin: '0 0 8px' }}>
          Dr. Rattan ENT Clinic Control Dashboard
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.82)', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>
          Manage online appointments, patient questions, clinical service descriptions, doctor schedules, and image assets from this unified administration hub.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="admin-grid-4">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="admin-stat-label">Appointments</span>
            <span style={{ fontSize: '18px' }}>📅</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="admin-stat-num">{stats.totalAppointments}</span>
            {stats.newAppointments > 0 && (
              <span className="admin-badge admin-badge-new">{stats.newAppointments} New</span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Patient booking requests</span>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="admin-stat-label">Inquiries</span>
            <span style={{ fontSize: '18px' }}>💬</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="admin-stat-num">{stats.totalInquiries}</span>
            {stats.newInquiries > 0 && (
              <span className="admin-badge admin-badge-contacted">{stats.newInquiries} New</span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Questions from website</span>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="admin-stat-label">ENT Services</span>
            <span style={{ fontSize: '18px' }}>🩺</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="admin-stat-num">{stats.servicesCount}</span>
            <span className="admin-badge admin-badge-resolved">Active</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Clinical service pages</span>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="admin-stat-label">Media Assets</span>
            <span style={{ fontSize: '18px' }}>🖼️</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="admin-stat-num">{stats.mediaCount}</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Uploaded</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Photos & banners</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Management Shortcuts</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <Link
            href="/admin/forms"
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#1a202c',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📋</div>
            <strong style={{ fontSize: '13px', color: '#123653' }}>Patient Inquiries</strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Review incoming bookings</span>
          </Link>

          <Link
            href="/admin/pages"
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#1a202c',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📑</div>
            <strong style={{ fontSize: '13px', color: '#123653' }}>Website Pages CMS</strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Edit every page & section</span>
          </Link>

          <Link
            href="/admin/services"
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#1a202c',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔬</div>
            <strong style={{ fontSize: '13px', color: '#123653' }}>Clinical Services</strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Add or edit ENT offerings</span>
          </Link>

          <Link
            href="/admin/doctors"
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#1a202c',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>👨‍⚕️</div>
            <strong style={{ fontSize: '13px', color: '#123653' }}>Doctor Profiles</strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Schedules & credentials</span>
          </Link>

          <Link
            href="/admin/media"
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#1a202c',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📁</div>
            <strong style={{ fontSize: '13px', color: '#123653' }}>Media Library</strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Upload clinic images</span>
          </Link>

          <Link
            href="/admin/settings"
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#1a202c',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚙️</div>
            <strong style={{ fontSize: '13px', color: '#123653' }}>Admin Settings</strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Change password & auth</span>
          </Link>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Recent Inquiries & Appointments</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
              Latest patient requests received through website forms
            </p>
          </div>
          <Link href="/admin/forms" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
            View All ({stats.totalAppointments + stats.totalInquiries}) →
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No patient inquiries received yet. When visitors fill the Contact or Book Appointment forms, they will show here.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Type</th>
                  <th>Service / Concern</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((sub) => {
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
                        <strong style={{ color: '#123653' }}>{sub.fullName || sub.name || sub.patientName}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{sub.phone}</div>
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
                      <td>{sub.service || sub.subject || 'General Consultation'}</td>
                      <td>
                        <span className={`admin-badge ${badgeClass}`}>
                          {sub.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: '#64748b' }}>
                        {(sub.createdAt || sub.submittedAt) ? new Date((sub.createdAt || sub.submittedAt) as string).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Recent'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href="/admin/forms" style={{ color: '#123653', fontWeight: 600, textDecoration: 'none', fontSize: '12px' }}>
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
