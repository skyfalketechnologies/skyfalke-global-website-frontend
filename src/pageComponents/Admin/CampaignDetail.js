'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft,
  FaEdit,
  FaPaperPlane,
  FaSpinner,
  FaEye,
  FaMousePointer,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
  FaUsers,
  FaCalendar,
  FaTrash,
  FaSync
} from 'react-icons/fa';
import { apiGet, apiDelete, apiPost } from '../../utils/api';

const CampaignDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCampaign();
    fetchRecipients();
    
    // Auto-refresh campaign stats and recipients every 30 seconds if campaign is sent
    const interval = setInterval(() => {
      if (campaign && campaign.status === 'sent') {
        fetchCampaign();
        fetchRecipients();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [id, currentPage, campaign?.status]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/campaigns/${id}`);
      if (response.data.campaign) {
        setCampaign(response.data.campaign);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      setLoadingRecipients(true);
      const response = await apiGet(`/api/campaigns/${id}/recipients`, {
        params: {
          page: currentPage,
          limit: 20
        }
      });
      setRecipients(response.data.recipients);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleSend = async () => {
    if (!window.confirm('Are you sure you want to send this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      await apiPost(`/api/campaigns/${id}/send`);
      alert('Campaign is being sent. This may take a few minutes.');
      fetchCampaign();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert(error.response?.data?.message || 'Failed to send campaign');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await apiDelete(`/api/campaigns/${id}`);
      router.push('/system/dashboard/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      sending: { color: 'bg-yellow-100 text-yellow-800', label: 'Sending' },
      sent: { color: 'bg-green-100 text-green-800', label: 'Sent' },
      paused: { color: 'bg-orange-100 text-orange-800', label: 'Paused' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const badge = badges[status] || badges.draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getRecipientStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-gray-100 text-gray-800', label: 'Pending' },
      sent: { color: 'bg-blue-100 text-blue-800', label: 'Sent' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      opened: { color: 'bg-purple-100 text-purple-800', label: 'Opened' },
      clicked: { color: 'bg-indigo-100 text-indigo-800', label: 'Clicked' },
      bounced: { color: 'bg-red-100 text-red-800', label: 'Bounced' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      unsubscribed: { color: 'bg-orange-100 text-orange-800', label: 'Unsubscribed' }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Campaign not found</p>
        <Link href="/system/dashboard/campaigns" className="text-primary-600 hover:text-primary-700">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const stats = campaign.stats || {};
  const openRate = stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(2) : 0;
  const clickRate = stats.delivered > 0 ? ((stats.clicked / stats.delivered) * 100).toFixed(2) : 0;
  const deliveryRate = stats.sent > 0 ? ((stats.delivered / stats.sent) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/system/dashboard/campaigns')}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{campaign.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.subject}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {getStatusBadge(campaign.status)}
          {campaign.status === 'draft' && (
            <>
              <Link href={`/system/dashboard/campaigns/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={handleSend}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FaPaperPlane className="mr-2 h-4 w-4" />
                Send
              </button>
            </>
          )}
          {campaign.status !== 'sent' && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Recipients</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{formatNumber(stats.totalRecipients || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaEnvelope className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Sent</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{formatNumber(stats.sent || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaEye className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Opens</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatNumber(stats.opened || 0)}
                    <span className="text-sm text-gray-500 ml-1">({openRate}%)</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaMousePointer className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Clicks</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatNumber(stats.clicked || 0)}
                    <span className="text-sm text-gray-500 ml-1">({clickRate}%)</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Campaign Details</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{getStatusBadge(campaign.status)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recipient Type</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">{campaign.recipientType?.replace('_', ' ')}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(campaign.createdAt)}</dd>
          </div>
          {campaign.sentAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sent</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(campaign.sentAt)}</dd>
            </div>
          )}
          {campaign.scheduledAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(campaign.scheduledAt)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Email Content Preview */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Email Content</h3>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: campaign.content }}
        />
      </div>

      {/* Recipients List */}
      {campaign.status === 'sent' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recipients</h3>
            <button
              onClick={() => {
                fetchCampaign();
                fetchRecipients();
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              title="Refresh data"
            >
              <FaSync className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
          {loadingRecipients ? (
            <div className="flex justify-center py-8">
              <FaSpinner className="animate-spin h-6 w-6 text-primary-600" />
            </div>
          ) : recipients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recipients found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Sent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Opened</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Clicked</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recipients.map((recipient) => (
                      <tr key={recipient._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {recipient.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRecipientStatusBadge(recipient.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(recipient.sentAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {recipient.openedAt ? (
                            <div>
                              <div className="font-medium text-purple-600 dark:text-purple-400">{formatDate(recipient.openedAt)}</div>
                              {recipient.status === 'opened' && (
                                <div className="text-xs text-gray-400">Opened</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">Not opened</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {recipient.clicks?.length > 0 ? `${recipient.clicks.length} time(s)` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="py-2 text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;

