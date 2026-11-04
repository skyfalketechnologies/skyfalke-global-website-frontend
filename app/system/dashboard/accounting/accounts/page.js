import Accounts from '@/pageComponents/Admin/Accounts';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Accounts',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountsPage() {
  return <Accounts />;
}

