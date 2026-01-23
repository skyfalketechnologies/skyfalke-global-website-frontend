'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Privacy = dynamic(() => import('@/pageComponents/Privacy'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function PrivacyClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Privacy />
    </Suspense>
  );
}

