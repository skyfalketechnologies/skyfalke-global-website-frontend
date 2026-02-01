import { useState, useEffect, useCallback, useRef } from 'react';
import { apiGet, apiPost } from '../../../utils/api';

/**
 * Custom hook for public blog functionality
 * Handles blog fetching, comments, and related posts
 */
export const usePublicBlog = () => {
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedPostsLoading, setRelatedPostsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  /**
   * Fetch blog by slug
   */
  const fetchBlogBySlug = useCallback(async (slug) => {
    if (!slug || slug === 'index') return;
    
    try {
      setLoading(true);
      setError(null);

      // Check for SSR-injected initial data first
      const initialData = window.__INITIAL_DATA__;
      if (initialData?.post && initialData.post.slug === slug) {
        console.log('[usePublicBlog] Using SSR-injected data');
        setCurrentBlog(initialData.post);
        setLoading(false);
        
        // Clear initial data to prevent reuse
        window.__INITIAL_DATA__ = null;
        
        // Fetch related posts and comments in background
        if (initialData.post._id) {
          fetchRelatedPosts(initialData.post._id, initialData.post.category, initialData.post.tags || []).catch(console.error);
          fetchComments(initialData.post._id).catch(console.error);
        }
        
        // Track view
        trackView(initialData.post._id).catch(console.error);
        return;
      }

      // Fetch from API
      const response = await apiGet(`/api/blogs/slug/${slug}`);
      const blogData = response.data;
      
      setCurrentBlog(blogData);
      
      // Fetch related posts and comments in background
      if (blogData._id) {
        fetchRelatedPosts(blogData._id, blogData.category, blogData.tags || []).catch(console.error);
        fetchComments(blogData._id).catch(console.error);
      }
      
      // Track view
      if (blogData._id) {
        trackView(blogData._id).catch(console.error);
      }
    } catch (err) {
      console.error('[usePublicBlog] Error fetching blog:', err);
      setError(err.response?.status === 404 ? 'Blog not found' : 'Failed to load blog post');
      setCurrentBlog(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch comments for a blog post
   */
  const fetchComments = useCallback(async (blogId) => {
    if (!blogId) return;
    
    try {
      setCommentsLoading(true);
      setCommentsError(null);
      
      // TODO: Implement comments API endpoint
      // const response = await apiGet(`/api/blogs/${blogId}/comments`);
      // setComments(response.data || []);
      
      // For now, set empty array
      setComments([]);
    } catch (err) {
      console.error('[usePublicBlog] Error fetching comments:', err);
      setCommentsError('Failed to load comments');
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  /**
   * Fetch related posts
   */
  const fetchRelatedPosts = useCallback(async (blogId, category, tags = []) => {
    if (!blogId) return;
    
    try {
      setRelatedPostsLoading(true);
      
      // Check for SSR-injected related posts
      const initialData = window.__INITIAL_DATA__;
      if (initialData?.relatedPosts) {
        setRelatedPosts(initialData.relatedPosts);
        setRelatedPostsLoading(false);
        return;
      }
      
      // Fetch from API
      const response = await apiGet(`/api/blogs/${blogId}/related`);
      setRelatedPosts(response.data || []);
    } catch (err) {
      console.error('[usePublicBlog] Error fetching related posts:', err);
      setRelatedPosts([]);
    } finally {
      setRelatedPostsLoading(false);
    }
  }, []);

  /**
   * Track blog view with session storage
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
      console.error('[usePublicBlog] Error tracking view:', error);
      // Don't fail the page load if view tracking fails
    }
  };

  return {
    currentBlog,
    loading,
    error,
    fetchBlogBySlug,
    comments,
    fetchComments,
    commentsLoading,
    commentsError,
    relatedPosts,
    relatedPostsLoading
  };
};

