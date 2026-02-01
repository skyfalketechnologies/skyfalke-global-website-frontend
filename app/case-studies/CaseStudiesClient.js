'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const CaseStudies = dynamic(() => import('@/pageComponents/CaseStudies'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CaseStudiesClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CaseStudies />
    </Suspense>
  );
}

