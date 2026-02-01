'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Blog = dynamic(() => import('@/pageComponents/Blog'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function BlogClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Blog />
    </Suspense>
  );
}

