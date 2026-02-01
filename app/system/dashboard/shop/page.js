import ShopDashboard from '@/pageComponents/Admin/ShopDashboard';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Shop Dashboard',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function ShopDashboardPage() {
  return <ShopDashboard />;
}

