import Orders from '@/pageComponents/Admin/Orders';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Orders',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function OrdersPage() {
  return <Orders />;
}

