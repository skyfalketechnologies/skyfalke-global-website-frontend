'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaEnvelope, 
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaCalendar,
  FaChartLine,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPauseCircle
} from 'react-icons/fa';
import { apiGet, apiDelete, apiPost } from '../../utils/api';

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, [currentPage, filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...filters
      });

      const response = await apiGet(`/api/campaigns?${params}`);
      setCampaigns(response.data.campaigns);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiGet('/api/campaigns/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await apiDelete(`/api/campaigns/${id}`);
      fetchCampaigns();
      fetchStats();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleSend = async (id) => {
    if (!window.confirm('Are you sure you want to send this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      await apiPost(`/api/campaigns/${id}/send`);
      alert('Campaign is being sent. This may take a few minutes.');
      fetchCampaigns();
      fetchStats();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert(error.response?.data?.message || 'Failed to send campaign');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: FaEdit, label: 'Draft' },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: FaCalendar, label: 'Scheduled' },
      sending: { color: 'bg-yellow-100 text-yellow-800', icon: FaSpinner, label: 'Sending' },
      sent: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, label: 'Sent' },
      paused: { color: 'bg-orange-100 text-orange-800', icon: FaPauseCircle, label: 'Paused' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, label: 'Cancelled' }
    };

    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="mr-1 h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl"
        >
          Email Campaigns
        </motion.h2>
        <Link href="/system/dashboard/campaigns/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaEnvelope className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Campaigns</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{formatNumber(stats.total || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaPaperPlane className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Sent</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{formatNumber(stats.totalSent || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaEye className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Opens</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{formatNumber(stats.totalOpened || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaChartLine className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Clicks</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{formatNumber(stats.totalClicked || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <FaEnvelope className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No campaigns</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new campaign.</p>
            <div className="mt-6">
              <Link href="/system/dashboard/campaigns/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                New Campaign
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Opens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {campaigns.map((campaign) => (
                    <tr key={campaign._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {campaign.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {campaign.subject}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(campaign.stats?.totalRecipients || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(campaign.stats?.opened || 0)} 
                        {campaign.stats?.delivered > 0 && (
                          <span className="text-gray-400"> ({((campaign.stats.opened / campaign.stats.delivered) * 100).toFixed(1)}%)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(campaign.stats?.clicked || 0)}
                        {campaign.stats?.delivered > 0 && (
                          <span className="text-gray-400"> ({((campaign.stats.clicked / campaign.stats.delivered) * 100).toFixed(1)}%)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(campaign.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/system/dashboard/campaigns/${campaign._id}`}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            <FaEye className="h-4 w-4" />
                          </Link>
                          {campaign.status === 'draft' && (
                            <>
                              <Link href={`/system/dashboard/campaigns/${campaign._id}/edit`}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <FaEdit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleSend(campaign._id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                <FaPaperPlane className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {campaign.status !== 'sent' && (
                            <button
                              onClick={() => handleDelete(campaign._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailCampaigns;

