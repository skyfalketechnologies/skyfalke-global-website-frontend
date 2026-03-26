'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaCheck } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const AccountingBankReconciliation = () => {
  const router = useRouter();
  const { loading: authLoading, canAccessAccounting } = useAuth();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [unmatched, setUnmatched] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [statementDate, setStatementDate] = useState(new Date().toISOString().split('T')[0]);
  const [statementBalance, setStatementBalance] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBanks = useCallback(async () => {
    const res = await adminApiGet('/api/accounting/accounts?isActive=true');
    if (res.success && res.data) {
      const payload = res.data.data ?? res.data;
      const list = Array.isArray(payload) ? payload : [];
      setBankAccounts(list.filter((a) => ['bank', 'cash', 'asset'].includes(a.type)));
    }
  }, []);

  const loadSessions = useCallback(async () => {
    const res = await adminApiGet('/api/accounting/bank-reconciliation?limit=20');
    if (res.success && res.data) setSessions(res.data.data || []);
  }, []);

  useEffect(() => {
    if (authLoading || !canAccessAccounting()) return;
    (async () => {
      setLoading(true);
      await Promise.all([loadBanks(), loadSessions()]);
      setLoading(false);
    })();
  }, [authLoading, canAccessAccounting, loadBanks, loadSessions]);

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessAccounting()) router.replace('/system/dashboard');
  }, [authLoading, canAccessAccounting, router]);

  const loadUnmatched = async () => {
    if (!accountId) return;
    const res = await adminApiGet(`/api/accounting/bank-reconciliation/unmatched?accountId=${accountId}`);
    if (res.success && res.data) setUnmatched(res.data.data || []);
  };

  useEffect(() => {
    if (accountId) loadUnmatched();
  }, [accountId]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const createSession = async () => {
    if (!accountId || statementBalance === '') {
      alert('Select account and statement balance');
      return;
    }
    const res = await adminApiPost('/api/accounting/bank-reconciliation', {
      bankAccount: accountId,
      statementDate,
      statementEndingBalance: parseFloat(statementBalance),
      clearedTransactionIds: Array.from(selected)
    });
    if (res.success) {
      setSelected(new Set());
      loadSessions();
      loadUnmatched();
    } else alert(res.error?.message || 'Failed');
  };

  const completeSession = async (id) => {
    const res = await adminApiPost(`/api/accounting/bank-reconciliation/${id}/complete`);
    if (res.success) loadSessions();
    else alert('Failed to complete');
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bank reconciliation</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Match cleared book transactions to the bank statement, then complete to mark items reconciled
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank / cash account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select…</option>
              {bankAccounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.accountNumber} — {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Statement date</label>
            <input
              type="date"
              value={statementDate}
              onChange={(e) => setStatementDate(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Statement ending balance</label>
            <input
              type="number"
              step="0.01"
              value={statementBalance}
              onChange={(e) => setStatementBalance(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Unreconciled (approved) on this account</h3>
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded-md dark:border-gray-600">
              {unmatched.map((t) => (
                <label
                  key={t._id}
                  className="flex items-center gap-3 px-3 py-2 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(t._id)}
                    onChange={() => toggle(t._id)}
                  />
                  <span className="text-sm flex-1">{t.description}</span>
                  <span className="text-sm font-mono">{t.transactionNumber}</span>
                  <span className="text-sm">{t.amount?.toLocaleString?.()}</span>
                </label>
              ))}
              {unmatched.length === 0 && <p className="p-4 text-sm text-gray-500">No unreconciled items</p>}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={createSession}
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium"
        >
          Save reconciliation draft
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent sessions</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Account</th>
                <th className="px-4 py-2 text-right">Statement balance</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sessions.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-2">{new Date(s.statementDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{s.bankAccount?.name}</td>
                  <td className="px-4 py-2 text-right">{s.statementEndingBalance?.toLocaleString?.()}</td>
                  <td className="px-4 py-2 capitalize">{s.status}</td>
                  <td className="px-4 py-2">
                    {s.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => completeSession(s._id)}
                        className="text-green-600 inline-flex items-center gap-1"
                      >
                        <FaCheck /> Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountingBankReconciliation;
