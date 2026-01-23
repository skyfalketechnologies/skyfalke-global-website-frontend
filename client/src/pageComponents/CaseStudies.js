'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiGet } from '../utils/api';
import OptimizedImage from '../components/OptimizedImage';
import {
  FaSearch,
  FaFilter,
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaIndustry,
  FaCog,
  FaStar,
  FaCalendarAlt,
  FaEye,
  FaArrowRight,
  FaBuilding,
  FaChartLine,
  FaUsers,
  FaGlobe
} from 'react-icons/fa';

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCaseStudies, setTotalCaseStudies] = useState(0);
  const [industries, setIndustries] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCaseStudies();
    fetchIndustries();
    fetchServices();
  }, [currentPage, searchTerm, selectedIndustry, selectedService, featuredOnly, sortBy, sortOrder]);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedIndustry !== 'All') params.append('industry', selectedIndustry);
      if (selectedService !== 'All') params.append('service', selectedService);
      if (featuredOnly) params.append('featured', 'true');

      const response = await apiGet(`/api/case-studies?${params}`);
      
      if (response.data.success) {
        setCaseStudies(response.data.data.caseStudies);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalCaseStudies(response.data.data.pagination.totalCaseStudies);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
      setError('Failed to fetch case studies');
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await apiGet('/api/case-studies/industries/list');
      if (response.data.success) {
        setIndustries(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await apiGet('/api/case-studies/services/list');
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('All');
    setSelectedService('All');
    setFeaturedOnly(false);
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

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="text-primary-500" /> : <FaSortDown className="text-primary-500" />;
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: { text: 'Published', color: 'text-green-600', bg: 'bg-green-100' },
      draft: { text: 'Draft', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      archived: { text: 'Archived', color: 'text-gray-600', bg: 'bg-gray-100' }
    };
    return badges[status] || badges.draft;
  };

  return (
    <>
      <Helmet>
        <title>Case Studies - Skyfalke Success Stories</title>
        <meta name="description" content="Explore our successful case studies and client success stories across digital marketing, cloud solutions, and business technology." />
        <meta name="keywords" content="case studies, success stories, client projects, digital marketing, cloud solutions, business technology" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4 py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Case Studies
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Real Results, Real Success Stories
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-primary-200" />
                  <span>Proven Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-primary-200" />
                  <span>Client Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-primary-200" />
                  <span>Global Impact</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaFilter />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search Case Studies
                    </label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search case studies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Industry Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="All">All Industries</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="All">All Services</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={featuredOnly}
                        onChange={(e) => setFeaturedOnly(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Featured Only</span>
                    </label>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Case Studies Grid */}
            <div className="lg:w-3/4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    All Case Studies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {totalCaseStudies} case studies found
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sort:</span>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                      }}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="publishedAt-desc">Newest First</option>
                      <option value="publishedAt-asc">Oldest First</option>
                      <option value="title-asc">Title: A to Z</option>
                      <option value="title-desc">Title: Z to A</option>
                    </select>
                  </div>
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

              {/* Case Studies Grid */}
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
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudies.map((caseStudy, index) => (
                    <motion.div
                      key={caseStudy._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Case Study Image */}
                      <div className="relative overflow-hidden">
                        <OptimizedImage
                          src={caseStudy.images.find(img => img.isPrimary)?.url || caseStudy.images[0]?.url || '/images/hero/business_tools.webp'}
                          alt={caseStudy.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          width={400}
                          height={192}
                          priority={index < 3}
                        />
                        
                        {/* Featured Badge */}
                        {caseStudy.featured && (
                          <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <FaStar className="text-xs" />
                            Featured
                          </div>
                        )}

                        {/* Client Logo */}
                        {caseStudy.client.logo?.url && (
                          <div className="absolute top-2 right-2 bg-white rounded-lg p-2 shadow-md">
                            <img
                              src={caseStudy.client.logo.url}
                              alt={`${caseStudy.client.name} logo`}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <Link href={`/case-studies/${caseStudy.slug}`}
                            className="bg-white text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary-600 hover:text-white flex items-center gap-2"
                          >
                            <FaEye />
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* Case Study Info */}
                      <div className="p-6">
                        {/* Client Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <FaIndustry className="text-gray-400 text-sm" />
                          <span className="text-sm text-gray-500">{caseStudy.client.industry}</span>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-lg">
                          {caseStudy.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {caseStudy.summary}
                        </p>

                        {/* Services */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {caseStudy.services.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                          {caseStudy.services.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{caseStudy.services.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Metrics Preview */}
                        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                              <div key={idx} className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <div className="text-lg font-bold text-primary-600">
                                  {metric.value}{metric.unit}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {metric.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaCalendarAlt className="text-xs" />
                            <span>
                              {new Date(caseStudy.publishedAt || caseStudy.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <Link href={`/case-studies/${caseStudy.slug}`}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 group"
                          >
                            Read More
                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-2 border rounded-lg ${
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
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseStudies;
