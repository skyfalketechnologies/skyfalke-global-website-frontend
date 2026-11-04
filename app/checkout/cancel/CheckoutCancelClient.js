'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const CheckoutCancel = dynamic(() => import('@/pageComponents/CheckoutCancel'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CheckoutCancelClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutCancel />
    </Suspense>
  );
}

