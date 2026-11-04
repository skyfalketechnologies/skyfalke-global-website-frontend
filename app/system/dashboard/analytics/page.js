import AdminAnalytics from '@/pageComponents/Admin/Analytics';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Analytics',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminAnalyticsPage() {
  return <AdminAnalytics />;
}

