'use client';

import React, { useEffect, useState } from 'react';
import { FAQItem, SiteContent } from '@/lib/types';

export default function AdminFAQsPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadFAQs = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      }
    } catch (err) {
      console.error('Failed to load FAQs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const categories = ['All', 'General', 'Appointments', 'Treatments', 'Insurance & Billing', 'Post-Op Care'];

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingFAQ({
      id: `faq-${Date.now()}`,
      category: 'General',
      q: '',
      a: '',
      question: '',
      answer: '',
      order: content?.faqs.length ? content.faqs.length + 1 : 1,
      isPublished: true,
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !editingFAQ) return;

    const qText = editingFAQ.question || editingFAQ.q;
    const aText = editingFAQ.answer || editingFAQ.a;

    if (!qText || !aText) {
      alert('Question and answer are required');
      return;
    }

    const normalizedFaq: FAQItem = {
      ...editingFAQ,
      q: qText,
      a: aText,
      question: qText,
      answer: aText,
    };

    setSaving(true);
    try {
      let updatedFAQs = [...content.faqs];
      if (isNew) {
        updatedFAQs.push(normalizedFaq);
      } else {
        updatedFAQs = updatedFAQs.map((f) =>
          f.id === normalizedFaq.id ? normalizedFaq : f
        );
      }

      const updatedContent: SiteContent = {
        ...content,
        faqs: updatedFAQs,
      };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (!res.ok) {
        throw new Error('Failed to update FAQs');
      }

      setContent(updatedContent);
      setEditingFAQ(null);
      setStatusMessage({ type: 'success', text: 'FAQ saved successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ question?')) return;
    if (!content) return;

    setSaving(true);
    try {
      const updatedFAQs = content.faqs.filter((f) => f.id !== id);
      const updatedContent: SiteContent = {
        ...content,
        faqs: updatedFAQs,
      };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (!res.ok) {
        throw new Error('Failed to delete FAQ');
      }

      setContent(updatedContent);
      setStatusMessage({ type: 'success', text: 'FAQ deleted.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting FAQ');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#C9A24A]/20 border-t-[#C9A24A] rounded-full animate-spin" />
      </div>
    );
  }

  const filteredFAQs = content.faqs.filter((f) =>
    selectedCategory === 'All' ? true : f.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#123653]">Frequently Asked Questions (FAQs)</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage patient questions, treatment explanations, appointment guidance, and insurance clarifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {statusMessage && (
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              {statusMessage.text}
            </span>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-[#123653] hover:bg-[#0c2438] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New FAQ
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#123653] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-xs hover:border-[#123653]/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600 uppercase">
                  {faq.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#123653] mb-2">{faq.question || faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.answer || faq.a}</p>
            </div>
            <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
              <button
                onClick={() => {
                  setIsNew(false);
                  setEditingFAQ({ ...faq });
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#123653] text-gray-700 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete FAQ"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit FAQ Modal */}
      {editingFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-[#123653]">
                {isNew ? 'Create New FAQ' : 'Edit FAQ Item'}
              </h3>
              <button
                onClick={() => setEditingFAQ(null)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingFAQ.category}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#123653]"
                >
                  <option value="General">General</option>
                  <option value="Appointments">Appointments</option>
                  <option value="Treatments">Treatments</option>
                  <option value="Insurance & Billing">Insurance & Billing</option>
                  <option value="Post-Op Care">Post-Op Care</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={editingFAQ.question || editingFAQ.q || ''}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value, q: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#123653]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Detailed Answer
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFAQ.answer || editingFAQ.a || ''}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value, a: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#123653]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFAQ(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#123653] hover:bg-[#0d263b] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
