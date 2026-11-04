'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaPlus, FaPaperPlane } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const emptyLine = () => ({ account: '', debit: '', credit: '', memo: '' });

const AccountingJournal = () => {
  const router = useRouter();
  const { loading: authLoading, canAccessAccounting } = useAuth();
  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    description: '',
    date: new Date().toISOString().split('T')[0],
    lines: [emptyLine(), emptyLine()]
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [eRes, aRes] = await Promise.all([
        adminApiGet('/api/accounting/journal-entries?limit=25'),
        adminApiGet('/api/accounting/accounts?isActive=true')
      ]);
      if (eRes.success && eRes.data) setEntries(eRes.data.data || []);
      if (aRes.success && aRes.data) {
        const payload = aRes.data.data ?? aRes.data;
        setAccounts(Array.isArray(payload) ? payload : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !canAccessAccounting()) return;
    load();
  }, [authLoading, canAccessAccounting, load]);

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessAccounting()) router.replace('/system/dashboard');
  }, [authLoading, canAccessAccounting, router]);

  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, emptyLine()] }));

  const updateLine = (i, field, val) => {
    setForm((f) => {
      const lines = [...f.lines];
      lines[i] = { ...lines[i], [field]: val };
      return { ...f, lines };
    });
  };

  const submitDraft = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const lines = form.lines
        .map((l) => ({
          account: l.account,
          debit: parseFloat(l.debit) || 0,
          credit: parseFloat(l.credit) || 0,
          memo: l.memo
        }))
        .filter((l) => l.account);
      const res = await adminApiPost('/api/accounting/journal-entries', {
        description: form.description,
        date: form.date,
        lines
      });
      if (res.success) {
        setForm({ description: '', date: new Date().toISOString().split('T')[0], lines: [emptyLine(), emptyLine()] });
        load();
      } else {
        alert(res.data?.message || 'Could not save journal entry');
      }
    } catch (err) {
      alert(err.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const postEntry = async (id) => {
    if (!window.confirm('Post this entry? Account balances will update.')) return;
    const res = await adminApiPost(`/api/accounting/journal-entries/${id}/post`);
    if (res.success) load();
    else alert(res.data?.message || 'Post failed');
  };

  if (authLoading || !canAccessAccounting()) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Journal entries</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Double-entry journals — debits must equal credits before posting
        </p>
      </div>

      <form onSubmit={submitDraft} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lines</span>
            <button type="button" onClick={addLine} className="text-sm text-primary-600 flex items-center gap-1">
              <FaPlus /> Add line
            </button>
          </div>
          {form.lines.map((line, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-12 md:col-span-5">
                <select
                  value={line.account}
                  onChange={(e) => updateLine(i, 'account', e.target.value)}
                  className="w-full border rounded-md px-2 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Account</option>
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.accountNumber} — {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-6 md:col-span-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Debit"
                  value={line.debit}
                  onChange={(e) => updateLine(i, 'debit', e.target.value)}
                  className="w-full border rounded-md px-2 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Credit"
                  value={line.credit}
                  onChange={(e) => updateLine(i, 'credit', e.target.value)}
                  className="w-full border rounded-md px-2 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <input
                  placeholder="Memo"
                  value={line.memo}
                  onChange={(e) => updateLine(i, 'memo', e.target.value)}
                  className="w-full border rounded-md px-2 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save as draft'}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent entries</h3>
        {loading ? (
          <FaSpinner className="animate-spin text-2xl text-primary-600" />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {entries.map((en) => (
                  <tr key={en._id}>
                    <td className="px-4 py-2 font-mono">{en.entryNumber}</td>
                    <td className="px-4 py-2">{new Date(en.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{en.description}</td>
                    <td className="px-4 py-2 capitalize">{en.status}</td>
                    <td className="px-4 py-2">
                      {en.status === 'draft' && (
                        <button
                          type="button"
                          onClick={() => postEntry(en._id)}
                          className="text-primary-600 inline-flex items-center gap-1"
                        >
                          <FaPaperPlane /> Post
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingJournal;
