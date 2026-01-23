'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import QuotationList from '../components/Admin/QuotationList';
import QuotationForm from '../components/Admin/QuotationForm';
import QuotationView from '../components/Admin/QuotationView';
import QuotationStats from '../components/Admin/QuotationStats';

const QuotationsPage = () => {
  const pathname = usePathname();
  
  // Handle routing based on pathname
  if (pathname?.endsWith('/stats')) {
    return <QuotationStats />;
  }
  if (pathname?.endsWith('/new')) {
    return <QuotationForm />;
  }
  if (pathname?.includes('/edit')) {
    return <QuotationForm />;
  }
  if (pathname && pathname !== '/system/dashboard/quotations' && !pathname.endsWith('/quotations')) {
    // Extract ID from pathname if it's a detail view
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment !== 'quotations' && lastSegment !== 'stats' && lastSegment !== 'new') {
      return <QuotationView />;
    }
  }
  
  return <QuotationList />;
};

export default QuotationsPage;
