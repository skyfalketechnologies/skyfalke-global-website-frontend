import React from 'react';
import { FaUser, FaLinkedin } from 'react-icons/fa6';

/**
 * Blog Author Component - Displays author information
 * SEO-friendly with proper schema markup
 */
const BlogAuthor = ({ author }) => {
  if (!author) return null;

  const authorName = typeof author === 'string' ? author : author.name;
  const authorRole = typeof author === 'object' ? author.role : '';
  const authorBio = typeof author === 'object' ? author.bio : '';
  const authorAvatar = typeof author === 'object' ? author.avatar : '';
  const authorLinkedin = typeof author === 'object' ? author.linkedin : '';

  return (
    <div 
      className="mt-8 rounded-xl border border-slate-200/80 bg-slate-50 p-6"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-dark-blue flex items-center justify-center flex-shrink-0">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-full w-full object-cover"
              itemProp="image"
            />
          ) : (
            <FaUser className="text-white" />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900" itemProp="name">
            About {authorName}
          </h4>
          <p className="text-gray-600 text-sm">{authorRole || 'Author of this article'}</p>
          {authorBio ? (
            <div
              className="prose prose-sm mt-2 max-w-none leading-relaxed text-gray-700 prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
              itemProp="description"
              dangerouslySetInnerHTML={{ __html: authorBio }}
            />
          ) : null}
          {authorLinkedin ? (
            <div className="mt-3 flex items-center gap-3 text-sm">
              <a href={authorLinkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary-700 hover:underline">
                <FaLinkedin /> LinkedIn
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlogAuthor;

