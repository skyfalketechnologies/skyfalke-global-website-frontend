'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../utils/api';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaCalendarAlt,
  FaBuilding,
  FaIndustry,
  FaCog,
  FaChartBar,
  FaEyeSlash,
  FaArchive,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCaseStudies, setTotalCaseStudies] = useState(0);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, caseStudy: null });

  useEffect(() => {
    fetchCaseStudies();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await apiGet(`/api/case-studies/admin/all?${params}`);
      
      if (response.data.success) {
        setCaseStudies(response.data.data.caseStudies);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalCaseStudies(response.data.data.pagination.totalCaseStudies);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
      if (error.response?.status === 503) {
        setError('Service temporarily unavailable. Please try again later.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to fetch case studies');
      }
      setCaseStudies([]);
      setTotalPages(1);
      setTotalCaseStudies(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiGet('/api/case-studies/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats on error to prevent UI issues
      if (error.response?.status === 503 || error.response?.status >= 500) {
        setStats({
          total: 0,
          published: 0,
          draft: 0,
          featured: 0
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.caseStudy) return;

    try {
              await apiDelete(`/api/case-studies/admin/${deleteModal.caseStudy._id}`);
      setDeleteModal({ show: false, caseStudy: null });
      fetchCaseStudies();
      fetchStats();
    } catch (error) {
      console.error('Error deleting case study:', error);
      alert('Failed to delete case study');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: { text: 'Published', color: 'text-green-600', bg: 'bg-green-100', icon: FaCheckCircle },
      draft: { text: 'Draft', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: FaEyeSlash },
      archived: { text: 'Archived', color: 'text-gray-600', bg: 'bg-gray-100', icon: FaArchive }
    };
    return badges[status] || badges.draft;
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="text-primary-500" /> : <FaSortDown className="text-primary-500" />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Case Studies Management - Admin Dashboard</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Case Studies Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and organize your case studies
            </p>
          </div>
          
          <Link href="/system/dashboard/case-studies/new"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors mt-4 sm:mt-0"
          >
            <FaPlus />
            Add New Case Study
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
              </div>
              <FaChartBar className="text-primary-600 text-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published || 0}</p>
              </div>
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft || 0}</p>
              </div>
              <FaEyeSlash className="text-yellow-600 text-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Featured</p>
                <p className="text-2xl font-bold text-primary-600">{stats.featured || 0}</p>
              </div>
              <FaStar className="text-primary-600 text-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived || 0}</p>
              </div>
              <FaArchive className="text-gray-600 text-xl" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
                <option value="publishedAt-desc">Published: Newest</option>
                <option value="publishedAt-asc">Published: Oldest</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <FaTimes className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Case Studies Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
              <span className="ml-3 text-gray-600">Loading case studies...</span>
            </div>
          ) : caseStudies.length === 0 ? (
            <div className="text-center py-12">
              <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No case studies found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter ? 'Try adjusting your filters.' : 'Get started by creating your first case study.'}
              </p>
              {!searchTerm && !statusFilter && (
                <Link href="/system/dashboard/case-studies/new"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaPlus />
                  Add New Case Study
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Case Study
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Services
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
                    {caseStudies.map((caseStudy) => {
                      const statusBadge = getStatusBadge(caseStudy.status);
                      const StatusIcon = statusBadge.icon;
                      
                      return (
                        <tr key={caseStudy._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={caseStudy.images.find(img => img.isPrimary)?.url || caseStudy.images[0]?.url || '/images/hero/business_tools.webp'}
                                alt={caseStudy.title}
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {caseStudy.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {caseStudy.summary}
                                </div>
                                {caseStudy.featured && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <FaStar className="text-yellow-500 text-xs" />
                                    <span className="text-xs text-yellow-600 dark:text-yellow-400">Featured</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {caseStudy.client.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {caseStudy.client.industry}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusBadge.bg} ${statusBadge.color}`}>
                              <StatusIcon className="text-xs" />
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {caseStudy.services.slice(0, 2).map((service) => (
                                <span
                                  key={service}
                                  className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                                >
                                  {service}
                                </span>
                              ))}
                              {caseStudy.services.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{caseStudy.services.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt className="text-xs" />
                              {new Date(caseStudy.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/case-studies/${caseStudy.slug}`}
                                target="_blank"
                                className="text-primary-600 hover:text-primary-700 p-1"
                                title="View"
                              >
                                <FaEye />
                              </Link>
                              <Link href={`/system/dashboard/case-studies/edit/${caseStudy._id}`}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="Edit"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => setDeleteModal({ show: true, caseStudy })}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalCaseStudies)} of {totalCaseStudies} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-1 border rounded ${
                            currentPage === index + 1
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Case Study
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{deleteModal.caseStudy?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, caseStudy: null })}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudies;
