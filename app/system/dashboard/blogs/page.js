import AdminBlogs from '@/pageComponents/Admin/Blogs';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Blogs',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminBlogsPage() {
  return <AdminBlogs />;
}

