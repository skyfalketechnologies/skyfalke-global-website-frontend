'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { adminApiGet, adminApiPut } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalIntegrations() {
  const { isSuperAdmin } = useAuth();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isSuperAdmin()) return;
    (async () => {
      const res = await adminApiGet('/api/portal/integrations');
      if (res.success && res.data?.success) setDoc(res.data.data);
      setLoading(false);
    })();
  }, [isSuperAdmin]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const res = await adminApiPut('/api/portal/integrations', doc);
    setSaving(false);
    if (res.success && res.data?.success) {
      setDoc(res.data.data);
      setMessage('Saved.');
    } else {
      setMessage(res.error?.message || 'Save failed');
    }
  };

  const setNested = (section, field, value) => {
    setDoc({
      ...doc,
      [section]: { ...doc[section], [field]: value }
    });
  };

  if (!isSuperAdmin()) {
    return (
      <PortalPageShell
        title="Integrations"
        description="Connect Slack, Jira, GitHub, and Google Workspace."
      >
        <p className="text-gray-600 dark:text-gray-400 py-8">Only Super Admins can edit integration settings.</p>
      </PortalPageShell>
    );
  }

  if (loading || !doc) {
    return (
      <PortalPageShell title="Integrations" description="">
        <FaSpinner className="animate-spin text-primary-500 text-xl py-12" />
      </PortalPageShell>
    );
  }

  return (
    <PortalPageShell
      title="Integrations"
      description="Optional webhooks and metadata for Slack, Jira, GitHub, and Google Workspace. Store secrets in environment variables when possible."
    >
      {message && (
        <p className={`text-sm mb-4 ${message === 'Saved.' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
      )}

      <form onSubmit={save} className="space-y-8 max-w-2xl">
        <section className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white">Slack</h2>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={!!doc.slack?.enabled}
              onChange={(e) => setNested('slack', 'enabled', e.target.checked)}
            />
            Enabled (incoming webhook for leave alerts, etc.)
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
            placeholder="Webhook URL"
            value={doc.slack?.webhookUrl || ''}
            onChange={(e) => setNested('slack', 'webhookUrl', e.target.value)}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white">Jira</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!doc.jira?.enabled}
              onChange={(e) => setNested('jira', 'enabled', e.target.checked)}
            />
            Enabled
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
            placeholder="Base URL"
            value={doc.jira?.baseUrl || ''}
            onChange={(e) => setNested('jira', 'baseUrl', e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
            placeholder="Project key"
            value={doc.jira?.projectKey || ''}
            onChange={(e) => setNested('jira', 'projectKey', e.target.value)}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white">GitHub</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!doc.github?.enabled}
              onChange={(e) => setNested('github', 'enabled', e.target.checked)}
            />
            Enabled
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
            placeholder="Organization"
            value={doc.github?.org || ''}
            onChange={(e) => setNested('github', 'org', e.target.value)}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white">Google Workspace</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!doc.googleWorkspace?.enabled}
              onChange={(e) => setNested('googleWorkspace', 'enabled', e.target.checked)}
            />
            Enabled
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
            placeholder="Primary domain"
            value={doc.googleWorkspace?.domain || ''}
            onChange={(e) => setNested('googleWorkspace', 'domain', e.target.value)}
          />
        </section>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </PortalPageShell>
  );
}
