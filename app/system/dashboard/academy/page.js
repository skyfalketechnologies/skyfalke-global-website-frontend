import AcademyDashboard from '@/pageComponents/Admin/AcademyDashboard';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Academy Dashboard',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AcademyDashboardPage() {
  return <AcademyDashboard />;
}

