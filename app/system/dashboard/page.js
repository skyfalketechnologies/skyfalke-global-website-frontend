import AdminDashboard from '@/pageComponents/Admin/Dashboard';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Admin Dashboard',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}


