'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowRight,
  FaUser,
  FaClock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { apiGet } from '../../utils/api';
import SocialSharing from '../SocialSharing';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured blogs from API
  const fetchBlogs = async () => {
    // Only fetch on client side
    if (typeof window === 'undefined') return;
    
    try {
      setLoading(true);
      const response = await apiGet('/api/blogs?limit=3&featured=true');
      setBlogs(response.data?.blogs || []);
    } catch (error) {
      // Silently handle network errors - API might not be available
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch blogs';
      const errorDetails = {
        message: errorMessage,
        status: error?.response?.status,
        url: error?.config?.url,
          code: error?.code,
          note: error?.code === 'ERR_NETWORK' ? 'API server may be unavailable' : 'Request failed'
      };
        console.warn('Blog fetch error (non-critical):', errorDetails);
      }
      // Set empty array to show no blogs gracefully
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);


  const getCategoryColor = (category) => {
    const colors = {
      'Digital Marketing': 'bg-blue-100 text-blue-600',
      'Cloud Solutions': 'bg-green-100 text-green-600',
      'Technology': 'bg-purple-100 text-purple-600',
      'Business': 'bg-orange-100 text-orange-600',
      'Industry Insights': 'bg-pink-100 text-pink-600'
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading latest insights...</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no blogs available (API might be down)
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest Insights
          </h2>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.filter(blog => blog).map((blog, index) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Featured Image */}
                <div className="relative w-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {blog.featuredImage?.url ? (
                    <img
                      src={blog.featuredImage.url}
                      alt={blog.featuredImage.alt || blog.title}
                      className="w-full h-auto object-contain blog-card-image"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {blog.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30"></div>
                  
                  {/* Category Badge */}
                  {blog.category && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(blog.category)}`}>
                        {blog.category}
                      </span>
                    </div>
                  )}

                  {/* Read Time */}
                  {blog.readTime && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center space-x-1">
                      <FaClock />
                      <span>{blog.readTime} min read</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <FaUser />
                      <span>{blog.author?.name || blog.author || 'Skyfalke Team'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Sharing */}
                  <div className="mb-4">
                    <SocialSharing
                      title={blog.title}
                      url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${blog.slug}` : `/blog/${blog.slug}`}
                      description={blog.excerpt}
                      image={blog.featuredImage?.url || ''}
                      platforms={['facebook', 'whatsapp', 'twitter', 'linkedin']}
                      size="small"
                      className="justify-start"
                    />
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 group/link"
                  >
                    <span>Read Article</span>
                    <FaArrowRight className="ml-2 text-sm group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
