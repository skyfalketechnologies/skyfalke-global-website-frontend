import Transactions from '@/pageComponents/Admin/Transactions';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Transactions',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function TransactionsPage() {
  return <Transactions />;
}

