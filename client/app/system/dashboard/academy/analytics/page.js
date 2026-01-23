import AcademyAnalytics from '@/pageComponents/Admin/AcademyAnalytics';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Academy Analytics',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AcademyAnalyticsPage() {
  return <AcademyAnalytics />;
}

