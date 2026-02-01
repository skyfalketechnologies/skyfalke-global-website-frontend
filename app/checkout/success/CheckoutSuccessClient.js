'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const CheckoutSuccess = dynamic(() => import('@/pageComponents/CheckoutSuccess'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CheckoutSuccessClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutSuccess />
    </Suspense>
  );
}

