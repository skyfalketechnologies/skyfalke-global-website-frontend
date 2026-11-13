'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaEdit, 
  FaFilePdf, 
  FaEnvelope, 
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaFileInvoice
} from 'react-icons/fa';
// import { useNotifications } from '../../contexts/NotificationContext';

const QuotationView = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  // Notification function - defined at the top level
  const showNotification = React.useCallback((message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  }, []);

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const statusColors = {
    draft: 'border-gray-200 bg-gray-50 text-gray-700',
    sent: 'border-blue-200 bg-blue-50 text-blue-700',
    accepted: 'border-green-200 bg-green-50 text-green-700',
    rejected: 'border-red-200 bg-red-50 text-red-700',
    expired: 'border-amber-200 bg-amber-50 text-amber-700'
  };

  const statusIcons = {
    draft: FaClock,
    sent: FaEnvelope,
    accepted: FaCheck,
    rejected: FaTimes,
    expired: FaExclamationTriangle
  };

  useEffect(() => {
    fetchQuotation();
  }, [id]);

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
        setQuotation(data);
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

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/quotations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        showNotification(`Quotation status updated to ${newStatus}`, 'success');
        fetchQuotation();
      } else {
        showNotification('Failed to update quotation status', 'error');
      }
    } catch (error) {
      console.error('Error updating quotation status:', error);
      showNotification('Error updating quotation status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/quotations/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showNotification('Quotation sent successfully', 'success');
        fetchQuotation();
      } else {
        showNotification('Failed to send quotation', 'error');
      }
    } catch (error) {
      console.error('Error sending quotation:', error);
      showNotification('Error sending quotation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertToInvoice = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/quotations/${id}/convert-to-invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('Quotation converted to invoice successfully', 'success');
        router.push(`/system/dashboard/invoices/${data.invoice._id}`);
      } else {
        showNotification('Failed to convert quotation to invoice', 'error');
      }
    } catch (error) {
      console.error('Error converting quotation:', error);
      showNotification('Error converting quotation', 'error');
    } finally {
      setActionLoading(false);
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
        a.download = `quotation-${quotation?.quotationNumber || quotationId}.pdf`;
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

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const currency = quotation?.currency || 'USD';
    const value = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
    return `${currency} ${value}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quotation not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The quotation you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/system/dashboard/quotations')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Back to Quotations
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[quotation.status] || FaClock;
  const statusLabel = quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1);
  const client = quotation.client || {};
  const address = client.address || {};
  const addressLines = [
    address.street,
    [address.city, address.state, address.zipCode].filter(Boolean).join(', '),
    address.country
  ].filter(Boolean);
  const preparer = quotation.createdBy && typeof quotation.createdBy === 'object' ? quotation.createdBy : null;

  const secondaryBtn =
    'inline-flex items-center px-3.5 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50';
  const primaryBtn =
    'inline-flex items-center px-3.5 py-2 rounded-md text-sm font-medium text-white bg-[#303661] hover:bg-[#262b4f] focus:outline-none focus:ring-2 focus:ring-[#303661] focus:ring-offset-2 disabled:opacity-50';
  const sectionLabel = 'text-[11px] font-semibold uppercase tracking-wider text-gray-500';

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/system/dashboard/quotations')}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Back to quotations"
          >
            <FaArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                QT-{quotation.quotationNumber}
              </h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColors[quotation.status] || statusColors.draft}`}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusLabel}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {client.company || client.name} · Issued {formatDate(quotation.issueDate)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => router.push(`/system/dashboard/quotations/${id}/edit`)} className={secondaryBtn}>
            <FaEdit className="mr-2 h-3.5 w-3.5" />
            Edit
          </button>
          <button onClick={() => downloadPDF(id)} className={secondaryBtn}>
            <FaFilePdf className="mr-2 h-3.5 w-3.5" />
            Download PDF
          </button>
          {quotation.status === 'draft' && (
            <button onClick={() => handleStatusChange('sent')} disabled={actionLoading} className={secondaryBtn}>
              Mark as Sent
            </button>
          )}
          {quotation.status === 'sent' && (
            <>
              <button onClick={() => handleStatusChange('accepted')} disabled={actionLoading} className={secondaryBtn}>
                <FaCheck className="mr-2 h-3.5 w-3.5 text-green-600" />
                Accepted
              </button>
              <button onClick={() => handleStatusChange('rejected')} disabled={actionLoading} className={secondaryBtn}>
                <FaTimes className="mr-2 h-3.5 w-3.5 text-red-600" />
                Rejected
              </button>
            </>
          )}
          {quotation.status === 'accepted' && !quotation.convertedToInvoice && (
            <button onClick={handleConvertToInvoice} disabled={actionLoading} className={primaryBtn}>
              <FaFileInvoice className="mr-2 h-3.5 w-3.5" />
              {actionLoading ? 'Converting…' : 'Convert to Invoice'}
            </button>
          )}
          {quotation.status !== 'sent' && !quotation.convertedToInvoice && (
            <button onClick={handleSendEmail} disabled={actionLoading} className={primaryBtn}>
              <FaEnvelope className="mr-2 h-3.5 w-3.5" />
              {actionLoading ? 'Sending…' : 'Send to Client'}
            </button>
          )}
          {quotation.convertedToInvoice && (
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border border-green-200 bg-green-50 text-green-700">
              <FaCheck className="mr-1 h-3 w-3" />
              Converted to Invoice
            </span>
          )}
        </div>
      </div>

      {/* Document preview — mirrors the generated PDF */}
      <div className="mx-auto max-w-4xl bg-white text-gray-800 border border-gray-200 rounded-sm">
        <div className="h-1 bg-[#303661]" />
        <div className="px-6 py-8 sm:px-12 sm:py-10">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <img src="/images/logos/logo.png" alt="Skyfalke" className="h-9 w-auto" />
              <div className="mt-4 text-xs leading-5 text-gray-500">
                <p className="text-sm font-semibold text-gray-900">Skyfalke Limited</p>
                <p>Nairobi, Kenya</p>
                <p>info@skyfalke.com | +254 (071) 797-238</p>
                <p>KRA PIN: P052474944J</p>
              </div>
            </div>
            <div className="sm:text-right">
              <h2 className="text-2xl font-bold tracking-wide text-[#303661]">QUOTATION</h2>
              <dl className="mt-3 grid grid-cols-[auto_auto] gap-x-8 gap-y-1 text-xs sm:justify-end">
                <dt className="text-gray-500 sm:text-left">Quotation No.</dt>
                <dd className="font-semibold text-gray-900 text-right">QT-{quotation.quotationNumber}</dd>
                <dt className="text-gray-500 sm:text-left">Date</dt>
                <dd className="font-semibold text-gray-900 text-right">{formatDate(quotation.issueDate)}</dd>
                <dt className="text-gray-500 sm:text-left">Valid Until</dt>
                <dd className="font-semibold text-gray-900 text-right">{formatDate(quotation.expiryDate)}</dd>
                <dt className="text-gray-500 sm:text-left">Currency</dt>
                <dd className="font-semibold text-gray-900 text-right">{quotation.currency || 'USD'}</dd>
              </dl>
            </div>
          </div>

          <div className="mt-8 border-t border-[#303661]" />

          {/* Parties */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className={sectionLabel}>Prepared For</p>
              <p className="mt-2 text-base font-semibold text-gray-900">{client.name}</p>
              <div className="mt-1 text-sm leading-6 text-gray-600">
                {client.company && <p>{client.company}</p>}
                {addressLines.map((line) => <p key={line}>{line}</p>)}
                {client.email && <p>{client.email}</p>}
                {client.phone && <p>{client.phone}</p>}
              </div>
            </div>
            <div>
              <p className={sectionLabel}>Prepared By</p>
              <p className="mt-2 text-base font-semibold text-gray-900">Skyfalke Limited</p>
              <div className="mt-1 text-sm leading-6 text-gray-600">
                {preparer?.name && <p>Contact: {preparer.name}</p>}
                <p>{preparer?.email || 'info@skyfalke.com'}</p>
                <p>+254 (071) 797-238</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#303661]">
                  <th className={`${sectionLabel} py-2 pr-3 text-left w-8`}>#</th>
                  <th className={`${sectionLabel} py-2 pr-3 text-left`}>Description</th>
                  <th className={`${sectionLabel} py-2 px-3 text-right`}>Qty</th>
                  <th className={`${sectionLabel} py-2 px-3 text-right`}>Unit Price</th>
                  <th className={`${sectionLabel} py-2 pl-3 text-right`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 align-top">
                    <td className="py-3 pr-3 text-gray-400">{index + 1}</td>
                    <td className="py-3 pr-3 text-gray-900 whitespace-pre-wrap">{item.description}</td>
                    <td className="py-3 px-3 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-gray-700 whitespace-nowrap">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 pl-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-xs text-xs leading-5 text-gray-500">
              This quotation is valid until {formatDate(quotation.expiryDate)}. All amounts are in {quotation.currency || 'USD'}.
            </p>
            <div className="w-full sm:w-72 text-sm">
              <div className="flex justify-between border-b border-gray-200 px-2 py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(quotation.subtotal)}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between border-b border-gray-200 px-2 py-2">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-gray-900">- {formatCurrency(quotation.discount)}</span>
                </div>
              )}
              {quotation.taxRate > 0 && (
                <div className="flex justify-between border-b border-gray-200 px-2 py-2">
                  <span className="text-gray-600">VAT ({quotation.taxRate}%)</span>
                  <span className="text-gray-900">{formatCurrency(quotation.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#303661] bg-[#f4f5f9] px-2 py-3 font-semibold text-[#303661]">
                <span>Total</span>
                <span className="text-base">{formatCurrency(quotation.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes & terms */}
          {quotation.notes && (
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#303661]">Notes</p>
              <div className="mt-2 border-t border-gray-200 pt-2 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                {quotation.notes}
              </div>
            </div>
          )}
          {quotation.terms && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#303661]">Terms &amp; Conditions</p>
              <div className="mt-2 border-t border-gray-200 pt-2 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                {quotation.terms}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 border-t border-gray-200 pt-4 text-[11px] leading-5 text-gray-500">
            <p>Skyfalke Limited · Nairobi, Kenya · KRA PIN P052474944J</p>
            <p>info@skyfalke.com · +254 (071) 797-238 · www.skyfalke.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationView;
