'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaFilter, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { useBlogList } from '../features/blog/hooks';
import { BlogCard, Breadcrumbs } from '../features/blog/components';
import SEOHead from '../components/SEO/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Blog Listing Page
 * SEO-optimized with proper semantic HTML
 */
const Blog = () => {
  const { blogs, loading, error, pagination, filters, updateFilters, goToPage } = useBlogList();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Digital Marketing',
    'Cloud Solutions',
    'Technology',
    'Business',
    'Industry Insights'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const handleCategoryChange = (category) => {
    updateFilters({ category });
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title="Blog | Skyfalke - Digital Marketing & Technology Insights"
        description="Read the latest insights on digital marketing, cloud solutions, sustainable technology, and business growth strategies from Skyfalke."
        keywords="digital marketing blog, cloud solutions, technology insights, business growth, SEO tips, sustainable technology"
        url="https://skyfalke.com/blog"
        type="website"
      />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-dark-blue via-primary-800 to-dark-blue text-white section-padding">
          <div className="container-custom">
            <Breadcrumbs items={[]} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-nexa-heavy">
              Our Blog
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Stay updated with the latest insights on digital marketing, cloud solutions, 
              and sustainable technology.
            </p>
          </div>
        </header>

        {/* Search and Filter Section */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container-custom py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFilter />
                  <span>Filter</span>
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors ${
                            filters.category === category || 
                            (category === 'All' && !filters.category)
                              ? 'bg-yellow/10 text-yellow font-semibold'
                              : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.search) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.category && filters.category !== 'All' && (
                  <span className="px-3 py-1 bg-yellow/10 text-yellow rounded-full text-sm">
                    Category: {filters.category}
                    <button
                      onClick={() => updateFilters({ category: '' })}
                      className="ml-2 hover:text-yellow/80"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="px-3 py-1 bg-yellow/10 text-yellow rounded-full text-sm">
                    Search: {filters.search}
                    <button
                      onClick={() => {
                        updateFilters({ search: '' });
                        setSearchTerm('');
                      }}
                      className="ml-2 hover:text-yellow/80"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="container-custom section-padding">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-yellow text-dark-blue rounded-lg hover:bg-yellow/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-4">No blog posts found.</p>
              {(filters.category || filters.search) && (
                <button
                  onClick={() => {
                    updateFilters({ category: '', search: '' });
                    setSearchTerm('');
                  }}
                  className="text-yellow hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} post={blog} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav 
                  className="flex justify-center items-center gap-2"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === pagination.totalPages ||
                          Math.abs(page - pagination.currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsisBefore && (
                              <span className="px-4 py-2 text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                page === pagination.currentPage
                                  ? 'bg-yellow text-dark-blue font-semibold'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Blog;
