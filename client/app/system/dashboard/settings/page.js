import Settings from '@/pageComponents/Admin/Settings';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Settings',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function SettingsPage() {
  return <Settings />;
}

