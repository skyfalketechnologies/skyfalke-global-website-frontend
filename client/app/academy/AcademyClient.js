'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Academy = dynamic(() => import('@/pageComponents/Academy'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function AcademyClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Academy />
    </Suspense>
  );
}

