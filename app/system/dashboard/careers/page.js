import CareersDashboard from '@/pageComponents/Admin/CareersDashboard';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Careers',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function CareersDashboardPage() {
  return <CareersDashboard />;
}

