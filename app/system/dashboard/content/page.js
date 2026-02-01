import AdminContent from '@/pageComponents/Admin/Content';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Content Management',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminContentPage() {
  return <AdminContent />;
}

