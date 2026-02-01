'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaEye, 
  FaEnvelope,
  FaFilePdf,
  FaArrowLeft
} from 'react-icons/fa';
// import { useNotifications } from '../../contexts/NotificationContext';

const QuotationForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isEdit = Boolean(id);
  
  // Notification function - defined at the top level
  const showNotification = React.useCallback((message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  }, []);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quotation, setQuotation] = useState({
    client: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    notes: '',
    terms: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD'
  });

  useEffect(() => {
    if (isEdit) {
      fetchQuotation();
    }
  }, [id, isEdit]);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotations/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuotation({
          ...data,
          issueDate: new Date(data.issueDate).toISOString().split('T')[0],
          expiryDate: new Date(data.expiryDate).toISOString().split('T')[0]
        });
      } else {
        showNotification('Failed to fetch quotation', 'error');
        router.push('/system/dashboard/quotations');
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
      showNotification('Error fetching quotation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setQuotation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientChange = (field, value) => {
    setQuotation(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field, value) => {
    setQuotation(prev => ({
      ...prev,
      client: {
        ...prev.client,
        address: {
          ...prev.client.address,
          [field]: value
        }
      }
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...quotation.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Calculate item total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    setQuotation(prev => ({
      ...prev,
      items: newItems
    }));

    // Recalculate totals
    calculateTotals(newItems);
  };

  const addItem = () => {
    setQuotation(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (quotation.items.length > 1) {
      const newItems = quotation.items.filter((_, i) => i !== index);
      setQuotation(prev => ({
        ...prev,
        items: newItems
      }));
      calculateTotals(newItems);
    }
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal - quotation.discount) * (quotation.taxRate / 100);
    const total = subtotal - quotation.discount + taxAmount;

    setQuotation(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  };

  const handleSave = async (status = 'draft') => {
    try {
      setSaving(true);
      
      // Filter out items with empty descriptions and validate
      const validItems = quotation.items.filter(item => 
        item.description && item.description.trim() !== ''
      );

      // Ensure at least one valid item exists
      if (validItems.length === 0) {
        showNotification('Please add at least one item with a description', 'error');
        setSaving(false);
        return;
      }

      // Validate client information
      if (!quotation.client.name || !quotation.client.name.trim()) {
        showNotification('Client name is required', 'error');
        setSaving(false);
        return;
      }

      if (!quotation.client.email || !quotation.client.email.trim()) {
        showNotification('Client email is required', 'error');
        setSaving(false);
        return;
      }

      // Recalculate totals with valid items only
      const subtotal = validItems.reduce((sum, item) => {
        const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
        return sum + itemTotal;
      }, 0);
      const taxAmount = (subtotal - (quotation.discount || 0)) * ((quotation.taxRate || 0) / 100);
      const total = subtotal - (quotation.discount || 0) + taxAmount;

      const quotationData = {
        ...quotation,
        items: validItems.map(item => ({
          description: item.description.trim(),
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          total: (item.quantity || 0) * (item.unitPrice || 0)
        })),
        subtotal,
        taxAmount,
        total,
        status
      };

      const url = isEdit ? `/api/quotations/${id}` : '/api/quotations';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(quotationData)
      });

      if (response.ok) {
        const data = await response.json();
        showNotification(
          isEdit ? 'Quotation updated successfully' : 'Quotation created successfully',
          'success'
        );
        router.push('/system/dashboard/quotations');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || 'Failed to save quotation', 'error');
      }
    } catch (error) {
      console.error('Error saving quotation:', error);
      showNotification('Error saving quotation', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setSaving(true);
      
      // First save the quotation
      await handleSave('sent');
      
      // Then send email
      const response = await fetch(`/api/quotations/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showNotification('Quotation sent successfully', 'success');
        router.push('/system/dashboard/quotations');
      } else {
        showNotification('Failed to send quotation', 'error');
      }
    } catch (error) {
      console.error('Error sending quotation:', error);
      showNotification('Error sending quotation', 'error');
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async (quotationId) => {
    try {
      const response = await fetch(`/api/quotations/${quotationId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quotation-${quotationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('PDF downloaded successfully', 'success');
      } else {
        showNotification('Failed to download PDF', 'error');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showNotification('Error downloading PDF', 'error');
    }
  };

  const formatCurrency = (amount) => {
    const currency = quotation.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/system/dashboard/quotations')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Quotation' : 'New Quotation'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isEdit ? 'Update quotation details' : 'Create a new quotation for your client'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <FaSave className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          {isEdit && (
            <>
              <button
                onClick={() => downloadPDF(id)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaFilePdf className="mr-2 h-4 w-4" />
                Preview PDF
              </button>
              <button
                onClick={handleSendEmail}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <FaEnvelope className="mr-2 h-4 w-4" />
                {saving ? 'Sending...' : 'Send Email'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={quotation.client.name}
                  onChange={(e) => handleClientChange('name', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={quotation.client.email}
                  onChange={(e) => handleClientChange('email', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={quotation.client.phone}
                  onChange={(e) => handleClientChange('phone', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={quotation.client.company}
                  onChange={(e) => handleClientChange('company', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Items
              </h3>
              <button
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Item
              </button>
            </div>
            <div className="space-y-4">
              {quotation.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Item description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total
                      </label>
                      <div className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                    {quotation.items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notes and Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={quotation.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Additional notes or comments"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={quotation.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Terms and conditions"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quotation Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quotation Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={quotation.issueDate}
                  onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={quotation.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={quotation.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (KSh)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Pricing
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={quotation.taxRate}
                  onChange={(e) => {
                    const taxRate = parseFloat(e.target.value) || 0;
                    handleInputChange('taxRate', taxRate);
                    const taxAmount = (quotation.subtotal - quotation.discount) * (taxRate / 100);
                    const total = quotation.subtotal - quotation.discount + taxAmount;
                    setQuotation(prev => ({
                      ...prev,
                      taxAmount,
                      total
                    }));
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quotation.discount}
                  onChange={(e) => {
                    const discount = parseFloat(e.target.value) || 0;
                    handleInputChange('discount', discount);
                    const taxAmount = (quotation.subtotal - discount) * (quotation.taxRate / 100);
                    const total = quotation.subtotal - discount + taxAmount;
                    setQuotation(prev => ({
                      ...prev,
                      taxAmount,
                      total
                    }));
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Totals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Totals
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(quotation.subtotal)}
                </span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    -{formatCurrency(quotation.discount)}
                  </span>
                </div>
              )}
              {quotation.taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tax ({quotation.taxRate}%):
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(quotation.taxAmount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900 dark:text-white">Total:</span>
                  <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(quotation.total)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
