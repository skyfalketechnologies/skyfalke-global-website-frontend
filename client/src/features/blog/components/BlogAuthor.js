import React from 'react';
import { FaUser } from 'react-icons/fa';

/**
 * Blog Author Component - Displays author information
 * SEO-friendly with proper schema markup
 */
const BlogAuthor = ({ author }) => {
  if (!author) return null;

  const authorName = typeof author === 'string' ? author : author.name;

  return (
    <div 
      className="bg-gray-50 rounded-xl p-6 mt-8"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-dark-blue rounded-full flex items-center justify-center flex-shrink-0">
          <FaUser className="text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900" itemProp="name">
            About {authorName}
          </h4>
          <p className="text-gray-600 text-sm">Author of this article</p>
        </div>
      </div>
    </div>
  );
};

export default BlogAuthor;

