'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { apiGet, apiPost, apiPut } from '../../utils/api';
import InvoicePreview from '../../components/Admin/InvoicePreview';
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaEye,
  FaDownload,
  FaPaperPlane,
  FaCalculator,
  FaFileInvoice,
  FaUser,
  FaCalendarAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';

const InvoiceMaker = () => {
  const params = useParams();
  const id = params?.id;
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [invoiceId, setInvoiceId] = useState(id || null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      client: {
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Kenya'
        },
        company: '',
        taxId: ''
      },
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'USD',
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0
        }
      ],
      taxRate: 16, // VAT in Kenya
      discount: 0,
      notes: '',
      paymentInstructions: 'Payment is due within 30 days of invoice date. Please include invoice number in payment reference.',
      terms: 'All services are subject to our terms and conditions. Late payments may incur additional charges.'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  // Load invoice data when editing
  useEffect(() => {
    if (isEditing && id) {
      fetchInvoice();
    }
  }, [id, isEditing]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/invoices/${id}`);
      const invoice = response.data.data;
      
      // Populate form with existing invoice data
      setValue('client', invoice.client);
      setValue('issueDate', new Date(invoice.issueDate).toISOString().split('T')[0]);
      setValue('dueDate', new Date(invoice.dueDate).toISOString().split('T')[0]);
      setValue('currency', invoice.currency);
      setValue('items', invoice.items);
      setValue('taxRate', invoice.taxRate);
      setValue('discount', invoice.discount);
      setValue('notes', invoice.notes || '');
      setValue('paymentInstructions', invoice.paymentInstructions || '');
      setValue('terms', invoice.terms || '');
      
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice data');
    } finally {
      setLoading(false);
    }
  };

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');
  const watchedDiscount = watch('discount');
  const watchedCurrency = watch('currency');

  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + itemTotal;
  }, 0);

  const taxAmount = (subtotal - (watchedDiscount || 0)) * ((watchedTaxRate || 0) / 100);
  const total = subtotal - (watchedDiscount || 0) + taxAmount;

  // Currency formatting
  const currencySymbol = watchedCurrency === 'KES' ? 'KSh' : '$';
  const formatAmount = (amount) => {
    if (watchedCurrency === 'KES') {
      return new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Update item totals when quantity or price changes
  useEffect(() => {
    watchedItems.forEach((item, index) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      setValue(`items.${index}.total`, itemTotal);
    });
  }, [watchedItems, setValue]);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const addItem = () => {
    append({
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    });
  };

  const removeItem = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const invoiceData = {
        ...data,
        subtotal,
        taxAmount,
        total
      };

      let response;
      if (invoiceId) {
        response = await apiPut(`/api/invoices/${invoiceId}`, invoiceData);
      } else {
        response = await apiPost('/api/invoices', invoiceData);
      }

      if (response.data.success) {
        setInvoiceId(response.data.data._id);
        setSuccess(
          invoiceId ? 'Invoice updated successfully!' : 'Invoice created successfully!'
        );
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      setError('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!invoiceId) {
      setError('Please save the invoice first');
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    }
  };

  const sendEmail = async () => {
    if (!invoiceId) {
      setError('Please save the invoice first');
      return;
    }

    try {
      setSendingEmail(true);
      const response = await apiPost(`/api/invoices/${invoiceId}/send`);
      
      if (response.data.success) {
        setSuccess('Invoice sent successfully!');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      setError('Failed to send invoice');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{isEditing ? 'Edit Invoice' : 'Create Invoice'} - Skyfalke Admin</title>
        <meta name="description" content={isEditing ? "Edit existing invoice" : "Create and manage professional invoices with Skyfalke branding"} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <div className="flex">
              <FaCheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FaFileInvoice className="text-primary-500" />
                {isEditing ? 'Edit Invoice' : 'Create Invoice'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isEditing ? 'Update invoice details and information' : 'Create professional invoices with Skyfalke branding'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaEye />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={downloadPDF}
                disabled={!invoiceId}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaDownload />
                Download PDF
              </button>
              
              <button
                onClick={sendEmail}
                disabled={!invoiceId || sendingEmail}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {loading && isEditing ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading invoice...</span>
          </div>
        ) : previewMode ? (
          <InvoicePreview
            formData={watch()}
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
            onClose={() => setPreviewMode(false)}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Client Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaUser className="text-primary-500" />
                Client Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Name *
                  </label>
                  <input
                    {...register('client.name', { required: 'Client name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter client name"
                  />
                  {errors.client?.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.client.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('client.email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="client@example.com"
                  />
                  {errors.client?.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.client.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    {...register('client.phone')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    {...register('client.company')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Street Address
                  </label>
                  <input
                    {...register('client.address.street')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    {...register('client.address.city')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State/County
                  </label>
                  <input
                    {...register('client.address.state')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="State or County"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code
                  </label>
                  <input
                    {...register('client.address.zipCode')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="ZIP or Postal Code"
                  />
                </div>
              </div>
            </div>
            </motion.div>

            {/* Invoice Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-primary-500" />
                Invoice Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    {...register('issueDate', { required: 'Issue date is required' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {errors.issueDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.issueDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    {...register('dueDate', { required: 'Due date is required' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>

              {/* Currency */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency *
                </label>
                <select
                  {...register('currency', { required: 'Currency is required' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (KSh)</option>
                </select>
                {errors.currency && (
                  <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
                )}
              </div>
            </motion.div>

            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaDollarSign className="text-primary-500" />
                  Invoice Items
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <FaPlus />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <input
                        {...register(`items.${index}.description`, { required: 'Description is required' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Item description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        {...register(`items.${index}.quantity`, { 
                          required: 'Quantity is required',
                          min: { value: 0, message: 'Quantity must be positive' }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Unit Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register(`items.${index}.unitPrice`, { 
                          required: 'Unit price is required',
                          min: { value: 0, message: 'Price must be positive' }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.total`)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 dark:text-white"
                          readOnly
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                          {currencySymbol}
                        </span>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={fields.length === 1}
                        className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Totals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaCalculator className="text-primary-500" />
                Totals
              </h2>
              
              <div className="max-w-md ml-auto space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium">{currencySymbol}{formatAmount(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('discount')}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <span className="font-medium">{currencySymbol}{formatAmount(watchedDiscount || 0)}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax Rate:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      {...register('taxRate')}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax Amount:</span>
                  <span className="font-medium">{currencySymbol}{formatAmount(taxAmount)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-primary-500">{currencySymbol}{formatAmount(total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Additional Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Instructions
                  </label>
                  <textarea
                    {...register('paymentInstructions')}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Payment instructions for the client"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Additional notes or terms"
                  />
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end"
            >
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FaSave />
                )}
                {loading ? 'Saving...' : isEditing ? 'Update Invoice' : 'Save Invoice'}
              </button>
            </motion.div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InvoiceMaker;
