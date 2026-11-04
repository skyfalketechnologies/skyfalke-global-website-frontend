'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const CourseDetail = dynamic(() => import('@/pageComponents/CourseDetail'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CourseDetailClient({ slug }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CourseDetail slug={slug} />
    </Suspense>
  );
}

