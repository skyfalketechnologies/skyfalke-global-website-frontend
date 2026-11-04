'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSpinner, FaPlus, FaDownload } from 'react-icons/fa';
import { adminApiGet } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const AccountingDocuments = () => {
  const router = useRouter();
  const { loading: authLoading, canAccessAccounting } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const q = filterType ? `?documentType=${filterType}` : '';
      const res = await adminApiGet(`/api/accounting/documents${q}`);
      if (res.success && res.data) setDocs(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    if (authLoading || !canAccessAccounting()) return;
    load();
  }, [authLoading, canAccessAccounting, load]);

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessAccounting()) router.replace('/system/dashboard');
  }, [authLoading, canAccessAccounting, router]);

  const downloadPdf = async (id, documentNumber) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch(`/api/accounting/documents/${id}/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) {
        alert('Failed to download PDF');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentNumber || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert('Failed to download PDF');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sales receipts & notes</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Credit notes, debit notes, and sales receipts (distinct from customer invoices)
          </p>
        </div>
        <Link
          href="/system/dashboard/accounting/documents/new"
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium"
        >
          <FaPlus className="mr-2" /> New document
        </Link>
      </div>

      <div className="flex gap-2">
        {['', 'sales_receipt', 'credit_note', 'debit_note'].map((t) => (
          <button
            key={t || 'all'}
            type="button"
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-md text-sm ${
              filterType === t ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {t ? t.replace(/_/g, ' ') : 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-3xl" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-2 text-left">Number</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {docs.map((d) => (
                <tr key={d._id}>
                  <td className="px-4 py-2 font-mono">{d.documentNumber}</td>
                  <td className="px-4 py-2 capitalize">{d.documentType?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2">{d.client?.name}</td>
                  <td className="px-4 py-2">{new Date(d.issueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
                    {d.currency} {d.total?.toLocaleString?.() ?? d.total}
                  </td>
                  <td className="px-4 py-2 capitalize">{d.status}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => downloadPdf(d._id, d.documentNumber)}
                      className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1 text-sm"
                      title="Download PDF"
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && docs.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">No documents yet</p>
        )}
      </div>
    </div>
  );
};

export default AccountingDocuments;
