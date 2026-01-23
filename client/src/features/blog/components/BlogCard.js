'use client';

import React from 'react';
import Link from 'next/link';
import { FaUser, FaClock, FaCalendar } from 'react-icons/fa';
import { formatBlogDate, getReadingTime } from '../utils/formatters';

/**
 * Blog Card Component - Displays blog post preview
 * SEO-friendly with proper semantic HTML
 */
const BlogCard = ({ post, featured = false }) => {
  if (!post) return null;

  const cardClasses = featured
    ? 'bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'
    : 'bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300';

  return (
    <article className={cardClasses} itemScope itemType="https://schema.org/BlogPosting">
      {post.featuredImage?.url && (
        <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden">
          <img
            src={post.featuredImage.url}
            alt={post.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            itemProp="image"
          />
        </Link>
      )}
      
      <div className="p-6">
        {post.category && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-yellow bg-yellow/10 rounded-full capitalize">
              {post.category}
            </span>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-yellow transition-colors"
            itemProp="headline"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3" itemProp="description">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            {post.author?.name && (
              <div className="flex items-center gap-1">
                <FaUser className="w-3 h-3" />
                <span itemProp="author">{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <FaCalendar className="w-3 h-3" />
                <time dateTime={post.publishedAt} itemProp="datePublished">
                  {formatBlogDate(post.publishedAt)}
                </time>
              </div>
            )}
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              <span>{post.readingTime}</span>
            </div>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
                itemProp="keywords"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogCard;

