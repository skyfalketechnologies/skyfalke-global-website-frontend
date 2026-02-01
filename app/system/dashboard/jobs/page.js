import AdminJobs from '@/pageComponents/Admin/Jobs';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Jobs',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminJobsPage() {
  return <AdminJobs />;
}

