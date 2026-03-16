'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const JobDetail = dynamic(() => import('@/pageComponents/JobDetail'), {
  loading: () => <LoadingSpinner />,
  // Allow this component to be server-rendered so crawlers see full HTML
  ssr: true,
});

export default function JobDetailClient({ id, initialServerData }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JobDetail id={id} initialServerData={initialServerData} />
    </Suspense>
  );
}

