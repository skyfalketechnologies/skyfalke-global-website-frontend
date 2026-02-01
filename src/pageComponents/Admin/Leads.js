'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaPlus,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaFire,
  FaSnowflake,
  FaSun,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTag
} from 'react-icons/fa';
import { apiGet, apiPatch, apiDelete } from '../../utils/api';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    lifecycleStage: '',
    source: '',
    leadRating: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [currentPage, filters, sortBy, sortOrder]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder,
        ...filters
      });

      const response = await apiGet(`/api/leads/admin/all?${params}`);
      setLeads(response.data.leads);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiGet('/api/leads/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleLeadSelect = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead._id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedLeads.length === 0) return;

    try {
      await apiPatch('/api/leads/admin/bulk', {
        leadIds: selectedLeads,
        updates: { status: bulkAction }
      });

      setSelectedLeads([]);
      setBulkAction('');
      fetchLeads();
      fetchStats();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform bulk action');
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await apiPatch(`/api/leads/admin/${leadId}`, {
        status: newStatus
      });
      fetchLeads();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      await apiDelete(`/api/leads/admin/${leadId}`);
      fetchLeads();
      fetchStats();
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      qualified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      nurturing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      converted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      unqualified: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case 'hot':
        return <FaFire className="text-red-500" />;
      case 'warm':
        return <FaSun className="text-orange-500" />;
      case 'cold':
        return <FaSnowflake className="text-blue-500" />;
      default:
        return <FaSnowflake className="text-gray-400" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-red-600 font-bold';
    if (score >= 40) return 'text-orange-600 font-semibold';
    return 'text-blue-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaUser className="text-primary-500" />
            Leads Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your leads throughout the sales funnel
          </p>
        </div>
        <Link href="/system/dashboard/leads/new"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
        >
          <FaPlus />
          New Lead
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
            </div>
            <FaUser className="text-3xl text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new || 0}</p>
            </div>
            <FaClock className="text-3xl text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Qualified</p>
              <p className="text-2xl font-bold text-green-600">{stats.qualified || 0}</p>
            </div>
            <FaCheckCircle className="text-3xl text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Converted</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.converted || 0}</p>
            </div>
            <FaChartLine className="text-3xl text-emerald-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.conversionRate || 0}%</p>
            </div>
            <FaChartLine className="text-3xl text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="nurturing">Nurturing</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
              <option value="unqualified">Unqualified</option>
            </select>
          </div>
          <div>
            <select
              value={filters.lifecycleStage}
              onChange={(e) => handleFilterChange('lifecycleStage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Stages</option>
              <option value="subscriber">Subscriber</option>
              <option value="lead">Lead</option>
              <option value="marketing_qualified_lead">MQL</option>
              <option value="sales_qualified_lead">SQL</option>
              <option value="opportunity">Opportunity</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div>
            <select
              value={filters.leadRating}
              onChange={(e) => handleFilterChange('leadRating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Ratings</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
          <div>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="email_campaign">Email Campaign</option>
              <option value="paid_ad">Paid Ad</option>
              <option value="organic_search">Organic Search</option>
              <option value="direct">Direct</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              {selectedLeads.length} lead(s) selected
            </span>
            <div className="flex items-center space-x-4">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Action</option>
                <option value="new">Mark as New</option>
                <option value="contacted">Mark as Contacted</option>
                <option value="qualified">Mark as Qualified</option>
                <option value="nurturing">Mark as Nurturing</option>
                <option value="lost">Mark as Lost</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === leads.length && leads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lead
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('leadScore')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Score</span>
                    {sortBy === 'leadScore' && (
                      sortOrder === 'asc' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortBy === 'status' && (
                      sortOrder === 'asc' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortBy === 'createdAt' && (
                      sortOrder === 'asc' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <FaSpinner className="animate-spin text-2xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Loading leads...</p>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <FaUser className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No leads found</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => handleLeadSelect(lead._id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <FaUser className="text-primary-600 dark:text-primary-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {lead.email}
                          </div>
                          {lead.company && (
                            <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                              <FaBuilding className="text-xs" />
                              {lead.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${getScoreColor(lead.leadScore)}`}>
                        {lead.leadScore || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRatingIcon(lead.leadRating)}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {lead.leadRating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lead.status)} border-0`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="nurturing">Nurturing</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                        <option value="unqualified">Unqualified</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {lead.source?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link href={`/system/dashboard/leads/${lead._id}`}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        <Link href={`/system/dashboard/leads/${lead._id}/edit`}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-300'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;

