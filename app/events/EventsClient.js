'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Events = dynamic(() => import('@/pageComponents/Events'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function EventsClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Events />
    </Suspense>
  );
}

