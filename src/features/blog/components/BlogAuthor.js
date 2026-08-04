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
      className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-white"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="h-1 bg-[#e0ae00]" aria-hidden />
      <div className="p-6 sm:p-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-left">
          Written by
        </p>
        <div className="mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#0B1220] ring-4 ring-[#e0ae00]/20 flex items-center justify-center">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-full w-full object-cover"
                itemProp="image"
              />
            ) : (
              <FaUser className="text-white text-xl" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-nexa-heavy text-lg tracking-tight text-[#0B1220]" itemProp="name">
              {authorName}
            </h4>
            <p className="mt-0.5 text-sm font-medium text-slate-500">{authorRole || 'Author of this article'}</p>
            {authorBio ? (
              <div
                className="prose prose-sm mt-3 max-w-none text-left leading-relaxed text-slate-600 prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
                itemProp="description"
                dangerouslySetInnerHTML={{ __html: authorBio }}
              />
            ) : null}
            {authorLinkedin ? (
              <div className="mt-4 flex items-center justify-center sm:justify-start">
                <a
                  href={authorLinkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#0B1220] hover:bg-[#0B1220] hover:text-white"
                >
                  <FaLinkedin /> Connect on LinkedIn
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAuthor;

