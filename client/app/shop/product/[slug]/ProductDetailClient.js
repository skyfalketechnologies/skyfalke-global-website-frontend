'use client';

import { Suspense } from 'react';
import ProductDetail from '@/pageComponents/ProductDetail';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductDetailClient({ slug }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductDetail slug={slug} />
    </Suspense>
  );
}

