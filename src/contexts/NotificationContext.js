'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import logger from '../utils/logger';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated, getToken } = useAuth();
  const initializingRef = useRef(false);

  // Initialize WebSocket connection
  const initializeSocket = useCallback(async () => {
    if (!isAuthenticated() || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    // Prevent multiple simultaneous initializations
    if (initializingRef.current) {
      return;
    }

    // Prevent multiple socket connections
    if (socket && socket.connected) {
      return;
    }

    initializingRef.current = true;

    // Optional health check - don't block on network errors
    // Socket connection will proceed regardless of health check result
    try {
      await api.get('/api/health', { timeout: 5000 });
    } catch (error) {
      // Only log meaningful errors in development
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = error?.message || error?.response?.data?.message || String(error);
        // Skip logging generic network errors
        if (errorMessage && errorMessage !== 'Network Error' && errorMessage !== '[object Object]') {
          logger.error('Server health check failed:', errorMessage);
        }
      }
      // Continue with socket initialization even if health check fails
      // Network errors don't necessarily mean socket won't work
    }

    // Close existing socket if any
    if (socket) {
      socket.close();
    }

    // Initializing new WebSocket connection...
    const WEBSOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://apis.mwangikinyanjuiadvocates.com';
    const newSocket = io(WEBSOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      timeout: 10000,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      maxReconnectionAttempts: 3
    });

    newSocket.on('connect', () => {
      setConnected(true);
      initializingRef.current = false;
    });

    newSocket.on('disconnect', (reason) => {
      setConnected(false);
      initializingRef.current = false;
    });

    newSocket.on('connect_error', (error) => {
      // Only log if in development and if error has meaningful information
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = error?.message || error?.description || String(error);
        if (errorMessage && errorMessage !== '[object Object]' && errorMessage !== '{}') {
          logger.error('WebSocket connection error:', errorMessage);
        }
      }
      setConnected(false);
      initializingRef.current = false;
      
      // If connection fails, try again after a delay (only in development or if explicitly needed)
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          if (isAuthenticated() && user?.role === 'admin' && !socket?.connected) {
            initializingRef.current = false;
            initializeSocket();
          }
        }, 3000);
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      setConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      // Only log if in development
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = error?.message || error?.description || String(error);
        if (errorMessage && errorMessage !== '[object Object]' && errorMessage !== '{}') {
          logger.error('WebSocket reconnection error:', errorMessage);
        }
      }
    });

    newSocket.on('reconnect_failed', () => {
      // Only log if in development
      if (process.env.NODE_ENV === 'development') {
        logger.error('WebSocket reconnection failed');
      }
      initializingRef.current = false;
    });

    newSocket.on('new-notification', (data) => {
      const { notification, unreadCount: newUnreadCount } = data;
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(newUnreadCount);
    });

    newSocket.on('unread-count', (data) => {
      setUnreadCount(data.unreadCount);
    });

    newSocket.on('system-message', (data) => {
      // Handle system messages silently
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [isAuthenticated, user, getToken]);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/notifications/admin?page=${page}&limit=${limit}`);
      
      if (response.data.success) {
        const { notifications: newNotifications, unreadCount: newUnreadCount, pagination } = response.data.data;
        
        if (page === 1) {
          setNotifications(newNotifications);
          // Set total count from pagination on first page load
          if (pagination && pagination.total !== undefined) {
            setTotalCount(pagination.total);
          } else {
            setTotalCount(newNotifications.length);
          }
        } else {
          setNotifications(prev => [...prev, ...newNotifications]);
        }
        
        setUnreadCount(newUnreadCount);
      }
    } catch (error) {
      logger.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      if (socket) {
        socket.emit('mark-notification-read', { notificationId });
      }
      
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Also update via API
      await api.patch(`/api/notifications/admin/${notificationId}/read`);
    } catch (error) {
      logger.error('Error marking notification as read:', error);
    }
  }, [socket]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      if (socket) {
        socket.emit('mark-all-read');
      }
      
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      
      // Also update via API
      await api.patch('/api/notifications/admin/mark-all-read');
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
    }
  }, [socket]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await api.delete(`/api/notifications/admin/${notificationId}`);
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.filter(notification => notification._id !== notificationId)
        );
        setUnreadCount(response.data.data.unreadCount);
        setTotalCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      logger.error('Error deleting notification:', error);
    }
  }, []);



  // Initialize socket when user is authenticated as admin
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    if (initializingRef.current) {
      return;
    }

    if (socket && socket.connected) {
      return;
    }

    initializingRef.current = true;

    // Health check before connecting (optional - don't block on network errors)
    const checkServerHealth = async () => {
      try {
        const response = await api.get('/api/health', { timeout: 5000 });
        return response;
      } catch (error) {
        // If it's a network error, return null instead of throwing
        // This allows the socket to connect anyway
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          return null;
        }
        throw error;
      }
    };

    const WEBSOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://apis.mwangikinyanjuiadvocates.com';

    checkServerHealth()
      .then((healthResponse) => {
        // Close existing socket if any
        if (socket) {
          socket.close();
        }
        
        // Proceed with socket connection regardless of health check result
        // (health check might fail due to network issues but socket might still work)
        const newSocket = io(WEBSOCKET_URL, {
          auth: {
            token: getToken()
          },
          transports: ['polling', 'websocket'],
          timeout: 10000,
          forceNew: false,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
          maxReconnectionAttempts: 3
        });
        
        newSocket.on('connect', () => {
          setSocket(newSocket);
          setConnected(true);
          initializingRef.current = false;
        });

        newSocket.on('disconnect', (reason) => {
          setConnected(false);
          if (reason !== 1000) { // 1000 means normal close
            setTimeout(() => {
              initializingRef.current = false;
            }, 5000);
          }
          setSocket(null);
        });

        newSocket.on('connect_error', (error) => {
          // Only log if in development and if error has meaningful information
          if (process.env.NODE_ENV === 'development') {
            const errorMessage = error?.message || error?.description || String(error);
            if (errorMessage && errorMessage !== '[object Object]' && errorMessage !== '{}') {
              logger.error('WebSocket connection error:', errorMessage);
            }
          }
          initializingRef.current = false;
        });

        newSocket.on('reconnect', (attemptNumber) => {
          setConnected(true);
        });

        newSocket.on('reconnect_error', (error) => {
          // Only log if in development
          if (process.env.NODE_ENV === 'development') {
            const errorMessage = error?.message || error?.description || String(error);
            if (errorMessage && errorMessage !== '[object Object]' && errorMessage !== '{}') {
              logger.error('WebSocket reconnection error:', errorMessage);
            }
          }
        });

        newSocket.on('reconnect_failed', () => {
          // Only log if in development
          if (process.env.NODE_ENV === 'development') {
            logger.error('WebSocket reconnection failed');
          }
          initializingRef.current = false;
        });

        newSocket.on('new-notification', (data) => {
          const { notification, unreadCount: newUnreadCount } = data;
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(newUnreadCount);
          setTotalCount(prev => prev + 1);
        });

        newSocket.on('unread-count', (data) => {
          setUnreadCount(data.unreadCount);
        });

        newSocket.on('system-message', (data) => {
          // Handle system messages
        });
      })
      .catch((error) => {
        // Only log if in development and error has meaningful information
        if (process.env.NODE_ENV === 'development') {
          const errorMessage = error?.message || error?.response?.data?.message || String(error);
          // Only log if it's a meaningful error message (not just "Network Error" or empty)
          if (errorMessage && errorMessage !== 'Network Error' && errorMessage !== '[object Object]') {
            logger.error('Server health check failed:', errorMessage);
          }
        }
        // Reset initialization flag even on error to allow retry
        initializingRef.current = false;
      });
  }, [user, socket, getToken]);

  // Fetch initial notifications
  useEffect(() => {
    if (isAuthenticated() && (user?.role === 'admin' || user?.role === 'super_admin')) {
      fetchNotifications();
    }
  }, [isAuthenticated, user, fetchNotifications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const value = {
    notifications,
    unreadCount,
    totalCount,
    loading,
    connected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
