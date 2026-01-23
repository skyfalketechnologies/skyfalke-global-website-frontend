import AdminPartnerships from '@/pageComponents/Admin/Partnerships';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Partnerships',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminPartnershipsPage() {
  return <AdminPartnerships />;
}

