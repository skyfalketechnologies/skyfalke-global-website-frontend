'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { adminApiGet, adminApiPost, adminApiPut } from '../../utils/adminApi';

const ExpenseForm = () => {
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
    category: '',
    description: '',
    amount: '',
    currency: 'KES',
    date: new Date().toISOString().split('T')[0],
    vendor: {
      name: '',
      contact: '',
      address: ''
    },
    paymentMethod: 'bank',
    receipt: {
      url: '',
      number: ''
    },
    account: '',
    status: 'pending',
    tags: [],
    notes: ''
  });

  const [newTag, setNewTag] = useState('');

  const categories = [
    'office-supplies',
    'travel',
    'utilities',
    'rent',
    'marketing',
    'software',
    'equipment',
    'professional-services',
    'training',
    'maintenance',
    'insurance',
    'taxes',
    'other'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchExpense();
    }
    fetchAccounts();
  }, [id]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await adminApiGet(`/api/accounting/expenses/${id}`);
      if (response.success && response.data) {
        const expense = response.data.data;
        setFormData({
          category: expense.category || '',
          description: expense.description || '',
          amount: expense.amount || '',
          currency: expense.currency || 'KES',
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          vendor: {
            name: expense.vendor?.name || '',
            contact: expense.vendor?.contact || '',
            address: expense.vendor?.address || ''
          },
          paymentMethod: expense.paymentMethod || 'bank',
          receipt: {
            url: expense.receipt?.url || '',
            number: expense.receipt?.number || ''
          },
          account: expense.account?._id || '',
          status: expense.status || 'pending',
          tags: expense.tags || [],
          notes: expense.notes || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch expense details');
      console.error('Error fetching expense:', err);
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
    const { name, value, type, checked } = e.target;
    const path = name.split('.');
    
    if (path.length === 2) {
      setFormData(prev => ({
        ...prev,
        [path[0]]: {
          ...prev[path[0]],
          [path[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.category) errors.push('Category is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.push('Valid amount is required');
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
        account: formData.account || undefined,
        date: new Date(formData.date)
      };

      let response;
      if (isEditing) {
        response = await adminApiPut(`/api/accounting/expenses/${id}`, submitData);
      } else {
        response = await adminApiPost('/api/accounting/expenses', submitData);
      }

      if (response.success) {
        setSuccess(isEditing ? 'Expense updated successfully' : 'Expense created successfully');
        setTimeout(() => {
          router.push('/system/dashboard/accounting/expenses');
        }, 1500);
      } else {
        setError(response.error?.message || 'Failed to save expense');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving');
      console.error('Error saving expense:', err);
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
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Update expense information' : 'Record a new business expense'}
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
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
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
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account
            </label>
            <select
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            >
              <option value="">Select Account</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} ({acc.accountNumber})
                </option>
              ))}
            </select>
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Vendor Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Vendor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                name="vendor.name"
                value={formData.vendor.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact
              </label>
              <input
                type="text"
                name="vendor.contact"
                value={formData.vendor.contact}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                name="vendor.address"
                value={formData.vendor.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Receipt Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Receipt Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Receipt Number
              </label>
              <input
                type="text"
                name="receipt.number"
                value={formData.receipt.number}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Receipt URL
              </label>
              <input
                type="url"
                name="receipt.url"
                value={formData.receipt.url}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Tags</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag"
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
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
            onClick={() => router.push('/system/dashboard/accounting/expenses')}
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
            {saving ? 'Saving...' : isEditing ? 'Update Expense' : 'Create Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;

