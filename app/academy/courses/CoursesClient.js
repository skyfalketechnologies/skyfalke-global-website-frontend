'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Courses = dynamic(() => import('@/pageComponents/Courses'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CoursesClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Courses />
    </Suspense>
  );
}

