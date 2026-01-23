'use client';

import { Suspense } from 'react';
import Shop from '@/pageComponents/Shop';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ShopClient() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Shop />
    </Suspense>
  );
}

