'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner';

const Checkout = dynamic(() => import('@/pageComponents/Checkout'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CheckoutClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Checkout />
    </Suspense>
  );
}

