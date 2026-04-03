'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FaSpinner, FaBookOpen, FaSearch } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalWiki() {
  const { canAccessCMS, canAccessHRModule } = useAuth();
  const canEdit = canAccessCMS() || canAccessHRModule();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const q = search.trim() ? `?status=published&search=${encodeURIComponent(search.trim())}` : '?status=published';
    const res = await adminApiGet(`/api/portal/wiki/articles${q}`);
    if (res.success && res.data?.success) setRows(res.data.data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await adminApiPost('/api/portal/wiki/articles', { title, content, status: 'published' });
    setSaving(false);
    if (res.success && res.data?.success) {
      setTitle('');
      setContent('');
      load();
    } else {
      alert(res.error?.message || 'Could not create article');
    }
  };

  return (
    <PortalPageShell
      title="Knowledge base"
      description="Internal documentation. Published articles are visible to all staff. Editors and HR can add pages."
    >
      <div className="relative max-w-lg mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search wiki"
        />
      </div>

      {canEdit && (
        <form
          onSubmit={create}
          className="max-w-2xl space-y-4 mb-10 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">New article</h2>
          <input
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900 font-mono text-sm min-h-[160px]"
            placeholder="Content (plain text or HTML)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg disabled:opacity-50 font-medium"
          >
            {saving ? 'Publishing…' : 'Publish article'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8">
          <FaSpinner className="animate-spin text-primary-500" />
          Loading articles…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500">
          <FaBookOpen className="mx-auto text-4xl mb-3 opacity-40" />
          <p>No articles match your search.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800/50">
          {rows.map((a) => (
            <li key={a._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
              <Link
                href={`/system/dashboard/portal/wiki/${encodeURIComponent(a.slug)}`}
                className="flex items-center justify-between gap-4 px-4 py-4 block"
              >
                <div>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{a.title}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{a.category}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : ''}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PortalPageShell>
  );
}
