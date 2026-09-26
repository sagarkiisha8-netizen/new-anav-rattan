'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { SiteContent, MediaItem } from '@/lib/types';
import ImageFieldControl from '@/components/admin/ImageFieldControl';

type PageKey =
  | 'home'
  | 'about'
  | 'research'
  | 'faqs'
  | 'gallery'
  | 'contact'
  | 'appointment'
  | 'global';

interface PageMeta {
  key: PageKey;
  label: string;
  icon: string;
  publicUrl: string;
  desc: string;
}

const PAGE_LIST: PageMeta[] = [
  { key: 'home', label: 'Home Page', icon: '🏠', publicUrl: '/', desc: 'Hero section, stats, why choose us, testimonials & CTAs' },
  { key: 'about', label: 'About Our Clinic', icon: 'ℹ️', publicUrl: '/about', desc: 'Heritage, PGI background, mission/vision, facilities & patient journey' },
  { key: 'research', label: 'Research & Milestones', icon: '🔬', publicUrl: '/research', desc: 'IAOHNS conference, clinical milestones & surgical inquiries' },
  { key: 'faqs', label: 'Frequently Asked Questions', icon: '❓', publicUrl: '/faqs', desc: 'All 13 clinical questions across ear, sinus, throat, vertigo & pediatrics' },
  { key: 'gallery', label: 'Photo & Surgical Gallery', icon: '🖼️', publicUrl: '/gallery', desc: 'All 15 clinic and surgical photos, categories & captions' },
  { key: 'contact', label: 'Contact & Location', icon: '📍', publicUrl: '/contact', desc: 'Address, phone numbers, email, Google Maps & OPD hours' },
  { key: 'appointment', label: 'Book Appointment', icon: '📅', publicUrl: '/book-appointment', desc: 'Appointment booking banner, instructions & WhatsApp coordination' },
  { key: 'global', label: 'Global Settings (Nav & Footer)', icon: '🌐', publicUrl: '/', desc: 'Top bar timings, logo, navigation links, and footer copyright' },
];

