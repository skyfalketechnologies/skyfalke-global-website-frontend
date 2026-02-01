'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Careers = dynamic(() => import('@/pageComponents/Careers'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CareersClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Careers />
    </Suspense>
  );
}

