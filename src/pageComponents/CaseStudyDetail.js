'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '../utils/api';
import {
  FaArrowLeft,
  FaIndustry,
  FaCog,
  FaCalendarAlt,
  FaGlobe,
  FaChartLine,
  FaUsers,
  FaStar,
  FaQuoteLeft,
  FaQuoteRight,
  FaSpinner,
  FaTimes,
  FaEye,
  FaArrowRight,
  FaBuilding,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaCode,
  FaTags
} from 'react-icons/fa';

// Helper utilities for safer SEO metadata
const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

const truncateText = (text, maxLength = 160) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
};

// Blocklist for images that must never be used as OG/Twitter images
const BLOCKED_IMAGE_PREFIXES = [
  'https://ik.imagekit.io/g3nahgeeu/customers/cfao.png',
];

const isBlockedImage = (url) => {
  if (!url) return false;
  return BLOCKED_IMAGE_PREFIXES.some((prefix) => url.startsWith(prefix));
};

const CaseStudyDetail = () => {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();
  const [caseStudy, setCaseStudy] = useState(null);
  const [relatedCaseStudies, setRelatedCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchCaseStudy();
  }, [slug]);

  const fetchCaseStudy = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check for SSR-injected initial data
      const initialData = window.__INITIAL_DATA__;
      if (initialData && initialData.caseStudy && initialData.caseStudy.slug === slug) {
        console.log('Using SSR-injected data for case study');
        setCaseStudy(initialData.caseStudy);
        if (initialData.relatedCaseStudies) {
          setRelatedCaseStudies(initialData.relatedCaseStudies);
        }
        
        // Clear initial data to prevent reuse
        window.__INITIAL_DATA__ = null;
        
        setLoading(false);
        return;
      }
      
      const response = await apiGet(`/api/case-studies/${slug}`);
      
      if (response.data.success) {
        setCaseStudy(response.data.data.caseStudy);
        setRelatedCaseStudies(response.data.data.relatedCaseStudies);
      }
    } catch (error) {
      console.error('Error fetching case study:', error);
      if (error.response?.status === 404) {
        setError('Case study not found');
      } else {
        setError('Failed to fetch case study');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading case study...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaTimes className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || 'Case study not found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The case study you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/case-studies"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaArrowLeft />
            Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  // --- SEO metadata preparation ---
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://skyfalke.com';
  const canonicalUrl = `${baseUrl}/case-studies/${slug}`;

  const metaTitle =
    caseStudy.seo?.metaTitle ||
    `${caseStudy.title} - Case Study | Skyfalke`;

  const rawDescription =
    caseStudy.seo?.metaDescription ||
    caseStudy.summary ||
    stripHtmlTags(caseStudy.description);

  const metaDescription = truncateText(rawDescription, 160);
  const metaKeywords = Array.isArray(caseStudy.tags)
    ? caseStudy.tags.join(', ')
    : undefined;

  let primaryImageUrl =
    caseStudy.images?.find((img) => img.isPrimary)?.url ||
    caseStudy.images?.[0]?.url ||
    '/images/hero/business_tools.webp';

  if (isBlockedImage(primaryImageUrl)) {
    primaryImageUrl = '/images/hero/business_tools.webp';
  }

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
        {metaKeywords && (
          <meta name="keywords" content={metaKeywords} />
        )}

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        {metaDescription && (
          <meta property="og:description" content={metaDescription} />
        )}
        {primaryImageUrl && (
          <meta property="og:image" content={primaryImageUrl} />
        )}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Skyfalke" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        {metaDescription && (
          <meta name="twitter:description" content={metaDescription} />
        )}
        {primaryImageUrl && (
          <meta name="twitter:image" content={primaryImageUrl} />
        )}
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem] overflow-hidden">
          <img
            src={caseStudy.images?.find(img => img.isPrimary)?.url || caseStudy.images?.[0]?.url || '/images/hero/business_tools.webp'}
            alt={caseStudy.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/hero/business_tools.webp';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center pt-16 md:pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-white"
                >
                  {/* Featured Badge - Hidden on mobile */}
                  {caseStudy.featured && (
                    <div className="hidden sm:inline-flex items-center gap-2 bg-secondary-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4">
                      <FaStar className="text-xs sm:text-sm" />
                      Featured Case Study
                    </div>
                  )}

                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                    {caseStudy.title}
                  </h1>
                  
                  {/* Summary - Hidden on mobile, shown on larger screens */}
                  <p className="hidden sm:block text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-6 max-w-2xl leading-relaxed">
                    {caseStudy.summary}
                  </p>

                  {/* Client Info - Simplified on mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-xs" />
                      <span className="truncate text-sm sm:text-base">{caseStudy.client.name}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <FaIndustry className="text-xs sm:text-sm" />
                      <span className="truncate">{caseStudy.client.industry}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <FaCalendarAlt className="text-xs sm:text-sm" />
                      <span>
                        {new Date(caseStudy.publishedAt || caseStudy.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/case-studies"
                className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Case Studies
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium truncate">
                {caseStudy.title}
              </span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              {/* Project Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center rounded-lg">
                    <FaBuilding className="text-primary-600 dark:text-primary-400 text-sm sm:text-base" />
                  </div>
                  Project Overview
                </h2>
                
                <div 
                  className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-2
                    [&_li]:text-gray-600 [&_li]:dark:text-gray-300
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-gray-900 [&_h1]:dark:text-white
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-white
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-white
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300
                    [&_a]:text-primary-600 [&_a]:hover:text-primary-700 [&_a]:underline
                    [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-white
                    [&_em]:italic
                    [&_code]:bg-gray-100 [&_code]:dark:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
                  dangerouslySetInnerHTML={{ __html: caseStudy.description }}
                />
              </motion.div>

              {/* Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/20 flex items-center justify-center rounded-lg">
                    <FaTimes className="text-red-600 dark:text-red-400 text-sm sm:text-base" />
                  </div>
                  The Challenge
                </h2>
                
                <div 
                  className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-2
                    [&_li]:text-gray-600 [&_li]:dark:text-gray-300
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-gray-900 [&_h1]:dark:text-white
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-white
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-white
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300
                    [&_a]:text-primary-600 [&_a]:hover:text-primary-700 [&_a]:underline
                    [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-white
                    [&_em]:italic
                    [&_code]:bg-gray-100 [&_code]:dark:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
                  dangerouslySetInnerHTML={{ __html: caseStudy.challenge }}
                />
              </motion.div>

              {/* Solution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-100 dark:bg-secondary-900/20 flex items-center justify-center rounded-lg">
                    <FaCog className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base" />
                  </div>
                  Our Solution
                </h2>
                
                <div 
                  className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-2
                    [&_li]:text-gray-600 [&_li]:dark:text-gray-300
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-gray-900 [&_h1]:dark:text-white
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-white
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-white
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300
                    [&_a]:text-primary-600 [&_a]:hover:text-primary-700 [&_a]:underline
                    [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-white
                    [&_em]:italic
                    [&_code]:bg-gray-100 [&_code]:dark:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
                  dangerouslySetInnerHTML={{ __html: caseStudy.solution }}
                />
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 flex items-center justify-center rounded-lg">
                    <FaChartLine className="text-green-600 dark:text-green-400 text-sm sm:text-base" />
                  </div>
                  Results & Impact
                </h2>
                
                <div 
                  className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-2
                    [&_li]:text-gray-600 [&_li]:dark:text-gray-300
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-gray-900 [&_h1]:dark:text-white
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-gray-900 [&_h2]:dark:text-white
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-gray-900 [&_h3]:dark:text-white
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300
                    [&_a]:text-primary-600 [&_a]:hover:text-primary-700 [&_a]:underline
                    [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:dark:text-white
                    [&_em]:italic
                    [&_code]:bg-gray-100 [&_code]:dark:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
                  dangerouslySetInnerHTML={{ __html: caseStudy.results }}
                />

                {/* Metrics */}
                {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {caseStudy.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-baseline justify-between mb-2">
                          <div className="text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
                            {metric.label}
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                            Result
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                          {metric.value}{metric.unit}
                        </div>
                        {metric.description && (
                          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {metric.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Images Gallery */}
              {caseStudy.images && caseStudy.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-100 dark:bg-accent-900/20 flex items-center justify-center rounded-lg">
                      <FaEye className="text-accent-600 dark:text-accent-400 text-sm sm:text-base" />
                    </div>
                    Project Gallery
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {caseStudy.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.caption || `Project image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/images/hero/business_tools.webp';
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <FaEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg" />
                        </div>
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-white text-sm font-medium line-clamp-2">
                              {image.caption}
                            </p>
                          </div>
                        )}
                        {image.isPrimary && (
                          <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tags Section */}
              {caseStudy.tags && caseStudy.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-100 dark:bg-secondary-900/20 flex items-center justify-center rounded-lg">
                      <FaTags className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base" />
                    </div>
                    Tags
                  </h2>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {caseStudy.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 rounded-full text-sm sm:text-base font-medium hover:bg-secondary-200 dark:hover:bg-secondary-900/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Testimonial */}
              {caseStudy.testimonial && caseStudy.testimonial.content && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Quote Icons */}
                    <div className="flex justify-between sm:flex-col sm:justify-start sm:items-start">
                      <FaQuoteLeft className="text-lg sm:text-xl md:text-2xl text-primary-500 flex-shrink-0" />
                      <FaQuoteRight className="text-lg sm:text-xl md:text-2xl text-primary-200 flex-shrink-0 sm:hidden" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base md:text-lg italic mb-4 sm:mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
                        "{caseStudy.testimonial.content}"
                      </p>
                      
                      {/* Author Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {caseStudy.testimonial.avatar?.url && (
                          <img
                            src={caseStudy.testimonial.avatar.url}
                            alt={caseStudy.testimonial.author || 'Client'}
                            className="w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0 border-2 border-primary-200 mx-auto sm:mx-0"
                          />
                        )}
                        <div className="text-center sm:text-left min-w-0">
                          {caseStudy.testimonial.author && (
                            <div className="font-semibold text-sm sm:text-base md:text-base text-gray-900 dark:text-white truncate">
                              {caseStudy.testimonial.author}
                            </div>
                          )}
                          {(caseStudy.testimonial.position || caseStudy.testimonial.company) && (
                            <div className="text-xs sm:text-sm md:text-sm text-gray-500 dark:text-gray-400 truncate">
                              {caseStudy.testimonial.position}
                              {caseStudy.testimonial.position && caseStudy.testimonial.company && ' at '}
                              {caseStudy.testimonial.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Quote Icon - Hidden on mobile */}
                    <FaQuoteRight className="hidden sm:block text-xl md:text-2xl text-primary-500 mt-1 flex-shrink-0" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 lg:sticky lg:top-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center rounded-lg">
                    <FaCog className="text-primary-600 dark:text-primary-400 text-sm" />
                  </div>
                  Project Details
                </h3>
                
                <div className="space-y-4 sm:space-y-5">
                  {/* Client */}
                  <div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                      <FaBuilding className="text-xs" />
                      <span>Client</span>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {caseStudy.client.name}
                    </div>
                    {caseStudy.client.website && (
                      <a
                        href={caseStudy.client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm inline-flex items-center gap-1 mt-1"
                      >
                        <FaGlobe className="text-xs" />
                        Visit Website
                      </a>
                    )}
                  </div>

                  {/* Industry */}
                  <div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                      <FaIndustry className="text-xs" />
                      <span>Industry</span>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {caseStudy.client.industry}
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                      <FaCog className="text-xs" />
                      <span>Services</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {caseStudy.services.map((service) => (
                        <span
                          key={service}
                          className="text-xs bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  {caseStudy.duration?.duration && (
                    <div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                        <FaClock className="text-xs" />
                        <span>Duration</span>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {caseStudy.duration.duration}
                      </div>
                    </div>
                  )}

                  {/* Budget */}
                  {caseStudy.budget && (
                    <div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                        <FaDollarSign className="text-xs" />
                        <span>Budget</span>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {caseStudy.budget}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                        <FaCode className="text-xs" />
                        <span>Technologies</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {caseStudy.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {caseStudy.tags && caseStudy.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                        <FaTags className="text-xs" />
                        <span>Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {caseStudy.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Back to Case Studies Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/case-studies')}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <FaArrowLeft />
              Back to Case Studies
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseStudyDetail;
