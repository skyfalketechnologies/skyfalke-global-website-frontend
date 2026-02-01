'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const JobDetail = dynamic(() => import('@/pageComponents/JobDetail'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function JobDetailClient({ id }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JobDetail id={id} />
    </Suspense>
  );
}

