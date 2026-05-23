'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSitemap, 
  FaDownload, 
  FaRedo, 
  FaExternalLinkAlt,
  FaGlobe,
  FaFileAlt,
  FaCalendarAlt,
  FaChartBar,
  FaCopy,
  FaCheck
} from 'react-icons/fa';

const SitemapManager = () => {
  const [sitemapData, setSitemapData] = useState(null);
  const [robotsData, setRobotsData] = useState(null);
  const [sitemapStats, setSitemapStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [copyStatus, setCopyStatus] = useState({ sitemap: false, robots: false });

  const fetchSitemapInfo = async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from backend via same-origin proxy (matches files written by generate-sitemap)
      const cacheBuster = skipCache ? `?t=${Date.now()}` : '';
      const fetchOpts = {
        cache: skipCache ? 'no-store' : 'default',
        headers: skipCache ? { 'Cache-Control': 'no-cache' } : undefined,
      };
      const [sitemapResponse, robotsResponse] = await Promise.all([
        fetch(`/api/sitemap.xml${cacheBuster}`, fetchOpts),
        fetch(`/api/sitemap/robots.txt${cacheBuster}`, fetchOpts),
      ]);

      if (!sitemapResponse.ok || !robotsResponse.ok) {
        throw new Error('Failed to fetch sitemap or robots content');
      }

      const [sitemapText, robotsText] = await Promise.all([
        sitemapResponse.text(),
        robotsResponse.text(),
      ]);

      setSitemapData(sitemapText);
      setRobotsData(robotsText);
      
      // Only parse stats from XML if this is a normal fetch (not after generation)
      // When skipCache is true, we already have correct stats from the generate response
      if (!skipCache) {
        const xmlData = sitemapText;
        if (xmlData) {
          // More accurate regex patterns that exclude the base /careers route
          const blogMatches = xmlData.match(/<loc>[^<]*\/blog\/[^<]+<\/loc>/g) || [];
          const productMatches = xmlData.match(/<loc>[^<]*\/shop\/product\/[^<]+<\/loc>/g) || [];
          const caseStudyMatches =
            xmlData.match(/<loc>[^<]*\/how-we-work\/case-studies\/[^<]+<\/loc>/g) ||
            xmlData.match(/<loc>[^<]*\/case-studies\/[^<]+<\/loc>/g) ||
            [];
          const jobMatches = xmlData.match(/<loc>[^<]*\/careers\/[^<]+<\/loc>/g) || [];
          // Filter out the base /careers route
          const actualJobMatches = jobMatches.filter(url => !url.includes('/careers</loc>') && url.includes('/careers/'));
          
          setSitemapStats({
            totalUrls: xmlData.match(/<url>/g)?.length || 0,
            staticPages: 50,
            blogPosts: blogMatches.length,
            products: productMatches.length,
            caseStudies: caseStudyMatches.length,
            jobs: actualJobMatches.length
          });
        }
      }
      
      // Get last modified from headers
      const lastModified = sitemapResponse.headers.get('last-modified');
      if (lastModified) {
        setLastGenerated(new Date(lastModified));
      }
    } catch (err) {
      setError('Failed to fetch sitemap information');
      console.error('Error fetching sitemap:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSitemap = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/sitemap/generate-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok || payload.success === false) {
        throw new Error(payload.message || `Failed to generate sitemap (${res.status})`);
      }

      const stats = payload.data;
      if (stats) {
        setSitemapStats({
          totalUrls: stats.totalUrls || 0,
          staticPages: stats.staticRoutes || 0,
          staticRoutes: stats.staticRoutes || 0,
          blogPosts: stats.blogs || 0,
          products: stats.products || 0,
          caseStudies: stats.caseStudies || 0,
          jobs: stats.jobs || 0,
          courses: stats.courses || 0,
          events: stats.events || 0,
          trainers: stats.trainers || 0,
        });
        setLastGenerated(new Date());
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchSitemapInfo(true);

      alert('Sitemap generated successfully!');
    } catch (err) {
      const message = err.message || 'Failed to generate sitemap';
      setError(message);
      console.error('Error generating sitemap:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadSitemap = () => {
    const link = document.createElement('a');
    link.href = '/api/sitemap.xml';
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadRobots = () => {
    const link = document.createElement('a');
    link.href = '/api/sitemap/robots.txt';
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      
      // Reset the copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 2000);
    }
  };

  useEffect(() => {
    fetchSitemapInfo();
  }, []);

  // Use structured stats if available, otherwise calculate from XML
  const displayStats = sitemapStats || {
    totalUrls: sitemapData ? sitemapData.match(/<url>/g)?.length || 0 : 0,
    staticPages: sitemapStats?.staticRoutes || 50,
    blogPosts: sitemapData ? (sitemapData.match(/\/blog\/[^<]+/g)?.length || 0) : 0,
    products: sitemapData ? (sitemapData.match(/\/shop\/product\/[^<]+/g)?.length || 0) : 0,
    caseStudies: sitemapData ? (sitemapData.match(/\/case-studies\/[^<]+/g)?.length || 0) : 0,
    jobs: sitemapData ? (sitemapData.match(/\/careers\/[^<]+/g)?.length || 0) : 0
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Sitemap Manager - Admin Dashboard</title>
        <meta name="description" content="Manage and generate sitemap for Skyfalke website" />
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaSitemap className="mr-3 text-blue-600" />
              Sitemap Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and generate XML sitemap for search engine optimization
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={generateSitemap}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaRedo className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generating...' : 'Generate Sitemap'}
            </button>
            <button
              onClick={fetchSitemapInfo}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaRedo className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FaGlobe className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total URLs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalUrls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FaFileAlt className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Static Pages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.staticPages || displayStats.staticRoutes || 50}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <FaChartBar className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dynamic Content</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(displayStats.blogPosts || 0) + (displayStats.products || 0) + (displayStats.caseStudies || 0) + (displayStats.jobs || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Blog Posts</span>
              <span className="font-semibold text-gray-900 dark:text-white">{displayStats.blogPosts || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Products</span>
              <span className="font-semibold text-gray-900 dark:text-white">{displayStats.products || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Case Studies</span>
              <span className="font-semibold text-gray-900 dark:text-white">{displayStats.caseStudies || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Job Listings</span>
              <span className="font-semibold text-gray-900 dark:text-white">{displayStats.jobs || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={downloadSitemap}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaDownload className="mr-2" />
              Download Sitemap XML
            </button>
            <button
              onClick={downloadRobots}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaDownload className="mr-2" />
              Download Robots.txt
            </button>
            <a
              href="/api/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              View Sitemap
            </a>
            <a
              href="/api/sitemap/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              View Robots.txt
            </a>
          </div>
        </div>
      </div>

      {/* Last Generated Info */}
      {lastGenerated && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Last Generated
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Sitemap was last generated on: <span className="font-semibold text-gray-900 dark:text-white">
              {lastGenerated.toLocaleString()}
            </span>
          </p>
        </div>
      )}

      {/* Sitemap Preview */}
      {sitemapData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sitemap Preview</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {sitemapData.length} characters
              </span>
              <button
                onClick={() => copyToClipboard(sitemapData, 'sitemap')}
                className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  copyStatus.sitemap 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {copyStatus.sitemap ? (
                  <>
                    <FaCheck className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-1" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={() => setShowFullPreview(!showFullPreview)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showFullPreview ? 'Show Less' : 'Show Full'}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {showFullPreview ? sitemapData : sitemapData.substring(0, 2000)}
              {!showFullPreview && sitemapData.length > 2000 && '...'}
            </pre>
          </div>
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            <p>This preview shows the exact same content that will be downloaded.</p>
            <p>Total URLs: {sitemapData.match(/<url>/g)?.length || 0}</p>
          </div>
        </div>
      )}

      {/* Robots.txt Preview */}
      {robotsData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Robots.txt Preview</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {robotsData.length} characters
              </span>
              <button
                onClick={() => copyToClipboard(robotsData, 'robots')}
                className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  copyStatus.robots 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {copyStatus.robots ? (
                  <>
                    <FaCheck className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {robotsData}
            </pre>
          </div>
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            <p>This preview shows the exact same content that will be downloaded.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapManager;
