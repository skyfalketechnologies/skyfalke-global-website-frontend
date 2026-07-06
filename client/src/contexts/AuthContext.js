'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

/** True when the request never reached the server (API down, DNS, CORS preflight failure, etc.) */
const isUnreachableError = (error) => {
  if (!error || error.response) return false;
  const code = error.code;
  if (code === 'ERR_NETWORK' || code === 'ECONNABORTED') return true;
  const msg = typeof error.message === 'string' ? error.message : '';
  return msg.includes('Network Error');
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Set up api defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Initialize auth state on app load (token + user) on client side only
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      const storedToken = localStorage.getItem('token');

      // No token stored – mark auth as not loading
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // We have a token – set it and fetch the current user before clearing loading
      setToken(storedToken);

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const response = await api.get('/api/auth/me');
        setUser(response.data);
      } catch (error) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          setToken(null);
        } else if (isUnreachableError(error) || (status >= 500 && status < 600)) {
          // API unreachable or server error: keep token so a valid session resumes when API is back
          if (process.env.NODE_ENV === 'development') {
            console.debug(
              '[Auth] Session not validated (API unavailable or server error).'
            );
          }
        } else {
          localStorage.removeItem('token');
          setToken(null);
          if (process.env.NODE_ENV === 'development') {
            console.debug('[Auth] Session invalid:', status ?? error.code);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      // Ensure user object has all required fields
      if (!userData || !userData.role) {
        console.error('Login response missing user data or role:', userData);
        return { 
          success: false, 
          message: 'Invalid user data received from server' 
        };
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Fetch complete user object from /api/auth/me to ensure consistency
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        const meResponse = await api.get('/api/auth/me');
        if (meResponse.data) {
          setUser(meResponse.data);
          return { success: true, user: meResponse.data };
        }
      } catch (meError) {
        console.warn('Failed to fetch user from /api/auth/me, using login response:', meError);
      }
      
      // Fallback to user data from login response
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      // Enhanced error logging
      let errorMessage = 'Login failed';
      
      if (error.code === 'ERR_CERT_DATE_INVALID' || error.message?.includes('CERT_DATE_INVALID')) {
        errorMessage = 'SSL certificate error: The API server certificate is invalid or expired. Please contact support.';
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error - SSL Certificate Issue:', {
            message: error.message,
            code: error.code,
            apiUrl: api.defaults.baseURL
          });
        }
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error - Network Issue:', {
            message: error.message,
            code: error.code,
            apiUrl: api.defaults.baseURL
          });
        }
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error - Server Response:', {
            status: error.response.status,
            data: error.response.data,
            message: error.response.data?.message
          });
        }
      } else {
        // Request was made but no response received
        errorMessage = error.message || 'Login failed. Please try again.';
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error - Request Error:', {
            message: error.message,
            code: error.code,
            stack: error.stack
          });
        }
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      setUser(response.data);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'super_admin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'super_admin' || user?.email === 'mronald@skyfalke.com';
  };

  /** Any staff role that may open /system/dashboard (CMS + Employee Portal) */
  const canAccessSystemDashboard = useCallback(() => {
    if (!user) return false;
    const staff = [
      'super_admin',
      'admin',
      'editor',
      'accounts',
      'hr',
      'employee',
      'finance'
    ];
    return staff.includes(user.role) || user.email === 'mronald@skyfalke.com';
  }, [user]);

  /** CMS content areas: admins + editors */
  const canAccessCMS = useCallback(() => {
    if (!user) return false;
    return (
      user.role === 'super_admin' ||
      user.role === 'admin' ||
      user.role === 'editor' ||
      user.email === 'mronald@skyfalke.com'
    );
  }, [user]);

  /** HR Management sidebar (employees, attendance) — HR, Admin, Super Admin */
  const canAccessHRModule = useCallback(() => {
    if (!user) return false;
    return (
      user.role === 'super_admin' ||
      user.role === 'admin' ||
      user.role === 'hr' ||
      user.email === 'mronald@skyfalke.com'
    );
  }, [user]);

  /** Accounting & Finance module: Super Admin, Finance, or Accounts */
  const canAccessAccounting = useCallback(() => {
    if (!user) return false;
    return (
      user.role === 'super_admin' ||
      user.role === 'accounts' ||
      user.role === 'finance' ||
      user.email === 'mronald@skyfalke.com'
    );
  }, [user]);

  const getToken = () => {
    return token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    canAccessSystemDashboard,
    canAccessCMS,
    canAccessHRModule,
    canAccessAccounting,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
