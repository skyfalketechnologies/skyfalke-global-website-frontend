import Expenses from '@/pageComponents/Admin/Expenses';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Expenses',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function ExpensesPage() {
  return <Expenses />;
}

