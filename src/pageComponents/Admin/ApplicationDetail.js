'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaFileAlt,
  FaDownload,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaUserGraduate,
  FaBuilding,
  FaMoneyBillWave
} from 'react-icons/fa';
import { adminApiGet, adminApiPatch, adminApiDelete, handleAdminApiError } from '../../utils/adminApi';

const ApplicationDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewer, setInterviewer] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminApiGet(`/api/applications/${id}`);
      
      // Handle both response formats (with or without success wrapper)
      const applicationData = response.success ? response.data : (response.data || response);
      
      if (applicationData) {
        setApplication(applicationData);
        setStatus(applicationData.status || 'Pending');
        setNotes(applicationData.notes?.map(n => n.content).join('\n') || '');
        if (applicationData.interviewSchedule) {
          setInterviewDate(applicationData.interviewSchedule.scheduledDate ? new Date(applicationData.interviewSchedule.scheduledDate).toISOString().split('T')[0] : '');
          setInterviewType(applicationData.interviewSchedule.interviewType || '');
          setInterviewer(applicationData.interviewSchedule.interviewer || '');
        }
      } else {
        setError('Application not found');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to fetch application');
      setError(errorMessage);
      if (error.response?.status === 404) {
        setTimeout(() => router.push('/system/dashboard/applications'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      setError('');
      const response = await adminApiPatch(`/api/applications/admin/${id}`, {
        status: newStatus
      });

      if (response.success) {
        setStatus(newStatus);
        setApplication(prev => ({ ...prev, status: newStatus }));
        setSuccess('Status updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to update status');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to update status');
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!notes.trim()) return;

    try {
      setUpdating(true);
      setError('');
      const currentNotes = application.notes || [];
      const response = await adminApiPatch(`/api/applications/admin/${id}`, {
        notes: [...currentNotes, {
          content: notes.trim(),
          author: 'Admin',
          createdAt: new Date()
        }]
      });

      if (response.success) {
        setSuccess('Note added successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchApplication();
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to add note');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error adding note:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to add note');
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewType) {
      setError('Please fill in interview date and type');
      return;
    }

    try {
      setUpdating(true);
      setError('');
      const response = await adminApiPatch(`/api/applications/admin/${id}`, {
        interviewSchedule: {
          scheduledDate: new Date(interviewDate),
          interviewType,
          interviewer,
          notes: notes
        },
        status: 'Interview Scheduled'
      });

      if (response.success) {
        setStatus('Interview Scheduled');
        setApplication(prev => ({ ...prev, status: 'Interview Scheduled', interviewSchedule: response.data.interviewSchedule }));
        setSuccess('Interview scheduled successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchApplication();
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to schedule interview');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to schedule interview');
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setUpdating(true);
      setError('');
      const response = await adminApiDelete(`/api/applications/admin/${id}`);

      if (response.success) {
        router.push('/system/dashboard/applications');
      } else {
        const errorMessage = handleAdminApiError(response.error, 'Failed to delete application');
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      const errorMessage = handleAdminApiError(error, 'Failed to delete application');
      setError(errorMessage);
    } finally {
      setUpdating(false);
      setShowDeleteModal(false);
    }
  };

  const downloadResume = async () => {
    try {
      const response = await adminApiGet(`/api/applications/admin/${id}/resume`, {
        responseType: 'blob'
      });
      
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume_${application.applicant.firstName}_${application.applicant.lastName}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shortlisted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Hired': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Application not found</h3>
        <p className="mt-1 text-sm text-gray-500">Redirecting to applications list...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Application Details - {application.applicant?.firstName} {application.applicant?.lastName} | Admin | Skyfalke</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/system/dashboard/applications"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Application Details
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {application.applicant?.firstName} {application.applicant?.lastName} - {application.jobId?.title || 'Position'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadResume}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <FaDownload className="mr-2 h-4 w-4" />
              Download Resume
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`border rounded-lg p-4 ${getStatusColor(application.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold">Status:</span>
              <span className="px-3 py-1 rounded-full border font-medium">
                {application.status}
              </span>
            </div>
            <select
              value={status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              disabled={updating}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <FaCheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaUser className="mr-2 text-primary-600" />
                Applicant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {application.applicant?.firstName} {application.applicant?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">
                    <a href={`mailto:${application.applicant?.email}`} className="text-primary-600 hover:text-primary-700">
                      {application.applicant?.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                  <p className="text-gray-900 dark:text-white">
                    <a href={`tel:${application.applicant?.phone}`} className="text-primary-600 hover:text-primary-700">
                      {application.applicant?.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                  <p className="text-gray-900 dark:text-white flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" />
                    {application.applicant?.location?.city}, {application.applicant?.location?.country}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              {(application.applicant?.linkedin || application.applicant?.portfolio || application.applicant?.github) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 block">Social Links</label>
                  <div className="flex flex-wrap gap-3">
                    {application.applicant?.linkedin && (
                      <a
                        href={application.applicant.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                      >
                        <FaLinkedin className="mr-2" />
                        LinkedIn
                      </a>
                    )}
                    {application.applicant?.portfolio && (
                      <a
                        href={application.applicant.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <FaGlobe className="mr-2" />
                        Portfolio
                      </a>
                    )}
                    {application.applicant?.github && (
                      <a
                        href={application.applicant.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                      >
                        <FaGithub className="mr-2" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-primary-600" />
                Professional Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Years of Experience</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {application.experience?.yearsOfExperience || 0} years
                  </p>
                </div>
                {application.experience?.currentCompany && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Company</label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <FaBuilding className="mr-1 text-gray-400" />
                      {application.experience.currentCompany}
                    </p>
                  </div>
                )}
                {application.experience?.currentPosition && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Position</label>
                    <p className="text-gray-900 dark:text-white">{application.experience.currentPosition}</p>
                  </div>
                )}
                {application.experience?.expectedSalary && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Salary</label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <FaMoneyBillWave className="mr-1 text-gray-400" />
                      {application.experience.expectedSalary.amount?.toLocaleString()} {application.experience.expectedSalary.currency}/{application.experience.expectedSalary.period}
                    </p>
                  </div>
                )}
                {application.experience?.noticePeriod && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notice Period</label>
                    <p className="text-gray-900 dark:text-white">{application.experience.noticePeriod}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Education */}
            {application.education && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FaGraduationCap className="mr-2 text-primary-600" />
                  Education
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Degree</label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {application.education.highestDegree} in {application.education.fieldOfStudy}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Institution</label>
                    <p className="text-gray-900 dark:text-white">{application.education.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Graduation Year</label>
                    <p className="text-gray-900 dark:text-white">{application.education.graduationYear}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Skills */}
            {application.skills && application.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FaStar className="mr-2 text-primary-600" />
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
                    >
                      {skill.name} {skill.level && `(${skill.level})`}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Cover Letter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaFileAlt className="mr-2 text-primary-600" />
                Cover Letter
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {application.jobId?.title || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied Date</label>
                  <p className="text-gray-900 dark:text-white flex items-center">
                    <FaCalendarAlt className="mr-1 text-gray-400" />
                    {formatDate(application.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</label>
                  <p className="text-gray-900 dark:text-white">{application.source || 'Website'}</p>
                </div>
                {application.isRemote && (
                  <div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Remote Work Preferred
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Interview Schedule */}
            {application.interviewSchedule && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interview Schedule</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</label>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(application.interviewSchedule.scheduledDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                    <p className="text-gray-900 dark:text-white">{application.interviewSchedule.interviewType}</p>
                  </div>
                  {application.interviewSchedule.interviewer && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Interviewer</label>
                      <p className="text-gray-900 dark:text-white">{application.interviewSchedule.interviewer}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Schedule Interview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule Interview</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interview Type
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="Phone">Phone</option>
                    <option value="Video">Video</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interviewer
                  </label>
                  <input
                    type="text"
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    placeholder="Interviewer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleScheduleInterview}
                  disabled={updating || !interviewDate || !interviewType}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <FaCalendarAlt className="mr-2" />
                      Schedule Interview
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
              {application.notes && application.notes.length > 0 && (
                <div className="space-y-3 mb-4">
                  {application.notes.map((note, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {note.author} - {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note about this application..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={handleAddNote}
                  disabled={updating || !notes.trim()}
                  className="mt-2 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-2" />
                      Add Note
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                  Are you sure you want to delete the application for <strong>{application.applicant?.firstName} {application.applicant?.lastName}</strong>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationDetail;

