'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSpinner, FaSave } from 'react-icons/fa';
import { adminApiPost } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const AccountingDocumentForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'sales_receipt';
  const { loading: authLoading, canAccessAccounting } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    documentType: ['sales_receipt', 'credit_note', 'debit_note'].includes(typeParam) ? typeParam : 'sales_receipt',
    client: { name: '', email: '', phone: '' },
    items: [{ description: 'Line 1', quantity: 1, unitPrice: 0, total: 0 }],
    taxRate: 0,
    discount: 0,
    currency: 'KES',
    notes: '',
    reason: ''
  });

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessAccounting()) router.replace('/system/dashboard');
  }, [authLoading, canAccessAccounting, router]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApiPost('/api/accounting/documents', {
        ...form,
        status: 'draft'
      });
      if (res.success) {
        router.push('/system/dashboard/accounting/documents');
      } else {
        alert(res.error?.message || 'Failed to save');
      }
    } catch (err) {
      alert(err.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (i, field, val) => {
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: val };
      return { ...f, items };
    });
  };

  const addLine = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));

  if (authLoading || !canAccessAccounting()) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">New financial document</h2>
      <form onSubmit={submit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document type</label>
          <select
            value={form.documentType}
            onChange={(e) => setForm((f) => ({ ...f, documentType: e.target.value }))}
            className="mt-1 w-full border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="sales_receipt">Sales receipt</option>
            <option value="credit_note">Credit note</option>
            <option value="debit_note">Debit note</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Client name"
            value={form.client.name}
            onChange={(e) => setForm((f) => ({ ...f, client: { ...f.client, name: e.target.value } }))}
            className="border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <input
            type="email"
            placeholder="Client email"
            value={form.client.email}
            onChange={(e) => setForm((f) => ({ ...f, client: { ...f.client, email: e.target.value } }))}
            className="border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Lines</span>
            <button type="button" onClick={addLine} className="text-sm text-primary-600">
              Add line
            </button>
          </div>
          {form.items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                className="col-span-6 border rounded px-2 py-1 text-sm dark:bg-gray-700"
                placeholder="Description"
                value={it.description}
                onChange={(e) => updateItem(i, 'description', e.target.value)}
              />
              <input
                type="number"
                className="col-span-2 border rounded px-2 py-1 text-sm dark:bg-gray-700"
                placeholder="Qty"
                value={it.quantity}
                onChange={(e) => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                className="col-span-4 border rounded px-2 py-1 text-sm dark:bg-gray-700"
                placeholder="Unit price"
                value={it.unitPrice}
                onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Tax %</label>
            <input
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm((f) => ({ ...f, taxRate: parseFloat(e.target.value) || 0 }))}
              className="w-full border rounded-md px-3 py-2 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 dark:bg-gray-700"
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium disabled:opacity-50"
        >
          <FaSave className="mr-2" /> {saving ? 'Saving…' : 'Save draft'}
        </button>
      </form>
    </div>
  );
};

export default AccountingDocumentForm;
