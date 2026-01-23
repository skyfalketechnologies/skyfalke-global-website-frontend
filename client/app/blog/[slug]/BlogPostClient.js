'use client';

import { Suspense } from 'react';
import BlogPost from '@/pageComponents/BlogPost';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function BlogPostClient({ slug }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogPost slug={slug} />
    </Suspense>
  );
}

