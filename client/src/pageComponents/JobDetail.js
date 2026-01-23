'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiGet, apiPost } from '../utils/api';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaClock, 
  FaBriefcase, 
  FaUsers, 
  FaStar,
  FaExternalLinkAlt,
  FaSpinner,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaGraduationCap,
  FaCheckCircle,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

const JobDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  // Track job view with session storage to prevent duplicate counts
  const trackJobView = async (jobId) => {
    try {
      // Check if this job has already been viewed in this session
      const viewedJobs = JSON.parse(sessionStorage.getItem('viewedJobs') || '[]');
      
      if (viewedJobs.includes(jobId)) {
        console.log('Job already viewed in this session, not counting view');
        return;
      }

      // Generate a session ID for this browser session
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }

      // Call the server to track the view
      const response = await apiPost(`/api/jobs/${jobId}/view`, {}, {
        headers: {
          'X-Session-ID': sessionId
        }
      });

      if (response.data.viewCounted) {
        // Add to viewed jobs list
        viewedJobs.push(jobId);
        sessionStorage.setItem('viewedJobs', JSON.stringify(viewedJobs));
        console.log('Job view counted successfully');
        
        // Update the job's view count in state
        setJob(prev => prev ? { ...prev, views: response.data.views } : prev);
      } else {
        console.log('Job view not counted (already viewed recently)');
      }
    } catch (error) {
      console.error('Error tracking job view:', error);
      // Don't fail the page load if view tracking fails
    }
  };

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiGet(`/api/jobs/${id}`);
      
      if (response.data) {
        setJob(response.data);
        fetchRelatedJobs(response.data.category, response.data._id);
        
        // Track the view after a short delay to ensure page is loaded
        setTimeout(() => {
          trackJobView(response.data._id);
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedJobs = async (category, currentJobId) => {
    try {
      const response = await apiGet(`/api/jobs?category=${category}&limit=3`);
      if (response.data && response.data.jobs) {
        const filteredJobs = response.data.jobs.filter(job => job._id !== currentJobId);
        setRelatedJobs(filteredJobs.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related jobs:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Competitive';
    
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}/${salary.period}`;
    } else if (salary.min) {
      return `From ${salary.min.toLocaleString()} ${salary.currency}/${salary.period}`;
    } else if (salary.max) {
      return `Up to ${salary.max.toLocaleString()} ${salary.currency}/${salary.period}`;
    }
    
    return 'Competitive';
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

  const getTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-green-100 text-green-800',
      'Part-time': 'bg-blue-100 text-blue-800',
      'Contract': 'bg-orange-100 text-orange-800',
      'Internship': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Job Not Found</h2>
            <p className="text-red-600 mb-4">{error || 'The job you are looking for does not exist or has been removed.'}</p>
          <Link href="/careers"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
              Browse All Jobs
          </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{job.title} - Careers | Skyfalke</title>
        <meta name="description" content={job.description ? job.description.substring(0, 160) : 'Job description'} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary-600 text-white pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
          <nav className="flex items-center space-x-2 text-sm text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            <span>/</span>
            <span className="text-white font-medium">{job.title}</span>
          </nav>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 pt-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Job Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {job.title}
              </h1>

              {/* Job Meta Information */}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6 text-white/90">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-secondary-400" />
                  <span>{job.location}</span>
                  {job.isRemote && (
                    <span className="ml-2 text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                      Remote
                    </span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <FaBriefcase className="mr-2 text-secondary-400" />
                  <span>{job.type}</span>
                </div>
                
                <div className="flex items-center">
                  <FaClock className="mr-2 text-secondary-400" />
                  <span>Posted {formatDate(job.postedDate)}</span>
                </div>

                {job.salary && (
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-secondary-400" />
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-white/20 text-white border border-white/30">
                  {job.category}
                </span>
                <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-white/20 text-white border border-white/30">
                  {job.type}
                </span>
                {job.department && (
                  <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-white/20 text-white border border-white/30">
                    {job.department}
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <button
                  onClick={() => router.push(`/careers/${job._id}/apply`)}
                  className="inline-flex items-center justify-center bg-secondary-500 hover:bg-secondary-600 text-dark-blue px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2 focus:ring-offset-primary-600"
                  aria-label="Apply for this position"
                >
                  <FaBriefcase className="mr-2" />
                  Apply for this Position
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Content */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-soft p-6 md:p-8"
                >
                  {/* Job Overview */}
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Job Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-primary-600 mr-3 text-xl" />
                        <div>
                          <p className="text-sm text-gray-600">Salary</p>
                          <p className="font-semibold text-gray-900">{formatSalary(job.salary)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FaGraduationCap className="text-primary-600 mr-3 text-xl" />
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="font-semibold text-gray-900">{job.experience}</p>
                        </div>
                      </div>
                      
                      {job.deadline && (
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-primary-600 mr-3 text-xl" />
                          <div>
                            <p className="text-sm text-gray-600">Application Deadline</p>
                            <p className="font-semibold text-gray-900">{formatDate(job.deadline)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-strong:text-gray-900">
                      {job.description ? (
                        <div 
                          className="rich-text-content leading-relaxed text-gray-700"
                          dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                      ) : (
                        <p className="text-gray-600">No description available.</p>
                      )}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                      <ul className="space-y-2 md:space-y-3">
                        {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                            <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  )}

                  {/* Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                      <ul className="space-y-2 md:space-y-3">
                        {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                            <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  )}

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                      <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                  )}

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                      <ul className="space-y-2 md:space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                            <FaStar className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                  )}
              </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-4 md:space-y-6"
                >
                  {/* Company Info */}
                  <div className="bg-white rounded-xl shadow-soft p-5 md:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">About Skyfalke</h3>
                    <p className="text-gray-600 mb-4">
                      {job.companyInfo?.description || 'Leading Digital Marketing & Technology Solutions in Africa'}
                    </p>
                    <div className="space-y-2">
                      {job.contactInfo?.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaEnvelope className="mr-2" />
                          <a href={`mailto:${job.contactInfo.email}`} className="hover:text-primary-600">
                            {job.contactInfo.email}
                          </a>
                        </div>
                      )}
                      {job.contactInfo?.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaPhone className="mr-2" />
                          <a href={`tel:${job.contactInfo.phone}`} className="hover:text-primary-600">
                            {job.contactInfo.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Apply */}
                  <div className="bg-primary-50 rounded-xl p-5 md:p-6 border border-primary-200">
                    <h3 className="text-lg font-bold text-primary-900 mb-3 md:mb-4">Ready to Apply?</h3>
                    <p className="text-primary-700 mb-4 text-sm md:text-base">
                      Join our team and be part of something amazing!
                    </p>
                    <button
                      onClick={() => router.push(`/careers/${job._id}/apply`)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 md:py-3.5 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 flex items-center justify-center"
                      aria-label="Apply now for this position"
                    >
                      <FaBriefcase className="mr-2" />
                      Apply Now
                    </button>
                  </div>

                  {/* Share Job */}
                  <div className="bg-white rounded-xl shadow-soft p-5 md:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Job</h3>
                    <div className="flex space-x-3">
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors duration-200"
                      >
                        <FaLinkedin className="inline mr-2" />
                        LinkedIn
                      </a>
                      <button
                        onClick={() => navigator.share ? navigator.share({ title: job.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <FaGlobe className="inline mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 md:mt-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {relatedJobs.map((relatedJob) => (
                    <div key={relatedJob._id} className="bg-white rounded-xl shadow-soft p-5 md:p-6 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                        <Link href={`/careers/${relatedJob._id}`} className="hover:text-primary-600 transition-colors">
                          {relatedJob.title}
                        </Link>
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3 text-sm md:text-base">
                        <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                        <span>{relatedJob.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(relatedJob.type)}`}>
                          {relatedJob.type}
                        </span>
                        <Link href={`/careers/${relatedJob._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                        >
                          View Job →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default JobDetail;
