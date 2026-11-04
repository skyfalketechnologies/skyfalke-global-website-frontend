'use client';

import BlogPost from '@/pageComponents/BlogPost';

export default function BlogPostClient({ slug, initialServerData }) {
  return <BlogPost slug={slug} initialServerData={initialServerData} />;
}

