import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../../../utils/api';

/**
 * Custom hook for fetching and managing blog list
 * Handles pagination, filtering, and search
 */
export const useBlogList = (initialFilters = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    limit: 6,
    ...initialFilters
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: filters.limit
      });

      if (filters.category && filters.category !== 'All') {
        params.append('category', filters.category);
      }

      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await apiGet(`/api/blogs?${params}`);
      setBlogs(response.data.blogs || []);
      setPagination({
        currentPage: response.data.currentPage || pagination.currentPage,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0
      });
    } catch (err) {
      console.error('[useBlogList] Error fetching blogs:', err);
      setError('Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, filters.category, filters.search, filters.limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  const goToPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  return {
    blogs,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    goToPage,
    refetch: fetchBlogs
  };
};

