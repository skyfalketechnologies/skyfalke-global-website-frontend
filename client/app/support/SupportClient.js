'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Support = dynamic(() => import('@/pageComponents/Support'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function SupportClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Support />
    </Suspense>
  );
}

