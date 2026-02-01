import AccountForm from '@/pageComponents/Admin/AccountForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Account',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewAccountPage() {
  return <AccountForm />;
}

