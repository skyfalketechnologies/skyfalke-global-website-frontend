'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/Admin/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboardLayout({ children }) {
  const { user, loading, isAuthenticated, canAccessSystemDashboard } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated() || !canAccessSystemDashboard())) {
      router.push('/system/portal/access');
    }
  }, [loading, user, router, canAccessSystemDashboard, isAuthenticated]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated() || !canAccessSystemDashboard()) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

