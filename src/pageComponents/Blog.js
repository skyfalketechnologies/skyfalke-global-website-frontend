'use client';

import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useBlogList } from '../features/blog/hooks';
import { BlogCard, Breadcrumbs } from '../features/blog/components';
import SEOHead from '../components/SEO/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Blog Listing Page
 * SEO-optimized with proper semantic HTML
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

const Blog = ({ initialData = null }) => {
  const { blogs, loading, error, pagination, filters, updateFilters, goToPage } = useBlogList({}, initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;
    setSubscribed(true);
    setSubscriberEmail('');
  };

  const featuredBlog = blogs?.[0] || null;
  const remainingBlogs = blogs?.slice(1) || [];

  return (
    <>
      <SEOHead
        skipBaseMeta
        pageType="blog-index"
        title="Blog | Skyfalke - Digital Marketing & Technology Insights"
        description="Read the latest insights on digital marketing, cloud solutions, sustainable technology, and business growth strategies from Skyfalke."
        keywords="digital marketing blog, cloud solutions, technology insights, business growth, SEO tips, sustainable technology"
        url={`${SITE_URL}/blog`}
        canonical={`${SITE_URL}/blog`}
        type="website"
        breadcrumbs={[
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'Blog', url: `${SITE_URL}/blog` },
        ]}
      />

      <main className="min-h-screen bg-[#F8FAFC] pt-10 md:pt-10">
        <header className="border-b border-slate-200/80 bg-white">
          <div className="container-custom py-12 sm:py-16">
            <Breadcrumbs items={[]} />
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">Insights</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-5xl md:text-[3.25rem]">
              Perspectives on growth, technology, and execution
            </h1>
            <div className="mt-5 max-w-3xl space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                Analysis and practical guidance on digital growth, cloud modernization, AI strategy, and business transformation.
              </p>
              <p>
                Our articles are written for leaders and practitioners who need clear recommendations — not hype. Expect frameworks you can apply, lessons from delivery, and honest trade-offs when technology choices matter.
              </p>
              <p>
                Browse by category or search for topics such as SEO, automation, CRM, data platforms, and sustainable operations. New posts are added regularly as we learn from client work and market shifts.
              </p>
            </div>
          </div>
        </header>

        <section className="border-b border-slate-200/80 bg-[#0B1220]">
          <div className="container-custom py-6">
            <div className="flex flex-col gap-4 rounded-xl border border-white/15 bg-white/[0.03] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Newsletter</p>
                <h2 className="mt-2 text-xl font-nexa-heavy tracking-tight text-white sm:text-2xl">Get executive briefs in your inbox</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  One practical update every week on AI, cloud, and digital growth. No noise.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 flex-1 rounded-lg border border-white/25 bg-white/95 px-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/70"
                  required
                />
                <button
                  type="submit"
                  className="h-11 rounded-lg bg-secondary-500 px-4 text-sm font-semibold text-primary-900 transition hover:bg-secondary-400"
                >
                  Subscribe
                </button>
              </form>
            </div>
            {subscribed ? (
              <p className="mt-3 text-sm font-medium text-emerald-200">Subscribed. You will receive the next briefing.</p>
            ) : null}
          </div>
        </section>

        <section className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="container-custom py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search insights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300/90 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </form>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300/90 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <FaFilter />
                  <span>Filter</span>
                </button>

                {showFilters && (
                  <div className="absolute right-0 z-50 mt-2 w-60 rounded-lg border border-slate-200 bg-white shadow-xl">
                    <div className="p-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`w-full rounded px-4 py-2 text-left text-sm transition hover:bg-slate-100 ${
                            filters.category === category || 
                            (category === 'All' && !filters.category)
                              ? 'bg-primary-50 font-semibold text-primary-700'
                              : 'text-slate-700'
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

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Browse by</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = filters.category === category || (category === 'All' && !filters.category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? 'bg-[#0B1220] text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.search) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.category && filters.category !== 'All' && (
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                    Category: {filters.category}
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: '' })}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                    Search: {filters.search}
                    <button
                      type="button"
                      onClick={() => {
                        updateFilters({ search: '' });
                        setSearchTerm('');
                      }}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="container-custom section-padding">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="mb-4 text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg bg-[#0B1220] px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
              >
                Retry
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="mb-4 text-lg text-slate-600">No blog posts found.</p>
              {(filters.category || filters.search) && (
                <button
                  type="button"
                  onClick={() => {
                    updateFilters({ category: '', search: '' });
                    setSearchTerm('');
                  }}
                  className="font-medium text-primary-700 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {featuredBlog ? (
                <div className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Featured insight</p>
                  <BlogCard post={featuredBlog} featured />
                </div>
              ) : null}

              <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {remainingBlogs.map((blog) => (
                  <BlogCard key={blog._id} post={blog} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                              type="button"
                              onClick={() => handlePageChange(page)}
                              className={`rounded-lg px-4 py-2 text-sm transition ${
                                page === pagination.currentPage
                                  ? 'bg-[#0B1220] font-semibold text-white'
                                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
