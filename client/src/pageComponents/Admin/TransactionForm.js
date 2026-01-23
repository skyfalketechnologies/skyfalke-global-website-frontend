'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { adminApiGet, adminApiPost, adminApiPut } from '../../utils/adminApi';

const TransactionForm = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accounts, setAccounts] = useState([]);

  const [formData, setFormData] = useState({
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    account: '',
    toAccount: '',
    amount: '',
    currency: 'KES',
    description: '',
    category: '',
    reference: '',
    paymentMethod: 'bank',
    status: 'completed',
    notes: ''
  });

  useEffect(() => {
    if (isEditing) {
      fetchTransaction();
    }
    fetchAccounts();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await adminApiGet(`/api/accounting/transactions/${id}`);
      if (response.success && response.data) {
        const transaction = response.data.data;
        setFormData({
          type: transaction.type || 'income',
          date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          account: transaction.account?._id || '',
          toAccount: transaction.toAccount?._id || '',
          amount: transaction.amount || '',
          currency: transaction.currency || 'KES',
          description: transaction.description || '',
          category: transaction.category || '',
          reference: transaction.reference || '',
          paymentMethod: transaction.paymentMethod || 'bank',
          status: transaction.status || 'completed',
          notes: transaction.notes || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch transaction details');
      console.error('Error fetching transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await adminApiGet('/api/accounting/accounts?isActive=true');
      if (response.success && response.data) {
        setAccounts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.type) errors.push('Transaction type is required');
    if (!formData.account) errors.push('Account is required');
    if (formData.type === 'transfer' && !formData.toAccount) errors.push('To Account is required for transfers');
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.push('Valid amount is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.date) errors.push('Date is required');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        toAccount: formData.type === 'transfer' ? formData.toAccount : undefined
      };

      let response;
      if (isEditing) {
        response = await adminApiPut(`/api/accounting/transactions/${id}`, submitData);
      } else {
        response = await adminApiPost('/api/accounting/transactions', submitData);
      }

      if (response.success) {
        setSuccess(isEditing ? 'Transaction updated successfully' : 'Transaction created successfully');
        setTimeout(() => {
          router.push('/system/dashboard/accounting/transactions');
        }, 1500);
      } else {
        setError(response.error?.message || 'Failed to save transaction');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Error saving transaction:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Update transaction information' : 'Record a new financial transaction'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account *
            </label>
            <select
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Account</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} ({acc.accountNumber})
                </option>
              ))}
            </select>
          </div>
          {formData.type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Account *
              </label>
              <select
                name="toAccount"
                value={formData.toAccount}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Account</option>
                {accounts.filter(acc => acc._id !== formData.account).map(acc => (
                  <option key={acc._id} value={acc._id}>
                    {acc.name} ({acc.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <div className="flex">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2"
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
              <option value="cheque">Cheque</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reference
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="reversed">Reversed</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => router.push('/system/dashboard/accounting/transactions')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaTimes className="inline mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? (
              <FaSpinner className="inline mr-2 animate-spin" />
            ) : (
              <FaSave className="inline mr-2" />
            )}
            {saving ? 'Saving...' : isEditing ? 'Update Transaction' : 'Create Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

