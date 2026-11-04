'use client';

import React from 'react';
import BlogCard from './BlogCard';

/**
 * Related Posts Component - Displays related blog posts
 * SEO-friendly with proper semantic HTML
 */
const RelatedPosts = ({ posts, loading }) => {
  if (loading) {
    return (
      <section className="bg-white rounded-xl p-6" aria-label="Related articles">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) return null;

  return (
    <section className="bg-white rounded-xl p-6" aria-label="Related articles">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;

