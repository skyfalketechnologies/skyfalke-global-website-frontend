import ExpenseForm from '@/pageComponents/Admin/ExpenseForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Expense',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewExpensePage() {
  return <ExpenseForm />;
}

