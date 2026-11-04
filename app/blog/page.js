import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import BlogClient from './BlogClient';
import ServerPageIntro from '@/components/marketing/ServerPageIntro';
import { BLOG_PAGE_INTRO } from '@/data/serverPageIntros';
import { getBlogList } from '@/utils/serverApi';

export const metadata = pageMetadata.blog;

export default async function BlogPage() {
  const initialData = await getBlogList({ page: 1, limit: 6 });

  return (
    <PageLayout>
      <BlogClient initialData={initialData} />
      <ServerPageIntro {...BLOG_PAGE_INTRO} />
    </PageLayout>
  );
}

