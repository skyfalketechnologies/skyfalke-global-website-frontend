'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Partners = dynamic(() => import('@/pageComponents/Partners'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function PartnersClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Partners />
    </Suspense>
  );
}

