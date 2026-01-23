import BlogFormPage from '@/pageComponents/Admin/BlogFormPage';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Blog Post',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewBlogPage() {
  return <BlogFormPage />;
}

