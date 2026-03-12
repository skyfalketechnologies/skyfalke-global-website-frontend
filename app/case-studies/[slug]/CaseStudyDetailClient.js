'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const CaseStudyDetail = dynamic(() => import('@/pageComponents/CaseStudyDetail'), {
  loading: () => <LoadingSpinner />,
  // Allow server-side rendering so crawlers receive full HTML content
  ssr: true,
});

export default function CaseStudyDetailClient({ slug, initialServerData }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CaseStudyDetail slug={slug} initialServerData={initialServerData} />
    </Suspense>
  );
}

