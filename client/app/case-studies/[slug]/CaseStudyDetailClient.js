'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const CaseStudyDetail = dynamic(() => import('@/pageComponents/CaseStudyDetail'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CaseStudyDetailClient({ slug }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CaseStudyDetail slug={slug} />
    </Suspense>
  );
}

