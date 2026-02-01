'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchApplicationsData, fetchApplicationsStats, adminApiPatch, adminApiDelete, adminApiGet, handleAdminApiError } from '../../utils/adminApi';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaCheck,
  FaTimes,
  FaClock,
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaFileAlt,
  FaStar,
  FaTrash,
  FaEdit,
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaUserGraduate,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaExternalLinkAlt
} from 'react-icons/fa';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedJob, setSelectedJob] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    shortlisted: 0,
    interviewScheduled: 0,
    rejected: 0,
    hired: 0
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const statuses = ['All', 'Pending', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'];

  useEffect(() => {
    fetchApplications();
    fetchJobs();
    fetchStats();
  }, [currentPage, searchTerm, selectedStatus, selectedJob, sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedJob !== 'All') params.jobId = selectedJob;

      const response = await fetchApplicationsData(params);
      
      // Handle both response formats (with or without success wrapper)
      const responseData = response.success ? response.data : (response.data || response);
      
      if (responseData && (responseData.applications || responseData.data?.applications)) {
        const applicationsList = responseData.applications || responseData.data?.applications || [];
        const paginationData = responseData.pagination || responseData.data?.pagination || {};
        
        // Transform applications to include jobTitle from populated jobId
        const transformedApplications = applicationsList.map(app => ({
          ...app,
          jobTitle: app.jobId?.title || app.jobTitle || 'N/A',
          jobCategory: app.jobId?.category || app.jobCategory || '',
          jobLocation: app.jobId?.location || app.jobLocation || ''
        }));
        
        setApplications(transformedApplications);
        setTotalPages(paginationData.totalPages || 1);
        setTotalApplications(paginationData.totalApplications || 0);
      } else {
        console.warn('Applications API returned fallback data or empty response');
        setApplications([]);
        setTotalPages(1);
        setTotalApplications(0);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to fetch applications');
      setError(errorMessage);
      setApplications([]);
      setTotalPages(1);
      setTotalApplications(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await adminApiGet('/api/jobs?limit=100');
      if (response.success && response.data && response.data.jobs) {
        setJobs(response.data.jobs);
      } else {
        console.warn('Jobs API returned fallback data');
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to fetch jobs');
      console.warn('Using fallback data due to API error:', errorMessage);
      setJobs([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetchApplicationsStats();
      // Handle both response formats
      const statsData = response.success ? response.data : (response.data || response);
      
      if (statsData) {
        // Handle overview response format
        const overview = statsData.overview || statsData;
        setStats({
          total: overview.total || overview.totalApplications || 0,
          pending: overview.pending || overview.pendingApplications || 0,
          underReview: overview.underReview || overview.underReviewApplications || overview.reviewed || 0,
          shortlisted: overview.shortlisted || overview.shortlistedApplications || 0,
          interviewScheduled: overview.interviewScheduled || overview.interviewApplications || 0,
          rejected: overview.rejected || overview.rejectedApplications || 0,
          hired: overview.hired || overview.hiredApplications || 0
        });
      } else {
        console.warn('Applications stats API returned fallback data');
        setStats({
          total: 0,
          pending: 0,
          underReview: 0,
          shortlisted: 0,
          interviewScheduled: 0,
          rejected: 0,
          hired: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to fetch statistics');
      console.warn('Using fallback stats due to API error:', errorMessage);
      setStats({
        total: 0,
        pending: 0,
        underReview: 0,
        shortlisted: 0,
        interviewScheduled: 0,
        rejected: 0,
        hired: 0
      });
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setActionLoading(true);
      const response = await adminApiPatch(`/api/applications/admin/${applicationId}`, {
        status: newStatus
      });

      if (response.success) {
        fetchApplications();
        fetchStats();
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to update application status');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to update application status');
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const scheduleInterview = async (applicationId, interviewDate, interviewType, interviewer, notes) => {
    try {
      setActionLoading(true);
      const response = await adminApiPatch(`/api/applications/admin/${applicationId}`, {
        interviewSchedule: {
          scheduledDate: interviewDate,
          interviewType,
          interviewer,
          notes
        },
                status: 'Shortlisted'
      });

      if (response.success) {
        fetchApplications();
        fetchStats();
        setShowModal(false);
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to schedule interview');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to schedule interview');
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const addNote = async (applicationId, note) => {
    try {
      const response = await adminApiPatch(`/api/applications/admin/${applicationId}`, {
        notes: note
      });

      if (response.success) {
        fetchApplications();
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to add note');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error adding note:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to add note');
      setError(errorMessage);
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      setActionLoading(true);
      const response = await adminApiDelete(`/api/applications/admin/${applicationId}`);

      if (response.success) {
        setShowDeleteModal(false);
        setSelectedApplication(null);
        fetchApplications();
        fetchStats();
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to delete application');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to delete application');
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadResume = async (applicationId) => {
    try {
      const response = await adminApiGet(`/api/applications/admin/${applicationId}/resume`, {
        responseType: 'blob'
      });
      
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume_${applicationId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to download resume');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to download resume');
      setError(errorMessage);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shortlisted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Hired': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}/${salary.period}`;
    } else if (salary.min) {
      return `From ${salary.min.toLocaleString()} ${salary.currency}/${salary.period}`;
    } else if (salary.max) {
      return `Up to ${salary.max.toLocaleString()} ${salary.currency}/${salary.period}`;
    }
    
    return 'Not specified';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedJob('All');
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Job Applications - Admin | Skyfalke</title>
        <meta name="description" content="Manage and review job applications from candidates" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Applications</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and review job applications from candidates
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => { fetchApplications(); fetchStats(); }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaClock className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500', icon: FaUser },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500', icon: FaClock },
            { label: 'Under Review', value: stats.underReview, color: 'bg-blue-500', icon: FaEye },
            { label: 'Shortlisted', value: stats.shortlisted, color: 'bg-green-500', icon: FaCheckCircle },
            { label: 'Interview', value: stats.interviewScheduled, color: 'bg-purple-500', icon: FaCalendarAlt },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', icon: FaTimesCircle },
            { label: 'Hired', value: stats.hired, color: 'bg-emerald-500', icon: FaStar }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="text-white text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{stat.value || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{stat.label}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Jobs</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {totalApplications} application{totalApplications !== 1 ? 's' : ''} found
              </span>
              {(searchTerm || selectedStatus !== 'All' || selectedJob !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
          {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
                <span className="ml-3 text-gray-600">Loading applications...</span>
            </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedStatus !== 'All' || selectedJob !== 'All' ? 'Try adjusting your filters.' : 'Applications will appear here once candidates start applying.'}
                </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('applicant.firstName')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <span>Applicant</span>
                          {getSortIcon('applicant.firstName')}
                        </button>
                    </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('jobTitle')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <span>Position</span>
                          {getSortIcon('jobTitle')}
                        </button>
                    </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <span>Status</span>
                          {getSortIcon('status')}
                        </button>
                    </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <span>Applied</span>
                          {getSortIcon('createdAt')}
                        </button>
                    </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Experience
                    </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {applications.map((application, index) => (
                    <motion.tr
                        key={application._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-primary-600" />
                          </div>
                          <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {application.applicant.firstName} {application.applicant.lastName}
                            </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{application.applicant.email}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                                {application.applicant.location.city}, {application.applicant.location.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{application.jobTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(application.createdAt)}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {application.experience.yearsOfExperience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/system/dashboard/applications/${application._id}`}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            title="View Details"
                          >
                              <FaEye className="h-4 w-4" />
                          </Link>
                          <button
                              onClick={() => downloadResume(application._id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Download Resume"
                            >
                              <FaDownload className="h-4 w-4" />
                          </button>
                            <select
                              value={application.status}
                              onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                              disabled={actionLoading}
                              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview Scheduled">Interview Scheduled</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Hired">Hired</option>
                            </select>
                          <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                              <FaTrash className="h-4 w-4" />
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
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
              <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 20, totalApplications)}
                    </span>{' '}
                    of <span className="font-medium">{totalApplications}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
          </div>
        )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Application Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
            </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Applicant Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applicant Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.applicant.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone:</span>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.applicant.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location:</span>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.applicant.location.city}, {selectedApplication.applicant.location.country}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience:</span>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.experience.yearsOfExperience} years</p>
                    </div>
                    {selectedApplication.experience.currentCompany && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Company:</span>
                        <p className="text-gray-900 dark:text-white">{selectedApplication.experience.currentCompany}</p>
                    </div>
                    )}
                    {selectedApplication.experience.expectedSalary && (
                    <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Salary:</span>
                        <p className="text-gray-900 dark:text-white">{formatSalary(selectedApplication.experience.expectedSalary)}</p>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(selectedApplication.applicant.linkedin || selectedApplication.applicant.portfolio || selectedApplication.applicant.github) && (
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Social Links</h5>
                      <div className="space-y-2">
                        {selectedApplication.applicant.linkedin && (
                          <a
                            href={selectedApplication.applicant.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700"
                          >
                            <FaLinkedin className="mr-2" />
                            LinkedIn Profile
                          </a>
                        )}
                        {selectedApplication.applicant.portfolio && (
                          <a
                            href={selectedApplication.applicant.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-green-600 hover:text-green-700"
                          >
                            <FaGlobe className="mr-2" />
                            Portfolio
                          </a>
                        )}
                        {selectedApplication.applicant.github && (
                          <a
                            href={selectedApplication.applicant.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-700"
                          >
                            <FaGithub className="mr-2" />
                            GitHub
                          </a>
                        )}
                    </div>
                  </div>
                  )}
                </div>

                {/* Application Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Position:</span>
                      <p className="text-gray-900 dark:text-white">{selectedApplication.jobTitle}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied:</span>
                      <p className="text-gray-900 dark:text-white">{formatDate(selectedApplication.createdAt)}</p>
                    </div>
                    {selectedApplication.interviewSchedule && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Interview:</span>
                        <p className="text-gray-900 dark:text-white">{formatDate(selectedApplication.interviewSchedule.scheduledDate)}</p>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                  <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs"
                        >
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Education */}
                  {selectedApplication.education && (
                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Education:</h5>
                      <div className="space-y-2">
                        <p className="text-gray-900 dark:text-white">
                          {selectedApplication.education.highestDegree} in {selectedApplication.education.fieldOfStudy}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedApplication.education.institution} ({selectedApplication.education.graduationYear})
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cover Letter</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h4>
                <textarea
                  value={selectedApplication.notes || ''}
                  onChange={(e) => addNote(selectedApplication._id, e.target.value)}
                  placeholder="Add notes about this application..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                  <button
                  onClick={() => downloadResume(selectedApplication._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                  Download Resume
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delete Application</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete the application for <strong>{selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}</strong>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteApplication(selectedApplication._id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? <FaSpinner className="animate-spin h-4 w-4" /> : 'Delete'}
                </button>
              </div>
              </div>
            </div>
        </div>
      )}
    </>
  );
};

export default AdminApplications;


