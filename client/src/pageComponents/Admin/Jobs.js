'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { fetchJobsData, fetchJobsStats, adminApiDelete, adminApiPatch, handleAdminApiError } from '../../utils/adminApi';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaSearch,
  FaFilter,
  FaChartBar,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaExternalLinkAlt
} from 'react-icons/fa';
import Link from 'next/link';

const Jobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [actionLoading, setActionLoading] = useState({});

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Sales', 'Operations', 'Management'];
  const statuses = ['All', 'Active', 'Inactive'];

  useEffect(() => {
    fetchJobs();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedCategory, selectedStatus]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(selectedStatus !== 'All' && { isActive: selectedStatus === 'Active' })
      };

      const response = await fetchJobsData(params);
      
      // Handle different response structures
      if (response.success && response.data) {
        // Try different possible response structures
        const jobsData = response.data.data || response.data;
        const jobs = jobsData.jobs || jobsData.data || (Array.isArray(jobsData) ? jobsData : []);
        const pagination = jobsData.pagination || response.data.pagination;
        
        setJobs(jobs);
        setTotalPages(pagination?.totalPages || pagination?.pages || 1);
        setTotalJobs(pagination?.totalJobs || pagination?.total || jobs.length || 0);
      } else {
        console.warn('Jobs API returned fallback data:', response);
        setJobs([]);
        setTotalPages(1);
        setTotalJobs(0);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to fetch jobs');
      console.warn('Using fallback data due to API error:', errorMessage);
      setJobs([]);
      setTotalPages(1);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetchJobsStats();
      
      if (response.success && response.data) {
        // Handle different response structures
        const statsData = response.data.overview || response.data.data || response.data;
        setStats({
          total: statsData.total || statsData.totalJobs || 0,
          active: statsData.active || statsData.activeJobs || 0,
          inactive: statsData.inactive || statsData.inactiveJobs || 0,
          applications: statsData.applications || statsData.totalApplications || 0
        });
      } else {
        console.warn('Jobs stats API returned fallback data');
        setStats({
          total: 0,
          active: 0,
          inactive: 0,
          applications: 0
        });
      }
    } catch (error) {
      console.warn('Error fetching stats:', error);
      // Don't set error state for stats - it's not critical
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        applications: 0
      });
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        setActionLoading(prev => ({ ...prev, [jobId]: true }));
        const response = await adminApiDelete(`/api/jobs/${jobId}`);
        
        if (response.success) {
          fetchJobs();
          fetchStats();
        } else {
          const errorMessage = handleAdminApiError(response.error, 'Failed to delete job');
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        const errorMessage = handleAdminApiError(error, 'Failed to delete job');
        alert(errorMessage);
      } finally {
        setActionLoading(prev => ({ ...prev, [jobId]: false }));
      }
    }
  };

  const handleToggleStatus = async (jobId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`toggle-${jobId}`]: true }));
      const response = await adminApiPatch(`/api/jobs/${jobId}/status`, {});
      
      if (response.success) {
        fetchJobs();
        fetchStats();
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to toggle job status');
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error toggling job status:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to toggle job status');
      alert(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, [`toggle-${jobId}`]: false }));
    }
  };

  const handleEdit = (jobId) => {
    router.push(`/system/dashboard/jobs/${jobId}/edit`);
  };

  const handleView = (jobId) => {
    window.open(`/jobs/${jobId}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Development': 'bg-blue-100 text-blue-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Sales': 'bg-yellow-100 text-yellow-800',
      'Operations': 'bg-gray-100 text-gray-800',
      'Management': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Helmet>
        <title>Job Management - Admin Dashboard</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600">Manage job postings and applications</p>
          </div>
          <Link href="/system/dashboard/jobs/new"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add New Job</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalJobs || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FaBriefcase className="text-primary-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeJobs || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaEye className="text-green-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalViews || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-blue-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Views</p>
                <p className="text-3xl font-bold text-purple-600">{Math.round(stats.avgViews || 0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FaEye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job, index) => (
                    <motion.tr
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(job.category)}`}>
                          {job.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaMapMarkerAlt className="mr-1 text-gray-400" />
                          {job.location}
                          {job.isRemote && <span className="ml-1 text-xs text-blue-600">(Remote)</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.isActive)}`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(job.postedDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.views || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(job._id)}
                            title="View job details"
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={actionLoading[job._id]}
                          >
                            <FaExternalLinkAlt size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(job._id)}
                            title="Edit job"
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={actionLoading[job._id]}
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(job._id)}
                            title={job.isActive ? 'Deactivate job' : 'Activate job'}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={actionLoading[`toggle-${job._id}`]}
                          >
                            {actionLoading[`toggle-${job._id}`] ? (
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-green-600"></div>
                            ) : job.isActive ? (
                              <FaEyeSlash size={14} />
                            ) : (
                              <FaEye size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            title="Delete job"
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={actionLoading[job._id]}
                          >
                            {actionLoading[job._id] ? (
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600"></div>
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;
