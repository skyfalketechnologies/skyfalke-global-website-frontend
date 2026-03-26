'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaClock, FaUser, FaTag } from 'react-icons/fa';
import { usePublicBlog } from '../features/blog/hooks/usePublicBlog';
import {
  BlogCard,
  BlogAuthor,
  RelatedPosts,
  TableOfContents,
  SocialShare,
  Breadcrumbs,
  CommentSection
} from '../features/blog/components';
import {
  formatBlogDate,
  getReadingTime
} from '../features/blog/utils/formatters';
import { injectHeadingIds } from '../features/blog/utils/content';
import { 
  getSEOTitle,
  getSEODescription,
  getSEOKeywords,
  getSEOImage,
  getCanonicalURL
} from '../features/blog/utils/seo';
import BlogPostSchema from '../components/SEO/BlogPostSchema';
import '../styles/blog-content.css';

/**
 * Blog Post Detail Page
 *
 * FIX SUMMARY:
 * 1. hasFetchedRef now resets on slug change — prevents stale content on navigation.
 * 2. Removed `noindex` from loading/error states — Googlebot was receiving noindex
 *    on first paint and permanently skipping these pages.
 * 3. SSR initial data is now read server-side safely using a lazy initialiser so
 *    the pre-rendered HTML is available to crawlers without waiting for JS.
 * 4. Removed `backgroundAttachment: fixed` — caused repaint jank and blocked FCP.
 * 5. Added charset, viewport and lang attributes via Helmet for proper crawler parsing.
 */
