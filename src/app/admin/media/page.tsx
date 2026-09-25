'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { MediaItem } from '@/lib/types';
import { ImageUsageLocation, isProtectedDefaultAsset } from '@/lib/imageUsage';

interface EnrichedMediaItem extends MediaItem {
  usages?: ImageUsageLocation[];
  usageCount?: number;
  isProtected?: boolean;
  safeToDelete?: boolean;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<EnrichedMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // View state: 'grid' vs 'list'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [pageFilter, setPageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<EnrichedMediaItem | null>(null);

  // Edit Metadata Modal (Alt text & Caption)
  const [editingItem, setEditingItem] = useState<EnrichedMediaItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [savingMeta, setSavingMeta] = useState(false);

  // Deletion Confirmation Dialog
  const [deleteTarget, setDeleteTarget] = useState<EnrichedMediaItem | null>(null);
  const [deleteInputName, setDeleteInputName] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Batch delete state
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);
  const [batchDeleteLoading, setBatchDeleteLoading] = useState(false);

  // Replace file input ref
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      const res = await fetch('/api/admin/media', { cache: 'no-store' });
      const data = await res.json();
      if (data.media) {
        setMedia(data.media);
      }
    } catch (err) {
      console.error('Failed to load media assets', err);
      setStatusMessage({ type: 'error', text: 'Failed to load media library assets.' });
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

  const handleOpenEdit = (item: EnrichedMediaItem) => {
    setEditingItem(item);
    setEditTitle(item.title || '');
    setEditAlt(item.alt || '');
    setEditCaption(item.caption || '');
  };

  const handleSaveMetadata = async () => {
    if (!editingItem) return;
    setSavingMeta(true);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          title: editTitle,
          alt: editAlt,
          caption: editCaption,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update metadata');

      setStatusMessage({ type: 'success', text: `Updated details for "${editingItem.filename}"!` });
      setEditingItem(null);
      await loadMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error updating metadata');
    } finally {
      setSavingMeta(false);
    }
  };

  // Replace file for an existing item
  const handleInitiateReplace = (id: string) => {
    setReplaceTargetId(id);
    replaceFileInputRef.current?.click();
  };

  const handleExecuteReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTargetId) return;

    setUploading(true);
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

      setStatusMessage({ type: 'success', text: `Uploaded replacement "${data.mediaItem.filename}"!` });
      await loadMedia();
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error replacing file' });
    } finally {
      setUploading(false);
      setReplaceTargetId(null);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  // Delete single item confirmation
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    if (deleteInputName.trim().toLowerCase() !== deleteTarget.filename.toLowerCase()) {
      setDeleteError(`Please type exact filename "${deleteTarget.filename}" to confirm.`);
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await fetch(
        `/api/admin/media?id=${encodeURIComponent(deleteTarget.id)}&forceProtected=true&unlinkUsages=true`,
        { method: 'DELETE' }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setStatusMessage({ type: 'success', text: `Deleted "${deleteTarget.filename}" permanently from storage.` });
      setDeleteTarget(null);
      setDeleteInputName('');
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      await loadMedia();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Error deleting media item');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Batch delete items
  const handleBatchDelete = async () => {
    setBatchDeleteLoading(true);
    let successCount = 0;

    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}&forceProtected=true&unlinkUsages=true`, {
          method: 'DELETE',
        });
        if (res.ok) successCount++;
      } catch {
        // Continue with others
      }
    }

    setStatusMessage({ type: 'success', text: `Successfully deleted ${successCount} media files from storage.` });
    setSelectedIds([]);
    setBatchDeleteOpen(false);
    setBatchDeleteLoading(false);
    await loadMedia();
  };

  // Filter and sort items
  const filteredAndSortedMedia = media
    .filter((item) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.filename?.toLowerCase().includes(q);
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesAlt = item.alt?.toLowerCase().includes(q);
        const matchesUrl = item.url?.toLowerCase().includes(q);
        const matchesUsage = item.usages?.some(
          (u) => u.page.toLowerCase().includes(q) || u.section.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesTitle && !matchesAlt && !matchesUrl && !matchesUsage) {
          return false;
        }
      }

      // 2. Page filter
      if (pageFilter !== 'all') {
        const hasUsageInPage = item.usages?.some((u) => u.page.toLowerCase() === pageFilter.toLowerCase());
        if (pageFilter === 'uploads') {
          if (!item.url.startsWith('/uploads/')) return false;
        } else if (!hasUsageInPage) {
          return false;
        }
      }

      // 3. Type filter
      if (typeFilter !== 'all') {
        const ext = item.filename?.split('.').pop()?.toLowerCase();
        if (typeFilter === 'png' && ext !== 'png') return false;
        if (typeFilter === 'jpeg' && ext !== 'jpeg' && ext !== 'jpg') return false;
        if (typeFilter === 'webp' && ext !== 'webp') return false;
        if (typeFilter === 'svg' && ext !== 'svg') return false;
      }

      // 4. Usage filter
      if (usageFilter === 'in_use' && (!item.usages || item.usages.length === 0)) return false;
      if (usageFilter === 'unused' && item.usages && item.usages.length > 0) return false;
      if (usageFilter === 'protected' && !isProtectedDefaultAsset(item.url)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.uploadedAt || 0).getTime() - new Date(b.uploadedAt || 0).getTime();
      }
      if (sortBy === 'name') {
        return (a.filename || '').localeCompare(b.filename || '');
      }
      if (sortBy === 'size') {
        return (b.sizeBytes || b.size || 0) - (a.sizeBytes || a.size || 0);
      }
      return 0;
    });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredAndSortedMedia.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
        <div className="admin-spinner" />
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>Loading Media Assets & Section Inventory...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Top Banner Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="admin-badge admin-badge-gold">Digital Asset Manager</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Whole-Website Media & Section Inventory</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#123653', margin: 0 }}>
              Media Library & Image Inventory
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              View, replace, manage, and safely delete images across all pages of Dr. Rattan ENT Clinic with real-time usage detection.
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
            <input
              type="file"
              ref={replaceFileInputRef}
              onChange={handleExecuteReplace}
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

      {/* Filter, Search, Sort & View Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search filename, title, page, section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
              style={{ padding: '8px 14px', fontSize: '13px' }}
            />
          </div>

          {/* Filter by Page */}
          <div>
            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="admin-select"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              <option value="all">All Pages</option>
              <option value="home">Home Page</option>
              <option value="about">About Page</option>
              <option value="doctors">Doctors Profiles</option>
              <option value="services">Services</option>
              <option value="research">Research & Fellowship</option>
              <option value="gallery">Gallery Photos</option>
              <option value="uploads">Custom Uploads</option>
            </select>
          </div>

          {/* Filter by Type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="admin-select"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              <option value="all">All File Types</option>
              <option value="png">PNG Images</option>
              <option value="jpeg">JPEG / JPG</option>
              <option value="webp">WebP</option>
              <option value="svg">SVG</option>
            </select>
          </div>

          {/* Filter by Usage */}
          <div>
            <select
              value={usageFilter}
              onChange={(e) => setUsageFilter(e.target.value)}
              className="admin-select"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              <option value="all">All Usages</option>
              <option value="in_use">In Use on Website</option>
              <option value="unused">Unused / Orphaned</option>
              <option value="protected">Protected Default Assets</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name' | 'size')}
              className="admin-select"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Filename (A-Z)</option>
              <option value="size">Sort: File Size</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'inline-flex', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#123653' : '#ffffff',
                color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#123653' : '#ffffff',
                color: viewMode === 'list' ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Table / List
            </button>
          </div>
        </div>

        {/* Multi-Select Action Bar (shown when items selected) */}
        {selectedIds.length > 0 && (
          <div
            style={{
              marginTop: '14px',
              padding: '10px 16px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>
              ✓ {selectedIds.length} item(s) selected
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="admin-btn admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                Clear Selection
              </button>
              <button
                type="button"
                onClick={() => setBatchDeleteOpen(true)}
                className="admin-btn admin-btn-danger"
                style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 700 }}
              >
                Delete Selected ({selectedIds.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Header Count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          Showing <strong>{filteredAndSortedMedia.length}</strong> of <strong>{media.length}</strong> media files
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filteredAndSortedMedia.length > 0 && selectedIds.length === filteredAndSortedMedia.length}
            onChange={handleSelectAll}
          />
          <span>Select All on Page</span>
        </label>
      </div>

      {/* VIEW 1: GRID VIEW */}
      {viewMode === 'grid' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredAndSortedMedia.map((item) => {
            const isProtected = isProtectedDefaultAsset(item.url);
            const isSelected = selectedIds.includes(item.id);
            const usageCount = item.usages?.length || 0;
            const fileSizeKb = ((item.sizeBytes || item.size || 0) / 1024).toFixed(1);

            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Top Image Preview & Badges */}
                <div>
                  <div
                    style={{
                      height: '170px',
                      background: '#0f172a',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPreviewItem(item)}
                    title="Click for full-screen preview"
                  >
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Multi-select Checkbox */}
                    <div
                      style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>

                    {/* Protected Default Asset Badge */}
                    {isProtected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          color: '#fef08a',
                          border: '1px solid rgba(254, 240, 138, 0.4)',
                          borderRadius: '20px',
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: 700,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        🛡️ Protected Asset
                      </div>
                    )}

                    {/* Bottom overlay with dimensions/format */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#ffffff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {item.filename.split('.').pop()?.toUpperCase() || 'IMG'} · {fileSizeKb} KB
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '14px 16px' }}>
                    <div
                      style={{
                        fontSize: '14px',
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

                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: '#64748b',
                        marginTop: '3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={item.url}
                    >
                      {item.url}
                    </div>

                    {/* Section Usages Badge */}
                    <div style={{ marginTop: '10px' }}>
                      {usageCount > 0 ? (
                        <div
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px',
                            fontSize: '11px',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>
                            🔗 In Use ({usageCount} {usageCount === 1 ? 'place' : 'places'}):
                          </div>
                          {item.usages?.slice(0, 2).map((u, i) => (
                            <div key={i} style={{ color: '#475569', fontSize: '10.5px', marginTop: '2px' }}>
                              • <strong>{u.page}</strong>: {u.section}
                            </div>
                          ))}
                          {usageCount > 2 && (
                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                              + {usageCount - 2} more sections
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            fontSize: '11px',
                            color: '#15803d',
                            fontWeight: 600,
                          }}
                        >
                          ✓ Unused in page content (Safe to Delete)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div
                  style={{
                    padding: '10px 14px',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      {copiedUrl === item.url ? '✓ Copied' : 'Copy URL'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Edit Info
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleInitiateReplace(item.id)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Upload new file to replace this asset"
                    >
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setDeleteInputName('');
                        setDeleteTarget(item);
                      }}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LIST / TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="admin-section-block" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={filteredAndSortedMedia.length > 0 && selectedIds.length === filteredAndSortedMedia.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ width: '80px' }}>Thumbnail</th>
                  <th>Image Title & Filename</th>
                  <th>Format & Size</th>
                  <th>Where Used on Website</th>
                  <th>Asset Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedMedia.map((item) => {
                  const isProtected = isProtectedDefaultAsset(item.url);
                  const isSelected = selectedIds.includes(item.id);
                  const usageCount = item.usages?.length || 0;
                  const fileSizeKb = ((item.sizeBytes || item.size || 0) / 1024).toFixed(1);

                  return (
                    <tr key={item.id} style={{ background: isSelected ? '#f0fdfa' : undefined }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            width: '64px',
                            height: '50px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            background: '#0f172a',
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                          }}
                          onClick={() => setPreviewItem(item)}
                          title="Click to preview"
                        >
                          <img
                            src={item.url}
                            alt={item.alt || item.filename}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#123653', fontSize: '13px' }}>
                          {item.title || item.filename}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {item.url}
                        </div>
                        {item.alt && (
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>
                            Alt: &ldquo;{item.alt}&rdquo;
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-navy" style={{ fontSize: '10px' }}>
                          {item.filename.split('.').pop()?.toUpperCase()}
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          {fileSizeKb} KB
                        </div>
                      </td>
                      <td>
                        {usageCount > 0 ? (
                          <div>
                            {item.usages?.map((u, i) => (
                              <div key={i} style={{ fontSize: '11px', color: '#334155', marginBottom: '2px' }}>
                                <Link
                                  href={u.controllerLink}
                                  style={{ color: '#0369a1', textDecoration: 'none', fontWeight: 600 }}
                                >
                                  {u.page} &rarr; {u.section}
                                </Link>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                            Unused (Safe)
                          </span>
                        )}
                      </td>
                      <td>
                        {isProtected ? (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              background: '#fef3c7',
                              color: '#92400e',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              border: '1px solid #fde68a',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            🛡️ Protected
                          </span>
                        ) : usageCount > 0 ? (
                          <span className="admin-badge admin-badge-gold">In Use ({usageCount})</span>
                        ) : (
                          <span className="admin-badge admin-badge-green">Safe</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(item.url)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            {copiedUrl === item.url ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setDeleteInputName('');
                              setDeleteTarget(item);
                            }}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: FULL-SIZE PREVIEW LIGHTBOX */}
      {previewItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ maxHeight: '60vh', background: '#091522', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={previewItem.url}
                alt={previewItem.alt || previewItem.filename}
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#123653', margin: 0 }}>
                    {previewItem.title || previewItem.filename}
                  </h3>
                  <code style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                    {previewItem.url}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  Close
                </button>
              </div>

              {previewItem.alt && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#475569' }}>
                  <strong>Alt Description:</strong> &ldquo;{previewItem.alt}&rdquo;
                </div>
              )}

              {previewItem.caption && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#475569' }}>
                  <strong>Caption:</strong> {previewItem.caption}
                </div>
              )}

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewItem.url)}
                  className="admin-btn admin-btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  {copiedUrl === previewItem.url ? '✓ URL Copied to Clipboard' : 'Copy Image URL'}
                </button>
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '12px', textDecoration: 'none' }}
                >
                  Open Original File ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT METADATA (ALT & CAPTION) */}
      {editingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
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
              maxWidth: '540px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#123653', margin: '0 0 16px' }}>
              Edit Image Details & Alt Text
            </h3>

            <div className="admin-form-group">
              <label className="admin-label">Image Display Title</label>
              <input
                type="text"
                className="admin-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Alt Text (Screen Readers & SEO) *</label>
              <input
                type="text"
                className="admin-input"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Accessible descriptive label"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Caption / Clinical Note</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Optional caption displayed under photo"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                disabled={savingMeta}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMetadata}
                disabled={savingMeta}
                className="admin-btn admin-btn-primary"
                style={{ fontSize: '12px', fontWeight: 700 }}
              >
                {savingMeta ? 'Saving Changes...' : 'Save Metadata'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SINGLE FILE PERMANENT DELETION DIALOG */}
      {deleteTarget && (
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
              maxWidth: '540px',
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
                  Permanently Delete Media Asset?
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                  Deletes the file permanently from storage and the media catalog.
                </p>
              </div>
            </div>

            {/* Protected Warning */}
            {isProtectedDefaultAsset(deleteTarget.url) && (
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
                <strong>⚠️ Protected Default Asset:</strong> &ldquo;{deleteTarget.filename}&rdquo; is a primary default clinic photograph. Deleting it will permanently remove the original asset.
              </div>
            )}

            {/* Usages Warning */}
            {deleteTarget.usages && deleteTarget.usages.length > 0 && (
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
                <strong>Active Usages Found ({deleteTarget.usages.length} section{deleteTarget.usages.length > 1 ? 's' : ''}):</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                  {deleteTarget.usages.map((u, i) => (
                    <li key={i}>
                      <strong>{u.page}</strong> &rarr; {u.section}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#475569' }}>
                  Confirming deletion will safely unlink this image from all listed sections and switch them to clean fallbacks on the live website.
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Type filename to confirm: <code style={{ color: '#dc2626' }}>{deleteTarget.filename}</code>
              </label>
              <input
                type="text"
                value={deleteInputName}
                onChange={(e) => setDeleteInputName(e.target.value)}
                placeholder={deleteTarget.filename}
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
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={deleteLoading || deleteInputName.trim().toLowerCase() !== deleteTarget.filename.toLowerCase()}
                className="admin-btn admin-btn-danger"
                style={{ fontSize: '12px', fontWeight: 700 }}
              >
                {deleteLoading ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BATCH DELETE CONFIRMATION DIALOG */}
      {batchDeleteOpen && (
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
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b', margin: '0 0 10px' }}>
              Delete {selectedIds.length} Selected Files?
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
              Are you sure you want to permanently delete all {selectedIds.length} selected images from storage? Any section using these images will be unlinked and switched to its clean fallback state.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setBatchDeleteOpen(false)}
                disabled={batchDeleteLoading}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchDelete}
                disabled={batchDeleteLoading}
                className="admin-btn admin-btn-danger"
                style={{ fontSize: '12px', fontWeight: 700 }}
              >
                {batchDeleteLoading ? 'Deleting Files...' : `Delete All ${selectedIds.length} Files`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
