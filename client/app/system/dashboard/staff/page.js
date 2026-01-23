import StaffManagement from '@/pageComponents/Admin/StaffManagement';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Staff Management',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function StaffManagementPage() {
  return <StaffManagement />;
}

