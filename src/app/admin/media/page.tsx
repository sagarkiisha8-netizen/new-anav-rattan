'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { MediaItem } from '@/lib/types';

interface ImageUsageMapping {
  filename: string;
  url: string;
  title: string;
  pageUsed: string;
  adminController: string;
  controllerLink: string;
}

const IMAGE_INVENTORY: ImageUsageMapping[] = [
  {
    filename: 'dr-rattan-and-dr-anav-rattan-hero2.png',
    url: '/images/dr-rattan-and-dr-anav-rattan-hero2.png',
    title: 'Dr. Ganesh Dutt Rattan & Dr. Anav Rattan (Joint Hero)',
    pageUsed: 'Home Page (Hero Section), About Page (Heritage)',
    adminController: 'Website Pages → Home → Hero Featured Image',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'dr-ganesh-dutt-rattan-0.jpeg',
    url: '/images/dr-ganesh-dutt-rattan-0.jpeg',
    title: 'Dr. Ganesh Dutt Rattan Portrait',
    pageUsed: 'Our Doctors, Doctor Profile, Home Doctors Preview',
    adminController: 'Doctors Profiles → Dr. Ganesh Dutt Rattan',
    controllerLink: '/admin/doctors',
  },
  {
    filename: 'dr-anav-rattan-1.jpeg',
    url: '/images/dr-anav-rattan-1.jpeg',
    title: 'Dr. Anav Rattan Portrait',
    pageUsed: 'Our Doctors, Doctor Profile, Home Doctors Preview',
    adminController: 'Doctors Profiles → Dr. Anav Rattan',
    controllerLink: '/admin/doctors',
  },
  {
    filename: 'cochlear-implant-programme-certificate-kem-hospital-mumbai-12.jpeg',
    url: '/images/cochlear-implant-programme-certificate-kem-hospital-mumbai-12.jpeg',
    title: 'Cochlear Implant Certification KEM Hospital',
    pageUsed: 'Research Page (Milestones), Gallery',
    adminController: 'Website Pages → Research → Milestone 2',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'dr-anav-rattan-at-iaohns-2023-conference-jammu-16.jpeg',
    url: '/images/dr-anav-rattan-at-iaohns-2023-conference-jammu-16.jpeg',
    title: 'IAOHNS 2023 National Conference, Jammu',
    pageUsed: 'Research Page (Milestones), Gallery',
    adminController: 'Website Pages → Research → Milestone 1',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'operating-theatre-pgi-chandigarh-10.jpeg',
    url: '/images/operating-theatre-pgi-chandigarh-10.jpeg',
    title: 'PGI Advanced Surgical Operating Theatre',
    pageUsed: 'Gallery, Research',
    adminController: 'Website Pages → Gallery → Item #3',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'surgical-team-pgi-chandigarh-8.jpeg',
    url: '/images/surgical-team-pgi-chandigarh-8.jpeg',
    title: 'Surgical Team at PGI Chandigarh',
    pageUsed: 'Gallery, Research',
    adminController: 'Website Pages → Gallery → Item #1',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'ent-team-pgi-chandigarh-9.jpeg',
    url: '/images/ent-team-pgi-chandigarh-9.jpeg',
    title: 'ENT Department Faculty & Residents',
    pageUsed: 'Gallery, Research',
    adminController: 'Website Pages → Gallery → Item #2',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'gallery-15.jpeg',
    url: '/images/gallery-15.jpeg',
    title: 'Guest Speaker Presentation & Felicitation',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #4',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'kem-hospital-auditorium-department-gathering-13.jpeg',
    url: '/images/kem-hospital-auditorium-department-gathering-13.jpeg',
    title: 'Academic Gathering, KEM Hospital Auditorium',
    pageUsed: 'Gallery, Research',
    adminController: 'Website Pages → Gallery → Item #6',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'seth-g-s-medical-college-kem-hospital-mumbai-14.jpeg',
    url: '/images/seth-g-s-medical-college-kem-hospital-mumbai-14.jpeg',
    title: 'Seth G.S. Medical College & KEM Hospital Mumbai',
    pageUsed: 'Gallery, Research',
    adminController: 'Website Pages → Gallery → Item #7',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'surgery-in-progress-11.jpeg',
    url: '/images/surgery-in-progress-11.jpeg',
    title: 'Precision Microsurgery in Progress',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #8',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'full-waiting-room-2.jpeg',
    url: '/images/full-waiting-room-2.jpeg',
    title: 'Patient Waiting Lounge',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #10',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'consultation-room-with-instruments-3.jpeg',
    url: '/images/consultation-room-with-instruments-3.jpeg',
    title: 'Diagnostic & Consultation Suite',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #11',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'waiting-area-notice-board-4.jpeg',
    url: '/images/waiting-area-notice-board-4.jpeg',
    title: 'Clinic Accreditation & Patient Guidelines',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #12',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'clinic-seating-area-6.jpeg',
    url: '/images/clinic-seating-area-6.jpeg',
    title: 'Comfortable Patient Seating Area',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #13',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'clinic-entrance-area-7.jpeg',
    url: '/images/clinic-entrance-area-7.jpeg',
    title: 'Modern Clinic Entrance & Chambers',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #14',
    controllerLink: '/admin/pages',
  },
  {
    filename: 'dr-g-d-rattan-nameplate-5.jpeg',
    url: '/images/dr-g-d-rattan-nameplate-5.jpeg',
    title: 'Senior Consultant Chambers Nameplate',
    pageUsed: 'Gallery',
    adminController: 'Website Pages → Gallery → Item #15',
    controllerLink: '/admin/pages',
  },
];

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'library'>('inventory');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.media) {
        setMedia(data.media);
      }
    } catch (err) {
      console.error('Failed to load media assets', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload media file');
      }

      setStatusMessage({ type: 'success', text: `Uploaded "${data.mediaItem.filename}" successfully!` });
      await loadMedia();
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error uploading file' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}" from media library?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setStatusMessage({ type: 'success', text: `Deleted "${filename}".` });
      await loadMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting media asset');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
        <div className="admin-spinner" />
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Loading Media Assets & Image Inventory...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Top Banner */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="admin-badge admin-badge-gold">Digital Assets</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Media Library & Image Inventory</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#123653', margin: 0 }}>
              Media Library & Image Assignment
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              All 18 verified clinical, academic, and portrait photographs registered with explicit website section assignments.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="admin-btn admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
            >
              {uploading ? (
                <>
                  <div className="admin-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  <span>Uploading Asset...</span>
                </>
              ) : (
                <>
                  <span>+</span>
                  <span>Upload New Media File</span>
                </>
              )}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`admin-alert ${statusMessage.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`}
            style={{ marginTop: '16px', marginBottom: 0 }}
          >
            <span>{statusMessage.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Tabs: Image Inventory vs All Media Files */}
      <div className="admin-tabs-nav">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        >
          <span>📋</span>
          <span>Image Inventory & Section Mapping (18)</span>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`admin-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
        >
          <span>🖼️</span>
          <span>All Media Assets Grid ({media.length})</span>
        </button>
      </div>

      {/* TAB 1: IMAGE INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <div className="admin-section-block">
          <div className="admin-section-header">
            <h3 className="admin-section-title">
              <span>Website Image Inventory — Page & Section Assignment</span>
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Every image mapped to its exact editor controller</span>
          </div>
          <div className="admin-section-body" style={{ padding: 0 }}>
            <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Thumbnail</th>
                    <th>Image Details & Filename</th>
                    <th>Where Used on Website</th>
                    <th>Admin Field Controller</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {IMAGE_INVENTORY.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div
                          style={{
                            width: '64px',
                            height: '50px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            background: '#e2e8f0',
                            border: '1px solid #cbd5e1',
                          }}
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#123653', fontSize: '13px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {item.url}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                          {item.pageUsed}
                        </span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-gold">
                          {item.adminController}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(item.url)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            {copiedUrl === item.url ? 'Copied!' : 'Copy URL'}
                          </button>
                          <Link
                            href={item.controllerLink}
                            className="admin-btn admin-btn-primary"
                            style={{ padding: '4px 8px', fontSize: '11px', textDecoration: 'none' }}
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL MEDIA ASSETS GRID */}
      {activeTab === 'library' && (
        <div>
          {/* Upload Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: '#ffffff',
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '24px',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>☁️</div>
            <div style={{ fontWeight: 700, color: '#123653', fontSize: '15px' }}>
              Click here to upload images or drag and drop
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              PNG, JPG, JPEG, WEBP up to 10MB. Stored persistently in data/media.json and /public/uploads/.
            </div>
          </div>

          <div className="admin-grid-4">
            {media.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      height: '140px',
                      width: '100%',
                      background: '#f1f5f9',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: '12px' }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '12px',
                        color: '#123653',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={item.title || item.filename}
                    >
                      {item.title || item.filename}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                      <span>{(((item.size || item.sizeBytes || 0) / 1024)).toFixed(1)} KB</span>
                      <span className="admin-badge admin-badge-navy" style={{ padding: '2px 6px', fontSize: '9px' }}>
                        {item.filename.split('.').pop()?.toUpperCase() || 'IMG'}
                      </span>
                    </div>

                    {item.pageUsed && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#C9A24A',
                          marginTop: '6px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={item.pageUsed}
                      >
                        {item.pageUsed}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.url)}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    {copiedUrl === item.url ? 'Copied!' : 'Copy URL'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.filename)}
                    className="admin-btn admin-btn-danger"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
