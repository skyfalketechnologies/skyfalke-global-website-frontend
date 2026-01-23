'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiGet } from '../utils/api';
import { 
  FaArrowRight, 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaClock, 
  FaUsers,
  FaStar,
  FaExternalLinkAlt,
  FaSpinner
} from 'react-icons/fa';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isRemote, setIsRemote] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [error, setError] = useState('');

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Sales', 'Operations', 'Management'];
  const locations = ['All', 'Nairobi', 'Mombasa', 'Remote', 'Hybrid'];
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, selectedCategory, selectedLocation, selectedType, isRemote]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(selectedLocation !== 'All' && { location: selectedLocation }),
        ...(selectedType !== 'All' && { type: selectedType }),
        ...(isRemote && { isRemote: 'true' })
      });

      const response = await apiGet(`/api/jobs?${params}`);
      
      if (response.data) {
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
        setTotalJobs(response.data.totalJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedType('All');
    setIsRemote(false);
    setCurrentPage(1);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Strip HTML tags from description for preview
  const stripHtml = (html) => {
    if (!html) return '';
    // Use regex as fallback if DOM is not available
    if (typeof document === 'undefined') {
      return html.replace(/<[^>]*>/g, '').trim();
    }
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <>
      <Helmet>
        <title>Careers - Join Our Team | Skyfalke</title>
        <meta name="description" content="Explore exciting career opportunities at Skyfalke. Join our team of digital marketing and technology professionals." />
      </Helmet>

        {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 pt-16">
          <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl mb-8 text-primary-100">
              Be part of a dynamic team that's shaping the future of digital marketing and technology in Africa
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <FaUsers className="mr-2" />
                <span>10+ Team Members</span>
            </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>Multiple Locations</span>
          </div>
              <div className="flex items-center">
                <FaStar className="mr-2" />
                <span>Great Benefits</span>
                    </div>
                  </div>
                </motion.div>
          </div>
        </section>

            {/* Search and Filters */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Search */}
              <div className="lg:col-span-2 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
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

                  {/* Location Filter */}
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

              {/* Job Type Filter */}
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                  </div>

              {/* Remote Filter */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRemote}
                    onChange={(e) => setIsRemote(e.target.checked)}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Remote Only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== 'All' || selectedLocation !== 'All' || selectedType !== 'All' || isRemote) && (
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {totalJobs} job{totalJobs !== 1 ? 's' : ''} found
                </span>
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">{error}</p>
            </div>
          )}

            {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
              <span className="ml-3 text-gray-600">Loading jobs...</span>
              </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <FaBriefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'All' || selectedLocation !== 'All' || selectedType !== 'All' || isRemote
                  ? 'Try adjusting your filters to find more opportunities.'
                  : 'Check back soon for new opportunities!'}
              </p>
              {(searchTerm || selectedCategory !== 'All' || selectedLocation !== 'All' || selectedType !== 'All' || isRemote) && (
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
              </div>
            ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="p-6">
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors duration-300">
                            <Link href={`/careers/${job._id}`}>
                              {job.title}
                            </Link>
                          </h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <FaMapMarkerAlt className="mr-2 text-gray-400" />
                            <span>{job.location}</span>
                            {job.isRemote && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Remote
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Job Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(job.category)}`}>
                              {job.category}
                            </span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(job.type)}`}>
                              {job.type}
                            </span>
                      </div>

                      {/* Job Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                        {(() => {
                          const plainText = stripHtml(job.description || '');
                          return plainText.length > 150 
                            ? `${plainText.substring(0, 150)}...` 
                            : plainText || 'Job description not available';
                        })()}
                      </p>

                      {/* Job Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-2 text-gray-400" />
                          <span>Posted {formatDate(job.postedDate)}</span>
                        </div>
                        {job.salary && (job.salary.min || job.salary.max) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaBriefcase className="mr-2 text-gray-400" />
                            <span>
                              {job.salary.min && job.salary.max 
                                ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
                                : job.salary.min 
                                  ? `From ${job.salary.min.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
                                  : `Up to ${job.salary.max.toLocaleString()} ${job.salary.currency}/${job.salary.period}`
                              }
                            </span>
                        </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <Link href={`/careers/${job._id}`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300"
                        >
                          View Details
                          <FaArrowRight className="ml-2" />
                        </Link>
                        <Link href={`/careers/${job._id}/apply`}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
            )}
          </div>
        </section>

        {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            className="max-w-3xl mx-auto"
            >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't see the right fit?
              </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
              <a
                href="mailto:careers@skyfalke.com"
                className="bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Send Resume
              </a>
              </div>
            </motion.div>
          </div>
        </section>
    </>
  );
};

export default Careers;
