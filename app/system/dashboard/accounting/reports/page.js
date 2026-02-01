import Reports from '@/pageComponents/Admin/Reports';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Reports',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function ReportsPage() {
  return <Reports />;
}

