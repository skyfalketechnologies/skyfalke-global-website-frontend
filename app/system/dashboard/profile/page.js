import Profile from '@/pageComponents/Admin/Profile';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Profile',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function ProfilePage() {
  return <Profile />;
}

