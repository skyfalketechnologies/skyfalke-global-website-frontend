'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import AccessDenied from '../pageComponents/Admin/AccessDenied';

const ProtectedRoute = ({ children, adminOnly = false, requireSecureLogin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        // Redirect to portal access login
        router.push('/system/portal/access');
      } else if (adminOnly && !isAdmin()) {
        // Log unauthorized admin access attempt
        console.log('Admin access check failed:', { 
          user: user, 
          role: user?.role, 
          isAdmin: isAdmin(),
          isSuperAdmin: user?.role === 'super_admin' || user?.email === 'mronald@skyfalke.com'
        });
      }
    }
  }, [loading, isAuthenticated, isAdmin, router, adminOnly, requireSecureLogin, user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <LoadingSpinner />; // Will redirect via useEffect
  }

  if (adminOnly && !isAdmin()) {
    return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;
