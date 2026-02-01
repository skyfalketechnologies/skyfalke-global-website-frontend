import AccountingDashboard from '@/pageComponents/Admin/AccountingDashboard';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Accounting Dashboard',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountingDashboardPage() {
  return <AccountingDashboard />;
}

