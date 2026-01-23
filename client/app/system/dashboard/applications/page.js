import AdminApplications from '@/pageComponents/Admin/Applications';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Applications',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminApplicationsPage() {
  return <AdminApplications />;
}

