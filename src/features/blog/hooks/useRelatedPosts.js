import { useState, useEffect } from 'react';
import { apiGet } from '../../../utils/api';

/**
 * Custom hook for fetching related blog posts
 */
export const useRelatedPosts = (postId, category, tags = []) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check for SSR-injected data first
        const initialData = window.__INITIAL_DATA__;
        if (initialData?.relatedPosts) {
          setRelatedPosts(initialData.relatedPosts);
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await apiGet(`/api/blogs/${postId}/related`);
        setRelatedPosts(response.data || []);
      } catch (error) {
        console.error('[useRelatedPosts] Error fetching related posts:', error);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [postId, category, tags]);

  return { relatedPosts, loading };
};

