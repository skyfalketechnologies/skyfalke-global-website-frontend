'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaBullhorn } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalAnnouncements() {
  const { canAccessHRModule } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await adminApiGet('/api/portal/announcements');
    if (res.success && res.data?.success) setRows(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await adminApiPost('/api/portal/announcements', { title, bodyHtml, published: true });
    setSaving(false);
    if (res.success && res.data?.success) {
      setTitle('');
      setBodyHtml('');
      load();
    } else {
      alert(res.error?.message || 'Could not publish');
    }
  };

  return (
    <PortalPageShell
      title="Announcements"
      description="Company-wide updates. HR and admins can publish new posts."
    >
      {canAccessHRModule() && (
        <form
          onSubmit={create}
          className="max-w-2xl space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Publish announcement</h2>
          <input
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-[120px]"
            placeholder="Message (HTML allowed for links and lists)"
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8">
          <FaSpinner className="animate-spin text-primary-500" />
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500 dark:text-gray-400">
          <FaBullhorn className="mx-auto text-4xl mb-3 opacity-40" />
          <p>No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((a) => (
            <article
              key={a._id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{a.title}</h2>
                {a.pinned && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md">
                    Pinned
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {a.author?.name} · {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
              </p>
              <div
                className="prose prose-sm dark:prose-invert max-w-none mt-4 text-gray-700 dark:text-gray-300 portal-announcement-body"
                dangerouslySetInnerHTML={{ __html: a.bodyHtml || '' }}
              />
            </article>
          ))}
        </div>
      )}
    </PortalPageShell>
  );
}
