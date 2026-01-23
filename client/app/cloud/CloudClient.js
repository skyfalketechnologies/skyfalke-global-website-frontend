'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Cloud = dynamic(() => import('@/pageComponents/Cloud'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CloudClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Cloud />
    </Suspense>
  );
}

