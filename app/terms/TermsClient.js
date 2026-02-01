'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Terms = dynamic(() => import('@/pageComponents/Terms'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function TermsClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Terms />
    </Suspense>
  );
}

