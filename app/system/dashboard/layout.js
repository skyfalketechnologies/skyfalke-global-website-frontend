'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/Admin/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboardLayout({ children }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated() || !isAdmin())) {
      router.push('/system/portal/access');
    }
  }, [loading, user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

