'use client';

import React, { useEffect, useState } from 'react';
import { ServiceItem, SiteContent } from '@/lib/types';
import ImageFieldControl from '@/components/admin/ImageFieldControl';

export default function AdminServicesPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadServices = async () => {
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      const data = await res.json();
      const contentObj = data.content || data;
      if (contentObj && contentObj.services) {
        setContent(contentObj);
      }
    } catch (err) {
      console.error('Failed to load services', err);
      setStatusMessage({ type: 'error', text: 'Failed to load services data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingService({
      id: `srv-${Date.now()}`,
      slug: '',
      num: String((content?.services.length || 0) + 1).padStart(2, '0'),
      name: '',
      title: '',
      category: 'General ENT',
      desc: '',
      shortDescription: '',
      fullDescription: '',
      icon: '👂',
      highlights: ['Specialist Assessment', 'Advanced Diagnostics'],
      symptoms: [''],
      treatments: [''],
      procedures: [''],
      recovery: 'Consult with specialist for individualized recovery plan.',
      isPublished: true,
      order: (content?.services.length || 0) + 1,
    });
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setIsNew(false);
    setEditingService({
      ...service,
      highlights: service.highlights && service.highlights.length > 0 ? service.highlights : [''],
      symptoms: service.symptoms && service.symptoms.length > 0 ? service.symptoms : [''],
      treatments: service.treatments && service.treatments.length > 0 ? service.treatments : [''],
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !editingService) return;

    if (!editingService.name.trim() || !editingService.slug.trim()) {
      alert('Service Name and URL slug are required.');
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      let updatedServices = [...content.services];
      if (isNew) {
        updatedServices.push(editingService);
      } else {
        updatedServices = updatedServices.map((s) =>
          s.id === editingService.id ? editingService : s
        );
      }

      const updatedContent: SiteContent = {
        ...content,
        services: updatedServices,
      };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save service');

      setContent(data.content || updatedContent);
      setEditingService(null);
      setStatusMessage({
        type: 'success',
        text: `Service "${editingService.name}" saved and published successfully!`,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!content) return;
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return;

    setSaving(true);
    try {
      const updatedServices = content.services.filter((s) => s.id !== id);
      const updatedContent: SiteContent = { ...content, services: updatedServices };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete service');

      setContent(data.content || updatedContent);
      setStatusMessage({ type: 'success', text: `Service "${name}" deleted.` });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting service');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
        <div className="admin-spinner" />
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Loading Clinical ENT Services...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="admin-alert admin-alert-error">
        <span>⚠️</span>
        <span>Unable to load services data. Please check server logs.</span>
      </div>
    );
  }

  const filteredServices = content.services.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
  });

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Top Banner */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="admin-badge admin-badge-gold">Clinical Care</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>ENT Services Manager</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#123653', margin: 0 }}>
              Specialised ENT Clinical Services ({content.services.length})
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              Manage clinical subspecialties, procedural highlights, descriptions, recovery advice, and page URLs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="/services"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View /services on website</span>
              <span>↗</span>
            </a>
            <button
              onClick={handleOpenAdd}
              className="admin-btn admin-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <span>+</span>
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ marginTop: '18px', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="admin-input"
            style={{ maxWidth: '380px' }}
            placeholder="Search services by keyword, category, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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

      {/* Services Grid */}
      <div className="admin-grid-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
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
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{service.icon || '👂'}</span>
                  <span className="admin-badge admin-badge-navy">{service.category}</span>
                </div>
                <span className="admin-badge admin-badge-gold">#{service.num || service.order}</span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#123653', margin: '0 0 4px' }}>
                {service.name}
              </h3>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginBottom: '10px' }}>
                /services/{service.slug}
              </div>

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
                {service.desc}
              </p>

              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Highlights ({service.highlights?.length || 0})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {(service.highlights || []).slice(0, 3).map((h, hIdx) => (
                    <span
                      key={hIdx}
                      style={{
                        fontSize: '10px',
                        background: '#f1f5f9',
                        color: '#334155',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                  {(service.highlights || []).length > 3 && (
                    <span style={{ fontSize: '10px', color: '#64748b', padding: '2px 4px' }}>
                      +{(service.highlights || []).length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '12px 20px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <a
                href={`/services/${service.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#123653', fontWeight: 600, textDecoration: 'none' }}
              >
                View Page ↗
              </a>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(service)}
                  className="admin-btn admin-btn-primary"
                  style={{ padding: '4px 12px', fontSize: '11px' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteService(service.id, service.name)}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE SERVICE MODAL */}
      {editingService && (
        <div className="admin-modal-backdrop" onClick={() => setEditingService(null)}>
          <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#123653', margin: 0 }}>
                  {isNew ? 'Add New ENT Service' : `Edit Service: ${editingService.name}`}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                  Update service title, subspecialty category, descriptions, procedural highlights, and recovery info.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="admin-btn admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Service Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">URL Slug * (e.g. ear-care)</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={editingService.slug}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Emoji / Icon (e.g. 👂, 👃, 🗣️, 👶)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingService.icon}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Display Order Number (e.g. 01, 02)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingService.num || ''}
                    onChange={(e) => setEditingService({ ...editingService, num: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={editingService.desc}
                  onChange={(e) => setEditingService({ ...editingService, desc: e.target.value })}
                />
              </div>

              {/* Service Featured Image */}
              <div style={{ marginBottom: '20px' }}>
                <ImageFieldControl
                  label="Service Featured / Card Image"
                  description="Optional image for this clinical specialty. If removed, the specialty card displays its primary clinical icon and typography."
                  currentUrl={editingService.image || ''}
                  onChange={(newUrl) => setEditingService({ ...editingService, image: newUrl })}
                  previewLink={editingService.slug ? `/services/${editingService.slug}` : '/services'}
                  sectionName={`Service: ${editingService.name || 'Specialty'}`}
                  pageName="Services"
                />
              </div>

              {/* Highlights */}
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Procedural Highlights</label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService({
                        ...editingService,
                        highlights: [...(editingService.highlights || []), ''],
                      })
                    }
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                  >
                    + Add Highlight
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(editingService.highlights || []).map((h, hIdx) => (
                    <div key={hIdx} style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={h}
                        onChange={(e) => {
                          const updated = [...(editingService.highlights || [])];
                          updated[hIdx] = e.target.value;
                          setEditingService({ ...editingService, highlights: updated });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingService.highlights || []).filter((_, i) => i !== hIdx);
                          setEditingService({ ...editingService, highlights: updated });
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
                  onClick={() => setEditingService(null)}
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
    </div>
  );
}
