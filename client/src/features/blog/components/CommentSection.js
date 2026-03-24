'use client';

import React, { useState } from 'react';
import { FaComment, FaUser, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

/**
 * CommentSection - Display and submit comments for a blog post
 */
const CommentSection = ({
  blogId,
  comments = [],
  commentsLoading,
  commentsError,
  submitComment,
  submitCommentLoading,
  submitCommentError
}) => {
  const [form, setForm] = useState({ name: '', email: '', comment: '' });

  if (!blogId) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitComment(blogId, form);
    if (result?.success) {
      setForm({ name: '', email: '', comment: '' });
    }
  };

  return (
    <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200" aria-label="Comments">
      <h3 className="text-lg sm:text-xl font-semibold text-dark-blue mb-6 flex items-center gap-2">
        <FaComment className="w-5 h-5 text-yellow" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="comment-name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                maxLength={100}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="comment-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment-body" className="block text-sm font-medium text-gray-700 mb-1">
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment-body"
            placeholder="Share your thoughts..."
            value={form.comment}
            onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
            required
            minLength={2}
            maxLength={2000}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent resize-y"
          />
          <p className="mt-1 text-xs text-gray-500">{form.comment.length}/2000</p>
        </div>
        {submitCommentError && (
          <p className="mb-3 text-sm text-red-600" role="alert">{submitCommentError}</p>
        )}
        <button
          type="submit"
          disabled={submitCommentLoading}
          className="inline-flex items-center gap-2 bg-dark-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-dark-blue/90 focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {submitCommentLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <FaPaperPlane className="w-4 h-4" />
              Post Comment
            </>
          )}
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {commentsLoading && (
          <div className="flex items-center gap-2 text-gray-500 py-4">
            <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-dark-blue rounded-full animate-spin" />
            Loading comments...
          </div>
        )}
        {commentsError && !commentsLoading && (
          <p className="text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">{commentsError}</p>
        )}
        {!commentsLoading && !commentsError && comments.length === 0 && (
          <p className="text-gray-500 py-4">No comments yet. Be the first to share your thoughts!</p>
        )}
        {!commentsLoading && comments.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {comments.map((c) => (
              <li key={c._id} className="py-4 first:pt-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-dark-blue/10 flex items-center justify-center flex-shrink-0">
                    <FaUser className="w-4 h-4 text-dark-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <time className="text-xs text-gray-500" dateTime={c.createdAt}>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : ''}
                    </time>
                    <p className="mt-2 text-gray-600 whitespace-pre-wrap break-words">{c.comment}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
