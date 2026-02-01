import HRDashboard from '@/pageComponents/Admin/HRDashboard';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'HR Dashboard',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function HRDashboardPage() {
  return <HRDashboard />;
}

