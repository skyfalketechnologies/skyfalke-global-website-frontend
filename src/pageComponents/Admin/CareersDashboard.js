'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiGet } from '../../utils/api';
import { adminApiGet } from '../../utils/adminApi';
import { 
  FaBriefcase,
  FaUsers,
  FaEye,
  FaFileAlt,
  FaChartBar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowRight,
  FaPlus,
  FaExternalLinkAlt
} from 'react-icons/fa';

const CareersDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    recentApplications: 0,
    topCategories: [],
    applicationsByMonth: []
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await adminApiGet('/api/jobs/stats/overview');
      const applicationsResponse = await adminApiGet('/api/applications/stats');
      
      // Fetch recent jobs
      const jobsResponse = await adminApiGet('/api/jobs?limit=5&sortBy=postedDate&sortOrder=desc');
      
      // Fetch recent applications
      const recentAppsResponse = await adminApiGet('/api/applications/admin?limit=5&sortBy=createdAt&sortOrder=desc');
      
      // Handle jobs stats response
      if (statsResponse.success && statsResponse.data) {
        const overview = statsResponse.data.overview || statsResponse.data;
        setStats(prev => ({
          ...prev,
          totalJobs: overview.totalJobs || 0,
          activeJobs: overview.activeJobs || 0,
          topCategories: overview.topCategories || statsResponse.data.categoryStats?.map(cat => ({ 
            category: cat._id, 
            count: cat.count 
          })) || []
        }));
      }
      
      // Handle applications stats response
      if (applicationsResponse.success && applicationsResponse.data) {
        const appData = applicationsResponse.data.data || applicationsResponse.data;
        setStats(prev => ({
          ...prev,
          totalApplications: appData.total || 0,
          pendingApplications: appData.pending || 0,
          recentApplications: appData.recent || 0,
          applicationsByMonth: appData.byMonth || []
        }));
      }
      
      // Handle recent jobs response
      if (jobsResponse.success && jobsResponse.data) {
        const jobsData = jobsResponse.data.data || jobsResponse.data;
        setRecentJobs(jobsData.jobs || jobsData || []);
      }
      
      // Handle recent applications response
      if (recentAppsResponse.success && recentAppsResponse.data) {
        const appsData = recentAppsResponse.data.data?.applications || recentAppsResponse.data.data || recentAppsResponse.data.applications || [];
        setRecentApplications(Array.isArray(appsData) ? appsData : []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Reviewed': return 'text-blue-600 bg-blue-100';
      case 'Shortlisted': return 'text-green-600 bg-green-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      case 'Hired': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Careers Dashboard - Admin | Skyfalke</title>
        <meta name="description" content="Careers management dashboard" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Careers Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Overview of jobs, applications, and recruitment metrics
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <Link href="/system/dashboard/jobs"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaBriefcase className="mr-2 h-4 w-4" />
              Manage Jobs
            </Link>
            <Link href="/system/dashboard/applications"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaUsers className="mr-2 h-4 w-4" />
              View Applications
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaBriefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Jobs
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.totalJobs.toLocaleString()}
                    </dd>
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
                  <FaEye className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Jobs
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.activeJobs.toLocaleString()}
                    </dd>
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
                  <FaUsers className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Applications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.totalApplications.toLocaleString()}
                    </dd>
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
                  <FaClock className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Pending Applications
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.pendingApplications.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Recent Job Postings
                </h3>
                <Link href="/system/dashboard/jobs"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>
              
              {recentJobs.length === 0 ? (
                <div className="text-center py-8">
                  <FaBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs posted</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by creating a new job posting.
                  </p>
                  <div className="mt-6">
                    <Link href="/system/dashboard/jobs"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Add Job
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </h4>
                        <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {job.location}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(job.category)}`}>
                            {job.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(job.postedDate)}
                        </span>
                        <Link href={`/system/dashboard/jobs/${job._id}`}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          <FaExternalLinkAlt className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Recent Applications
                </h3>
                <Link href="/system/dashboard/applications"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>
              
              {recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Applications will appear here once candidates start applying.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {application.applicant.firstName} {application.applicant.lastName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {application.jobTitle}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(application.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Link href={`/system/dashboard/applications/${application._id}`}
                        className="text-primary-600 hover:text-primary-500"
                      >
                        <FaExternalLinkAlt className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/system/dashboard/jobs/new"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaPlus className="h-8 w-8 text-primary-600 mr-4" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Post New Job</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create a new job posting</p>
                </div>
              </Link>
              
              <Link href="/system/dashboard/applications"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaFileAlt className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Review Applications</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View and manage applications</p>
                </div>
              </Link>
              
              <Link href="/system/dashboard/jobs"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaChartBar className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Job Analytics</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View detailed job statistics</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CareersDashboard;
