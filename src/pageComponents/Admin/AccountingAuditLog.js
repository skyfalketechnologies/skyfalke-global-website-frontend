'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaHistory } from 'react-icons/fa';
import { adminApiGet } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const AccountingAuditLog = () => {
  const router = useRouter();
  const { loading: authLoading, canAccessAccounting } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApiGet(`/api/accounting/audit-log?page=${page}&limit=30`);
      if (res.success && res.data) {
        setLogs(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (authLoading || !canAccessAccounting()) return;
    fetchLogs();
  }, [authLoading, canAccessAccounting, fetchLogs]);

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessAccounting()) router.replace('/system/dashboard');
  }, [authLoading, canAccessAccounting, router]);

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FaHistory className="text-primary-600" />
          Audit Trail
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Immutable log of financial actions for compliance and review
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <FaSpinner className="animate-spin text-3xl text-primary-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">When</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {row.userId?.name || '—'} <span className="text-gray-400">({row.userId?.email})</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-700 dark:text-primary-400">{row.action}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {row.entityType}
                      {row.details && Object.keys(row.details).length > 0 && (
                        <span className="block text-xs text-gray-400 mt-1 truncate max-w-xs">
                          {JSON.stringify(row.details)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-1 text-sm text-gray-600">Page {page}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountingAuditLog;
