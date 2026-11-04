'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiGet, apiPost } from '../../../utils/api';

/**
 * Custom hook for fetching and managing a single blog post
 * Handles SSR data, loading states, and view tracking
 */
export const useBlogPost = () => {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for SSR-injected initial data
        const initialData = window.__INITIAL_DATA__;
        if (initialData?.post && initialData.post.slug === slug) {
          console.log('[useBlogPost] Using SSR-injected data');
          setPost(initialData.post);
          setLoading(false);
          
          // Clear initial data to prevent reuse
          window.__INITIAL_DATA__ = null;
          
          // Track view in background
          trackView(initialData.post._id).catch(console.error);
          return;
        }

        // Fetch from API
        const response = await apiGet(`/api/blogs/slug/${slug}`);
        setPost(response.data);
        
        // Track view in background
        if (response.data?._id) {
          trackView(response.data._id).catch(console.error);
        }
      } catch (err) {
        console.error('[useBlogPost] Error fetching post:', err);
        setError(err.response?.status === 404 ? 'Post not found' : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
};

/**
 * Track blog post view with session storage to prevent duplicate counts
 */
const trackView = async (blogId) => {
  try {
    const viewedBlogs = JSON.parse(sessionStorage.getItem('viewedBlogs') || '[]');
    
    if (viewedBlogs.includes(blogId)) {
      return; // Already viewed in this session
    }

    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }

    const response = await apiPost(`/api/blogs/${blogId}/view`, {}, {
      headers: { 'X-Session-ID': sessionId }
    });

    if (response.data?.viewCounted) {
      viewedBlogs.push(blogId);
      sessionStorage.setItem('viewedBlogs', JSON.stringify(viewedBlogs));
    }
  } catch (error) {
    console.error('[useBlogPost] Error tracking view:', error);
    // Don't fail the page load if view tracking fails
  }
};

