import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import BlogClient from './BlogClient';

export const metadata = pageMetadata.blog;

export default function BlogPage() {
  return (
    <PageLayout>
      <BlogClient />
    </PageLayout>
  );
}

