'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import { adminApiGet } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const AccountingGeneralLedger = () => {
  const router = useRouter();
  const { loading: authLoading, canAccessAccounting } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAccounts = useCallback(async () => {
    const res = await adminApiGet('/api/accounting/accounts?isActive=true');
    if (res.success && res.data) {
      const payload = res.data.data ?? res.data;
      setAccounts(Array.isArray(payload) ? payload : []);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !canAccessAccounting()) return;
    loadAccounts();
  }, [authLoading, canAccessAccounting, loadAccounts]);

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessAccounting()) router.replace('/system/dashboard');
  }, [authLoading, canAccessAccounting, router]);

  const runQuery = async () => {
    if (!accountId) {
      alert('Select an account');
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ accountId, startDate, endDate });
      const res = await adminApiGet(`/api/accounting/general-ledger?${params}`);
      if (res.success && res.data) {
        setLines(res.data.data?.lines || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !canAccessAccounting()) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">General ledger</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Activity for a single account (posted transactions and journal lines)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select…</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.accountNumber} — {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={runQuery}
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium"
          >
            <FaSearch className="mr-2" /> Run
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-primary-600" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Ref</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-right">Debit</th>
                <th className="px-4 py-2 text-right">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {lines.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-mono text-xs">{row.reference}</td>
                  <td className="px-4 py-2">{row.description}</td>
                  <td className="px-4 py-2 text-right">{row.debit ? row.debit.toLocaleString() : '—'}</td>
                  <td className="px-4 py-2 text-right">{row.credit ? row.credit.toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && lines.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">Run a query to load ledger lines</p>
        )}
      </div>
    </div>
  );
};

export default AccountingGeneralLedger;
