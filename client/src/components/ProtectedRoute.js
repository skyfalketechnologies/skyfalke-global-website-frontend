import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import AccessDenied from '../pages/Admin/AccessDenied';

const ProtectedRoute = ({ children, adminOnly = false, requireSecureLogin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    // Redirect to hidden login if required, otherwise regular login
    const loginPath = requireSecureLogin ? '/system/portal/access' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    // Log unauthorized admin access attempt
    console.log('Admin access check failed:', { 
      user: user, 
      role: user?.role, 
      isAdmin: isAdmin(),
      isSuperAdmin: user?.role === 'super_admin' || user?.email === 'mronald@skyfalke.com'
    });
    
    return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;
