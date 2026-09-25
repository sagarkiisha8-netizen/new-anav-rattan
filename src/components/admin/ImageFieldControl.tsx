'use client';

import React, { useState, useRef } from 'react';
import { MediaItem } from '@/lib/types';
import { isProtectedDefaultAsset } from '@/lib/imageUsage';

export interface ImageFieldControlProps {
  label: string;
  description?: string;
  currentUrl?: string;
  currentAlt?: string;
  defaultUrl?: string;
  defaultAlt?: string;
  previewLink?: string;
  mediaList?: MediaItem[];
  onChange: (url: string, alt?: string) => void;
  onRefreshMedia?: () => Promise<void>;
  sectionName?: string;
  pageName?: string;
  isRequired?: boolean;
}

export default function ImageFieldControl({
  label,
  description,
  currentUrl = '',
  currentAlt = '',
  defaultUrl = '',
  defaultAlt = '',
  previewLink,
  mediaList = [],
  onChange,
  onRefreshMedia,
  sectionName = 'This Section',
  pageName = 'Website',
  isRequired = false,
}: ImageFieldControlProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altText, setAltText] = useState(currentAlt);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteInputName, setDeleteInputName] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanUrl = (currentUrl || '').trim();
  const hasImage = Boolean(cleanUrl);
  const filename = cleanUrl ? cleanUrl.split('/').pop() || cleanUrl : '';
  const isProtected = isProtectedDefaultAsset(cleanUrl);
  const isDefaultActive = cleanUrl === (defaultUrl || '').trim();

  // Find media item metadata if present in library
  const currentMediaItem = mediaList.find(
    (m) => m.url === cleanUrl || m.filename === filename
  );

  const handleCopyUrl = () => {
    if (!cleanUrl) return;
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveFromSection = () => {
    if (isRequired) {
      const confirmReq = window.confirm(
        `This image field is marked as Required. If you remove it, the section image block will collapse on the website until a replacement is selected. Are you sure you want to remove it?`
      );
      if (!confirmReq) return;
    } else if (isProtected) {
      const confirmRemove = window.confirm(
        `"${filename}" is the default protected image for this section. Removing it will collapse the image container on the live website and automatically expand the text. Continue?`
      );
      if (!confirmRemove) return;
    }
    onChange('', '');
  };

  const handleRestoreDefault = () => {
    if (!defaultUrl) return;
    onChange(defaultUrl, defaultAlt);
  };

  const handleSaveAltText = () => {
    onChange(cleanUrl, altText);
    setEditingAlt(false);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', altText || file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.mediaItem.url, data.mediaItem.alt || data.mediaItem.title);
      if (onRefreshMedia) await onRefreshMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePermanently = async () => {
    if (!cleanUrl) return;
    if (deleteInputName.trim().toLowerCase() !== filename.toLowerCase()) {
      setDeleteError(`Please type the exact filename "${filename}" to confirm.`);
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await fetch(
        `/api/admin/media?url=${encodeURIComponent(cleanUrl)}&forceProtected=true&unlinkUsages=true`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete image');
      }

      // Automatically remove from this section
      onChange('', '');
      setDeleteConfirmOpen(false);
      setDeleteInputName('');
      if (onRefreshMedia) await onRefreshMedia();
      alert(`"${filename}" has been permanently deleted from storage and unlinked from website sections.`);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Error deleting image');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredMediaList = mediaList.filter((m) => {
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.filename && m.filename.toLowerCase().includes(q)) ||
      (m.alt && m.alt.toLowerCase().includes(q)) ||
      (m.url && m.url.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#123653', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>{label}</span>
            {isRequired ? (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #fecaca',
                }}
              >
                Required Image
              </span>
            ) : (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                Optional · Section auto-collapses on website
              </span>
            )}
            {isProtected && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #fde68a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Protected system default asset"
              >
                <span>🛡️</span>
                <span>Protected Default Asset</span>
              </span>
            )}
            {hasImage && !isProtected && currentMediaItem && (currentMediaItem as unknown as { usageCount?: number }).usageCount && (currentMediaItem as unknown as { usageCount?: number }).usageCount! > 1 && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                🔗 Used in {(currentMediaItem as unknown as { usageCount?: number }).usageCount} sections
              </span>
            )}
          </label>
          {description && (
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>{description}</p>
          )}
          {isRequired && !hasImage && (
            <div
              style={{
                marginTop: '8px',
                padding: '6px 10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚠️</span>
              <span>
                <strong>Action Needed:</strong> This image is required. The section image container will remain collapsed on the website until an image is published.
              </span>
            </div>
          )}
        </div>

        {previewLink && (
          <a
            href={previewLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '11.5px',
              color: '#0f766e',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Preview on Website</span>
            <span>↗</span>
          </a>
        )}
      </div>

      {/* Main Image Control Box */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          padding: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Thumbnail Preview or Clean Empty State */}
        <div
          style={{
            width: '120px',
            height: '90px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: hasImage ? '#0f172a' : '#f8fafc',
            border: hasImage ? '1px solid #cbd5e1' : '2px dashed #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {hasImage ? (
            <img
              src={cleanUrl}
              alt={altText || 'Section Image Preview'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Prevent infinite loop if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <div style={{ fontSize: '22px', opacity: 0.6 }}>🖼️</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                No Image Set
              </div>
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          {/* Path & Filename Info */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Path:</span>
              {hasImage ? (
                <code
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    background: '#f1f5f9',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    maxWidth: '380px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={cleanUrl}
                >
                  {cleanUrl}
                </code>
              ) : (
                <span style={{ fontSize: '12px', color: '#e11d48', fontStyle: 'italic', fontWeight: 500 }}>
                  [Empty - Image block completely collapses on live website]
                </span>
              )}

              {hasImage && (
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px 6px',
                    fontSize: '11px',
                    color: '#0284c7',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy URL'}
                </button>
              )}
            </div>

            {/* Alt Text Display / Editor */}
            {hasImage && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                {editingAlt ? (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', maxWidth: '420px' }}>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Enter accessible alt description"
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        fontSize: '12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveAltText}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      Save Alt
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAlt(false)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Alt Text: &ldquo;{altText || currentAlt || filename}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAltText(currentAlt || '');
                        setEditingAlt(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: '11px',
                        color: '#6366f1',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Edit Alt Text
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons Toolbar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* 1. Choose from Media Library */}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="admin-btn admin-btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>🖼️</span>
              <span>Choose from Media Library</span>
            </button>

            {/* 2. Upload Replacement */}
            <label
              className="admin-btn admin-btn-secondary"
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>☁️</span>
              <span>{uploading ? 'Uploading...' : 'Upload Replacement'}</span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleDirectUpload}
                disabled={uploading}
              />
            </label>

            {/* 3. Remove from Section */}
            {hasImage && (
              <button
                type="button"
                onClick={handleRemoveFromSection}
                className="admin-btn"
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                }}
                title="Clears image from this section without deleting from library storage"
              >
                <span>✕</span>
                <span>Remove from Section</span>
              </button>
            )}

            {/* 4. Restore Default */}
            {defaultUrl && !isDefaultActive && (
              <button
                type="button"
                onClick={handleRestoreDefault}
                className="admin-btn admin-btn-secondary"
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#C9A24A',
                  borderColor: '#fde68a',
                  background: '#fefce8',
                }}
                title="Restore default clinical photograph"
              >
                <span>↺</span>
                <span>Restore Default</span>
              </button>
            )}

            {/* 5. Delete Permanently from Storage */}
            {hasImage && (
              <button
                type="button"
                onClick={() => {
                  setDeleteError(null);
                  setDeleteInputName('');
                  setDeleteConfirmOpen(true);
                }}
                className="admin-btn admin-btn-danger"
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Deletes from persistent storage and media catalog"
              >
                <span>🗑️</span>
                <span>Delete Permanently</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: MEDIA LIBRARY PICKER MODAL */}
      {pickerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#123653', margin: 0 }}>
                  Choose Media Asset for {label}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                  Select an image to assign to {sectionName} on the {pageName} page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '22px',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Search & Upload Bar */}
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <input
                type="text"
                placeholder="Search by filename, doctor name, category..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                }}
              />

              <label
                className="admin-btn admin-btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>+ Upload New Image</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleDirectUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Modal Media Grid */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {filteredMediaList.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  No media files found matching &ldquo;{pickerSearch}&rdquo;
                </div>
              ) : (
                filteredMediaList.map((item) => {
                  const isCurrent = item.url === cleanUrl;
                  const itemIsProtected = isProtectedDefaultAsset(item.url);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onChange(item.url, item.alt || item.title);
                        setPickerOpen(false);
                      }}
                      style={{
                        background: '#ffffff',
                        border: isCurrent ? '2px solid #0f766e' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isCurrent ? '0 0 0 3px rgba(15, 118, 110, 0.2)' : 'none',
                      }}
                    >
                      <div style={{ height: '110px', background: '#f1f5f9', position: 'relative' }}>
                        <img
                          src={item.url}
                          alt={item.alt || item.filename}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {isCurrent && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: '#0f766e',
                              color: '#ffffff',
                              borderRadius: '50%',
                              width: '22px',
                              height: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 800,
                            }}
                          >
                            ✓
                          </div>
                        )}
                        {itemIsProtected && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '6px',
                              left: '6px',
                              background: 'rgba(0,0,0,0.65)',
                              color: '#fef08a',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '9px',
                              fontWeight: 700,
                            }}
                          >
                            🛡️ Protected
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '10px' }}>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#123653',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={item.title || item.filename}
                        >
                          {item.title || item.filename}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
                          {item.filename}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 24px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Close Picker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SAFE DELETION CONFIRMATION DIALOG */}
      {deleteConfirmOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  color: '#dc2626',
                }}
              >
                ⚠️
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                  Permanently Delete Image?
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                  This action is irreversible and deletes the file from storage.
                </p>
              </div>
            </div>

            {/* Protected Warning */}
            {isProtected && (
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: '#92400e',
                }}
              >
                <strong>⚠️ Protected Default Asset Warning:</strong> &ldquo;{filename}&rdquo; is a primary system default photograph for Dr. Rattan ENT Clinic. Deleting it will remove the original clinical portrait.
              </div>
            )}

            {/* Usage Warning */}
            {currentMediaItem && (currentMediaItem as unknown as { usages?: { page: string; section: string }[] }).usages && (currentMediaItem as unknown as { usages?: { page: string; section: string }[] }).usages!.length > 0 && (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: '#1e40af',
                }}
              >
                <strong>Active Usages Found ({(currentMediaItem as unknown as { usages?: { page: string; section: string }[] }).usages!.length} location):</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                  {(currentMediaItem as unknown as { usages?: { page: string; section: string }[] }).usages!.map((u, i) => (
                    <li key={i}>
                      <strong>{u.page}</strong> &rarr; {u.section}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#475569' }}>
                  Deleting will safely unlink this image from all listed sections and display their clean fallback states.
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Type the filename to confirm deletion: <code style={{ color: '#dc2626' }}>{filename}</code>
              </label>
              <input
                type="text"
                value={deleteInputName}
                onChange={(e) => setDeleteInputName(e.target.value)}
                placeholder={filename}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            {deleteError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '14px',
                }}
              >
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleteLoading}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePermanently}
                disabled={deleteLoading || deleteInputName.trim().toLowerCase() !== filename.toLowerCase()}
                className="admin-btn admin-btn-danger"
                style={{ fontSize: '12px', fontWeight: 700 }}
              >
                {deleteLoading ? 'Deleting File...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
