'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaRegStar,
  FaSearch,
  FaFilter,
  FaSort,
  FaCalendar,
  FaUser,
  FaTags,
  FaChartLine,
  FaImage,
  FaGlobe,
  FaTwitter,
  FaFacebook,
  FaTrophy,
  FaChartBar
} from 'react-icons/fa';
import BlogStats from '../../components/Admin/BlogStats';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGet, apiDelete, apiPatch } from '../../utils/api';
import { calculateSEOScore } from '../../utils/seoScoreCalculator';

const Blogs = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  // Get SEO score color
  const getSEOScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
  };

  const getSEOScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter }),
        sortBy,
        sortOrder
      });

      const response = await apiGet(`/api/blogs/admin/all?${params}`);
      
      console.log('Blogs API response:', response);
      console.log('Response data:', response.data);
      
      // Server returns data directly, not wrapped in success/data
      if (response.data && response.data.blogs) {
        let blogsData = response.data.blogs;
        
        // Sort by SEO score if selected
        if (sortBy === 'seoScore') {
          blogsData = [...blogsData].sort((a, b) => {
            const scoreA = calculateSEOScore(a);
            const scoreB = calculateSEOScore(b);
            return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
          });
        }
        
        setBlogs(blogsData);
        setTotalPages(response.data.totalPages);
        console.log('Blogs set:', blogsData);
      } else {
        console.log('No blogs data in response');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiGet('/api/blogs/admin/stats');
      
      // Server returns data directly, not wrapped in success/data
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await apiDelete(`/api/blogs/${blogId}`);
      
      // Server returns success message directly
      if (response.data && response.data.message) {
        fetchBlogs();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleStatusToggle = async (blogId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const response = await apiPatch(`/api/blogs/${blogId}/status`, { status: newStatus });
      
      // Server returns updated blog object directly
      if (response.data && response.data._id) {
        fetchBlogs();
        fetchStats();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleFeaturedToggle = async (blogId, currentFeatured) => {
    try {
      const response = await apiPatch(`/api/blogs/${blogId}/featured`, { isFeatured: !currentFeatured });
      
      // Server returns updated blog object directly
      if (response.data && response.data._id) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'Draft' },
      review: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Review' },
      published: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Published' },
      archived: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Archived' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog Management - Admin Dashboard</title>
      </Helmet>

    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your blog posts and content</p>
          </div>
          <button
            onClick={() => router.push('/system/dashboard/blogs/new')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <FaPlus className="h-4 w-4" />
            <span>New Blog Post</span>
          </button>
        </div>

        {/* Stats */}
        {stats && <BlogStats stats={stats} />}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
          <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
                placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Cloud Solutions">Cloud Solutions</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Industry Insights">Industry Insights</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Creative Services">Creative Services</option>
              <option value="Earned Media">Earned Media</option>
              <option value="Paid Media">Paid Media</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="views-desc">Most Views</option>
              <option value="views-asc">Least Views</option>
              <option value="seoScore-desc">Highest SEO Score</option>
              <option value="seoScore-asc">Lowest SEO Score</option>
            </select>
        </div>
      </div>

        {/* Blogs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading blogs...</p>
          </div>
        ) : (
            <>
          <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Blog Post
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        SEO Score
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
                    {blogs.map((blog) => (
                      <motion.tr
                        key={blog._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {blog.featuredImage?.url ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={blog.featuredImage.url}
                                  alt={blog.featuredImage.alt || blog.title}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                  <FaImage className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {blog.title}
                          </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                by {blog.author?.name || 'Unknown'}
                          </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {blog.isFeatured && (
                                  <FaStar className="h-3 w-3 text-yellow-500" />
                                )}
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {blog.readTime} min read
                                </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(blog.status)}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {blog.category}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center space-x-1">
                            <FaChartLine className="h-3 w-3 text-gray-400" />
                            <span>{blog.views.toLocaleString()}</span>
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            const seoScore = calculateSEOScore(blog);
                            return (
                              <div className="flex items-center space-x-2">
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getSEOScoreColor(seoScore)}`}>
                                  <FaChartBar className="h-3 w-3" />
                                  <span>{seoScore}</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">
                                  {getSEOScoreLabel(seoScore)}
                                </span>
                              </div>
                            );
                          })()}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(blog.createdAt)}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleFeaturedToggle(blog._id, blog.isFeatured)}
                              className={`p-1 rounded ${
                                blog.isFeatured 
                                  ? 'text-yellow-500 hover:text-yellow-600' 
                                  : 'text-gray-400 hover:text-yellow-500'
                              }`}
                              title={blog.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                            >
                              {blog.isFeatured ? <FaStar className="h-4 w-4" /> : <FaRegStar className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => handleStatusToggle(blog._id, blog.status)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                            >
                              {blog.status === 'published' ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => router.push(`/system/dashboard/blogs/${blog._id}/edit`)}
                              className="p-1 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                              title="Edit"
                            >
                          <FaEdit className="h-4 w-4" />
                        </button>
                            
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
            </button>
          </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
    </div>

    </>
  );
};

export default Blogs;
