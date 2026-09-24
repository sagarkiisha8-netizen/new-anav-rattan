'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { DoctorProfile, SiteContent, MediaItem } from '@/lib/types';

export default function AdminDoctorsPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorProfile | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Media picker modal state
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      const [resContent, resMedia] = await Promise.all([
        fetch('/api/admin/content'),
        fetch('/api/admin/media'),
      ]);

      const dataContent = await resContent.json();
      const contentObj = dataContent.content || dataContent;
      if (contentObj && contentObj.doctors) {
        setContent(contentObj);
      }

      const dataMedia = await resMedia.json();
      if (dataMedia.media) {
        setMediaList(dataMedia.media);
      }
    } catch (err) {
      console.error('Failed to load doctors', err);
      setStatusMessage({ type: 'error', text: 'Failed to load doctors data from server.' });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingDoctor({
      id: `doc-${Date.now()}`,
      slug: '',
      name: '',
      title: 'Consultant ENT Surgeon',
      role: 'Consultant',
      image: '/images/dr-rattan-and-dr-anav-rattan-hero2.png',
      degrees: 'MS (ENT)',
      qualifications: 'MBBS, MS (ENT)',
      regNumber: '',
      experienceYears: 5,
      experience: '5+ Years in Surgical Practice',
      surgeriesCount: '1,000+',
      bio: '',
      specialties: ['Microscopic Ear Surgery', 'Sinus Surgery (FESS)'],
      education: ['MS (ENT) — Renowned Institution'],
      opdTimings: 'Mon–Sat: 10:00 AM – 2:00 PM & 5:30 PM – 8:00 PM',
      schedule: 'Mon - Sat: 10:00 AM - 2:00 PM',
      isPublished: true,
      order: (content?.doctors.length || 0) + 1,
    });
  };

  const handleOpenEdit = (doctor: DoctorProfile) => {
    setIsNew(false);
    setEditingDoctor({
      ...doctor,
      specialties: doctor.specialties && doctor.specialties.length > 0 ? doctor.specialties : [''],
      education: doctor.education && doctor.education.length > 0 ? doctor.education : [''],
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !editingDoctor) return;

    if (!editingDoctor.name.trim() || !editingDoctor.slug.trim()) {
      alert('Doctor Name and URL Slug are required.');
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      let updatedDoctors = [...content.doctors];
      if (isNew) {
        updatedDoctors.push(editingDoctor);
      } else {
        updatedDoctors = updatedDoctors.map((d) =>
          d.id === editingDoctor.id ? editingDoctor : d
        );
      }

      const updatedContent: SiteContent = {
        ...content,
        doctors: updatedDoctors,
      };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save doctor profile');

      setContent(updatedContent);
      setEditingDoctor(null);
      setStatusMessage({
        type: 'success',
        text: `Doctor profile "${editingDoctor.name}" saved and published successfully!`,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving doctor profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!content) return;
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setSaving(true);
    try {
      const updatedDoctors = content.doctors.filter((d) => d.id !== id);
      const updatedContent: SiteContent = { ...content, doctors: updatedDoctors };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete doctor');

      setContent(updatedContent);
      setStatusMessage({ type: 'success', text: `Doctor profile "${name}" deleted.` });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting doctor');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDoctorImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDoctor) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', editingDoctor.name || file.name);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setEditingDoctor({ ...editingDoctor, image: data.mediaItem.url });
      await loadDoctors();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
        <div className="admin-spinner" />
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Loading Doctor & Specialist Profiles...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="admin-alert admin-alert-error">
        <span>⚠️</span>
        <span>Unable to load content from database. Please reload or check server logs.</span>
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
              <span className="admin-badge admin-badge-gold">ENT Faculty</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Doctor & Specialist Profiles</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#123653', margin: 0 }}>
              Specialist Surgeons & Consultants
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              Manage Dr. Ganesh Dutt Rattan, Dr. Anav Rattan, verified qualifications, experience, OPD hours, and portrait photos.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="/doctors"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View /doctors on website</span>
              <span>↗</span>
            </a>
            <button
              onClick={handleOpenAdd}
              className="admin-btn admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <span>+</span>
              <span>Add Doctor Profile</span>
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

      {/* Doctors Grid */}
      <div className="admin-grid-2">
        {content.doctors.map((doctor) => (
          <div
            key={doctor.id}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ padding: '24px' }}>
              {/* Top Row: Photo + Name + Role */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '84px',
                    height: '96px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#0B1B2B',
                    border: '2px solid rgba(201, 162, 74, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span className="admin-badge admin-badge-gold">
                      {doctor.isPublished !== false ? 'Published' : 'Draft'}
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
                      /doctors/{doctor.slug}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#123653', margin: '0 0 2px' }}>
                    {doctor.name}
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#C9A24A', marginBottom: '2px' }}>
                    {doctor.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {doctor.degrees || doctor.qualifications}
                  </div>
                </div>
              </div>

              {/* Stats Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginBottom: '14px',
                  fontSize: '12px',
                }}
              >
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Experience</span>
                  <span style={{ fontWeight: 700, color: '#123653' }}>{doctor.experience || `${doctor.experienceYears}+ Years`}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Surgeries</span>
                  <span style={{ fontWeight: 700, color: '#123653' }}>{doctor.surgeriesCount || 'High Volume'}</span>
                </div>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>OPD Schedule</span>
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '11px' }}>
                    {doctor.opdTimings || doctor.schedule}
                  </span>
                </div>
              </div>

              {/* Bio summary */}
              <p
                style={{
                  fontSize: '12px',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: '0 0 14px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {doctor.bio}
              </p>

              {/* Specialties badges */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Specialties ({doctor.specialties?.length || 0})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {(doctor.specialties || []).slice(0, 4).map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '10px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                  {(doctor.specialties || []).length > 4 && (
                    <span style={{ fontSize: '10px', color: '#64748b', padding: '3px 4px' }}>
                      +{(doctor.specialties || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div
              style={{
                padding: '14px 24px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <a
                href={`/doctors/${doctor.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#123653', fontWeight: 600, textDecoration: 'none' }}
              >
                View Profile Page ↗
              </a>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(doctor)}
                  className="admin-btn admin-btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE DOCTOR MODAL */}
      {editingDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setEditingDoctor(null)}>
          <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#123653', margin: 0 }}>
                  {isNew ? 'Add New Doctor Profile' : `Edit Profile: ${editingDoctor.name}`}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                  Update specialist credentials, surgery count, bio, specialties, and portrait photo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="admin-btn admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              {/* Doctor Portrait Section */}
              <div style={{ marginBottom: '20px' }}>
                <label className="admin-label">Doctor Portrait Photo</label>
                <div className="admin-image-control-box">
                  <div className="admin-thumb-wrapper" style={{ width: '100px', height: '115px' }}>
                    <img src={editingDoctor.image} alt={editingDoctor.name} />
                  </div>
                  <div className="admin-image-meta-info">
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Image Path: </span>
                      <span className="admin-image-path-badge">{editingDoctor.image}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Recommended: High resolution formal medical portrait with clean background.
                    </div>
                    <div className="admin-image-actions">
                      <button
                        type="button"
                        onClick={() => setPickerOpen(true)}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Choose from Media Library
                      </button>
                      <label
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Replacement'}</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleUploadDoctorImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Full Doctor Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingDoctor.name}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">URL Slug * (e.g. ganesh-dutt-rattan)</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingDoctor.slug}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Doctor Title / Role</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingDoctor.title}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Medical Degrees (e.g. MS ENT, DNB, MNAMS)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingDoctor.degrees || editingDoctor.qualifications || ''}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        degrees: e.target.value,
                        qualifications: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Registration No (e.g. PMC 23702)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingDoctor.regNumber || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, regNumber: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Years of Experience</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingDoctor.experience || `${editingDoctor.experienceYears || 5}+ Years`}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Surgeries Count</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingDoctor.surgeriesCount || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, surgeriesCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Consultation Schedule & OPD Hours</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingDoctor.opdTimings || editingDoctor.schedule || ''}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      opdTimings: e.target.value,
                      schedule: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Summary Bio</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={editingDoctor.bio}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                />
              </div>

              {/* Specialties */}
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Specialties & Procedures</label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingDoctor({
                        ...editingDoctor,
                        specialties: [...(editingDoctor.specialties || []), ''],
                      })
                    }
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                  >
                    + Add Specialty
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(editingDoctor.specialties || []).map((spec, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={spec}
                        onChange={(e) => {
                          const updated = [...(editingDoctor.specialties || [])];
                          updated[idx] = e.target.value;
                          setEditingDoctor({ ...editingDoctor, specialties: updated });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingDoctor.specialties || []).filter((_, i) => i !== idx);
                          setEditingDoctor({ ...editingDoctor, specialties: updated });
                        }}
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 10px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                  style={{ minWidth: '130px' }}
                >
                  {saving ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA PICKER MODAL FOR DOCTORS */}
      {pickerOpen && editingDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setPickerOpen(false)}>
          <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#123653', margin: 0 }}>
                  Select Portrait from Media Library
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                  Click any portrait to assign it to {editingDoctor.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="admin-btn admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                ✕ Close
              </button>
            </div>

            <div className="admin-media-picker-grid">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setEditingDoctor({ ...editingDoctor, image: item.url });
                    setPickerOpen(false);
                  }}
                  className={`admin-media-picker-item ${editingDoctor.image === item.url ? 'selected' : ''}`}
                >
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="admin-media-picker-thumb"
                  />
                  <div className="admin-media-picker-name" title={item.title || item.filename}>
                    {item.title || item.filename}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