export default function AdminPagesEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [persistenceInfo, setPersistenceInfo] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dirty tracking
  const initialContentRef = useRef<string | null>(null);
  const isDirty = content && initialContentRef.current ? JSON.stringify(content) !== initialContentRef.current : false;

  // Media picker modal state
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<((url: string, alt?: string) => void) | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  // Prevent accidental navigation when unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes in the editor. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  async function loadAllData() {
    try {
      const [resContent, resMedia] = await Promise.all([
        fetch('/api/admin/content', { cache: 'no-store' }),
        fetch('/api/admin/media', { cache: 'no-store' }),
      ]);

      const dataContent = await resContent.json();
      const contentObj: SiteContent = dataContent.content || dataContent;
      setContent(contentObj);
      initialContentRef.current = JSON.stringify(contentObj);

      if (dataContent.persistence?.target) {
        setPersistenceInfo(dataContent.persistence.target);
      }

      const dataMedia = await resMedia.json();
      if (dataMedia.media) {
        setMediaList(dataMedia.media);
      }
    } catch (err) {
      console.error('Failed to load page data', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenMediaPicker = (onSelect: (url: string, alt?: string) => void) => {
    setPickerCallback(() => onSelect);
    setPickerOpen(true);
  };

  const handleSelectMedia = (item: MediaItem) => {
    if (pickerCallback) {
      pickerCallback(item.url, item.alt || item.title);
    }
    setPickerOpen(false);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, onSelect: (url: string, alt?: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds 10MB limit.');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onSelect(data.mediaItem.url, data.mediaItem.alt);
      setStatusMessage({ type: 'success', text: `Uploaded "${data.mediaItem.filename}" and updated section!` });
      await loadAllData();
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error uploading image' });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (isDraft = false) => {
    if (!content) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save changes');

      // Update local state with the exact persisted content returned by server
      if (data.content) {
        setContent(data.content);
        initialContentRef.current = JSON.stringify(data.content);
      } else {
        initialContentRef.current = JSON.stringify(content);
      }

      const now = new Date().toLocaleTimeString();
      setLastSaved(now);

      const targetDesc = data.persistence?.target || "Persistent Storage";
      setPersistenceInfo(targetDesc);

      setStatusMessage({
        type: 'success',
        text: isDraft
          ? `Draft saved to ${targetDesc} at ${now}.`
          : `Published & saved to ${targetDesc} at ${now}! Live on website.`,
      });
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error saving content' });
    } finally {
      setSaving(false);
    }
  };

  const handleReload = async () => {
    if (isDirty) {
      const confirmDiscard = window.confirm("You have unsaved changes. Discard them and reload from server storage?");
      if (!confirmDiscard) return;
    }
    setLoading(true);
    await loadAllData();
    setStatusMessage({ type: 'success', text: 'Reloaded latest content from storage.' });
  };

  if (loading || !content) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
        <div className="admin-spinner" />
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Loading Website Page CMS Data...</p>
      </div>
    );
  }

  const currentPageMeta = PAGE_LIST.find((p) => p.key === activePage)!;

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Top Header Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="admin-badge admin-badge-gold">Interactive CMS</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Website Pages Editor</span>
              {isDirty ? (
                <span className="admin-badge admin-badge-amber" style={{ animation: 'pulse 2s infinite' }}>
                  ● Unsaved Changes
                </span>
              ) : (
                <span className="admin-badge admin-badge-green">
                  ✓ Synced with Storage
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#123653', margin: 0 }}>
              {currentPageMeta.icon} {currentPageMeta.label}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              {currentPageMeta.desc}
            </p>
            {(lastSaved || persistenceInfo) && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px', fontSize: '11.5px', color: '#64748b' }}>
                {lastSaved && <span>Last saved: <strong>{lastSaved}</strong></span>}
                {persistenceInfo && <span>· Persistence: <strong style={{ color: '#0f766e' }}>{persistenceInfo}</strong></span>}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleReload}
              disabled={saving}
              title="Reload content from server storage"
              className="admin-btn admin-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <span>🔄</span>
              <span>Reload</span>
            </button>

            <a
              href={currentPageMeta.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View live</span>
              <span>↗</span>
            </a>

            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="admin-btn admin-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="admin-btn admin-btn-gold"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontWeight: 700 }}
            >
              {saving ? (
                <>
                  <div className="admin-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  <span>Saving & Publishing...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Save & Publish Changes</span>
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

      {/* Page Tabs */}
      <div className="admin-tabs-nav">
        {PAGE_LIST.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setActivePage(p.key);
              setStatusMessage(null);
            }}
            className={`admin-tab-btn ${activePage === p.key ? 'active' : ''}`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Hidden File Input for Direct Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
      />

      {/* PAGE 1: HOME PAGE */}
      {activePage === 'home' && (
        <div>
          {/* Section 1: Hero Banner */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>1. Hero Banner Section</span>
                <span className="admin-badge admin-badge-gold">Top of Homepage</span>
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Appears on /</span>
            </div>
            <div className="admin-section-body">
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Top Highlight Badge</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.hero.badge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: { ...content.home, hero: { ...content.home.hero, badge: e.target.value } },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">City / Location Highlight</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.hero.highlightedTitle}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: { ...content.home, hero: { ...content.home.hero, highlightedTitle: e.target.value } },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Main Hero Headline</label>
                <input
                  type="text"
                  className="admin-input"
                  style={{ fontWeight: 700, fontSize: '15px' }}
                  value={content.home.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      home: { ...content.home, hero: { ...content.home.hero, title: e.target.value } },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description / Subtitle</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.home.hero.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      home: { ...content.home, hero: { ...content.home.hero, description: e.target.value } },
                    })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="admin-grid-2" style={{ marginTop: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#123653', marginBottom: '8px' }}>Primary Button (Book Appointment)</div>
                  <div className="admin-form-group">
                    <label className="admin-label">Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={content.home.hero.primaryButton.label}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          home: {
                            ...content.home,
                            hero: {
                              ...content.home.hero,
                              primaryButton: { ...content.home.hero.primaryButton, label: e.target.value },
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Destination Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={content.home.hero.primaryButton.link}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          home: {
                            ...content.home,
                            hero: {
                              ...content.home.hero,
                              primaryButton: { ...content.home.hero.primaryButton, link: e.target.value },
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#123653', marginBottom: '8px' }}>Secondary Button (Services)</div>
                  <div className="admin-form-group">
                    <label className="admin-label">Label</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={content.home.hero.secondaryButton.label}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          home: {
                            ...content.home,
                            hero: {
                              ...content.home.hero,
                              secondaryButton: { ...content.home.hero.secondaryButton, label: e.target.value },
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Destination Link</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={content.home.hero.secondaryButton.link}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          home: {
                            ...content.home,
                            hero: {
                              ...content.home.hero,
                              secondaryButton: { ...content.home.hero.secondaryButton, link: e.target.value },
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Hero Image Management */}
              <div style={{ marginTop: '20px' }}>
                <ImageFieldControl
                  label="Hero Featured Image (Real Doctors Portrait)"
                  description="Shows Dr. Ganesh Dutt Rattan & Dr. Anav Rattan together on the navy hero background."
                  currentUrl={content.home.hero.image}
                  defaultUrl="/images/dr-rattan-and-dr-anav-rattan-hero2.png"
                  defaultAlt="Dr. Ganesh Dutt Rattan & Dr. Anav Rattan - Senior ENT Specialists"
                  previewLink="/#hero"
                  mediaList={mediaList}
                  sectionName="Hero Banner Section"
                  pageName="Home"
                  onRefreshMedia={async () => {
                    const res = await fetch('/api/admin/media', { cache: 'no-store' });
                    const data = await res.json();
                    if (data.media) setMediaList(data.media);
                  }}
                  onChange={(newUrl) => {
                    setContent({
                      ...content,
                      home: { ...content.home, hero: { ...content.home.hero, image: newUrl } },
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Trust & Key Statistics */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>2. Trust Statistics Bar</span>
                <span className="admin-badge admin-badge-gold">Counter Badges</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-grid-4">
                {content.home.statistics.map((stat, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Stat Value</label>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 800, color: '#123653', fontSize: '16px' }}
                        value={stat.number}
                        onChange={(e) => {
                          const newStats = [...content.home.statistics];
                          newStats[idx].number = e.target.value;
                          setContent({
                            ...content,
                            home: { ...content.home, statistics: newStats },
                          });
                        }}
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Label Description</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.home.statistics];
                          newStats[idx].label = e.target.value;
                          setContent({
                            ...content,
                            home: { ...content.home, statistics: newStats },
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Why Choose Us */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>3. Why Choose Us Section</span>
                <span className="admin-badge admin-badge-gold">5 Clinical Pillars</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-grid-2" style={{ marginBottom: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Section Tag / Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.whyChooseUs.label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          whyChooseUs: { ...content.home.whyChooseUs, label: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Headline</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.whyChooseUs.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          whyChooseUs: { ...content.home.whyChooseUs, title: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {content.home.whyChooseUs.benefits.map((b, bIdx) => (
                  <div key={b.id || bIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span className="admin-badge admin-badge-navy">{b.num}</span>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                        value={b.title}
                        onChange={(e) => {
                          const newB = [...content.home.whyChooseUs.benefits];
                          newB[bIdx].title = e.target.value;
                          setContent({
                            ...content,
                            home: { ...content.home, whyChooseUs: { ...content.home.whyChooseUs, benefits: newB } },
                          });
                        }}
                      />
                    </div>
                    <textarea
                      className="admin-textarea"
                      rows={2}
                      value={b.desc}
                      onChange={(e) => {
                        const newB = [...content.home.whyChooseUs.benefits];
                        newB[bIdx].desc = e.target.value;
                        setContent({
                          ...content,
                          home: { ...content.home, whyChooseUs: { ...content.home.whyChooseUs, benefits: newB } },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Your Patient Journey Timeline */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>4. Your Patient Journey Timeline</span>
                <span className="admin-badge admin-badge-gold">4-Step Clinical Process</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-grid-2" style={{ marginBottom: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Eyebrow Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.patientJourney?.label ?? 'THE PROCESS'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          patientJourney: {
                            label: e.target.value,
                            title: content.home.patientJourney?.title ?? 'Your Patient Journey',
                            subtitle: content.home.patientJourney?.subtitle ?? '',
                            steps: content.home.patientJourney?.steps ?? [],
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.patientJourney?.title ?? 'Your Patient Journey'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          patientJourney: {
                            label: content.home.patientJourney?.label ?? 'THE PROCESS',
                            title: e.target.value,
                            subtitle: content.home.patientJourney?.subtitle ?? '',
                            steps: content.home.patientJourney?.steps ?? [],
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Section Subtitle / Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={content.home.patientJourney?.subtitle ?? ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      home: {
                        ...content.home,
                        patientJourney: {
                          label: content.home.patientJourney?.label ?? 'THE PROCESS',
                          title: content.home.patientJourney?.title ?? 'Your Patient Journey',
                          subtitle: e.target.value,
                          steps: content.home.patientJourney?.steps ?? [],
                        },
                      },
                    })
                  }
                />
              </div>

              {/* Journey Steps List */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#123653', marginBottom: '12px' }}>
                  Journey Steps ({content.home.patientJourney?.steps?.length || 4})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(content.home.patientJourney?.steps ?? []).map((st, stIdx) => (
                    <div key={st.id || stIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div className="admin-grid-3" style={{ marginBottom: '10px' }}>
                        <div className="admin-form-group">
                          <label className="admin-label">Step Number</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={st.stepNumber}
                            onChange={(e) => {
                              const newSteps = [...(content.home.patientJourney?.steps ?? [])];
                              newSteps[stIdx].stepNumber = e.target.value;
                              setContent({
                                ...content,
                                home: {
                                  ...content.home,
                                  patientJourney: {
                                    ...(content.home.patientJourney || { label: '', title: '', subtitle: '', steps: [] }),
                                    steps: newSteps,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Step Title</label>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ fontWeight: 700 }}
                            value={st.title}
                            onChange={(e) => {
                              const newSteps = [...(content.home.patientJourney?.steps ?? [])];
                              newSteps[stIdx].title = e.target.value;
                              setContent({
                                ...content,
                                home: {
                                  ...content.home,
                                  patientJourney: {
                                    ...(content.home.patientJourney || { label: '', title: '', subtitle: '', steps: [] }),
                                    steps: newSteps,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Badge / Category</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={st.badge || ''}
                            onChange={(e) => {
                              const newSteps = [...(content.home.patientJourney?.steps ?? [])];
                              newSteps[stIdx].badge = e.target.value;
                              setContent({
                                ...content,
                                home: {
                                  ...content.home,
                                  patientJourney: {
                                    ...(content.home.patientJourney || { label: '', title: '', subtitle: '', steps: [] }),
                                    steps: newSteps,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="admin-grid-2">
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label className="admin-label">Medical Icon</label>
                          <select
                            className="admin-input"
                            value={st.icon || 'stethoscope'}
                            onChange={(e) => {
                              const newSteps = [...(content.home.patientJourney?.steps ?? [])];
                              newSteps[stIdx].icon = e.target.value;
                              setContent({
                                ...content,
                                home: {
                                  ...content.home,
                                  patientJourney: {
                                    ...(content.home.patientJourney || { label: '', title: '', subtitle: '', steps: [] }),
                                    steps: newSteps,
                                  },
                                },
                              });
                            }}
                          >
                            <option value="stethoscope">🩺 Stethoscope (Consultation / Assessment)</option>
                            <option value="microscope">🔬 Microscope (Diagnosis / Imaging)</option>
                            <option value="clipboard">📋 Clipboard (Treatment Plan)</option>
                            <option value="shield">🛡️ Shield (Follow-up Care / Recovery)</option>
                          </select>
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label className="admin-label">Step Description</label>
                          <textarea
                            className="admin-textarea"
                            rows={2}
                            value={st.desc}
                            onChange={(e) => {
                              const newSteps = [...(content.home.patientJourney?.steps ?? [])];
                              newSteps[stIdx].desc = e.target.value;
                              setContent({
                                ...content,
                                home: {
                                  ...content.home,
                                  patientJourney: {
                                    ...(content.home.patientJourney || { label: '', title: '', subtitle: '', steps: [] }),
                                    steps: newSteps,
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Patient Testimonials & Carousel Settings */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>5. Patient Testimonials & Carousel Settings</span>
                <span className="admin-badge admin-badge-gold">Carousel & Reviews</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-grid-2" style={{ marginBottom: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Eyebrow Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.testimonialsSection?.label ?? 'PATIENT STORIES'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          testimonialsSection: {
                            ...(content.home.testimonialsSection || { title: '', subtitle: '', autoplay: true, autoplayInterval: 5500 }),
                            label: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.testimonialsSection?.title ?? 'What Our Patients Say'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          testimonialsSection: {
                            ...(content.home.testimonialsSection || { label: '', subtitle: '', autoplay: true, autoplayInterval: 5500 }),
                            title: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Section Subtitle / Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={content.home.testimonialsSection?.subtitle ?? ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      home: {
                        ...content.home,
                        testimonialsSection: {
                          ...(content.home.testimonialsSection || { label: '', title: '', autoplay: true, autoplayInterval: 5500 }),
                          subtitle: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <div className="admin-grid-2" style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Autoplay Carousel</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    <input
                      type="checkbox"
                      id="testimonialsAutoplay"
                      checked={content.home.testimonialsSection?.autoplay !== false}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          home: {
                            ...content.home,
                            testimonialsSection: {
                              ...(content.home.testimonialsSection || { label: '', title: '', subtitle: '' }),
                              autoplay: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    <label htmlFor="testimonialsAutoplay" style={{ fontSize: '13.5px', color: '#123653', cursor: 'pointer' }}>
                      Automatically transition cards
                    </label>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Autoplay Interval (milliseconds)</label>
                  <input
                    type="number"
                    className="admin-input"
                    step="500"
                    min="2000"
                    max="15000"
                    value={content.home.testimonialsSection?.autoplayInterval ?? 5500}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          testimonialsSection: {
                            ...(content.home.testimonialsSection || { label: '', title: '', subtitle: '', autoplay: true }),
                            autoplayInterval: parseInt(e.target.value) || 5500,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Testimonials Cards Grid */}
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#123653', marginBottom: '12px' }}>
                Testimonial Cards ({content.home.testimonials.length})
              </div>
              <div className="admin-grid-3">
                {content.home.testimonials.map((t, tIdx) => (
                  <div key={t.id || tIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Patient Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={t.author}
                        onChange={(e) => {
                          const newT = [...content.home.testimonials];
                          newT[tIdx].author = e.target.value;
                          setContent({
                            ...content,
                            home: { ...content.home, testimonials: newT },
                          });
                        }}
                      />
                    </div>
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label className="admin-label">Initials</label>
                        <input
                          type="text"
                          maxLength={3}
                          className="admin-input"
                          value={t.initials || ''}
                          placeholder="e.g. AS"
                          onChange={(e) => {
                            const newT = [...content.home.testimonials];
                            newT[tIdx].initials = e.target.value;
                            setContent({
                              ...content,
                              home: { ...content.home, testimonials: newT },
                            });
                          }}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Star Rating</label>
                        <select
                          className="admin-input"
                          value={t.stars || 5}
                          onChange={(e) => {
                            const newT = [...content.home.testimonials];
                            newT[tIdx].stars = parseInt(e.target.value) || 5;
                            setContent({
                              ...content,
                              home: { ...content.home, testimonials: newT },
                            });
                          }}
                        >
                          <option value="5">★★★★★ (5 Stars)</option>
                          <option value="4">★★★★☆ (4 Stars)</option>
                          <option value="3">★★★☆☆ (3 Stars)</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Condition / Treatment Badge</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Chronic Sinus Care"
                        value={t.condition || ''}
                        onChange={(e) => {
                          const newT = [...content.home.testimonials];
                          newT[tIdx].condition = e.target.value;
                          setContent({
                            ...content,
                            home: { ...content.home, testimonials: newT },
                          });
                        }}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Location / City</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={t.location || ''}
                        onChange={(e) => {
                          const newT = [...content.home.testimonials];
                          newT[tIdx].location = e.target.value;
                          setContent({
                            ...content,
                            home: { ...content.home, testimonials: newT },
                          });
                        }}
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Review Text</label>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={t.text}
                        onChange={(e) => {
                          const newT = [...content.home.testimonials];
                          newT[tIdx].text = e.target.value;
                          setContent({
                            ...content,
                            home: { ...content.home, testimonials: newT },
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Bottom CTA Banner */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>6. Bottom CTA Banner</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">CTA Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.ctaBanner.heading}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: { ...content.home, ctaBanner: { ...content.home.ctaBanner, heading: e.target.value } },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">CTA Subheading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.home.ctaBanner.subheading}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        home: { ...content.home, ctaBanner: { ...content.home.ctaBanner, subheading: e.target.value } },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: ABOUT OUR CLINIC */}
      {activePage === 'about' && (
        <div>
          {/* Section 1: Page Header */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>1. About Header Banner</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-form-group">
                <label className="admin-label">Label / Tagline</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.about.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, label: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Page Title</label>
                <input
                  type="text"
                  className="admin-input"
                  style={{ fontWeight: 700 }}
                  value={content.about.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Intro Subtitle</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.about.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, subtitle: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 2: Heritage & History */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>2. Heritage & Legacy Section</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-form-group">
                <label className="admin-label">Legacy Headline</label>
                <input
                  type="text"
                  className="admin-input"
                  style={{ fontWeight: 700 }}
                  value={content.about.legacyTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, legacyTitle: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Paragraph 1 (Dr. Ganesh Dutt Rattan Founder)</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.about.legacyParagraph1}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, legacyParagraph1: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Paragraph 2 (Dr. Anav Rattan Specialized Practice)</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.about.legacyParagraph2}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, legacyParagraph2: e.target.value },
                    })
                  }
                />
              </div>

              {/* Legacy Image */}
              <div style={{ marginTop: '16px' }}>
                <ImageFieldControl
                  label="Heritage Section Featured Image"
                  description="Senior ENT leadership and institutional legacy photo on /about."
                  currentUrl={content.about.legacyImage}
                  defaultUrl="/images/dr-rattan-and-dr-anav-rattan-hero2.png"
                  defaultAlt="Dr. Ganesh Dutt Rattan and Dr. Anav Rattan at Dr. Rattan ENT Clinic"
                  previewLink="/about"
                  mediaList={mediaList}
                  sectionName="Heritage Legacy Section"
                  pageName="About"
                  onRefreshMedia={async () => {
                    const res = await fetch('/api/admin/media', { cache: 'no-store' });
                    const data = await res.json();
                    if (data.media) setMediaList(data.media);
                  }}
                  onChange={(newUrl) => {
                    setContent({
                      ...content,
                      about: { ...content.about, legacyImage: newUrl },
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Mission, Vision & Ethics */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>3. Mission, Vision & Clinical Ethics</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-form-group">
                <label className="admin-label">Founding Mission</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.about.mission}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, mission: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Vision for North India</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.about.vision}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, vision: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Surgical Ethics Principle</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={content.about.ethics}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, ethics: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 3: RESEARCH & CONFERENCES */}
      {activePage === 'research' && (
        <div>
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>1. Research Header</span>
              </h3>
            </div>
            <div className="admin-section-body">
              <div className="admin-form-group">
                <label className="admin-label">Page Headline</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.research.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      research: { ...content.research, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Intro Description</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={content.research.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      research: { ...content.research, subtitle: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Research Milestones */}
          <div className="admin-section-block">
            <div className="admin-section-header">
              <h3 className="admin-section-title">
                <span>2. Featured Surgical & Academic Milestones</span>
              </h3>
            </div>
            <div className="admin-section-body">
              {content.research.milestones.map((m, mIdx) => (
                <div key={m.id || mIdx} style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="admin-badge admin-badge-gold">{m.badge}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#123653' }}>{m.title}</span>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Milestone Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={m.title}
                      onChange={(e) => {
                        const newM = [...content.research.milestones];
                        newM[mIdx].title = e.target.value;
                        setContent({
                          ...content,
                          research: { ...content.research, milestones: newM },
                        });
                      }}
                    />
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Description Paragraph 1</label>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={m.desc1}
                        onChange={(e) => {
                          const newM = [...content.research.milestones];
                          newM[mIdx].desc1 = e.target.value;
                          setContent({
                            ...content,
                            research: { ...content.research, milestones: newM },
                          });
                        }}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Description Paragraph 2</label>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={m.desc2}
                        onChange={(e) => {
                          const newM = [...content.research.milestones];
                          newM[mIdx].desc2 = e.target.value;
                          setContent({
                            ...content,
                            research: { ...content.research, milestones: newM },
                          });
                        }}
                      />
                    </div>
                  </div>

                  {/* Milestone Image */}
                  <div style={{ marginTop: '14px' }}>
                    <ImageFieldControl
                      label="Milestone Photo"
                      description="Featured document or photo on /research."
                      currentUrl={m.image}
                      currentAlt={m.caption || m.title}
                      previewLink="/research"
                      mediaList={mediaList}
                      sectionName={`Milestone: ${m.title}`}
                      pageName="Research"
                      onRefreshMedia={async () => {
                        const res = await fetch('/api/admin/media', { cache: 'no-store' });
                        const data = await res.json();
                        if (data.media) setMediaList(data.media);
                      }}
                      onChange={(newUrl, newAlt) => {
                        const newM = [...content.research.milestones];
                        newM[mIdx].image = newUrl;
                        if (newAlt) newM[mIdx].caption = newAlt;
                        setContent({
                          ...content,
                          research: { ...content.research, milestones: newM },
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: FAQS */}
      {activePage === 'faqs' && (
        <div className="admin-section-block">
          <div className="admin-section-header">
            <h3 className="admin-section-title">
              <span>All 13 Clinical Frequently Asked Questions</span>
            </h3>
            <button
              onClick={() => {
                const newFaq = {
                  id: `faq-${Date.now()}`,
                  category: 'General ENT',
                  q: 'New Question',
                  a: 'Detailed clinical explanation here...',
                  order: content.faqs.length + 1,
                  isPublished: true,
                };
                setContent({ ...content, faqs: [newFaq, ...content.faqs] });
              }}
              className="admin-btn admin-btn-primary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              + Add FAQ Question
            </button>
          </div>
          <div className="admin-section-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.faqs.map((faq, fIdx) => (
                <div key={faq.id || fIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="admin-badge admin-badge-gold">#{fIdx + 1}</span>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ width: '180px', padding: '4px 8px', fontSize: '12px' }}
                        value={faq.category}
                        onChange={(e) => {
                          const newF = [...content.faqs];
                          newF[fIdx].category = e.target.value;
                          setContent({ ...content, faqs: newF });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete this FAQ question?')) {
                          const newF = content.faqs.filter((_, idx) => idx !== fIdx);
                          setContent({ ...content, faqs: newF });
                        }
                      }}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Question</label>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ fontWeight: 700 }}
                      value={faq.q}
                      onChange={(e) => {
                        const newF = [...content.faqs];
                        newF[fIdx].q = e.target.value;
                        setContent({ ...content, faqs: newF });
                      }}
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Medical Answer</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={faq.a}
                      onChange={(e) => {
                        const newF = [...content.faqs];
                        newF[fIdx].a = e.target.value;
                        setContent({ ...content, faqs: newF });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5: GALLERY */}
      {activePage === 'gallery' && (
        <div className="admin-section-block">
          <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="admin-section-title">
                <span>Verified Gallery Photos ({content.gallery.length})</span>
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Appears on /gallery with interactive full-screen lightbox, category filters, and captions.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const newId = `g-${Date.now()}`;
                const newPhoto = {
                  id: newId,
                  src: '/images/operating-theatre-pgi-chandigarh-10.jpeg',
                  title: 'New Clinic Photograph',
                  alt: 'Dr. Rattan ENT Clinic facility photo',
                  category: 'clinic' as const,
                  categoryLabel: 'Clinic & Facility',
                  order: content.gallery.length + 1,
                };
                setContent({ ...content, gallery: [...content.gallery, newPhoto] });
              }}
              className="admin-btn admin-btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
            >
              + Add Gallery Photo
            </button>
          </div>
          <div className="admin-section-body">
            <div className="admin-grid-3">
              {content.gallery.map((g, gIdx) => (
                <div
                  key={g.id || gIdx}
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Header with Ordering & Delete Item */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', background: '#ccfbf1', padding: '2px 8px', borderRadius: '10px' }}>
                        #{gIdx + 1}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={gIdx === 0}
                          onClick={() => {
                            if (gIdx === 0) return;
                            const newG = [...content.gallery];
                            const temp = newG[gIdx - 1];
                            newG[gIdx - 1] = newG[gIdx];
                            newG[gIdx] = temp;
                            setContent({ ...content, gallery: newG });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={gIdx === content.gallery.length - 1}
                          onClick={() => {
                            if (gIdx === content.gallery.length - 1) return;
                            const newG = [...content.gallery];
                            const temp = newG[gIdx + 1];
                            newG[gIdx + 1] = newG[gIdx];
                            newG[gIdx] = temp;
                            setContent({ ...content, gallery: newG });
                          }}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Remove photo "${g.title}" from gallery?`)) return;
                            const newG = content.gallery.filter((_, idx) => idx !== gIdx);
                            setContent({ ...content, gallery: newG });
                          }}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                          title="Delete Gallery Card"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Image Field Control */}
                    <ImageFieldControl
                      label="Photograph"
                      currentUrl={g.src}
                      currentAlt={g.alt || g.title}
                      previewLink="/gallery"
                      mediaList={mediaList}
                      sectionName={`Gallery Item #${gIdx + 1}: ${g.title}`}
                      pageName="Gallery"
                      onRefreshMedia={async () => {
                        const res = await fetch('/api/admin/media', { cache: 'no-store' });
                        const data = await res.json();
                        if (data.media) setMediaList(data.media);
                      }}
                      onChange={(newUrl, newAlt) => {
                        const newG = [...content.gallery];
                        newG[gIdx].src = newUrl;
                        if (newAlt) newG[gIdx].alt = newAlt;
                        setContent({ ...content, gallery: newG });
                      }}
                    />

                    {/* Title / Caption */}
                    <div className="admin-form-group" style={{ marginTop: '8px' }}>
                      <label className="admin-label">Title / Caption</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={g.title}
                        onChange={(e) => {
                          const newG = [...content.gallery];
                          newG[gIdx].title = e.target.value;
                          setContent({ ...content, gallery: newG });
                        }}
                      />
                    </div>

                    {/* Alt Text */}
                    <div className="admin-form-group">
                      <label className="admin-label">Alt Text (Screen Readers & SEO)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={g.alt || ''}
                        onChange={(e) => {
                          const newG = [...content.gallery];
                          newG[gIdx].alt = e.target.value;
                          setContent({ ...content, gallery: newG });
                        }}
                      />
                    </div>

                    {/* Category */}
                    <div className="admin-form-group">
                      <label className="admin-label">Category Filter Tab</label>
                      <select
                        className="admin-select"
                        value={g.category}
                        onChange={(e) => {
                          const newG = [...content.gallery];
                          newG[gIdx].category = e.target.value as 'surgical' | 'clinic';
                          newG[gIdx].categoryLabel = e.target.value === 'surgical' ? 'Academic & Surgical' : 'Clinic & Facility';
                          setContent({ ...content, gallery: newG });
                        }}
                      >
                        <option value="surgical">Academic & Surgical</option>
                        <option value="clinic">Clinic & Facility</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 6: CONTACT & LOCATION */}
      {activePage === 'contact' && (
        <div className="admin-section-block">
          <div className="admin-section-header">
            <h3 className="admin-section-title">
              <span>Contact Information & Timings</span>
            </h3>
          </div>
          <div className="admin-section-body">
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Physical Address</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.contact.address}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, address: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Primary Clinic Phone</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.contact.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, phone: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">WhatsApp Contact Number</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.contact.whatsapp}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, whatsapp: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Clinic Email Address</label>
                <input
                  type="email"
                  className="admin-input"
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#123653', marginBottom: '14px' }}>OPD Consultation Hours</h4>
              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Morning OPD</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.contact.morningOpd}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, morningOpd: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Evening OPD</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.contact.eveningOpd}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, eveningOpd: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Sunday OPD</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={content.contact.sundayOpd}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, sundayOpd: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 7: BOOK APPOINTMENT */}
      {activePage === 'appointment' && (
        <div className="admin-section-block">
          <div className="admin-section-header">
            <h3 className="admin-section-title">
              <span>Book Appointment Page Settings</span>
            </h3>
          </div>
          <div className="admin-section-body">
            <div className="admin-form-group">
              <label className="admin-label">Appointment Page Notice</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value="Priority OPD appointments for Ear, Nose, Throat, Voice, Hearing, and Balance consultations in Chandigarh."
                readOnly
              />
            </div>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Direct Appointment Handoff Link</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.navigation.appointmentLink || '/book-appointment'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      navigation: { ...content.navigation, appointmentLink: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Direct WhatsApp Number for Confirmation</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.navigation.whatsappNumber || '919988004806'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      navigation: { ...content.navigation, whatsappNumber: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 8: GLOBAL SETTINGS (NAVBAR, FOOTER) */}
      {activePage === 'global' && (
        <div className="admin-section-block">
          <div className="admin-section-header">
            <h3 className="admin-section-title">
              <span>Global Header, Navbar & Footer Settings</span>
            </h3>
          </div>
          <div className="admin-section-body">
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Logo Main Text</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.navigation.logoText || 'Dr. Rattan'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      navigation: { ...content.navigation, logoText: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Logo Highlight Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={content.navigation.logoHighlight || 'ENT'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      navigation: { ...content.navigation, logoHighlight: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Top Bar Consultation Hours Display</label>
              <input
                type="text"
                className="admin-input"
                value={content.navigation.topBarHours || 'Mon–Sat: 10 AM–2 PM & 5:30–8 PM · Sun: 11 AM–1 PM'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    navigation: { ...content.navigation, topBarHours: e.target.value },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Footer Brand Description</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={content.navigation.footerTagline || content.footer?.description || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    navigation: { ...content.navigation, footerTagline: e.target.value },
                    footer: { ...(content.footer || {}), description: e.target.value },
                  })
                }
              />
            </div>

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Footer Copyright Notice</label>
              <input
                type="text"
                className="admin-input"
                value={content.footer?.copyright || '© 2026 Dr. Rattan ENT Clinic. All rights reserved.'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...(content.footer || {}), copyright: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* MEDIA PICKER MODAL */}
      {pickerOpen && (
        <div className="admin-modal-backdrop" onClick={() => setPickerOpen(false)}>
          <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#123653', margin: 0 }}>
                  Select from Media Library
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                  Click any image to assign it to this section. All 18 verified assets available.
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
                  onClick={() => handleSelectMedia(item)}
                  className="admin-media-picker-item"
                >
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="admin-media-picker-thumb"
                  />
                  <div className="admin-media-picker-name" title={item.title || item.filename}>
                    {item.title || item.filename}
                  </div>
                  {item.pageUsed && (
                    <div style={{ fontSize: '9px', color: '#C9A24A', padding: '0 6px 4px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.pageUsed}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
