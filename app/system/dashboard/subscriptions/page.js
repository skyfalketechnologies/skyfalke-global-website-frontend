import AdminSubscriptions from '@/pageComponents/Admin/Subscriptions';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Subscriptions',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminSubscriptionsPage() {
  return <AdminSubscriptions />;
}