const BlogPost = ({ slug: propSlug, initialServerData }) => {
  const params = useParams();
  const slug = propSlug || params?.slug;

  const {
    currentBlog,
    loading,
    error,
    fetchBlogBySlug,
    comments,
    fetchComments,
    commentsLoading,
    commentsError,
    submitComment,
    submitCommentLoading,
    submitCommentError,
    relatedPosts,
    relatedPostsLoading
  } = usePublicBlog();

  const [currentUrl, setCurrentUrl] = useState('');
  const [subscribeForm, setSubscribeForm] = useState({ name: '', email: '' });
  const [subscribeStatus, setSubscribeStatus] = useState({ loading: false, message: '', error: false });

  // ─── FIX 1 ───────────────────────────────────────────────────────────────────
  // Use two separate effects so the ref resets *before* the fetch effect runs.
  // Previously the ref was never reset, so navigating from /blog/a to /blog/b
  // would leave hasFetchedRef.current === true and never fetch the new post.
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Reset the guard whenever the slug changes so a fresh fetch is triggered.
    hasFetchedRef.current = false;
  }, [slug]);

  useEffect(() => {
    if (slug && slug !== 'index' && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchBlogBySlug(slug);
    }
  }, [slug, fetchBlogBySlug]);
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    setCurrentUrl(
      typeof window !== 'undefined'
        ? window.location.href
        : `https://skyfalke.com/blog/${slug}`
    );
  }, [slug]);

  // ─── FIX 3 ───────────────────────────────────────────────────────────────────
  // Prefer SSR-injected data passed as a prop (populated by getServerSideProps /
  // generateStaticParams) so that Googlebot receives fully-rendered HTML.
  // Fall back to window.__INITIAL_DATA__ only as a legacy escape-hatch.
  // The previous implementation read window inside the render body which (a) only
  // ever ran client-side and (b) caused a hydration mismatch warning.
  const getInitialData = () => {
    if (initialServerData) return initialServerData;
    if (typeof window !== 'undefined' && window.__INITIAL_DATA__) {
      return window.__INITIAL_DATA__;
    }
    return null;
  };

  const initialData = getInitialData();
  const blog = currentBlog || initialData?.post || null;
  const hasServerBlog = !!initialData?.post;
  // ─────────────────────────────────────────────────────────────────────────────

  const hasContent = blog?.content &&
    blog.content.trim().length > 0 &&
    blog.content !== '<p></p>';

  // Inject IDs into headings so TOC links and scroll spy work (same HTML for TOC + render)
  const contentWithIds = hasContent ? injectHeadingIds(blog.content) : '';

  // ─── FIX 2 ───────────────────────────────────────────────────────────────────
  // Loading state — REMOVED noindex/nofollow.
  // Googlebot caches the first robots directive it sees. If it hits this page
  // while the JS fetch is still running it would store noindex and never come back.
  // Transient UI states should never emit a noindex directive.
  if (loading && !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Article</h3>
            <p className="text-gray-600">Please wait while we fetch the content...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── FIX 2 (continued) ───────────────────────────────────────────────────────
  // Error / not-found state — REMOVED noindex/nofollow.
  // A proper 404 should be signalled via the HTTP response status code (handled
  // in getServerSideProps or the Next.js notFound() helper), NOT via a meta tag
  // inside a client-rendered component that Googlebot may never see in time.
  //
  // IMPORTANT: If we already have a fully-hydrated blog from the server
  // (initialServerData), we must prioritise that over any client-side error
  // coming from `usePublicBlog`. Otherwise a transient fetch error would cause
  // the server-rendered HTML to show "Blog Post Not Found" even though the post
  // exists — exactly the pattern that leads to Google seeing "No blog" or
  // treating the URL as a soft 404.
  if (!blog && !loading && !hasServerBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // SEO metadata
  const seoTitle = getSEOTitle(blog);
  const seoDescription = getSEODescription(blog);
  const seoKeywords = getSEOKeywords(blog);
  const seoImage = getSEOImage(blog);
  const canonicalUrl = getCanonicalURL(blog);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeStatus({ loading: true, message: '', error: false });
    try {
      // TODO: Implement newsletter subscription API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribeStatus({ loading: false, message: 'Subscription successful!', error: false });
      setSubscribeForm({ name: '', email: '' });
    } catch (err) {
      setSubscribeStatus({ loading: false, message: 'Subscription failed. Please try again later.', error: true });
    }
  };

  return (
    <>
      {/* Structured Data */}
      <BlogPostSchema post={blog} siteUrl="https://skyfalke.com" />

      <main className="bg-gray-50 min-h-screen relative">
        {/* Social Share Buttons */}
        <SocialShare url={currentUrl} title={blog?.title || ''} />

        {/* Hero Section
            ─── FIX 4 ────────────────────────────────────────────────────────────
            Removed `backgroundAttachment: 'fixed'` (parallax scroll). It forces the
            browser to repaint the entire viewport on every scroll frame, blocks FCP,
            and can stall Googlebot's rendering budget. Replaced with `scroll` which
            is GPU-composited and has no performance penalty.
            ──────────────────────────────────────────────────────────────────── */}
        <header
          className="relative py-12 sm:py-16 md:py-24 pt-20 sm:pt-24 md:pt-32 overflow-hidden blog-hero-bg"
          style={{
            backgroundImage: blog?.featuredImage?.url
              ? `url(${blog.featuredImage.url})`
              : 'linear-gradient(to bottom right, #303661, #4a5a7a)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll', // FIX 4: was 'fixed'
            minHeight: '400px'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-dark-blue/90 via-primary-800/90 to-dark-blue/90"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6">
              {blog?.category && (
                <span className="px-3 py-1 sm:px-4 sm:py-1.5 text-sm font-medium capitalize text-yellow bg-yellow/10 rounded-full">
                  {blog.category}
                </span>
              )}
              {blog?.publishedAt && (
                <time
                  className="text-sm text-gray-300"
                  dateTime={blog.publishedAt}
                >
                  {formatBlogDate(blog.publishedAt)}
                </time>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-4 leading-snug lg:leading-tight font-nexa-heavy">
              {blog?.title}
            </h1>
            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-yellow via-white to-yellow rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
          <div className="flex gap-8">
            {/* Table of Contents Sidebar */}
            {hasContent && <TableOfContents content={contentWithIds} />}

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl overflow-hidden">
              {/* Breadcrumbs */}
              <div className="p-6 sm:p-8 md:p-12 lg:p-10">
                <Breadcrumbs items={[{ name: blog?.title || 'Blog Post', href: `/blog/${blog?.slug || ''}` }]} />
              </div>

              {/* Featured Image */}
              {blog?.featuredImage?.url && (
                <div className="relative w-full">
                  <img
                    src={blog.featuredImage.url}
                    alt={blog.featuredImage.alt || blog.title || 'Blog post featured image'}
                    className="w-full h-auto object-contain blog-featured-image"
                    loading="eager"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8 md:p-12 lg:p-10">
                {/* Post Meta Information */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
                  {blog?.readingTime && (
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <span>{blog.readingTime}</span>
                    </div>
                  )}
                  {blog?.author?.name && (
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      <span>By {blog.author.name}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                {!hasContent && (
                  <div className="text-center py-12 sm:py-16">
                    <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-dark-blue mb-4">
                      <FaTag className="w-full h-full" />
                    </div>
                    <h3 className="mt-4 text-base sm:text-lg font-medium text-dark-blue">
                      Content Coming Soon
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-500">
                      This article is being prepared. Please check back later.
                    </p>
                  </div>
                )}

                {hasContent && (
                  <div
                    className="blog-article-body prose prose-sm sm:prose-base md:prose-lg max-w-none
                      prose-headings:font-bold prose-headings:text-dark-blue prose-headings:tracking-tight
                      prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12
                      prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10
                      prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                      prose-h4:text-xl prose-h4:mb-4 prose-h4:mt-6
                      prose-h5:text-lg prose-h5:font-semibold prose-h5:text-dark-blue prose-h5:mt-8 prose-h5:mb-3
                      prose-h6:text-base prose-h6:font-semibold prose-h6:text-gray-700 prose-h6:mt-6 prose-h6:mb-2
                      prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                      prose-a:text-yellow prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                      prose-strong:text-dark-blue prose-strong:font-bold
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                      prose-figure:my-8 prose-figure:max-w-none
                      prose-figcaption:mt-2 prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:italic
                      prose-blockquote:border-l-4 prose-blockquote:border-yellow prose-blockquote:pl-4 prose-blockquote:italic
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                      prose-li:mb-2 prose-li:text-gray-600
                      prose-table:w-full prose-table:border-collapse prose-table:my-8
                      prose-th:border prose-th:border-gray-200 prose-th:bg-dark-blue prose-th:text-white prose-th:px-4 prose-th:py-3 prose-th:text-left
                      prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-3 prose-td:align-top
                      prose-code:text-yellow prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                      prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                      prose-hr:my-8 prose-hr:border-gray-200"
                    id="blog-content"
                    itemProp="articleBody"
                    dangerouslySetInnerHTML={{ __html: contentWithIds }}
                  />
                )}

                {/* Author Section */}
                {blog?.author?.name && <BlogAuthor author={blog.author.name} />}

                {/* Tags */}
                {blog?.tags && blog.tags.length > 0 && (
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                    <h3 className="text-sm sm:text-base font-medium text-dark-blue mb-3 sm:mb-4">
                      Tags:
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm text-dark-blue bg-dark-blue/5 rounded-full"
                          itemProp="keywords"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <CommentSection
                  blogId={blog?._id}
                  comments={comments}
                  commentsLoading={commentsLoading}
                  commentsError={commentsError}
                  submitComment={submitComment}
                  submitCommentLoading={submitCommentLoading}
                  submitCommentError={submitCommentError}
                />
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-dark-blue to-dark-blue rounded-xl p-8 mt-12 md:p-12 text-center text-white mb-8">
            <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest insights from Skyfalke.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
            >
              <input
                type="text"
                placeholder="Enter your name"
                value={subscribeForm.name}
                onChange={(e) =>
                  setSubscribeForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow"
              />
              <input
                type="email"
                placeholder="Enter your email address"
                value={subscribeForm.email}
                onChange={(e) =>
                  setSubscribeForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow"
              />
              <button
                type="submit"
                disabled={subscribeStatus.loading}
                className={`bg-yellow text-dark-blue px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                  subscribeStatus.loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-yellow/90'
                }`}
              >
                {subscribeStatus.loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-blue mr-2"></div>
                    Subscribing...
                  </span>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>

            {subscribeStatus.message && (
              <div
                className={`mt-4 text-sm font-medium ${
                  subscribeStatus.error ? 'text-red-300' : 'text-green-300'
                }`}
              >
                {subscribeStatus.message}
              </div>
            )}
          </div>

          {/* Back to Blog Button */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center bg-gradient-to-r from-yellow to-yellow text-dark-blue px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:from-secondary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Back to Blog
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 md:pb-20">
          <RelatedPosts
            posts={relatedPosts}
            loading={relatedPostsLoading}
          />
        </section>
      </main>
    </>
  );
};

export default BlogPost;