import TransactionForm from '@/pageComponents/Admin/TransactionForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Transaction',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewTransactionPage() {
  return <TransactionForm />;
}

