'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Resources = dynamic(() => import('@/pageComponents/Resources'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function ResourcesClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Resources />
    </Suspense>
  );
}

